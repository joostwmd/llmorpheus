#!/usr/bin/env python3
"""Generate RQ2 publication figures."""

from __future__ import annotations

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import (  # noqa: E402
    display_name,
    load_rq1_merged,
    load_rq2_detail,
    load_rq2_mutant_trial_counts,
    load_rq2_pairwise_jaccard,
    load_rq2_per_run,
)
from plot_style import save_fig, setup  # noqa: E402
from stats_helpers import bootstrap_median_ci  # noqa: E402


def jaccard_model_order(detail: pd.DataFrame) -> list[str]:
    med = detail.groupby("displayName")["meanJaccardOverlap"].median().sort_values()
    return list(med.index)


def plot_jaccard_box(detail: pd.DataFrame) -> None:
    order = jaccard_model_order(detail)
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.boxplot(data=detail, x="displayName", y="meanJaccardOverlap", order=order, ax=ax, color="#6baed6", fliersize=0)
    sns.stripplot(
        data=detail,
        x="displayName",
        y="meanJaccardOverlap",
        order=order,
        ax=ax,
        color="#08306b",
        alpha=0.45,
        size=3,
        jitter=0.15,
    )
    ax.set_xlabel("Model")
    ax.set_ylabel("Mean Jaccard overlap")
    ax.set_title("Cross-run mutant overlap by model")
    ax.tick_params(axis="x", rotation=35)
    save_fig(fig, "jaccard_box", prefix="rq2_")


def plot_cv_grouped_bar(summary: pd.DataFrame) -> None:
    long = summary.melt(
        id_vars=["displayName"],
        value_vars=["medianCvMutationScore", "medianCvSurvivors", "medianCvAbsLevenshtein"],
        var_name="metric",
        value_name="cv",
    )
    label_map = {
        "medianCvMutationScore": "Mutation score",
        "medianCvSurvivors": "Survivors",
        "medianCvAbsLevenshtein": "Edit distance",
    }
    long["metric"] = long["metric"].map(label_map)
    fig, ax = plt.subplots(figsize=(11, 5))
    sns.barplot(data=long, x="displayName", y="cv", hue="metric", ax=ax)
    ax.set_xlabel("Model")
    ax.set_ylabel("Coefficient of variation (%)")
    ax.set_title("Cross-run variability by metric")
    ax.tick_params(axis="x", rotation=35)
    ax.legend(title="", fontsize=8)
    save_fig(fig, "cv_grouped_bar", prefix="rq2_")


def plot_score_across_runs(per_run: pd.DataFrame) -> None:
    per_run = per_run.copy()
    per_run["displayName"] = per_run["model"].map(display_name)
    g = sns.relplot(
        data=per_run,
        x="run",
        y="mutationScore",
        hue="displayName",
        col="package",
        col_wrap=3,
        kind="line",
        marker="o",
        height=2.5,
        aspect=1.2,
        facet_kws={"sharey": False},
    )
    g.set_titles(col_template="{col_name}")
    g.fig.subplots_adjust(top=0.92)
    g.fig.suptitle("Mutation score across runs by package")
    save_fig(g.fig, "score_across_runs_line", prefix="rq2_")


