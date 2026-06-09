> Archived — superseded by thesis/meta/rq_overview.md and rqX/spec.md. Do not use for agents.

Bachelor Thesis Outline
Introduction
Block 1
Title
Motivation and Problem Statement: LLM-Based Mutation Testing for Modern Software Development
Goal
Motivate the thesis topic and state the concrete problem: traditional mutation testing is limited by fixed operator sets, and LLMorpheus proposes LLM-driven mutant generation whose effectiveness must be re-evaluated for modern models.

Content (detailed bullets)
Motivation: quality assurance remains essential with AI-assisted development
The increasing use of LLMs in software engineering strengthens the need for explicit quality assurance mechanisms for generated/assisted code, rather than relying solely on superficial correctness signals.
Scope clarification: This thesis does not generate tests with LLMs; it evaluates LLM-generated mutants against existing project test suites.
Mutation testing as a test adequacy technique
Mutation testing evaluates a test suite by injecting small faults (“mutants”) and executing tests to classify mutants as killed, survived, or timed out.
Mutation adequacy is commonly regarded as more stringent than line/branch coverage, motivating mutation testing as a stronger indicator of test effectiveness.
Limitation of traditional operator-based mutation testing
State-of-the-practice tools rely on a fixed set of mutation operators. This restricts the types of faults that can be simulated and can miss real-world bug patterns.
Extending operator sets increases engineering effort and can significantly increase the cost of mutation analysis (more mutants to run, longer analysis time).
LLMorpheus as an alternative
LLMorpheus generalizes operator-based mutation by inserting placeholders at pre-defined code locations and prompting an LLM to propose buggy replacements.
It then filters syntactically invalid and duplicate suggestions and runs the resulting mutants via a StrykerJS-based analysis pipeline to classify outcomes.
Research gap addressed by this thesis (high-level preview)
The LLMorpheus study evaluated a specific set of models available at the time. Since LLM capabilities and cost profiles evolve rapidly, it is unclear how modern models compare and what trade-offs exist in terms of effectiveness, stability across runs, and cost.
This motivates an updated, practitioner-oriented evaluation focusing on:
modern model comparison,
open-weight (“self-hostable”) vs proprietary API models,
reasoning vs non-reasoning variants,
cost-effectiveness, and
real-bug resemblance (via an automated bug-replication pipeline).

Sources / references (APA 7)
Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. IEEE Transactions on Software Engineering. https://arxiv.org/abs/2404.09952
Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., … Wen, J.-R. (2023). A survey of large language models. arXiv preprint arXiv:2303.18223. https://arxiv.org/abs/2303.18223 arxiv
Inozemtseva, L., & Holmes, R. (2014). Coverage is not strongly correlated with test suite effectiveness. In Proceedings of the 36th International Conference on Software Engineering (ICSE 2014) (pp. 435–445). ACM. https://doi.org/10.1145/2568225.2568271


Block 2 — Problem Statement and Research Gap: Updating LLMorpheus for Modern LLMs (UPDATED)
Title
Problem Statement and Research Gap: Updating LLMorpheus for Modern LLMs

Goal
State why the original LLMorpheus evaluation is no longer sufficient for today’s practitioner decisions, and define the concrete research gaps this thesis addresses: modern model comparison, model category effects (self-hostable vs API-only; reasoning vs non-reasoning), cost-effectiveness, real-bug resemblance—and equivalence-aware interpretation of surviving mutants via automated screening under a controlled, clearly scoped setup.

Content (detailed bullets)
Problem statement: LLMorpheus evidence is tied to an evaluation snapshot
The LLMorpheus paper demonstrates that LLM-driven mutant generation can complement operator-based mutation testing and can produce mutants that resemble real bugs in some cases. However, its empirical findings are necessarily tied to the set of models, providers, and price/performance characteristics available at the time of evaluation.
Because the large language model landscape changes rapidly (new model families, new deployment options, and shifting cost structures), it is not clear how well those conclusions transfer to modern models that developers would select today. A general survey of LLM development highlights the fast-evolving nature of architectures, training approaches, and model capabilities, motivating updated empirical evaluation when results depend on the choice of model. (Zhao et al., 2023) arxiv

Research gap 1: modern model comparison beyond the original model set (incl. stability as a dimension)
The original study compares several models from that time and analyzes temperature and prompt-template effects, but it does not provide guidance on how newer models (released after the original evaluation snapshot) behave within the LLMorpheus pipeline.
This creates an open, practitioner-relevant question: Which modern models produce the most useful mutants today—in terms of mutation-testing outcomes and mutant validity—and how do they compare to the original baselines under a controlled setup?
As part of this comparison, stability across runs is treated as a core evaluation dimension (not a separate gap): even the original paper reports that some models show meaningful variability at 
𝑇
=
0
T=0, so re-checking stability for modern models is directly relevant for real adoption.

Research gap 2: model-category questions not investigated explicitly
Open-weight/self-hostable LLMs already existed, but the LLMorpheus paper did not explicitly frame its evaluation around the question of self-hostable vs API-only models and the trade-offs that matter in practice (e.g., controllability, repeatability, cost, and operational constraints).
Similarly, the paper does not investigate whether reasoning vs non-reasoning models lead to systematically different mutant generation behavior (e.g., edit subtlety, diversity, validity), despite this distinction being increasingly relevant in modern model offerings.

Research gap 3: cost-effectiveness needs updated, decision-oriented metrics
For practitioners, “better” models are not only those that generate many mutants, but those that generate useful mutants efficiently.
Because LLM-based pipelines incur token cost and runtime, and because outputs can include invalid or redundant suggestions, updated evaluations should report cost-effectiveness alongside effectiveness (e.g., cost per surviving mutant, token usage, runtime), enabling meaningful trade-off decisions across model categories.

Research gap 4: real-bug resemblance for modern models remains an open question
The original paper includes a 40-bug case study indicating that LLMorpheus can sometimes generate mutants that match buggy code fragments and/or reproduce the same test failures as real bugs.
It remains unclear whether modern models improve this ability, and whether improvements in general coding capability translate to improved bug-like mutant generation. This motivates an updated evaluation using an automated bug-replication pipeline (syntactic match + test-failure match).

Research gap 5 (NEW): surviving mutants are confounded by equivalent mutants; equivalence-aware interpretation is missing in modern-model comparisons
Surviving mutants are often interpreted as potential test weaknesses, but survival is a mixed signal: a mutant may survive because it exposes a genuine oracle/coverage gap, or because it is equivalent (no behavioral change is possible).
The original paper explicitly studies equivalent mutants (paper RQ2) via manual examination of surviving mutants; however, manual labeling does not scale well for broad modern-model comparisons with repeated runs.
Therefore, an updated practitioner-oriented evaluation should include an equivalence-aware lens that estimates how much of “survival” might plausibly be explained by equivalence, so that comparisons across models do not accidentally reward models that generate many equivalent (or near-equivalent) survivors.

Scope clarifications (avoid overclaiming) (UPDATED to match equivalence plan)
No LLM-based test generation: This thesis does not generate tests with LLMs. It evaluates LLM-generated mutants against existing project test suites.
Fixed configuration (model-first comparison): Experiments are run under a fixed configuration aligned with the original study’s recommended defaults (e.g., FULL prompt template, 
𝑇
=
0
T=0) to attribute differences primarily to model choice, not prompt engineering.
No manual equivalent-mutant labeling at scale: The thesis does not manually label equivalent mutants across all conditions. Instead, it uses:

survivors framed as inspection candidates, and
an automated equivalence screening approach if feasible, where an equivalence classifier is validated on an existing manually labeled dataset before being applied to new survivors to contextualize results (see Methodology additions).
Six-package benchmark subset: Due to budget and feasibility, the evaluation uses six subject packages selected by explicit diversity criteria (e.g., domain and size variety). This is documented as a limitation on generalizability.
Sources / references (APA 7)
Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus: Mutation testing using large language models. IEEE Transactions on Software Engineering. 
https://arxiv.org/abs/2404.09952

Zhao, W. X., Zhou, K., Li, J., Tang, T., Wang, X., Hou, Y., … Wen, J.-R. (2023). A survey of large language models. arXiv preprint arXiv:2303.18223. 
https://arxiv.org/abs/2303.18223 arxiv




Block 3

