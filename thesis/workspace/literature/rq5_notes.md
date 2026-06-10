# RQ5 — Literature notes

## Sources consulted

| Slug | Citation | Sections read |
|------|----------|---------------|
| the-open-source-advantage | Manchanda, J., et al. (2024). Open-source advantage in LLMs. *arXiv*. | §2 paradigms (closed/hybrid/open); §3–6 innovation, performance, reproducibility, transparency; deployment framing |
| performance-closed-and-open-source | Ahmed, T., et al. (2024). LLM performance on closed/open data. | OSS vs proprietary code performance; Codex trained on OSS |
| opening-up-chatgpt | Liesenfeld, A., et al. (2023). Opening up ChatGPT. *ACL*. | Multidimensional openness spectrum; API access vs true transparency |
| quality-assurance-of-llm-generated-code | Sun, X., et al. (2025). NFQC. | Cross-model quality variance (closed + open models) |
| reflections-on-the-reproducibility-of-commercial-llm-performance | Angermeir, F., et al. (2026). Commercial LLM repro. *ICSE*. | API-only access; model drift; pinned-version limits |
| llms-in-se-a-reproducibility-crisis | Siddiq, M. L., et al. (2025). LLM-SE reproducibility crisis. | 640-paper audit; Access/Legal + Model smells; volatile APIs |
| comprehensive-study-on-llms-for-mutation-test | Wang, B., et al. (2025). Comprehensive LLM mutation. *ACM TOSEM*. | Prior open vs closed LLM mutation comparison (Java); no deployment-category cost |

## Findings relevant to RQ5

### Manchanda et al. (2024) — primary deployment-framing source

- **Three paradigms:** closed-source (API-mediated, proprietary weights), **hybrid** (selective disclosure — e.g., gpt-oss tiers), open-source (weights + docs public).
- **Closed-source trade-offs:** state-of-the-art benchmarks, enterprise SLA, proprietary datasets — but **restricted reproducibility, external oversight, and version pinning**; access via APIs only.
- **Open-source advantages argued:** reproducibility, transparency, **computational accessibility** (LoRA, distillation, MoE efficiency), community contribution; enables **local deployment and domain adaptation** in principle.
- **Economic framing:** open-source reduces hardware demands via efficient architectures; closed-source leverages **proprietary monetization** — but open-source sustainability requires federated funding (not self-host TCO analysis).
- **Relevance to RQ5:** frames the **practitioner question** (why compare open-weight vs API-only) — **motivation only**; does not predict mutation-score or equivalence outcomes.
- **Critical caveat for thesis:** Manchanda discusses **self-hosting as an open-weight option**; this study serves all models via **OpenRouter API** → cite Manchanda for deployment *paradigm*, not for measured self-host savings.

### Angermeir et al. (2026) + Siddiq et al. (2025) — API-serving and reproducibility caveats

- **Angermeir:** 18 ICSE/ASE 2024 LLM studies with artefacts — **0/5 fully reproduced**; commercial models update without transparent changelog; "pinned" models promised stable outputs but reproduction still diverges; API runs cost **up to $500/study**.
- **Siddiq:** 640 LLM-for-SE papers — persistent **Model** and **Access and Legal** reproducibility smells; closed-source APIs, volatile endpoints, non-standardized prompts.
- **Supports Discussion §5.5 lead:** all thesis models (including open-weight Llama/Qwen) accessed via **same API broker** → category labels reflect **license/deployment paradigm**, not identical serving conditions; results are **time- and provider-conditional**.

### Liesenfeld et al. (2023) — openness is not binary

- **13-feature openness scale** (code, weights, RLHF data, license, documentation, API access) — many "open" projects are partially open.
- **API discontinuation risk:** OpenAI dropped Codex API with 3 days' notice — reproducibility and lock-in concerns for API-only workflows.
- **Use:** nuance Background Block 2 — "open-weight" ≠ full transparency; aligns with DeepSeek **hybrid** classification (open weights, API access in this study).

### Ahmed et al. (2024) closed/open *data* — tangential disambiguation

