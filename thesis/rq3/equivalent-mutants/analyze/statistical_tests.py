"""Statistical helpers for equivalent-mutant analysis."""

from __future__ import annotations

import itertools

import numpy as np
import pandas as pd
from scipy import stats


def bootstrap_ci(
    successes: int,
    total: int,
    *,
    n_bootstrap: int = 5000,
    alpha: float = 0.05,
    seed: int = 42,
) -> tuple[float, float]:
    if total <= 0:
        return (0.0, 0.0)
    rng = np.random.default_rng(seed)
    p = successes / total
    samples = rng.binomial(total, p, size=n_bootstrap) / total * 100.0
    low = float(np.percentile(samples, 100 * alpha / 2))
    high = float(np.percentile(samples, 100 * (1 - alpha / 2)))
    return (low, high)


def _summarize_group(df: pd.DataFrame, group_col: str) -> pd.DataFrame:
    rows: list[dict[str, object]] = []
    for key, group in df.groupby(group_col):
        rates = group["equiv_rate_pct"].to_numpy(dtype=float)
        total_surviving = int(group["total_surviving"].sum())
        predicted_equivalent = int(group["predicted_equivalent"].sum())
        mean_rate = float(np.mean(rates)) if len(rates) else 0.0
        std_rate = float(np.std(rates, ddof=1)) if len(rates) > 1 else 0.0
        min_rate = float(np.min(rates)) if len(rates) else 0.0
        max_rate = float(np.max(rates)) if len(rates) else 0.0
        cov = (std_rate / mean_rate * 100.0) if mean_rate else 0.0
        ci_low, ci_high = bootstrap_ci(predicted_equivalent, total_surviving)
        rows.append(
            {
                group_col: key,
                "n_observations": len(group),
                "total_surviving": total_surviving,
                "predicted_equivalent": predicted_equivalent,
                "mean_equiv_rate_pct": round(mean_rate, 4),
                "std_equiv_rate_pct": round(std_rate, 4),
                "min_equiv_rate_pct": round(min_rate, 4),
                "max_equiv_rate_pct": round(max_rate, 4),
                "range_equiv_rate_pct": f"{min_rate:.1f}%-{max_rate:.1f}%",
                "coeff_of_variation_pct": round(cov, 4),
                "weighted_equiv_rate_pct": round(predicted_equivalent / total_surviving * 100.0, 4)
                if total_surviving
                else 0.0,
                "ci_low_pct": round(ci_low, 4),
                "ci_high_pct": round(ci_high, 4),
            }
        )
    out = pd.DataFrame(rows)
    if group_col == "llm":
        out = out.sort_values("mean_equiv_rate_pct").reset_index(drop=True)
        out["rank"] = np.arange(1, len(out) + 1)
    return out


def compute_llm_summary(per_dataset: pd.DataFrame) -> pd.DataFrame:
    return _summarize_group(per_dataset, "llm")


def compute_package_summary(per_dataset: pd.DataFrame) -> pd.DataFrame:
    return _summarize_group(per_dataset, "package")


def cohens_d(a: np.ndarray, b: np.ndarray) -> float:
    if len(a) < 2 or len(b) < 2:
        return float("nan")
    pooled = np.sqrt(((len(a) - 1) * np.var(a, ddof=1) + (len(b) - 1) * np.var(b, ddof=1)) / (len(a) + len(b) - 2))
    if pooled == 0:
        return 0.0
    return float((np.mean(a) - np.mean(b)) / pooled)


def cliffs_delta(a: np.ndarray, b: np.ndarray) -> float:
    if len(a) == 0 or len(b) == 0:
        return float("nan")
    greater = sum(1 for x in a for y in b if x > y)
    less = sum(1 for x in a for y in b if x < y)
    return float((greater - less) / (len(a) * len(b)))


def pairwise_llm_tests(per_dataset: pd.DataFrame) -> pd.DataFrame:
    from statsmodels.stats.multitest import multipletests

    llms = sorted(per_dataset["llm"].unique())
    pairs = list(itertools.combinations(llms, 2))
    rows: list[dict[str, object]] = []
    for llm_a, llm_b in pairs:
        a = per_dataset.loc[per_dataset["llm"] == llm_a, "equiv_rate_pct"].to_numpy(dtype=float)
        b = per_dataset.loc[per_dataset["llm"] == llm_b, "equiv_rate_pct"].to_numpy(dtype=float)
        if len(a) >= 2 and len(b) >= 2:
            t_stat, p_value = stats.ttest_ind(a, b, equal_var=False)
        else:
            t_stat, p_value = float("nan"), float("nan")
        rows.append(
            {
                "llm_a": llm_a,
                "llm_b": llm_b,
                "mean_a_pct": round(float(np.mean(a)), 4) if len(a) else float("nan"),
                "mean_b_pct": round(float(np.mean(b)), 4) if len(b) else float("nan"),
                "n_a": len(a),
                "n_b": len(b),
                "t_stat": round(float(t_stat), 4) if t_stat == t_stat else float("nan"),
                "p_value": round(float(p_value), 6) if p_value == p_value else float("nan"),
                "cohens_d": round(cohens_d(a, b), 4),
                "cliffs_delta": round(cliffs_delta(a, b), 4),
            }
        )
    p_values = [float(row["p_value"]) for row in rows if row["p_value"] == row["p_value"]]
    if p_values:
        _, holm, _, _ = multipletests(p_values, method="holm")
        holm_map = dict(zip([i for i, row in enumerate(rows) if row["p_value"] == row["p_value"]], holm))
        for i, row in enumerate(rows):
            row["p_value_holm"] = round(float(holm_map[i]), 6) if i in holm_map else float("nan")
    else:
        for row in rows:
            row["p_value_holm"] = float("nan")
    return pd.DataFrame(rows)


def two_way_anova(per_dataset: pd.DataFrame) -> pd.DataFrame:
    """Two-way ANOVA on package-level equivalent rates (LLM x package)."""
    if per_dataset.empty:
        return pd.DataFrame()
    model_df = per_dataset.copy()
    try:
        import statsmodels.formula.api as smf

        model = smf.ols("equiv_rate_pct ~ C(llm) + C(package) + C(llm):C(package)", data=model_df).fit()
        anova = smf.ols("equiv_rate_pct ~ C(llm) + C(package) + C(llm):C(package)", data=model_df).fit()
        table = smf.stats.anova_lm(anova, typ=2)
        table = table.reset_index().rename(columns={"index": "term"})
        return table
    except ImportError:
        # Fallback without statsmodels
        llm_groups = [g["equiv_rate_pct"].values for _, g in model_df.groupby("llm")]
        f_stat, p_value = stats.f_oneway(*llm_groups) if len(llm_groups) > 1 else (float("nan"), float("nan"))
        return pd.DataFrame(
            [
                {
                    "term": "C(llm)",
                    "F": round(float(f_stat), 4) if f_stat == f_stat else float("nan"),
                    "PR(>F)": round(float(p_value), 6) if p_value == p_value else float("nan"),
                    "note": "statsmodels not installed; one-way ANOVA fallback",
                }
            ]
        )
