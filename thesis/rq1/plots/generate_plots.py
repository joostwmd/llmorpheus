#!/usr/bin/env python3
"""Generate RQ1 publication figures."""

from __future__ import annotations

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns
from scipy.spatial import ConvexHull

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq1_merged  # noqa: E402
from plot_style import BASELINE_LLMORPHEUS, BASELINE_STRYKERJS, save_fig, setup  # noqa: E402


def model_order(df: pd.DataFrame) -> list[str]:
    med = df.groupby("displayName")["mutationScore"].median().sort_values()
    return list(med.index)


def plot_mutation_score_box(df: pd.DataFrame) -> None:
    order = model_order(df)
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.boxplot(
        data=df,
        x="displayName",
        y="mutationScore",
        order=order,
        ax=ax,
        color="#6baed6",
        fliersize=0,
    )
    sns.stripplot(
        data=df,
        x="displayName",
        y="mutationScore",
        order=order,
        ax=ax,
        color="#08306b",
        alpha=0.45,
        size=3,
        jitter=0.15,
    )
    ax.axhline(BASELINE_LLMORPHEUS, color="#e6550d", linestyle="--", linewidth=1, label="LLMorpheus baseline")
    ax.axhline(BASELINE_STRYKERJS, color="#31a354", linestyle="--", linewidth=1, label="StrykerJS baseline")
    ax.set_xlabel("Model")
    ax.set_ylabel("Mutation score (%)")
    ax.set_title("Distribution of mutation scores across packages and runs")
    ax.tick_params(axis="x", rotation=35)
    ax.legend(loc="lower right", fontsize=8)
    save_fig(fig, "mutation_score_box", prefix="rq1_")


def plot_validity_stack(df: pd.DataFrame) -> None:
    agg = df.groupby("displayName").agg(
        valid=("nrValid", "sum"),
        invalid=("nrInvalid", "sum"),
        identical=("nrIdentical", "sum"),
        duplicate=("nrDuplicate", "sum"),
    )
    totals = agg.sum(axis=1)
    pct = agg.div(totals, axis=0) * 100
    pct = pct.loc[model_order(df)]
    fig, ax = plt.subplots(figsize=(9, 5))
    left = np.zeros(len(pct))
    colors = ["#31a354", "#e6550d", "#756bb1", "#969696"]
    labels = ["Valid", "Invalid", "Identical", "Duplicate"]
    for col, color, label in zip(pct.columns, colors, labels):
        values = pct[col].to_numpy()
        ax.barh(pct.index, values, left=left, color=color, label=label)
        for i, (val, lft) in enumerate(zip(values, left)):
            if val >= 4:
                ax.text(lft + val / 2, i, f"{val:.0f}%", ha="center", va="center", fontsize=7)
        left += values
    ax.set_xlabel("Share of candidate mutants (%)")
    ax.set_title("Candidate composition by model")
    ax.legend(loc="lower right", fontsize=8)
    save_fig(fig, "validity_stack", prefix="rq1_")


def plot_edit_distance_ridge(df: pd.DataFrame) -> None:
    order = model_order(df)
    plot_df = df.dropna(subset=["medianAbsLevenshtein"]).copy()
    g = sns.FacetGrid(
        plot_df,
        row="displayName",
        row_order=order,
        height=1.1,
        aspect=4,
        sharex=True,
        sharey=False,
    )
    g.map_dataframe(sns.kdeplot, x="medianAbsLevenshtein", fill=True, alpha=0.6, color="#6baed6")
    g.set_titles(row_template="{row_name}")
    g.set_xlabels("Absolute Levenshtein distance")
    g.fig.subplots_adjust(top=0.95)
    g.fig.suptitle("Distribution of absolute Levenshtein edit distance by model")
    save_fig(g.fig, "edit_distance_ridge", prefix="rq1_")


def plot_score_vs_survivors(df: pd.DataFrame) -> None:
    summary = (
        df.groupby(["model", "displayName"], as_index=False)
        .agg(mutationScore=("mutationScore", "median"), nrSurvived=("nrSurvived", "median"))
    )
    fig, ax = plt.subplots(figsize=(8, 6))
    for i, row in summary.iterrows():
        ax.scatter(row["nrSurvived"], row["mutationScore"], s=70, color=plt.cm.tab10(i % 10))
        ax.annotate(row["displayName"], (row["nrSurvived"], row["mutationScore"]), fontsize=8, xytext=(4, 4), textcoords="offset points")
    points = summary[["nrSurvived", "mutationScore"]].to_numpy()
    if len(points) >= 3:
        hull = ConvexHull(points)
        hull_pts = points[hull.vertices]
        hull_pts = hull_pts[np.argsort(hull_pts[:, 0])]
        ax.plot(hull_pts[:, 0], hull_pts[:, 1], "--", color="#969696", linewidth=1, label="Convex hull")
    ax.set_xlabel("Median survivors")
    ax.set_ylabel("Median mutation score (%)")
    ax.set_title("Mutation score vs survivor count")
    ax.legend(fontsize=8)
    save_fig(fig, "score_vs_survivors", prefix="rq1_")


def plot_per_package_heatmap(df: pd.DataFrame) -> None:
    pivot = df.pivot_table(index="displayName", columns="package", values="mutationScore", aggfunc="median")
    pivot = pivot.loc[model_order(df)]
    fig, ax = plt.subplots(figsize=(10, 5))
    sns.heatmap(pivot, annot=True, fmt=".1f", cmap="RdYlBu_r", ax=ax, cbar_kws={"label": "Mutation score (%)"})
    ax.set_title("Median mutation score by model and package")
    ax.set_xlabel("Package")
    ax.set_ylabel("Model")
    save_fig(fig, "per_package_heatmap", prefix="rq1_")


def plot_tokens_per_valid(df: pd.DataFrame) -> None:
    agg = df.groupby("displayName", as_index=False).agg(
        tokens=("totalPromptTokens", "sum"),
        completion=("totalCompletionTokens", "sum"),
        valid=("nrValid", "sum"),
    )
    agg["tokensPerValid"] = (agg["tokens"] + agg["completion"]) / agg["valid"].replace(0, np.nan)
    agg = agg.dropna(subset=["tokensPerValid"]).sort_values("tokensPerValid")
    fig, ax = plt.subplots(figsize=(8, 5))
    ax.barh(agg["displayName"], agg["tokensPerValid"], color="#6baed6")
    ax.set_xscale("log")
    ax.set_xlabel("Tokens per valid mutant (log scale)")
    ax.set_title("Token efficiency by model")
    save_fig(fig, "tokens_per_valid", prefix="rq1_")


def main() -> None:
    setup()
    df = load_rq1_merged()
    plot_mutation_score_box(df)
    plot_validity_stack(df)
    plot_edit_distance_ridge(df)
    plot_score_vs_survivors(df)
    plot_per_package_heatmap(df)
    plot_tokens_per_valid(df)
    print("RQ1 plots written to thesis-code/output/figures/", flush=True)


if __name__ == "__main__":
    main()
