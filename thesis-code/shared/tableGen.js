import { formatNum, formatPct } from "./statistics.js";

export function latexEscape(text) {
  return String(text ?? "")
    .replace(/\\/g, "\\textbackslash{}")
    .replace(/_/g, "\\_")
    .replace(/%/g, "\\%")
    .replace(/&/g, "\\&")
    .replace(/#/g, "\\#");
}

export function buildTable({ caption, label, headers, rows, colSpec }) {
  const spec = colSpec ?? `l${"|r".repeat(headers.length - 1)}`;
  const lines = [
    "\\begin{table}[htbp]",
    "\\centering",
    `{\\small`,
    `\\begin{tabular}{${spec}}`,
    "\\hline",
    headers.map((h) => `\\textbf{${latexEscape(h)}}`).join(" & ") + " \\\\",
    "\\hline",
  ];
  for (const row of rows) {
    lines.push(row.map((c) => (typeof c === "number" ? String(c) : latexEscape(c))).join(" & ") + " \\\\");
  }
  lines.push(
    "\\hline",
    "\\end{tabular}",
    "}",
    `\\caption{${latexEscape(caption)}}`,
    `\\label{${label}}`,
    "\\end{table}"
  );
  return lines.join("\n");
}

export { formatNum, formatPct };
