# RQ3 — Findings (source of truth)

**Research question:** How likely are different models to generate equivalent mutants?

**Last locked from artifacts:** `thesis/rq3/output/publication/` (run1, θ = 0.80). Do not cite numbers not present in cited CSVs/JSON below.

---

## Data lock

| Field | Value |
|-------|-------|
| **Input** | Stryker survivors from RQ1, run1 only |
| **Denominator** | Surviving mutants only (aligned with Tip et al., 2025 manual study) |
| **Classifier** | UniXCoder ensemble, operational threshold **θ = 0.80** |
| **Scope** | 10 models × 6 packages (thesis-six) × 1 run = **60 model–package cells** |
| **Total survivors (run1)** | **7,962** across all models (`llm_summary.csv`, sum of `total_surviving`) |
| **Total predicted equivalent** | **883** |
| **Total effective survivors** | **7,079** (= survivors − predicted equivalent) |
| **Portfolio-weighted equivalence rate** | **11.09%** (= 883 / 7,962) |
| **Publication ranking metric** | **Mean equivalence rate** across 6 packages per model (unweighted package mean) |
| **Not in publication lock** | `statistical_summary.json` aggregates **276 datasets** (all reps); use for pipeline metadata only, not headline RQ3 rates |

**Classifier validation (Methods reference, not re-estimated here):** macro-F1 ≈ 0.797 on gold corpus; behavioral-change predictions ~99% precision; equivalent precision ~78% at θ = 0.80. All applied labels are **predicted**, not ground-truth proofs.

---

## Headline answer

Predicted equivalence rates among survivors **differ across modern models but not dramatically**: per-model **mean** rates span **17.1%** (Llama 3.1 8B) to **24.0%** (DeepSeek Chat v3.1), bracketing the Tip et al. (2025) **20.2%** manual baseline. **No pairwise model difference is statistically significant** after Holm correction (all adjusted *p* = 1.0). Equivalence screening materially reframes survivor comparisons: **effective survivors** (predicted behavioral change) range from **520** (Claude Haiku 4.5) to **837** (Gemini 3.5 Flash) on run1, decoupling raw survivor volume from gap-finding potential.

**Directional comparison to paper (not replication):** Thesis mean rates **17–24%** vs paper **20.2%** manual — aligned in magnitude. Corpus (6 vs 13 packages), labeling method (automated vs manual), and model set differ; treat as contextual reference only (Discussion §5.8).

---

## Key metrics tables

### Table RQ3-A — Per-model equivalence and effective survivors (run1)

Source: `llm_summary.csv`. **Mean equiv. rate** = unweighted mean of per-package rates. **Weighted equiv. rate** = `predicted_equivalent / total_surviving` (portfolio). **Effective survivors** = `total_surviving − predicted_equivalent`. Rank = ascending mean rate (1 = lowest predicted equivalence).

| Rank | Model | Mean equiv. rate (%) | Std dev (%) | Weighted equiv. rate (%) | 95% CI weighted (%) | Total survivors | Predicted equivalent | Effective survivors |
|------|-------|---------------------|-------------|--------------------------|---------------------|-----------------|--------------------|---------------------|
| 1 | Llama 3.1 8B | 17.08 | 20.26 | 6.57 | 4.86 – 8.41 | 761 | 50 | 711 |
| 2 | GPT-4o | 17.47 | 15.18 | 11.01 | 9.02 – 13.11 | 854 | 94 | 760 |
| 3 | Qwen 2.5 Coder 32B | 20.38 | 21.79 | 7.84 | 5.88 – 9.94 | 714 | 56 | 658 |
| 4 | Gemini 3.5 Flash | 20.47 | 19.65 | 13.08 | 11.11 – 15.16 | 963 | 126 | 837 |
| 5 | Claude Sonnet 4.5 | 20.95 | 18.63 | 11.93 | 9.66 – 14.35 | 704 | 84 | 620 |
| 6 | Gemini 3.1 Flash Lite | 21.40 | 19.93 | 13.80 | 11.58 – 16.14 | 855 | 118 | 737 |
| 7 | Claude Haiku 4.5 | 21.62 | 20.88 | 12.16 | 9.63 – 14.86 | 592 | 72 | 520 |
| 8 | Llama 3.3 70B | 21.99 | 21.35 | 11.14 | 9.12 – 13.27 | 844 | 94 | 750 |
| 9 | GPT-4o-mini | 23.29 | 27.34 | 9.43 | 7.41 – 11.59 | 742 | 70 | 672 |
| 10 | DeepSeek Chat v3.1 | 24.04 | 23.59 | 12.75 | 10.72 – 14.90 | 933 | 119 | 814 |
| — | *Tip et al. (2025) manual* | *20.2* | — | — | — | — | — | — |
| — | *StrykerJS operator baseline* | *4.7* | — | — | — | — | — | — |

