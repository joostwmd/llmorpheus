# RQ2 Findings (source of truth)

## Data lock

| Field | Value |
|-------|-------|
| **Lock date** | June 2026 |
| **Unit of analysis (primary)** | **42** model-package cells: 7 multi-run models × 6 packages; each cell has 5 reps |
| **Unit of analysis (rep-level)** | **210** datasets: 7 × 6 × 5 |
| **Models included** | 7 multi-run models only |
| **Models excluded** | GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5 (single-run policy) |
| **Replications** | **5** per model per package (`rep1`–`rep5`) |
| **Config** | template-full, T = 0, maxTokens = 250, reasoning disabled |
| **Primary CSV** | `thesis/rq2/output/publication/model_consistency_summary.csv` |
| **Per-package CSV** | `thesis/rq2/output/appendix/consistency_by_model_package.csv` |
| **Publication table** | `thesis/rq2/output/publication/consistency.tex` |

## Headline answer

Cross-run consistency varies **dramatically** even at T = 0. Median Jaccard overlap ranges from **0.505** (Llama 3.3 70B, least stable) to **0.993** (Claude Haiku 4.5, most stable) across packages. Open-weight Llama models and DeepSeek overlap only ~50–56% of mutants across runs; Qwen (0.903) and Claude Haiku (0.993) are highly reproducible. Mutation-score CV stays below 1.5% for all models, but **survivor-count CV reaches 8.4%** for GPT-4o-mini — aggregate scores can appear stable while underlying mutant sets differ substantially.

Kruskal–Wallis on per-package mean Jaccard (7 groups × 6 observations) is **highly significant** (p = 3.98 × 10⁻⁶), confirming model-specific stability differences.

## Key metrics tables (from CSVs - exact numbers)

### Model-level consistency summary (median across 6 packages)

Source: `thesis/rq2/output/publication/model_consistency_summary.csv` and `consistency.tex`

| Model | Mean Jaccard overlap | CV mutation score (%) | CV survivors (%) | CV edit distance (%) |
|-------|---------------------|----------------------|------------------|---------------------|
| Llama 3.3 70B | **0.505** | 1.02 | 4.74 | 3.45 |
| Llama 3.1 8B | 0.517 | 1.29 | 3.74 | 6.30 |
| DeepSeek Chat v3.1 | 0.559 | 1.35 | 4.78 | 6.21 |
| GPT-4o-mini | 0.574 | 1.12 | **8.40** | 2.27 |
| Gemini 3.1 Flash Lite | 0.820 | 0.52 | 3.01 | 0.00 |
| Qwen 2.5 Coder 32B | 0.903 | 0.23 | 1.35 | 0.00 |
| Claude Haiku 4.5 | **0.993** | 0.25 | 0.77 | 0.00 |

**Jaccard range (locked):** 0.505 (Llama 3.3 70B) → 0.993 (Claude Haiku 4.5).

**Rounded publication values** (`consistency.tex`): 0.505, 0.517, 0.559, 0.574, 0.820, 0.903, 0.993.

### Per-package Jaccard overlap (mean across 5 reps)

Source: `thesis/rq2/output/appendix/consistency_by_model_package.csv`

| Model | Complex.js | countries-and-timezones | node-jsonfile | pull-stream | spacl-core | zip-a-folder |
|-------|-----------|------------------------|---------------|-------------|------------|--------------|
| Claude Haiku 4.5 | 0.996 | 0.995 | 0.991 | 0.991 | 0.989 | **1.000** |
| Qwen 2.5 Coder 32B | 0.922 | 0.925 | 0.903 | 0.903 | 0.900 | 0.893 |
| Gemini 3.1 Flash Lite | 0.824 | 0.818 | 0.851 | 0.823 | 0.766 | 0.753 |
| GPT-4o-mini | 0.604 | 0.560 | 0.587 | 0.588 | 0.520 | 0.554 |
| DeepSeek Chat v3.1 | 0.579 | 0.480 | 0.586 | 0.588 | 0.482 | 0.540 |
| Llama 3.1 8B | 0.505 | 0.549 | 0.529 | 0.479 | 0.487 | 0.544 |
| Llama 3.3 70B | 0.506 | 0.504 | 0.492 | 0.508 | **0.395** | 0.589 |