Block 3 — Research Questions (UPDATED: now RQ1–RQ6)
Title
Research Questions
Goal
Translate the research gap into a concise set of research questions that guide a practitioner-oriented evaluation of LLMorpheus on modern LLMs, while remaining directly comparable to the original paper’s models—and adding an equivalence-aware interpretation question as RQ6.
Content (detailed bullets)
Overview
This thesis evaluates how the LLMorpheus mutation-testing pipeline behaves when driven by modern LLMs, and how results compare to the original paper’s models under a controlled configuration.
The focus is model comparison and decision-relevant trade-offs (effectiveness, stability, cost, and bug resemblance), rather than prompt/temperature optimization.
Because “surviving mutants” are a mixed signal (test weakness vs equivalence), the thesis additionally includes an equivalence-aware research question to contextualize survivors.
Research questions and key metrics
RQ
Question
Key metrics
RQ1
How do modern LLMs compare to the original paper’s models?
Mutation score; valid mutant rate; surviving mutants; stability across runs; Levenshtein edit distance as a mutation-subtlety signal (normalized for cross-fragment comparability, absolute as a diagnostic), summarized both per-run and on the union of unique mutants across runs (deduplicated)
RQ2
Open-weight vs proprietary (API-only) — does it matter?
Same metrics as RQ1, grouped by model category
RQ3
Reasoning vs non-reasoning — does it matter?
Same metrics as RQ1, paired comparison based on provider labels
RQ4
What is the cost-effectiveness across model categories?
Tokens; runtime; cost per surviving mutant (with efficiency indicators such as duplicate rate); cost per unique survived mutant (union-based) where feasible; waste indicators (duplicate + invalid rates)
RQ5
Can modern LLMs replicate real-world bugs?
Syntactic match and test-failure match using the original set of 40 bugs from the LLMorpheus study
RQ6 (NEW)
How prevalent are equivalent mutants among surviving mutants in this setting, and can an automated equivalence screening approach (validated on existing labeled data) contextualize survival-based comparisons across models?
Classifier validation metrics on labeled dataset (accuracy, precision, recall, F1; confusion matrix; abstention rate if applicable); predicted-equivalent rate among survivors per model/project/run; “survived but predicted equivalent” vs “survived and predicted behavioral change”; stability of predicted-equivalence rates across runs; sensitivity of downstream interpretations (e.g., “effective survivors”) when equivalence screening is applied
Notes on interpretation (kept brief) (UPDATED)
Stability is treated as a first-class part of the model comparison (RQ1) because repeated runs can produce different mutants even under controlled settings.
Levenshtein distance is used comparatively as a proxy for mutation subtlety; this thesis reports both normalized and absolute values.
To avoid overweighting repeated mutants when summarizing mutation “style,” Levenshtein is additionally summarized over the union of unique mutants across runs (deduplicated across repeated runs).
RQ6 does not treat classifier outputs as ground-truth equivalence proofs; it uses validated screening to contextualize survival counts and avoid over-interpreting “more survivors” as “worse tests.”

Block 4 — Study Overview (High-Level Approach) (UPDATED: references RQ1–RQ6)
Title
Study Overview (High-Level Approach)
Goal
Provide a concise end-to-end overview of what is executed and how the outputs are used to answer RQ1–RQ6, without implementation details.
Content (bullet points)
For each selected model, I run the LLMorpheus mutation-testing workflow on the selected 6 benchmark packages using a fixed configuration.
In parallel, I run the real-world bug replication workflow on the original set of 40 bugs from the LLMorpheus study.
I repeat both workflows three times per model to capture run-to-run variability (stability).
From the mutation-testing runs, I compute model-specific statistics for RQ1, including mutation outcomes (e.g., killed/survived), validity/uniqueness rates, stability across runs, and mutation subtlety via Levenshtein distance (reported as absolute, normalized, and also on the union of unique mutants across runs).
I then reuse the same model-specific results to form category-level comparisons:
open-weight vs proprietary (API-only) for RQ2, and
reasoning vs non-reasoning (provider labels) for RQ3.
Using recorded token usage and runtime, I derive cost-effectiveness metrics for RQ4 (e.g., cost per surviving mutant and cost per unique survived mutant), with efficiency indicators such as duplicate rate to contextualize “wasted spend.”
Finally, I use outputs from the 40-bug workflow to answer RQ5 by measuring real-bug resemblance via syntactic match and test-failure match.
In addition (RQ6), I validate an automated equivalence screening classifier against an existing manually labeled dataset, and then apply it to surviving mutants from the benchmark runs to estimate the share of survivors that are likely equivalent vs likely behavior-changing. This provides an equivalence-aware contextualization of “survival” when interpreting model differences and downstream cost-effectiveness.

Block 5 — Contributions of This Thesis (UPDATED: adds equivalence contribution; keeps detail level)
Title
Contributions of This Thesis
Goal
Summarize the concrete outcomes/deliverables of the thesis in a way that makes the added value beyond the original LLMorpheus paper explicit.
Content (bullet points)
Updated empirical evaluation of LLMorpheus on modern models: A controlled comparison of modern LLMs against the original paper’s models using the same overall LLMorpheus workflow and a fixed configuration.
Category-level insights for practitioner model choice: Analysis of differences between open-weight vs proprietary (API-only) models and reasoning vs non-reasoning variants using consistent metrics.
Stability-aware benchmarking: Run-to-run variability results based on three repeated runs per model, including stability summaries and visualizations aligned with the original paper’s approach.
Mutation subtlety characterization: Comparative reporting of mutation “edit size” using Levenshtein distance (absolute and normalized), including a deduplicated union-of-unique-mutants view to reduce repetition bias.
Cost-effectiveness analysis: Cost and efficiency metrics derived from token usage and runtime, including indicators such as duplicate rate to capture wasted spend and “effective value per euro.”
Real-world bug resemblance evaluation: An automated assessment of whether models can replicate real bugs using the original 40-bug set, measured via syntactic match and test-failure match.
Equivalence-aware interpretation of survivors (NEW): Validation of an automated equivalence screening classifier on an existing manually labeled mutant dataset, and application of this classifier to surviving mutants from modern-model runs to estimate how much survival is plausibly explained by equivalence versus behavioral change—improving the interpretability of survivor-based comparisons and cost-efficiency metrics.
.




Block 6 — Thesis Structure (UPDATED: now RQ1–RQ6)
Title
Thesis Structure
Goal
Provide a short roadmap of the remaining chapters so the reader knows what to expect and where each research question is addressed.
Content (bullet points)
Chapter 2 — Background and Related Work: Introduces mutation testing fundamentals, operator-based mutation testing limitations, and the LLMorpheus approach in the context of LLM-based software engineering. Also introduces equivalent mutants as a key interpretation challenge and motivates automated equivalence screening as a scalable contextualization approach.
Chapter 3 — Methodology / Experimental Setup: Describes the experimental design, including model selection, benchmark package selection (6-package subset), fixed configuration, repetition protocol (3 runs per model), collected metrics, the real-world 40-bug replication workflow, and the equivalence-screening workflow (classifier validation on labeled data + application to survivors).
Chapter 4 — Results: Presents the empirical findings structured by the research questions:
RQ1: modern models vs original paper’s models (incl. stability + Levenshtein analyses)
RQ2: open-weight vs proprietary (API-only) comparison
RQ3: reasoning vs non-reasoning comparison
RQ4: cost-effectiveness analysis (tokens/runtime + efficiency indicators)
RQ5: real-world bug resemblance (syntactic and test-failure match)
RQ6: equivalence-aware interpretation of surviving mutants (classifier validation + predicted equivalence rates among survivors)
Chapter 5 — Discussion and Threats to Validity: Interprets results, discusses implications for practitioners, limitations (e.g., 6-package subset, time-conditional APIs, equivalence-screening uncertainty), and threats to internal/external validity.
Chapter 6 — Conclusion and Future Work: Summarizes key takeaways, answers the research questions, and outlines future improvements (e.g., broader benchmarks, improved equivalence filtering, alternative bug-resemblance measures).





Background


Block 1
Title
Mutation Testing: Measuring Test Suite Adequacy via Injected Faults
Goal
Define mutation testing and position it as the baseline technique that LLMorpheus extends—i.e., why we mutate programs, how we judge tests, and what the classic limitations are that motivate LLM-based mutant generation.
Detailed bullet points
Core idea (what mutation testing is)
Mutation testing evaluates a test suite by injecting small modifications (“mutants”) into the program and re-running the test suite on each mutant.
If tests fail on a mutant, the mutant is killed; if tests still pass, it survives (suggesting a potential weakness in the tests).
This operationalizes test adequacy beyond coverage metrics by asking: “Do tests detect plausible faults?”
Underlying assumptions (why this should work)
Competent programmer hypothesis: real programs with bugs are usually “close to correct.”
Coupling effect: tests strong enough to detect simple faults are often strong enough to detect more complex faults.
These ideas justify using relatively small code changes to approximate real faults.
How traditional mutation tools create mutants
Most tools implement a fixed set of mutation operators (e.g., replace operators/constants, tweak branch conditions, delete statements).
Each additional operator increases the number of mutants, which increases runtime because each mutant must be executed and analyzed in isolation.
Key outputs/metrics produced by mutation analysis
Per-mutant classification: killed / survived / timed-out (timeouts are common when mutations cause non-termination or extremely slow behavior).
Mutation score (conceptually): proportion of mutants killed by the test suite (often excluding invalid/equivalent/timeouts depending on tool conventions).
Practical artifact: interactive reports listing mutants and their status (LLMorpheus uses a customized StrykerJS for this).
Important limitation: operator sets don’t cover many real bug patterns
Some real faults are not coupled to classic operators (example given: “calling the wrong method” is unlikely to be simulated by typical operator sets).
Extending classic tools with many more operators can be impractical because it can explode mutant counts and slow analysis, and some operators may produce a “poorer experience.”
Why this matters for your thesis (bridge to LLMorpheus)
This limitation motivates LLMorpheus’ idea: keep the location selection rule-based, but let an LLM propose diverse, realistic replacements—aiming to produce mutants that resemble bug classes that operator-based tools struggle with.


References and sources
Tip, Bell, Schäfer. LLMorpheus: Mutation Testing using Large Language Models. IEEE TSE, Apr 2025 (PDF pages cited above).


Block 2

