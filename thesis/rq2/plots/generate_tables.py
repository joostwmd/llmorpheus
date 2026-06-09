#!/usr/bin/env python3
"""Generate RQ2 LaTeX tables."""

from __future__ import annotations

import sys
from pathlib import Path

import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from booktabs import df_to_booktabs, write_table  # noqa: E402
from csv_loader import load_rq2_detail  # noqa: E402


def fmt_num(v, digits=2) -> str:
    if pd.isna(v):
        return "---"
    return f"{v:.{digits}f}"


def fmt_pct(v, digits=2) -> str:
    if pd.isna(v):
        return "---"
    return f"{v:.{digits}f}\\%"


def consistency_table(summary_path: Path) -> None:
    summary = pd.read_csv(summary_path)
    rows = [
        [
            row["displayName"],
            fmt_num(row["meanJaccardOverlap"], 3),
            fmt_pct(row["medianCvMutationScore"]),
            fmt_pct(row["medianCvSurvivors"]),
            fmt_pct(row["medianCvAbsLevenshtein"]),
        ]
        for _, row in summary.sort_values("meanJaccardOverlap").iterrows()
    ]
    tex = df_to_booktabs(
        rows,
        ["Model", "Jaccard overlap", "CV mutation score", "CV survivors", "CV edit distance"],
        caption="RQ2: Cross-run consistency metrics per model (median across packages)",
        label="tab:rq2-consistency",
        col_spec="l|rrrr",
    )
    write_table("rq2_consistency.tex", tex)


def per_package_table(detail: pd.DataFrame) -> None:
    headers = ["Package", "Model", "Jaccard", "CV score"]
    rows = []
    for _, row in detail.sort_values(["package", "displayName"]).iterrows():
        rows.append(
            [
                row["package"],
                row["displayName"],
                fmt_num(row["meanJaccardOverlap"], 3),
                fmt_pct(row["cvMutationScore"]),
            ]
        )
    tex = df_to_booktabs(
        rows,
        headers,
        caption="RQ2: Per-package consistency metrics",
        label="tab:rq2-package-consistency",
        col_spec="ll|rr",
        star=True,
    )
    write_table("rq2_per_package_consistency.tex", tex)


def main() -> None:
    detail = load_rq2_detail()
    summary_path = Path(__file__).resolve().parents[1] / "output" / "thesis" / "model_consistency_summary.csv"
    consistency_table(summary_path)
    per_package_table(detail)
    print("RQ2 tables written to thesis-code/output/tables/", flush=True)


if __name__ == "__main__":
    main()
