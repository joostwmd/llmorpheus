# Bachelor Thesis Outline (canonical)

> **Canonical planning document** for agents and drafting. Supersedes `thesis/archive/outline.md`.  
> Aligned with RQ0–RQ5 (`thesis/meta/rq_overview.md`, `thesis/rqX/spec.md`, `thesis/context/thesis_context.md`).  
> Last updated: June 2026.

---

# Introduction

## Block 1

**Title**  
Motivation and Problem Statement: Modern LLM Re-evaluation of LLMorpheus

**Goal**  
Motivate the thesis topic and state the concrete problem: traditional mutation testing is limited by fixed operator sets; LLMorpheus proposes LLM-driven mutant generation whose effectiveness must be re-evaluated for modern models under a controlled, practitioner-oriented setup.

**Content (detailed bullets)**

- **Motivation: quality assurance in AI-assisted development**  
  The increasing use of LLMs in software engineering strengthens the need for explicit quality assurance mechanisms for generated and assisted code, rather than relying solely on superficial correctness signals.

- **Scope clarification**  
  This thesis does not generate tests with LLMs. It evaluates LLM-generated mutants against existing project test suites.

- **Mutation testing as a test adequacy technique**  
  Mutation testing evaluates a test suite by injecting small faults (“mutants”) and executing tests to classify mutants as killed, survived, or timed out.  
  Mutation adequacy is commonly regarded as more stringent than line or branch coverage, motivating mutation testing as a stronger indicator of test effectiveness (Inozemtseva & Holmes, 2014).

- **Limitation of traditional operator-based mutation testing**  
  State-of-the-practice tools rely on a fixed set of mutation operators. This restricts the types of faults that can be simulated and can miss real-world bug patterns.  
  Extending operator sets increases engineering effort and can significantly increase the cost of mutation analysis (more mutants to run, longer analysis time).

- **LLMorpheus as an alternative**  
  LLMorpheus generalizes operator-based mutation by inserting placeholders at pre-defined code locations and prompting an LLM to propose buggy replacements (Tip et al., 2025).  
  It filters syntactically invalid and duplicate suggestions and runs the resulting mutants via a StrykerJS-based analysis pipeline to classify outcomes.

- **Research gap addressed by this thesis (high-level preview)**  
  The LLMorpheus study evaluated a specific set of models available at the time. Since LLM capabilities and cost profiles evolve rapidly, it is unclear how modern models compare and what trade-offs exist in terms of effectiveness, stability across runs, equivalence among survivors, cost, and open-weight vs API-only deployment.  
  This motivates an updated, practitioner-oriented evaluation focusing on:  
  - modern model comparison (RQ1),  
  - run-to-run stability (RQ2),  
  - equivalence-aware interpretation of survivors (RQ3),  
  - cost-effectiveness (RQ4), and  
  - open-weight vs API-only category comparison (RQ5).

**Sources / references (APA 7)**

- Inozemtseva, L., & Holmes, R. (2014). Coverage is not strongly correlated with test suite effectiveness. In *Proceedings of the 36th International Conference on Software Engineering (ICSE 2014)* (pp. 435–445). ACM. https://doi.org/10.1145/2568225.2568271
- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952
- Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., … Wen, J.-R. (2023). A survey of large language models. *arXiv preprint arXiv:2303.18223*. https://arxiv.org/abs/2303.18223

---

## Block 2

**Title**  
Problem Statement and Research Gap: Updating LLMorpheus for Modern LLMs

**Goal**  
State why the original LLMorpheus evaluation is no longer sufficient for today’s practitioner decisions, and define the concrete research gaps this thesis addresses under a controlled, clearly scoped setup.

**Content (detailed bullets)**

- **Problem statement: LLMorpheus evidence is tied to an evaluation snapshot**  
  The LLMorpheus paper demonstrates that LLM-driven mutant generation can complement operator-based mutation testing. However, its empirical findings are tied to the models, providers, and price/performance characteristics available at the time of evaluation.  
  Because the LLM landscape changes rapidly (new model families, deployment options, shifting cost structures), it is unclear how well those conclusions transfer to modern models developers would select today (Zhao et al., 2023).

- **Research gap 1: modern model comparison (effectiveness and mutant characteristics)**  
  The original study compares several models from that era and analyzes temperature and prompt-template effects, but it does not provide guidance on how newer models behave within the LLMorpheus pipeline.  
  Open question: Which modern models produce the most useful mutants today—in terms of mutation-testing outcomes, validity rates, and edit subtlety—and how do they compare to original baselines under a fixed configuration?

- **Research gap 2: stability across runs as a separate evaluation dimension (RQ2)**  
  Even at T = 0, some models show meaningful run-to-run variability (Tip et al., 2025). Stability matters for CI adoption and repeatable benchmarking.  
  This thesis treats stability as its own research question (Jaccard overlap, SD of key metrics), not merely a sub-metric of effectiveness.

- **Research gap 3: equivalence-aware interpretation of surviving mutants (RQ3)**  
  Surviving mutants are a mixed signal: they may expose test weaknesses or reflect equivalent (behavior-preserving) changes.  
  The original paper studies equivalent mutants via manual examination; manual labeling does not scale for broad modern-model comparisons with repeated runs.  
  An updated evaluation should estimate how much survival is plausibly explained by equivalence, so comparisons do not reward models that generate many equivalent survivors.

- **Research gap 4: cost-effectiveness needs updated, decision-oriented metrics (RQ4)**  
  For practitioners, “better” models generate useful mutants efficiently.  
  LLM pipelines incur token cost and runtime; outputs can include invalid or redundant suggestions. Updated evaluations should report cost-effectiveness alongside effectiveness (e.g., cost per valid mutant, cost per non-equivalent survivor, Pareto analysis).

- **Research gap 5: open-weight vs API-only deployment trade-offs (RQ5)**  
  Open-weight and API-only models existed at the time of the original study, but the paper did not explicitly frame evaluation around the practitioner question of self-hostable vs proprietary API deployment (controllability, repeatability, cost, operational constraints).  
  This thesis compares categories on RQ1–RQ4 metrics while acknowledging that inference runs via OpenRouter for all models.

- **Scope clarifications (avoid overclaiming)**  
  - No LLM-based test generation: mutants only; existing project test suites unchanged.  
  - Fixed configuration (model-first comparison): FULL prompt template, T = 0, maxTokens = 200, reasoning disabled (Gemini 3.x: minimal effort); differences attributed primarily to model choice, not prompt engineering.  
  - No manual equivalent-mutant labeling at scale: validated automated equivalence classifier applied to survivors.  
  - Six-package benchmark subset (thesis-six): documented limitation on generalizability.  
  - RQ0 validates the local pipeline; this thesis does not claim external replication of the 2024 paper.

- **Scope reductions / deferred work**  
  - **Reasoning vs non-reasoning model pairs:** Dropped as an active experimental factor. Reasoning is disabled across the study matrix to keep configuration fixed and costs feasible; reasoning-labelled SKUs (e.g., o-series, R1, `-thinking` variants) are excluded. Any future reasoning comparison is deferred work.  
  - **40-bug real-world resemblance study:** Dropped as active scope. The original paper’s 40-bug case study (Tip et al., 2025) remains cited as prior evidence that LLMorpheus can sometimes produce bug-like mutants; this thesis does not re-run that pipeline on modern models.

**Sources / references (APA 7)**

- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952
- Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., … Wen, J.-R. (2023). A survey of large language models. *arXiv preprint arXiv:2303.18223*. https://arxiv.org/abs/2303.18223

---

## Block 3

**Title**  
Research Questions (RQ0–RQ5)

**Goal**  
Translate the research gaps into a concise set of research questions that guide a practitioner-oriented evaluation of LLMorpheus on modern LLMs, with explicit metrics per question.

**Content (detailed bullets)**

- **Overview**  
  This thesis evaluates how the LLMorpheus mutation-testing pipeline behaves when driven by 10 modern LLMs on a six-package JavaScript benchmark subset.  
  The focus is model comparison and decision-relevant trade-offs (effectiveness, stability, equivalence, cost, deployment category)—not prompt or temperature optimization.  
  RQ0 validates the pipeline before RQ1–RQ5 interpret results.