Title
Large Language Models (LLMs): Transformer Models, Access Types, Reasoning vs Non‑Reasoning, and Threats from API‑Hosted Deployment (OpenRouter)
Goal
Introduce LLMs at the level needed for this thesis (Transformer basis + model categories you will compare), and document the key threat to validity when using pretrained, API-hosted models via OpenRouter: model drift and deployment opacity.
Detailed bullet points
What an LLM is (research definition)
LLMs are language models trained at scale, typically with a next-token prediction objective, which enables strong prompt-based generalization (zero-/few-shot behavior). arxiv
Transformer foundation (why modern LLMs work)
The Transformer architecture relies on self-attention (rather than recurrence) and has become the dominant foundation for large-scale language modeling. arxiv
Open-weight vs proprietary models (what you can and cannot control)
Open-weight models publish weights and can be hosted by third parties; this generally improves auditability and reproducibility options (e.g., self-hosting or pinning a specific snapshot if available).
Proprietary models are usually only available via API, and their training data, post-training, and update cadence may be less transparent.
In the LLMorpheus study framing, multiple “open” LLMs (with documented training) and one proprietary LLM are evaluated, illustrating that access type can matter for interpretation.
Reasoning vs non-reasoning models (experimental factor, not just branding)
Non-reasoning (“standard”) models typically optimize for direct instruction-following and generation latency/cost.
Reasoning-oriented variants are designed to allocate more compute to multi-step problem solving; they may behave differently on the same prompt and often shift the cost/latency tradeoff.
For this thesis, this distinction is relevant because it can affect: (i) output consistency, (ii) token usage/cost, and (iii) how reliably a model follows strict output formats.
Threats to validity: API-hosted LLM drift and deployment opacity (OpenRouter)
Even when using “pretrained” models (no training by the researcher), the served model can change over time due to weight updates, post-training changes (e.g., safety tuning), or provider-side inference stack updates—so exact reruns may not reproduce identical outputs.
API providers may also apply serving-time policies (e.g., routing, load balancing, moderation, hidden system prompts) that are not fully visible; this introduces variance not captured in the repository.
Mitigation for this thesis: treat results as time- and provider-conditional measurements; log model identifiers + decoding parameters; run repeated trials and report mean plus variability.
Documentation and provenance note (scope-limited, thesis-relevant)
Because training data composition is not fully observable for many LLMs, a brief provenance note is academically standard; in this thesis it is treated primarily as a measurement and interpretation issue (not a broad societal-impact section). s10251.pcdn
References and sources (academic)
Vaswani, A. et al. “Attention Is All You Need.” NeurIPS 2017. arxiv
Brown, T. B. et al. “Language Models are Few-Shot Learners.” NeurIPS 2020. arxiv
Bender, E. M. et al. “On the Dangers of Stochastic Parrots: Can Language Models Be Too Big?” FAccT 2021. s10251.pcdn
Tip, F., Bell, J., Schäfer, M. “LLMorpheus: Mutation Testing using Large Language Models.” IEEE TSE, 2025. (Model access types and evaluation context.)




Block 3

Title
LLMorpheus: Placeholder‑Guided Mutation Testing with LLM-Generated Mutants (JavaScript)
Goal
Describe the LLMorpheus technique and tool at a systems level: how it generates mutants using placeholders and prompts, how it filters/records them, and how it integrates with (a modified) StrykerJS to classify mutants and produce reports.
Detailed bullet points
Motivation (why LLMorpheus exists)
Traditional mutation testing relies on a fixed set of mutation operators; this can miss real bug patterns (e.g., “wrong method call”) and adding many operators can be costly because each new operator increases the number of mutants to analyze.
LLMorpheus aims to produce mutants that resemble real bugs that are difficult to express as a small, hand-coded operator set.


Core technique (placeholder-guided prompting)
LLMorpheus introduces a <PLACEHOLDER> at designated mutation locations in source code and prompts an LLM to propose buggy replacements for that placeholder that change behavior relative to the original fragment.


Prompts include: background on mutation testing, the surrounding code containing the placeholder, the original code fragment that was replaced, and instructions to produce buggy code fragments.


Mutation location selection (rule-based “where”, LLM-based “what”)
LLMorpheus selects candidate mutation sites via parsing and considers, among others:
conditions of if, switch, while, do...while,
parts of loop headers (initializers/updaters/entire headers),
function calls: receiver, arguments, and sequences of arguments.
For each candidate location, it produces a separate prompt.
Output contract to make suggestions machine-actionable
The prompt requires the LLM to return multiple options (three) as fenced code blocks, each containing a single-line replacement, plus a brief explanation, and to terminate with a fixed marker (“DONE.”).
This formatting constraint enables automated extraction of candidate mutants.


Mutant extraction and filtering (making mutants usable)
The mutant generator extracts candidates by matching fenced code blocks, then discards:
suggestions identical to the original fragment,
duplicates of previously produced mutants,
syntactically invalid suggestions (checked by parsing).
Valid mutants are written to mutants.json; experimental artifacts (prompts, completions, configuration such as temperature) are also saved.
Executing mutants: integration with a modified StrykerJS
LLMorpheus uses StrykerJS (state-of-the-art JS mutation testing tool) but modifies it to read precomputed mutants from mutants.json (option --usePrecomputed) instead of applying StrykerJS’ built-in mutators.


StrykerJS then runs the test suite for each mutant and classifies them as killed, survived, or timed-out, producing an interactive report for inspection.
Engineering/pragmatics (what makes it practical)
Parsing and validation rely on BabelJS; prompt template instantiation uses Handlebars.
Because StrykerJS expects a mutant to correspond to a single AST node, LLMorpheus sometimes expands a mutation to the nearest enclosing AST node for constructs like loop headers or argument sequences.
Tooling supports LLM configuration (max completion length, temperature, code context window up to a default of 200 surrounding lines) and rate-limit handling (--rateLimit, --nrAttempts).
Empirical evaluation scope (what the paper measures, at a glance)
The paper evaluates LLMorpheus on 13 JavaScript/TypeScript packages, and studies prompt/temperature/model variations; it also measures cost via runtime and token counts.



The paper’s evaluation is structured around RQ1–RQ7 (mutant counts, equivalent mutants, temperature, prompt variations, model dependence, cost, and resemblance to real bugs).
References and sources (academic)
Tip, F., Bell, J., Schäfer, M. “LLMorpheus: Mutation Testing using Large Language Models.” IEEE Transactions on Software Engineering, Apr 2025.



(Contextual baseline tool referenced by the paper) StrykerJS mutation testing tool (discussed as state-of-the-art JS mutation testing, and modified for precomputed mutants).




Methodology


Methodology — Block 1 (UPDATED: “RQ1–RQ6” + equivalence workflow added, detail preserved)
Title
Method Overview: Experimental Design and End-to-End Workflow
Goal
Define the thesis as a model-comparison benchmarking study using the LLMorpheus workflow as the fixed experimental procedure, and describe the complete data flow (inputs → artifacts → metrics) that underpins RQ1–RQ6.
Content (detailed bullets)
Study type and intent
Empirical benchmarking study focused on practitioner decisions: “Which model should we choose for LLM-based mutation testing under realistic constraints?”
Replication mindset: keep the workflow aligned with LLMorpheus’ original procedure; extend it by evaluating modern model categories and adding additional evaluation metrics and interpretability layers.
Workflow overview (pipeline-level)
Mutant generation: for each benchmark project, generate prompts for pre-defined mutation locations, query the LLM, extract candidate mutants, and filter invalid/duplicate candidates into a mutants.json artifact.
Mutation analysis: execute mutants using a StrykerJS-based mutation analysis step that classifies each mutant as killed / survived / timed-out and computes mutation scores.
Aggregation: compute per-run and per-model metrics; then aggregate across repeated runs to quantify stability and compute group-level comparisons (open-weight vs proprietary; reasoning vs non-reasoning).
Bug resemblance (separate workflow): execute the 40-bug resemblance pipeline and compute syntactic-match and test-failure-match signals.
Equivalence screening (additional workflow for interpretability; RQ6): validate an automated equivalence classifier on an existing manually labeled dataset of mutants; then apply the validated classifier to surviving mutants from the benchmark runs to estimate the share of survivors that are likely equivalent versus likely behavior-changing, and report these estimates alongside standard mutation-testing outcomes.
Repetition protocol
Each model is evaluated with 3 independent runs on the benchmark subset to capture run-to-run variability under the same configuration.
Artifacts recorded
Per run: prompts, completions, configuration metadata, mutants.json, run summaries, and Stryker outputs/reports.
For RQ6 specifically: classifier inputs (original + mutant fragments + context), classifier outputs (label/probability if available), and validation results (confusion matrix and metrics) are stored to enable auditability and error analysis.




Block 2
Title
Sanity / Reproduction Check (Chronological First Step)
Goal
Validate that the local environment and toolchain behave as expected before executing the full experiment, so later differences can be attributed to model behavior rather than setup drift.
Content (detailed bullets)
Why this step exists
Mutation analysis can be sensitive to runtime and dependency details; therefore the experiment begins with a sanity check.
Procedure
Select one benchmark project as the sanity-check anchor.
Use a known mutants.json as input and run the mutation-analysis stage end-to-end.
Confirm that summary outcomes (killed/survived/timeout counts, mutation score, report generation) match the expected reference for that run.
Pin the validated environment configuration (Node version, tool versions) for all subsequent experiments.
Acceptance criteria
The check passes if the mutation-analysis results reproduce the reference (or any deviations are fully explained and documented, and the validated configuration is fixed going forward).

