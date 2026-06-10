# RQ2 — References for writing

> Curated from `thesis/references/processed/`. Primary = cite first for run-to-run stability, T=0 nondeterminism, and multi-run evaluation norms.

## Primary sources

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Yuan, J., et al. (2025). Understanding and mitigating numerical sources of nondeterminism in LLM inference. *NeurIPS*. | `understanding-and-mitigating-numerical-sources` | **Primary mechanism cite** for §5.2: greedy decode ≠ deterministic; GPU/batch/precision; FP32 mitigation — **plausible not proven** in our OpenRouter setup |
| Song, Y., et al. (2024). The good, the bad, and the greedy. *EMNLP*. | `the-good-the-bad-and-the-greedy` | **Multi-run evaluation norm**: single-run benchmarks mislead; report mean/SD/Δ; code/math tasks most variable; justifies 5-rep design |
| Zhao, W. X., et al. (2023). A survey of large language models. arXiv:2303.18223. | `zhao-llm-survey-2023` | Rapid LLM landscape change — **Background Block 2 snapshot gap**; not for RQ2 effect sizes |
| Fan, A., et al. (2023). Large language models for software engineering. *ICSE-FoSE*. | `fan-llms-for-software-engineering-2023` | LLM-for-SE **evaluation must handle nondeterminism**; robust stats; SE-facing framing for multi-run policy |

## Supporting sources

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Messina, A., & Scotta, S. (2026). Introducing background temperature. | `introducing-background-temperature` | Optional: **Tbg** formalizes hidden randomness at T=0; cites Yuan/Song — use if §5.2 needs compact "effective temperature" vocabulary |
| Wang, J., et al. (2024). Software testing with LLMs. *IEEE TSE*. | `wang-software-testing-with-llms-2024` | LLM testing survey; rigorous evaluation challenges — background positioning only |

## Cross-RQ / background only

- **Tip et al. (2025). LLMorpheus** — T=0 variability across 5 repeats; model-dependent stability; score stable despite set drift — see `rq0/references.md` (pipeline) and `rq1/references.md` (§4.3, §4.7 stability tables).
- **Angermeir et al. (2026)** — API drift / model versioning; extrinsic reproducibility threats — see `rq0/references.md`.
- Siddiq et al. (2025) LLM-SE reproducibility audit — see `rq0/references.md`.
- Manchanda, Liesenfeld — open vs closed deployment (RQ5); not stability mechanisms.
- Wang comprehensive (2025) Java mutation study — RQ1/RQ4 landscape, not run consistency.

## Outline hooks for this RQ (claim → citation)

| Claim | Citation | Notes |
|-------|----------|-------|
| "Stability matters for CI and repeatable benchmarking" | Tip; Song | Tip = prior LLMorpheus observation; Song = general eval practice |
| "Original study noted T=0 variability but did not systematically rank modern models" | Tip | Gap → our RQ2 |
| "T=0 does not guarantee identical outputs" | Yuan; Tip; optional Messina | Yuan = mechanism literature; Tip = mutation-testing domain |
| "Evaluations should report multi-run variance" | Song; Yuan; Fan | Song/Yuan = ML eval; Fan = SE eval |
| "LLM landscape / API results are time-bound snapshots" | Zhao; Angermeir | Background + limitations |
| "Plausible mechanisms (Yuan/Song): inference-stack nondeterminism, batch/precision — not verified in OpenRouter" | Yuan; Song; Tip | Matches outline §5.2; routing opacity → §5.6 limitation only |
| "Provider nondeterminism (batch, precision, routing) may explain spread" | Yuan (supporting); Messina (optional) | **Deprecated wording** — use row above; do not state as measured cause |
| "Separate Jaccard (set stability) from mutation-score CV" | Tip (score stable despite mutant diversity) | Pair with FINDINGS |
| "Jaccard 0.505–0.993", "Kruskal–Wallis p ≈ 3.98×10⁻⁶", model ranks | **FINDINGS only** | Never cite literature for our numbers |
| "Open-weight vs API stability difference" | **FINDINGS only** (RQ5 null on category) | Do not cite Manchanda for Jaccard |
| "Unstable models multiply cost in CI" | Concept: Song + Yuan; numeric link: **FINDINGS / RQ4** | §5.2 cross-RQ sentence |

## Gaps

- He (2025) defeating nondeterminism — optional mitigation cite (not in library).
- Atil et al. (2025) T=0 accuracy variance — optional; referenced by Messina only.
- No processed paper reports **Jaccard overlap of LLM-generated mutant sets** — our metric is novel vs Tip's "% mutants in all 5 runs" framing.
