# RQ4 — Literature notes

## Sources consulted

| Slug | Citation | Sections read |
|------|----------|---------------|
| llmorpheus-paper-with-appendix-27mar2025 | Tip, F., Bell, J., & Schäfer, M. (2025). LLMorpheus. *IEEE TSE*. | §4.1 RQ6, §4.8 cost (Table 8), invalid/duplicate funnel (Table 2), model comparison |
| comprehensive-study-on-llms-for-mutation-test | Wang, B., et al. (2025). Comprehensive LLM mutation. *ACM TOSEM*. | Abstract; RQ2 validity (compilability, duplication); RQ3 efficiency (generation time); effectiveness–cost trade-off |
| quality-assurance-of-llm-generated-code | Sun, X., et al. (2025). NFQC. | Abstract; ISO/IEC 25010 framing; multi-model NFQC variance; per-instance cost limits in evaluation |
| reflections-on-the-reproducibility-of-commercial-llm-performance | Angermeir, F., et al. (2026). Commercial LLM repro. *ICSE*. | API pricing drift; pinned-model caveats; reproduction cost caps ($500/study) |

## Findings relevant to RQ4

### Tip et al. (2025) — direct precedent for token + runtime cost metrics

- **RQ6** explicitly asks cost of running LLMorpheus; cost is assessed via **running time** and **prompt/completion token counts** (§4.8).
- **Primary cost metric:** token usage; USD figures are secondary and time-varying (authors warn rates change).
- **Table 8 (codellama-34b-instruct, 13 packages):** aggregate **5.84M prompt + 0.72M completion tokens**; LLMorpheus wall-clock **23,891 s** (~6.6 h) vs Stryker **25,558 s** — generation and testing are comparable in runtime, not API-dominated in time alone.
- **USD illustration (snapshot pricing):** full 13-package run ≈ **$3.62** (codellama-34b via octo.ai); **<$1** with llama-3.3-70b-instruct and **≈$1.30** with gpt-4o-mini at cited OpenRouter/OpenAI rates — demonstrates **order-of-magnitude spread** across models at fixed workload.
- **Invalid/duplicate waste:** Table 2 funnel — of 9,967 candidates, **2,894 invalid (29%)**, **156 identical**, **205 duplicate** before testing; only **6,712** reach Stryker. Supports thesis quality-adjusted denominators (cost per valid, per unique).
- **Cheap ≠ premium on effectiveness alone:** gpt-4o-mini included as lower-cost proprietary option; llama-3.3-70b among highest mutant/survivor counts — aligns with hypothesis that per-token price does not determine value.
- **Gap vs this thesis:** Tip reports aggregate portfolio cost, not **cost per non-equivalent survivor**, Pareto frontier, or tier upgrade economics; uses 13 packages and 5-model roster (not 10-model matrix).

### Wang et al. (2025) comprehensive — effectiveness–validity–efficiency trade-off

- **Central cost finding:** LLM mutants achieve **+37.5 pp** higher real-bug detection vs rule-based, but pay **+36.1 pp** worse compilability, **+13.1 pp** duplicate rate, **+4.2 pp** equivalent rate (weighted averages) — effectiveness gains have measurable **waste composition**.
- **Duplicate mutations:** GPT-4o **7.8%** DMR vs PIT/Major **0%**; CodeLlama **37.1%** — model-dependent redundancy directly inflates generation spend without testing value.
- **Invalid/non-compilable:** GPT-4o **76.4%** compilability (23.6% waste) vs Major **97.6%** — supports RQ4 invalid-rate denominators; Java compile-check analog to JS parse-check.
- **RQ3 efficiency:** PIT **0.02 s**/mutant, Major **0.08 s**; best LLM GPT-4o **1.31 s**; open-weight StarChat/CodeLlama **7.5–9.1 s** — rule-based dominates wall-clock, but LLM studies must add **API token cost** (not measured in Wang).
- **Open vs closed in Wang:** six LLMs (3 closed GPT family, 3 open StarChat/CodeLlama/DeepSeek); **no token-dollar cost comparison** across categories — landscape context for RQ5, not RQ4 euro metrics.
- **Bridge to thesis:** Wang motivates **quality-adjusted cost** (pay for compilable, non-duplicate, non-equivalent mutants); this thesis operationalizes that via LLMorpheus funnel + RQ3 classifier.

### Sun et al. (2025) NFQC — weak analogy for multi-objective model selection

- **Core claim:** functionally correct LLM patches show **high variance** across NFQC dimensions (security, maintainability, runtime, memory); improving one dimension often **degrades another**.
- **Evaluation used per-instance API cost caps ($1)** — precedent for treating LLM work as **metered spend**, not compute-only.
- **Three-model comparison** (Claude Sonnet, DeepSeek-Reasoner, GPT-4o) spans closed and open families — supports cautious analogy: **headline benchmark rank ≠ best value on secondary axes**.
- **Use in RQ4 prose:** optional framing for Discussion §5.4 — "cheap model ≠ cost-efficient model" when denominators include waste and equivalence; **do not** equate NFQC with mutation score.

### Angermeir et al. (2026) — pricing snapshot justification (shared RQ0/RQ5)

- Commercial LLM studies face **model version drift** even with "pinned" APIs; reproduction runs cost up to **$500/study**.
- Supports thesis choice of **pinned OpenRouter pricing snapshot** (`.github/thesis-model-pricing.json`) and explicit temporal caveat in cost tables.

## Outline alignment

| Outline hook | Literature support |
|--------------|-------------------|
| Background Block 5 — "Cost model: token/API + compute" | Tip (tokens + runtime); Wang (generation time) |
| Background Block 6 — "RQ4 cost/Pareto extends Tip" | Tip RQ6 baseline; thesis adds equivalence-adjusted + Pareto |
| Discussion §5.4 — waste as hidden cost | Tip invalid/duplicate funnel; Wang compilability/duplicate rates |
| Discussion §5.4 — optimization target defines "best" | Sun NFQC trade-offs (analogy); Pareto is thesis-specific |
| Discussion §5.4 — tier upgrade supplementary | No direct literature; cite Tip/Wang for general cost context only |
| Discussion §5.4 — pinned pricing | Angermeir API drift; Tip "rates vary over time" |

## Gaps in our library

- **Pizzoleto et al. (2019)** mutation cost reduction SLR — would strengthen Background cost taxonomy paragraph.
- **Token-dollar benchmarks** for mutation testing beyond Tip/Wang — no standard metric for cost/non-equiv survivor in prior LLMorpheus literature.

## Suggested citations for Writing

- **Methodology RQ4:** Tip et al. (2025) for token logging precedent; pinned OpenRouter snapshot + Angermeir (2026) for pricing validity caveat.
- **Background (cost model):** Tip (RQ6); Wang comprehensive (effectiveness–validity trade-off).
- **Discussion §5.4:** Wang (invalid/duplicate waste); Tip (portfolio-level $/run illustration); **FINDINGS** for all € figures, Pareto counts, tier deltas.
- **Discussion §5.4 (optional analogy):** Sun et al. (2025) NFQC — multi-dimensional model trade-offs; label as weak analogy.
- **Do not cite literature for:** Pareto frontier model counts, tier Wilcoxon p-values, nonEquivYield — **FINDINGS only**.