Block 3
Title
Subjects: Benchmark Packages and Subset Selection (6 Projects)
Goal
Define the study objects (JavaScript/TypeScript packages), justify the 6-project subset, and specify what is fixed for reproducibility and what this implies for generalizability.
Content (detailed bullets)
Benchmark source
Start from the LLMorpheus benchmark suite of real-world JS/TS packages with test suites.
Selected subset (6 projects)
Complex.js
countries-and-timezones
delta
node-jsonfile
pull-stream
zip-a-folder
Selection rationale (explicit criteria)
Language/tooling diversity: include both JS and TS projects.
Domain diversity: cover distinct library domains to reduce topic-specific bias.
Scale diversity: include variation in LOC and test-suite sizes to observe whether model behavior changes with project characteristics.
Feasibility: keep runtime and token budget manageable while still allowing 3 repetitions per model.
Reproducibility requirements
Each project is checked out at a fixed commit.
Mutate globs (files mutated) and any required benchmark patches are documented and automated.
Environment is pinned (Node version and tool versions) following the sanity check.
Validity implications
External validity is limited to the selected 6 projects; results are interpreted as evidence under the stated configuration, not universal conclusions.

Block 4
Title
Model Set and Model Categories (Open-Weight vs Proprietary; Reasoning vs Non‑Reasoning)
Goal
Lock the evaluated model set, define category labels used in RQ2/RQ3, and specify how models are accessed and logged via OpenRouter.
Content (detailed bullets)
Access method
All models are queried via OpenRouter.
Each request logs: model ID, decoding parameters, timestamps, and token usage (if provided by the API).
Locked model set
OpenAI pair (API-only, RQ3):
openai/gpt-4o-mini (non-reasoning)
openai/o4-mini (reasoning)
Google pair (API-only, RQ3):
google/gemini-2.5-flash (non-reasoning)
google/gemini-2.5-flash-reasoning (reasoning; if OpenRouter exposes a Flash reasoning SKU, otherwise use the closest Flash reasoning-labelled variant available at experiment time)
Anthropic pair (API-only, RQ3):
anthropic/claude-sonnet-4.5 (non-reasoning)
anthropic/claude-sonnet-4.5-reasoning (reasoning; use the exact reasoning-labelled SKU exposed in OpenRouter)
DeepSeek pair (open-weight, RQ3):
deepseek/deepseek-v3.1 (non-reasoning)
deepseek/deepseek-r1 (reasoning)
Meta Llama baselines (open-weight):
meta-llama/llama-3.3-70b-instruct
meta-llama/llama-4-maverick
Category definitions (used in RQ2/RQ3)
Open-weight / self-hostable-in-principle: weights are publicly available (even though inference is executed via OpenRouter in this thesis).
Proprietary / API-only: weights are not publicly released and models are accessible only via API.
Reasoning vs non-reasoning: determined by the model SKU (reasoning-labelled vs standard).
Threat-to-validity handling (API-hosted models)
Because API-hosted models can drift over time, runs are repeated and all configuration and timestamps are logged.

Block 5
Title
Fixed Experimental Configuration (Model-First Comparison)
Goal
Define the configuration that is held constant across models so that differences in outcomes are primarily attributable to model choice.
Content (detailed bullets)
Prompting setup
Use the default/full LLMorpheus prompt template and system prompt structure (same format across all models).
Enforce structured output requirements (fenced code blocks) so candidates can be extracted reliably.
Decoding parameters
Temperature fixed to T = 0.0 for the main comparison.
Other decoding parameters (e.g., max tokens, top-p) are fixed and logged.
Context and limits
Use a fixed code-context window strategy (bounded number of surrounding lines).
Use identical rate limiting and retry policies across models where feasible.
Repetitions
Perform 3 independent runs per model on the 6 benchmark projects.

Block 6
Title
Procedure A: Mutant Generation (Prompt → Completion → Filter → mutants.json)
Goal
Describe precisely how each run produces a set of mutants suitable for mutation analysis.
Content (detailed bullets)
Mutation location selection
Parse project sources and select candidate locations (e.g., control-flow conditions, loop headers, function call receivers/arguments).
For each location, replace the original fragment with <PLACEHOLDER> and generate one prompt.
LLM querying
Send prompts to the model via OpenRouter.
Request multiple options per prompt to increase diversity under a fixed temperature.
Candidate extraction
Extract proposed replacements from fenced code blocks.
Treat each valid replacement as a separate mutant that introduces exactly one code change.
Filtering and deduplication
Discard:
candidates identical to the original fragment,
duplicates (within-run and across prompt outputs),
syntactically invalid candidates (parse-check).
Persist the final mutant set into mutants.json.
Logged artifacts
Store prompts, completions, and run configuration alongside mutants.json for auditability.

Methodology — Block 7 (UPDATED: scope becomes RQ1–RQ6)
Title
Procedure B: Mutation Analysis (Execute Mutants and Classify Outcomes)
Goal
Run the test suite against generated mutants and collect the core mutation-testing outcomes needed for RQ1–RQ4 and the survivor set that becomes the input for equivalence screening in RQ6.
Content (detailed bullets)
Execution
Run the mutation testing engine with the precomputed mutant set (mutants.json) and the project’s test suite.
Per-mutant outcomes
Classify each mutant as:
killed (tests fail),
survived (tests pass),
timed-out (execution exceeds time limit).
Per-run outputs
Produce machine-readable outputs (counts, mutation score) and human-inspectable reports.
Downstream linkage (for RQ6)
Persist the set of surviving mutants with stable identifiers (e.g., file + location + replacement hash) so that equivalence screening can be applied consistently across runs and traced back to specific mutants.

Methodology — Block 8 (UPDATED: now covers RQ1–RQ4 + adds RQ6 implementation; preserves your level of detail)
Title
Evaluation Implementation: Scripts, Metrics, and Outputs (RQ1–RQ4, plus RQ6)
Goal
Define what is computed for RQ1–RQ4, which analyses reuse existing reporting/aggregation, what additional evaluation scripts are introduced by this thesis (e.g., normalized Levenshtein, grouping analyses, OpenRouter cost analysis), and how the equivalence-screening validation and application are implemented for RQ6.
Content (detailed bullets)
RQ1 — Modern model comparison (effectiveness + stability + mutation subtlety)
Effectiveness metrics (per model × project × run)
mutation score
#killed / #survived / #timed-out
#valid mutants produced (after filtering)
duplicate rate (share of candidates removed as duplicates)
Stability across runs
For each metric above: compute variability across the 3 runs (e.g., mean ± SD, or median/IQR).
Compute overlap and union of unique mutants across the 3 runs (deduplicated union).
Mutation subtlety (this thesis adds)
Compute Levenshtein edit distance between original fragment and mutant fragment:
absolute distance (diagnostic),
normalized distance (comparability across fragment lengths), e.g.
dnorm(a,b)=d(a,b)max⁡(∣a∣,∣b∣)d_{norm}(a,b)=\frac{d(a,b)}{\max(|a|,|b|)}dnorm​(a,b)=max(∣a∣,∣b∣)d(a,b)​
Report summaries both:
per run, and
over the deduplicated union of unique mutants across runs (to reduce repetition bias).
Reusable components vs additions
Reuse: pipeline artifacts and baseline aggregation/report generation of mutation outcomes.
Add: Levenshtein computation + union-of-unique-mutants summaries + plots/tables for edit-distance distributions.
RQ2 — Open-weight vs proprietary (group comparison)
Method
Reuse RQ1 per-model metrics.
Aggregate results by model category (open-weight vs proprietary).
Additions
A category mapping file (model → open-weight/proprietary).
Group-level tables/plots (e.g., grouped bars/violins) and effect summaries.
RQ3 — Reasoning vs non-reasoning (paired comparison)
Method
Define explicit reasoning pairs:
OpenAI: gpt-4o-mini vs o4-mini
Google: gemini-2.5-flash vs Flash reasoning SKU
Anthropic: Sonnet 4.5 vs Sonnet 4.5 reasoning SKU
DeepSeek: v3.1 vs r1
Compute paired deltas (reasoning − non-reasoning) for key metrics.
Additions
Pair specification file and paired-comparison tables/plots (paired bars or slopegraphs).
RQ4 — Cost-effectiveness (OpenRouter-focused)
Cost data captured
Token usage per run (input/output) where available; runtime per run and per project.
Cost computation
Use a fixed OpenRouter price snapshot for the experiment time window (model → $/M input, $/M output).
Compute:
total cost per run and per project,
cost per valid mutant,
cost per survived mutant,
cost per unique survived mutant (union-based).
Reusable components vs additions
Reuse: token accounting already produced by the pipeline (if present) and baseline runtime logging.
Add: OpenRouter price snapshot ingestion + cost calculator + cost-effectiveness plots (e.g., Pareto scatter: mutation score vs cost).
RQ6 (NEW) — Equivalent mutant screening: validation + application to survivors
Purpose
Surviving mutants are a mixed signal; RQ6 adds an equivalence-aware layer that estimates how much of survival may plausibly be explained by equivalence, using an automated classifier that is validated on existing manually labeled data before being applied to new mutants.
Inputs and datasets
Validation dataset: an existing manually labeled dataset of mutants with ground-truth labels {Equivalent, Behavioral Change}.
Per-mutant fields used: project, file, line/column, original fragment, replacement fragment, and code context fetched from the benchmark checkout at the pinned commit (context window size fixed).
Application dataset: surviving mutants from RQ1 runs (per model × project × run), with stable mutant IDs and stored original+replacement fragments.
Prompting / inference configuration (pre-registered and fixed)
Classifier model: specify a single chosen LLM (or small set) used only for classification; keep fixed across validation and application.
Decoding parameters fixed (example pattern; you fill with exact values you’ll use):
temperature T=0.0T=0.0T=0.0
top_p fixed
max_tokens fixed
stop sequences fixed
Output format fixed to be machine-parseable (strongly recommended): JSON with keys:
label ∈ {EQUIVALENT, BEHAVIORAL_CHANGE, UNCERTAIN}
(optional) short_rationale (kept short; not used for scoring)
If UNCERTAIN appears: define handling policy (e.g., exclude from equivalence-rate computation and report abstention rate; or treat as behavioral-change conservatively—must be pre-registered).
Validation protocol and metrics
Split policy (must be fixed):
Prefer a project-level split (train/validation/test by project) or at minimum report per-project performance to reduce leakage from project-specific idioms.
Metrics reported: accuracy, precision/recall/F1 (especially for the EQUIVALENT class), confusion matrix, and abstention rate if applicable.
Error analysis: categorize common failure types (e.g., JS coercion subtleties, exception-path differences, short-circuiting, NaN/undefined behavior, type narrowing, side effects).
Application outputs (equivalence-aware survivor contextualization)
For each model × project × run:
#survived mutants
#survived predicted EQUIVALENT
#survived predicted BEHAVIORAL_CHANGE
#survived UNCERTAIN (if used)
Derived rates: predicted-equivalent rate among survivors; predicted-behavior-change rate among survivors.
Stability for RQ6: report variability of predicted-equivalence rate across the 3 runs.
Optional equivalence-aware metrics for interpretation (clearly labeled as classifier-dependent):
“effective survivors” = survived predicted BEHAVIORAL_CHANGE (and optionally excluding UNCERTAIN).
Use in narrative: explain whether model differences in survival are driven by predicted equivalence vs predicted behavioral-change survivors.
Interpretation constraint
Classifier-based equivalence screening provides an estimate to contextualize results; it does not establish semantic equivalence definitively. Report it as “predicted equivalent” and use it to avoid over-interpreting raw survivor counts.




