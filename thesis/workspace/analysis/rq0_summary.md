# RQ0 — Analysis summary

**Source of truth:** `thesis/rq0/FINDINGS.md`

## Question
Is the experimental pipeline ready?

## Answer (short)
Yes. All 10 models completed end-to-end runs; **228** package-level datasets are non-empty, parseable, and consumed by RQ1–RQ5 without missing-input errors. Config locked at maxTokens=**250**, T=0, reasoning off.

## Key evidence
| Signal | Value |
|--------|-------|
| Models ready | 10/10 (`modelRegistry.js`) |
| Datasets | 228 (210 multi-run + 18 single-run) |
| RQ2 scope | 7 models × 6 pkg × 5 reps = 210 |
| Cross-model (RQ1) | 10 × 6 = 60 (run1) |
| Excluded | CodeLlama-34B (OpenRouter 404) |

## Caveats
- Internal validity only — **not** external replication of Tip et al. (2025).
- Six packages (thesis-six), not paper's 13.
- Spot-check logs for >0 mutants before final submission.

## Sources
- `thesis/rq0/FINDINGS.md` · `thesis/rq0/replication.md` · `thesis/meta/experiment_runs.md`
