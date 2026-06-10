# RQ1 Findings (source of truth)

## Data lock

| Field | Value |
|-------|-------|
| **Lock date** | June 2026 |
| **Unit of analysis** | **60** package-level datasets: 10 models × 6 packages × **run1** |
| **Models** | 10 (7 multi-run + 3 single-run; RQ1 uses rep1 only for cross-model comparison) |
| **Packages** | thesis-six (6 JavaScript packages) |
| **Config** | template-full, T = 0, maxTokens = 250, reasoning disabled |
| **Primary CSV** | `thesis/rq1/output/publication/model_summary.csv` |
| **Per-package CSV** | `thesis/rq1/output/appendix/*_all_runs.csv` (60 rows for run1) |
| **Statistics** | `thesis/output/stats/rq1_pairwise.csv` |

Medians in `model_summary.csv` are computed **across 6 packages** per model (one run each).

## Headline answer

All ten models generate **comparable candidate volumes** (median 301–354 per package), but differ in **validity**, **mutation score**, **survivor counts**, and **edit subtlety**. Descriptively, **Qwen 2.5 Coder 32B** leads on mutation score (**88.5%**, 24 survivors) and **Claude Haiku 4.5** trails (**73.6%**, 39 survivors, 60.7% validity). However, **package-level differences dominate**: Kruskal–Wallis finds **no significant model effect** on mutation score (p = 0.995) or survivors (p = 0.977). Absolute Levenshtein shows a trend (p = 0.133) with Llama models producing larger edits.

**Longitudinal peers** from Tip et al. (2025) — `gpt-4o-mini` and `llama-3.3-70b-instruct` — remain competitive (83.5% and 79.3% median mutation score) but are **not replication targets**.

## Key metrics tables (from CSVs - exact numbers)

### Model summary (median across 6 packages, run1)

Source: `thesis/rq1/output/publication/model_summary.csv`

| Model | nPackages | nRuns | Median candidates | Validity (%) | Mutation score (%) | Survivors | Abs. Levenshtein | Norm. Levenshtein |
|-------|-----------|-------|-------------------|--------------|-------------------|-----------|------------------|-------------------|
| Claude Haiku 4.5 | 6 | 1 | 301 | 60.71 | **73.65** | 39 | 6 | 0.523 |
| Gemini 3.5 Flash | 6 | 1 | 338.5 | 82.47 | 76.52 | 47.5 | 6 | 0.520 |
| Llama 3.1 8B | 6 | 1 | 353.5 | 72.97 | 76.79 | 44.5 | **8** | **0.604** |
| Claude Sonnet 4.5 | 6 | 1 | 315.5 | 83.42 | 78.75 | 42 | **5** | **0.448** |
| Llama 3.3 70B | 6 | 1 | 349 | 80.93 | 79.32 | 43.5 | 7 | 0.603 |
| GPT-4o | 6 | 1 | 347.5 | 80.54 | 80.58 | 37 | 7 | 0.554 |
| Gemini 3.1 Flash Lite | 6 | 1 | 343 | 81.11 | 81.06 | 37 | 6 | 0.487 |
| DeepSeek Chat v3.1 | 6 | 1 | 337.5 | 83.25 | 81.44 | 42.5 | 5.5 | 0.524 |
| GPT-4o-mini | 6 | 1 | 347.5 | 72.81 | 83.47 | 30.5 | 6.75 | 0.568 |
| Qwen 2.5 Coder 32B | 6 | 1 | 338.5 | 83.03 | **88.54** | **23.5** | 6.5 | 0.630 |

**Descriptive rank (mutation score):** Qwen (88.5%) > GPT-4o-mini (83.5%) > DeepSeek (81.4%) ≈ Gemini 3.1 Flash Lite (81.1%) > GPT-4o (80.6%) > Llama 3.3 70B (79.3%) > Claude Sonnet (78.8%) > Gemini 3.5 Flash (76.5%) ≈ Llama 3.1 8B (76.8%) > Claude Haiku (73.6%).

**Descriptive rank (survivors, lower = stronger test suite signal):** Qwen (23.5) < GPT-4o-mini (30.5) < GPT-4o / Gemini 3.1 Flash Lite (37) < Claude Haiku (39) < Claude Sonnet / DeepSeek (~42) < Llama models (~44) < Gemini 3.5 Flash (47.5).

**Levenshtein medians (absolute):** Claude Sonnet and DeepSeek produce the smallest edits (5–5.5 chars); Claude Haiku/Gemini cluster at 6; GPT-4o/Llama 3.3 at 7; **Llama 3.1 8B highest at 8**.

**Levenshtein medians (normalized):** Claude Sonnet lowest (0.448); Gemini 3.1 Flash Lite (0.487); Claude Haiku/DeepSeek/Gemini 3.5 (~0.52); GPT-4o (0.554); GPT-4o-mini (0.568); **Llama models (~0.60); Qwen highest (0.630)**.

Publication table with bootstrap CIs: `thesis/rq1/output/publication/volume_metrics.tex`.