Block 9
Title
RQ5 Pipeline: Real-World Bug Resemblance (40-Bug Automated Evaluation)
Goal
Describe the automated bug-resemblance workflow and its two measurable signals (syntactic match and test-failure match), and specify the outputs and summaries reported per model.
Content (detailed bullets)
Underlying idea
A mutant “resembles” a real bug if it matches the buggy change at the fix location (syntactic) and/or reproduces the same failing-test pattern (behavioral signal).
Inputs (per bug)
Buggy version of the project.
Fixed version of the project.
Metadata identifying the fix location / buggy fragment (from the bug dataset).
Automated procedure (per bug, per model)
Run the test suite on the buggy version and record the failing-test set FbugF_{\text{bug}}Fbug​.
Run LLMorpheus mutant generation on the fixed version near the fix location.
For each mutant, run the tests and record failing-test set FmutF_{\text{mut}}Fmut​.
Compute two automatic signals:
Syntactic match: mutated fragment equals buggy fragment at the target location.
Test-failure match:Fmut=FbugF_{\text{mut}} = F_{\text{bug}}Fmut​=Fbug​.
Outputs
Per-bug table containing:
whether any syntactic match exists (and count of such mutants),
whether any failure-match mutant exists (and count),
references to the best-matching mutant IDs for inspection.
Aggregate summary per model:
#bugs with syntactic match,
#additional bugs with failure match (without syntactic match),
total #bugs matched by either criterion.

Block 10
Title
Data Management and Reproducibility (Logging, Storage, and Limits)
Goal
Specify what is stored, how runs are identified, and what boundaries exist for reproducibility when using API-hosted models.
Content (detailed bullets)
Stored artifacts
All prompts, completions, configs, mutants.json, and mutation-analysis reports are archived per run and per model.
Run identification
Each run is tagged with: model ID, timestamp, benchmark commit IDs, configuration hash.
Reproducibility boundary
Mutation analysis on a fixed mutants.json is expected to be reproducible under the pinned environment.
Mutant generation via API-hosted models is treated as time-conditional; reproducibility is addressed via repeated runs and artifact archiving.

Block 11
Title
Threats to Validity (Methodology-Embedded)
Goal
Document the key threats (construct, internal, external, reliability) and the mitigations built into the experimental design.
Content (detailed bullets)
Reliability
API-hosted model drift and nondeterminism → mitigated by fixed configuration, repeated runs, detailed logging.
Environment sensitivity (Node/tooling) → mitigated by sanity check and environment pinning.
Construct validity
Mutation score and survival counts are proxies for test adequacy; complement with RQ5 bug resemblance signals.
External validity
Six-project subset limits generalization; mitigated by explicit selection criteria and careful claim framing.
Confounds
Provider-side differences (rate limiting, hidden policies) → mitigated by uniform request settings and reporting variability rather than single-run conclusions.








Results

Purpose of this chapter
This chapter reports empirical findings from running the LLMorpheus pipeline under a fixed configuration (FULL prompt template, T=0.0T=0.0T=0.0) on a six-package benchmark subset, with three independent runs per model. Results are organized by RQ1–RQ6 and are presented primarily as tables and figures derived from the recorded pipeline artifacts.
What “a run” means
A run refers to one complete execution of the pipeline for a given model across the selected benchmark packages:
mutant generation (prompts → completions → filtering → mutants.json), and
mutation analysis (execute mutants via StrykerJS → killed/survived/timed-out + mutation score).
Because LLM outputs can vary even under controlled settings, each model is evaluated with three independent runs, and we report both central tendency and variability.
Aggregation conventions (state these once, reuse everywhere)
Per-project metrics are computed first (e.g., mutation score on Complex.js in run 2).
Per-model metrics are then aggregated across the six projects:
For counts (e.g., killed mutants), aggregation is typically via sum across projects.
For rate-like quantities (e.g., mutation score), aggregation is typically via mean or median across projects (explicitly stated in each figure/table caption).
Across-run summaries (stability) are reported as mean ± SD (or median/IQR if distributions are skewed). The same summary choice is used consistently across RQs.
“Union of unique mutants” (why you use it)
Some mutants may reappear across repeated runs (especially at low temperature). To avoid overweighting repeated mutants when characterizing mutation “style” (e.g., edit distance), certain analyses are computed on the union of unique mutants across runs (deduplicated). This union-based view answers: What kinds of mutations does a model produce overall, not just what it repeats?
What belongs in Results vs Discussion
Results: what happened (numbers, distributions, variability, trade-offs).
Discussion: why it happened, implications, and recommendations.

Block 0 — Sanity / Reproduction Check (chronological first experiment)
Title
Sanity Check: Reproducing Mutation Analysis on a Known Mutant Set
Goal
Demonstrate that the local toolchain (pinned Node version, dependencies, modified StrykerJS, benchmark checkout) can reproduce a reference mutation-analysis outcome when given the same mutants.json. This establishes that later differences in performance are attributable primarily to LLM-driven mutant generation, not environment drift.
Inputs / artifacts
One anchor benchmark (recommended: Complex.js).
A known-good reference mutants.json from an earlier run (the “golden” mutant set).
Modified StrykerJS run with --usePrecomputed.
Outputs captured:
mutation score
killed / survived / timed-out / total mutant counts
(optional but ideal) per-mutant status list from JSON reporter
Procedure (results-facing)
Check out the anchor project at the pinned commit and install dependencies.
Run mutation analysis using the reference mutants.json (no LLM calls).
Compare the produced outcomes to the reference outcomes.
Acceptance criteria
The sanity check passes if:
summary metrics match the reference (or any differences are fully explained and then the environment is pinned), and
if available, per-mutant statuses match (preferred).
What to report (tables/figures)
Table 0-A — Reproduction outcome (anchor project)
Columns: metric | reference | reproduced | match?
Minimum rows: mutation score, killed, survived, timed-out, total mutants.
Figure 0-1 (optional) — Status agreement visualization
If you have per-mutant statuses: show a small confusion-style summary: how many mutants kept the same status vs changed.
Plain-text workflow diagram (Google Docs friendly)
Reference mutants.json | v StrykerJS (usePrecomputed) | v killed / survived / timed-out + mutation score | v compare to reference numbers --> sanity check passed (pin environment)
Short results write-up template
We first validated the experimental environment by rerunning mutation analysis on an anchor project using a fixed, precomputed mutants.json. The resulting mutation score and killed/survived/timed-out counts matched the reference outcome (Table 0‑A), indicating that the mutation-analysis stage is reproducible under the pinned toolchain. Therefore, subsequent differences between models are interpreted primarily as differences in LLM-driven mutant generation rather than execution drift.

