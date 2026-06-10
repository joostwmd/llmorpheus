#!/usr/bin/env python3
"""RQ4 statistical correlations."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
from scipy import stats
import numpy as np

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq2_detail, load_rq4_summary, load_rq4_tier_paired_deltas  # noqa: E402
from plot_style import OUTPUT_STATS, ensure_output_dirs  # noqa: E402


def tier_wilcoxon_tests(deltas: pd.DataFrame) -> pd.DataFrame:
    rows = []
    metrics = [
        ("deltaCostPerUnique", "cost_per_unique"),
        ("deltaCostPerNonEquivSurvivor", "cost_per_non_equiv"),
        ("deltaNonEquivSurvivors", "non_equiv_survivors"),
    ]
    for provider in sorted(deltas["provider"].unique()):
        sub = deltas[deltas["provider"] == provider]
        for col, label in metrics:
            vals = sub[col].dropna().to_numpy()
            if len(vals) >= 1:
                stat, p = stats.wilcoxon(vals, alternative="two-sided", zero_method="wilcox")
            else:
                stat, p = float("nan"), float("nan")
            rows.append(
                {
                    "provider": provider,
                    "metric": label,
                    "n_pairs": len(vals),
                    "median_delta": float(np.median(vals)) if len(vals) else np.nan,
                    "wilcoxon_stat": stat,
                    "p_value": p,
                }
            )
    return pd.DataFrame(rows)


def main() -> None:
    ensure_output_dirs()
    summary = load_rq4_summary()
    rq2 = load_rq2_detail().groupby("model", as_index=False)["meanJaccardOverlap"].median()
    merged = summary.merge(rq2, on="model", how="left")

    rows = []
    for x, y, label in [
        ("medianCostPerNonEquiv", "medianMutationScore", "cost_vs_mutation_score"),
        ("medianCostPerNonEquiv", "meanJaccardOverlap", "cost_vs_jaccard"),
    ]:
        sub = merged[[x, y]].dropna()
        if len(sub) >= 3:
            rho, p = stats.spearmanr(sub[x], sub[y])
        else:
            rho, p = float("nan"), float("nan")
        rows.append({"comparison": label, "spearman_rho": rho, "p_value": p, "n": len(sub)})

    out = OUTPUT_STATS / "rq4_correlations.csv"
    pd.DataFrame(rows).to_csv(out, index=False)
    print(f"Wrote {out}", flush=True)

    deltas = load_rq4_tier_paired_deltas()
    paired_out = OUTPUT_STATS / "tier_paired_deltas.csv"
    deltas.to_csv(paired_out, index=False)
    print(f"Wrote {paired_out}", flush=True)

    wilcoxon_out = OUTPUT_STATS / "tier_wilcoxon.csv"
    tier_wilcoxon_tests(deltas).to_csv(wilcoxon_out, index=False)
    print(f"Wrote {wilcoxon_out}", flush=True)


if __name__ == "__main__":
    main()