**Note on two rate definitions:** Headline cross-model comparison uses **mean equiv. rate** (17–24%) because it treats each package equally. **Weighted** rates are lower for several models because **pull-stream** contributes 2,580/7,962 survivors (32.4%) at ~1.9% equivalence (`package_summary.csv`), pulling portfolio rates down. Report both when interpreting “~one in five equivalents” vs study-wide 11.1% weighted rate.

### Table RQ3-B — Per-package equivalence (run1, all models pooled)

Source: `package_summary.csv`. Weighted rate uses all 10 models' survivors in that package.

| Package | Total survivors | Predicted equivalent | Weighted equiv. rate (%) | Mean equiv. rate across models (%) |
|---------|-----------------|----------------------|--------------------------|-----------------------------------|
| Complex.js | 4,307 | 458 | 10.63 | 10.40 |
| countries-and-timezones | 378 | 165 | 43.65 | 43.25 |
| node-jsonfile | 389 | 90 | 23.14 | 22.95 |
| pull-stream | 2,580 | 48 | 1.86 | 1.89 |
| spacl-core | 260 | 122 | 46.92 | 46.74 |
| zip-a-folder | 48 | 0 | 0.00 | 0.00 |

**Package-driven variance:** Equivalence is highly package-dependent. Small packages (`countries-and-timezones`, `spacl-core`) show **43–47%** weighted equivalence; high-volume `pull-stream` shows **1.86%**. Per-model means inherit this heterogeneity (high CoV, 87–118% for several models).

### Table RQ3-C — Effective survivors vs raw survivors (run1 cross-link)

Source: `llm_summary.csv` + `thesis/rq1/output/publication/model_summary.csv` (median survivors per package).

| Model | Median survivors/pkg (RQ1) | Total survivors run1 (RQ3) | Effective survivors | Effective share of raw (%) |
|-------|---------------------------|---------------------------|---------------------|---------------------------|
| Gemini 3.5 Flash | 47.5 | 963 | 837 | 86.9 |
| DeepSeek Chat v3.1 | 42.5 | 933 | 814 | 87.2 |
| GPT-4o | 37.0 | 854 | 760 | 89.0 |
| Llama 3.3 70B | 43.5 | 844 | 750 | 88.9 |
| Gemini 3.1 Flash Lite | 37.0 | 855 | 737 | 86.2 |
| Llama 3.1 8B | 44.5 | 761 | 711 | 93.4 |
| GPT-4o-mini | 30.5 | 742 | 672 | 90.6 |
| Qwen 2.5 Coder 32B | 23.5 | 714 | 658 | 92.2 |
| Claude Sonnet 4.5 | 42.0 | 704 | 620 | 88.1 |
| Claude Haiku 4.5 | 39.0 | 592 | 520 | 87.8 |

**Key pattern:** Gemini 3.5 Flash leads raw survivors (RQ1) and effective survivors (RQ3) despite a middling mean equivalence rate (20.5%). Llama 3.1 8B has the **lowest** mean equivalence rate but not the most effective survivors (rank 6/10 by count) because survivor volume is lower than top generators.

### Table RQ3-D — Selected per-package cells (illustrative extremes)

Source: `aggregated_results.csv`.