Block RQ1 — Modern model comparison (effectiveness + stability + mutation subtlety)
Title
RQ1: How do modern LLMs compare to the original paper’s models?
Goal
Under a fixed configuration (FULL template, T=0.0T=0.0T=0.0), compare models on:
mutation-testing effectiveness,
mutant generation quality (validity/uniqueness),
stability across runs, and
mutation subtlety (Levenshtein edit distance), reported both per-run and on the union of unique mutants across runs.
Inputs / artifacts
Per model × project × run:
mutants.json
summary.json
Stryker outputs (counts + mutation score; ideally JSON reporter)
Metrics (define once; reuse in captions)
Effectiveness
mutation score
#killed, #survived, #timedOut
Generation quality
#prompts
#valid mutants (post-filter)
duplicate rate (duplicates removed / extracted candidates)
invalid rate (parse failures / extracted candidates), if recorded
Stability (3 runs)
mean ± SD across runs for key metrics
overlap between runs for unique mutants (e.g., Jaccard)
size of union-of-unique mutants
Mutation subtlety
absolute Levenshtein: d(a,b)d(a,b)d(a,b)
normalized Levenshtein:
dnorm(a,b)=d(a,b)max⁡(∣a∣,∣b∣)d_{\text{norm}}(a,b)=\frac{d(a,b)}{\max(|a|,|b|)}dnorm​(a,b)=max(∣a∣,∣b∣)d(a,b)​ Report:
per-run distribution summaries
union-of-unique distribution summaries
Figures & tables to produce
Table RQ1-A — Main model comparison (aggregated across 6 projects)
Rows: models
Columns (suggested): mutation score, killed/survived/timed-out totals, valid mutants, duplicate rate, stability summary (e.g., SD of mutation score), median dnormd_{\text{norm}}dnorm​.
Figure RQ1-1 — Trade-off scatter: effectiveness vs mutant volume
x: valid mutants (or survived mutants)
y: mutation score
point size: union-of-unique mutants
point color: model category (optional; RQ2 formalizes this)
Figure RQ1-2 — Stability visualization
A heatmap (models × metrics) showing run-to-run variability (e.g., SD or coefficient of variation) for:
valid mutants
survived mutants
mutation score
duplicate rate
Figure RQ1-3 — Levenshtein distributions
Two panels:
all mutants (per run)
union-of-unique mutants (deduplicated)
Appendix Table RQ1-X (optional) — Per-project breakdown
Helps readers see whether results are dominated by one project.
Plain-text pipeline diagram
Model m | +-- Run 1 -- mutants.json --+ +-- Run 2 -- mutants.json --+--> Stryker outcomes (score, killed, survived, timeout) +-- Run 3 -- mutants.json --+ | +--> Levenshtein(orig, mutant) (per run + union-of-unique) | v RQ1 tables + figures
“Answer to RQ1” sentence template
Answer to RQ1: Under the fixed configuration, modern models differ substantially in (i) mutation-testing effectiveness, (ii) stability across repeated runs, and (iii) mutation subtlety, with the strongest-performing models exhibiting [higher mutation score / more survived mutants] but not necessarily the best stability or cost-efficiency (Table RQ1‑A; Figures RQ1‑1 to RQ1‑3).

Block RQ2 — Open-weight vs proprietary (API-only)
Title
RQ2: Open-weight vs proprietary (API-only) — does it matter?
Goal
Using RQ1 metrics, compare model access-type categories on the same outcome dimensions:
effectiveness,
generation quality,
stability,
mutation subtlety.
Inputs / artifacts
RQ1 per-model results
category mapping: model → {open-weight, proprietary}
Metrics
Same as RQ1, but aggregated by category:
mutation score distribution
survived mutants distribution
validity + duplicate/invalid rates
stability metrics
Levenshtein summaries (median dnormd_{\text{norm}}dnorm​)
Figures & tables
Table RQ2-A — Category summary (distribution-aware)
Columns: category, #models, median mutation score (IQR), median survived mutants (IQR), median duplicate rate (IQR), stability statistic (IQR).
Figure RQ2-1 — Category comparison plots (box/violin)
At minimum:
mutation score by category
survived mutants by category
stability metric by category
Figure RQ2-2 (optional) — Per-project category comparison
Paired bars per project showing category-level medians/means.
Plain-text regrouping diagram
RQ1 per-model metrics | v Attach category labels (open-weight vs proprietary) | v Aggregate + visualize distributions | v RQ2 tables + figures
“Answer to RQ2” sentence template
Answer to RQ2: When grouped by access type, open-weight and proprietary models show [similar / different] distributions of effectiveness and stability; differences are most apparent in [metric], while [metric] remains comparable across categories (Table RQ2‑A; Figures RQ2‑1–RQ2‑2).

Block RQ3 — Reasoning vs non-reasoning (paired comparisons)
Title
RQ3: Reasoning vs non-reasoning — does it matter?
Goal
Within paired model families, evaluate whether reasoning-labelled SKUs produce systematic shifts in:
mutation score and survived mutants,
generation quality,
stability,
Levenshtein subtlety.
Inputs / artifacts
RQ1 per-model metrics
explicit pair specification (reasoning vs non-reasoning)
Metrics (paired deltas)
For each pair and project:
Δ(mutation score)=reasoning−non-reasoning\Delta(\text{mutation score}) = \text{reasoning} - \text{non-reasoning}Δ(mutation score)=reasoning−non-reasoning
similarly for survived mutants, valid mutants, duplicate rate, stability stats, Levenshtein medians
Figures & tables
Table RQ3-A — Pairwise delta summary
Rows: pairs; columns: delta mutation score, delta survived, delta validity, delta stability, delta dnormd_{\text{norm}}dnorm​.
Figure RQ3-1 — Paired slopegraphs (per pair, per project)
For each project: show non-reasoning value connected to reasoning value (one figure per key metric, or small multiples).
Figure RQ3-2 — Delta distribution plot
Dots or violins of per-project deltas for each pair (shows consistency vs mixed effects).
Plain-text paired comparison diagram
Provider pair: Non-reasoning model --> metrics per project Reasoning model --> metrics per project | v compute deltas (reasoning - non-reasoning) | v RQ3 tables + figures
“Answer to RQ3” sentence template
Answer to RQ3: Reasoning-labelled variants [do / do not] consistently improve effectiveness under this workload; instead, they primarily affect [stability / validity / cost], with effects varying by provider pair and project (Table RQ3‑A; Figures RQ3‑1–RQ3‑2).

Block RQ4 — Cost-effectiveness across model categories
Title
RQ4: What is the cost-effectiveness across model categories?
Goal
Report practitioner-relevant trade-offs that combine:
token cost (OpenRouter pricing snapshot),
runtime,
useful outputs (survived mutants, unique survived mutants),
and waste indicators (duplicates/invalids).
Inputs / artifacts
Per run:
token usage (input/output tokens) from logs/API responses
wall-clock runtime per run (and per project if available)
mutant counts (valid, survived, unique)
pinned OpenRouter price snapshot: model → $/M input, $/M output
Cost formulas and efficiency metrics
Total cost per run: $$$\text{Cost}=\frac{T_{in}}{10^6}p_{in}+\frac{T_{out}}{10^6}p_{out}$
Report at least:
cost per valid mutant
cost per survived mutant
cost per unique survived mutant (union-of-unique across runs)
runtime per run
duplicate rate (waste indicator)
Figures & tables
Table RQ4-A — Cost summary per model
Columns: tokens in/out, total cost, runtime, cost/valid, cost/survived, cost/unique-survived, duplicate rate.
Figure RQ4-1 — Pareto scatter (effectiveness vs cost)
x: cost per unique survived mutant (lower better)
y: mutation score (higher better)
Figure RQ4-2 — Token cost composition
Stacked bars: input cost vs output cost.
Figure RQ4-3 — Waste indicators
Bar chart: duplicate rate (and invalid rate if present) per model.
Plain-text cost pipeline diagram
token usage (Tin, Tout) + price snapshot (pin, pout) | v total cost | +------------+-------------+ | | useful outputs (survived, unique) waste indicators (duplicates, invalids) | | +------------+-------------+ | v cost-effectiveness tables + Pareto plots
“Answer to RQ4” sentence template
Answer to RQ4: Cost-effectiveness varies markedly; models that maximize mutation score are not necessarily cost-efficient, and Pareto analysis highlights a subset of models that provide the best trade-off between effectiveness and cost per unique survived mutant (Table RQ4‑A; Figures RQ4‑1–RQ4‑3).

Block RQ5 — Real-world bug resemblance (40-bug automated evaluation)
Title
RQ5: Can modern LLMs replicate real-world bugs?
Goal
Measure whether LLMorpheus-driven mutants resemble real bugs using two automated signals:
syntactic match at the fix location, and
test-failure match (mutant reproduces the same failing-test set as the buggy version).
Inputs / artifacts
Per model × bug:
failing test set on buggy version: FbugF_{\text{bug}}Fbug​
failing test sets per mutant: FmutF_{\text{mut}}Fmut​
syntactic comparison at target location (exact match rule)
per-bug result table with references to matching mutant IDs
Metrics
Per model:
#bugs with ≥1 syntactic match
#additional bugs with failure match only (no syntactic match)
total #bugs matched by either criterion
#evaluable bugs vs excluded (with exclusion reasons)
Figures & tables
Table RQ5-A — Per-model bug resemblance summary
Columns: evaluable bugs, syntactic-match bugs, failure-match-only bugs, total matched.
Table RQ5-B — Per-bug case table (core artifact)
Rows: bugs; columns: syntactic match? failure match? which model(s); references to representative mutant IDs.
Figure RQ5-1 — Stacked bars per model
Syntactic matches vs failure-only matches.
Figure RQ5-2 (optional) — Bug × model heatmap
Cells: none / failure-match / syntactic-match.
Plain-text bug pipeline diagram
Bug dataset (buggy version, fixed version, fix location) | +--> run tests on buggy version --> F_bug | +--> generate mutants near fix on fixed version | v run tests per mutant --> F_mut | +--> syntactic match? (equals buggy fragment) +--> failure match? (F_mut == F_bug) | v per-bug table --> per-model summary + plots
“Answer to RQ5” sentence template
Answer to RQ5: Modern models can replicate real bugs to varying degrees; syntactic matches are relatively rare but strong, while failure-match-only cases are more frequent and indicate behavioral resemblance even without identical code (Tables RQ5‑A/RQ5‑B; Figures RQ5‑1–RQ5‑2)






