# RQ2 — Literature notes

## Sources consulted

| Slug | Citation | Sections read |
|------|----------|---------------|
| llmorpheus-paper-with-appendix-27mar2025 | Tip et al. (2025) | §4.3 stability (5× T=0 repeats); §4.5 temperature; §4.7 model comparison (5× per LLM); Figure 10 |
| understanding-and-mitigating-numerical-sources | Yuan et al. (2025) | §1–3 greedy decode ≠ deterministic; GPU/batch/precision; community recommendations |
| the-good-the-bad-and-the-greedy | Song et al. (2024) | §1–3 multi-run eval; benchmark variance; greedy vs sampling |
| introducing-background-temperature | Messina & Scotta (2026) | §1–6 Tbg formalism; related work (Song, Yuan mechanisms) |
| zhao-llm-survey-2023 | Zhao et al. (2023) | §1–2 LLM landscape, rapid evolution, API/deployment context |
| fan-llms-for-software-engineering-2023 | Fan et al. (2023) | §I nondeterminism in LLM-for-SE evaluation; robust stats |
| reflections-on-the-reproducibility-of-commercial-llm-performance | Angermeir et al. (2026) | §1–2.2 API drift, model versioning, extrinsic reproducibility threats |
| wang-software-testing-with-llms-2024 | Wang et al. (2024) | §1 evaluation challenges in LLM testing (cross-RQ) |

## Findings relevant to RQ2

### Prior observation in LLMorpheus (Tip et al.)

- Tip et al. state explicitly that **LLMs are nondeterministic even at temperature 0.0** and repeated the main experiment **five times** at T=0 to measure overlap (§4.3, §4.7).
- **Model-dependent stability at T=0:** codellama-34b-instruct and codellama-13b-instruct were largely stable (89–100% of mutants observed in all five runs); **mixtral-8x7b-instruct, llama-3.3-70b-instruct, and gpt-4o-mini showed substantial variability** (roughly 28–59% of mutants common to all five runs) — a direct precedent for treating stability as a model-specific property, not assumed from T=0 alone.
- Tip et al. also note that **mutation score can remain relatively stable** despite diverse mutant sets across trials — motivates separating **set-level** (Jaccard) from **aggregate score** (CV/SD) in our analysis and Discussion §5.2.
- The original paper **observed** run-to-run spread but did **not** rank modern models on Jaccard/CV across a fixed affordable matrix — that gap motivates our RQ2 design (7 models × 5 reps).

### T=0 variability mechanisms (plausible, not verified in our stack)

- **Yuan et al. (NeurIPS 2025):** Under greedy decoding (T=0), outputs can diverge across **GPU count, batch size, GPU type, and numeric precision** (BF16 vs FP32). Root cause traced to **floating-point non-associativity** and **parallel reduction order** in GPU kernels — small logit differences can flip argmax tokens. They recommend **multi-run reporting** (mean ± spread) and FP32 for single-run greedy evals.
- **Messina & Scotta (2026):** Introduce **background temperature Tbg** — effective stochasticity induced by inference environment **I** (batching, kernels, precision) even when nominal T=0. Formalizes Yuan-style systems effects; optional supporting cite alongside Yuan in §5.2.
- **Caution for Writing:** Cite Yuan/Song/Tip as **plausible mechanisms** for Discussion §5.2. We did **not** measure GPU configs, batch sizes, or provider routing; OpenRouter abstracts serving. Do **not** claim literature **proves** our Jaccard/CV numbers or causal attribution to a specific mechanism.

### Multi-run evaluation norms

- **Song et al. (EMNLP 2024):** Current LLM benchmarks often use **one output per prompt**, which **understates variability**. They run **16–128 samples** per task, report **mean, standard deviation, and best–worst gap (Δ)**; **code and math benchmarks** (HumanEval, GSM8K) show the largest spread. Greedy decoding can **rank models differently** from sampling averages.
- **Yuan et al.:** Single greedy runs at BF16 are **misleading**; even Pass@1 averages mix intrinsic and **hardware-induced** variance.
- **Fan et al. (ICSE-FoSE 2023):** LLM-for-SE inherits the same problem — identical prompts can yield different artefacts across runs; calls for **robust empirical methods** (inferential statistics, multiple runs) familiar from SBSE. Supports our **5-rep** design as a pragmatic SE norm (lighter than Song's 128 but aligned in principle).
- **Our study:** Fixed T=0, FULL template, 5 reps — follows Song/Yuan direction without claiming full benchmark-style sampling.

### API drift and longitudinal reproducibility (cross-cutting)

- **Zhao et al. (2023):** LLM landscape evolves quickly (new families, deployment modes, pricing) — supports **Background Block 2** claim that Tip et al.'s evaluation is a **snapshot**, not a stable baseline for "today's models." Does **not** supply effect sizes for our Jaccard analysis.
- **Angermeir et al. (2026):** Commercial LLM studies face **model version updates**, opaque provider changes, and **time-conditional** results even with pinned API names. Extrinsic drift adds to intrinsic nondeterminism — relevant for **§5.6 limitations** and interpreting OpenRouter runs as **2025–2026 snapshot**, not eternal CI guarantees.
- **Tip et al.:** Note token/pricing drift across providers — aligns with treating stability findings as **contemporaneous** to the run window.

### Stability vs effectiveness (Discussion hooks)

- Tip: high-variance models (e.g. llama-3.3-70b at T=0) can still produce many surviving mutants — **stability ≠ quality**.
- Song: constrained-output tasks show low variance; **open-ended code generation** (closest analog to mutant synthesis) shows high variance — consistent with expecting **package- and model-dependent** Jaccard in our data.
- Outline §5.2: link unstable models to **RQ4 cost multiplication** (repeat runs waste tokens) — literature supports the *concept*; numeric links are FINDINGS-only.

## Gaps in our library

- **He (2025) "Defeating nondeterminism"** — optional mitigation cite (not processed).
- **Atil et al. (2025)** — cited by Messina for T=0 accuracy swings; not in catalog.
- **Thinking Machines Lab batch-invariance blog** — underlying Yuan/Messina; use processed Yuan instead.
- No prior work reports **Jaccard overlap of LLMorpheus mutant sets** across runs at scale — our contribution is empirical (FINDINGS), not literature-derived.

## Suggested citations for Writing

| Outline location | Claim | Cite |
|------------------|-------|------|
| **Background Block 2, gap 2** | Stability is a separate evaluation dimension; T=0 ≠ identical runs | Tip; Yuan; Song |
| **Background Block 2, snapshot** | Model/provider landscape shifts quickly | Zhao; Fan (SE evaluation context) |
| **Discussion §5.2, lead** | Why CI / longitudinal benchmarks need stability metrics | Tip (prior observation); Song (eval norm) |
| **Discussion §5.2, mechanisms** | Provider/serving nondeterminism (batch, precision, routing) | Yuan (primary); Messina (optional Tbg); Tip (domain observation) |
| **Discussion §5.2, methods** | Multi-run reporting justified | Song; Fan; Yuan recommendations |
| **Discussion §5.6 / limitations** | API version drift, reproducibility window | Angermeir; Zhao |
| **Results §4.x** | Any Jaccard, CV, rank, p-value | **FINDINGS only** — do not attribute to literature |
| **Mechanism sentences** | Wording | "may reflect", "plausible explanation", "consistent with" — avoid causal "because GPU X" unless FINDINGS measured it |