| Model | Package | Survivors | Predicted equiv. | Rate (%) |
|-------|---------|-----------|------------------|----------|
| GPT-4o-mini | countries-and-timezones | 42 | 27 | 64.29 |
| Llama 3.1 8B | Complex.js | 408 | 7 | 1.72 |
| DeepSeek Chat v3.1 | spacl-core | 35 | 19 | 54.29 |
| Qwen 2.5 Coder 32B | pull-stream | 247 | 2 | 0.81 |
| All models | zip-a-folder | 48 total | 0 | 0.00 |

---

## Statistical tests

Source: `pairwise_llm_tests.csv` (Welch *t*-tests on per-package mean equivalence rates, *n* = 6 packages per model).

| Result | Detail |
|--------|--------|
| **Pairwise comparisons** | 45 model pairs tested |
| **Significant at α = 0.05 (raw)** | **0** pairs (smallest raw *p* = 0.581, DeepSeek vs GPT-4o) |
| **Holm-adjusted *p*** | **All 1.0** — no significant differences after correction |
| **Largest effect (Cohen's *d*)** | DeepSeek vs GPT-4o: *d* = 0.331 (still non-significant) |
| **Cliff's delta range** | −0.17 to +0.19 — negligible practical effects |

**Interpretation of null result:** With only 6 packages per model, high within-model variance (CoV up to 118%) overwhelms between-model differences. Equivalence rates are **not a strong discriminator** among modern models under this design; package choice dominates.

**Tests not reported in publication CSVs:** No global ANOVA/Kruskal file in `publication/`; inference limited to pairwise exports.

---

## Interpretation

1. **Survivor inflation is real but moderate.** Roughly **one in five** surviving mutants is predicted equivalent at the **per-model mean** level (17–24%), consistent directionally with Tip et al.'s **20.2%** manual rate. Portfolio-weighted rate is **11.1%** because survivor mass concentrates in low-equivalence packages (especially `pull-stream`).

2. **High survivor count ≠ high equivalence rate.** Gemini 3.5 Flash has the most survivors (963) but mean equivalence 20.5% (rank 4/10). Equivalence does not explain away its survivor lead; it still yields the most effective survivors (837).

3. **Effective survivors reorder gap-finding potential.** Models with fewer raw survivors can still offer competitive effective counts (e.g., GPT-4o: 760 effective from 854 raw). For test-gap discovery, prefer **effective survivors** over raw counts.

4. **Package composition is the dominant confound.** `countries-and-timezones` and `spacl-core` drive high per-model means; `pull-stream` and `zip-a-folder` anchor lows. Cross-model comparison without package stratification is fragile.

5. **Classifier asymmetry.** Behavioral-change calls are high-precision (~99%); equivalent calls are more error-prone (~78% precision at θ = 0.80). Effective survivor counts are **more trustworthy** than equivalent counts; false-equivalent predictions would deflate effective counts slightly.

6. **All models exceed operator baseline.** Every model's mean rate exceeds the StrykerJS operator reference (4.7%), confirming LLM-generated survivors carry more equivalence risk than traditional operators — but not dramatically more than the original LLMorpheus manual estimate.

---

## Caveats

| Caveat | Impact |
|--------|--------|
| **Predicted, not proven equivalence** | UniXCoder screening; no manual re-labeling at thesis scale |
| **θ = 0.80 operational choice** | Lower recall on equivalents vs θ ≈ 0.94 OOF optimum; biases toward fewer equivalent calls |
| **run1 only** | Publication lock uses single rep; `statistical_summary.json` (276 datasets) mixes multi-rep data — do not mix |
| **Six-package subset** | Not comparable to paper's 13-package aggregate without corpus caveat |
| **Survivors-only denominator** | Matches paper RQ2; does not reflect equivalence among killed/invalid mutants |
| **Small-*n* package tests** | 6 packages → low power; null pairwise results are not evidence of equality |
| **Tip et al. comparison** | Directional only; manual labels, different models, different corpus |
| **Package size imbalance** | `pull-stream` supplies 32% of all survivors; means vs weighted rates diverge |

---

## Artifact index

### Publication (main paper)

| Artifact | Path | Use |
|----------|------|-----|
| Model summary CSV | `thesis/rq3/output/publication/llm_summary.csv` | Table RQ3-A, ranking, CIs |
| Per-cell results | `thesis/rq3/output/publication/aggregated_results.csv` | Package × model detail |
| Package summary | `thesis/rq3/output/publication/package_summary.csv` | Table RQ3-B |
| Pairwise tests | `thesis/rq3/output/publication/pairwise_llm_tests.csv` | Statistical tests section |
| Main results TeX | `thesis/rq3/output/publication/main_results.tex` | Table RQ3-A (LaTeX) |
| Boxplot | `thesis/rq3/output/publication/llm_comparison_boxplot.pdf` | Figure RQ3-1 |
| Effective survivors | `thesis/rq3/output/publication/effective_survivors.pdf` | Figure RQ3-2 |
| Error bars | `thesis/rq3/output/publication/llm_means_errorbar.pdf` | Figure RQ3-3 |

### Central thesis outputs

| Artifact | Path |
|----------|------|
| Main results table | `thesis/output/tables/rq3_main_results.tex` (if synced) |

### Appendix (supplementary)

| Artifact | Path |
|----------|------|
| Pairwise tests TeX | `thesis/rq3/output/appendix/statistical_tests.tex` |
| Package heatmap | `thesis/rq3/output/appendix/llm_package_heatmap.pdf` |
| Score vs equiv. scatter | `thesis/rq3/output/appendix/score_vs_equiv_rate.pdf` |

### Cross-RQ dependencies

| Artifact | Path | Role |
|----------|------|------|
| RQ1 model summary | `thesis/rq1/output/publication/model_summary.csv` | Survivor counts, mutation scores |
| RQ4 cost adjustment | `thesis/rq4/output/publication/model_cost_summary.csv` | Uses non-equiv counts from RQ3 |

### Pipeline metadata (not headline numbers)

| Artifact | Path | Note |
|----------|------|------|
| Statistical summary JSON | `thesis/rq3/output/publication/statistical_summary.json` | 276 datasets, all reps; overall 10.88% |

---

## Outline snippets

### Block RQ3 — Results chapter (§4.3)

**Answer sentence (fill from lock):**  
Answer to RQ3: Predicted equivalence rates among survivors on run1 data ranged from **17.1%** (Llama 3.1 8B) to **24.0%** (DeepSeek Chat v3.1) by per-model mean across six packages (Table RQ3-A; Figures RQ3-1–RQ3-3). The portfolio-weighted rate was **11.1%** (883 / 7,962 survivors). This is directionally consistent with **20.2%** from manual labeling in Tip et al. (2025) — not a replication claim. No pairwise model difference was statistically significant after Holm correction. Effective survivors (predicted behavioral change) ranged from **520** to **837**, reframing models with high raw survivor counts.

**Pipeline:**
```
Stryker survivors (run1) --> UniXCoder classify (θ = 0.80) --> equiv rate + effective survivors
```

**Figures / tables to cite:**
- Table RQ3-A — `main_results.tex`
- Figure RQ3-1 — `llm_comparison_boxplot.pdf`
- Figure RQ3-2 — `effective_survivors.pdf`
- Figure RQ3-3 — `llm_means_errorbar.pdf`
- Appendix: `statistical_tests.tex`, `llm_package_heatmap.pdf`

### Discussion §5.8 — Directional comparison to Tip et al.

- Report mean rates **17–24%** vs paper **20.2%**; emphasize automated vs manual labeling and six-package corpus.
- Note portfolio-weighted **11.1%** is **not** directly comparable to paper headline without package-composition discussion.
- Overlapping models (`gpt-4o-mini`, `llama-3.3-70b-instruct`): cite per-package cells in `aggregated_results.csv` for directional drift, not aggregate claim.

### RQ4 / RQ5 handoff

- Export **effective survivor counts** per model to RQ4 `portfolioCostPerNonEquiv` and RQ5 category aggregates.
- Non-equivalent survivor totals per model (run1): 711, 760, 658, 837, 620, 737, 520, 750, 672, 814 (Llama 8B through DeepSeek, same order as Table RQ3-A).
