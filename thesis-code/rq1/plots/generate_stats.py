#!/usr/bin/env python3
"""RQ1 statistical tests."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from csv_loader import load_rq1_merged  # noqa: E402
from plot_style import OUTPUT_STATS, ensure_output_dirs  # noqa: E402
from stats_helpers import kruskal_wallis, pairwise_mann_whitney  # noqa: E402


METRICS = [
    ("mutationScore", "Mutation score"),
    ("nrSurvived", "Survivors"),
    ("medianAbsLevenshtein", "Abs. Levenshtein"),
]


def main() -> None:
    ensure_output_dirs()
    df = load_rq1_merged()
    all_rows = []

    for col, label in METRICS:
        samples = {
            model: group[col].dropna().tolist()
            for model, group in df.groupby("model")
        }
        kw = kruskal_wallis(samples)
        print(f"\nKruskal-Wallis ({label}): H={kw['H']}, p={kw['p']}, eta2={kw['eta2']}")
        all_rows.extend(pairwise_mann_whitney(samples, col))

    out = pd.DataFrame(all_rows)
    out_path = OUTPUT_STATS / "rq1_pairwise.csv"
    out.to_csv(out_path, index=False)
    print(f"\nWrote {out_path}", flush=True)


if __name__ == "__main__":
    main()
