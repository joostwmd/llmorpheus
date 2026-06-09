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
THESIS_SHARED = Path(__file__).resolve().parents[3] / "shared"
sys.path.insert(0, str(EM_ROOT))
sys.path.insert(0, str(ANALYZE_ROOT))
sys.path.insert(0, str(THESIS_SHARED))

from lib.config import load_config, resolve_paths
from csv_loader import load_rq1_summary
from plot_style import save_fig, setup as shared_setup


def setup_style() -> None:
    cache_dir = Path(__file__).resolve().parent / ".matplotlib-cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    import os

    os.environ.setdefault("MPLCONFIGDIR", str(cache_dir))
    shared_setup()


def short_llm_name(llm: str) -> str:
    return llm.replace("meta-llama_", "llama/").replace("openai_", "openai/").replace("google_", "google/").replace("anthropic_", "anthropic/").replace("deepseek_", "deepseek/")


def plot_effective_survivors(per_dataset: pd.DataFrame) -> None:
    agg = (
        per_dataset.groupby("llm", as_index=False)
        .agg(
            predicted_equivalent=("predicted_equivalent", "sum"),
            total_surviving=("total_surviving", "sum"),
        )
        .sort_values("llm")
    )
    agg["behavioral_change"] = agg["total_surviving"] - agg["predicted_equivalent"]
    agg["llm_short"] = agg["llm"].map(short_llm_name)
    fig, ax = plt.subplots(figsize=(10, 5))
    ax.barh(agg["llm_short"], agg["predicted_equivalent"], color="#e6550d", label="Predicted equivalent")
    ax.barh(
        agg["llm_short"],
        agg["behavioral_change"],
        left=agg["predicted_equivalent"],
        color="#31a354",
        label="Predicted behavioral change",
    )
    ax.set_xlabel("Surviving mutants")
    ax.set_title("Effective survivors: equivalent vs behavioral-change mutants")
    ax.legend(fontsize=8)
    save_fig(fig, "effective_survivors", prefix="rq3_")


def plot_score_vs_equiv_rate(per_dataset: pd.DataFrame, llm_summary: pd.DataFrame) -> None:
    rq1 = load_rq1_summary()
    score_by_llm = rq1.set_index("model")["medianMutationScore"].to_dict()
    summary = llm_summary.copy()
    summary["mutation_score"] = summary["llm"].map(score_by_llm)
    fig, ax = plt.subplots(figsize=(8, 6))
    for _, row in summary.iterrows():
        ax.scatter(row["mean_equiv_rate_pct"], row["mutation_score"], s=70)
        ax.annotate(
            short_llm_name(str(row["llm"])),
            (row["mean_equiv_rate_pct"], row["mutation_score"]),
            fontsize=8,
            xytext=(4, 4),
            textcoords="offset points",
        )
    ax.set_xlabel("Mean equivalent mutant rate (%)")
    ax.set_ylabel("Median mutation score (%)")
    ax.set_title("Mutation score vs equivalent mutant rate")
    save_fig(fig, "score_vs_equiv_rate", prefix="rq3_")


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
    save_fig(fig, "llm_comparison_boxplot", prefix="rq3_")


def plot_heatmap(per_dataset: pd.DataFrame, out_path: Path) -> None:
    pivot = per_dataset.pivot_table(index="llm", columns="package", values="equiv_rate_pct", aggfunc="mean")
    pivot.index = [short_llm_name(x) for x in pivot.index]
    fig, ax = plt.subplots(figsize=(10, 6))
    sns.heatmap(pivot, annot=True, fmt=".1f", cmap="RdYlBu_r", ax=ax, cbar_kws={"label": "Equiv rate (%)"})
    ax.set_title("Mean equivalent mutant rate by LLM and package")
    ax.set_xlabel("Package")
    ax.set_ylabel("LLM")
    fig.savefig(out_path)
    save_fig(fig, "llm_package_heatmap", prefix="rq3_")


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
    save_fig(fig, "llm_means_errorbar", prefix="rq3_")


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
    save_fig(fig, "package_complexity_scatter", prefix="rq3_")


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
    plot_effective_survivors(per_dataset)
    plot_score_vs_equiv_rate(per_dataset, llm_summary)
    print(f"Wrote plots to {input_dir} and thesis/output/figures/", flush=True)


if __name__ == "__main__":
    main()
