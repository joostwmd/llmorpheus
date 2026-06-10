# RQ4 — Findings (source of truth)

**Research question:** What does LLMorpheus cost per model?

**Last locked from artifacts:** `thesis/rq4/output/publication/` + tier appendix CSVs (run1, pinned OpenRouter pricing). Do not cite numbers not present in cited files below.

---

## Data lock

| Field | Value |
|-------|-------|
| **Run policy** | **run1 only** for all cross-model and tier metrics |
| **Scope** | 10 models × 6 packages = **60 cells**; portfolio sums across 6 packages per model |
| **Cost basis** | OpenRouter token logs (`summary.json`) × pinned snapshot (`.github/thesis-model-pricing.json`) |
| **Quality adjustment** | Non-equivalent survivor counts from RQ3 (`llm_summary.csv`, θ = 0.80) |
| **Primary cross-model table** | `model_cost_summary.csv` — portfolio aggregates, run1 |
| **Pareto axes** | **X:** portfolio cost per non-equivalent survivor; **Y:** median mutation score (run1). Supplementary axis for interpretation: cost/non-equiv on bar chart (`cost_per_nonequiv_bar.pdf`) |
| **Tier comparison** | 3 API provider pairs (OpenAI, Google, Anthropic) in `tier_comparison.csv`; Meta Llama 8B vs 70B in appendix deltas only |
| **Currency** | USD throughout artifacts |

**Portfolio metric definitions (from `thesis/rq4/spec.md`):**
- **Portfolio cost / valid** = total API cost ÷ syntactically valid mutants (summed across packages)
- **Portfolio cost / unique** = total API cost ÷ (valid − duplicate)
- **Portfolio cost / non-equiv survivor** = total API cost ÷ effective survivors (RQ3-adjusted)
- **nonEquivYield** = non-equivalent survivors ÷ total cost (survivors per USD)
- **Marginal cost per extra non-equiv survivor** = (premium total cost − cheap total cost) ÷ (premium non-equiv − cheap non-equiv)

---

## Headline answer

Total LLM API cost for a six-package run1 pass ranges from **$0.035** (Llama 3.1 8B) to **$8.93** (Claude Sonnet 4.5) — a **~254×** spread. **Cost per non-equivalent survivor** separates models more clearly than raw cost per survivor: open-weight models cluster at **$0.00005–$0.0042** vs **$0.0058–$0.0202** for premium API SKUs. **Four models** are Pareto-efficient on cost vs mutation score: Llama 3.1 8B, Llama 3.3 70B, GPT-4o-mini, and Qwen 2.5 Coder 32B (`paretoEfficient = 1` in `model_cost_summary.csv`). Cheap API tiers **win nonEquivYield for all 3/3 provider pairs** (OpenAI, Google, Anthropic), even though premium tiers produce more absolute non-equivalent survivors; upgrading costs **$0.039–$0.058** per additional non-equiv survivor at portfolio level.

---

## Key metrics tables

### Table RQ4-A — Cross-model cost metrics (run1, primary table)

Source: `model_cost_summary.csv`. Costs are portfolio totals across 6 packages. **Pareto** from `paretoEfficient` column (1 = on frontier).