- Codex-style models trained predominantly on **OSS code**; performance can differ on proprietary vs OSS domains (C++ gap larger than C#).
- **Use sparingly:** "open-weight" category ≠ "open-source **code** domain" — avoid conflating license category with training-data provenance.

### Wang et al. (2025) comprehensive — landscape comparator (different pipeline)

- Compares **3 closed-source** (GPT-3.5, GPT-4o, GPT-4o-mini) vs **3 open-source** (StarChat, CodeLlama, DeepSeek) on Java mutation — **effectiveness/validity**, not deployment cost or LLMorpheus.
- GPT-4o-mini among top fault-detection; open CodeLlama weaker on detection — **individual model effects**, not clean category verdict.
- Explicitly notes Tip et al. concurrent JS work with **three open-source LLMs only** — this thesis extends to 10-model matrix + category synthesis.

### Sun et al. (2025) NFQC — weak cross-model variance analogy

- Claude, DeepSeek, GPT-4o differ on NFQC improvement potential — **model identity** matters more than license label for quality dimensions.
- Optional support for "do not choose by category alone" — **do not** map NFQC to mutation outcomes.

### Empirical RQ5 verdict (FINDINGS — not literature)

- **Split verdict:** Mann–Whitney **null** on mutation score, survivors, equivalence (|δ| ≤ 0.08); **significant** on cost per survivor and cost/non-equiv (~16× median, δ ≈ −0.70).
- Literature (Manchanda) motivates cost/transparency differences but **does not predict** null effectiveness tests.
- **GPT-4o-mini** bridges categories on cost/non-equiv — category label alone misleads.
- **DeepSeek hybrid** sensitivity does not flip verdict (Table RQ5-C).

## OpenRouter caveat (mandatory framing)

Per outline Background Block 2, Methodology, and Discussion §5.5:

1. **All 10 models** — including Llama 3.3 70B, Llama 3.1 8B, Qwen Coder 32B — were queried through **OpenRouter API**.
2. Category labels (`open-weight`, `api-only`, `hybrid`) capture **practitioner deployment options** (self-host vs vendor API vs both), **not** the serving path used in experiments.
3. **Cost findings = token economics** at pinned OpenRouter rates — **not** self-host TCO (GPU capex/opex, ops, cooling, quantization).
4. Cite **Manchanda** for why practitioners care about open-weight (pinning, privacy, cost control *in principle*); cite **Angermeir** for why API-served results need temporal caveat.

## Outline alignment

| Outline hook | Literature support |
|--------------|-------------------|
| Background Block 2 — open-weight vs API-only categories | Manchanda paradigms; Liesenfeld openness spectrum |
| Background Block 2 — OpenRouter serving caveat | Angermeir; Siddiq; thesis Methodology |
| Background Block 6 — RQ5 deployment categories | Manchanda motivation; Wang landscape |
| Discussion §5.5 — split verdict | **FINDINGS**; Manchanda for motivation only |
| Discussion §5.5 — operational factors (privacy, pinning) | Manchanda transparency/reproducibility; Liesenfeld API lock-in |
| Discussion §5.6 — external validity OpenRouter | Angermeir; Siddiq |

## Gaps in our library

- None critical for RQ5 prose.
- **Infrastructure TCO studies** for self-hosted Llama/Qwen at thesis-six scale — would be future work, not in library.

## Suggested citations for Writing

- **Background Block 2 / RQ5 intro:** Manchanda et al. (2024) — deployment paradigm trade-offs; Liesenfeld et al. (2023) optional — openness gradations.
- **Methodology — model categories:** Manchanda (closed/hybrid/open); registry labels; **OpenRouter caveat** upfront.
- **Discussion §5.5 (order):** (1) OpenRouter/token-economics caveat, (2) split verdict **FINDINGS**, (3) Manchanda motivation, (4) Angermeir/Siddiq reproducibility, (5) Wang landscape context.
- **Do not claim:** self-hosting cost savings, category predicts mutation quality, or identical serving — **not supported** by data or study design.
- **Ahmed closed/open data:** one sentence disambiguation only — open-weight ≠ OSS code domain.