Results — add a new block for RQ6 (NEW, same detail style as your existing Results blocks)
Block RQ6 — Equivalent mutants: validation + equivalence-aware interpretation of survivors
Title
RQ6: How prevalent are equivalent mutants among surviving mutants, and can automated equivalence screening contextualize survival-based comparisons?
Goal
Quantify (i) how well an automated equivalence-screening classifier performs on an existing manually labeled mutant dataset, and (ii) how applying this validated classifier to surviving mutants from the benchmark runs changes the interpretation of “survival” across models. The aim is not to prove equivalence, but to provide an equivalence-aware lens that separates “survived because tests missed behavior” from “survived because behavior likely did not change,” as far as can be estimated automatically.
Inputs / artifacts
Validation phase:
Manually labeled mutant dataset (ground truth labels: Equivalent vs Behavioral Change).
Benchmark checkouts at pinned commits to reconstruct surrounding context consistently (context window fixed).
Classifier prompts and raw outputs (archived).
Application phase:
Surviving mutants from the benchmark runs (per model × project × run), including original and replacement fragments and context.
Classifier outputs per survivor (label + optional confidence/UNCERTAIN).
Linkage keys to trace predictions back to mutant IDs and Stryker outcomes.
Validation metrics (reported first)
Accuracy (overall)
Precision/recall/F1 for EQUIVALENT class (emphasize because false positives/negatives matter differently)
Confusion matrix (TP/FP/FN/TN)
Abstention/UNCERTAIN rate (if applicable)
Per-project breakdown (recommended): show whether performance is consistent across different codebases
Application metrics (reported second)
Per model × project × run:
#survived mutants
#survived predicted EQUIVALENT
#survived predicted BEHAVIORAL_CHANGE
#survived UNCERTAIN (if applicable)
Rates:
predicted-equivalent rate among survivors
predicted-behavior-change rate among survivors
Across-run stability:
mean ± SD (or median/IQR) of predicted-equivalent rate and predicted-behavior-change survivor counts across the 3 runs
Figures & tables to produce
Table RQ6-A — Classifier validation summary
Rows: classifier model/prompt variant (if more than one; otherwise single row)
Columns: accuracy, precision/recall/F1 (EQUIVALENT), confusion matrix counts, abstention rate, notes on split protocol
Figure RQ6-1 — Confusion matrix visualization
Heatmap or normalized confusion matrix for the final chosen classifier configuration
Table RQ6-B — Predicted equivalence among survivors (per model, aggregated across 6 projects)
Rows: models
Columns: total survivors, predicted-equivalent survivors, predicted-behavior-change survivors, predicted-equivalent rate, across-run variability statistic
Figure RQ6-2 — Survivor composition plot
Stacked bars per model: survived predicted EQUIVALENT vs survived predicted BEHAVIORAL_CHANGE (and UNCERTAIN if used)
Figure RQ6-3 (optional) — Stability of predicted equivalence rate
Per-model dot/violin plot showing predicted-equivalent rate across the three runs (helps show whether equivalence screening is itself stable)
Plain-text pipeline diagram
Labeled dataset (orig, mutant, context) | v classifier | v validation metrics (acc/F1/confusion)
Benchmark survivors (from Stryker) | v classifier | v predicted equivalent vs behavioral-change survivors | v RQ6 tables + plots
“Answer to RQ6” sentence template
Answer to RQ6: The validated equivalence-screening classifier indicates that the fraction of surviving mutants predicted equivalent varies substantially across models and projects; therefore, raw survivor counts should be interpreted with caution, and an equivalence-aware breakdown (“predicted equivalent” vs “predicted behavioral change”) provides a more decision-relevant view of how models differ in the kinds of survivors they produce (Table RQ6‑B; Figures RQ6‑2–RQ6‑3).







Discussion

5.0 Purpose and scope of the discussion (short opener)
Goal of this chapter
Interpret the results from Chapter 4 in terms of practical meaning and likely mechanisms.
Connect findings back to the thesis goals: model comparison for LLM-based mutation testing, stability, cost-effectiveness, and bug resemblance.
Boundary between Results and Discussion
Results: reported metrics, distributions, and comparisons.
Discussion: why patterns are plausible, what trade-offs matter, what can/cannot be concluded.

5.1 RQ1 — Modern model comparison: what drives differences?
RQ1 recap: How do modern LLMs compare to the original paper’s models (effectiveness, stability, subtlety)?
Dimension A — Effectiveness vs mutant volume (quantity vs “useful” mutants)
Mutation score and killed/survived counts can rise because a model:
generates more mutants (higher coverage of mutation sites), and/or
generates more effective mutants (mutations that tests can detect), and/or
generates more surviving mutants (potential test weaknesses).
Discussion focus:
If your trade-off scatter (mutation score vs valid/survived mutants) shows models with high volume but mediocre score, interpret this as quantity without targeting.
If models achieve high mutation score with fewer mutants, interpret as more “impactful” mutation proposals (or a mutation distribution aligned with existing tests).
Practical implication:
For teams using mutation testing as a signal of test quality, a model that produces many mutants but mostly duplicates/invalids is less valuable than one producing fewer but consistently executable mutants.
Dimension B — Survived mutants: signal, noise, and interpretability
Survived mutants are often treated as “tests missed something,” but they are a mixed bag:
True weaknesses: behavior-changing mutants not detected by tests.
Equivalent mutants: behavior unchanged; tests cannot kill them.
Oracle limitations: tests might not cover the relevant behavior even if the mutant is meaningful.
Since your thesis does not do manual equivalent labeling:
Interpret “more survivors” cautiously: it can indicate either more interesting faults or more equivalence/neutral changes.
Practical implication:
Survivors are still useful as inspection candidates, but “survival count = test weakness” is not a clean equivalence.
Dimension C — Stability across runs at fixed settings (even at T=0T = 0T=0)
Stability matters because practitioners need:
repeatable metrics for tracking improvements in CI,
comparable results across time and teams.
Discussion focus:
If models differ in run-to-run variance (mutation score, valid mutants, overlap), discuss the operational cost of instability:
benchmarking becomes noisy,
model ranking becomes sensitive to repetition count,
“progress” may be random variation.
Interpretation angle:
If T=0T=0T=0 still yields variability, plausible contributors include provider-side nondeterminism, routing, safety layers, or subtle decoding differences.
Dimension D — Mutation subtlety (Levenshtein) as a “style” signal (not realism ground truth)
What edit distance can suggest:
low normalized distance → small localized changes (possibly closer to “competent programmer” mistakes)
high distance → disruptive changes (possibly easier to kill, more invalid-prone, or less realistic)
What it cannot guarantee:
low edit distance does not imply realistic bug patterns,
high edit distance does not imply unrealistic behavior (sometimes a realistic bug requires a bigger change).
Important discussion point (methodological strength):
You report Levenshtein both per-run and on the union of unique mutants.
This avoids conflating “model repeats the same mutation” with “model tends to produce small edits.”
Dimension E — Consistency across projects (general vs project-specific behavior)
Discuss whether rankings are stable across the 6 selected projects:
Do some models dominate only on certain packages (domain/tooling dependence)?
Are any models consistently good across all projects (robustness)?
Practical implication:
If project-dependence is strong, model choice may need to be tailored to the codebase type (TS-heavy vs JS-heavy, test size, runtime characteristics).

5.2 RQ2 — Open-weight vs proprietary (API-only): what does access type change?
RQ2 recap: Does open-weight vs proprietary matter (same metrics as RQ1)?
Dimension A — Is “access type” predictive in your outcomes?
Discuss whether category-level differences are:
strong and consistent,
weak (mostly overlapping distributions),
or heavily project-dependent.
If differences are small:
Emphasize that “open vs proprietary” is not a reliable predictor by itself; model-specific behavior dominates.
If differences are large:
Present plausible mechanisms cautiously:
output-format discipline,
code-syntax reliability,
instruction-following vs safety constraints.
Dimension B — Reproducibility and controllability (what you can and cannot claim)
Even though open-weight models are self-hostable in principle, in your experiments:
inference is conducted via OpenRouter (API-hosted).
Discuss what you can conclude:
performance differences between models that happen to be open-weight vs proprietary as served during your experiment.
Discuss what you cannot conclude:
that self-hosting would replicate the same behavior,
that open-weight inherently guarantees reproducibility (deployment still matters).
Dimension C — Operational trade-offs beyond metrics
Discuss decision factors practitioners care about:
governance and audit requirements,
vendor lock-in,
ability to pin versions,
observability/logging.
Tie this back to your Stability and Cost findings:
a slightly weaker but more stable/cheaper model may be preferable in CI.