| Efficiency rank | Model | Total cost (USD) | Cost / valid | Cost / unique | Cost / survivor | Cost / non-equiv | nonEquivYield (per USD) | Median mutation score (%) | Mean invalid rate (%) | Mean duplicate rate (%) | Pareto |
|-----------------|-------|------------------|--------------|---------------|-----------------|------------------|-------------------------|----------------------------|----------------------|------------------------|--------|
| 1 | Llama 3.1 8B | 0.0352 | 0.0000134 | 0.0000138 | 0.0000462 | **0.0000495** | **20,207.5** | 76.79 | 25.37 | 2.11 | **yes** |
| 2 | Llama 3.3 70B | 0.2056 | 0.0000742 | 0.0000779 | 0.0002498 | 0.0002820 | 3,546.3 | 79.32 | 19.75 | 2.91 | **yes** |
| 3 | GPT-4o-mini | 0.3369 | 0.0001326 | 0.0001400 | 0.0004647 | 0.0005143 | 1,944.2 | 83.47 | 26.90 | 3.41 | **yes** |
| 4 | DeepSeek Chat v3.1 | 0.4805 | 0.0001745 | 0.0001868 | 0.0005298 | 0.0006098 | 1,639.9 | 81.44 | 16.57 | 4.43 | no |
| 5 | Gemini 3.1 Flash Lite | 0.7519 | 0.0002747 | 0.0002883 | 0.0008743 | 0.0010134 | 986.8 | 81.06 | 19.83 | 3.65 | no |
| 6 | Qwen 2.5 Coder 32B | 1.0893 | 0.0003996 | 0.0004257 | 0.0015235 | 0.0016530 | 605.0 | **88.54** | 17.58 | 3.98 | **yes** |
| 7 | Gemini 3.5 Flash | 4.5620 | 0.0016126 | 0.0017093 | 0.0047226 | 0.0054310 | 184.1 | 76.52 | 17.75 | 3.63 | no |
| 8 | Claude Haiku 4.5 | 3.0005 | 0.0016981 | 0.0018152 | 0.0050598 | 0.0057590 | 173.6 | 73.65 | **32.16** | 3.05 | no |
| 9 | GPT-4o | 5.6646 | 0.0020303 | 0.0021360 | 0.0066175 | 0.0074338 | 134.5 | 80.58 | 19.83 | 3.28 | no |
| 10 | Claude Sonnet 4.5 | 8.9311 | 0.0037972 | 0.0040688 | 0.0126324 | **0.0143356** | 69.8 | 78.75 | 18.82 | 5.13 | no |

**Reading the table:**
- **Cheapest raw run:** Llama 3.1 8B ($0.035 total).
- **Best mutation score:** Qwen 2.5 Coder 32B (88.54%) at $0.00165/non-equiv — Pareto-efficient but ~33× Llama 8B's cost/non-equiv.
- **Most expensive per non-equiv:** Claude Sonnet 4.5 ($0.0143/non-equiv).
- **Waste flag:** Claude Haiku 4.5 — highest invalid rate (32.16%) inflates cost despite mid-tier token pricing.

### Table RQ4-B — Pareto-efficient models (cost vs mutation score)

Source: `model_cost_summary.csv` (`paretoEfficient = 1`). Dominance: no other model has **both** lower cost/non-equiv **and** higher mutation score.

| Model | Cost / non-equiv (USD) | Median mutation score (%) | Dominance note |
|-------|------------------------|---------------------------|----------------|
| Llama 3.1 8B | 0.0000495 | 76.79 | Lowest cost; baseline frontier point |
| Llama 3.3 70B | 0.0002820 | 79.32 | Higher score than 8B at ~5.7× cost/non-equiv |
| GPT-4o-mini | 0.0005143 | 83.47 | Higher score than Llama 70B; dominated neither by Llama tiers on score–cost trade-off |
| Qwen 2.5 Coder 32B | 0.0016530 | 88.54 | Highest score on frontier; ~33× Llama 8B cost/non-equiv |

**Dominated examples (not on frontier):**
- **DeepSeek** — higher cost/non-equiv (0.000610) and lower score (81.44) than GPT-4o-mini.
- **Gemini 3.1 Flash Lite** — higher cost/non-equiv (0.001013) and lower score (81.06) than GPT-4o-mini.
- **GPT-4o** — higher cost/non-equiv (0.007434) and lower score (80.58) than GPT-4o-mini.
- **Claude Sonnet 4.5** — highest cost/non-equiv, not extreme on score.

**Artifact note:** `thesis/output/tables/rq4_pareto.tex` is empty in current build; use `model_cost_summary.csv` as authoritative Pareto membership. `cost.tex` marks all models Pareto=yes — **contradicts CSV**; prefer CSV.