### Per-package mutation scores (run1)

Source: `thesis/rq1/output/appendix/per_package_breakdown.tex`

| Package | Claude Haiku | Claude Sonnet | DeepSeek | GPT-4o | **GPT-4o-mini** | Gemini 3.1 FL | Gemini 3.5 | Llama 3.1 8B | **Llama 3.3 70B** | Qwen |
|---------|-------------|---------------|----------|--------|-----------------|---------------|------------|--------------|-------------------|------|
| Complex.js | 55.38% | 55.96% | 54.79% | 59.83% | 62.63% | 57.01% | 55.03% | 63.80% | 62.01% | 62.97% |
| countries-and-timezones | 79.64% | 82.05% | 82.76% | 87.26% | 86.16% | 88.00% | 80.99% | 80.00% | 83.21% | 92.64% |
| node-jsonfile | 67.65% | 75.44% | 80.11% | 73.89% | 80.77% | 77.50% | 72.05% | 73.58% | 75.44% | 84.44% |
| pull-stream | 62.84% | 68.61% | 65.98% | 65.95% | 68.00% | 68.11% | 64.80% | 69.69% | 67.25% | 70.21% |
| spacl-core | 86.98% | 93.04% | 83.33% | 89.24% | 90.71% | 84.62% | 83.95% | 86.32% | 87.90% | 94.98% |
| zip-a-folder | 97.50% | 95.61% | 95.83% | 95.76% | 94.79% | 94.02% | 97.46% | 95.00% | 94.74% | 95.50% |

Package effects are large: Complex.js scores cluster ~55–64%; zip-a-folder ~95–97%. Per-package spread within a model often exceeds cross-model spread.

### Longitudinal peers (Tip et al. 2025 overlap)

Both models also appeared in the original LLMorpheus paper; compared here as **peers within this study**:

| Model | Median mutation score | Median survivors | Validity | RQ2 Jaccard (see RQ2) |
|-------|----------------------|------------------|----------|----------------------|
| **GPT-4o-mini** | 83.47% | 30.5 | 72.81% | 0.574 |
| **Llama 3.3 70B** | 79.32% | 43.5 | 80.93% | 0.505 |

Per-package scores for these peers span 62–95% (GPT-4o-mini) and 62–94% (Llama 3.3 70B), consistent with modest ±7pp shifts vs paper on shared packages (see `thesis_context.md`).

## Statistical tests (p-values, effect sizes, unit of analysis)

**Unit of analysis:** One observation = one model × one package (run1). **n = 6 per model**, **10 groups**, **60 total**.

**Test:** Kruskal–Wallis H-test (non-parametric, 10 independent groups). Effect size: η² = (H − k + 1) / (N − k).

Source: `thesis/rq1/plots/generate_stats.py` run on locked data (June 2026).

| Metric | H | df | p | η² | Significant? |
|--------|---|----|----|-----|--------------|
| Mutation score | 1.693 | 9 | **0.995** | −0.146 | No |
| Survivors (nrSurvived) | 2.632 | 9 | **0.977** | −0.127 | No |
| Abs. Levenshtein (medianAbsLevenshtein) | 13.707 | 9 | **0.133** | 0.094 | No (α = 0.05) |

**Interpretation of null results:** With only 6 package-level observations per model, statistical power to detect model effects is limited. Descriptive differences (e.g., Qwen 88.5% vs Haiku 73.6%) coexist with non-significant omnibus tests because **package identity explains more variance than model identity**.

### Pairwise Mann–Whitney (Holm-corrected)

Source: `thesis/output/stats/rq1_pairwise.csv` — 45 pairs per metric, 135 tests total.

