# RQ3 — Analysis summary

## Question
How likely are different models to generate equivalent mutants?

## Answer (short)
Per-model **mean** predicted equivalence rates among survivors span **17.1%** (Llama 3.1 8B) to **24.0%** (DeepSeek Chat v3.1), bracketing Tip et al. (2025) **20.2%** manual baseline (directional only). Portfolio-weighted rate across all models is **11.1%** (883 / 7,962 survivors). **No pairwise model difference is significant** after Holm correction (all *p*_holm = 1.0). **Effective survivors** range **520–837** on run1 — use these instead of raw survivor counts for gap-finding comparisons.

## Key numbers

### Per-model (run1, mean equiv. rate across 6 packages, θ = 0.80)

| Model | Mean equiv. (%) | Weighted equiv. (%) | Total survivors | Effective survivors | Rank |
|-------|-----------------|---------------------|-----------------|---------------------|------|
| Llama 3.1 8B | 17.1 | 6.6 | 761 | 711 | 1 |
| GPT-4o | 17.5 | 11.0 | 854 | 760 | 2 |
| Qwen 2.5 Coder 32B | 20.4 | 7.8 | 714 | 658 | 3 |
| Gemini 3.5 Flash | 20.5 | 13.1 | 963 | 837 | 4 |
| Claude Sonnet 4.5 | 21.0 | 11.9 | 704 | 620 | 5 |
| Gemini 3.1 Flash Lite | 21.4 | 13.8 | 855 | 737 | 6 |
| Claude Haiku 4.5 | 21.6 | 12.2 | 592 | 520 | 7 |
| Llama 3.3 70B | 22.0 | 11.1 | 844 | 750 | 8 |
| GPT-4o-mini | 23.3 | 9.4 | 742 | 672 | 9 |
| DeepSeek Chat v3.1 | 24.0 | 12.8 | 933 | 814 | 10 |
| *Tip et al. manual* | *20.2* | — | — | — | — |

### Package heterogeneity (weighted equiv. rate, all models)

| Package | Weighted equiv. (%) |
|---------|---------------------|
| pull-stream | 1.9 |
| Complex.js | 10.6 |
| node-jsonfile | 23.1 |
| countries-and-timezones | 43.7 |
| spacl-core | 46.9 |
| zip-a-folder | 0.0 |

## Statistical tests
- 45 pairwise Welch *t*-tests on per-package means; **0 significant** at α = 0.05 raw; **all Holm *p* = 1.0**.
- Largest Cohen's *d* = 0.33 (DeepSeek vs GPT-4o) — still non-significant.

## Interpretation
- Survivor inflation is **moderate** (~1 in 5 at mean-rate level); aligned directionally with paper 20.2%.
- **High raw survivors ≠ high equivalence** — Gemini 3.5 leads both raw (963) and effective (837) survivors.
- Package composition dominates (pull-stream 32% of survivors at ~1.9% equiv.).
- Classifier outputs are **predicted** equivalence (macro-F1 ≈ 0.80); behavioral-change calls more reliable than equivalent calls.

## Caveats
- run1 only for publication lock; `statistical_summary.json` (276 datasets) mixes all reps — do not use for headline rates.
- Six-package subset; automated vs manual labels; survivors-only denominator.
- Low power (6 packages) → null pairwise tests are not proof of equality.

## Evidence
- **Source of truth:** `thesis/rq3/FINDINGS.md`
- `thesis/rq3/output/publication/llm_summary.csv`
- `thesis/rq3/output/publication/package_summary.csv`
- `thesis/rq3/output/publication/pairwise_llm_tests.csv`
- `thesis/rq3/output/publication/aggregated_results.csv`
- `thesis/rq3/output/publication/main_results.tex`

## Figures
- `thesis/rq3/output/publication/llm_comparison_boxplot.pdf`
- `thesis/rq3/output/publication/effective_survivors.pdf`
- `thesis/rq3/output/publication/llm_means_errorbar.pdf`

## Open questions (for Synthesis / Critique)
- Should Results report mean or weighted equiv. rate as primary? (Mean for cross-model fairness; weighted for portfolio interpretation.)
- How strongly does package heterogeneity threaten cross-model ranking claims?
- Per-package stratification warranted in Discussion for `countries-and-timezones` / `spacl-core`?
