"""Configuration loading for the equivalent-mutants pipeline."""

from __future__ import annotations

from pathlib import Path
from typing import Any

import yaml

EQUIVALENT_MUTANTS_ROOT = Path(__file__).resolve().parents[1]


def _find_repo_root() -> Path:
    """Resolve llmorpheus repo root (supports thesis-code/rq3/ layout)."""
    candidate = EQUIVALENT_MUTANTS_ROOT.parent.parent.parent
    if (candidate / "thesis-code").is_dir():
        return candidate
    legacy = EQUIVALENT_MUTANTS_ROOT.parent
    if (legacy / "package.json").is_file():
        return legacy
    return candidate


REPO_ROOT = _find_repo_root()
ANALYZE_ROOT = EQUIVALENT_MUTANTS_ROOT / "analyze"
CLASSIFY_ROOT = EQUIVALENT_MUTANTS_ROOT / "classify"
LIB_ROOT = EQUIVALENT_MUTANTS_ROOT / "lib"
DEFAULT_CONFIG_PATH = ANALYZE_ROOT / "config.yaml"
DEFAULT_MODEL_PATH = (
    "classify/runs/"
    "ensemble-20260517-130830Z-window-w0-ep18-k5-s3-isplitdiff-pclsmm-focal2-bs-ck-tfeq-ls5-eqw175-ml512-bs8-lr2e-4-equiv-push-v1"
)


def load_config(config_path: Path | str | None = None) -> dict[str, Any]:
    path = Path(config_path) if config_path else DEFAULT_CONFIG_PATH
    if not path.is_file():
        raise FileNotFoundError(f"Config not found: {path}")
    with path.open(encoding="utf-8") as fh:
        cfg = yaml.safe_load(fh)
    if not isinstance(cfg, dict):
        raise ValueError(f"Invalid config format in {path}")
    return cfg


def _repo_relative(path_value: str | Path) -> Path:
    path = Path(path_value)
    return path if path.is_absolute() else REPO_ROOT / path


def resolve_user_path(path_value: Path | str | None, *, base: Path) -> Path | None:
    if path_value is None:
        return None
    path = Path(path_value)
    if path.is_absolute():
        return path.resolve()
    return (base / path).resolve()


def resolve_paths(cfg: dict[str, Any]) -> dict[str, Path]:
    data_cfg = cfg.get("data", {})
    classifier_cfg = cfg.get("classifier", {})
    source_dir = _repo_relative(data_cfg.get("source_dir", "organized"))
    model_rel = classifier_cfg.get("model_path", DEFAULT_MODEL_PATH)
    model_rel_str = str(model_rel)
    if model_rel_str.startswith("classify/"):
        model_path = EQUIVALENT_MUTANTS_ROOT / model_rel_str
    elif model_rel_str.startswith("equivalent-mutants/"):
        model_path = REPO_ROOT / model_rel_str
    else:
        model_path = _repo_relative(model_rel)
    return {
        "repo_root": REPO_ROOT,
        "equivalent_mutants_root": EQUIVALENT_MUTANTS_ROOT,
        "analyze_root": ANALYZE_ROOT,
        "classify_root": CLASSIFY_ROOT,
        "source_dir": source_dir,
        "model_path": model_path,
        "data_dir": CLASSIFY_ROOT / "data",
        "results_dir": CLASSIFY_ROOT / "results",
        "output_dir": ANALYZE_ROOT / "output",
        "plots_dir": ANALYZE_ROOT / "output",
        "logs_dir": ANALYZE_ROOT / "logs",
    }


def resolve_source_dir(source: Path | str | None, cfg: dict[str, Any]) -> Path:
    paths = resolve_paths(cfg)
    resolved = resolve_user_path(source, base=paths["repo_root"])
    return resolved if resolved is not None else paths["source_dir"]
