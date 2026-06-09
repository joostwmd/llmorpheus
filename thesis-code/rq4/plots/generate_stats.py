#!/usr/bin/env python3
"""RQ4 statistical correlations."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd
from scipy import stats

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq2_detail, load_rq4_summary  # noqa: E402
from plot_style import OUTPUT_STATS, ensure_output_dirs  # noqa: E402


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


if __name__ == "__main__":
    main()
