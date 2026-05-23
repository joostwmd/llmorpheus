#!/usr/bin/env python3
"""Aggregate classifier predictions into analysis datasets and summary statistics."""

from __future__ import annotations

import argparse
import json
import sys
from pathlib import Path

import numpy as np
import pandas as pd

EM_ROOT = Path(__file__).resolve().parents[1]
ANALYZE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(EM_ROOT))
sys.path.insert(0, str(ANALYZE_ROOT))

from lib.config import load_config, resolve_paths, resolve_source_dir
from lib.discovery import discover_datasets
from statistical_tests import (
    bootstrap_ci,
    compute_llm_summary,
    compute_package_summary,
    pairwise_llm_tests,
)


def load_prediction_file(path: Path) -> pd.DataFrame:
    if not path.is_file():
        raise FileNotFoundError(f"Missing predictions file: {path}")
    df = pd.read_csv(path)
    if "pred_eval" not in df.columns:
        raise ValueError(f"Missing pred_eval column in {path}")
    df["is_equivalent"] = df["pred_eval"].astype(str).str.upper() == "EQUIVALENT"
    return df


def aggregate_predictions(
    *,
    source_dir: Path,
    results_dir: Path,
    packages: list[str] | None,
    skip_dirs: list[str] | None,
) -> pd.DataFrame:
    refs = discover_datasets(source_dir, packages=packages, skip_dirs=skip_dirs)
    rows: list[dict[str, object]] = []
    for ref in refs:
        pred_path = results_dir / ref.llm / ref.run / f"{ref.package}_predictions.csv"
        df = load_prediction_file(pred_path)
        total = len(df)
        predicted_equivalent = int(df["is_equivalent"].sum())
        equiv_rate = (predicted_equivalent / total * 100.0) if total else 0.0
        rows.append(
            {
                "llm": ref.llm,
                "package": ref.package,
                "run": ref.run,
                "run_number": ref.run_number,
                "total_surviving": total,
                "predicted_equivalent": predicted_equivalent,
                "predicted_behavioral": total - predicted_equivalent,
                "equiv_rate_pct": round(equiv_rate, 4),
            }
        )
    return pd.DataFrame(rows)


def enrich_with_confidence_intervals(df: pd.DataFrame) -> pd.DataFrame:
    ci_low: list[float] = []
    ci_high: list[float] = []
    for _, row in df.iterrows():
        low, high = bootstrap_ci(
            int(row["predicted_equivalent"]),
            int(row["total_surviving"]),
        )
        ci_low.append(round(low, 4))
        ci_high.append(round(high, 4))
    out = df.copy()
    out["ci_low_pct"] = ci_low
    out["ci_high_pct"] = ci_high
    out["confidence_interval"] = [
        f"({low:.1f}%, {high:.1f}%)" for low, high in zip(ci_low, ci_high, strict=True)
    ]
    return out


def main() -> None:
    parser = argparse.ArgumentParser(description="Aggregate classifier prediction results")
    parser.add_argument("--config", type=Path, default=None)
    parser.add_argument("--source", type=Path, default=None)
    parser.add_argument("--results-dir", type=Path, default=None)
    parser.add_argument("--output-dir", type=Path, default=None)
    args = parser.parse_args()

    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    source_dir = resolve_source_dir(args.source, cfg)
    results_dir = args.results_dir or paths["results_dir"]
    output_dir = args.output_dir or paths["plots_dir"]
    output_dir.mkdir(parents=True, exist_ok=True)

    per_dataset = aggregate_predictions(
        source_dir=source_dir,
        results_dir=results_dir,
        packages=cfg.get("packages"),
        skip_dirs=cfg.get("skip_dirs"),
    )
    per_dataset = enrich_with_confidence_intervals(per_dataset)

    llm_summary = compute_llm_summary(per_dataset)
    package_summary = compute_package_summary(per_dataset)
    pairwise = pairwise_llm_tests(per_dataset)

    per_dataset.to_csv(output_dir / "aggregated_results.csv", index=False)
    llm_summary.to_csv(output_dir / "llm_summary.csv", index=False)
    package_summary.to_csv(output_dir / "package_summary.csv", index=False)
    pairwise.to_csv(output_dir / "pairwise_llm_tests.csv", index=False)

    summary = {
        "datasets": int(len(per_dataset)),
        "llms": sorted(per_dataset["llm"].unique().tolist()),
        "packages": sorted(per_dataset["package"].unique().tolist()),
        "runs_per_llm": per_dataset.groupby("llm")["run"].nunique().to_dict(),
        "overall_equiv_rate_pct": round(
            per_dataset["predicted_equivalent"].sum() / per_dataset["total_surviving"].sum() * 100.0,
            4,
        ),
        "llm_ranking": llm_summary.sort_values("mean_equiv_rate_pct")["llm"].tolist(),
    }
    (output_dir / "statistical_summary.json").write_text(
        json.dumps(summary, indent=2),
        encoding="utf-8",
    )

    print(f"Wrote aggregated results to {output_dir}", flush=True)
    print(json.dumps(summary, indent=2), flush=True)


if __name__ == "__main__":
    main()
