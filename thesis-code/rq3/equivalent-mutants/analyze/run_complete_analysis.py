#!/usr/bin/env python3
"""Run the complete LLM equivalent-mutant analysis pipeline."""

from __future__ import annotations

import argparse
import logging
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

EM_ROOT = Path(__file__).resolve().parents[1]
ANALYZE_ROOT = Path(__file__).resolve().parent
CLASSIFY_ROOT = EM_ROOT / "classify"
sys.path.insert(0, str(EM_ROOT))

from lib.config import load_config, resolve_paths, resolve_source_dir


def run_step(name: str, cmd: list[str], *, cwd: Path) -> None:
    logging.info("Starting step: %s", name)
    logging.info("Command: %s", " ".join(cmd))
    subprocess.run(cmd, cwd=cwd, check=True)
    logging.info("Completed step: %s", name)


def main() -> None:
    parser = argparse.ArgumentParser(description="Run complete equivalent-mutant analysis pipeline")
    parser.add_argument("--config", type=Path, default=None)
    parser.add_argument("--source", type=Path, default=None, help="Source organized/ directory")
    parser.add_argument("--threshold", type=float, default=None)
    parser.add_argument("--force", action="store_true", help="Recompute all intermediate outputs")
    parser.add_argument("--skip-classifier", action="store_true", help="Skip classifier step (use existing predictions)")
    parser.add_argument("--duplicate-runs", type=int, default=0, help="Duplicate run1 to runN before analysis (testing)")
    args = parser.parse_args()

    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    source_dir = resolve_source_dir(args.source, cfg)

    for directory in (
        paths["data_dir"],
        paths["results_dir"],
        paths["plots_dir"],
        paths["logs_dir"],
    ):
        directory.mkdir(parents=True, exist_ok=True)

    timestamp = datetime.now(timezone.utc).strftime("%Y%m%d-%H%M%SZ")
    log_path = paths["logs_dir"] / f"analysis_{timestamp}.log"
    logging.basicConfig(
        level=logging.INFO,
        format="%(asctime)s %(levelname)s %(message)s",
        handlers=[logging.FileHandler(log_path), logging.StreamHandler(sys.stdout)],
    )

    py = sys.executable
    config_arg = ["--config", str(args.config)] if args.config else []
    source_arg = ["--source", str(source_dir)]
    force_arg = ["--force"] if args.force else []

    if args.duplicate_runs > 0:
        run_step(
            "duplicate-runs",
            [
                py,
                "duplicate_runs_for_testing.py",
                *config_arg,
                *source_arg,
                "--target-runs",
                str(args.duplicate_runs),
                *force_arg,
            ],
            cwd=ANALYZE_ROOT,
        )

    run_step(
        "convert-mutants",
        [py, "convert_mutants.py", *config_arg, *source_arg, *force_arg],
        cwd=CLASSIFY_ROOT,
    )

    if not args.skip_classifier:
        classify_cmd = [py, "run_classifier.py", *config_arg, *source_arg, *force_arg]
        if args.threshold is not None:
            classify_cmd.extend(["--threshold", str(args.threshold)])
        run_step("run-classifier", classify_cmd, cwd=CLASSIFY_ROOT)

    run_step(
        "analyze-results",
        [py, "analyze_results.py", *config_arg, *source_arg],
        cwd=ANALYZE_ROOT,
    )
    run_step(
        "generate-tables",
        [py, "generate_tables.py", *config_arg],
        cwd=ANALYZE_ROOT,
    )
    run_step(
        "generate-plots",
        [py, "generate_plots.py", *config_arg],
        cwd=ANALYZE_ROOT,
    )

    logging.info("Pipeline complete. Outputs in %s", paths["plots_dir"])
    logging.info("Log file: %s", log_path)


if __name__ == "__main__":
    main()
