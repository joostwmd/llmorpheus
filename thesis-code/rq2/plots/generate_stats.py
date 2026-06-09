#!/usr/bin/env python3
"""RQ2 statistical tests."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq1_merged, load_rq2_detail  # noqa: E402
from plot_style import OUTPUT_STATS, ensure_output_dirs  # noqa: E402
from stats_helpers import bootstrap_median_ci, pairwise_mann_whitney  # noqa: E402


def main() -> None:
    ensure_output_dirs()
    detail = load_rq2_detail()
    merged = load_rq1_merged()

    ci_rows = []
    for model, group in merged.groupby("model"):
        scores = group["mutationScore"].dropna().tolist()
        jacc = detail[detail["model"] == model]["meanJaccardOverlap"].dropna().tolist()
        s_lo, s_hi = bootstrap_median_ci(scores)
        j_lo, j_hi = bootstrap_median_ci(jacc)
        ci_rows.append(
            {
                "model": model,
                "mutationScore_median_lo": s_lo,
                "mutationScore_median_hi": s_hi,
                "jaccard_median_lo": j_lo,
                "jaccard_median_hi": j_hi,
            }
        )
    pd.DataFrame(ci_rows).to_csv(OUTPUT_STATS / "rq2_bootstrap_ci.csv", index=False)

    samples = {
        model: group["meanJaccardOverlap"].dropna().tolist()
        for model, group in detail.groupby("model")
    }
    pairwise = pairwise_mann_whitney(samples, "meanJaccardOverlap")
    pd.DataFrame(pairwise).to_csv(OUTPUT_STATS / "rq2_pairwise.csv", index=False)
    print(f"Wrote {OUTPUT_STATS / 'rq2_pairwise.csv'}", flush=True)


if __name__ == "__main__":
    main()
