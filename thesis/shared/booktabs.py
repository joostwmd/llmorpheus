"""Generate LaTeX tables using booktabs and siunitx conventions."""

from __future__ import annotations

from pathlib import Path

from plot_style import OUTPUT_TABLES, ensure_output_dirs


def escape_latex(text) -> str:
    s = str(text if text is not None else "")
    return (
        s.replace("\\", "\\textbackslash{}")
        .replace("_", "\\_")
        .replace("%", "\\%")
        .replace("&", "\\&")
        .replace("#", "\\#")
    )


def df_to_booktabs(
    rows: list[list],
    headers: list[str],
    *,
    caption: str,
    label: str,
    col_spec: str | None = None,
    midrule_after: list[int] | None = None,
    row_colors: bool = False,
    table_env: str = "table",
    star: bool = False,
) -> str:
    spec = col_spec or ("l" + "r" * (len(headers) - 1))
    env = f"{table_env}*" if star else table_env
    lines = [
        f"\\begin{{{env}}}[htbp]",
        "\\centering",
        "{\\small",
    ]
    if row_colors:
        lines.append("\\rowcolors{2}{gray!10}{}")
    lines.extend(
        [
            f"\\begin{{tabular}}{{{spec}}}",
            "\\toprule",
            " & ".join(f"\\textbf{{{escape_latex(h)}}}" for h in headers) + " \\\\",
            "\\midrule",
        ]
    )
    mid = set(midrule_after or [])
    for i, row in enumerate(rows, start=1):
        cells = [escape_latex(c) if not isinstance(c, (int, float)) else str(c) for c in row]
        lines.append(" & ".join(cells) + " \\\\")
        if i in mid:
            lines.append("\\midrule")
    lines.extend(
        [
            "\\bottomrule",
            "\\end{tabular}",
            "}",
            f"\\caption{{{escape_latex(caption)}}}",
            f"\\label{{{label}}}",
            f"\\end{{{env}}}",
        ]
    )
    return "\n".join(lines)


def write_table(filename: str, content: str) -> Path:
    ensure_output_dirs()
    path = OUTPUT_TABLES / filename
    path.write_text(content, encoding="utf-8")
    return path
