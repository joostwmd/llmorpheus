#!/usr/bin/env python3
"""Duplicate existing runs in organized/ to simulate multiple replications for testing."""

from __future__ import annotations

import argparse
import shutil
import sys
from pathlib import Path

EM_ROOT = Path(__file__).resolve().parents[1]
ANALYZE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(EM_ROOT))
sys.path.insert(0, str(ANALYZE_ROOT))

from lib.config import load_config, resolve_paths


def duplicate_runs(source_dir: Path, *, target_runs: int = 5, force: bool = False) -> int:
    created = 0
    for llm_dir in sorted(p for p in source_dir.iterdir() if p.is_dir()):
        existing = sorted(
            p.name for p in llm_dir.iterdir() if p.is_dir() and p.name.lower().startswith("run")
        )
        if not existing:
            continue
        source_run = llm_dir / existing[0]
        for run_num in range(1, target_runs + 1):
            dest = llm_dir / f"run{run_num}"
            if dest.exists() and not force:
                continue
            if dest.resolve() == source_run.resolve():
                continue
            if dest.exists() and force:
                shutil.rmtree(dest)
            shutil.copytree(source_run, dest)
            created += 1
    return created


def main() -> None:
    parser = argparse.ArgumentParser(description="Duplicate run1 into run2..runN for testing")
    parser.add_argument("--config", type=Path, default=None)
    parser.add_argument("--source", type=Path, default=None)
    parser.add_argument("--target-runs", type=int, default=5)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    source_dir = args.source or paths["source_dir"]
    created = duplicate_runs(source_dir, target_runs=args.target_runs, force=args.force)
    print(f"Created or refreshed {created} duplicated run directories under {source_dir}", flush=True)


if __name__ == "__main__":
    main()
