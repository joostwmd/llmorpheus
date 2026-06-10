# RQ1 — Analysis summary

## Question
How many mutants do different models produce and what are they?

## Answer (short)
All 10 models generate comparable candidate volumes (~301–354 median per package), but differ in validity, mutation score, survivor counts, and edit subtlety. Qwen 2.5 Coder achieves the highest mutation score (88.5%) and fewest survivors (24); Claude Haiku has the lowest validity (60.7%) and mutation score (73.6%). Package-level differences dominate; Kruskal–Wallis tests find no significant model effect on mutation score (p = 0.995) or survivors (p = 0.977).

## Key numbers (median across 6 packages, run1)

| Model | Candidates | Validity | Mutation score | Survivors | Norm. Levenshtein |
|-------|-----------|----------|----------------|-----------|-------------------|
| Claude Haiku 4.5 | 301 | 60.7% | 73.6% | 39 | 0.52 |
| Gemini 3.5 Flash | 338 | 82.5% | 76.5% | 48 | 0.52 |
| Llama 3.1 8B | 354 | 73.0% | 76.8% | 44 | 0.60 |
| Claude Sonnet 4.5 | 316 | 83.4% | 78.7% | 42 | 0.45 |
| Llama 3.3 70B | 349 | 80.9% | 79.3% | 44 | 0.60 |
| GPT-4o | 348 | 80.5% | 80.6% | 37 | 0.55 |
| Gemini 3.1 Flash Lite | 343 | 81.1% | 81.1% | 37 | 0.49 |
| DeepSeek Chat v3.1 | 338 | 83.2% | 81.4% | 43 | 0.52 |
| GPT-4o-mini | 348 | 72.8% | **83.5%** | 30 | 0.57 |
| Qwen 2.5 Coder 32B | 338 | 83.0% | **88.5%** | **24** | 0.63 |

## Interpretation
- **Volume is not the differentiator** — candidate counts cluster tightly; validity and outcome metrics separate models.
- **Higher mutation score ≠ fewer survivors always** — GPT-4o-mini and Qwen combine high scores with low survivor counts; Gemini 3.5 Flash has more survivors despite a lower score.
- **Edit subtlety** — Claude Sonnet produces the smallest normalized edits (0.45); Llama models make larger relative changes (~0.60).
- **Paper baselines** — GPT-4o-mini and Llama 3.3 70B remain competitive peers, not replication targets.

## Figures
- `thesis/rq1/output/publication/mutation_score_box.pdf` — score distribution by model
- `thesis/rq1/output/publication/validity_stack.pdf` — candidate composition
- `thesis/rq1/output/publication/score_vs_survivors.pdf` — score vs survivor trade-off

## Sources
- `thesis/rq1/output/publication/model_summary.csv`
- `thesis/output/tables/rq1_volume_metrics.tex`
- `thesis/output/stats/rq1_pairwise.csv`
