# RQ2 — Analysis summary

## Question
How consistent are different models across runs?

## Answer (short)
Stability varies widely even at T = 0. Claude Haiku 4.5 and Qwen 2.5 Coder are highly reproducible (median Jaccard 0.99 and 0.90); Llama 3.3 70B, Llama 3.1 8B, and DeepSeek overlap only ~50–56% of mutants across runs. Mutation-score CV stays below 1.5% for all models, but survivor-count CV reaches 8.4% for GPT-4o-mini.

## Key numbers (7 multi-run models, median across packages)

| Model | Jaccard overlap | CV mutation score | CV survivors | CV edit distance |
|-------|-----------------|-------------------|--------------|------------------|
| Llama 3.3 70B | 0.505 | 1.02% | 4.74% | 3.45% |
| Llama 3.1 8B | 0.517 | 1.29% | 3.74% | 6.30% |
| DeepSeek Chat v3.1 | 0.559 | 1.35% | 4.78% | 6.21% |
| GPT-4o-mini | 0.574 | 1.12% | **8.40%** | 2.27% |
| Gemini 3.1 Flash Lite | 0.820 | 0.52% | 3.01% | 0.00% |
| Qwen 2.5 Coder 32B | 0.903 | 0.23% | 1.35% | 0.00% |
| Claude Haiku 4.5 | **0.993** | 0.25% | 0.77% | 0.00% |

## Interpretation
- **Stability is model-specific, not category-specific** — open-weight Llama models are among the least stable; API-only Claude Haiku is the most stable.
- **Low score CV can mask high set variability** — aggregate mutation scores drift little while the underlying mutant sets differ substantially (Jaccard ~0.5).
- **CI implications** — models with Jaccard < 0.6 may produce materially different mutant sets on repeated runs, affecting benchmark comparability.

## Scope note
Three expensive models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5) excluded — single run only.

## Figures
- `thesis/rq2/output/publication/jaccard_box.pdf` — Jaccard distribution across runs
- `thesis/rq2/output/publication/mutant_variability_stacked.pdf` — stable / variable / unique mutants

## Sources
- `thesis/rq2/output/publication/model_consistency_summary.csv`
- `thesis/output/tables/rq2_consistency.tex`
- `thesis/output/stats/rq2_bootstrap_ci.csv`
