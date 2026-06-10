# RQ2 — Synthesis

## Answer to the RQ (1–2 sentences)

Run-to-run stability at T = 0 is not guaranteed and varies substantially by model. Jaccard overlap spans 0.50 (Llama 3.3 70B) to 0.99 (Claude Haiku), while aggregate mutation-score CV can remain below 1.5% — set-level instability is separable from score-level stability. Kruskal–Wallis on Jaccard is significant (p ≈ 3.98×10⁻⁶).

## Evidence from our data

- **7 multi-run models × 5 reps × 6 packages** = 210 datasets; 3 premium models excluded (single-run).
- Jaccard range: **0.505** (Llama 3.3 70B) to **0.993** (Claude Haiku 4.5); GPT-4o-mini and Llama 3.3 70B in low-stability tier (< 0.6).
- Score CV < 1.5% for all models; survivor CV up to **8.4%** (GPT-4o-mini).
- Kruskal–Wallis on Jaccard: p = **3.98×10⁻⁶** — significant model effect on set stability.
- Stability does not align with open-weight vs API-only labels (RQ5 null on category).
- Source: `thesis/rq2/FINDINGS.md`, `model_consistency_summary.csv`.

## What the literature says

**Prior observation in LLMorpheus (Tip et al., 2025).** LLMs are nondeterministic even at T = 0; the original study repeated five times at T = 0. Model-dependent stability: CodeLlama variants largely stable (89–100% mutants in all five runs); mixtral-8x7b, llama-3.3-70b, and gpt-4o-mini showed substantial variability (~28–59% common to all runs). Mutation score can remain relatively stable despite diverse mutant sets — motivates separating Jaccard (set-level) from CV/SD (aggregate score). The paper observed spread but did **not** rank modern models on Jaccard/CV across a fixed affordable matrix — that gap motivates RQ2.

**T = 0 variability mechanisms (plausible, not verified).** Yuan et al. (NeurIPS 2025): under greedy decoding, outputs diverge across GPU count, batch size, GPU type, and numeric precision — floating-point non-associativity and parallel reduction order flip argmax tokens. Recommend multi-run reporting and FP32 for single-run greedy evals. Messina & Scotta (2026): **background temperature Tbg** formalizes hidden stochasticity from inference environment even at nominal T = 0. **Caution:** cite as plausible mechanisms; we did not measure GPU configs or provider routing; OpenRouter abstracts serving.

**Multi-run evaluation norms.** Song et al. (EMNLP 2024): single-output benchmarks understate variability; code/math tasks show largest spread; greedy decoding can rank models differently from sampling averages. Fan et al. (ICSE-FoSE 2023): LLM-for-SE inherits the same problem — calls for robust empirical methods and multiple runs. Our 5-rep design is a pragmatic SE norm (lighter than Song's 128 but aligned in principle).

**API drift and longitudinal reproducibility.** Zhao et al. (2023): LLM landscape evolves quickly — Tip et al.'s evaluation is a snapshot, not a stable baseline. Angermeir et al. (2026): commercial LLM studies face model version updates and time-conditional results even with pinned API names — relevant for §5.6 limitations.

**Stability vs effectiveness.** Tip: high-variance models can still produce many surviving mutants — stability ≠ quality. Song: open-ended code generation shows high variance — consistent with expecting package- and model-dependent Jaccard.

## Tension / gap between ours and prior work

- We measure Jaccard on mutant sets, not token-level logits; Yuan/Messina mechanisms are cited as plausible, not verified in our OpenRouter infrastructure.
- No prior work reports **Jaccard overlap of LLMorpheus mutant sets** at scale — our contribution is empirical (FINDINGS), not literature-derived; Tip uses "% mutants in all 5 runs" framing, not Jaccard.
- Low score CV can mask set-level instability — a distinction Tip noted but did not systematically quantify across ten modern models.
- Unstable models multiply cost in CI (concept supported by Song/Yuan; numeric link is FINDINGS/RQ4 only).

## Suggested narrative for Writing (ordered bullets)

1. **Separate score stability (low CV) from set stability (Jaccard)** — lead Discussion §5.2 with this distinction before model ranks.
2. Background Block 2 gap: stability is a separate evaluation dimension; T = 0 ≠ identical runs — cite Tip, Yuan, Song.
3. Prior observation: Tip et al. noted T = 0 variability but did not systematically rank modern models — state as gap our RQ2 fills.
4. Mechanisms paragraph: Yuan (primary) + optional Messina (Tbg) — wording "may reflect", "plausible explanation", "not verified in OpenRouter setup"; **do not** claim causal GPU attribution. Outline §5.2 now encodes this explicitly.
5. Multi-run methods: Song + Fan + Yuan recommendations justify 5-rep design; all Jaccard/CV numbers from **FINDINGS only**.
6. §5.6 limitations: Zhao + Angermeir for API version drift and reproducibility window.
7. Cross-RQ link: unstable models (Llama, DeepSeek, GPT-4o-mini) multiply token spend — defer numeric cost link to RQ4 FINDINGS.
