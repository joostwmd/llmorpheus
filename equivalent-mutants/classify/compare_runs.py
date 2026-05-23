#!/usr/bin/env python3
"""Print a Markdown table summarizing metrics across ``runs/*/metrics.json``."""

from __future__ import annotations

import argparse
import json
from collections import defaultdict
from pathlib import Path

PACKAGE_ROOT = Path(__file__).resolve().parent
RUNS_DIR = PACKAGE_ROOT / "runs"


def _recall_equiv(row: dict) -> float | None:
    tp, fn = row.get("TP"), row.get("FN")
    try:
        if tp is None or fn is None:
            return row.get("_rec")
        denom = int(tp) + int(fn)
        if denom <= 0:
            return None
        return float(tp) / float(denom)
    except (TypeError, ValueError):
        return None


def gather_rows(runs_dir: Path) -> list[dict]:
    rows: list[dict] = []
    if not runs_dir.is_dir():
        return rows
    for run_dir in sorted(runs_dir.iterdir()):
        if not run_dir.is_dir():
            continue
        mp = run_dir / "metrics.json"
        cp = run_dir / "config.json"
        if not mp.is_file():
            continue
        metrics = json.loads(mp.read_text(encoding="utf-8"))
        cfg = json.loads(cp.read_text(encoding="utf-8")) if cp.is_file() else {}
        cm = metrics.get("confusion_matrix", {})
        re = metrics.get("recall_equiv")
        pe = metrics.get("precision_equiv")
        fe = metrics.get("f1_equiv")
        n_rows = metrics.get("n")

        tp = cm.get("TP")
        fp = cm.get("FP")
        rows.append(
            {
                "run": run_dir.name,
                "n": n_rows,
                "window": cfg.get("window", ""),
                "epochs": cfg.get("epochs", ""),
                "macro_f1": metrics.get("macro_f1"),
                "kappa": metrics.get("kappa"),
                "mcc": metrics.get("mcc"),
                "accuracy": metrics.get("accuracy"),
                "prec_equiv": pe,
                "rec_equiv": re,
                "f1_equiv": fe,
                "TP": tp,
                "FN": cm.get("FN"),
                "FP": fp,
                "TN": cm.get("TN"),
                "chosen_theta": metrics.get("chosen_threshold"),
                "_rec": float(re) if isinstance(re, (int, float)) else None,
            }
        )
        rows[-1]["recall_equiv_derived"] = _recall_equiv(rows[-1])
        rows[-1]["ensemble"] = bool(cfg.get("ensemble")) or (run_dir / "folds").is_dir()
        del rows[-1]["_rec"]
    return rows


def fp_sort_key(fp: object) -> tuple:
    if fp is None:
        return (1, 0)  # push unknown FP to bottom
    try:
        return (0, int(fp))
    except (TypeError, ValueError):
        return (1, 0)