- **Research questions and key metrics**

  | RQ | Question | Key metrics |
  |----|----------|-------------|
  | **RQ0** | Is the experimental pipeline ready? | Successful end-to-end runs per model; non-empty, parseable artifacts; standardized experimental constants documented |
  | **RQ1** | How many mutants do different models produce and what are they? | #prompts, #candidates, #invalid, #duplicate, #valid mutants; #killed / #survived / #timed-out; mutation score; absolute and normalized Levenshtein (median/IQR) |
  | **RQ2** | How consistent are different models across runs? | Jaccard overlap of mutant sets across runs; SD of mutation score, #survived, absolute Levenshtein (7 affordable multi-run models; 5 reps) |
  | **RQ3** | How likely are different models to generate equivalent mutants? | Classifier validation (accuracy, precision, recall, F1, confusion matrix); predicted-equivalence rate among survivors; effective survivors (predicted behavioral change) |
  | **RQ4** | What does LLMorpheus cost per model? | Input/output tokens; total cost (€); runtime; cost per valid / survived / unique survived / non-equivalent survivor; duplicate and invalid rates; Pareto frontier |
  | **RQ5** | How do open-weight vs API-only models compare? | Category distributions (median/IQR) of RQ1–RQ4 metrics; excludes cross-run Jaccard (unequal run counts across categories) |

- **Notes on interpretation**  
  - Levenshtein distance is a comparative proxy for mutation subtlety; report both normalized and absolute values.  
  - RQ3 classifier outputs are “predicted equivalent,” not ground-truth equivalence proofs.  
  - RQ5 groups 3 open-weight, 6 API-only, and 1 hybrid (DeepSeek); hybrid handled with sensitivity analysis.  
  - Stability (RQ2) and category comparison (RQ5) use different run policies: multi-run (5×) for affordable models, single-run for expensive API models (€15+/run).

- **Scope reductions / deferred work (not active RQs)**  
  - Reasoning vs non-reasoning: not an RQ; reasoning disabled in all runs.  
  - Real-bug resemblance (40-bug study): not an RQ; prior results cited from Tip et al. (2025) only.

**Sources / references (APA 7)**

- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952

---

## Block 4

**Title**  
Study Overview (High-Level Workflow)

**Goal**  
Provide a concise end-to-end overview of what is executed and how outputs answer RQ0–RQ5, without implementation detail.

**Content (detailed bullets)**

- **RQ0 — Pipeline validation**  
  Confirm that the LLMorpheus → Stryker → artifact → `thesis` analysis toolchain produces non-empty, parseable data for each model in the 10-model matrix on the thesis-six package subset.

- **RQ1–RQ4 — Mutation-testing benchmark runs**  
  For each selected model, run the LLMorpheus mutation-testing workflow on six benchmark packages under fixed configuration (FULL template, T = 0, maxTokens = 200).  
  Repeat affordable models five times (RQ2 stability); run expensive API models once (cost feasibility).  
  Compute per-model statistics: mutant volume and validity, mutation outcomes, Levenshtein edit distance (RQ1); cross-run Jaccard and SD summaries for multi-run models (RQ2); apply validated equivalence classifier to survivors (RQ3); derive token, runtime, and cost metrics from logs and a pinned OpenRouter price snapshot (RQ4).

- **RQ5 — Category aggregation**  
  Label each model as open-weight, API-only, or hybrid; aggregate RQ1–RQ4 metrics by category and report distribution summaries (median/IQR). Exclude cross-run Jaccard from category comparison because run counts differ across categories.

- **Data flow (high level)**  
  Prompts → LLM completions → filter/deduplicate → `mutants.json` → Stryker mutation analysis → killed/survived/timed-out + mutation score → downstream RQ scripts (Levenshtein, stability, equivalence screening, cost, category plots).

- **Scope reductions / deferred work**  
  No parallel 40-bug resemblance workflow. No reasoning-model runs or paired reasoning comparisons.

**Sources / references (APA 7)**

- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952

---

## Block 5

**Title**  
Contributions of This Thesis

**Goal**  
Summarize concrete outcomes that make the added value beyond the original LLMorpheus paper explicit.

**Content (detailed bullets)**

- **Updated empirical evaluation on modern models (RQ1)**  
  Controlled comparison of 10 modern LLMs—including original-paper baselines `gpt-4o-mini` and `llama-3.3-70b-instruct` as peers, not replication targets—under a fixed LLMorpheus configuration on a documented six-package subset.

- **Stability-aware benchmarking (RQ2)**  
  Run-to-run variability results for affordable models (five repetitions), including Jaccard overlap and SD summaries for mutation score, survivors, and edit distance.

- **Mutation subtlety characterization (RQ1)**  
  Comparative reporting of mutation edit size via Levenshtein distance (absolute and normalized), aggregated per package and across packages.

- **Equivalence-aware interpretation of survivors (RQ3)**  
  Validation of an automated equivalence-screening classifier on an existing manually labeled mutant dataset; application to surviving mutants to estimate predicted-equivalence rates and effective survivors, improving interpretability of survival-based comparisons.

- **Cost-effectiveness analysis (RQ4)**  
  Token, runtime, and euro cost metrics derived from OpenRouter usage and a pinned price snapshot; cost per valid, survived, unique, and non-equivalent survivor; Pareto analysis of effectiveness vs cost; waste indicators (duplicate and invalid rates).

- **Category-level insights for practitioner model choice (RQ5)**  
  Analysis of open-weight vs API-only (and hybrid sensitivity) on RQ1–RQ4 metrics, supporting deployment decisions beyond single-model rankings.

- **Reproducible pipeline and artifacts (RQ0)**  
  Documented experimental constants, model registry, and artifact layout enabling audit and extension.

- **Scope reductions / deferred work (explicit non-contributions)**  
  This thesis does not contribute new evidence on reasoning vs non-reasoning mutant generation or on automated 40-bug resemblance for modern models; those remain future work or prior art (Tip et al., 2025).

**Sources / references (APA 7)**

- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952

---

## Block 6

**Title**  
Thesis Structure

**Goal**  
Provide a short roadmap of remaining chapters so the reader knows where each research question is addressed.

**Content (detailed bullets)**

- **Chapter 1 — Introduction**  
  Motivation, problem statement, research gaps, RQ0–RQ5 overview, contributions, scope reductions, chapter map.

- **Chapter 2 — Background and Related Work**  
  Mutation testing fundamentals; LLM foundations (transformers, open-weight vs API-only, API drift threats); LLMorpheus technique and tool; equivalent mutants as an interpretation challenge; related work positioning.

- **Chapter 3 — Methodology / Experimental Setup (RQ0)**  
  Pipeline validation checklist; model selection (10 models, categories, run policies); benchmark package selection (thesis-six); fixed configuration; repetition protocol; metrics definitions; equivalence-classifier validation and application workflow; threats to validity at design level.

- **Chapter 4 — Results (RQ1–RQ5)**  
  - RQ1: mutant volume, validity, mutation score, Levenshtein  
  - RQ2: stability (Jaccard, SD) for multi-run models  
  - RQ3: classifier validation + predicted equivalence among survivors  
  - RQ4: cost and Pareto analysis  
  - RQ5: open-weight vs API-only category comparison  

- **Chapter 5 — Discussion and Threats to Validity**  
  Interpretation of findings; practitioner guidance; limitations (six-package subset, time-conditional APIs, classifier uncertainty, unequal run counts); deferred scope (reasoning pairs, 40-bug study).

- **Chapter 6 — Conclusion and Future Work**  
  Summary of answers to RQ0–RQ5; contributions recap; future work (broader benchmarks, reasoning-model comparison, bug-resemblance replication, improved equivalence filtering).

**Sources / references (APA 7)**

- (Chapter map only; no additional citations required.)

---

# Background

## Block 1

**Title**  
Mutation Testing: Measuring Test Suite Adequacy via Injected Faults

**Goal**  
Define mutation testing and position it as the baseline technique LLMorpheus extends: why programs are mutated, how tests are judged, and what classic limitations motivate LLM-based mutant generation.

**Content (detailed bullets)**

- **Core idea**  
  Mutation testing evaluates a test suite by injecting small modifications (“mutants”) into the program and re-running the test suite on each mutant.  
  If tests fail, the mutant is killed; if tests still pass, it survives (suggesting a potential test weakness).  
  This operationalizes test adequacy beyond coverage by asking: “Do tests detect plausible faults?” (Inozemtseva & Holmes, 2014).

- **Underlying assumptions**  
  - *Competent programmer hypothesis:* real buggy programs are usually close to correct.  
  - *Coupling effect:* tests strong enough to detect simple faults often detect more complex faults.  
  These justify using relatively small code changes to approximate real faults.

- **How traditional mutation tools create mutants**  
  Most tools implement a fixed set of mutation operators (e.g., replace operators/constants, tweak branch conditions, delete statements).  
  Each additional operator increases mutant count and runtime because each mutant must be executed and analyzed in isolation.

- **Key outputs and metrics**  
  - Per-mutant classification: killed / survived / timed-out.  
  - Mutation score: proportion of mutants killed (conventions vary for invalid, equivalent, and timed-out mutants).  
  - Practical artifact: interactive reports listing mutants and status (LLMorpheus uses customized StrykerJS).

- **Important limitation: operator sets miss many real bug patterns**  
  Some real faults are not coupled to classic operators (e.g., calling the wrong method).  
  Extending tools with many operators can explode mutant counts and slow analysis.

