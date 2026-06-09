#!/usr/bin/env python3
"""Generate RQ5 publication figures."""

from __future__ import annotations

import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq5_merged, model_category  # noqa: E402
from plot_style import PALETTE_API, PALETTE_HYBRID, PALETTE_OPEN, category_color, save_fig, setup  # noqa: E402
from stats_helpers import bootstrap_median_ci, cliffs_delta  # noqa: E402


METRICS = [
    ("mutationScore", "Mutation score (%)"),
    ("equivRatePct", "Equivalent rate (%)"),
    ("costPerSurvivor", "Cost per survivor (USD)"),
    ("costPerNonEquivSurvivor", "Cost per non-equiv survivor (USD)"),
]


def plot_category_violins(merged: pd.DataFrame) -> None:
    fig, axes = plt.subplots(2, 2, figsize=(10, 8))
    for ax, (col, title) in zip(axes.flat, METRICS):
        plot_df = merged.dropna(subset=[col]).copy()
        order = ["open-weight", "api-only", "hybrid"]
        palette = {c: category_color(c) for c in order}
        sns.violinplot(data=plot_df, x="modelCategory", y=col, order=order, palette=palette, ax=ax, cut=0)
        ax.set_title(title, fontsize=10)
        ax.set_xlabel("")
    fig.suptitle("Metric distributions by model category", y=1.02)
    save_fig(fig, "category_violins", prefix="rq5_")


def plot_effect_size_forest(merged: pd.DataFrame) -> None:
    open_rows = merged[merged["modelCategory"] == "open-weight"]
    api_rows = merged[merged["modelCategory"] == "api-only"]
    rows = []
    rng = np.random.default_rng(42)
    for col, label in METRICS:
        a = open_rows[col].dropna().to_numpy()
        b = api_rows[col].dropna().to_numpy()
        delta = cliffs_delta(a, b)["delta"]
        boot = []
        for _ in range(2000):
            sa = rng.choice(a, size=len(a), replace=True) if len(a) else np.array([])
            sb = rng.choice(b, size=len(b), replace=True) if len(b) else np.array([])
            boot.append(cliffs_delta(sa, sb)["delta"] or 0.0)
        lo, hi = np.percentile(boot, [2.5, 97.5]) if boot else (np.nan, np.nan)
        rows.append({"metric": label, "delta": delta, "lo": lo, "hi": hi})
    forest = pd.DataFrame(rows)
    fig, ax = plt.subplots(figsize=(8, max(4, len(forest) * 0.6)))
    y = np.arange(len(forest))
    ax.errorbar(
        forest["delta"],
        y,
        xerr=[forest["delta"] - forest["lo"], forest["hi"] - forest["delta"]],
        fmt="o",
        color="#3182bd",
        capsize=4,
    )
    ax.axvline(0, color="#969696", linestyle="--", linewidth=1)
    ax.set_yticks(y)
    ax.set_yticklabels(forest["metric"])
    ax.set_xlabel("Cliff's delta (open-weight vs API-only)")
    ax.set_title("Effect sizes with 95% bootstrap CI")
    save_fig(fig, "effect_size_forest", prefix="rq5_")


def main() -> None:
    setup()
    merged = load_rq5_merged()
    plot_category_violins(merged)
    plot_effect_size_forest(merged)
    print("RQ5 plots written to thesis-code/output/figures/", flush=True)


if __name__ == "__main__":
    main()
