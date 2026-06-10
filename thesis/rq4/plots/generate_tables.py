#!/usr/bin/env python3
"""Generate RQ4 LaTeX tables."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from booktabs import df_to_booktabs, write_table  # noqa: E402
from csv_loader import display_name, load_rq4_summary, load_rq4_tier_comparison  # noqa: E402


def fmt_usd(v, digits=4) -> str:
    if pd.isna(v):
        return "---"
    return f"\\${v:.{digits}f}"


def cost_table(summary: pd.DataFrame) -> None:
    rows = []
    for _, row in summary.sort_values("efficiencyRank").iterrows():
        cost_per_unique = row.get("portfolioCostPerUnique")
        if pd.isna(cost_per_unique):
            cost_per_unique = row.get("medianCostPerUnique")
        rows.append(
            [
                display_name(row["model"]),
                fmt_usd(row["totalCostUsd"], 2),
                fmt_usd(row["medianCostPerValid"]),
                fmt_usd(cost_per_unique),
                fmt_usd(row["medianCostPerSurvivor"]),
                fmt_usd(row["medianCostPerNonEquiv"]),
                str(int(row["efficiencyRank"])),
                "yes" if row.get("paretoEfficient") else "no",
            ]
        )
    tex = df_to_booktabs(
        rows,
        ["Model", "Total USD", "Cost/valid", "Cost/unique", "Cost/survivor", "Cost/non-equiv", "Rank", "Pareto"],
        caption="RQ4: Cost-effectiveness per model (aggregated across packages and runs)",
        label="tab:rq4-cost",
        col_spec="l|rrrrrrl",
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


def tier_comparison_table(tier: pd.DataFrame) -> None:
    rows = []
    for _, row in tier.iterrows():
        rows.append(
            [
                row["provider"],
                display_name(row["cheapModel"]),
                display_name(row["premiumModel"]),
                fmt_usd(row.get("cheap_portfolioCostPerUnique")),
                fmt_usd(row.get("premium_portfolioCostPerUnique")),
                fmt_usd(row.get("cheap_portfolioCostPerNonEquiv")),
                fmt_usd(row.get("premium_portfolioCostPerNonEquiv")),
                f"{row.get('cheap_equivRatePct', float('nan')):.1f}\\%"
                if pd.notna(row.get("cheap_equivRatePct"))
                else "---",
                f"{row.get('premium_equivRatePct', float('nan')):.1f}\\%"
                if pd.notna(row.get("premium_equivRatePct"))
                else "---",
                fmt_usd(row.get("premiumMultiplierCostPerNonEquiv"), 2),
            ]
        )
    tex = df_to_booktabs(
        rows,
        [
            "Provider",
            "Cheap",
            "Premium",
            "Cost/unique (cheap)",
            "Cost/unique (premium)",
            "Cost/non-equiv (cheap)",
            "Cost/non-equiv (premium)",
            "Equiv\\% (cheap)",
            "Equiv\\% (premium)",
            "Premium multiplier",
        ],
        caption="RQ4: Within-provider tier comparison (run1, aggregated across packages)",
        label="tab:rq4-tier-comparison",
        col_spec="l|ll|rr|rr|rr|r",
    )
    write_table("rq4_tier_comparison.tex", tex)


def main() -> None:
    summary = load_rq4_summary()
    cost_table(summary)
    pareto_table(summary)
    tier_comparison_table(load_rq4_tier_comparison())
    print("RQ4 tables written to thesis/output/tables/", flush=True)


if __name__ == "__main__":
    main()
