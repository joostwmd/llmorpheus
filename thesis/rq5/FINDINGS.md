# RQ5 — Findings (source of truth)

**Research question:** How do open-weight vs API-only models compare?

**Last locked from artifacts:** `thesis/rq5/output/publication/` + `thesis/output/stats/rq5_category_tests.csv` (June 2026). Do not cite numbers not present in cited files below.

---

## Data lock

| Field | Value |
|-------|-------|
| **Run policy** | **run1 only** for all 10 models (single-run premium API models included) |
| **Unit of analysis** | One observation = one model × one package. **60 cells** total (10 models × 6 packages); pairwise tests use **18 open-weight** vs **36 API-only** observations |
| **Packages** | thesis-six (6 JavaScript packages) |
| **Models** | 10 via OpenRouter; category labels from `thesis/shared/modelRegistry.js` |
| **Category assignment** | Open-weight (n = 3): Llama 3.1 8B, Llama 3.3 70B, Qwen 2.5 Coder 32B. API-only (n = 6): GPT-4o-mini, GPT-4o, Gemini 3.1 Flash Lite, Gemini 3.5 Flash, Claude Haiku 4.5, Claude Sonnet 4.5. Hybrid (n = 1): DeepSeek Chat v3.1 |
| **Metrics merged** | RQ1 mutation score & survivors; RQ3 predicted equivalence rate (θ = 0.80); RQ4 cost per survivor & cost per non-equiv survivor |
| **Excluded metric** | Cross-run Jaccard / stability (unequal rep counts — see RQ2) |
| **Primary CSVs** | `category_summary.csv`, `category_comparisons.csv`, `merged_metrics.csv` |
| **Authoritative tests** | `thesis/output/stats/rq5_category_tests.csv` (Python; Cliff's δ) |
| **Hybrid sensitivity** | `thesis/rq5/output/appendix/hybrid_sensitivity.csv` |

---

## Headline answer

**Split verdict:** Deployment category is **not** a strong predictor of effectiveness or equivalence, but **is** a strong predictor of cost.

- **Effectiveness & equivalence (null):** Mann–Whitney tests find **no significant differences** between open-weight (n = 3 models, 18 obs) and API-only (n = 6 models, 36 obs) on mutation score (**p = 0.633**), survivors (**p = 0.993**), or predicted equivalence rate (**p = 0.861**). Cliff's δ magnitudes are **negligible** (|δ| ≤ 0.08).
- **Cost (significant):** Open-weight models cost substantially less per survivor (**p = 2.75 × 10⁻⁵**, Cliff's δ = **−0.707**, large) and per non-equivalent survivor (**p = 3.51 × 10⁻⁵**, δ = **−0.698**, large). Median cost per survivor: **$0.00034** (open-weight) vs **$0.00546** (API-only) — roughly **16×** cheaper at the observation median.
- **Practitioner implication:** Select models by individual profile (RQ1–RQ4), not license category alone. Hybrid DeepSeek sits between categories on cost and equivalence; reclassifying it as open-weight does not change the split verdict (see Hybrid sensitivity).

---

## Key metrics

### Table RQ5-A — Category distribution summaries (median across observations, run1)

Source: `thesis/rq5/output/publication/category_summary.csv`

| Category | Models | Observations | Mutation score (%) | Survivors | Equiv. rate (%) | Cost / survivor (USD) |
|----------|--------|--------------|-------------------|-----------|-----------------|----------------------|
| open-weight | 3 | 18 | **81.60** | 42 | 12.74 | **0.00034** |
| api-only | 6 | 36 | 80.21 | 40 | 16.57 | 0.00546 |
| hybrid (DeepSeek) | 1 | 6 | 81.44 | 42.5 | 20.00 | 0.00071 |

**Reading the table:**
- Mutation score and survivor medians **overlap** across open-weight and API-only (Δ score ≈ +1.4 pp; Δ survivors = +2).
- Equivalence rate is directionally lower for open-weight (12.7% vs 16.6%) but not significant (p = 0.861).
- DeepSeek (hybrid) matches open-weight on mutation score (~81%) and survivors (~43) but has the **highest** equiv. rate (20.0%) and mid-tier cost ($0.00071/survivor).

Publication LaTeX: `category_summary.tex`, `thesis/output/tables/rq5_category_summary.tex`.

### Per-model context (run1 medians across 6 packages)

Individual models span wide ranges within each category — category labels do not collapse this variance.

| Model | Category | Mutation score (%) | Survivors | Equiv. rate (%) | Cost / non-equiv (USD) |
|-------|----------|-------------------|-----------|-----------------|------------------------|
| Qwen 2.5 Coder 32B | open-weight | **88.54** | **23.5** | 21.43 | 0.00165 |
| Llama 3.3 70B | open-weight | 79.32 | 43.5 | 26.00 | 0.00028 |
| Llama 3.1 8B | open-weight | 76.79 | 44.5 | 16.67 | **0.00005** |
| GPT-4o-mini | api-only | 83.47 | 30.5 | 17.86 | 0.00051 |
| GPT-4o | api-only | 80.58 | 37 | 21.95 | 0.00743 |
| Gemini 3.1 Flash Lite | api-only | 81.06 | 37 | 22.22 | 0.00101 |
| Gemini 3.5 Flash | api-only | 76.52 | 47.5 | 20.00 | 0.00543 |
| Claude Haiku 4.5 | api-only | 73.65 | 39 | 11.11 | 0.00576 |
| Claude Sonnet 4.5 | api-only | 78.75 | 42 | 32.00 | **0.01434** |
| DeepSeek Chat v3.1 | hybrid | 81.44 | 42.5 | **24.04** (model mean) | 0.00061 |

Sources: `thesis/rq1/output/publication/model_summary.csv`, `thesis/rq3/output/publication/llm_summary.csv`, `thesis/rq4/output/publication/model_cost_summary.csv`.

---

## Statistical tests (unit of analysis, effect sizes)

**Unit of analysis:** One observation = one model × one package (run1). Pairwise Mann–Whitney U compares **18 open-weight** observations (3 models × 6 packages) against **36 API-only** observations (6 models × 6 packages). Hybrid DeepSeek (6 obs) is **excluded** from the pairwise test and reported separately.

**Test:** Mann–Whitney U (two-sided). Effect size: Cliff's δ (negative δ → open-weight values tend lower than API-only; relevant for cost).

Source: `thesis/output/stats/rq5_category_tests.csv` (authoritative; Python pipeline).

### Table RQ5-B — Open-weight vs API-only (primary comparison)

| Metric | Median open-weight | Median API-only | U | p-value | Cliff's δ | Magnitude | Significant (α = 0.05)? |
|--------|-------------------|-----------------|-----|---------|-----------|-----------|-------------------------|
| Mutation score (%) | 81.60 | 80.21 | 350.5 | **0.633** | 0.082 | negligible | No |
| Survivors | 42 | 40 | 323.0 | **0.993** | −0.003 | negligible | No |
| Equivalent rate (%) | 12.74 | 16.57 | 314.0 | **0.861** | −0.031 | negligible | No |
| Cost per survivor (USD) | 0.00034 | 0.00546 | 95.0 | **2.75 × 10⁻⁵** | **−0.707** | **large** | **Yes** |
| Cost per non-equiv survivor (USD) | 0.00045 | 0.00650 | 98.0 | **3.51 × 10⁻⁵** | **−0.698** | **large** | **Yes** |

**Note on sign conventions:** `category_comparisons.csv` (JS pipeline) reports rank-biserial effect sizes with opposite sign to Cliff's δ; use `rq5_category_tests.csv` for prose.

Publication LaTeX: `pairwise_effect.tex`, `thesis/output/tables/rq5_pairwise_effect.tex`.

**Interpretation:**
1. **Underpowered for effectiveness:** With n = 3 vs n = 6 models (18 vs 36 package-level observations), small-to-medium quality differences may not reach significance even when descriptively present (e.g., Qwen 88.5% vs Haiku 73.6%).
2. **Cost separation is robust:** Large Cliff's δ (~−0.70) indicates open-weight observations consistently undercut API-only on per-survivor cost — driven by Llama 3.1 8B ($0.00005/non-equiv) vs premium API SKUs ($0.005–$0.014/non-equiv).
3. **GPT-4o-mini bridges categories:** At $0.00051/non-equiv, GPT-4o-mini is cost-competitive with open-weight tiers despite being API-only (see RQ4 Pareto frontier).

---

## Hybrid sensitivity (DeepSeek classification)

DeepSeek Chat v3.1 has open weights but was accessed via OpenRouter API; classified as **hybrid** (n = 1). Sensitivity analysis compares three scenarios on the same run1 merged data.

Source: `thesis/rq5/output/appendix/hybrid_sensitivity.csv`

| Scenario | Open-weight (models × obs) | API-only (models × obs) | Hybrid | Effect on pairwise verdict |
|----------|---------------------------|------------------------|--------|---------------------------|
| **with_hybrid_category** (primary) | 3 × 18 | 6 × 36 | 1 × 6 | Baseline |
| **exclude_deepseek** | 3 × 18 | 6 × 36 | — | **Identical** to baseline (DeepSeek never in either group) |
| **deepseek_as_open_weight** | 4 × 24 | 6 × 36 | — | Shifts OW medians slightly; **conclusions unchanged** |

### Table RQ5-C — Hybrid sensitivity: pairwise p-values and Cliff's δ

| Metric | with_hybrid (p) | exclude_deepseek (p) | deepseek_as_open_weight (p) | δ (with hybrid) | δ (DeepSeek → OW) |
|--------|-----------------|----------------------|----------------------------|-----------------|---------------------|
| Mutation score | 0.633 | 0.633 | 0.751 | 0.082 | 0.050 |
| Survivors | 0.993 | 0.993 | 0.827 | −0.003 | 0.035 |
| Equivalent rate | 0.861 | 0.861 | 0.982 | −0.031 | −0.005 |
| Cost per survivor | **2.75 × 10⁻⁵** | **2.75 × 10⁻⁵** | **5.4 × 10⁻⁶** | **−0.707** | **−0.701** |
| Cost per non-equiv | **3.51 × 10⁻⁵** | **3.51 × 10⁻⁵** | **5.9 × 10⁻⁶** | **−0.698** | **−0.697** |

**Hybrid-only medians (DeepSeek, 6 obs):** mutation score 81.44%, survivors 42.5, equiv. rate 20.00%, cost/survivor $0.00071, cost/non-equiv $0.00124.

**Takeaways:**
1. Excluding DeepSeek entirely does not alter open-weight vs API-only tests — it was already excluded from both groups.
2. Reclassifying DeepSeek as open-weight dilutes open-weight equivalence median (12.7% → 14.7%) but **strengthens** cost significance (p ≈ 5 × 10⁻⁶) because DeepSeek's cost sits in the open-weight range.
3. DeepSeek's equiv. rate (20.0%) exceeds both category medians; hybrid label is descriptively appropriate.

---

## Caveats

1. **Small category sample:** 3 open-weight vs 6 API-only models limits generalizability to broader license categories.
2. **Confounds within category:** Parameter count, training data, provider routing, and fine-tuning differ within and across categories — category is a coarse proxy.
3. **Hidden open-weight costs:** Analysis captures API token costs via OpenRouter even for open-weight models; local deployment TCO (GPU, ops) is not modeled.
4. **Run-policy asymmetry:** Three premium API models are single-run only; category comparison uses run1 for all models but cannot include stability (RQ2 excludes them from multi-rep analysis).
5. **API model drift:** API-only checkpoints may update post-study; open-weight checkpoints are fixed.
6. **Observation-level medians:** Category medians pool 6 package observations per model; they are not model-level medians of medians.
7. **Classifier dependency:** Equivalence rates depend on UniXCoder θ = 0.80 (RQ3); category equiv. comparison inherits classifier uncertainty.

---

## Artifact index

| Artifact | Path | Role |
|----------|------|------|
| Merged run1 metrics | `thesis/rq5/output/appendix/merged_metrics.csv` | 60-row source for all RQ5 stats |
| Category summary | `thesis/rq5/output/publication/category_summary.csv` | Table RQ5-A |
| Pairwise comparisons (JS) | `thesis/rq5/output/publication/category_comparisons.csv` | Pipeline cross-check |
| Category tests (Python) | `thesis/output/stats/rq5_category_tests.csv` | **Authoritative** p-values & Cliff's δ |
| Appendix tests copy | `thesis/rq5/output/appendix/category_tests.csv` | Duplicate of stats CSV |
| Hybrid sensitivity | `thesis/rq5/output/appendix/hybrid_sensitivity.csv` | Table RQ5-C |
| Violin plots | `thesis/rq5/output/publication/category_violins.pdf` | Figure RQ5-1 |
| Effect-size forest | `thesis/rq5/output/publication/effect_size_forest.pdf` | Figure RQ5-2 |
| LaTeX tables | `category_summary.tex`, `pairwise_effect.tex` | Publication |
| Central tables | `thesis/output/tables/rq5_category_summary.tex`, `rq5_pairwise_effect.tex` | Distribute copies |
| Artifact index | `thesis/rq5/output/artifacts_index.md` | Placement guide |

---

## Outline snippets (ready for Results §4.5)

**Answer sentence:**

> Answer to RQ5: Open-weight and API-only models showed overlapping distributions on effectiveness and equivalence: Mann–Whitney tests found no significant differences in mutation score (p = 0.633), survivors (p = 0.993), or equivalence rate (p = 0.861). Cost per survivor (p = 2.75 × 10⁻⁵) and cost per non-equivalent survivor (p = 3.51 × 10⁻⁵) differed significantly, with open-weight observations ~16× cheaper at the median (Cliff's δ ≈ −0.70, large). Deployment category alone is not a strong predictor of mutation-testing quality under this setup, but is a strong predictor of API cost.

**Hybrid sensitivity sentence:**

> Reclassifying DeepSeek Chat v3.1 as open-weight (4 vs 6 models) or excluding it entirely did not change the null effectiveness/equivalence finding or the significant cost separation (Table RQ5-C; `hybrid_sensitivity.csv`).

**Practitioner sentence:**

> Practitioners should rank models by empirical score, stability (RQ2), equivalence-adjusted survivors (RQ3), and cost (RQ4) rather than by open-weight vs API-only labels; GPT-4o-mini demonstrates that cost-efficient API deployment is achievable without the open-weight category median.
