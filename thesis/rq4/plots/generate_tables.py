#!/usr/bin/env python3
"""Generate RQ4 LaTeX tables."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from booktabs import df_to_booktabs, write_table  # noqa: E402
from csv_loader import display_name, load_rq4_summary  # noqa: E402


def fmt_usd(v, digits=4) -> str:
    if pd.isna(v):
        return "---"
    return f"\\${v:.{digits}f}"


def cost_table(summary: pd.DataFrame) -> None:
    rows = []
    for _, row in summary.sort_values("efficiencyRank").iterrows():
        rows.append(
            [
                display_name(row["model"]),
                fmt_usd(row["totalCostUsd"], 2),
                fmt_usd(row["medianCostPerValid"]),
                fmt_usd(row["medianCostPerSurvivor"]),
                fmt_usd(row["medianCostPerNonEquiv"]),
                str(int(row["efficiencyRank"])),
                "yes" if row.get("paretoEfficient") else "no",
            ]
        )
    tex = df_to_booktabs(
        rows,
        ["Model", "Total USD", "Cost/valid", "Cost/survivor", "Cost/non-equiv", "Rank", "Pareto"],
        caption="RQ4: Cost-effectiveness per model (aggregated across packages and runs)",
        label="tab:rq4-cost",
        col_spec="l|rrrrrl",
    )
    write_table("rq4_cost.tex", tex)


def pareto_table(summary: pd.DataFrame) -> None:
    if "paretoEfficient" in summary.columns:
        mask = summary["paretoEfficient"].astype(str).str.lower().isin(["true", "1", "yes"])
        efficient = summary[mask]
    else:
        efficient = summary.iloc[0:0]
    rows = [
        [
            display_name(row["model"]),
            str(int(row["efficiencyRank"])),
            fmt_usd(row["medianCostPerNonEquiv"]),
            f"{row['medianMutationScore']:.2f}\\%",
        ]
        for _, row in efficient.sort_values("efficiencyRank").iterrows()
    ]
    tex = df_to_booktabs(
        rows,
        ["Model", "Rank", "Cost/non-equiv", "Mutation score"],
        caption="RQ4: Pareto-efficient models on cost vs mutation score",
        label="tab:rq4-pareto",
        col_spec="l|rrr",
    )
    write_table("rq4_pareto.tex", tex)


def main() -> None:
    summary = load_rq4_summary()
    cost_table(summary)
    pareto_table(summary)
    print("RQ4 tables written to thesis-code/output/tables/", flush=True)


if __name__ == "__main__":
    main()
