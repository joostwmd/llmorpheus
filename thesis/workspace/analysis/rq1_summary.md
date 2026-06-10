# RQ1 — Analysis summary

**Source of truth:** `thesis/rq1/FINDINGS.md`

## Question
How many mutants do different models produce and what are they?

## Answer (short)
Comparable volumes (~301–354 candidates/pkg), but differing validity, scores, survivors, and edit distance. **Qwen** leads descriptively (88.5%, 24 survivors); **Haiku** trails (73.6%, 39). Kruskal–Wallis: **no significant model effect** on score (p=0.995) or survivors (p=0.977). Package effects dominate.

## Key numbers (median, 6 packages, run1)

| Model | Validity | Score | Survivors | Abs. Lev. |
|-------|----------|-------|-----------|-----------|
| Claude Haiku 4.5 | 60.7% | **73.6%** | 39 | 6 |
| Qwen 2.5 Coder 32B | 83.0% | **88.5%** | **24** | 6.5 |
| GPT-4o-mini † | 72.8% | 83.5% | 30.5 | 6.75 |
| Llama 3.3 70B † | 80.9% | 79.3% | 43.5 | 7 |
| Claude Sonnet 4.5 | 83.4% | 78.8% | 42 | **5** |

† Longitudinal peers (Tip et al. 2025 overlap; not replication targets)

## Statistics
- Mutation score: H=1.69, **p=0.995**
- Survivors: H=2.63, **p=0.977**
- Levenshtein: H=13.71, p=0.133 (Llama 3.1 8B largest edits, median 8)

## Figures
- `thesis/rq1/output/publication/mutation_score_box.pdf`
- `thesis/rq1/output/publication/validity_stack.pdf`
- `thesis/rq1/output/publication/score_vs_survivors.pdf`

## Sources
- `thesis/rq1/FINDINGS.md` · `thesis/rq1/output/publication/model_summary.csv` · `thesis/output/stats/rq1_pairwise.csv`