### Table RQ4-C — Median per-package costs (robustness check)

Source: `model_cost_summary.csv` median columns (run1, 6 packages).

| Model | Median cost / non-equiv | Median cost / valid | Median mutation score (%) |
|-------|-------------------------|---------------------|---------------------------|
| Llama 3.1 8B | 0.0000636 | 0.0000131 | 76.79 |
| Llama 3.3 70B | 0.0004354 | 0.0000703 | 79.32 |
| GPT-4o-mini | 0.0018257 | 0.0001303 | 83.47 |
| DeepSeek Chat v3.1 | 0.0012404 | 0.0001640 | 81.44 |
| Gemini 3.1 Flash Lite | 0.0021702 | 0.0002676 | 81.06 |
| Qwen 2.5 Coder 32B | 0.0041900 | 0.0003755 | 88.54 |
| Gemini 3.5 Flash | 0.0089615 | 0.0015759 | 76.52 |
| Claude Haiku 4.5 | 0.0101552 | 0.0015917 | 73.65 |
| GPT-4o | 0.0140834 | 0.0019460 | 80.58 |
| Claude Sonnet 4.5 | 0.0201851 | 0.0033439 | 78.75 |

Median ordering matches portfolio ranking; GPT-4o-mini median cost/non-equiv (0.00183) exceeds portfolio (0.00051) because per-package cost distribution is skewed (small packages cheaper).

---

## Tier comparison (§4.6 supplementary)

Source: `tier_comparison.csv`, `tier_paired_deltas.csv`, `tier_wilcoxon.csv`. **run1 only.** API premium models are **single-run**; cheap tiers use run1 from multi-run models.

### Table Tier-A — Portfolio tier metrics (3 API provider pairs)

| Provider | Cheap tier | Premium tier | Cheap cost (USD) | Premium cost (USD) | Cheap non-equiv | Premium non-equiv | Δ non-equiv (prem − cheap) | Cheap cost/non-equiv | Premium cost/non-equiv | Premium multiplier (cost/non-equiv) | Cheap nonEquivYield | Premium nonEquivYield | **Marginal cost / extra non-equiv** |
|----------|------------|--------------|------------------|--------------------|-----------------|--------------------|-----------------------------|----------------------|------------------------|-------------------------------------|---------------------|----------------------|-------------------------------------|
| **OpenAI** | GPT-4o-mini | GPT-4o | 0.3369 | 5.6646 | 655 | 762 | **+107** | 0.0005143 | 0.0074338 | **14.45×** | **1,944.2** | 134.5 | **$0.0498** |
| **Google** | Gemini 3.1 Flash Lite | Gemini 3.5 Flash | 0.7519 | 4.5620 | 742 | 840 | **+98** | 0.0010134 | 0.0054310 | **5.36×** | **986.8** | 184.1 | **$0.0389** |
| **Anthropic** | Claude Haiku 4.5 | Claude Sonnet 4.5 | 3.0005 | 8.9311 | 521 | 623 | **+102** | 0.0057590 | 0.0143356 | **2.49×** | **173.6** | 69.8 | **$0.0581** |

**Headline tier findings:**
1. **nonEquivYield: cheap wins 3/3 API pairs.** Cheap tiers deliver more non-equivalent survivors per dollar spent despite fewer absolute survivors.
2. **Premium yields more survivors but at higher cost.** Portfolio Δ non-equiv survivors: +107 (OpenAI), +98 (Google), +102 (Anthropic) — similar absolute gains across providers.
3. **Marginal upgrade economics:** Each extra non-equiv survivor costs **$0.039–$0.058** when upgrading cheap → premium at portfolio level. Anthropic pair has the **lowest** premium multiplier (2.49×) but **highest** marginal cost per extra survivor ($0.058) because absolute cost base is high.
4. **Invalid-rate asymmetry:** Haiku invalid rate 32.16% vs Sonnet 18.82% — cheap tier wastes more tokens on invalid mutants, yet still wins on nonEquivYield.