def pick_best(rows: list[dict], *, min_recall_equiv: float | None) -> None:
    """Rank by minimizing FP first, maximizing recall equiv second (same TP class focus)."""
    grouped: dict[int | str, list[dict]] = defaultdict(list)
    for r in rows:
        n = r.get("n")
        key = n if n is not None else "unknown"
        grouped[key].append(r)

    print("### Pick-best ranking (min FP first, then max recall_equiv)\n")
    if min_recall_equiv is not None:
        print(
            f"_Filter: **recall_equiv ≥ {min_recall_equiv:.2f}** (use `--pick-min-recall-equiv 0` to disable)._"
        )
    print("_Lower **FP** = fewer behavioural mutants called equivalent (fewer Type I errors)._")
    print("_Higher **recall equiv** among true equivalents = fewer missed equivalents (**FN**)._")
    print()
    print("| group (n) | run | FP | TP | FN | recall_equiv | prec_equiv | macro_f1 |")
    print("| --- | --- | --- | --- | --- | --- | --- | --- |")
    for group_key in sorted(grouped.keys(), key=lambda x: (x == "unknown", str(x))):
        bucket = grouped[group_key]
        if min_recall_equiv is not None:
            bucket = [
                b
                for b in bucket
                if (b.get("recall_equiv_derived") is not None)
                and (float(b["recall_equiv_derived"]) >= float(min_recall_equiv))
            ]
        if not bucket:
            print(f"| {group_key} | _(no run passes recall filter)_ | | | | | | |")
            continue
        bucket_sorted = sorted(
            bucket,
            key=lambda rr: (
                fp_sort_key(rr.get("FP")),
                -float(rr["recall_equiv_derived"]) if rr.get("recall_equiv_derived") is not None else 0.0,
                -(float(rr["prec_equiv"])) if rr.get("prec_equiv") is not None else 0.0,
                -(float(rr["macro_f1"])) if rr.get("macro_f1") is not None else float("-inf"),
            ),
        )
        c = bucket_sorted[0]
        re = c.get("recall_equiv_derived")
        macro = c.get("macro_f1")
        pe = c.get("prec_equiv")
        print(
            "| "
            + f"{group_key}"
            + " | "
            + c["run"][:72]
            + ("…" if len(c["run"]) > 72 else "")
            + " | "
            + str(c.get("FP", ""))
            + " | "
            + str(c.get("TP", ""))
            + " | "
            + str(c.get("FN", ""))
            + " | "
            + (f"{re:.4f}" if isinstance(re, float) else "")
            + " | "
            + (f"{pe:.4f}" if isinstance(pe, float) else "")
            + " | "
            + (f"{float(macro):.4f}" if isinstance(macro, (int, float)) else "")
            + " |"
        )
    print()


def main() -> None:
    parser = argparse.ArgumentParser(description="Summarize metrics.json across runs/")
    parser.add_argument(
        "--pick-best",
        action="store_true",
        help="After the table: pick winner per evaluation size (n) — min FP first, max recall-equiv second.",
    )
    parser.add_argument(
        "--pick-min-recall-equiv",
        type=float,
        default=0.45,
        help="With --pick-best: ignore runs with recall_equiv below this (default: 0.45). Use 0 to disable.",
    )
    parser.add_argument(
        "--runs-dir",
        type=Path,
        default=RUNS_DIR,
        help="Directory containing training run folders (default: ./runs)",
    )
    args = parser.parse_args()
    rows = gather_rows(Path(args.runs_dir))
    if not rows:
        print(f"No metrics.json files under {args.runs_dir}")
        return

    rows.sort(key=lambda r: float("-inf") if r["macro_f1"] is None else -float(r["macro_f1"]))

    cols = [
        "run",
        "n",
        "window",
        "epochs",
        "ensemble",
        "macro_f1",
        "kappa",
        "mcc",
        "prec_equiv",
        "rec_equiv",
        "f1_equiv",
        "accuracy",
        "TP",
        "FP",
        "FN",
        "TN",
    ]
    print("| " + " | ".join(cols) + " |")
    print("| " + " | ".join("---" for _ in cols) + " |")
    for r in rows:
        cells = []
        for c in cols:
            v = r.get(c)
            if c == "ensemble":
                cells.append("yes" if v else "")
            elif isinstance(v, float):
                cells.append(f"{v:.4f}")
            elif v is None:
                cells.append("")
            else:
                cells.append(str(v))
        print("| " + " | ".join(cells) + " |")

    if args.pick_best:
        print()
        min_re = args.pick_min_recall_equiv
        pick_best(rows, min_recall_equiv=None if min_re == 0 else min_re)
        print()
        print(
            "**Headline (thesis inference — full labeled set, ensembles):** "
            "`ensemble-20260517-130830Z-…-equiv-push-v1` — **fewest FP (19)** among full-benchmark ensembles "
            "with **similar recall-equiv** (~0.54), **best macro‑F₁** (~0.797 vs ~0.786 for best-effort), "
            "**κ** and **MCC** lead the table.\n\n"
            "Stored **`metrics.json`** uses **`chosen_threshold` ≈ 0.94** (macro‑F₁ on OOF). "
            "For **cross‑generator counts**, you may prefer a fixed **`--threshold 0.80`** "
            "(see README / MODEL_SELECTION)."
        )


if __name__ == "__main__":
    main()
