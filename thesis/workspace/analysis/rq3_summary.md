# RQ3 — Analysis summary

## Question
How likely are different models to generate equivalent mutants?

## Answer (short)
Predicted equivalence rates among survivors range from 17.1% (Llama 3.1 8B) to 24.0% (DeepSeek Chat v3.1), broadly aligned with the LLMorpheus paper baseline of 20.2% (manual labels). All models exceed the StrykerJS operator baseline (4.7%). Effective survivors (predicted behavioral change) vary substantially and should be preferred over raw survivor counts for cross-model comparison.

## Key numbers (mean equivalence rate across 6 packages, UniXCoder θ = 0.80)

| Model | Mean equiv. rate | Rank | vs. paper baseline |
|-------|------------------|------|---------------------|
| Llama 3.1 8B | 17.1% | 1 (lowest) | below 20.2% |
| GPT-4o | 17.5% | 2 | below |
| Qwen 2.5 Coder 32B | 20.4% | 3 | ≈ baseline |
| Gemini 3.5 Flash | 20.5% | 4 | ≈ baseline |
| Claude Sonnet 4.5 | 21.0% | 5 | ≈ baseline |
| Gemini 3.1 Flash Lite | 21.4% | 6 | ≈ baseline |
| Claude Haiku 4.5 | 21.6% | 7 | ≈ baseline |
| Llama 3.3 70B | 22.0% | 8 | above |
| GPT-4o-mini | 23.3% | 9 | above |
| DeepSeek Chat v3.1 | 24.0% | 10 (highest) | above |
| *LLMorpheus baseline* | *20.2%* | — | manual labels |
| *StrykerJS baseline* | *4.7%* | — | operator mutants |

## Interpretation
- **Survivor inflation is real but moderate** — roughly one in five surviving LLM mutants is predicted equivalent; rates do not differ dramatically across modern models.
- **High survivor count ≠ high equivalence** — Gemini 3.5 Flash has the most survivors (RQ1) but a middling equivalence rate (~20.5%).
- **Classifier caveat** — outputs are *predicted* equivalence (macro-F1 ≈ 0.80 on validation set), not ground-truth proofs.

## Figures
- `thesis/rq3/output/publication/llm_comparison_boxplot.pdf` — equivalence rate by model
- `thesis/rq3/output/publication/effective_survivors.pdf` — equivalent vs behavioral-change survivors

## Sources
- `thesis/rq3/output/publication/llm_summary.csv`
- `thesis/output/tables/rq3_main_results.tex`
- `thesis/rq3/spec.md` (classifier validation)