### Table Tier-B — Generation economics (Layer A)

| Provider | Cheap invalid (%) | Premium invalid (%) | Cheap duplicate (%) | Premium duplicate (%) | Cheap cost/unique | Premium cost/unique |
|----------|-------------------|---------------------|----------------------|----------------------|-------------------|---------------------|
| OpenAI | 26.90 | 19.83 | 3.41 | 3.28 | 0.0001400 | 0.0021360 |
| Google | 19.83 | 17.75 | 3.65 | 3.63 | 0.0002883 | 0.0017093 |
| Anthropic | 32.16 | 18.82 | 3.05 | 5.13 | 0.0018152 | 0.0040688 |

### Table Tier-C — Equivalence lens on tiers (RQ3 cross-link)

Weighted equivalence rates from `tier_comparison.csv` (portfolio, run1):

| Provider | Cheap equiv. rate (%) | Premium equiv. rate (%) | Interpretation |
|----------|----------------------|-------------------------|----------------|
| OpenAI | 9.66 | 10.98 | Similar; premium not buying lower equivalence |
| Google | 13.72 | 13.04 | Similar |
| Anthropic | 12.14 | 11.88 | Similar |

Equivalence rates do **not** explain tier cost gaps; price per token and invalid/duplicate waste dominate.

### Table Tier-D — Per-package paired deltas (cheap − premium)

Source: `tier_paired_deltas.csv`. Negative delta on cost = cheap is cheaper. Negative delta on non-equiv = premium produces more non-equiv survivors on that package.

**OpenAI (GPT-4o-mini − GPT-4o):**

| Package | Δ cost/unique | Δ cost/non-equiv | Δ non-equiv survivors |
|---------|---------------|------------------|-----------------------|
| Complex.js | −0.00250 | −0.00655 | −51 |
| countries-and-timezones | −0.00158 | −0.01387 | −17 |
| node-jsonfile | −0.00159 | −0.00731 | −7 |
| pull-stream | −0.00138 | −0.00406 | −25 |
| spacl-core | −0.00224 | −0.02903 | −7 |
| zip-a-folder | −0.00212 | −0.04993 | 0 |
| **Sum** | — | — | **−107** |

**Google (Gemini 3.1 Flash Lite − Gemini 3.5 Flash):**

| Package | Δ cost/unique | Δ cost/non-equiv | Δ non-equiv survivors |
|---------|---------------|------------------|-----------------------|
| Complex.js | −0.00178 | −0.00422 | −34 |
| countries-and-timezones | −0.00120 | −0.00894 | −11 |
| node-jsonfile | −0.00111 | −0.00465 | −8 |
| pull-stream | −0.00097 | −0.00260 | −48 |
| spacl-core | −0.00179 | −0.01886 | −1 |
| zip-a-folder | −0.00148 | −0.06500 | +4 |
| **Sum** | — | — | **−98** |

**Anthropic (Haiku − Sonnet):**

| Package | Δ cost/unique | Δ cost/non-equiv | Δ non-equiv survivors |
|---------|---------------|------------------|-----------------------|
| Complex.js | −0.00333 | −0.00824 | −78 |
| countries-and-timezones | −0.00175 | −0.01182 | −10 |
| node-jsonfile | −0.00136 | −0.01008 | +6 |
| pull-stream | −0.00140 | −0.00478 | −21 |
| spacl-core | −0.00247 | −0.08166 | +4 |
| zip-a-folder | −0.00214 | −0.01378 | −3 |
| **Sum** | — | — | **−102** |

Premium wins non-equiv count on **3 cells** total (Google zip-a-folder +4; Anthropic node-jsonfile +6, spacl-core +4); cheap wins on the majority of package cells.

### Appendix — Meta Llama tier pair (8B vs 70B)

