#!/usr/bin/env python3
"""Convert organized mutants.json files to classifier-compatible CSV (surviving mutants only)."""

from __future__ import annotations

import argparse
import csv
import json
import sys
from pathlib import Path

from tqdm import tqdm

EM_ROOT = Path(__file__).resolve().parents[1]
sys.path.insert(0, str(EM_ROOT))

from lib.config import load_config, resolve_paths, resolve_source_dir

from lib.discovery import discover_datasets
from lib.stryker_report import filter_surviving_mutants


def json_to_csv_rows(project: str, mutants: list[dict]) -> list[dict[str, object]]:
    rows: list[dict[str, object]] = []
    for idx, mutant in enumerate(mutants, start=1):
        rows.append(
            {
                "project": project,
                "file": mutant.get("file", ""),
                "id": idx,
                "line": mutant.get("startLine", mutant.get("line", "")),
                "column": mutant.get("startColumn", mutant.get("column", "")),
                "original": mutant.get("originalCode", mutant.get("original", "")),
                "replacement": mutant.get("replacement", mutant.get("mutantCode", "")),
                "promptId": mutant.get("promptId", ""),
                "completionId": mutant.get("completionId", ""),
                "reason": mutant.get("reason", ""),
            }
        )
    return rows


def write_csv(rows: list[dict[str, object]], out_path: Path) -> None:
    out_path.parent.mkdir(parents=True, exist_ok=True)
    if not rows:
        out_path.write_text("", encoding="utf-8")
        return
    fieldnames = list(rows[0].keys())
    with out_path.open("w", encoding="utf-8", newline="") as fh:
        writer = csv.DictWriter(fh, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)


def convert_one(
    mutants_json: Path,
    mutation_html: Path,
    project: str,
    out_csv: Path,
    *,
    force: bool,
) -> tuple[int, int]:
    if out_csv.is_file() and not force:
        return (0, 0)
    with mutants_json.open(encoding="utf-8") as fh:
        mutants = json.load(fh)
    if not isinstance(mutants, list):
        raise ValueError(f"Expected JSON array in {mutants_json}")

    total_before = len(mutants)
    surviving = filter_surviving_mutants(mutants, mutation_html)
    rows = json_to_csv_rows(project, surviving)
    write_csv(rows, out_csv)
    return (len(rows), total_before)


def batch_convert(
    *,
    source_dir: Path,
    data_dir: Path,
    packages: list[str] | None,
    skip_dirs: list[str] | None,
    force: bool,
) -> dict[str, int]:
    refs = discover_datasets(source_dir, packages=packages, skip_dirs=skip_dirs)
    stats = {"datasets": 0, "surviving_rows": 0, "total_before": 0, "skipped": 0}
    for ref in tqdm(refs, desc="Converting surviving mutants -> CSV"):
        out_csv = data_dir / ref.llm / ref.run / f"{ref.package}_mutants.csv"
        if out_csv.is_file() and not force:
            stats["skipped"] += 1
            continue
        if ref.mutation_html is None:
            raise FileNotFoundError(f"Missing mutation.html for {ref.key}")
        surviving, total_before = convert_one(
            ref.mutants_json,
            ref.mutation_html,
            ref.package,
            out_csv,
            force=force,
        )
        stats["datasets"] += 1
        stats["surviving_rows"] += surviving
        stats["total_before"] += total_before
    return stats


def main() -> None:
    parser = argparse.ArgumentParser(
        description="Convert surviving mutants from mutants.json + mutation.html to classifier CSV"
    )
    parser.add_argument("--config", type=Path, default=None, help="Path to config.yaml")
    parser.add_argument("--source", type=Path, default=None, help="Override source directory")
    parser.add_argument("--output", type=Path, default=None, help="Override data output directory")
    parser.add_argument("--force", action="store_true", help="Reconvert even if CSV exists")
    args = parser.parse_args()

    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    source_dir = resolve_source_dir(args.source, cfg)
    data_dir = args.output or paths["data_dir"]

    stats = batch_convert(
        source_dir=source_dir,
        data_dir=data_dir,
        packages=cfg.get("packages"),
        skip_dirs=cfg.get("skip_dirs"),
        force=args.force,
    )
    print(
        f"Converted {stats['datasets']} datasets "
        f"({stats['surviving_rows']} surviving mutants from {stats['total_before']} tested); "
        f"skipped {stats['skipped']} existing CSV files.",
        flush=True,
    )


if __name__ == "__main__":
    main()