Lowest single cell: Llama 3.3 70B on spacl-core (0.395). Highest: Claude Haiku on zip-a-folder (1.000).

### Per-package outlier: Llama 3.1 8B on zip-a-folder

| Metric | Value |
|--------|-------|
| meanJaccardOverlap | 0.544 |
| cvMutationScore | **22.25%** |
| cvSurvivors | **135.84%** |
| mutationScoreRange | 48.38 pp |
| survivorRange | 51 |

This package drives extreme variability for Llama 3.1 8B; other packages show CV mutation score 0.25–2.14%.

### Mutant trial counts (5-rep aggregation)

Source: `thesis/rq2/output/appendix/mutant_trial_counts.csv`

Shows how many distinct mutants appear in 1, 2, …, 5 runs (illustrates stable vs ephemeral mutants):

| Model | Total distinct mutants (6 pkg) | Appear in all 5 runs | Appear in exactly 1 run |
|-------|------------------------------|----------------------|-------------------------|
| Claude Haiku 4.5 | 1,781 | **1,755** (98.5%) | 11 (0.6%) |
| Qwen 2.5 Coder 32B | 2,999 | **2,479** (82.7%) | 173 (5.8%) |
| Gemini 3.1 Flash Lite | 3,276 | 2,222 (67.8%) | 191 (5.8%) |
| GPT-4o-mini | 4,183 | 1,380 (33.0%) | 1,224 (29.3%) |
| Llama 3.3 70B | 5,177 | 1,284 (24.8%) | 1,849 (35.7%) |
| Llama 3.1 8B | 4,821 | 1,078 (22.4%) | 1,750 (36.3%) |
| DeepSeek Chat v3.1 | 4,704 | 1,448 (30.8%) | 1,474 (31.3%) |

Claude Haiku: nearly all mutants stable across all 5 runs. Llama models: majority of mutants appear in only one run.

### Bootstrap 95% CIs (median Jaccard)

Source: `thesis/output/stats/rq2_bootstrap_ci.csv`

| Model | Jaccard median [lo, hi] |
|-------|------------------------|
| Claude Haiku 4.5 | [0.990, 0.998] |
| Qwen 2.5 Coder 32B | [0.897, 0.923] |
| Gemini 3.1 Flash Lite | [0.759, 0.838] |
| GPT-4o-mini | [0.537, 0.596] |
| DeepSeek Chat v3.1 | [0.481, 0.587] |
| Llama 3.1 8B | [0.483, 0.547] |
| Llama 3.3 70B | [0.444, 0.548] |

Non-overlapping CI bands separate the stable tier (Haiku, Qwen) from the unstable tier (Llama, DeepSeek, GPT-4o-mini).

### Longitudinal peers (RQ2 stability)

| Model | Mean Jaccard | CV survivors | Paper overlap |
|-------|-------------|--------------|---------------|
| **GPT-4o-mini** | 0.574 | 8.40% | Also in Tip et al.; instability persists at T = 0 |
| **Llama 3.3 70B** | 0.505 | 4.74% | Also in Tip et al.; lowest Jaccard in this study |

Both longitudinal peers fall in the **low-stability tier** (Jaccard < 0.6) despite competitive RQ1 mutation scores.

## Statistical tests (p-values, effect sizes, unit of analysis)

### Kruskal–Wallis (mean Jaccard overlap)

| Field | Value |
|-------|-------|
| **Unit of analysis** | One observation = mean Jaccard for one model on one package (6 per model, 7 models) |
| **n** | 42 |
| **H** | 35.176 |
| **df** | 6 |
| **p** | **3.98 × 10⁻⁶** |
| **η²** | 0.834 |

Model identity strongly predicts cross-run stability; unlike RQ1 mutation scores, Jaccard differences are statistically robust.

### Pairwise Mann–Whitney on mean Jaccard (Holm-corrected)

Source: `thesis/output/stats/rq2_pairwise.csv` — 21 pairs.

**Significant pairs (p_holm < 0.05):**