- **Bridge to LLMorpheus**  
  This limitation motivates LLMorpheus: keep location selection rule-based, but let an LLM propose diverse, realistic replacements aiming to produce mutants operator-based tools struggle to express (Tip et al., 2025).

**Sources / references (APA 7)**

- Inozemtseva, L., & Holmes, R. (2014). Coverage is not strongly correlated with test suite effectiveness. In *Proceedings of the 36th International Conference on Software Engineering (ICSE 2014)* (pp. 435–445). ACM. https://doi.org/10.1145/2568225.2568271
- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952

---

## Block 2

**Title**  
Large Language Models: Transformers, Open-Weight vs API-Only Access, and API Drift Threats

**Goal**  
Introduce LLMs at the level needed for this thesis (Transformer basis, deployment categories compared in RQ5), and document the main threat to validity when using API-hosted models via OpenRouter: model drift and deployment opacity. Reasoning vs non-reasoning is background context only—not an experimental factor in this study.

**Content (detailed bullets)**

- **What an LLM is**  
  LLMs are language models trained at scale, typically with a next-token prediction objective, enabling strong prompt-based generalization (Zhao et al., 2023).

- **Transformer foundation**  
  Modern LLMs build on the Transformer architecture and self-attention, which has become the dominant foundation for large-scale language modeling (Zhao et al., 2023).

- **Open-weight vs API-only models (RQ5 categories)**  
  - *Open-weight:* weights are publicly available; models can be self-hosted or served by third parties, improving auditability and version-pinning options in principle.  
  - *API-only:* weights are proprietary; access is via vendor APIs with less transparent training and update cadence.  
  - *Hybrid (this thesis):* DeepSeek Chat v3.1—open weights accessed via API in this study; classified separately with sensitivity analysis.  
  In this thesis, all models are queried via OpenRouter; category labels capture deployment paradigm relevant to practitioners, not identical serving conditions.

- **Why access type matters for mutation testing**  
  Differences in instruction-following, output-format compliance, cost structure, and operational constraints (rate limits, governance) can affect mutant generation quality and feasibility in CI—even when the same prompt template is used.

- **Reasoning-capable models (background only; not an experimental factor)**  
  Some modern SKUs allocate extra compute to multi-step reasoning (e.g., o-series, R1, `-thinking` variants). They can differ in latency, token usage, and output verbosity.  
  **This thesis disables reasoning for all models** and excludes reasoning pairs from scope to hold configuration fixed and control cost. Reasoning effects on mutant generation remain an open question for future work.

- **Threats to validity: API-hosted LLM drift and deployment opacity**  
  Even with T = 0 and fixed prompts, served models can change over time (weight updates, post-training, inference-stack changes).  
  Providers may apply routing, load balancing, moderation, or hidden system prompts not visible to the researcher.  
  **Mitigations in this thesis:** treat results as time- and provider-conditional; log model identifiers and decoding parameters; repeat affordable models and report variability (RQ2); archive prompts and completions.

- **Provenance note (scope-limited)**  
  Training data composition is often not fully observable; treated as a measurement and interpretation issue, not a broad societal-impact section.

**Sources / references (APA 7)**

- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952
- Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., … Wen, J.-R. (2023). A survey of large language models. *arXiv preprint arXiv:2303.18223*. https://arxiv.org/abs/2303.18223

---

## Block 3

**Title**  
LLMorpheus: Placeholder-Guided Mutation Testing with LLM-Generated Mutants (JavaScript)

**Goal**  
Describe the LLMorpheus technique and tool at a systems level: placeholder-guided prompting, filtering/recording, StrykerJS integration, and the scope of the original empirical evaluation—positioning what this thesis reuses vs what it extends.

**Content (detailed bullets)**

- **Motivation**  
  Traditional mutation testing relies on fixed operators that miss many real bug patterns and become costly to extend (Tip et al., 2025).  
  LLMorpheus aims to produce mutants resembling faults difficult to express as a small hand-coded operator set.

- **Core technique (placeholder-guided prompting)**  
  LLMorpheus inserts a `<PLACEHOLDER>` at designated mutation locations and prompts an LLM to propose buggy replacements that change behavior relative to the original fragment.  
  Prompts include mutation-testing background, surrounding code, the original fragment, and instructions for buggy replacements.

- **Mutation location selection (rule-based “where,” LLM-based “what”)**  
  Candidate sites include conditions of `if`/`switch`/`while`/`do…while`, loop headers, and function-call receivers, arguments, and argument sequences.  
  Each candidate location yields a separate prompt.

- **Output contract**  
  The LLM returns multiple options (three) as fenced code blocks with single-line replacements plus brief explanations, terminated by a fixed marker (“DONE.”)—enabling automated extraction.

- **Mutant extraction and filtering**  
  Extract candidates from fenced blocks; discard suggestions identical to the original, duplicates, and syntactically invalid proposals (parse-checked).  
  Valid mutants are written to `mutants.json`; prompts, completions, and configuration are archived.

- **Execution: modified StrykerJS**  
  StrykerJS runs with `--usePrecomputed` to consume `mutants.json` instead of built-in mutators.  
  The test suite classifies each mutant as killed, survived, or timed-out; interactive reports support inspection.

- **Engineering pragmatics**  
  BabelJS for parsing/validation; Handlebars for prompt templates; AST expansion when a mutant spans multiple nodes; configurable temperature, max completion length, context window, and rate-limit handling.

- **Original paper evaluation scope (context for this thesis)**  
  Tip et al. (2025) evaluate LLMorpheus on 13 JavaScript/TypeScript packages; study prompt, temperature, and model variation; measure cost via runtime and tokens; manually examine equivalent mutants; and include a 40-bug resemblance case study.  
  **This thesis reuses the tool and workflow** but runs a new 10-model × six-package study with RQ0–RQ5 metrics. It does not replicate the 40-bug study or reasoning-model experiments.

- **Scope reductions / deferred work**  
  - 40-bug resemblance pipeline: described in Tip et al. (2025) only; not executed here.  
  - Reasoning-model variants: excluded from the modern-model matrix.

**Sources / references (APA 7)**

- Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. *IEEE Transactions on Software Engineering*. https://arxiv.org/abs/2404.09952
- (Contextual tool reference) StrykerJS mutation testing framework, modified for precomputed mutants per LLMorpheus documentation.

---

# Methodology

## Block 1 — Method Overview / Experimental Design (RQ0–RQ5)

**Title**  
Method Overview: Experimental Design and End-to-End Workflow

**Goal**  
Define the thesis as a model-comparison benchmarking study using the LLMorpheus workflow under a fixed configuration, and describe the data flow (inputs → artifacts → metrics) that supports RQ0–RQ5.

**Content (detailed bullets)**

- **Study type and intent:** Empirical benchmarking study focused on practitioner model choice for LLM-based mutation testing under realistic budget constraints. Differences in outcomes are attributed primarily to model choice, not prompt or temperature optimization.
- **Scope exclusions:** No LLM-based test generation; all mutants are evaluated against each package’s existing test suite. No external replication of the 2024 LLMorpheus paper numbers.
- **Workflow overview (pipeline-level):**
  - **Mutant generation (Procedure A):** For each benchmark package, LLMorpheus selects mutation locations, queries the LLM via OpenRouter, extracts candidate replacements, filters invalid/duplicate candidates, and writes `mutants.json`.
  - **Mutation analysis (Procedure B):** Stryker executes the precomputed mutant set against the project test suite and classifies each mutant as killed, survived, or timed-out; computes mutation score.
  - **Aggregation and RQ-specific analysis:** `thesis/` scripts organize artifacts and compute per-RQ metrics (volume, stability, equivalence screening, cost, category synthesis).
- **Research question mapping:**
  - **RQ0:** Pipeline readiness — end-to-end CI run produces non-empty, parseable artifacts for every model in the study matrix.
  - **RQ1:** Mutant volume and quality — candidates, validity, mutation score, Levenshtein edit distance.
  - **RQ2:** Cross-run consistency — Jaccard overlap, SD of score/survivors/edit distance (multi-run models only).
  - **RQ3:** Equivalent mutants — predicted equivalence rate and effective survivors via validated UniXCoder classifier.
  - **RQ4:** Cost-effectiveness — tokens, €, cost per valid/survived/non-equivalent mutant, Pareto frontier.
  - **RQ5:** Category synthesis — aggregate RQ1–RQ4 metrics by open-weight vs API-only vs hybrid.
- **Repetition protocol (variable run policy):**
  - **Multi policy (7 affordable models):** 5 independent replications per model × package for RQ2 stability analysis.
  - **Single policy (3 expensive models):** 1 replication per model × package (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5; €15–40 per full run).
