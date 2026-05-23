#!/usr/bin/env python3
"""Run UniXCoder classifier on all converted mutant CSV files."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd
import torch
from tqdm import tqdm

CLASSIFY_ROOT = Path(__file__).resolve().parent
EM_ROOT = CLASSIFY_ROOT.parent
sys.path.insert(0, str(CLASSIFY_ROOT))
sys.path.insert(0, str(EM_ROOT))

from context import pair_text_for_model  # noqa: E402
from inference import (  # noqa: E402
    is_ensemble_run,
    load_ensemble_bundle,
    load_model_bundle,
    resolve_device,
    resolve_run_directory,
)
from predict import normalize_row, parse_window_cfg, predict_single, resolve_threshold  # noqa: E402
from lib.config import load_config, resolve_paths, resolve_source_dir  # noqa: E402
from lib.discovery import discover_datasets  # noqa: E402


def predictions_path(csv_path: Path) -> Path:
    return csv_path.parent / f"{csv_path.stem}.predictions.csv"


def load_bundle(model_path: Path, device: torch.device):
    run_dir = resolve_run_directory(model_path)
    ensemble = is_ensemble_run(run_dir)
    if ensemble:
        bundle = load_ensemble_bundle(run_dir, device=device)
        return bundle, bundle.tokenizer, bundle.config, True, run_dir
    model, tokenizer, config = load_model_bundle(run_dir, device=device)
    return model, tokenizer, config, False, run_dir


def classify_csv(
    csv_path: Path,
    out_path: Path,
    *,
    model_or_bundle,
    tokenizer,
    config: dict,
    ensemble: bool,
    run_dir: Path,
    threshold: float,
    device: torch.device,
    force: bool,
) -> bool:
    if out_path.is_file() and not force:
        return False
    if not csv_path.is_file():
        raise FileNotFoundError(f"Missing converted CSV: {csv_path}")

    input_format = config.get("input_format", "pair")
    window = parse_window_cfg(config["window"])
    max_len = int(config.get("max_length", 512))

    df = pd.read_csv(csv_path)
    results = []
    for i in tqdm(range(len(df)), desc=csv_path.name, leave=False):
        row = normalize_row(df.iloc[i].to_dict())
        if window not in (0, "0"):
            needed = {"project", "file", "line"}
            if not needed <= set(row.keys()):
                raise ValueError(
                    f"Row {i} in {csv_path}: window={window} requires columns {needed}"
                )
        text_a, text_b = pair_text_for_model(row, window, input_format)
        result = predict_single(
            model_or_bundle,
            tokenizer,
            device,
            text_a,
            text_b,
            max_len,
            ensemble=ensemble,
            threshold=threshold,
        )
        results.append(result)

    out_df = pd.concat([df.reset_index(drop=True), pd.DataFrame(results)], axis=1)
    out_path.parent.mkdir(parents=True, exist_ok=True)
    out_df.to_csv(out_path, index=False)
    return True


def classify_batch(
    *,
    source_dir: Path,
    data_dir: Path,
    results_dir: Path,
    model_path: Path,
    threshold: float | None,
    packages: list[str] | None,
    skip_dirs: list[str] | None,
    force: bool,
) -> dict[str, int]:
    refs = discover_datasets(source_dir, packages=packages, skip_dirs=skip_dirs)
    device = resolve_device()
    model_or_bundle, tokenizer, config, ensemble, run_dir = load_bundle(model_path, device)
    resolved_threshold = resolve_threshold(
        run_dir,
        threshold,
        config if isinstance(config, dict) else getattr(config, "config", {}),
    )

    stats = {"classified": 0, "skipped": 0, "failed": 0}
    for ref in tqdm(refs, desc="Running classifier"):
        csv_path = data_dir / ref.llm / ref.run / f"{ref.package}_mutants.csv"
        result_csv = results_dir / ref.llm / ref.run / f"{ref.package}_predictions.csv"
        try:
            ran = classify_csv(
                csv_path,
                result_csv,
                model_or_bundle=model_or_bundle,
                tokenizer=tokenizer,
                config=config if isinstance(config, dict) else model_or_bundle.config,
                ensemble=ensemble,
                run_dir=run_dir,
                threshold=resolved_threshold,
                device=device,
                force=force,
            )
            if ran:
                stats["classified"] += 1
            else:
                stats["skipped"] += 1
        except Exception as exc:  # noqa: BLE001
            stats["failed"] += 1
            print(f"FAILED: {ref.key} ({exc})", flush=True)
    return stats


def main() -> None:
    parser = argparse.ArgumentParser(description="Batch UniXCoder classification")
    parser.add_argument("--config", type=Path, default=None)
    parser.add_argument("--source", type=Path, default=None)
    parser.add_argument("--data-dir", type=Path, default=None)
    parser.add_argument("--results-dir", type=Path, default=None)
    parser.add_argument("--model-path", type=Path, default=None)
    parser.add_argument("--threshold", type=float, default=None)
    parser.add_argument("--force", action="store_true")
    args = parser.parse_args()

    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    classifier_cfg = cfg.get("classifier", {})

    source_dir = resolve_source_dir(args.source, cfg)
    data_dir = args.data_dir or paths["data_dir"]
    results_dir = args.results_dir or paths["results_dir"]
    model_path = args.model_path or paths["model_path"]
    threshold = args.threshold if args.threshold is not None else float(classifier_cfg.get("threshold", 0.8))

    if not model_path.is_dir():
        raise FileNotFoundError(f"Classifier model directory not found: {model_path}")

    results_dir.mkdir(parents=True, exist_ok=True)
    stats = classify_batch(
        source_dir=source_dir,
        data_dir=data_dir,
        results_dir=results_dir,
        model_path=model_path,
        threshold=threshold,
        packages=cfg.get("packages"),
        skip_dirs=cfg.get("skip_dirs"),
        force=args.force,
    )
    print(
        f"Classified {stats['classified']} datasets; skipped {stats['skipped']}; failed {stats['failed']}.",
        flush=True,
    )
    if stats["failed"]:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