| Comparison | U | p_raw | p_holm | Cliff's δ | Magnitude |
|------------|---|-------|--------|-----------|-----------|
| Haiku vs DeepSeek | 36 | 0.002 | **0.045** | 1.0 | large |
| Haiku vs Gemini 3.1 FL | 36 | 0.002 | **0.045** | 1.0 | large |
| Haiku vs Llama 3.1 8B | 36 | 0.002 | **0.045** | 1.0 | large |
| Haiku vs Llama 3.3 70B | 36 | 0.002 | **0.045** | 1.0 | large |
| Haiku vs GPT-4o-mini | 36 | 0.002 | **0.045** | 1.0 | large |
| Haiku vs Qwen | 36 | 0.002 | **0.045** | 1.0 | large |
| DeepSeek vs Qwen | 0 | 0.002 | **0.045** | −1.0 | large |
| Gemini 3.1 FL vs Qwen | 0 | 0.002 | **0.045** | −1.0 | large |
| Llama 3.1 8B vs Qwen | 0 | 0.002 | **0.045** | −1.0 | large |
| Llama 3.3 70B vs Qwen | 0 | 0.002 | **0.045** | −1.0 | large |
| GPT-4o-mini vs Qwen | 0 | 0.002 | **0.045** | −1.0 | large |

**Additional notable pairs (p_holm ≥ 0.05 but large raw effects):**
- Llama 3.1 8B vs GPT-4o-mini: p_holm = 0.091, δ = −0.833, large
- Llama 3.3 70B vs GPT-4o-mini: p_holm = 0.206, δ = −0.722, large

Haiku is significantly more stable than every other model. Qwen is significantly more stable than all models except Haiku (Haiku vs Qwen: p_holm = 0.045, δ = 1.0 — Haiku wins all 6 package comparisons).

### CV metrics (descriptive, no omnibus test)

CV mutation score, survivors, and edit distance are summarized per model in `consistency.tex`. No formal multi-group test is run on CV values; they serve as secondary stability indicators.

## Interpretation

1. **T = 0 does not guarantee reproducibility.** Llama 3.3 70B at T = 0 reproduces only ~50% of mutants across runs (Jaccard 0.505). Provider-side non-determinism, floating-point batching, or prompt-path sensitivity likely contribute.

2. **Stability is model-specific, not category-specific.** Open-weight Llama models are the *least* stable; API-only Claude Haiku is the *most* stable. Category labels (open-weight vs API-only) do not predict Jaccard.

3. **Low score CV masks high set variability.** All models show mutation-score CV below 1.5%, yet Jaccard ranges from 0.5 to 1.0. Aggregate scores drift little while the underlying mutant sets differ materially — a critical distinction for practitioners.

4. **Survivor counts are less stable than scores.** GPT-4o-mini survivor CV (8.40%) exceeds its score CV (1.12%) by ~7×. Test-gap signals (survivors) are noisier than test-strength signals (mutation score).

5. **Two stability tiers emerge:**
   - **High stability (Jaccard ≥ 0.82):** Claude Haiku (0.993), Qwen (0.903), Gemini 3.1 Flash Lite (0.820)
   - **Low stability (Jaccard ≤ 0.59):** Llama 3.3 70B (0.505), Llama 3.1 8B (0.517), DeepSeek (0.559), GPT-4o-mini (0.574)

6. **Longitudinal peers remain unstable.** GPT-4o-mini (0.574) and Llama 3.3 70B (0.505) — both in Tip et al. (2025) — confirm that T = 0 instability is not a new phenomenon for these models.

7. **CI/benchmark implications.** Models with Jaccard < 0.6 may produce materially different mutant sets on repeated runs, limiting fair benchmark comparability and requiring multi-run aggregation or stability-aware reporting.

8. **Mutant trial counts quantify the mechanism.** Claude Haiku: 98.5% of distinct mutants appear in all 5 runs. Llama 3.3 70B: only 24.8% appear in all 5 runs; 35.7% appear in exactly one run.

## Caveats