- **RQ dependencies:** RQ2 requires multi-rep data; RQ3 consumes surviving mutants from RQ1 plus the validated classifier; RQ4 integrates RQ1–RQ3 counts with OpenRouter pricing; RQ5 aggregates RQ1–RQ4 by category (excludes cross-run Jaccard because run counts differ across categories).
- **Artifacts recorded per run:** Prompts, completions, configuration metadata, token logs, `mutants.json`, `summary.json`, Stryker outputs (`StrykerInfo.json`, reports), and downstream analysis CSVs/tables in `thesis/rqX/output/`.

---

## Block 2 — RQ0 Pipeline Validation (Not External Paper Replication)

**Title**  
RQ0: Pipeline Validation and Experimental Readiness

**Goal**  
Confirm that this repository’s end-to-end toolchain works before interpreting RQ1–RQ5 results. RQ0 validates internal pipeline correctness; it does not claim agreement with the original LLMorpheus paper.

**Content (detailed bullets)**

- **What RQ0 answers:** Does our pipeline (LLMorpheus → Stryker → artifacts → `thesis` analysis) run correctly and produce parseable data for all models in the study matrix?
- **What RQ0 does not claim:** No external replication of CodeLlama 34B or other legacy paper numbers; no proof that the paper is right or wrong. The paper is cited as the method and tool this work extends; RQ1–RQ5 constitute a new comparative study of modern LLMs under a shared, standardized setup.
- **Validation mechanism:** GitHub Actions workflow *Mutation Testing Experiment (OpenRouter)* (`.github/workflows/openrouter-exp.yml`) runs the full loop per package job: checkout and build → LLMorpheus mutant generation (live OpenRouter API) → Stryker with precomputed mutants (`--usePrecomputed`) → artifact upload.
- **Acceptance criteria (healthy run):**
  - LLM logs show token usage (not 404/API errors).
  - Mutant output reports `wrote N mutants` with **N > 0**.
  - Workflow succeeds with non-empty artifacts.
  - `thesis` organize and per-RQ analysis scripts complete without missing-input errors.
- **Checklist before RQ1–RQ5:** At least one successful GHA run per model; logs confirm > 0 mutants per package; artifacts organized under `artifacts/` / `organized/` with expected layout; experimental parameters documented (template, T=0, maxTokens, packages).
- **Relation to downstream RQs:** RQ1 needs valid `mutants.json` / `summary.json`; RQ2 needs multiple reps with non-empty mutant sets; RQ3 needs surviving mutants from Stryker; RQ4 needs token logs; RQ5 needs complete RQ1–RQ4 inputs.

---

## Block 3 — Benchmark Packages (6-Project Subset)

**Title**  
Subjects: Benchmark Packages and the thesis-six Subset

**Goal**  
Define the study objects, justify the six-package subset, and specify what is fixed for reproducibility and what this implies for generalizability.

**Content (detailed bullets)**

- **Benchmark source:** Real-world JavaScript/TypeScript packages with existing test suites, drawn from the LLMorpheus benchmark suite. Packages are pinned at fixed commits via `.github/thesis-six.json`.
- **Selected subset (6 projects — thesis-six):**
  - Complex.js
  - countries-and-timezones
  - node-jsonfile
  - pull-stream
  - spacl-core
  - zip-a-folder
- **Explicit exclusion:** `delta` (present in the original 13-package paper corpus but excluded from this thesis subset for budget and feasibility).
- **Selection rationale:**
  - **Language/tooling diversity:** Mix of plain JS and TypeScript projects.
  - **Domain diversity:** Distinct library domains to reduce topic-specific bias.
  - **Scale diversity:** Variation in LOC and test-suite size to observe whether model behavior changes with project characteristics.
  - **Feasibility:** Keeps runtime and token budget manageable while allowing multiple replications for affordable models.
- **Reproducibility requirements:** Each project checked out at a pinned commit; mutate globs and any benchmark patches documented in `thesis-six.json`; Node version and tool versions pinned following RQ0 validation.
- **Validity implications:** External validity is limited to these six packages; results are evidence under the stated configuration, not universal conclusions about all JavaScript codebases.

---

## Block 4 — Model Set and Categories (10 Models; API-Only / Open-Weight / Hybrid)

**Title**  
Model Set and Model Categories

**Goal**  
Lock the evaluated model set, define category labels used in RQ5, and specify how models are accessed and logged via OpenRouter.

**Content (detailed bullets)**

- **Access method:** All models queried via OpenRouter. Each request logs model ID, decoding parameters, timestamps, and token usage.
- **Locked model set (10 models):**

  | # | Display name | OpenRouter slug | Category | Run policy |
  |---|--------------|-----------------|----------|------------|
  | 1 | GPT-4o-mini | `openai/gpt-4o-mini` | API-only (cheap) | multi (5 reps) |
  | 2 | GPT-4o | `openai/gpt-4o` | API-only (expensive) | single (1 rep) |
  | 3 | Gemini 3.1 Flash Lite | `google/gemini-3.1-flash-lite` | API-only (cheap) | multi |
  | 4 | Gemini 3.5 Flash | `google/gemini-3.5-flash` | API-only (expensive) | single |
  | 5 | Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | API-only (cheap) | multi |
  | 6 | Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | API-only (expensive) | single |
  | 7 | Llama 3.3 70B Instruct | `meta-llama/llama-3.3-70b-instruct` | Open-weight | multi |
  | 8 | Llama 3.1 8B Instruct | `meta-llama/llama-3.1-8b-instruct` | Open-weight | multi |
  | 9 | Qwen 2.5 Coder 32B | `qwen/qwen-2.5-coder-32b-instruct` | Open-weight | multi |
  | 10 | DeepSeek Chat v3.1 | `deepseek/deepseek-chat-v3.1` | Hybrid | multi |

- **Excluded model:** `meta-llama/codellama-34b-instruct` — removed from OpenRouter API (404 on every request); included in the original paper but unavailable for this study.
- **Category definitions (RQ5 grouping):**
  - **Open-weight:** Publicly available weights; self-hostable in principle (Llama 3.3 70B, Llama 3.1 8B, Qwen 2.5 Coder 32B).
  - **API-only:** Proprietary models accessible only via vendor API (6 models across OpenAI, Google, Anthropic).
  - **Hybrid:** Open weights accessed via API in this study (DeepSeek Chat v3.1).
- **Tier comparisons within providers:** Cheap vs premium pairs for OpenAI (4o-mini / 4o), Google (3.1 Flash Lite / 3.5 Flash), and Anthropic (Haiku / Sonnet) enable within-vendor cost-effectiveness analysis.
- **Run policy rationale:** Expensive models (€15+ per full thesis-six run) receive single runs for cross-model comparison; affordable models receive five runs to support RQ2 stability analysis. Policy encoded in `thesis/shared/modelRegistry.js`.
- **Baseline models:** `gpt-4o-mini` and `llama-3.3-70b-instruct` also appeared in the original paper but serve as study baselines here, not replication targets.

---

## Block 5 — Fixed Experimental Configuration

**Title**  
Fixed Experimental Configuration (Model-First Comparison)

**Goal**  
Define the configuration held constant across all models so that outcome differences are primarily attributable to model choice.

**Content (detailed bullets)**

- **Prompting setup:**
  - Template: `template-full` (FULL prompt template).
  - System prompt: `SystemPrompt-MutationTestingExpert`.
  - Structured output enforced (fenced code blocks) for reliable candidate extraction.
- **Decoding parameters:**
  - Temperature: **T = 0.0** (fixed across all models).
  - Max completion tokens: **200** (standardized May 2026; supersedes earlier 250-token runs).
  - Reasoning: **disabled** for all models; Gemini 3.x uses `{ effort: "minimal", exclude: true }` per OpenRouter requirement.
  - Other parameters (top-p, etc.) fixed and logged.
- **Generation limits:** `maxNrPrompts = 2000` per package run.
- **Stryker configuration:** Custom `stryker-js` fork; `--concurrency 1`; precomputed mutators (`--usePrecomputed`); mutants loaded from `mutants.json`.
- **Context and API policy:** Fixed code-context window strategy; uniform rate limiting and retry policies across models where feasible.
- **Design intent:** These are internal-validity choices for fair cross-model comparison, not a claim to replicate the paper’s exact experimental configuration.
- **Invalidated prior runs:** Any runs with mixed token limits (250/8000) or uncontrolled reasoning are excluded from analysis.

---

## Block 6 — Procedure A: Mutant Generation

**Title**  
Procedure A: Mutant Generation (Prompt → Completion → Filter → mutants.json)

**Goal**  
Describe precisely how each run produces a mutant set suitable for mutation analysis.

**Content (detailed bullets)**

