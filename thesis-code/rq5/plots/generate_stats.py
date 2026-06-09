#!/usr/bin/env python3
"""RQ5 category statistical tests."""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd
from scipy import stats

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq5_merged  # noqa: E402
from plot_style import OUTPUT_STATS, ensure_output_dirs  # noqa: E402
from stats_helpers import bootstrap_median_ci, cliffs_delta  # noqa: E402

METRICS = [
    ("mutationScore", "Mutation score"),
    ("nrSurvived", "Survivors"),
    ("equivRatePct", "Equivalent rate"),
    ("costPerSurvivor", "Cost per survivor"),
    ("costPerNonEquivSurvivor", "Cost per non-equiv survivor"),
]


def main() -> None:
    ensure_output_dirs()
    merged = load_rq5_merged()
    open_rows = merged[merged["modelCategory"] == "open-weight"]
    api_rows = merged[merged["modelCategory"] == "api-only"]
    rows = []
    for col, label in METRICS:
        a = open_rows[col].dropna().to_numpy()
        b = api_rows[col].dropna().to_numpy()
        u, p = stats.mannwhitneyu(a, b, alternative="two-sided") if len(a) and len(b) else (None, None)
        delta = cliffs_delta(a, b)
        lo, hi = bootstrap_median_ci([delta["delta"]] * 1) if delta["delta"] is not None else (np.nan, np.nan)
        rows.append(
            {
                "metric": col,
                "label": label,
                "median_open_weight": float(np.median(a)) if len(a) else np.nan,
                "median_api_only": float(np.median(b)) if len(b) else np.nan,
                "U": u,
                "p_value": p,
                "cliffs_delta": delta["delta"],
                "delta_magnitude": delta["magnitude"],
                "delta_ci_lo": lo,
                "delta_ci_hi": hi,
            }
        )
    out = OUTPUT_STATS / "rq5_category_tests.csv"
    pd.DataFrame(rows).to_csv(out, index=False)
    print(f"Wrote {out}", flush=True)


if __name__ == "__main__":
    main()
