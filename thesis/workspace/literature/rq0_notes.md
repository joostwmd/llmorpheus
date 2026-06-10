# RQ0 — Literature notes

## Sources consulted

| Slug | Citation | Sections read |
|------|----------|---------------|
| `llmorpheus-paper-with-appendix-27mar2025` | Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus. *IEEE TSE*. | Abstract, §1 intro, §3 approach, §5 threats, §6 related work, §7 conclusions |
| `reflections-on-the-reproducibility-of-commercial-llm-performance` | Angermeir, F., et al. (2026). Reflections on the reproducibility of commercial LLM performance. *ICSE*. | Abstract, §1 intro, §2 background (definitions, non-determinism), §4 results (RQ1–RQ3), §5 discussion, §7 conclusion |
| `llms-in-se-a-reproducibility-crisis` | Siddiq, M. L., Islam-Gomes, A., Sekerak, N., & Santos, J. C. S. (2025). LLMs for SE: A reproducibility crisis. | Abstract, §1 intro, §3 methodology (smell taxonomy), §5 recommendations & RMM, §6 discussion, §9 conclusion |
| `mutation_testing_in_practice_insights_from_open-source_software_developers` | Sánchez, A. B., et al. (2024). Mutation testing in practice. *IEEE TSE*. | Abstract, §I intro, §II related work, §VII conclusion |

## Findings relevant to RQ0

### Pipeline design baseline (Tip et al.)

- LLMorpheus is a three-stage toolchain: **prompt generator → LLM mutant generator → modified StrykerJS** (`--usePrecomputed`). Placeholders mark mutation sites; the LLM suggests buggy replacements; Stryker classifies killed/survived/timed-out mutants.
- The original evaluation runs on **13 JavaScript/TypeScript packages** with documented constants (`template-full`, T=0, maxTokens=250, `SystemPrompt-MutationTestingExpert`), five repetitions per configuration, and public data at `github.com/neu-se/mutation-testing-data`.
- Section 5 explicitly frames **LLM reproducibility** as a threat and mitigates it via archived open-weight models, five trials, and published artifacts — but that is evidence about the *original* study design, not a claim that this thesis replicates paper aggregates.
- Related work cites Sánchez et al. on practitioner adoption and notes Stryker as the mutation engine LLMorpheus extends — aligns with thesis GHA workflow (OpenRouter → LLMorpheus → Stryker → artifacts).

### What RQ0 is (and is not) in literature terms

- **RQ0 answers internal readiness:** Does *our* forked pipeline produce non-empty, parseable artifacts for all models in the study matrix under fixed constants? This is a **validation gate** (outline Block 2), not external replication of Tip et al. numbers or proof the paper is correct.
- Tip et al. is the **method and tool** citation; Angermeir et al. and Siddiq et al. justify why downstream RQ1–RQ5 results must be framed as **time-conditional snapshots**, even after RQ0 passes.

### Reproducibility threats supporting Method Blocks 10–11

**Angermeir et al. (2026)** — attempted replication of 18 ICSE/ASE 2024 OpenAI artefact studies:

- Only **5/18** were executable; **0/5** fully reproduced original metrics (2 partial, 3 divergent).
- Meta-analysis of 85 papers: **50/85** lacked usable artefacts; **8/85** did not name models; only **29/85** reported temperature; **14/85** reported top-p/top-k.
- Impeding factors: incomplete artefacts, dependency drift, deprecated models (thesis analogue: CodeLlama-34B 404 on OpenRouter), vague model versioning, missing evaluation scripts.
- Non-determinism at T=0 and **model version drift** undermine point replication even when code runs — supports thesis multi-run policy (RQ2) and explicit logging of OpenRouter slug + timestamp (Block 10).

**Siddiq et al. (2025)** — 640 LLM-for-SE papers (2020–2025):

- Prevalent smells: **Access/Legal (35.9%)**, **Code/Execution (35.5%)**, **Versioning (32.2%)**, **Environment/Tooling (21.1%)**; **Model smells** include missing prompt templates and inference parameters.
- Artifact badges signal presence, not **execution fidelity** or long-term durability (>40% of “functional” artifacts fail within months).
- Actionable overlap with thesis mitigations: pin dependencies/commits, document API model ID and access date, archive prompts/completions, containerize/pin Node+Stryker fork, treat API mutant generation as **time-conditional** while fixed `mutants.json` analysis is reproducible.
- **RMM** (Reproducibility Maturity Model) provides vocabulary for Block 10/11: thesis artifact archiving + pinned `thesis-six.json` + documented constants targets RMM-1/2, not RMM-3 independent verification.

### Practitioner context (optional intro motivation)

**Sánchez et al. (2024)** — survey of 104 OSS developers using mutation tools:

- High satisfaction; mutation coverage often integrated into **CI/CD** workflows; **StrykerJS** among tools studied.
- **Performance** is the dominant adoption barrier — supports investing in automated pipeline validation (RQ0) before scaling a 10-model comparative study.
- Does not address LLM-based mutation; use only for “mutation testing in practice” motivation, not RQ0 methodology.

### Alignment with outline Blocks 2, 10, 11

| Outline block | Literature support |
|---------------|-------------------|
| Block 2 — RQ0 not external replication | Tip et al. = baseline method; thesis scope statement in outline; Angermeir on futility of exact commercial-LLM replication |
| Block 10 — Data management | Siddiq versioning/access smells; Tip public artifact practice; Angermeir on documenting model ID, prompts, timestamps |
| Block 11 — Reliability threats | Angermeir non-determinism + deprecation; Siddiq model/API smells; Tip §5 reproducibility caveats for LLM tools |

## Gaps in our library

- No processed paper on **CI-specific LLMorpheus + OpenRouter integration** — acceptable; RQ0 is an internal smoke test, not a literature contribution.
- **Baltes et al. (2025) LLM-SE reporting guidelines** and **Wagner et al. (2025) evaluation guidelines** cited by Angermeir/Siddiq but not in `reference_catalog.md` — optional cross-refs for Methods prose if added later.
- **Pizzoleto et al. (2019) mutation cost SLR** — RQ4 scope, not RQ0.
- No literature on **OpenRouter-specific** reproducibility; thesis must state provider-path limitation explicitly (outline Block 11).

## Suggested citations for Writing

- **Method §RQ0 / pipeline validation:** Tip et al. (2025) for LLMorpheus→Stryker architecture and original evaluation constants; `thesis/rq0/replication.md` + FINDINGS for empirical checklist (not literature).
- **Scope boundary (“not external replication”):** Tip et al. (2025) + outline Block 2 framing; Angermeir et al. (2026) for why exact replication of legacy paper numbers is neither claimed nor feasible.
- **Block 10 artifact layout & time-conditional generation:** Siddiq et al. (2025) versioning/access smells; Angermeir et al. (2026) on deprecated endpoints and incomplete artefacts.
- **Block 11 reliability (API drift, T=0 nondeterminism):** Angermeir et al. (2026); Siddiq et al. (2025) model-smell recommendations (document temperature, prompts, model IDs).
- **Intro motivation (optional):** Sánchez et al. (2024) for mutation testing adoption and CI integration context.