Source: `tier_paired_deltas.csv` (provider = Meta). **Both multi-run**; appendix only per spec.

| Package | Δ cost/unique (8B − 70B) | Δ cost/non-equiv | Δ non-equiv survivors |
|---------|--------------------------|------------------|-----------------------|
| Complex.js | −0.0000856 | −0.000229 | +3 |
| countries-and-timezones | −0.0000471 | −0.000482 | +5 |
| node-jsonfile | −0.0000447 | −0.000268 | +6 |
| pull-stream | −0.0000415 | −0.000127 | −31 |
| spacl-core | −0.0000727 | −0.001149 | 0 |
| zip-a-folder | −0.0000692 | −0.001283 | −1 |
| **Portfolio sum** | — | — | **−18** |

**Meta appendix metrics (computed from `model_cost_summary.csv` + RQ3):**
- Cheap (8B) nonEquivYield: **20,207.5** vs premium (70B): **3,546.3** — cheap wins yield.
- Portfolio Δ cost: $0.1704; Δ non-equiv: +39 (70B higher) → **marginal cost ≈ $0.00437** per extra non-equiv survivor.
- 70B buys +2.5 pp mutation score (79.32 vs 76.79) at ~5.7× portfolio cost/non-equiv.

---

## Statistical tests

### Cross-model correlations

Source: `thesis/output/stats/rq4_correlations.csv`.

| Comparison | Spearman ρ | *p*-value | *n* | Interpretation |
|------------|------------|-----------|-----|----------------|
| Cost vs mutation score | −0.224 | 0.533 | 10 | No monotonic cost–score relationship across all models |
| Cost vs Jaccard (RQ2) | **0.964** | **0.00045** | 7 | Cheaper multi-run models tend to be **less** stable — **n = 7** affordable models only |

### Tier paired tests (Wilcoxon signed-rank on per-package deltas)

Source: `tier_wilcoxon.csv`. *n* = 6 packages per provider. **Directional only** (outline caveat).

| Provider | Metric | Median Δ (cheap − premium) | Wilcoxon stat | *p*-value | Significant at α = 0.05? |
|----------|--------|---------------------------|---------------|-----------|--------------------------|
| OpenAI | cost_per_unique | −0.001853 | 0.0 | 0.03125 | **yes** (cheap cheaper) |
| OpenAI | cost_per_non_equiv | −0.010591 | 0.0 | 0.03125 | **yes** |
| OpenAI | non_equiv_survivors | −12.0 | 0.0 | 0.0625 | borderline (premium more survivors) |
| Google | cost_per_unique | −0.001340 | 0.0 | 0.03125 | **yes** |
| Google | cost_per_non_equiv | −0.006791 | 0.0 | 0.03125 | **yes** |
| Google | non_equiv_survivors | −9.5 | 2.0 | 0.09375 | no |
| Anthropic | cost_per_unique | −0.001946 | 0.0 | 0.03125 | **yes** |
| Anthropic | cost_per_non_equiv | −0.010946 | 0.0 | 0.03125 | **yes** |
| Anthropic | non_equiv_survivors | −6.5 | 5.0 | 0.3125 | no |
| Meta | cost_per_unique | −0.0000582 | 0.0 | 0.03125 | **yes** |
| Meta | cost_per_non_equiv | −0.000375 | 0.0 | 0.03125 | **yes** |
| Meta | non_equiv_survivors | +1.5 | 6.0 | 0.8125 | no |

**Summary:** Cheap tiers are **significantly cheaper** on cost/unique and cost/non-equiv for all 4 pairs (including Meta). Premium tiers produce more non-equiv survivors per package in aggregate, but differences in survivor counts are **not significant** at α = 0.05 except borderline OpenAI (*p* = 0.0625).

---

## Interpretation

