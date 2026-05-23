#!/usr/bin/env python3
"""Generate LaTeX tables for equivalent-mutant analysis."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd

EM_ROOT = Path(__file__).resolve().parents[1]
ANALYZE_ROOT = Path(__file__).resolve().parent
sys.path.insert(0, str(EM_ROOT))
sys.path.insert(0, str(ANALYZE_ROOT))

from lib.config import load_config, resolve_paths


def format_pct(value: float, decimals: int = 1) -> str:
    if pd.isna(value):
        return ""
    return f"{value:.{decimals}f}\\%"


def llm_display_name(llm: str) -> str:
    return llm.replace("_", "/").replace("-", "-")


def generate_main_results_table(llm_summary: pd.DataFrame, baselines: dict[str, float]) -> str:
    lines = [
        "\\begin{table*}",
        "\\centering",
        "{\\scriptsize",
        "\\begin{tabular}{l||c|c|c|c||c}",
        "\\textbf{LLM} & \\textbf{Mean} & \\textbf{Std Dev} & \\textbf{Range} & \\textbf{CoV} & \\textbf{Rank} \\\\",
        "\\hline\\hline",
    ]
    for _, row in llm_summary.sort_values("mean_equiv_rate_pct").iterrows():
        lines.append(
            " & ".join(
                [
                    f"\\textit{{{llm_display_name(str(row['llm']))}}}",
                    format_pct(float(row["mean_equiv_rate_pct"])),
                    format_pct(float(row["std_equiv_rate_pct"])),
                    str(row["range_equiv_rate_pct"]).replace("%", "\\%"),
                    format_pct(float(row["coeff_of_variation_pct"])),
                    str(int(row["rank"])),
                ]
            )
            + " \\\\"
        )
    lines.extend(
        [
            "\\hline",
            f"\\textit{{LLMorpheus baseline}} & {format_pct(float(baselines.get('llmorpheus', 20.2)))} & - & - & - & - \\\\",
            f"\\textit{{StrykerJS baseline}} & {format_pct(float(baselines.get('strykerjs', 4.7)))} & - & - & - & - \\\\",
            "\\end{tabular}",
            "}",
            "\\caption{Equivalent mutant rates among surviving mutants predicted by the UniXCoder classifier across LLMs (threshold $\\theta=0.8$). Mean and standard deviation are computed over package/run observations; weighted rate uses all surviving mutants pooled.}",
            "\\label{tab:llm-equiv-main}",
            "\\end{table*}",
        ]
    )
    return "\n".join(lines)


def generate_package_breakdown_table(
    per_dataset: pd.DataFrame,
    llms: list[str],
) -> str:
    packages = sorted(per_dataset["package"].unique())
    header = ["\\textbf{Package}"]
    for llm in llms:
        short = llm.split("_", 1)[-1][:18]
        header.extend([f"\\multicolumn{{2}}{{c|}}{{\\textit{{{short}}}}}", ""])
    lines = [
        "\\begin{table*}",
        "\\centering",
        "{\\tiny",
        f"\\begin{{tabular}}{{l||{'cc|' * (len(llms) - 1)}cc}}",
        " & ".join(header[:-1]) + " \\\\",
        " & ".join([" "] + [f"Mean & SD" for _ in llms]) + " \\\\",
        "\\hline\\hline",
    ]
    for package in packages:
        cells = [f"\\textit{{{package}}}"]
        pkg_df = per_dataset[per_dataset["package"] == package]
        for llm in llms:
            subset = pkg_df[pkg_df["llm"] == llm]["equiv_rate_pct"]
            if len(subset):
                cells.extend([format_pct(float(subset.mean())), format_pct(float(subset.std(ddof=1)) if len(subset) > 1 else 0.0)])
            else:
                cells.extend(["", ""])
        lines.append(" & ".join(cells) + " \\\\")
    lines.extend(
        [
            "\\end{tabular}",
            "}",
            "\\caption{Per-package equivalent mutant rates among surviving mutants (mean and standard deviation across runs).}",
            "\\label{tab:llm-equiv-package}",
            "\\end{table*}",
        ]
    )
    return "\n".join(lines)


def generate_statistical_tests_table(pairwise: pd.DataFrame) -> str:
    lines = [
        "\\begin{table*}",
        "\\centering",
        "{\\scriptsize",
        "\\begin{tabular}{l|l|c|c|c|c|c}",
        "\\textbf{LLM A} & \\textbf{LLM B} & \\textbf{Mean A} & \\textbf{Mean B} & \\textbf{$p$ (Bonf.)} & \\textbf{Cohen's $d$} & \\textbf{$n$} \\\\",
        "\\hline\\hline",
    ]
    for _, row in pairwise.iterrows():
        lines.append(
            " & ".join(
                [
                    f"\\textit{{{llm_display_name(str(row['llm_a']))[:24]}}}",
                    f"\\textit{{{llm_display_name(str(row['llm_b']))[:24]}}}",
                    format_pct(float(row["mean_a_pct"])),
                    format_pct(float(row["mean_b_pct"])),
                    f"{float(row['p_value_bonferroni']):.4f}" if pd.notna(row["p_value_bonferroni"]) else "",
                    f"{float(row['cohens_d']):.3f}" if pd.notna(row["cohens_d"]) else "",
                    f"{int(row['n_a'])}/{int(row['n_b'])}",
                ]
            )
            + " \\\\"
        )
    lines.extend(
        [
            "\\end{tabular}",
            "}",
            "\\caption{Pairwise comparisons of equivalent mutant rates between LLMs (Welch's $t$-test with Bonferroni correction over all pairs).}",
            "\\label{tab:llm-equiv-stats}",
            "\\end{table*}",
        ]
    )
    return "\n".join(lines)


def main() -> None:
    parser = argparse.ArgumentParser(description="Generate LaTeX tables")
    parser.add_argument("--config", type=Path, default=None)
    parser.add_argument("--input-dir", type=Path, default=None)
    args = parser.parse_args()

    cfg = load_config(args.config)
    paths = resolve_paths(cfg)
    input_dir = args.input_dir or paths["plots_dir"]

    per_dataset = pd.read_csv(input_dir / "aggregated_results.csv")
    llm_summary = pd.read_csv(input_dir / "llm_summary.csv")
    pairwise = pd.read_csv(input_dir / "pairwise_llm_tests.csv")
    baselines = cfg.get("baselines", {})

    llms = sorted(per_dataset["llm"].unique())
    main_tex = generate_main_results_table(llm_summary, baselines)
    package_tex = generate_package_breakdown_table(per_dataset, llms)
    stats_tex = generate_statistical_tests_table(pairwise)

    (input_dir / "main_results_table.tex").write_text(main_tex, encoding="utf-8")
    (input_dir / "package_breakdown_table.tex").write_text(package_tex, encoding="utf-8")
    (input_dir / "statistical_tests_table.tex").write_text(stats_tex, encoding="utf-8")
    print(f"Wrote LaTeX tables to {input_dir}", flush=True)


if __name__ == "__main__":
    main()