- **Mutation location selection:** Parse project sources and select candidate locations (control-flow conditions, loop headers, function call receivers/arguments, etc.). Replace the original fragment with `<PLACEHOLDER>` and generate one prompt per location.
- **LLM querying:** Send prompts to the assigned model via OpenRouter under the fixed configuration (Block 5). Request multiple options per prompt to increase diversity at T=0.
- **Candidate extraction:** Extract proposed replacements from fenced code blocks. Each valid replacement becomes a separate mutant introducing exactly one code change.
- **Filtering and deduplication — discard:**
  - Candidates identical to the original fragment.
  - Duplicates (within-run and across prompt outputs).
  - Syntactically invalid candidates (JavaScript parse-check).
- **Output:** Persist the final mutant set to `mutants.json` with metadata (location, original, replacement, prompt/completion IDs).
- **Logged artifacts:** Prompts, completions, run configuration, and token usage (`summary.json`, `LLMorpheusOutput.txt`) stored alongside `mutants.json` for auditability and RQ4 cost analysis.

---

## Block 7 — Procedure B: Mutation Analysis (Stryker)

**Title**  
Procedure B: Mutation Analysis (Execute Mutants and Classify Outcomes)

**Goal**  
Run the test suite against generated mutants and collect mutation-testing outcomes for RQ1–RQ4 and the survivor set that feeds RQ3 equivalence screening.

**Content (detailed bullets)**

- **Execution:** Run Stryker with the precomputed mutant set (`mutants.json`) and the project’s existing test suite. No test generation; tests are unchanged from the benchmark checkout.
- **Per-mutant outcomes:**
  - **Killed:** Tests fail on the mutant.
  - **Survived:** Tests pass (mixed signal — test weakness or equivalence).
  - **Timed-out:** Execution exceeds the time limit.
- **Per-run outputs:** Machine-readable aggregates (`StrykerInfo.json`: mutation score, counts) and human-inspectable reports (`mutation.html`, `StrykerOutput.txt`).
- **Mutation score definition:** Killed / (killed + survived + timed-out), excluding invalid mutants — consistent with glossary and original LLMorpheus reporting.
- **Downstream linkage (RQ3):** Persist surviving mutants with stable identifiers (file, line, column, replacement hash) so equivalence screening applies consistently across runs and traces back to specific mutants.
- **Index alignment note:** For most packages, `mutants.json` and Stryker results align by index; for `spacl-core`, some LLM mutants fail Stryker parsing and require location-based matching with whitespace normalization.

---

## Block 8 — Evaluation Implementation per RQ

**Title**  
Evaluation Implementation: Scripts, Metrics, and Outputs (RQ1–RQ5)

**Goal**  
Define what is computed for each research question, which pipeline components are reused, and what thesis-specific scripts add.

**Content (detailed bullets)**

- **RQ1 — Mutant volume and quality (effectiveness + mutation subtlety):**
  - **Input:** `mutants.json`, `summary.json`, `StrykerInfo.json` per model × package × run.
  - **Volume metrics:** #prompts, #candidates, #syntactically valid/invalid, #identical, #duplicate, #valid mutants, duplicate rate.
  - **Testing outcomes:** Mutation score, #killed, #survived, #timed-out.
  - **Levenshtein edit distance** (thesis addition): Absolute distance (diagnostic) and normalized distance d_norm(a,b) = d(a,b) / max(|a|,|b|) between original fragment and replacement; report median/IQR per model × package, both per-run and over the deduplicated union of unique mutants across runs.
  - **Aggregation:** Per package first, then median/IQR across six packages per model.
  - **Outputs:** `thesis/rq1/output/publication/` (main tables/figures); appendix CSVs with per-package breakdowns.

- **RQ2 — Cross-run consistency (multi-run models only):**
  - **Input:** `mutants.json` and Stryker outputs for **5 reps** per affordable model × package (7 models with multi policy).
  - **Metrics per model × package:**
    - **Jaccard overlap** of mutant sets across run pairs (location + replacement identity).
    - **SD of mutation score** across runs.
    - **SD of #survived** across runs.
    - **SD of median absolute Levenshtein** across runs.
  - **Aggregation:** Per package first, then across six packages per model; rank models by overall consistency.
  - **Scope note:** Expensive single-run models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5) are excluded from Jaccard analysis; stability claims apply only to the seven multi-run models.
  - **Outputs:** `thesis/rq2/output/publication/`.

- **RQ3 — Equivalent mutant screening (UniXCoder classifier):**
  - **Input:** Surviving mutants from RQ1 (original fragment, replacement fragment, code context); validated UniXCoder ensemble (Block 9).
  - **Metrics per model × package × run:** #survived, #predicted equivalent, #predicted behavioral change, **predicted equivalence rate** among survivors, **effective survivors** (predicted behavioral change).
  - **Denominator:** Surviving mutants only — consistent with the original paper’s RQ2 manual study.
  - **Interpretation constraint:** Classifier outputs are screening estimates, not ground-truth equivalence proofs; report as “predicted equivalent.”
  - **Outputs:** `thesis/rq3/output/publication/`.

- **RQ4 — Cost-effectiveness:**
  - **Input:** Token logs (`summary.json`: prompt/completion tokens), wall-clock runtime, pinned OpenRouter price snapshot (`.github/thesis-model-pricing.json`), valid/survived/unique/non-equivalent counts from RQ1–RQ3.
  - **Metrics per model:** Total tokens (in/out), total cost (€), runtime, cost per valid mutant, cost per survived mutant, cost per unique survived mutant (union-based where multi-run), **cost per non-equivalent survivor** (RQ3-adjusted), duplicate rate, invalid rate.
  - **Pareto analysis:** Identify models on the cost–effectiveness frontier (mutation score vs cost; not dominated on both dimensions).
  - **Aggregation:** Summed across six packages per model per run; averaged across reps for multi-run models.
  - **Outputs:** `thesis/rq4/output/publication/`.

- **RQ5 — Category synthesis (open-weight vs API-only vs hybrid):**
  - **Input:** All RQ1–RQ4 outputs; category labels from `thesis/shared/modelMeta.js`.
  - **Metrics per category:** Distributions of mutation score, #survived, predicted equivalence rate, cost per non-equivalent survivor.
  - **Explicit exclusion:** Cross-run Jaccard overlap is **not** compared at category level — unequal run counts (7 multi-run vs 3 single-run) would produce an unbalanced stability comparison. Stability remains in RQ2.
  - **Aggregation:** Group models by category; report median/IQR per group; optional within-provider tier comparisons (cheap vs premium).
  - **Outputs:** `thesis/rq5/output/publication/`.

- **Shared infrastructure:** Artifact organization (`artifacts/` → `organized/`), central figures/tables in `thesis/output/`, per-RQ scripts orchestrated via `thesis/run-all.js` or per-RQ entry points.

---

## Block 9 — Equivalence Classifier Methodology

**Title**  
Equivalence Classifier: Gold Provenance, Training, Thresholds, and Application

**Goal**  
Document the automated equivalence screening approach used in RQ3 — from gold-label provenance through classifier validation to pipeline application on new surviving mutants.

**Content (detailed bullets)**

- **Purpose:** Surviving mutants confound test-weakness signals with equivalence. RQ3 adds an equivalence-aware layer that estimates how much survival is plausibly explained by equivalence versus behavioral change, enabling **effective survivors** as a more honest comparison metric than raw survivor counts.
- **Classifier choice:** **UniXCoder ensemble** (`microsoft/unixcoder-base` with frozen encoder + trained classification head). An initial **GEPA prompt-based LLM classifier** approach was explored (`python-classifier/`) but **abandoned** in favor of the UniXCoder fine-tuned model for reproducibility, cost, and asymmetric reliability on behavioral-change predictions.
- **Gold label provenance:**
  - Source: LLMorpheus paper **RQ2 manual corpus** — 954 mutants from **13 projects**, manually labeled {Equivalent, Behavioral Change} by **two paper authors** with inter-rater agreement **ω = 0.846**.
  - **Not re-labeled** by the thesis author; gold labels are reused as-is from the published manual examination dataset.
  - Class imbalance: **126 equivalent / 828 behavioral change (13.2% equivalent)**.
- **Input features per mutant:** Project, file, line/column, original code fragment, replacement fragment; optional code context from benchmark checkout at pinned commit (context window size fixed per training configuration).
- **Training protocol:**
  - **Primary evaluation (model selection):** **5-fold × 3-seed** stratified cross-validation on all 954 rows, producing **out-of-fold (OOF) predictions** for every labeled mutant with no train/test leakage.
  - **Ablations only:** 80/20 stratified split (`training.csv` ~763 rows / `validation.csv` ~191 rows) for comparing hyperparameter variants; not used for final thesis inference metrics.
  - **Architecture:** Frozen UniXCoder encoder; MLP classification head; input format `split_diff` (original window + explicit diff segment); pooling `cls_mean_max`; focal loss with class weighting for imbalance; label smoothing 0.05.
  - **Selected ensemble:** `ensemble-20260517-130830Z-window-w0-ep18-k5-s3-isplitdiff-pclsmm-focal2-bs-ck-tfeq-ls5-eqw175-ml512-bs8-lr2e-4-equiv-push-v1`.
