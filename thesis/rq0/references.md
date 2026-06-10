# RQ0 — References for writing

> Curated from `thesis/references/processed/`. Primary = cite first for pipeline validation, experimental readiness, and reproducibility threats (Method Blocks 2, 10, 11).

## Primary sources

| APA (short) | Slug path | Use when writing |
|-------------|-----------|------------------|
| Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952 | `llmorpheus-paper-with-appendix-27mar2025` | Baseline **LLMorpheus → Stryker** pipeline (§3); original evaluation constants and five-trial design; §5 reproducibility mitigations. Cite as **method/tool extended**, not as replication target. |
| Angermeir, F., Amougou, M., Kreitz, M., Bauer, A., Linhuber, M., Fucci, D., Moyón C., F., Mendez, D., & Gorschek, T. (2026). Reflections on the reproducibility of commercial LLM performance in empirical software engineering studies. *ICSE*. | `reflections-on-the-reproducibility-of-commercial-llm-performance` | **Threats Block 11** and **Block 10 boundaries**: 0/5 OpenAI artefact studies fully reproduced; deprecated models, missing model IDs, T=0 variability, incomplete packages. Supports “time-conditional snapshot” framing. |
| Siddiq, M. L., Islam-Gomes, A., Sekerak, N., & Santos, J. C. S. (2025). Large language models for software engineering: A reproducibility crisis. | `llms-in-se-a-reproducibility-crisis` | **Documentation standards** for LLM-SE studies: versioning, access/legal, prompt/model disclosure smells; badges ≠ durable reproducibility; RMM vocabulary. Supports artifact archiving and pinned-config checklist in Block 10. |

## Supporting sources

| APA (short) | Slug path | Use when writing |
|-------------|-----------|------------------|
| Sánchez, A. B., Parejo, J. A., Segura, S., Durán, A., & Papadakis, M. (2024). Mutation testing in practice: Insights from open-source software developers. *IEEE Transactions on Software Engineering*. | `mutation_testing_in_practice_insights_from_open-source_software_developers` | **Optional Intro only**: practitioners run mutation tools (incl. StrykerJS) in CI; performance barriers. Not RQ0-specific — do not use for pipeline-validation claims. |

## Cross-RQ / background only (link, do not re-explain)

- **Yuan et al. (2025), Song et al. (2024), Messina & Scotta (2026)** — GPU/T=0 nondeterminism; see `rq2/references.md` (RQ0 cites Angermeir/Siddiq instead for Methods threats).
- **Jia & Harman (2010), Papadakis et al. (2019)** — mutation testing foundations; see `rq1/references.md`.
- **Opening-up-chatgpt, the-open-source-advantage, performance-closed-and-open-source** — deployment openness; see `rq5/references.md`.
- **Baltes et al. (2025) LLM-SE guidelines** — cited by Angermeir/Siddiq but not in processed library; optional forward reference only.

## Outline hooks (claim → citation)

| Claim | Citation |
|-------|----------|
| “RQ0 validates **internal pipeline readiness**, not external replication of Tip et al.” | Tip et al. (2025); thesis outline Block 2; Angermeir et al. (2026) |
| “The toolchain follows LLMorpheus → Stryker with precomputed mutants.” | Tip et al. (2025) §3 |
| “Successful RQ0 means non-empty artifacts and parseable downstream inputs — a prerequisite gate, not a hypothesis test.” | FINDINGS only for numbers; Tip et al. (2025) for pipeline architecture |
| “Mutant generation via API-hosted models is **time-conditional**; fixed `mutants.json` analysis is reproducible under pinned tooling.” | Siddiq et al. (2025); Angermeir et al. (2026); outline Block 10 |
| “Commercial model deprecation (e.g., unavailable endpoints) is a documented reproducibility failure mode.” | Angermeir et al. (2026); Siddiq et al. (2025) Access/Versioning smells |
| “Studies must document model ID, temperature, prompts, and timestamps — common LLM-SE failure modes when omitted.” | Siddiq et al. (2025); Angermeir et al. (2026) |
| “Mutation testing is used in practice, often via CI — motivating reliable tooling before large-scale comparison.” | Sánchez et al. (2024) — Intro optional |

## Gaps

- No processed source on OpenRouter-specific reproducibility; state as thesis limitation in Block 11.
- No CI/workflow paper for LLMorpheus — RQ0 evidence comes from `thesis/rq0/FINDINGS.md` and `replication.md`, not literature.
- Reporting-guidelines papers (Baltes et al., 2025) not in library — optional addition if Methods needs a checklist citation beyond Siddiq/Angermeir.
