# RQ4 — Analysis summary

## Question
What does LLMorpheus cost per model?

## Answer (short)
Total generation cost for six packages (run1) spans ~$0.04 (Llama 3.1 8B) to ~$8.93 (Claude Sonnet 4.5). Cost per non-equivalent survivor is the most decision-relevant metric: open-weight models (Llama 8B ~$0.00005, Llama 70B ~$0.0004) undercut API models by an order of magnitude or more. Cheap per-token models are not always cost-efficient when duplicate and invalid rates are high (Claude Haiku: 32% invalid rate, $0.010/non-equiv survivor).

## Key numbers (aggregated across 6 packages, run1)

| Model | Total cost | Cost / non-equiv survivor | Mutation score | Invalid rate |
|-------|-----------|---------------------------|----------------|--------------|
| Llama 3.1 8B | $0.04 | $0.00005 | 76.8% | 25.4% |
| Llama 3.3 70B | $0.21 | $0.0004 | 79.3% | 19.7% |
| GPT-4o-mini | $0.34 | $0.0018 | 83.5% | 26.9% |
| DeepSeek Chat v3.1 | $0.48 | $0.0012 | 81.4% | 16.6% |
| Gemini 3.1 Flash Lite | $0.75 | $0.0022 | 81.1% | 19.8% |
| Qwen 2.5 Coder 32B | $1.09 | $0.0042 | **88.5%** | 17.6% |
| Claude Haiku 4.5 | $3.00 | $0.010 | 73.6% | **32.2%** |
| Gemini 3.5 Flash | $4.56 | $0.009 | 76.5% | 17.7% |
| GPT-4o | $5.66 | $0.014 | 80.6% | 19.8% |
| Claude Sonnet 4.5 | $8.93 | $0.020 | 78.7% | 18.8% |

## Interpretation
- **Pareto frontier** — Llama 8B, Llama 70B, GPT-4o-mini, and Qwen are Pareto-efficient on cost vs mutation score; premium models offer no dominant cost–quality position.
- **Waste matters** — Claude Haiku's low validity (60.7%) inflates cost per useful mutant despite moderate per-token pricing.
- **Effectiveness vs cost** — Qwen achieves the highest mutation score but at ~80× the cost per non-equiv survivor of Llama 8B.

## Caveats
- Pricing pinned to OpenRouter snapshot (`.github/thesis-model-pricing.json`); all models served via API (not self-hosted).
- Gemini 3.1 Flash Lite and GPT-4o were initially reported as $0 due to missing pricing entries — fixed June 2026.

## Figures
- `thesis/rq4/output/publication/pareto_frontier.pdf` — cost vs mutation score
- `thesis/rq4/output/publication/cost_per_nonequiv_bar.pdf` — cost per non-equivalent survivor

## Sources
- `thesis/rq4/output/publication/model_cost_summary.csv`
- `thesis/output/tables/rq4_cost.tex`