- **Validation metrics (OOF, n = 954):**
  - Macro-F1 ≈ **0.797**; Cohen’s κ ≈ **0.595**; MCC ≈ **0.608**; accuracy ≈ **0.92**.
  - **Asymmetric reliability:** Predictions of **BEHAVIORAL_CHANGE** have very high precision (~93–99%); the harder side is **equivalent** precision (~78% at operational threshold).
  - At θ ≈ 0.94 (OOF macro-F1-optimal): precision_equiv ≈ 0.78, recall_equiv ≈ 0.54, FP = 19 (behavioral called equivalent), FN = 58 (equivalent missed).
- **Threshold policy (two thresholds, distinct roles):**
  - **θ ≈ 0.94:** Used for **model selection and reporting validation metrics** on the 954-row gold corpus (minimizes false equivalents among strong usable models).
  - **θ = 0.80:** **Fixed for pipeline application** on new surviving mutants from thesis-six runs — pre-registered operational threshold balancing precision/recall for downstream RQ3/RQ4 metrics.
  - At θ = 0.80 on OOF predictions: macro-F1 = 0.771, recall_equiv = 0.627, FP = 56, behavioural precision = 0.943.
- **Application to thesis mutants:**
  - Extract surviving mutants from Stryker outputs (status = Survived); match to `mutants.json` entries by location and replacement text.
  - Run UniXCoder ensemble inference; assign label EQUIVALENT if equiv_prob ≥ 0.80, else BEHAVIORAL_CHANGE.
  - Compute per model × package × run: predicted equivalence rate, effective survivors, and feed non-equivalent survivor counts into RQ4 cost metrics.
- **Interpretation constraint:** All applied labels reported as **predicted equivalent** / **predicted behavioral change**; classifier provides contextualization, not definitive semantic equivalence proof.
- **Implementation location:** `thesis/rq3/equivalent-mutants/classify/` (training, evaluation, prediction) and `thesis/rq3/equivalent-mutants/analyze/` (aggregation, statistical tests, tables/figures).

---

## Block 10 — Data Management and Reproducibility

**Title**  
Data Management and Reproducibility (Logging, Storage, and Limits)

**Goal**  
Specify what is stored, how runs are identified, and what boundaries exist for reproducibility when using API-hosted models.

**Content (detailed bullets)**

- **Artifact layout:**
  ```
  artifacts/
    {provider}_{model}/          # e.g. openai_gpt-4o-mini
      rep{N}/
        {package}/
          summary.json
          mutants.json
          StrykerInfo.json
          ...
  ```
- **Stored artifacts per run:** All prompts, completions, configuration metadata, token logs, `mutants.json`, Stryker outputs/reports, classifier predictions (RQ3), and derived analysis CSVs.
- **Run identification:** Each run tagged with model ID (OpenRouter slug), replication number, timestamp, benchmark commit IDs, configuration hash (template, T, maxTokens, reasoning settings).
- **Organized analysis layer:** Raw artifacts processed into `organized/` for downstream RQ scripts; gitignored at repo root alongside `artifacts/`.
- **Publication conventions:** Main-paper outputs in `thesis/rqX/output/publication/`; supplementary material in `thesis/rqX/output/appendix/`; central figures/tables in `thesis/output/figures/`, `thesis/output/tables/`, `thesis/output/stats/`.
- **Reproducibility boundaries:**
  - **Mutation analysis** on a fixed `mutants.json` is expected to be reproducible under the pinned Node/Stryker environment.
  - **Mutant generation** via API-hosted models is **time-conditional** (model drift, provider updates); addressed through repeated runs (multi policy), detailed logging, and artifact archiving rather than single-run determinism claims.
- **Workflow automation:** GHA workflow (`.github/workflows/openrouter-exp.yml`); scheduling scripts (`.github/schedule-affordable-runs.sh`, `.github/schedule-expensive-runs.sh`); artifact download helpers (`.github/download-run.sh`, `.github/download-all-runs.sh`).
- **Pricing snapshot:** OpenRouter rates pinned in `.github/thesis-model-pricing.json` (May 2026) for RQ4 cost calculations; documented as time-conditional.

---

## Block 11 — Threats to Validity (Methodology-Embedded)

**Title**  
Threats to Validity (Methodology-Embedded)

**Goal**  
Document key threats (construct, internal, external, reliability) and mitigations built into the experimental design.

**Content (detailed bullets)**

- **Reliability threats:**
  - **API-hosted model drift and nondeterminism** even at T=0 → mitigated by fixed configuration, multi-run replication (5 reps for affordable models), detailed logging of model ID and timestamps.
  - **Environment sensitivity** (Node version, Stryker fork, dependency resolution) → mitigated by RQ0 pipeline validation, pinned commits, and pinned tool versions.
  - **Incomplete multi-run coverage** for expensive models → acknowledged explicitly; RQ2 stability claims limited to seven multi-run models; RQ5 excludes Jaccard from category comparison.

- **Construct validity threats:**
  - **Mutation score and survivor counts** are proxies for test adequacy, confounded by equivalent mutants → mitigated by RQ3 equivalence screening and **effective survivors** metric; mutation score interpretation qualified accordingly.
  - **Levenshtein distance** is a syntactic subtlety proxy, not semantic equivalence → reported comparatively with both absolute and normalized values; not over-interpreted as bug realism.
  - **Predicted equivalence rate** depends on classifier accuracy (precision_equiv ~78% at θ=0.80) → reported as screening estimate; validation metrics on 954-row gold corpus documented; behavioral-change predictions treated as more reliable than equivalent predictions.
  - **Cost metrics** use pinned pricing snapshot → documented as time-conditional; LLM API cost only (GHA compute time separate).

- **Internal validity threats:**
  - **Confounding from provider-side differences** (rate limiting, hidden policies, reasoning defaults) → mitigated by uniform request settings, reasoning explicitly disabled, and reporting variability across runs rather than single-run conclusions.
  - **Variable run counts** across models → pre-registered run policy (`single` vs `multi`) with explicit scope limits on which RQs use which models.
  - **Prior run invalidation** (mixed token limits, uncontrolled reasoning) → excluded from analysis; standardized config enforced May 2026.

- **External validity threats:**
  - **Six-package subset** (not full 13-package paper corpus; `delta` excluded) → limits generalization; mitigated by explicit selection criteria (language, domain, scale diversity) and careful claim framing.
  - **JavaScript/TypeScript only** → results may not transfer to other languages.
  - **OpenRouter as sole access path** → open-weight models not self-hosted; category labels reflect deployment option studied, not all possible deployment configurations.
  - **Temporal snapshot** → model capabilities and pricing as of evaluation date (May 2026); CodeLlama 34B unavailable for direct comparison.

- **Gold label and classifier threats:**
  - **Gold corpus from paper authors, not thesis author** → reduces labeling bias from the evaluator but inherits any limitations of the original manual examination protocol.
  - **Class imbalance (13.2% equivalent)** → addressed via focal loss, class weighting, and threshold tuning; FP/FN trade-off documented transparently.
  - **GEPA prompt approach abandoned** → avoids LLM-as-judge variability but introduces dependency on UniXCoder generalization to LLM-generated mutant patterns not seen in gold training data.

---

# Results (Chapter 4)

## Chapter introduction

### Purpose

This chapter reports empirical findings from running the LLMorpheus pipeline under a fixed configuration (FULL prompt template, T=0, maxTokens=200, reasoning disabled) on the thesis-six benchmark subset (six JavaScript packages). Results are organized by RQ0–RQ5 and presented primarily as tables and figures derived from recorded pipeline artifacts.

### What a run means

A run is one complete execution of the pipeline for a given model across the six benchmark packages:

1. Mutant generation (prompts → completions → filtering → `mutants.json`)
2. Mutation analysis (StrykerJS with precomputed mutants → killed / survived / timed-out + mutation score)

### Run1 vs multi-run data

| Policy | Models | Reps | Primary RQs |
|--------|--------|------|-------------|
| **Single-run** | GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5 (€15–40 per full run) | 1 | RQ1, RQ3, RQ4, RQ5 |
| **Multi-run** | Remaining 7 affordable models | 5 | RQ1–RQ4 (run1 for cross-model comparison); **RQ2** (full stability analysis) |

**Run1** (first replication per model) is the common denominator for comparing all 10 models on volume, quality, equivalence, cost, and category effects. **Multi-run data** (5 reps × 7 models × 6 packages) supports RQ2 only; premium single-run models are excluded from cross-run stability comparisons.

### Aggregation conventions