**Mutation score:** No pair survives Holm correction (all p_holm = 1.0). Largest raw effect: Haiku vs Qwen (U = 12, p_raw = 0.394, Cliff's δ = −0.333, medium).

**Survivors:** No pair survives Holm correction. Largest raw effect: Haiku vs Gemini 3.5 Flash (U = 12, p_raw = 0.394, δ = −0.333, medium).

**Abs. Levenshtein:** Two pairs show Holm-corrected significance at α = 0.05:
- Haiku vs Llama 3.1 8B: p_holm = **0.689** (not significant after correction; p_raw = 0.016, δ = −0.833, large)
- Sonnet vs Llama 3.1 8B: p_holm = **0.336** (not significant after correction; p_raw = 0.007, δ = −0.944, large)
- Gemini 3.1 Flash Lite vs Llama 3.1 8B: p_holm = **0.689** (p_raw = 0.016, δ = −0.833, large)

Note: Holm correction is conservative; raw p-values flag Llama 3.1 8B as producing significantly larger absolute edits than several API models, but corrected p-values do not reach α = 0.05.

## Interpretation

1. **Volume is not the differentiator.** Candidate counts cluster tightly (301–354 median). Models differ in what happens after generation: validity filtering, test outcomes, edit size.

2. **Descriptive leaders ≠ statistically proven superiority.** Qwen's 88.5% mutation score and Haiku's 73.6% are ~15 pp apart descriptively, but Kruskal–Wallis p = 0.995 indicates this spread is not statistically distinguishable from package-driven variance at n = 6 per model.

3. **Package dominates model.** Complex.js (~55–64%) vs zip-a-folder (~95–97%) swamps cross-model differences. Any cross-model ranking must be interpreted per-package, not from aggregates alone.

4. **Higher mutation score does not always mean fewer survivors.** GPT-4o-mini (83.5%, 30 survivors) and Qwen (88.5%, 24) combine high scores with low survivors; Gemini 3.5 Flash has more survivors (47.5) despite lower score (76.5%).

5. **Edit subtlety varies by model family.** Claude Sonnet produces the smallest normalized edits (0.448); Llama models make larger relative changes (~0.60). This may affect mutant "naturalness" but is not statistically significant at the omnibus level (p = 0.133).

6. **Longitudinal peers remain relevant.** GPT-4o-mini and Llama 3.3 70B score competitively (83.5%, 79.3%) but exhibit low cross-run stability (RQ2 Jaccard ~0.57 and ~0.51), limiting reproducibility despite strong single-run scores.

7. **Do not compare to paper 13-package aggregates.** Paper CodeLlama-34B median ≈ 76% on six shared packages vs modern models 74–89% here — a modest shift, not a ~30 pp jump from 13-vs-6 package confound.

## Caveats

- **Small n per model:** 6 package-level observations limit power; null Kruskal–Wallis does not prove models are equivalent.
- **Single run for cross-model comparison:** Multi-run models use rep1 only; RQ2 shows substantial run-to-run variability for some models.
- **Run-policy asymmetry:** 3 expensive models have 1 rep; 7 affordable models have 5 reps (RQ1 uses run1 from all).
- **OpenRouter serving:** All models via API; "open-weight" category does not imply self-hosting.
- **No equivalence filtering in RQ1:** Mutation scores include all valid mutants; RQ3 addresses equivalent survivors separately.
- **Directional comparison only:** Tip et al. comparison limited by package subset, model roster, and equivalence method differences.

## Artifact index

| Artifact | Path | Description |
|----------|------|-------------|
| Model summary CSV | `thesis/rq1/output/publication/model_summary.csv` | Primary metrics table |
| Volume metrics TeX | `thesis/rq1/output/publication/volume_metrics.tex` | Publication table with CIs |
| Per-package breakdown | `thesis/rq1/output/appendix/per_package_breakdown.tex` | Score heatmap data |
| Per-model run CSVs | `thesis/rq1/output/appendix/{model}_all_runs.csv` | Raw per-package metrics |
| Pairwise tests | `thesis/output/stats/rq1_pairwise.csv` | Mann–Whitney + Holm |
| Mutation score box plot | `thesis/rq1/output/publication/mutation_score_box.pdf` | Score distribution |
| Validity stack | `thesis/rq1/output/publication/validity_stack.pdf` | Candidate composition |
| Score vs survivors | `thesis/rq1/output/publication/score_vs_survivors.pdf` | Trade-off scatter |
| Edit distance ridge | `thesis/rq1/output/appendix/edit_distance_ridge.pdf` | Levenshtein distributions |
| Per-package heatmap | `thesis/rq1/output/appendix/per_package_heatmap.pdf` | Model × package scores |
| Central table | `thesis/output/tables/rq1_volume_metrics.tex` | Aggregated output |
| Spec | `thesis/rq1/spec.md` | Methodology |
| Index | `thesis/rq1/output/artifacts_index.md` | Placement guide |
| Short summary | `thesis/workspace/analysis/rq1_summary.md` | Agent handoff |

## Outline snippets (copy-paste answer sentences)

- All ten models generate comparable candidate volumes (median 301–354 per package), but differ in validity (61–83%), mutation score (74–89%), survivor counts (24–48), and edit subtlety.
- Descriptively, Qwen 2.5 Coder 32B achieves the highest median mutation score (88.5%) and fewest survivors (24); Claude Haiku 4.5 has the lowest validity (60.7%) and mutation score (73.6%).
- Kruskal–Wallis tests find no significant model effect on mutation score (H = 1.69, p = 0.995) or survivors (H = 2.63, p = 0.977); package-level differences dominate cross-model variation.
- Absolute Levenshtein distances show a non-significant trend (H = 13.71, p = 0.133): Llama 3.1 8B produces the largest edits (median 8 chars, normalized 0.60) while Claude Sonnet produces the smallest (median 5 chars, normalized 0.45).
- Longitudinal peers from Tip et al. (2025)—GPT-4o-mini (83.5% score, 30 survivors) and Llama 3.3 70B (79.3%, 44 survivors)—remain competitive within this study but are not treated as replication targets.
- Higher mutation score does not uniformly imply fewer survivors: Gemini 3.5 Flash produces more survivors (48) despite a lower score (76.5%) than GPT-4o-mini (83.5%, 31 survivors).
