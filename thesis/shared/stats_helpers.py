"""Statistical helpers for thesis analysis."""

from __future__ import annotations

import itertools

import numpy as np
from scipy import stats
from statsmodels.stats.multitest import multipletests


def kruskal_wallis(samples_by_group: dict) -> dict:
    groups = [np.asarray(v, dtype=float) for v in samples_by_group.values() if len(v)]
    labels = [k for k, v in samples_by_group.items() if len(v)]
    if len(groups) < 2:
        return {"H": None, "p": None, "df": None, "eta2": None, "labels": labels}
    stat, p = stats.kruskal(*groups)
    n = sum(len(g) for g in groups)
    eta2 = (stat - len(groups) + 1) / (n - len(groups)) if n > len(groups) else None
    return {
        "H": float(stat),
        "p": float(p),
        "df": len(groups) - 1,
        "eta2": float(eta2) if eta2 is not None else None,
        "labels": labels,
    }


def cliffs_delta(a, b) -> dict:
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    if len(a) == 0 or len(b) == 0:
        return {"delta": None, "magnitude": None}
    greater = sum(1 for x in a for y in b if x > y)
    less = sum(1 for x in a for y in b if x < y)
    delta = (greater - less) / (len(a) * len(b))
    ad = abs(delta)
    if ad < 0.147:
        magnitude = "negligible"
    elif ad < 0.33:
        magnitude = "small"
    elif ad < 0.474:
        magnitude = "medium"
    else:
        magnitude = "large"
    return {"delta": float(delta), "magnitude": magnitude}


def holm_correction(pvalues: list[float]) -> list[float]:
    if not pvalues:
        return []
    _, corrected, _, _ = multipletests(pvalues, method="holm")
    return [float(p) for p in corrected]


def bootstrap_median_ci(values, n: int = 5000, alpha: float = 0.05, seed: int = 42) -> tuple[float, float]:
    arr = np.asarray(values, dtype=float)
    arr = arr[np.isfinite(arr)]
    if len(arr) == 0:
        return (float("nan"), float("nan"))
    if len(arr) == 1:
        return (float(arr[0]), float(arr[0]))
    rng = np.random.default_rng(seed)
    samples = [float(np.median(rng.choice(arr, size=len(arr), replace=True))) for _ in range(n)]
    lo = float(np.percentile(samples, 100 * alpha / 2))
    hi = float(np.percentile(samples, 100 * (1 - alpha / 2)))
    return lo, hi


def bootstrap_jaccard_ci(jaccards, n: int = 5000, alpha: float = 0.05, seed: int = 42) -> tuple[float, float]:
    return bootstrap_median_ci(jaccards, n=n, alpha=alpha, seed=seed)


def welch_t_with_ci(a, b, alpha: float = 0.05) -> dict:
    a = np.asarray(a, dtype=float)
    b = np.asarray(b, dtype=float)
    a = a[np.isfinite(a)]
    b = b[np.isfinite(b)]
    if len(a) < 2 or len(b) < 2:
        return {"t": None, "p": None, "ci_lo": None, "ci_hi": None, "cohens_d": None}
    t_stat, p = stats.ttest_ind(a, b, equal_var=False)
    pooled = np.sqrt(
        ((len(a) - 1) * np.var(a, ddof=1) + (len(b) - 1) * np.var(b, ddof=1)) / (len(a) + len(b) - 2)
    )
    cohens_d = float((np.mean(a) - np.mean(b)) / pooled) if pooled else 0.0
    diff = np.mean(a) - np.mean(b)
    se = np.sqrt(np.var(a, ddof=1) / len(a) + np.var(b, ddof=1) / len(b))
    df_num = (np.var(a, ddof=1) / len(a) + np.var(b, ddof=1) / len(b)) ** 2
    df_den = (
        (np.var(a, ddof=1) / len(a)) ** 2 / (len(a) - 1)
        + (np.var(b, ddof=1) / len(b)) ** 2 / (len(b) - 1)
    )
    df = df_num / df_den if df_den else len(a) + len(b) - 2
    t_crit = stats.t.ppf(1 - alpha / 2, df)
    return {
        "t": float(t_stat),
        "p": float(p),
        "ci_lo": float(diff - t_crit * se),
        "ci_hi": float(diff + t_crit * se),
        "cohens_d": cohens_d,
    }


def pairwise_mann_whitney(
    samples_by_group: dict[str, list[float]],
    metric: str,
) -> list[dict]:
    models = sorted(samples_by_group.keys())
    pairs = list(itertools.combinations(models, 2))
    rows = []
    raw_ps = []
    for model_a, model_b in pairs:
        a = np.asarray(samples_by_group[model_a], dtype=float)
        b = np.asarray(samples_by_group[model_b], dtype=float)
        a = a[np.isfinite(a)]
        b = b[np.isfinite(b)]
        if len(a) and len(b):
            u, p = stats.mannwhitneyu(a, b, alternative="two-sided")
        else:
            u, p = None, None
        delta_info = cliffs_delta(a, b) if len(a) and len(b) else {"delta": None, "magnitude": None}
        rows.append(
            {
                "model_a": model_a,
                "model_b": model_b,
                "metric": metric,
                "U": float(u) if u is not None else None,
                "p_raw": float(p) if p is not None else None,
                "delta": delta_info["delta"],
                "magnitude": delta_info["magnitude"],
            }
        )
        raw_ps.append(float(p) if p is not None else 1.0)
    corrected = holm_correction(raw_ps)
    for row, p_holm in zip(rows, corrected):
        row["p_holm"] = p_holm
    return rows
