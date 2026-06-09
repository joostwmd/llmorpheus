#!/usr/bin/env python3
"""Rebuild llm_summary.csv from filtered aggregated_results.csv."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd

ANALYZE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(ANALYZE_ROOT))

from statistical_tests import compute_llm_summary, compute_package_summary, pairwise_llm_tests


def main() -> None:
    parser = argparse.ArgumentParser(description="Rebuild summary CSVs after registry filtering")
    parser.add_argument("--input", type=Path, required=True, help="aggregated_results.csv path")
    parser.add_argument("--output-dir", type=Path, required=True, help="analyze/output directory")
    args = parser.parse_args()

    per_dataset = pd.read_csv(args.input)
    llm_summary = compute_llm_summary(per_dataset)
    package_summary = compute_package_summary(per_dataset)
    pairwise = pairwise_llm_tests(per_dataset)

    out = args.output_dir
    llm_summary.to_csv(out / "llm_summary.csv", index=False)
    package_summary.to_csv(out / "package_summary.csv", index=False)
    pairwise.to_csv(out / "pairwise_llm_tests.csv", index=False)
    print(f"Rebuilt llm_summary ({len(llm_summary)} models) in {out}", flush=True)


if __name__ == "__main__":
    main()