5.3 RQ3 — Reasoning vs non-reasoning: what changes when “reasoning” is enabled?
RQ3 recap: Does reasoning vs non-reasoning matter, based on paired comparisons?
Dimension A — Format adherence / extractability
Reasoning variants may:
produce longer outputs,
include additional text outside fenced code blocks,
violate “single-line code fragment” constraints more often.
What to interpret from your data:
parse failure rate, invalid mutant rate, or “no extract” cases (if you logged these).
Why it matters:
a model that is “smarter” but breaks the output contract can appear worse because fewer suggestions survive filtering.
Practical implication:
for tool integration, format reliability can outweigh marginal gains in raw effectiveness.
Dimension B — Does reasoning improve “useful creativity” or mostly cost?
Discuss whether paired deltas show consistent gains in:
mutation score,
survived mutants,
unique mutants (union-of-unique),
bug resemblance (if you relate to RQ5 later).
If gains are small but token usage/runtimes rise:
interpret reasoning as not cost-effective for this workload (under your fixed prompt).
If gains are meaningful:
discuss whether the value is:
better targeting (higher mutation score),
broader exploration (more unique survivors),
or improved bug resemblance.
Dimension C — Consistency vs diversity
Reasoning could plausibly:
stabilize outputs (more careful, less random),
or destabilize outputs (more verbose, more branching behavior).
Use stability figures:
overlap/Jaccard of unique mutants across runs,
SD of mutation score across runs.
Practical implication:
if reasoning increases variance, more runs are needed for reliable benchmarking; this affects cost and study design.
Dimension D — Interaction with the fixed prompt template
Under FULL + T=0T=0T=0, the prompt already:
forces structured output,
asks for multiple options.
Discuss the possibility that:
the template constrains the benefit of reasoning,
or that reasoning models benefit more under templates that allow more deliberation.
Important: Frame this as a limitation/extension opportunity, not a missing requirement.

5.4 RQ4 — Cost-effectiveness: what is “best” depends on the objective
RQ4 recap: How cost-effective are models/categories?
Dimension A — Define value explicitly (what are you optimizing?)
Discuss that “best model” depends on the objective:
maximize mutation score,
maximize survived mutants for inspection,
maximize unique survivors per euro,
minimize runtime for CI feasibility,
maximize bug resemblance (RQ5).
Explain why your chosen efficiency metrics (e.g., cost per unique survived mutant) matter.
Dimension B — The Pareto frontier (decision-oriented interpretation)
Discuss models on the Pareto frontier (from your scatter):
these represent best trade-offs between cost and effectiveness.
For models off the frontier:
discuss whether they are dominated because of high cost, low effectiveness, or instability.
Dimension C — Waste and “hidden cost”
Duplicate and invalid rates are not just quality issues; they are:
direct drivers of cost (you paid tokens for discarded suggestions),
drivers of runtime (more filtering and more Stryker execution if not filtered early).
Discuss:
whether some models waste more compute,
and how much this affects “effective value per euro.”
Dimension D — Runtime feasibility (CI and developer workflow)
Token cost is not the only cost:
wall-clock runtime determines whether this is feasible nightly/weekly or only occasionally.
Discuss:
models that are cheap but slow,
models that are expensive but fast,
and which is acceptable for the target use case.
Dimension E — Time-conditional costs and pricing drift
Your cost results depend on:
a pinned price snapshot,
tokens actually used,
provider billing policy.
Discuss:
why you report cost with a snapshot and how readers should interpret it,
that absolute €/$ may change, but relative efficiency may remain informative.

5.5 RQ5 — Real-world bug resemblance: what the two match signals mean
RQ5 recap: Can modern models replicate real bugs via syntactic match and test-failure match?
Dimension A — Strength of evidence hierarchy (syntactic match vs failure match)
Syntactic match
strong signal: same code fragment at the fix location,
but not full proof of causality (could still be coincidental or influenced by training data).
Failure-match
behavioral signal: reproduces same failing tests,
but not unique: different faults can yield the same failure set.
Interpret results accordingly:
syntactic matches are high-confidence but rare,
failure matches are broader but noisier.
Dimension B — Test suite as oracle (construct validity)
Both signals depend on the test suite:
weak tests can make failure-match easier (coarse failure sets),
missing tests can prevent matches even if mutants are bug-like.
Discuss:
bug resemblance results as “under this test oracle,” not universal behavior resemblance.
Dimension C — Relationship to mutation testing outcomes
Discuss whether models that are strong in mutation score/unique survivors are also strong in bug resemblance:
alignment suggests the pipeline is generating relevant faults,
misalignment suggests mutation score alone isn’t capturing “bug-likeness.”
Practical implication:
bug resemblance can serve as a complementary metric when choosing models for mutation testing.
Dimension D — Leakage and provenance considerations (careful framing)
The original LLMorpheus paper treats bug resemblance as evidence not fully explained by leakage; your thesis can mirror the cautious stance.
Discuss:
why syntactic matches are not automatically proof of leakage,
why you avoid overclaiming “no leakage,”
and how your two-signal approach helps.

5.6 Limitations and Threats to Validity (include this explicitly)
You can title this either:
“Limitations and Threats to Validity” (best), or
separate Limitations and Threats sections (fine if you prefer).
5.6.1 External validity (generalizability)
Language/ecosystem scope
Limitation: only JavaScript/TypeScript projects using the StrykerJS-based pipeline.
Why it matters: other languages have different mutation operators, tooling constraints, and test ecosystems.
Residual risk: results may not transfer to Java/C#/Python or to non-Stryker mutation engines.
Benchmark scope
Limitation: 6-project subset.
Why it matters: model rankings may change with more projects or different types of projects.
Mitigation: explicit diversity criteria (domain, LOC, tests, JS/TS mix).
Residual risk: still a sample; avoid universal claims.
Fixed configuration
Limitation: FULL template + T=0T=0T=0 used to isolate model effects.
Why it matters: other templates/temperatures may change relative performance.
Mitigation: stability via repeated runs; configuration logged.
Residual risk: results apply to this configuration, not “LLMorpheus in general.”
5.6.2 Construct validity (are you measuring what you claim?)
Mutation score and survived mutants are proxies
Limitation: mutation score operationalizes test adequacy only indirectly.
Why it matters: a test suite can kill mutants but still miss certain real faults.
Mitigation: include RQ5 bug resemblance signals.
Residual risk: bug resemblance still depends on test oracle.
No manual equivalent-mutant labeling
Limitation: some survivors may be equivalent mutants.
Why it matters: inflates “survived” counts and complicates interpretation of test weakness.
Mitigation: emphasize comparative trends under identical settings; report union-of-unique; complement with RQ5.
Residual risk: cannot precisely quantify “true” behavioral survivors.
Levenshtein distance is a proxy
Limitation: edit distance measures syntactic change size, not semantic realism.
Why it matters: small changes can be unrealistic; larger changes can be realistic.
Mitigation: use it comparatively and report both normalized and absolute values.
Residual risk: do not claim “realism” purely from distance.
5.6.3 Internal validity (confounds)
Provider-side effects and serving policies
Limitation: OpenRouter may apply routing, safety layers, or backend changes not visible to the experiment.
Why it matters: can change outputs independent of model architecture.
Mitigation: repeated runs; full artifact logging (prompts/completions); timestamps.
Residual risk: some variance remains unexplained.
Output-format compliance as a confound
Limitation: models that deviate from the fenced-code contract can appear worse due to extraction/filtering losses.
Why it matters: affects valid mutant counts and downstream Stryker outcomes.
Mitigation: track parse/extract failure rates; keep prompts consistent across models.
Runtime and timeout behavior
Limitation: some mutants may induce timeouts due to performance regressions/non-termination.
Why it matters: timeout classification may differ by environment and can bias mutation score.
Mitigation: pinned environment + sanity check; consistent timeout thresholds.
5.6.4 Reliability / reproducibility
API-hosted model drift and nondeterminism
Limitation: exact reruns may differ even at T=0T=0T=0.
Why it matters: undermines perfect repeatability.
Mitigation: 3 independent runs; report variability; archive prompts and completions.
Residual risk: results are time-conditional.
Environment sensitivity
Limitation: Node/toolchain changes can change mutation-analysis results.
Mitigation: sanity/reproduction step; pin Node version; document dependencies.
Residual risk: reproducing years later may require re-creating the environment.

5.7 Practical implications / recommendations (make it explicit)
This section is where you translate trade-offs into guidance.
If a team prioritizes stable benchmarking results
Recommend models with low run-to-run variance and high overlap across runs.
If a team prioritizes cost-efficiency
Recommend models near the Pareto frontier (effectiveness vs cost per unique survived mutant).
If a team prioritizes bug-likeness
Recommend models that score best on RQ5 (syntactic + failure-match), even if they are not top on mutation score.
If CI runtime is the limiting factor
Recommend models with good effectiveness under acceptable wall-clock constraints.
(Keep these as conditional recommendations: “If you care about X, choose Y.”)

5.8 Summary of discussion (short)
Bullet list of 5–8 takeaways:
one for effectiveness,
one for stability,
one for cost,
one for reasoning vs non-reasoning,
one for bug resemblance,
one for limitations (“scope is JS/TS + 6 projects + time-conditional APIs”).

