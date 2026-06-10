# RQ2 — Analysis summary

**Source of truth:** `thesis/rq2/FINDINGS.md`

## Question
How consistent are different models across runs?

## Answer (short)
Stability varies widely at T=0 across **7 multi-run models × 5 reps**. Jaccard range **0.505** (Llama 3.3 70B) to **0.993** (Claude Haiku 4.5). Score CV <1.5% for all, but survivor CV hits **8.4%** (GPT-4o-mini). Kruskal–Wallis on Jaccard: p = **3.98×10⁻⁶**.

## Key numbers (median across 6 packages)

| Model | Jaccard | CV score | CV survivors |
|-------|---------|----------|--------------|
| Llama 3.3 70B † | **0.505** | 1.02% | 4.74% |
| Llama 3.1 8B | 0.517 | 1.29% | 3.74% |
| DeepSeek v3.1 | 0.559 | 1.35% | 4.78% |
| GPT-4o-mini † | 0.574 | 1.12% | **8.40%** |
| Gemini 3.1 Flash Lite | 0.820 | 0.52% | 3.01% |
| Qwen 2.5 Coder 32B | 0.903 | 0.23% | 1.35% |
| Claude Haiku 4.5 | **0.993** | 0.25% | 0.77% |

† Longitudinal peers; both in low-stability tier (Jaccard < 0.6)

## Scope
- **Included:** 7 affordable models, 5 reps, 210 datasets
- **Excluded:** GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5 (single-run)

## Figures
- `thesis/rq2/output/publication/jaccard_box.pdf`
- `thesis/rq2/output/publication/mutant_variability_stacked.pdf`

## Sources
- `thesis/rq2/FINDINGS.md` · `thesis/rq2/output/publication/model_consistency_summary.csv` · `thesis/output/stats/rq2_pairwise.csv`
