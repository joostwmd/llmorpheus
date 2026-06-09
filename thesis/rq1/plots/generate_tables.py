#!/usr/bin/env python3
"""Generate RQ1 LaTeX tables (booktabs)."""

from __future__ import annotations

import sys
from pathlib import Path

import numpy as np
import pandas as pd

SHARED = Path(__file__).resolve().parents[2] / "shared"
sys.path.insert(0, str(SHARED))

from booktabs import df_to_booktabs, write_table  # noqa: E402
from csv_loader import load_rq1_merged, load_rq1_summary  # noqa: E402
from stats_helpers import bootstrap_median_ci  # noqa: E402


def fmt_pct(v, digits=2) -> str:
    if pd.isna(v):
        return "---"
    return f"{v:.{digits}f}\\%"


def fmt_num(v, digits=2) -> str:
    if pd.isna(v):
        return "---"
    return f"{v:.{digits}f}"


def fmt_iqr(med, q1, q3, digits=2) -> str:
    if pd.isna(med):
        return "---"
    if pd.isna(q1) or pd.isna(q3):
        return fmt_num(med, digits)
    return f"{fmt_num(med, digits)} [{fmt_num(q1, digits)}, {fmt_num(q3, digits)}]"


def volume_metrics_table(summary: pd.DataFrame, merged: pd.DataFrame) -> None:
    rows = []
    for _, m in summary.sort_values("medianMutationScore").iterrows():
        pkg_rows = merged[merged["model"] == m["model"]]
        q1_abs = pkg_rows["medianAbsLevenshtein"].quantile(0.25)
        q3_abs = pkg_rows["medianAbsLevenshtein"].quantile(0.75)
        q1_norm = pkg_rows["medianNormLevenshtein"].quantile(0.25)
        q3_norm = pkg_rows["medianNormLevenshtein"].quantile(0.75)
        rows.append(
            [
                m["displayName"],
                fmt_num(m["medianCandidates"], 0),
                fmt_pct(m["medianValidityRatePct"]),
                fmt_pct(m["medianMutationScore"]),
                fmt_num(m["medianSurvived"], 0),
                fmt_iqr(m["medianAbsLevenshtein"], q1_abs, q3_abs),
                fmt_iqr(m["medianNormLevenshtein"], q1_norm, q3_norm),
            ]
        )
    tex = df_to_booktabs(
        rows,
        ["Model", "Candidates", "Validity", "Mutation score", "Survived", "Abs. Levenshtein", "Norm. Levenshtein"],
        caption="RQ1: Mutant volume and quality metrics per model (median across packages and runs)",
        label="tab:rq1-volume",
        col_spec="l|rrrrrr",
    )
    write_table("rq1_volume_metrics.tex", tex)


def edit_distance_table(merged: pd.DataFrame) -> None:
    rows = []
    for model, group in merged.groupby("model"):
        vals = group["medianAbsLevenshtein"].dropna().to_numpy()
        med = float(np.median(vals)) if len(vals) else np.nan
        lo, hi = bootstrap_median_ci(vals)
        rows.append([group["displayName"].iloc[0], fmt_num(med, 2), f"[{fmt_num(lo, 2)}, {fmt_num(hi, 2)}]"])
    rows.sort(key=lambda r: r[0])
    tex = df_to_booktabs(
        rows,
        ["Model", "Median abs. Levenshtein", "95\\% bootstrap CI"],
        caption="RQ1: Absolute Levenshtein edit distance with bootstrap confidence intervals",
        label="tab:rq1-edit-distance",
        col_spec="l|rr",
    )
    write_table("rq1_edit_distance.tex", tex)


def per_package_breakdown(merged: pd.DataFrame) -> None:
    pivot = merged.pivot_table(index="package", columns="displayName", values="mutationScore", aggfunc="median")
    headers = ["Package"] + list(pivot.columns)
    rows = []
    for package in pivot.index:
        row = [package] + [fmt_pct(pivot.loc[package, col]) for col in pivot.columns]
        rows.append(row)
    spec = "l|" + "r" * len(pivot.columns)
    tex = df_to_booktabs(
        rows,
        headers,
        caption="RQ1: Median mutation score by package and model",
        label="tab:rq1-package-breakdown",
        col_spec=spec,
        star=True,
    )
    write_table("rq1_per_package_breakdown.tex", tex)


def main() -> None:
    merged = load_rq1_merged()
    summary = load_rq1_summary()
    volume_metrics_table(summary, merged)
    edit_distance_table(merged)
    per_package_breakdown(merged)
    print("RQ1 tables written to thesis-code/output/tables/", flush=True)


if __name__ == "__main__":
    main()