1. **Per-package first:** Compute metrics per model × package × run.
2. **Per-model aggregation:** Summarize across the six packages (sum for counts; median/IQR for rates).
3. **Cross-run stability (RQ2):** Report mean ± SD or median (IQR) of pairwise Jaccard overlap; CV for mutation score, survivor count, and edit distance across five reps.
4. **Union of unique mutants:** For edit-distance analyses, optionally deduplicate mutants across reps. Caption each figure/table with the aggregation rule used.

---

## Block RQ0 — Pipeline validation

**Title**  
RQ0: Is the experimental pipeline ready?

**Goal**  
Confirm that the end-to-end toolchain (LLMorpheus → Stryker → artifact upload → `thesis` organize/analysis) runs correctly and produces parseable data for every model in the study matrix before interpreting RQ1–RQ5. This is **not** an external replication of the 2024 LLMorpheus paper.

**Metrics**  
Workflow completion rate; non-zero mutant count per run; artifact completeness (`mutants.json`, `summary.json`, `StrykerInfo.json`); downstream `thesis` script success; documented experimental constants.

**Figures / tables**  
- Table RQ0-A — Pipeline validation checklist (model × package)  
- Table RQ0-B — Experimental constants (Methods cross-ref)  
- Optional Figure RQ0-1 — Mutant count per model (sanity bar chart)

**Answer sentence template**  
Answer to RQ0: The pipeline completed successfully for all ten models across all six packages, producing non-empty and parseable artifacts that downstream analysis scripts consumed without error; experimental constants were held fixed across RQ1–RQ5 (Table RQ0-A/B). We therefore treat observed differences between models as attributable to LLM-driven mutant generation rather than toolchain failure.

**Pipeline diagram (plain text)**
```
GitHub Actions (openrouter-exp.yml)
  |--> per package: checkout --> LLMorpheus (OpenRouter) --> mutants.json
  |                                      |
  |                                      v
  |                               Stryker (--usePrecomputed)
  |                                      |
  |                                      v
  |                               StrykerInfo.json + logs
  v
artifact upload --> thesis organize/analysis --> RQ0 checklist PASS --> proceed to RQ1-RQ5
```

---

## Block RQ1 — Mutant volume and quality

**Title**  
RQ1: How many mutants do different models produce and what are they?

**Goal**  
Compare all ten models on run1 data across mutant volume, generation quality (validity composition), mutation-testing effectiveness (mutation score, survivors), and edit-distance subtlety (Levenshtein).

