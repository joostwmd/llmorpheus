# RQ5 — Analysis summary

## Question
How do open-weight vs API-only models compare?

## Answer (short)
Deployment category is a weak predictor of LLMorpheus performance. Mann–Whitney tests find no significant differences between open-weight (n = 3) and API-only (n = 6) models on mutation score, survivors, equivalence rate, or cost metrics (all p > 0.38; Cliff's δ negligible to small). Open-weight models are directionally cheaper per survivor ($0.0003 vs $0.003) but overlap substantially in effectiveness.

## Key numbers (median across observations, run1)

| Category | Models | Mutation score | Survivors | Equiv. rate | Cost / survivor |
|----------|--------|----------------|-----------|-------------|-----------------|
| open-weight | 3 | 81.6% | 42 | 12.7% | $0.0003 |
| api-only | 6 | 80.2% | 40 | 16.6% | $0.003 |
| hybrid (DeepSeek) | 1 | 81.4% | 42 | 20.0% | $0.0007 |

## Statistical tests (open-weight vs API-only)

| Metric | p-value | Cliff's δ | Magnitude |
|--------|---------|-----------|-----------|
| Mutation score | 0.63 | 0.08 | negligible |
| Survivors | 0.99 | −0.003 | negligible |
| Equivalence rate | 0.86 | −0.03 | negligible |
| Cost per non-equiv survivor | 0.38 | −0.15 | small |

## Interpretation
- **Choose by model, not category** — Qwen (open-weight) leads on mutation score; Claude Haiku (API-only) trails on validity; Llama models (open-weight) are least stable (RQ2).
- **Cost is the clearest category signal** — open-weight models cost less per survivor, but individual API models (GPT-4o-mini) remain competitive.
- **Hybrid sensitivity** — DeepSeek grouped separately; excluding it does not change the null category finding.

## Excluded from RQ5
Cross-run Jaccard / stability (unequal rep counts across categories).

## Figures
- `thesis/rq5/output/publication/category_violins.pdf` — metric distributions by category
- `thesis/rq5/output/publication/effect_size_forest.pdf` — Cliff's δ effect sizes

## Sources
- `thesis/rq5/output/publication/category_summary.csv`
- `thesis/output/stats/rq5_category_tests.csv`
- `thesis/output/tables/rq5_pairwise_effect.tex`
