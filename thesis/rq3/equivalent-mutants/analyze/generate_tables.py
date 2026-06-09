#!/usr/bin/env python3
"""Generate LaTeX tables for equivalent-mutant analysis."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

import pandas as pd

EM_ROOT = Path(__file__).resolve().parents[1]
ANALYZE_ROOT = Path(__file__).resolve().parent
THESIS_SHARED = Path(__file__).resolve().parents[3] / "shared"
sys.path.insert(0, str(EM_ROOT))
sys.path.insert(0, str(ANALYZE_ROOT))
sys.path.insert(0, str(THESIS_SHARED))

from lib.config import load_config, resolve_paths
from booktabs import df_to_booktabs, write_table


def format_pct(value: float, decimals: int = 1) -> str:
    if pd.isna(value):
        return ""
    return f"{value:.{decimals}f}\\%"


def llm_display_name(llm: str) -> str:
    return llm.replace("_", "/").replace("-", "-")


def generate_main_results_table(llm_summary: pd.DataFrame, baselines: dict[str, float]) -> str:
    rows = []
    for _, row in llm_summary.sort_values("mean_equiv_rate_pct").iterrows():
        rows.append(
            [
                f"\\textit{{{llm_display_name(str(row['llm']))}}}",
                format_pct(float(row["mean_equiv_rate_pct"])),
                format_pct(float(row["std_equiv_rate_pct"])),
                str(row["range_equiv_rate_pct"]).replace("%", "\\%"),
                format_pct(float(row["coeff_of_variation_pct"])),
                str(int(row["rank"])),
            ]
        )
    rows.extend(
        [
            [
                "\\textit{LLMorpheus baseline}",
                format_pct(float(baselines.get("llmorpheus", 20.2))),
                "-",
                "-",
                "-",
                "-",
            ],
            [
                "\\textit{StrykerJS baseline}",
                format_pct(float(baselines.get("strykerjs", 4.7))),
                "-",
                "-",
                "-",
                "-",
            ],
        ]
    )
    return df_to_booktabs(
        rows,
        ["LLM", "Mean", "Std Dev", "Range", "CoV", "Rank"],
        caption="Equivalent mutant rates among surviving mutants predicted by the UniXCoder classifier across LLMs (threshold $\\theta=0.8$).",
        label="tab:llm-equiv-main",
        col_spec="l|rrrrr",
        star=True,
    )


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
        "\\toprule",
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
            "\\bottomrule",
            "\\end{tabular}",
            "}",
            "\\caption{Per-package equivalent mutant rates among surviving mutants (mean and standard deviation across runs).}",
            "\\label{tab:llm-equiv-package}",
            "\\end{table*}",
        ]
    )
    return "\n".join(lines)


def generate_statistical_tests_table(pairwise: pd.DataFrame) -> str:
    rows = []
    for _, row in pairwise.iterrows():
        p_col = "p_value_holm" if "p_value_holm" in pairwise.columns else "p_value_bonferroni"
        rows.append(
            [
                f"\\textit{{{llm_display_name(str(row['llm_a']))[:24]}}}",
                f"\\textit{{{llm_display_name(str(row['llm_b']))[:24]}}}",
                format_pct(float(row["mean_a_pct"])),
                format_pct(float(row["mean_b_pct"])),
                f"{float(row[p_col]):.4f}" if pd.notna(row.get(p_col)) else "",
                f"{float(row['cliffs_delta']):.3f}" if pd.notna(row.get("cliffs_delta")) else "",
                f"{int(row['n_a'])}/{int(row['n_b'])}",
            ]
        )
    return df_to_booktabs(
        rows,
        ["LLM A", "LLM B", "Mean A", "Mean B", "$p$ (Holm)", "Cliff's $\\delta$", "$n$"],
        caption="Pairwise comparisons of equivalent mutant rates between LLMs (Welch's $t$-test with Holm correction).",
        label="tab:llm-equiv-stats",
        col_spec="ll|rrrrrl",
        star=True,
    )


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
    write_table("rq3_main_results.tex", main_tex)
    write_table("rq3_statistical_tests.tex", stats_tex)
    print(f"Wrote LaTeX tables to {input_dir} and thesis-code/output/tables/", flush=True)


if __name__ == "__main__":
    main()
