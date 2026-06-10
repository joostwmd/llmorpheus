"""CSV loaders and model display helpers for Python analysis scripts."""

from __future__ import annotations

import json
from pathlib import Path

import pandas as pd

THESIS_ROOT = Path(__file__).resolve().parent.parent
REGISTRY_PATH = Path(__file__).resolve().parent / "model_registry.json"

NA_VALUES = ["", "—", "null", "None", "nan"]


def _load_registry() -> dict:
    with REGISTRY_PATH.open(encoding="utf-8") as f:
        return json.load(f)


_REGISTRY = _load_registry()

MODEL_DISPLAY_NAMES = {k: v["displayName"] for k, v in _REGISTRY.items()}
MODEL_CATEGORIES = {k: v["category"] for k, v in _REGISTRY.items()}


def display_name(model_id: str) -> str:
    return MODEL_DISPLAY_NAMES.get(model_id, model_id.replace("_", "/"))


def model_category(model_id: str) -> str:
    return MODEL_CATEGORIES.get(model_id, "unknown")


def _read(path: Path) -> pd.DataFrame:
    return pd.read_csv(path, na_values=NA_VALUES)


def default_path(*parts: str) -> Path:
    return THESIS_ROOT.joinpath(*parts)


def load_rq1_merged(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq1", "output", "appendix", "raw_metrics_all_runs.csv"))
    df["displayName"] = df["model"].map(display_name)
    return df


def load_rq1_summary(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq1", "output", "publication", "model_summary.csv"))
    if "displayName" not in df.columns:
        df["displayName"] = df["model"].map(display_name)
    return df


def load_rq2_detail(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq2", "output", "appendix", "consistency_by_model_package.csv"))
    df["displayName"] = df["model"].map(display_name)
    return df


def load_rq2_per_run(path: Path | None = None) -> pd.DataFrame:
    return _read(path or default_path("rq2", "output", "appendix", "per_run_long.csv"))


def load_rq2_pairwise_jaccard(path: Path | None = None) -> pd.DataFrame:
    return _read(path or default_path("rq2", "output", "appendix", "pairwise_jaccard.csv"))


def load_rq2_mutant_trial_counts(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq2", "output", "appendix", "mutant_trial_counts.csv"))
    df["displayName"] = df["model"].map(display_name)
    return df


def load_rq3_aggregated(path: Path | None = None) -> pd.DataFrame:
    return _read(path or default_path("rq3", "output", "publication", "aggregated_results.csv"))


def load_rq4_costs(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq4", "output", "appendix", "cost_all_runs.csv"))
    df["displayName"] = df["model"].map(display_name)
    return df


def load_rq4_summary(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq4", "output", "publication", "model_cost_summary.csv"))
    df["displayName"] = df["model"].map(display_name)
    return df


def load_rq4_tier_comparison(path: Path | None = None) -> pd.DataFrame:
    return _read(path or default_path("rq4", "output", "publication", "tier_comparison.csv"))


def load_rq4_tier_paired_deltas(path: Path | None = None) -> pd.DataFrame:
    return _read(path or default_path("rq4", "output", "appendix", "tier_paired_deltas.csv"))


def load_rq5_merged(path: Path | None = None) -> pd.DataFrame:
    df = _read(path or default_path("rq5", "output", "appendix", "merged_metrics.csv"))
    df["displayName"] = df["model"].map(display_name)
    df["modelCategory"] = df["model"].map(model_category)
    return df
