# RQ4 — Analysis summary

## Question
What does LLMorpheus cost per model?

## Answer (short)
Six-package run1 API cost spans **$0.035** (Llama 3.1 8B) to **$8.93** (Claude Sonnet 4.5). **Cost per non-equivalent survivor** is the primary decision metric (**$0.00005–$0.020**). **Four Pareto-efficient** models on cost vs mutation score: Llama 8B, Llama 70B, GPT-4o-mini, Qwen 2.5 Coder 32B. **Tier comparison:** cheap API SKUs win **nonEquivYield for 3/3** provider pairs (OpenAI, Google, Anthropic); marginal cost per extra non-equiv survivor when upgrading: **$0.039–$0.058**.

## Key numbers (run1, portfolio across 6 packages)

| Model | Total cost | Cost / non-equiv | nonEquivYield | Mutation score | Pareto |
|-------|-----------|------------------|---------------|----------------|--------|
| Llama 3.1 8B | $0.04 | $0.00005 | 20,207 | 76.8% | yes |
| Llama 3.3 70B | $0.21 | $0.00028 | 3,546 | 79.3% | yes |
| GPT-4o-mini | $0.34 | $0.00051 | 1,944 | 83.5% | yes |
| DeepSeek Chat v3.1 | $0.48 | $0.00061 | 1,640 | 81.4% | no |
| Gemini 3.1 Flash Lite | $0.75 | $0.00101 | 987 | 81.1% | no |
| Qwen 2.5 Coder 32B | $1.09 | $0.00165 | 605 | **88.5%** | yes |
| Gemini 3.5 Flash | $4.56 | $0.00543 | 184 | 76.5% | no |
| Claude Haiku 4.5 | $3.00 | $0.00576 | 174 | 73.6% | no |
| GPT-4o | $5.66 | $0.00743 | 135 | 80.6% | no |
| Claude Sonnet 4.5 | $8.93 | $0.01434 | 70 | 78.7% | no |

## Tier comparison (§4.6, 3 API pairs)

| Provider | Cheap → Premium | Premium mult. (cost/non-equiv) | Δ non-equiv survivors | Marginal $/extra non-equiv | nonEquivYield winner |
|----------|-----------------|--------------------------------|----------------------|---------------------------|----------------------|
| OpenAI | 4o-mini → 4o | 14.45× | +107 | $0.050 | **cheap** |
| Google | 3.1 Flash Lite → 3.5 Flash | 5.36× | +98 | $0.039 | **cheap** |
| Anthropic | Haiku → Sonnet | 2.49× | +102 | $0.058 | **cheap** |

Wilcoxon (*n* = 6 packages): cheap tiers significantly cheaper on cost/unique and cost/non-equiv for all 3 API pairs (*p* = 0.03125); premium survivor advantages not significant.

## Interpretation
- **Pareto:** Four models balance mutation score vs cost/non-equiv; premium APIs dominated.
- **Waste:** Claude Haiku 32.2% invalid rate inflates cost despite moderate token price.
- **Tiers:** Premium buys ~100 more non-equiv survivors but at 2.5–14.5× cost/non-equiv; cheap wins yield 3/3.
- **RQ2 link:** Cost vs Jaccard ρ = 0.964 (*p* = 0.00045, *n* = 7) — cheap models less stable.

## Caveats
- run1 only; API premium tiers single-run in tier analysis.
- OpenRouter pricing snapshot; open-weight not self-hosted.
- RQ3 classifier uncertainty in non-equiv denominator.
- `cost.tex` Pareto column contradicts CSV; `rq4_pareto.tex` empty — use `model_cost_summary.csv`.

## Evidence
- **Source of truth:** `thesis/rq4/FINDINGS.md`
- `thesis/rq4/output/publication/model_cost_summary.csv` (primary cross-model table)
- `thesis/rq4/output/publication/tier_comparison.csv`
- `thesis/rq4/output/appendix/tier_paired_deltas.csv`
- `thesis/rq4/output/appendix/tier_wilcoxon.csv`
- `thesis/output/stats/rq4_correlations.csv`

## Figures
- `thesis/output/figures/rq4_pareto_frontier.pdf` — cost vs mutation score
- `thesis/rq4/output/publication/cost_per_nonequiv_bar.pdf` — cost/non-equiv (log)
- `thesis/output/figures/rq4_tier_cost_efficiency.pdf` — tier comparison

## Open questions (for Synthesis / Critique)
- Regenerate empty `rq4_pareto.tex` and fix `cost.tex` Pareto column?
- How to present Meta Llama appendix pair without distracting from 3/3 API narrative?
- Self-hosted open-weight cost modeling as future work vs OpenRouter proxy?
