"""Shared matplotlib/seaborn styling for thesis figures."""

from __future__ import annotations

import os
from pathlib import Path

import matplotlib

matplotlib.use("Agg")
import matplotlib.pyplot as plt  # noqa: E402
import seaborn as sns  # noqa: E402

THESIS_ROOT = Path(__file__).resolve().parent.parent
OUTPUT_FIGURES = THESIS_ROOT / "output" / "figures"
OUTPUT_FIGURES_PNG = THESIS_ROOT / "output" / "figures-png"
OUTPUT_TABLES = THESIS_ROOT / "output" / "tables"
OUTPUT_STATS = THESIS_ROOT / "output" / "stats"
OUTPUT_DATA = THESIS_ROOT / "output" / "data"

BASELINE_LLMORPHEUS = 20.2
BASELINE_STRYKERJS = 4.7

PALETTE_OPEN = "#4C78A8"
PALETTE_API = "#E45756"
PALETTE_HYBRID = "#72B7B2"
MODEL_COLORS = [
    "#4C78A8",
    "#F58518",
    "#E45756",
    "#72B7B2",
    "#54A24B",
    "#EECA3B",
    "#B279A2",
    "#FF9DA6",
]


def ensure_output_dirs() -> None:
    for d in (OUTPUT_FIGURES, OUTPUT_FIGURES_PNG, OUTPUT_TABLES, OUTPUT_STATS, OUTPUT_DATA):
        d.mkdir(parents=True, exist_ok=True)


def setup() -> None:
    cache_dir = THESIS_ROOT / ".matplotlib-cache"
    cache_dir.mkdir(parents=True, exist_ok=True)
    os.environ.setdefault("MPLCONFIGDIR", str(cache_dir))
    ensure_output_dirs()
    sns.set_theme(style="whitegrid", context="paper", font_scale=1.15)
    plt.rcParams.update(
        {
            "figure.dpi": 150,
            "savefig.dpi": 300,
            "savefig.bbox": "tight",
            "savefig.format": "pdf",
            "font.family": "serif",
            "font.serif": ["DejaVu Serif", "STIX Two Text", "Times New Roman"],
            "axes.titlesize": 11,
            "axes.labelsize": 10,
            "xtick.labelsize": 9,
            "ytick.labelsize": 9,
            "legend.fontsize": 9,
            "pdf.fonttype": 42,
            "ps.fonttype": 42,
        }
    )


def save_fig(fig, name: str, *, prefix: str = "") -> tuple[Path, Path]:
    """Save figure as PDF (LaTeX) and PNG (preview)."""
    ensure_output_dirs()
    base = f"{prefix}{name}" if prefix else name
    pdf_path = OUTPUT_FIGURES / f"{base}.pdf"
    png_path = OUTPUT_FIGURES_PNG / f"{base}.png"
    fig.savefig(pdf_path, format="pdf", bbox_inches="tight")
    fig.savefig(png_path, format="png", bbox_inches="tight", dpi=300)
    plt.close(fig)
    return pdf_path, png_path


def category_color(category: str) -> str:
    if category == "open-weight":
        return PALETTE_OPEN
    if category == "api-only":
        return PALETTE_API
    return PALETTE_HYBRID