**Metrics**  
Volume (#prompts, #candidates, #valid, validity rate); effectiveness (mutation score, #killed, #survived, #timed-out); subtlety (absolute and normalized Levenshtein median/IQR).

**Figures / tables**  
- Table RQ1-A — `volume_metrics.tex`  
- Figure RQ1-1 — `mutation_score_box.pdf`  
- Figure RQ1-2 — `validity_stack.pdf`  
- Figure RQ1-3 — `score_vs_survivors.pdf`  
- Appendix: `edit_distance_ridge.pdf`, `per_package_heatmap.pdf`, `pairwise.csv`

**Answer sentence template**  
Answer to RQ1: On run1 data across six packages, models differ substantially in volume and quality (Table RQ1-A; Figure RQ1-2). **Qwen 2.5 Coder 32B** achieved the highest median mutation score (**88.5%**), while **Qwen** (**23.5**) and **GPT-4o-mini** (**30.5**) produced the fewest median survivors — suggesting that high mutation score and low survivor count can co-occur when mutants are easier for tests to kill (Figures RQ1-1, RQ1-3). Validity rates ranged from ~61% (Claude Haiku 4.5) to ~83% (Claude Sonnet 4.5, DeepSeek, Qwen).

**Pipeline diagram (plain text)**
```
mutants.json + summary.json + StrykerInfo.json  (per model x package x run1)
  |--> volume metrics + effectiveness + Levenshtein
  v
aggregate per-package --> per-model --> volume_metrics.tex + figures
```

---

## Block RQ2 — Consistency across runs

**Title**  
RQ2: How consistent are different models across runs?

**Goal**  
Quantify run-to-run stability for the **seven affordable multi-run models** (5 reps each). **Exclude** GPT-4o, Gemini 3.5 Flash, and Claude Sonnet 4.5 (single-run only).

**Metrics**  
Pairwise Jaccard similarity; SD and CV of mutation score, #survived, median Levenshtein; mutant trial variability (stable / variable / unique).

**Figures / tables**  
- Table RQ2-A — `consistency.tex`  
- Figure RQ2-1 — `jaccard_box.pdf`  
- Figure RQ2-2 — `mutant_variability_stacked.pdf`  
- Appendix: `cv_grouped_bar.pdf`, `forest_plot.pdf`, `within_model_jaccard_heatmap.pdf`

**Answer sentence template**  
Answer to RQ2: Among the seven multi-run models (5 reps, T=0), cross-run consistency varied: mean Jaccard overlap ranged from [LOW] to [HIGH], and CV of mutation score ranged from [LOW] to [HIGH] (Table RQ2-A; Figures RQ2-1–RQ2-2). Stability rankings did not mirror run1 effectiveness rankings from RQ1.

**Pipeline diagram (plain text)**
```
7 multi-run models x 6 packages x 5 reps --> Jaccard + SD/CV across reps
(EXCLUDED: gpt-4o, gemini-3.5-flash, claude-sonnet-4.5 -- single run only)
```

---

## Block RQ3 — Equivalent mutants

**Title**  
RQ3: How likely are different models to generate equivalent mutants?

**Goal**  
Estimate the share of surviving mutants that are predicted equivalent vs behavior-changing, using the validated UniXCoder ensemble at **θ = 0.80**. Compute **effective survivors**. Compare predicted rates to the original paper's **20.2% manual equivalent rate** cautiously.

**Metrics**  
#survived, #predicted equivalent, #predicted behavioral change, predicted equivalence rate, effective survivors; classifier validation reference (Methods).

**Figures / tables**  
- Table RQ3-A — `main_results.tex`  
- Figure RQ3-1 — `llm_comparison_boxplot.pdf`  
- Figure RQ3-2 — `effective_survivors.pdf`  
- Figure RQ3-3 — `llm_means_errorbar.pdf`  
- Appendix: `llm_package_heatmap.pdf`, `statistical_tests.tex`

**Answer sentence template**  
Answer to RQ3: Predicted equivalence rates among survivors differed across models on run1 data (Table RQ3-A; Figures RQ3-1–RQ3-3). The weighted study-wide rate was **[X]%**, compared directionally with **20.2%** from manual labeling in the original LLMorpheus paper — not a replication claim. Applying the equivalence lens reduced raw survivor counts substantially for models with high predicted equivalence rates.

**Pipeline diagram (plain text)**
```
Stryker survivors (run1) --> UniXCoder classify (theta = 0.80) --> equiv rate + effective survivors
```

---

## Block RQ4 — Cost

**Title**  
RQ4: What does LLMorpheus cost per model?

**Goal**  
Report token usage, total cost (pinned OpenRouter snapshot), runtime, and quality-adjusted cost metrics. Identify Pareto-efficient models. Integrate RQ3 for **cost per non-equivalent survivor**.

**Metrics**  
Total tokens; total API cost; cost per valid/survived/non-equiv survivor; duplicate and invalid rates; Pareto membership.

**Figures / tables**  
- Table RQ4-A — `cost.tex`  
- Table RQ4-B — `pareto.tex`  
- Figure RQ4-1 — `pareto_frontier.pdf`  
- Figure RQ4-2 — `cost_per_nonequiv_bar.pdf`  
- Figure RQ4-3 — `cost_composition.pdf`

**Answer sentence template**  
Answer to RQ4: Total LLM API cost per run1 pass ranged from **[LOW €]** (Llama 3.1 8B) to **[HIGH €]** (Claude Sonnet 4.5 / Gemini 3.5 Flash). **Cost per non-equivalent survivor** separated models more clearly than raw cost per survivor (Figure RQ4-2). Pareto analysis identified frontier models balancing effectiveness and cost (Figure RQ4-1; Table RQ4-B).

**Pipeline diagram (plain text)**
```
summary.json (tokens) + pricing snapshot + RQ1/RQ3 counts --> cost metrics + Pareto
```

---

## Block RQ5 — Open-weight vs API-only

**Title**  
RQ5: How do open-weight vs API-only models compare?

**Goal**  
Compare deployment categories on run1 effectiveness, equivalence, and cost. **Exclude cross-run Jaccard** from category comparison (see RQ2). DeepSeek (hybrid): sensitivity analysis.

**Metrics**  
Mutation score, #survived, predicted equivalence rate, cost per non-equiv survivor; Mann–Whitney U + Cliff's delta.

**Category assignment**  
Open-weight (n=3): Llama 3.1 8B, Llama 3.3 70B, Qwen 2.5 Coder 32B. API-only (n=6): remaining API models. Hybrid (n=1): DeepSeek.

**Figures / tables**  
- Table RQ5-A — `category_summary.tex`  
- Table RQ5-B — `pairwise_effect.tex`  
- Figure RQ5-1 — `category_violins.pdf`  
- Figure RQ5-2 — `effect_size_forest.pdf`

**Answer sentence template**  
Answer to RQ5: Open-weight and API-only models showed **overlapping** distributions on effectiveness and equivalence: Mann–Whitney tests found no significant differences in mutation score (**p ≈ 0.63**), survivors (**p ≈ 0.99**), or equivalence rate (**p ≈ 0.85**). Cost per survivor differed directionally (**p ≈ 0.39**; open-weight cheaper) but did not reach α = 0.05 with n=3 vs n=6. **Deployment category alone is not a strong predictor** of mutation-testing outcomes under this setup.

**Pipeline diagram (plain text)**
```
RQ1-RQ4 run1 metrics + category labels --> median/IQR + Mann-Whitney (EXCLUDE Jaccard)
```

---

# Discussion (Chapter 5)

## 5.0 Purpose and scope

Interpret Chapter 4 findings in terms of practical meaning and plausible mechanisms. Connect results to practitioner model choice under budget, stability, and interpretability constraints.

**Scope exclusions:** No reasoning vs non-reasoning comparison. No 40-bug resemblance evaluation. Sections 5.1–5.5 map one-to-one to RQ1–RQ5.

---

## 5.1 RQ1 — Mutant volume and quality

- Effectiveness vs volume decoupling (Qwen: high score, low survivors).
- Validity composition wastes budget independently of final scores (Haiku ~61% validity).
- Survivors as mixed signal — baseline for RQ3 reframing.
- Levenshtein as style proxy, not realism.
- Cross-package ranking stability (per-package heatmap).

**Conditional recommendation:** If maximizing mutation score, prioritize strong run1 performers after checking validity; if maximizing inspection candidates, low survivors may be undesirable even with high scores.

---

## 5.2 RQ2 — Consistency across runs

- Why stability matters for CI and longitudinal benchmarking.
- T=0 variability mechanisms (provider nondeterminism, routing).
- Stability vs effectiveness trade-off; link to RQ4 (unstable models multiply cost).
- Premium single-run models lack stability data by design.

**Conditional recommendation:** For repeatable CI, favor high Jaccard / low CV models; for ad hoc audits, run1 RQ1 may suffice.

---

## 5.3 RQ3 — Equivalent mutants

- Classifier as screening (θ=0.80); behavioral-change predictions more reliable than equivalent calls.
- Paper 20.2% as directional reference only, not replication.
- Reframing model rankings via effective survivors; link to RQ4 cost/non-equiv.
- Threshold sensitivity as construct-validity threat.

**Conditional recommendation:** Filter predicted equivalents before prioritizing test work; pair mutation score with equivalence-adjusted survivor counts in KPIs.

---

## 5.4 RQ4 — Cost

- Optimization target defines “best” (score vs effective survivors per euro vs runtime).
- Pareto frontier; premium models may be off-frontier on cost-adjusted axes.
- Waste (invalid/duplicate) as hidden cost.
- Pinned pricing snapshot; runtime vs token cost for CI feasibility.

**Conditional recommendation:** Budget-constrained → open-weight Pareto models; quality-first → premium API for single-run audits, not high-volume repetition without RQ2 validation.

---

## 5.5 RQ5 — Open-weight vs API-only

- Null category effect on effectiveness (p ≈ 0.63 score, p ≈ 0.99 survivors, p ≈ 0.85 equiv).
- Cost trend without definitive proof (p ≈ 0.39; small n).
- Why Jaccard excluded from category comparison (unequal reps).
- DeepSeek hybrid sensitivity; operational factors beyond metrics (privacy, pinning, lock-in).

**Conditional recommendation:** Do not choose by category alone on effectiveness; open-weight deserves cost-focused pilots; API premium rational for SLA/flagship needs, not because category predicts better mutants.

---

## 5.6 Limitations and threats to validity

- **Internal:** Fixed configuration; classifier uncertainty (θ=0.80); run-policy asymmetry; hybrid classification.
- **External:** Six-package subset; 2025–2026 model snapshot; OpenRouter serving (not self-hosted).
- **Construct:** Mutation score, Levenshtein, predicted equivalence as proxies.
- **Conclusion validity:** Small category samples; multiple comparisons; API/pricing drift.

---

## 5.7 Practitioner recommendations (conditional)

| Priority | Consider | Caveat |
|----------|----------|--------|
| Highest mutation score (run1) | Qwen 2.5 Coder 32B, GPT-4o-mini | Confirm stability before CI lock-in |
| Repeatable CI metrics | High Jaccard / low CV (RQ2) | Premium models lack stability data |
| Lowest API spend | Llama 3.1 8B, Llama 3.3 70B, Qwen | Self-hosting infra cost not measured |
| Cost per meaningful survivor | Pareto + cost/non-equiv (RQ4) | Depends on RQ3 threshold |
| Category policy only | Supported for cost, not effectiveness | Pick individual models (RQ5) |

**Adoption workflow:** RQ0 validation → run1 pilot (RQ1) → 3–5 reps on finalist (RQ2) → equivalence screening (RQ3) → Pareto selection (RQ4).

---

# Conclusion (Chapter 6)

## 6.1 Summary of study

Re-evaluate LLMorpheus on ten modern LLMs under fixed settings on six JavaScript packages; compare volume, quality, stability, equivalence, cost, and deployment category — without prompt optimization, reasoning comparison, or bug-resemblance replication.

## 6.2 Answers to research questions

| RQ | Short answer |
|----|--------------|
| **RQ0** | Pipeline validated; all models produced parseable artifacts under fixed constants. |
| **RQ1** | Models differ in volume, validity, mutation score, and survivors; Qwen led on score (88.5%) with fewest survivors (23.5). |
| **RQ2** | Seven multi-run models showed varying Jaccard overlap and CV at T=0; stability ≠ run1 effectiveness. |
| **RQ3** | Predicted equivalence rates vary by model; effective survivors reframe raw survival; compare to paper 20.2% cautiously. |
| **RQ4** | Cost-efficiency diverges from raw price; Pareto and cost/non-equiv survivor separate value from spend. |
| **RQ5** | No significant category differences on effectiveness or equivalence; cost favors open-weight directionally (p ≈ 0.39); category is a weak predictor. |

## 6.3 Main contributions

1. Updated 10-model comparison under shared LLMorpheus setup (not paper replication).
2. Stability analysis (5 reps, 7 models) — Jaccard and CV at T=0.
3. Equivalence-aware interpretation via UniXCoder (θ=0.80) and effective survivors.
4. Cost analysis with Pareto frontier and equivalence-adjusted cost per survivor.
5. Category comparison showing deployment type does not strongly predict outcomes.

## 6.4 Implications for practice

Select models by measured effectiveness, stability, and cost on your codebase — not by open-weight vs API label alone. Treat survivors as inspection candidates after equivalence screening. Budget for multiple reps when metrics feed CI. Recompute costs with current pricing before production rollout.

## 6.5 Future work

- Expand benchmark beyond thesis-six (more languages, larger repos).
- Stability reps for premium API models.
- Improve equivalence detection (higher-precision classifiers, human audit samples).
- Self-hosted open-weight TCO and determinism studies.
- Longitudinal tracking as OpenRouter model versions update.
- Deferred scope: reasoning-model pairs, 40-bug resemblance study.

## 6.6 Closing statement

LLMorpheus remains viable with modern LLMs; practitioner value depends on aligning model choice with objective (score, stability, cost, inspectable survivors), interpreting survivors through an equivalence lens, and validating the pipeline locally before fleet adoption.

---

# Appendix outline (optional chapter)

- Per-RQ appendix tables and CSVs (`thesis/rqX/output/appendix/`)
- Classifier validation confusion matrix and OOF metrics (θ ≈ 0.94 vs θ = 0.80 table)
- Pairwise statistical test outputs (`thesis/output/stats/`)
- Per-package breakdown heatmaps and forest plots
- Experimental constants and model registry snapshot

---

# Draft file mapping

| Outline section | Target draft file (`thesis/draft/`) |
|-----------------|-------------------------------------|
| Introduction Blocks 1–6 | `01-introduction.md` |
| Background Blocks 1–3 | `02-background.md` |
| Methodology Blocks 1–11 | `03-methodology.md` |
| Results RQ0–RQ5 | `04-results-rq0.md` … `04-results-rq5.md` (or single `04-results.md`) |
| Discussion 5.0–5.7 | `05-discussion.md` |
| Conclusion 6.1–6.6 | `06-conclusion.md` |
