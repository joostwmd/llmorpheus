# RQ0 — Synthesis

## Answer to the RQ (1–2 sentences)

The experimental pipeline is validated and ready: all ten modern LLMs produced non-empty, parseable mutant artifacts on the thesis-six packages under fixed LLMorpheus configuration. RQ0 establishes **internal validity only** — a prerequisite gate for RQ1–RQ5 — not external replication of Tip et al. (2025).

## Evidence from our data

- **10/10** models completed end-to-end runs; **228** package-level datasets are non-empty and consumed downstream without missing-input errors.
- Config locked: T = 0, FULL template, maxTokens = 250, reasoning off.
- RQ2 scope: 7 models × 6 packages × 5 reps = 210 datasets; cross-model RQ1: 10 × 6 = 60 (run1).
- CodeLlama-34B excluded (OpenRouter 404) — an analogue of Angermeir/Siddiq deprecation failure modes.
- Source: `thesis/rq0/FINDINGS.md`, `replication.md`.

## What the literature says

**Pipeline baseline (Tip et al., 2025).** LLMorpheus is a three-stage toolchain — prompt generator → LLM mutant generator → modified StrykerJS (`--usePrecomputed`). The original study runs on 13 JS/TS packages with documented constants (template-full, T = 0, maxTokens = 250, five repetitions) and public artifacts. Section 5 frames LLM reproducibility as a threat and mitigates via archived open-weight models, five trials, and published data — evidence about the *original* design, not a claim that this thesis replicates paper aggregates.

**RQ0 scope in literature terms.** RQ0 answers internal readiness: does *our* fork produce parseable artifacts for all models in the study matrix? Tip et al. is the **method and tool** citation; Angermeir et al. (2026) and Siddiq et al. (2025) justify why downstream RQ1–RQ5 results must be framed as **time-conditional snapshots**, even after RQ0 passes.

**Reproducibility threats (Angermeir et al., 2026).** Attempted replication of 18 ICSE/ASE 2024 OpenAI artefact studies: only 5/18 executable, **0/5** fully reproduced original metrics. Meta-analysis of 85 papers: 50/85 lacked usable artefacts; 8/85 did not name models; only 29/85 reported temperature. Non-determinism at T = 0 and model version drift undermine point replication — supports multi-run policy (RQ2) and explicit logging of OpenRouter slug + timestamp.

**Documentation standards (Siddiq et al., 2025).** 640 LLM-for-SE papers (2020–2025): prevalent smells include Access/Legal (35.9%), Versioning (32.2%), missing prompt templates and inference parameters. Artifact badges signal presence, not execution fidelity. RMM vocabulary supports thesis artifact archiving + pinned `thesis-six.json` as RMM-1/2, not RMM-3 independent verification.

**Practitioner context (Sánchez et al., 2024, optional).** Survey of 104 OSS developers: mutation tools (incl. StrykerJS) integrated into CI/CD; performance is the dominant adoption barrier — motivates reliable tooling validation before a 10-model comparative study. Does not address LLM-based mutation.

## Tension / gap between ours and prior work

- Tip et al. evaluated 13 packages with a 5-model roster on a 2024–2025 snapshot; this thesis validates a **different matrix** (10 models, thesis-six) under OpenRouter — no numeric comparison to paper aggregates.
- Angermeir/Siddiq document why exact commercial-LLM replication is infeasible; RQ0 success does **not** resolve API drift, deprecation, or provider-path nondeterminism.
- No processed literature on OpenRouter-specific reproducibility — thesis must state provider-path limitation explicitly (outline Block 11).
- Baltes et al. (2025) and Wagner et al. (2025) reporting guidelines cited by Angermeir/Siddiq are not in the processed library.

## Suggested narrative for Writing (ordered bullets)

1. State RQ0 as a **toolchain readiness gate** — non-empty artifacts, parseable downstream inputs — not a hypothesis test or external replication claim.
2. Cite Tip et al. (2025) §3 for LLMorpheus → Stryker architecture and original evaluation constants; pair with `replication.md` + FINDINGS for the empirical checklist.
3. Draw the scope boundary explicitly: "not external replication" — Tip et al. + Angermeir et al. (2026) on why exact replication of legacy paper numbers is neither claimed nor feasible.
4. In Methodology Block 2 and Blocks 10–11, cite Siddiq et al. (2025) for versioning/access smells and Angermeir et al. (2026) for deprecated endpoints, T = 0 variability, and incomplete artefacts.
5. Optional Intro motivation: Sánchez et al. (2024) for mutation testing in CI practice — one sentence only, not RQ0 methodology.
6. Document OpenRouter model ID, temperature, prompts, and timestamps per Siddiq/Angermeir recommendations before Results chapters treat all models as peers.
