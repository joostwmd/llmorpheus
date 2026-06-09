#!/usr/bin/env python3
"""Generate RQ4 publication figures."""

from __future__ import annotations

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import display_name, load_rq2_detail, load_rq4_costs, load_rq4_summary  # noqa: E402
from plot_style import save_fig, setup  # noqa: E402
from stats_helpers import bootstrap_median_ci  # noqa: E402


def pareto_efficient(summary: pd.DataFrame) -> pd.Series:
    """Minimize cost, maximize mutation score."""
    ordered = summary.sort_values(["medianCostPerNonEquiv", "medianMutationScore"], ascending=[True, False])
    best_score = -np.inf
    flags = []
    for _, row in ordered.iterrows():
        if row["medianMutationScore"] > best_score:
            flags.append(True)
            best_score = row["medianMutationScore"]
        else:
            flags.append(False)
    return pd.Series(flags, index=ordered.index)


def plot_cost_per_nonequiv_bar(costs: pd.DataFrame) -> None:
    summary = (
        costs.groupby("model", as_index=False)
        .agg(
            displayName=("displayName", "first"),
            medianCost=("costPerNonEquivSurvivor", "median"),
        )
        .dropna(subset=["medianCost"])
        .sort_values("medianCost")
    )
    ci_lo, ci_hi = [], []
    for model in summary["model"]:
        vals = costs.loc[costs["model"] == model, "costPerNonEquivSurvivor"].dropna().to_numpy()
        lo, hi = bootstrap_median_ci(vals)
        ci_lo.append(lo)
        ci_hi.append(hi)
    summary["ci_lo"] = ci_lo
    summary["ci_hi"] = ci_hi
    fig, ax = plt.subplots(figsize=(8, 5))
    y = np.arange(len(summary))
    ax.barh(y, summary["medianCost"], color="#6baed6", xerr=[summary["medianCost"] - summary["ci_lo"], summary["ci_hi"] - summary["medianCost"]])
    ax.set_yticks(y)
    ax.set_yticklabels(summary["displayName"])
    ax.set_xscale("log")
    ax.set_xlabel("Cost per non-equivalent survivor (USD, log scale)")
    ax.set_title("Cost efficiency by model")
    save_fig(fig, "cost_per_nonequiv_bar", prefix="rq4_")


def plot_pareto_frontier(summary: pd.DataFrame) -> None:
    summary = summary.copy()
    summary["displayName"] = summary["model"].map(display_name)
    summary["pareto"] = pareto_efficient(summary)
    fig, ax = plt.subplots(figsize=(8, 6))
    pareto_pts = summary[summary["pareto"]].sort_values("medianCostPerNonEquiv")
    ax.scatter(
        summary.loc[~summary["pareto"], "medianCostPerNonEquiv"],
        summary.loc[~summary["pareto"], "medianMutationScore"],
        facecolors="none",
        edgecolors="#969696",
        s=80,
        label="Dominated",
    )
    ax.scatter(
        summary.loc[summary["pareto"], "medianCostPerNonEquiv"],
        summary.loc[summary["pareto"], "medianMutationScore"],
        color="#3182bd",
        s=90,
        label="Pareto efficient",
    )
    if len(pareto_pts) >= 2:
        ax.plot(pareto_pts["medianCostPerNonEquiv"], pareto_pts["medianMutationScore"], "--", color="#3182bd", linewidth=1)
    for _, row in summary.iterrows():
        ax.annotate(
            row["displayName"],
            (row["medianCostPerNonEquiv"], row["medianMutationScore"]),
            fontsize=8,
            xytext=(4, 4),
            textcoords="offset points",
        )
    ax.set_xlabel("Median cost per non-equivalent survivor (USD)")
    ax.set_ylabel("Median mutation score (%)")
    ax.set_title("Pareto frontier: cost vs mutation score")
    ax.legend(fontsize=8)
    save_fig(fig, "pareto_frontier", prefix="rq4_")


def plot_cost_composition(costs: pd.DataFrame) -> None:
    agg = (
        costs.groupby("model", as_index=False)
        .agg(inputCostUsd=("inputCostUsd", "sum"), outputCostUsd=("outputCostUsd", "sum"))
        .fillna(0)
    )
    agg["displayName"] = agg["model"].map(display_name)
    agg = agg.sort_values("inputCostUsd", ascending=True)
    fig, ax = plt.subplots(figsize=(9, 5))
    ax.barh(agg["displayName"], agg["inputCostUsd"], color="#6baed6", label="Input tokens")
    ax.barh(agg["displayName"], agg["outputCostUsd"], left=agg["inputCostUsd"], color="#fd8d3c", label="Output tokens")
    ax.set_xlabel("Total API cost (USD)")
    ax.set_title("Cost composition by token type")
    ax.legend(fontsize=8)
    save_fig(fig, "cost_composition", prefix="rq4_")


def plot_cost_vs_jaccard(summary: pd.DataFrame, rq2_detail: pd.DataFrame) -> None:
    jacc = rq2_detail.groupby("model", as_index=False)["meanJaccardOverlap"].median()
    merged = summary.merge(jacc, on="model", how="left")
    merged["displayName"] = merged["model"].map(display_name)
    fig, ax = plt.subplots(figsize=(8, 6))
    for _, row in merged.iterrows():
        ax.scatter(row["medianCostPerNonEquiv"], row["meanJaccardOverlap"], s=70)
        ax.annotate(
            row["displayName"],
            (row["medianCostPerNonEquiv"], row["meanJaccardOverlap"]),
            fontsize=8,
            xytext=(4, 4),
            textcoords="offset points",
        )
    ax.set_xlabel("Median cost per non-equivalent survivor (USD)")
    ax.set_ylabel("Mean Jaccard overlap")
    ax.set_title("Cost vs cross-run consistency")
    save_fig(fig, "cost_vs_jaccard", prefix="rq4_")


def main() -> None:
    setup()
    costs = load_rq4_costs()
    summary = load_rq4_summary()
    rq2 = load_rq2_detail()
    plot_cost_per_nonequiv_bar(costs)
    plot_pareto_frontier(summary)
    plot_cost_composition(costs)
    plot_cost_vs_jaccard(summary, rq2)
    print("RQ4 plots written to thesis-code/output/figures/", flush=True)


if __name__ == "__main__":
    main()