- **Scope limited to 7 affordable models:** GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5 excluded (single-run policy). Stability of expensive models is unknown.
- **Six packages:** Package-specific outliers (e.g., Llama 3.1 8B on zip-a-folder with CV 135% for survivors) may not generalize.
- **Jaccard definition:** Based on (startLine, startColumn, originalCode, replacement) tuple equality; syntactically different but semantically equivalent mutants count as distinct.
- **OpenRouter serving:** All models via API; stability may differ under self-hosted deployment.
- **Not included in RQ5 category comparison:** Cross-run Jaccard excluded from open-weight vs API-only synthesis due to unequal run counts across categories (`thesis_context.md`).
- **Edit-distance CV = 0.00%:** For Haiku, Qwen, and Gemini 3.1 Flash Lite, median absolute Levenshtein is identical across all 5 runs on all packages (descriptive zero, not a computation error).

## Artifact index

| Artifact | Path | Description |
|----------|------|-------------|
| Model summary CSV | `thesis/rq2/output/publication/model_consistency_summary.csv` | Primary metrics |
| Consistency TeX | `thesis/rq2/output/publication/consistency.tex` | Publication table |
| Per-package CSV | `thesis/rq2/output/appendix/consistency_by_model_package.csv` | 42 model-package cells |
| Per-package TeX | `thesis/rq2/output/appendix/per_package_consistency.tex` | Appendix table |
| Pairwise Jaccard CSV | `thesis/rq2/output/appendix/pairwise_jaccard.csv` | All run-pair Jaccards |
| Pairwise tests | `thesis/output/stats/rq2_pairwise.csv` | Mann–Whitney on mean Jaccard |
| Bootstrap CIs | `thesis/output/stats/rq2_bootstrap_ci.csv` | 95% CIs |
| Mutant trial counts | `thesis/rq2/output/appendix/mutant_trial_counts.csv` | Stable/variable/unique breakdown |
| Per-run long CSV | `thesis/rq2/output/appendix/per_run_long.csv` | Rep-level metrics |
| Jaccard box plot | `thesis/rq2/output/publication/jaccard_box.pdf` | Distribution figure |
| Variability stacked | `thesis/rq2/output/publication/mutant_variability_stacked.pdf` | Trial count visualization |
| CV grouped bar | `thesis/rq2/output/appendix/cv_grouped_bar.pdf` | CV comparison |
| Within-model heatmap | `thesis/rq2/output/appendix/within_model_jaccard_heatmap.pdf` | Run-vs-run overlap |
| Central table | `thesis/output/tables/rq2_consistency.tex` | Aggregated output |
| Spec | `thesis/rq2/spec.md` | Methodology |
| Index | `thesis/rq2/output/artifacts_index.md` | Placement guide |
| Short summary | `thesis/workspace/analysis/rq2_summary.md` | Agent handoff |

## Outline snippets (copy-paste answer sentences)

- Cross-run consistency varies widely even at T = 0: median Jaccard overlap ranges from 0.505 (Llama 3.3 70B) to 0.993 (Claude Haiku 4.5) across seven multi-run models and six packages (five replications each; n = 210 datasets).
- Claude Haiku 4.5 and Qwen 2.5 Coder 32B are highly reproducible (Jaccard 0.993 and 0.903); Llama 3.3 70B, Llama 3.1 8B, DeepSeek, and GPT-4o-mini overlap only 50–57% of mutants across runs.
- Kruskal–Wallis confirms a significant model effect on Jaccard overlap (H = 35.18, p = 3.98 × 10⁻⁶, η² = 0.83); pairwise tests show Claude Haiku significantly outperforms all other models (p_holm = 0.045).
- Mutation-score CV remains below 1.5% for all models, but survivor-count CV reaches 8.4% for GPT-4o-mini—aggregate scores can appear stable while underlying mutant sets differ substantially.
- Longitudinal peers from Tip et al. (2025)—GPT-4o-mini (Jaccard 0.574) and Llama 3.3 70B (0.505)—exhibit persistent T = 0 instability despite competitive single-run mutation scores.
- Stability is model-specific, not category-specific: open-weight Llama models are among the least stable; API-only Claude Haiku is the most stable.
- Of 1,781 distinct Claude Haiku mutants across six packages, 1,755 (98.5%) appear in all five runs; for Llama 3.3 70B, only 1,284 of 5,177 (24.8%) appear in all five runs.
