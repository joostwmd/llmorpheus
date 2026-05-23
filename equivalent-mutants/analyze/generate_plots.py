#!/usr/bin/env python3
"""Generate plots for equivalent-mutant analysis."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import matplotlib.pyplot as plt
import numpy as np
import pandas as pd
import seaborn as sns

EM_ROOT = Path(__file__).resolve().parents[1]
ANALYZE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(EM_ROOT))
sys.path.insert(0, str(ANALYZE_ROOT))

from lib.config import load_config, resolve_paths


def setup_style() -> None:
    cache_dir = Path(__file__).resolve().parent / ".matplotlib-cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    import os

    os.environ.setdefault("MPLCONFIGDIR", str(cache_dir))
    sns.set_theme(style="whitegrid", context="paper", font_scale=1.1)
    plt.rcParams.update({"figure.dpi": 150, "savefig.dpi": 300, "savefig.bbox": "tight"})


def short_llm_name(llm: str) -> str:
    return llm.replace("meta-llama_", "llama/").replace("openai_", "openai/").replace("google_", "google/").replace("anthropic_", "anthropic/").replace("deepseek_", "deepseek/")


def plot_boxplot(per_dataset: pd.DataFrame, baselines: dict[str, float], out_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(11, 6))
    plot_df = per_dataset.copy()
    plot_df["llm_short"] = plot_df["llm"].map(short_llm_name)
    sns.boxplot(data=plot_df, x="llm_short", y="equiv_rate_pct", ax=ax, color="#6baed6")
    sns.stripplot(
        data=plot_df,
        x="llm_short",
        y="equiv_rate_pct",
        ax=ax,
        color="#08306b",
        alpha=0.5,
        size=3,
        jitter=0.15,
    )
    ax.axhline(float(baselines.get("llmorpheus", 20.2)), color="#e6550d", linestyle="--", label="LLMorpheus baseline (20.2%)")
    ax.axhline(float(baselines.get("strykerjs", 4.7)), color="#31a354", linestyle="--", label="StrykerJS baseline (4.7%)")
    ax.set_xlabel("LLM")
    ax.set_ylabel("Equivalent mutant rate (%)")
    ax.set_title("Distribution of predicted equivalent mutant rates")
    ax.tick_params(axis="x", rotation=35)
    ax.legend(loc="upper right")
    fig.savefig(out_path)
    plt.close(fig)


def plot_heatmap(per_dataset: pd.DataFrame, out_path: Path) -> None:
    pivot = per_dataset.pivot_table(index="llm", columns="package", values="equiv_rate_pct", aggfunc="mean")
    pivot.index = [short_llm_name(x) for x in pivot.index]
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.heatmap(pivot, annot=True, fmt=".1f", cmap="RdYlBu_r", ax=ax, cbar_kws={"label": "Equiv rate (%)"})
    ax.set_title("Mean equivalent mutant rate by LLM and package")
    ax.set_xlabel("Package")
    ax.set_ylabel("LLM")
    fig.savefig(out_path)
    plt.close(fig)


def plot_errorbar(llm_summary: pd.DataFrame, baselines: dict[str, float], out_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(10, 6))
    summary = llm_summary.sort_values("mean_equiv_rate_pct")
    x = np.arange(len(summary))
    ax.errorbar(
        x,
        summary["mean_equiv_rate_pct"],
        yerr=summary["std_equiv_rate_pct"],
        fmt="o",
        capsize=4,
        color="#3182bd",
    )
    ax.set_xticks(x)
    ax.set_xticklabels([short_llm_name(str(v)) for v in summary["llm"]], rotation=35, ha="right")
    ax.axhline(float(baselines.get("llmorpheus", 20.2)), color="#e6550d", linestyle="--", label="LLMorpheus")
    ax.axhline(float(baselines.get("strykerjs", 4.7)), color="#31a354", linestyle="--", label="StrykerJS")
    ax.set_ylabel("Equivalent mutant rate (%)")
    ax.set_title("Mean equivalent mutant rate with standard deviation")
    ax.legend()
    fig.savefig(out_path)
    plt.close(fig)


def plot_scatter(per_dataset: pd.DataFrame, out_path: Path) -> None:
    fig, ax = plt.subplots(figsize=(10, 6))
    for llm, group in per_dataset.groupby("llm"):
        ax.scatter(
            group["total_surviving"],
            group["equiv_rate_pct"],
            label=short_llm_name(str(llm)),
            alpha=0.75,
            s=45,
        )
    ax.set_xlabel("Surviving mutants in dataset")
    ax.set_ylabel("Equivalent mutant rate (%)")
    ax.set_title("Package size vs equivalent mutant rate")
    ax.legend(bbox_to_anchor=(1.02, 1), loc="upper left", fontsize=8)
    fig.savefig(out_path)
    plt.close(fig)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate analysis plots")
    parser.add_argument("--config", type=Path, default=None)
    parser.add_argument("--input-dir", type=Path, default=None)
    args = parser.parse_args()

    setup_style()
    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    input_dir = args.input_dir or paths["plots_dir"]
    baselines = cfg.get("baselines", {})

    per_dataset = pd.read_csv(input_dir / "aggregated_results.csv")
    llm_summary = pd.read_csv(input_dir / "llm_summary.csv")

    plot_boxplot(per_dataset, baselines, input_dir / "llm_comparison_boxplot.png")
    plot_heatmap(per_dataset, input_dir / "llm_package_heatmap.png")
    plot_errorbar(llm_summary, baselines, input_dir / "llm_means_errorbar.png")
    plot_scatter(per_dataset, input_dir / "package_complexity_scatter.png")
    print(f"Wrote plots to {input_dir}", flush=True)


if __name__ == "__main__":
    main()