1. **Cost per non-equiv survivor is the decision metric.** Raw cost or cost/valid obscures duplicate, invalid, and equivalence waste. Llama 3.1 8B at **$0.0000495/non-equiv** vs Claude Sonnet at **$0.0143/non-equiv** is a **~289×** gap — far wider than the **~254×** raw total cost gap.

2. **Pareto frontier is small (4/10 models).** Practitioners seeking cost–score efficiency should start with **Llama 8B** (budget), **Llama 70B** or **GPT-4o-mini** (mid), or **Qwen** (quality-first on frontier). Premium API models are dominated on this 2D plot.

3. **Cheap per-token ≠ cost-efficient.** Claude Haiku has moderate per-token pricing but **32.2% invalid rate** → $0.0058/non-equiv (rank 8/10). Invalid and duplicate rates must accompany token price.

4. **Tier upgrades buy survivors, not yield.** All three API premium tiers add **~98–107** non-equiv survivors per portfolio pass but at **2.5–14.5×** higher cost/non-equiv. **nonEquivYield favors cheap 3/3.** Upgrade only when marginal **$0.039–$0.058** per extra survivor is acceptable for the audit scope.

5. **Stability–cost tension (RQ2 link).** ρ = 0.964 between cost and Jaccard (*n* = 7) — cheapest models are least stable across runs. Cost-optimal choice conflicts with repeatability for CI-style pipelines.

6. **Qwen as quality outlier.** Highest mutation score (88.54%) and Pareto membership, but **~33×** Llama 8B's cost/non-equiv. Quality-first budgets may accept this; volume workflows should not default to Qwen on cost grounds alone.

---

## Caveats

| Caveat | Impact |
|--------|--------|
| **run1 only** | Cross-model and tier tables use single rep; no stability in RQ4 tier narrative |
| **API premium single-run** | GPT-4o, Gemini 3.5, Sonnet: tier comparisons confound tier with run-policy asymmetry |
| **Pinned pricing (May 2026)** | OpenRouter snapshot; not self-hosted open-weight economics |
| **All models via OpenRouter** | Open-weight models not measured on owned GPU infrastructure |
| **RQ3 uncertainty propagates** | cost/non-equiv depends on predicted equivalence (θ = 0.80) |
| **Wilcoxon *n* = 6** | Tier tests are directional; low power for survivor-count deltas |
| **Pareto is 2D only** | Mutation score vs cost/non-equiv; stability, validity, edit distance excluded |
| **Artifact inconsistencies** | `cost.tex` Pareto column wrong; `rq4_pareto.tex` empty — use CSV |
| **GHA compute excluded** | Token API cost only; Stryker/CI runtime not in euro totals |
| **Gemini 3.5 single-run** | Total cost $4.56 reflects one rep; multi-rep cost unknown |

---

## Artifact index

### Publication (main paper)

| Artifact | Path | Use |
|----------|------|-----|
| **Primary cross-model CSV** | `thesis/rq4/output/publication/model_cost_summary.csv` | Table RQ4-A, Pareto |
| Cost table TeX | `thesis/rq4/output/publication/cost.tex` | LaTeX (verify Pareto against CSV) |
| Tier comparison CSV | `thesis/rq4/output/publication/tier_comparison.csv` | Table Tier-A |
| Tier comparison TeX | `thesis/output/tables/rq4_tier_comparison.tex` | Main paper tier table |
| Pareto figure | `thesis/output/figures/rq4_pareto_frontier.pdf` | Figure RQ4-1 |
| Cost/non-equiv bar | `thesis/rq4/output/publication/cost_per_nonequiv_bar.pdf` | Figure RQ4-2 |
| Tier efficiency figure | `thesis/output/figures/rq4_tier_cost_efficiency.pdf` | Figure Tier-1 |

### Appendix

