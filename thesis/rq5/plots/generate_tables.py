#!/usr/bin/env python3
"""Generate RQ5 LaTeX tables."""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from booktabs import df_to_booktabs, write_table  # noqa: E402


def fmt_pct(v, digits=2) -> str:
    if pd.isna(v):
        return "---"
    return f"{v:.{digits}f}\\%"


def fmt_num(v, digits=2) -> str:
    if pd.isna(v):
        return "---"
    return f"{v:.{digits}f}"


def fmt_usd(v, digits=4) -> str:
    if pd.isna(v):
        return "---"
    return f"\\${v:.{digits}f}"


def main() -> None:
    publication = Path(__file__).resolve().parents[1] / "output" / "publication"
    cat = pd.read_csv(publication / "category_summary.csv")
    comp = pd.read_csv(publication / "category_comparisons.csv")

    cat_rows = [
        [
            row["category"],
            str(int(row["nModels"])),
            fmt_pct(row["medianMutationScore"]),
            fmt_num(row["medianSurvivors"], 0),
            fmt_pct(row["medianEquivRate"]),
            fmt_usd(row["medianCostPerSurvivor"]),
        ]
        for _, row in cat.iterrows()
    ]
    write_table(
        "rq5_category_summary.tex",
        df_to_booktabs(
            cat_rows,
            ["Category", "Models", "Mutation score", "Survivors", "Equiv rate", "Cost/survivor"],
            caption="RQ5: Open-weight vs API-only model comparison (median across observations)",
            label="tab:rq5-category",
            col_spec="l|r|rrrr",
        ),
    )

    comp_rows = []
    for _, row in comp.iterrows():
        p_col = "pValue" if "pValue" in comp.columns else "p_value"
        comp_rows.append(
            [
                row["label"],
                fmt_num(row.get("medianA")),
                fmt_num(row.get("medianB")),
                f"{float(row[p_col]):.4f}" if pd.notna(row.get(p_col)) else "---",
                f"{float(row.get('effectSize', row.get('delta', np.nan))):.3f}"
                if pd.notna(row.get("effectSize", row.get("delta")))
                else "---",
            ]
        )
    write_table(
        "rq5_pairwise_effect.tex",
        df_to_booktabs(
            comp_rows,
            ["Metric", "Median open-weight", "Median API-only", "$p$", "Effect size"],
            caption="RQ5: Mann-Whitney comparisons between open-weight and API-only categories",
            label="tab:rq5-pairwise",
            col_spec="l|rrrr",
        ),
    )
    print("RQ5 tables written to thesis/output/tables/", flush=True)


if __name__ == "__main__":
    main()
