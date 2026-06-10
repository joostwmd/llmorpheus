# Reference catalog (June 2026)

Master index for all processed papers (28 folders; 27 canonical slugs). **Duplicate:** `a-comprehensive-study-on-large-language-models-for-mutation-testing` = alias of `comprehensive-study-on-llms-for-mutation-test` — do not cite both; Writing agent should ignore the duplicate slug.

| Slug | APA (short) | Primary RQs | Outline blocks | One-line relevance |
|------|-------------|-------------|----------------|-------------------|
| llmorpheus-paper-with-appendix-27mar2025 | Tip et al. (2025) LLMorpheus | RQ0–5 | Intro 1–3, Bg 3–6, Meth all, Disc 5.x | Baseline pipeline, manual equiv 20.2%, cost/temp/prompt |
| comprehensive-study-on-llms-for-mutation-test | Wang et al. (2025) LLM mutation comprehensive | RQ1,4,5 | Bg 5–6, Disc 5.1,5.4 | Multi-LLM mutation study; validity, equiv rates, Java |
| llms-for-equivalent-mutant-detection | Wang et al. (2024) EMD LLMs (ISSTA) | RQ3 | Bg 4, Meth 9, Disc 5.3 | LLM-based EMD vs baselines; contrasts with UniXCoder |
| mutation-guided-unit-test-gen-with-llms | Wang et al. (2025) MutGen | RQ1 | Bg 5 | Mutation guides test gen — scope exclusion |
| effective-test-generation-using-pre-trained-llms | Dakhel et al. (2024) MuTAP | RQ1 | Bg 5 | LLM + mutation for tests — scope exclusion |
| quality-assurance-of-llm-generated-code | Sun et al. (2025) NFQC | RQ4,5 | Bg 2, Disc 5.4–5.5 | Non-functional quality varies by model |
| an_analysis_and_survey_of_the_development_of_mutat | Jia & Harman (2010) | RQ1 | Bg 1 | Mutation survey; CPH; coupling effect |
| mutation-testing-advances | Papadakis et al. (2019) | RQ1,3 | Bg 1,4 | Mutation advances survey; equivalent mutants |
| coverage-is-not-correlated | Inozemtseva & Holmes (2014) | RQ1 | Intro 1, Bg 1 | Coverage weak proxy for effectiveness |
| mutant-census | Gopinath et al. (2014) | RQ1 | Bg 1 | CPH empirical qualification |
| software-testing-verif-rel-2024-ahmed-a-new-perspective-on-the-competent-program | Ahmed et al. (2024) CPH | RQ1 | Bg 1 | Modern CPH via Defects4J mutations |
| a-study-on-equivalent-and-stubborn | Yao et al. (2014) | RQ3 | Bg 4, Disc 5.3 | Human equiv analysis; operator-dependent rates |
| overcoming_the_equivalent_mutant_problem_a_systematic_literature_review_and_a_co | Madeyski et al. (2014) EMP SLR | RQ3 | Bg 4 | EMP techniques taxonomy |
| covering-and-uncovering-equivalent-mutants | Schuler & Zeller (2013) | RQ3 | Bg 4 | ~45% equiv among undetected; manual cost |
| unixcoder-unified-croos-modal | Guo et al. (2022) UniXcoder | RQ3 | Meth 9 | Classifier base model |
| understanding-and-mitigating-numerical-sources | Yuan et al. (2025) NeurIPS | RQ2 | Bg 2, Disc 5.2 | GPU/batch nondeterminism at greedy decode |
| the-good-the-bad-and-the-greedy | Song et al. (2024) EMNLP | RQ2 | Bg 2, Disc 5.2 | Eval must report run variance |
| introducing-background-temperature | Messina & Scotta (2026) | RQ2 | Disc 5.2 | Hidden randomness at T = 0 |
| zhao-llm-survey-2023 | Zhao et al. (2023) LLM survey | RQ2 | Intro 2, Bg 2 | LLM landscape / rapid change |
| fan-llms-for-software-engineering-2023 | Fan et al. (2023) ICSE-FoSE | RQ2 | Intro 2, Bg 2 | LLM-for-SE open problems |
| wang-software-testing-with-llms-2024 | Wang et al. (2024) testing+LLM | RQ1,2 | Bg 2,5 | LLM testing survey |
| reflections-on-the-reproducibility-of-commercial-llm-performance | Angermeir et al. (2026) ICSE | RQ0,5 | Meth 10–11, Disc 5.5 | Commercial LLM repro failures |
| llms-in-se-a-reproducibility-crisis | Siddiq et al. (2025) | RQ0,5 | Meth 11 | LLM-SE reproducibility audit |
| the-open-source-advantage | Manchanda et al. (2024) | RQ5 | Bg 2, Disc 5.5 | Open vs closed LLM advantages |
| performance-closed-and-open-source | Ahmed et al. (2024) closed/open data | RQ5 | Disc 5.5 | Performance differs on OSS vs proprietary code |
| opening-up-chatgpt | Liesenfeld et al. (2023) ACL | RQ5 | Disc 5.5 | Openness/transparency spectrum |
| mutation_testing_in_practice_insights_from_open-source_software_developers | Sánchez et al. (2024) | RQ0 | Intro 1 | Developer views on mutation testing |

## RQ quick map

| RQ | Must-read slugs |
|----|-----------------|
| RQ0 | `llmorpheus-paper-with-appendix-27mar2025`, `reflections-on-the-reproducibility-of-commercial-llm-performance`, `llms-in-se-a-reproducibility-crisis`, `mutation_testing_in_practice_insights_from_open-source_software_developers` |
| RQ1 | `llmorpheus-paper-with-appendix-27mar2025`, `comprehensive-study-on-llms-for-mutation-test`, `an_analysis_and_survey_of_the_development_of_mutat`, `coverage-is-not-correlated`, `wang-software-testing-with-llms-2024` |
| RQ2 | `llmorpheus-paper-with-appendix-27mar2025`, `understanding-and-mitigating-numerical-sources`, `the-good-the-bad-and-the-greedy`, `zhao-llm-survey-2023`, `fan-llms-for-software-engineering-2023` |
| RQ3 | `llmorpheus-paper-with-appendix-27mar2025`, `overcoming_the_equivalent_mutant_problem_a_systematic_literature_review_and_a_co`, `a-study-on-equivalent-and-stubborn`, `llms-for-equivalent-mutant-detection`, `unixcoder-unified-croos-modal`, `covering-and-uncovering-equivalent-mutants` |
| RQ4 | `llmorpheus-paper-with-appendix-27mar2025`, `comprehensive-study-on-llms-for-mutation-test`, `quality-assurance-of-llm-generated-code` |
| RQ5 | `the-open-source-advantage`, `performance-closed-and-open-source`, `quality-assurance-of-llm-generated-code`, `reflections-on-the-reproducibility-of-commercial-llm-performance`, `opening-up-chatgpt` |