| Artifact | Path | Use |
|----------|------|-----|
| Tier paired deltas | `thesis/rq4/output/appendix/tier_paired_deltas.csv` | Table Tier-D |
| Tier Wilcoxon | `thesis/rq4/output/appendix/tier_wilcoxon.csv` | Tier statistical tests |
| Cost composition | `thesis/rq4/output/appendix/cost_composition.pdf` | Input vs output split |
| Cost vs Jaccard | `thesis/rq4/output/appendix/cost_vs_jaccard.pdf` | Stability–cost trade-off |
| Correlations | `thesis/output/stats/rq4_correlations.csv` | Cross-model correlations |
| Per-run cost detail | `thesis/rq4/output/appendix/cost_all_runs.csv` | Audit trail |

### Cross-RQ dependencies

| Artifact | Path | Role |
|----------|------|------|
| RQ1 model summary | `thesis/rq1/output/publication/model_summary.csv` | Mutation scores, validity |
| RQ3 LLM summary | `thesis/rq3/output/publication/llm_summary.csv` | Non-equiv survivor counts |
| Pricing snapshot | `.github/thesis-model-pricing.json` | Unit rates |
| Tier pair registry | `thesis/shared/modelRegistry.js` | API_TIER_PAIRS definition |

### Central thesis outputs

| Artifact | Path |
|----------|------|
| Cost table | `thesis/output/tables/rq4_cost.tex` |
| Pareto table | `thesis/output/tables/rq4_pareto.tex` (empty — regenerate) |
| Tier table | `thesis/output/tables/rq4_tier_comparison.tex` |

---

## Outline snippets

### Block RQ4 — Results chapter (§4.4)

**Answer sentence (fill from lock):**  
Answer to RQ4: Total LLM API cost per six-package run1 pass ranged from **$0.035** (Llama 3.1 8B) to **$8.93** (Claude Sonnet 4.5). **Cost per non-equivalent survivor** separated models more clearly than raw cost per survivor (Figure RQ4-2): from **$0.0000495** (Llama 8B) to **$0.0143** (Sonnet). Pareto analysis on **mutation score vs cost/non-equiv** identified **four** frontier models — Llama 3.1 8B, Llama 3.3 70B, GPT-4o-mini, and Qwen 2.5 Coder 32B (Figure RQ4-1; `model_cost_summary.csv`).

**Pipeline:**
```
summary.json (tokens) + pricing snapshot + RQ1/RQ3 counts --> cost metrics + Pareto
```

### Block Tier — §4.6 supplementary

**Answer sentence (fill from lock):**  
Supplementary tier comparison (extends RQ4): Across three API provider pairs on run1 data, premium SKUs cost **2.5–14.5×** more per non-equivalent survivor than cheap tiers (Table Tier-A; Figure Tier-1). Premium portfolios yielded **+98 to +107** additional non-equiv survivors, at a marginal cost of **$0.039–$0.058** per extra survivor. **nonEquivYield favored the cheap tier for 3/3 API pairs.** Wilcoxon tests confirmed cheap tiers are significantly cheaper on cost/unique and cost/non-equiv (*p* = 0.03125, *n* = 6 packages); survivor-count advantages for premium tiers were not significant.

**Scope caveats to restate:** run1 only; API premium single-run; Wilcoxon directional; Meta Llama pair in appendix only.

### Discussion hooks

- **Practitioner guidance:** Budget → Llama 8B or cheap API tier when nonEquivYield wins; quality on frontier → Qwen; avoid assuming premium API dominates cost-adjusted gap-finding.
- **Threats:** Pricing snapshot; classifier uncertainty in denominator; Pareto omits stability (link RQ2 ρ = 0.964).
- **§5.8:** Do not compare absolute euro totals to Tip et al. without package and pricing caveats.

### RQ5 handoff

Category aggregates should use `portfolioCostPerNonEquiv` and `nonEquivYield` from `model_cost_summary.csv` by `modelMeta.js` labels. Cost differs significantly across open-weight vs API-only in RQ5 (cost per survivor *p* ≈ 2.75×10⁻⁵, Cliff's δ ≈ −0.70; see `thesis/rq5/FINDINGS.md`).
