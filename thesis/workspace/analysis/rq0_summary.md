# RQ0 — Analysis summary

## Question
Is the experimental pipeline ready?

## Answer (short)
Yes. All 10 models in the study matrix completed end-to-end runs on the thesis-six package subset; artifacts are non-empty, parseable, and consumed successfully by the `thesis` analysis pipelines for RQ1–RQ5.

## Key evidence
| Signal | Status |
|--------|--------|
| Models with successful runs | 10 / 10 (`experiment_runs.md`, all `ready`) |
| Package-level datasets | 228 (210 multi-run + 18 single-run) |
| Cross-model comparison scope | 10 models × 6 packages × run1 = 60 datasets |
| RQ2 stability scope | 7 multi-run models × 6 packages × 5 reps = 210 datasets |
| Downstream analysis | `npm run all` / per-RQ scripts produce tables and figures without missing-input errors |

## Caveats
- RQ0 validates **internal pipeline readiness**, not external replication of Tip et al. (2025).
- CodeLlama 34B excluded (OpenRouter 404); thesis uses six packages, not the paper's 13.
- Checklist item "logs show >0 mutants per package" should be spot-checked before final submission.

## Sources
- `thesis/rq0/replication.md`
- `thesis/meta/experiment_runs.md`
- `thesis/meta/model_choices.md`
