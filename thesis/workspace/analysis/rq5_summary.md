# RQ5 — Analysis summary

## Question
How do open-weight vs API-only models compare?

## Answer (short)
**Split verdict:** Deployment category is **not** a strong predictor of effectiveness or equivalence, but **is** a strong predictor of cost. Mann–Whitney tests find **no significant differences** on mutation score (p = 0.633), survivors (p = 0.993), or equivalence rate (p = 0.861; all Cliff's δ negligible). **Cost per survivor** (p = 2.75 × 10⁻⁵) and **cost per non-equiv survivor** (p = 3.51 × 10⁻⁵) differ significantly with Cliff's δ ≈ **−0.70** (large): open-weight observations are ~16× cheaper at the median ($0.00034 vs $0.00546 per survivor). Select models by individual profile, not category label.

## Key numbers (median across observations, run1)

| Category | Models | Obs | Mutation score | Survivors | Equiv. rate | Cost / survivor |
|----------|--------|-----|----------------|-----------|-------------|-----------------|
| open-weight | 3 | 18 | 81.6% | 42 | 12.7% | $0.00034 |
| api-only | 6 | 36 | 80.2% | 40 | 16.6% | $0.00546 |
| hybrid (DeepSeek) | 1 | 6 | 81.4% | 42.5 | 20.0% | $0.00071 |

**Unit of analysis:** One observation = one model × one package. Pairwise tests: 18 open-weight vs 36 API-only observations (60 total cells across 10 models).

## Statistical tests (open-weight vs API-only)

Source: `thesis/output/stats/rq5_category_tests.csv`

| Metric | p-value | Cliff's δ | Magnitude | Significant? |
|--------|---------|-----------|-----------|--------------|
| Mutation score | 0.633 | 0.08 | negligible | No |
| Survivors | 0.993 | −0.003 | negligible | No |
| Equivalence rate | 0.861 | −0.03 | negligible | No |
| Cost per survivor | **2.75 × 10⁻⁵** | **−0.707** | **large** | **Yes** |
| Cost per non-equiv survivor | **3.51 × 10⁻⁵** | **−0.698** | **large** | **Yes** |

## Hybrid sensitivity

Source: `thesis/rq5/output/appendix/hybrid_sensitivity.csv`

| Scenario | Effect |
|----------|--------|
| **with_hybrid_category** (primary) | DeepSeek separate (hybrid n = 1); OW(3) vs API(6) |
| **exclude_deepseek** | Identical pairwise results — DeepSeek was never in either group |
| **deepseek_as_open_weight** | OW(4) vs API(6); null on effectiveness/equiv unchanged; cost still significant (p ≈ 5 × 10⁻⁶, δ ≈ −0.70) |

DeepSeek medians: 81.4% score, 42.5 survivors, 20.0% equiv., $0.00071/survivor — between categories on cost, highest on equiv. rate.

## Interpretation
- **Choose by model, not category** — Qwen (open-weight) leads on mutation score; Claude Haiku (API-only) trails on validity; Llama models (open-weight) are least stable (RQ2).
- **Cost is the clearest category signal** — open-weight cluster at $0.00005–$0.004/non-equiv; premium API at $0.006–$0.014. GPT-4o-mini ($0.00051/non-equiv) bridges categories.
- **Hybrid sensitivity robust** — Reclassifying or excluding DeepSeek does not overturn the split verdict.

## Excluded from RQ5
Cross-run Jaccard / stability (unequal rep counts across categories).

## Figures
- `thesis/rq5/output/publication/category_violins.pdf` — metric distributions by category
- `thesis/rq5/output/publication/effect_size_forest.pdf` — Cliff's δ effect sizes

## Sources
- `thesis/rq5/FINDINGS.md` (source of truth)
- `thesis/rq5/output/publication/category_summary.csv`
- `thesis/output/stats/rq5_category_tests.csv`
- `thesis/rq5/output/appendix/hybrid_sensitivity.csv`
- `thesis/output/tables/rq5_pairwise_effect.tex`