def plot_within_model_jaccard_heatmap(pairwise: pd.DataFrame) -> None:
    models = sorted(pairwise["model"].unique())
    n = len(models)
    cols = min(3, n)
    rows = int(np.ceil(n / cols))
    fig, axes = plt.subplots(rows, cols, figsize=(4 * cols, 3.5 * rows), squeeze=False)
    for idx, model in enumerate(models):
        ax = axes[idx // cols][idx % cols]
        sub = pairwise[pairwise["model"] == model]
        runs = sorted(set(sub["run_a"]).union(sub["run_b"]))
        mat = pd.DataFrame(np.nan, index=runs, columns=runs)
        for _, row in sub.iterrows():
            mat.loc[row["run_a"], row["run_b"]] = row["jaccard"]
            mat.loc[row["run_b"], row["run_a"]] = row["jaccard"]
        for r in runs:
            mat.loc[r, r] = 1.0
        sns.heatmap(mat, annot=True, fmt=".2f", cmap="Blues", ax=ax, cbar=False, vmin=0, vmax=1)
        ax.set_title(display_name(model), fontsize=9)
    for idx in range(n, rows * cols):
        axes[idx // cols][idx % cols].axis("off")
    fig.suptitle("Pairwise Jaccard overlap between runs", y=1.02)
    save_fig(fig, "within_model_jaccard_heatmap", prefix="rq2_")


TRIAL_COLORS = {
    5: "#3182bd",
    4: "#31a354",
    3: "#fec44f",
    2: "#fd8d3c",
    1: "#e31a1c",
}


def plot_mutant_variability_stacked(trial_counts: pd.DataFrame) -> None:
    """Horizontal stacked bar chart: distinct mutants by trials observed (LLMorpheus Fig. 10 style)."""
    if trial_counts.empty:
        return

    totals = (
        trial_counts.groupby(["model", "displayName"], as_index=False)["totalDistinct"]
        .first()
        .sort_values("totalDistinct", ascending=True)
    )
    models = list(totals["model"])
    labels = [display_name(m) for m in models]
    n_runs = int(trial_counts["nRuns"].max())
    trial_levels = list(range(n_runs, 0, -1))

    fig_h = max(4.5, len(models) * 0.42)
    fig, ax = plt.subplots(figsize=(10, fig_h))
    y = np.arange(len(models))
    left = np.zeros(len(models), dtype=float)

    for trials in trial_levels:
        counts = []
        for model in models:
            row = trial_counts[
                (trial_counts["model"] == model) & (trial_counts["trialsObserved"] == trials)
            ]
            counts.append(float(row["count"].iloc[0]) if len(row) else 0.0)
        counts = np.array(counts)
        color = TRIAL_COLORS.get(trials, "#9e9e9e")
        ax.barh(y, counts, left=left, color=color, edgecolor="white", linewidth=0.3, label=f"{trials}")
        left += counts

    ax.set_yticks(y)
    ax.set_yticklabels(labels)
    ax.set_xlabel("Number of mutants")
    ax.set_title("Variability of mutants across runs")
    ax.legend(
        title="Trials observed",
        loc="lower right",
        frameon=True,
        fontsize=8,
        title_fontsize=8,
    )
    save_fig(fig, "mutant_variability_stacked", prefix="rq2_")


def plot_forest(per_run: pd.DataFrame) -> None:
    per_run = per_run.copy()
    per_run["displayName"] = per_run["model"].map(display_name)
    rows = []
    for model, group in per_run.groupby("model"):
        vals = group["mutationScore"].dropna().to_numpy()
        med = float(np.median(vals)) if len(vals) else np.nan
        lo, hi = bootstrap_median_ci(vals)
        rows.append({"displayName": display_name(model), "median": med, "lo": lo, "hi": hi})
    forest = pd.DataFrame(rows).sort_values("median")
    fig, ax = plt.subplots(figsize=(8, max(4, len(forest) * 0.45)))
    y = np.arange(len(forest))
    ax.errorbar(
        forest["median"],
        y,
        xerr=[forest["median"] - forest["lo"], forest["hi"] - forest["median"]],
        fmt="o",
        color="#3182bd",
        capsize=4,
    )
    ax.set_yticks(y)
    ax.set_yticklabels(forest["displayName"])
    ax.set_xlabel("Median mutation score (%)")
    ax.set_title("Mutation score with 95% bootstrap CI")
    save_fig(fig, "forest_plot", prefix="rq2_")


def main() -> None:
    setup()
    detail = load_rq2_detail()
    per_run = load_rq2_per_run()
    pairwise = load_rq2_pairwise_jaccard()
    trial_counts = load_rq2_mutant_trial_counts()
    plot_jaccard_box(detail)
    plot_cv_grouped_bar(pd.read_csv(Path(__file__).resolve().parents[1] / "output" / "thesis" / "model_consistency_summary.csv"))
    plot_score_across_runs(per_run)
    plot_within_model_jaccard_heatmap(pairwise)
    plot_mutant_variability_stacked(trial_counts)
    plot_forest(per_run)
    print("RQ2 plots written to thesis-code/output/figures/", flush=True)


if __name__ == "__main__":
    main()
