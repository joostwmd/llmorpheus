# RQ1 — References for writing

> Curated from `thesis/references/processed/`. Primary = cite first for mutant volume/quality, Background Block 1, and Discussion §5.1. Paths are slug folders under `thesis/references/processed/{slug}/paper.md`.

## Primary sources

| APA 7 (short) | Slug | Use when writing |
|---------------|------|------------------|
| Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952 | `llmorpheus-paper-with-appendix-27mar2025` | Baseline validity funnel (#invalid, #identical, #duplicate); package-level mutation-score spread; 20.2% manual equiv among survivors; longitudinal peers (`gpt-4o-mini`, `llama-3.3-70b`); edit-distance appendix. **Directional only** — not replication of 13-package aggregates. |
| Wang, B., Chen, M., Deng, M., Lin, Y., Harman, M., Papadakis, M., & Zhang, J. M. (2025). A comprehensive study on large language models for mutation testing. *ACM Transactions on Software Engineering and Methodology*. | `comprehensive-study-on-llms-for-mutation-test` | Landscape: LLM vs rule-based (PIT/Major) on Java — higher fault detection & diversity, worse compilability/duplicate/equiv rates; AST edit-distance distributions. **Complementary**, not competing numeric benchmark for thesis-six JS. |
| Jia, Y., & Harman, M. (2010). An analysis and survey of the development of mutation testing. *IEEE Transactions on Software Engineering*, *37*(5), 649–678. | `an_analysis_and_survey_of_the_development_of_mutat` | Background Block 1: CPH, coupling effect, mutation process, mutation score definition, equivalent-mutant problem. |
| Inozemtseva, L., & Holmes, R. (2014). Coverage is not strongly correlated with test suite effectiveness. In *Proceedings of the 36th International Conference on Software Engineering (ICSE)* (pp. 435–445). ACM. https://doi.org/10.1145/2568225.2568271 | `coverage-is-not-correlated` | Background Block 1: why mutation testing (not coverage alone) for adequacy; Intro motivation. |
| Papadakis, M., Kintis, M., Zhang, J., Jia, Y., Le Traon, Y., & Harman, M. (2019). Mutation testing advances: An analysis and survey. In *Advances in Computers* (Vol. 112, pp. 275–378). Elsevier. | `mutation-testing-advances` | Mutation score conventions; equivalent/redundant mutants depress interpretability; coverage–fault correlation limits; experimental methodology best practices. |

## Supporting sources

| APA 7 (short) | Slug | Use when writing |
|---------------|------|------------------|
| Gopinath, R., Jensen, C., & Groce, A. (2014). Mutant census: An empirical examination of the competent programmer hypothesis. In *Proceedings of the 2014 International Symposium on Software Testing and Analysis (ISSTA)* (pp. 119–130). ACM. | `mutant-census` | Optional Background Block 1 depth: typical fault ~3–4 tokens; qualifies Levenshtein as comparative subtlety proxy in §5.1. |
| Ahmed, Z., Grabowski, J., Schwass, E., Herbold, S., & Trautsch, F. (2024). A new perspective on the competent programmer hypothesis through reproduction of real faults with repeated mutations. *Software Testing, Verification and Reliability*. https://doi.org/10.1002/stvr.1874 | `software-testing-verif-rel-2024-ahmed-a-new-perspective-on-the-competent-program` | Optional CPH discussion: higher-order paths on Defects4J; classic operators miss method-call/block faults — supports LLMorpheus motivation bridge. |
| Wang, J., Huang, Y., Chen, C., Liu, Z., Wang, S., & Wang, Q. (2024). Software testing with large language models: Survey, landscape, and vision. *IEEE Transactions on Software Engineering*. | `wang-software-testing-with-llms-2024` | Background Block 5 positioning: LLM-for-testing survey; mutation testing as accompaniment to LLM test gen — frames RQ1 within broader literature. |
| Wang, G., Xu, Q., Briand, L., & Liu, K. (2025). Mutation-guided unit test generation with a large language model. *IEEE Transactions on Software Engineering*. | `mutation-guided-unit-test-gen-with-llms` | **Contrast only (Block 5):** mutation feedback improves *test* mutation scores — exclude from RQ1 scope. |
| Dakhel, A. M., Nikanjam, A., Majdinasab, V., Khomh, F., & Desmarais, M. C. (2024). Effective test generation using pre-trained large language models and mutation testing. *Information and Software Technology*. | `effective-test-generation-using-pre-trained-llms` | **Contrast only (Block 5):** MuTAP — surviving mutants in prompts for test gen — exclude from RQ1 scope. |

## Cross-RQ / shared Background only

Papers cited in shared Background blocks but owned primarily by other RQs. Do not lead RQ1 Results with these; use for chapter continuity.

| APA 7 (short) | Slug | Background block | Primary RQ owner |
|---------------|------|------------------|------------------|
| Tip, F., et al. (2025). LLMorpheus. | `llmorpheus-paper-with-appendix-27mar2025` | Blocks 3, 5, 6 | RQ0–RQ5 (also Primary above) |
| Zhao, W. X., et al. (2023). A survey of large language models. *arXiv preprint arXiv:2303.18223*. | `zhao-llm-survey-2023` | Block 2 (LLM foundations) | RQ2, Intro |
| Fan, A., et al. (2023). Large language models for software engineering: Survey and open problems. In *ICSE-FoSE* (pp. 31–53). IEEE. | `fan-llms-for-software-engineering-2023` | Block 2 | RQ2, Intro |
| Yuan, J., et al. (2025). Understanding and mitigating numerical sources of nondeterminism in LLM inference. *NeurIPS*. | `understanding-and-mitigating-numerical-sources` | Block 2, 5 (determinism row) | RQ2 |
| Song, Y., et al. (2024). The good, the bad, and the greedy. *EMNLP*. | `the-good-the-bad-and-the-greedy` | Block 2 | RQ2 |
| Madeyski, L., et al. (2014). Overcoming the equivalent mutant problem. *IEEE TSE*, *40*(1), 23–42. | `overcoming_the_equivalent_mutant_problem_a_systematic_literature_review_and_a_co` | Block 4 | RQ3 |
| Yao, X., Harman, M., & Jia, Y. (2014). Equivalent and stubborn mutants. *ICSE* (pp. 919–930). | `a-study-on-equivalent-and-stubborn` | Block 4, 5 | RQ3 |
| Schuler, D., & Zeller, A. (2013). Covering and uncovering equivalent mutants. *STVR*, *23*(5), 353–374. | `covering-and-uncovering-equivalent-mutants` | Block 4 | RQ3 |
| Siddiq, M. L., et al. (2025). LLMs for SE: A reproducibility crisis. | `llms-in-se-a-reproducibility-crisis` | Block 6 | RQ0, RQ5 |
| Angermeir, F., et al. (2026). Reflections on the reproducibility of commercial LLM performance. *ICSE*. | `reflections-on-the-reproducibility-of-commercial-llm-performance` | Block 2, 6 | RQ0, RQ5 |

## Outline hooks for this RQ (claim → citation)

| Outline target | Claim | Cite |
|----------------|-------|------|
| **Bg 1** | Mutation adequacy asks whether tests detect plausible faults, not just execute code | Inozemtseva & Holmes (2014) |
| **Bg 1** | CPH and coupling justify small first-order mutants | Jia & Harman (2010) |
| **Bg 1** | Mutation score conventions; equivalent mutants confound interpretation | Papadakis et al. (2019) |
| **Bg 1** (optional) | Real faults often ~3–4 tokens; operators incomplete | Gopinath et al. (2014); Ahmed et al. (2024) |
| **Bg 5** | LLM mutants: more diverse, higher detection; worse validity/equiv vs rule-based | Wang, B., et al. (2025) |
| **Bg 5** | LLMorpheus pipeline, validity funnel, manual equiv baseline | Tip et al. (2025) |
| **Bg 5** | Scope: we generate mutants, not mutation-guided tests | Wang, G., et al. (2025) MutGen; Dakhel et al. (2024) MuTAP |
| **Bg 6** | Thesis extends Tip/Wang with 10 models, stability, equiv-adjusted cost | Tip et al. (2025); Wang, B., et al. (2025) |
| **§5.1** | Package identity explains more variance than model | **FINDINGS**; Tip et al. for prior package spread |
| **§5.1** | Mutation score vs survivor count optimize different goals | Papadakis et al. (2019); **FINDINGS** for Qwen/Haiku trade-off |
| **§5.1** | Validity funnel wastes budget before Stryker | Wang, B., et al. (2025); Tip et al. (2025); **FINDINGS** |
| **§5.1** | Levenshtein = comparative edit style, not semantic realism | Gopinath et al. (2014); Wang, B., et al. (2025) AST distance; **FINDINGS** |
| **§5.1** | Descriptive leaders coexist with non-significant omnibus tests | **FINDINGS only** — no literature p-values |
| **§5.8** | Invalid: 13-package paper aggregates vs 6-package thesis medians | Tip et al. (2025) — directional peers on shared packages only |

## Gaps

- Foster et al. (2025) Meta mutation-guided test generation — optional Block 5 contrast; not in processed library.
- DeMillo et al. (1978) — cite indirectly via Jia & Harman (2010).
- No processed paper directly compares ten modern LLMs on LLMorpheus JS volume/quality — **this thesis fills that gap** (outline Block 6).
