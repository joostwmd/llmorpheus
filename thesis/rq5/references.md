# RQ5 — References for writing

> Curated from `thesis/references/processed/`. Primary = cite first for open-weight vs API-only framing, OpenRouter caveat, and deployment motivation.

## Primary sources (1)

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Manchanda, J., Westphalen, M., Boettcher, L., & Jasser, J. (2024). The open-source advantage in LLMs. *arXiv*. | `the-open-source-advantage` | **Lead deployment framing:** closed vs hybrid vs open paradigms; reproducibility, transparency, cost control *in principle*, local deployment option; motivates RQ5 question — not expected effect direction |

## Supporting sources (2)

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Liesenfeld, A., Lopez, A., & Dingemanse, M. (2023). Opening up ChatGPT. *ACL*. | `opening-up-chatgpt` | Openness is multidimensional (not binary); API lock-in risk; hybrid/partial openness |
| Ahmed, T., Bird, C., Devanbu, P., & Chakraborty, S. (2024). LLM performance on closed/open data. | `performance-closed-and-open-source` | **Nuance only:** open-weight ≠ OSS code domain; avoid category/training-data conflation |

## Cross-RQ / background only

- **Angermeir et al. (2026)** — OpenRouter caveat: all models API-served; pinned-version limits; model drift; time-conditional results — see `rq0/references.md`.
- **Siddiq et al. (2025)** — volatile APIs, Access/Legal smells; documentation/archiving standards — see `rq0/references.md`.
- **Wang, B., et al. (2025). Comprehensive LLM mutation** — prior open vs closed LLM mutation study (Java, different pipeline) — see `rq1/references.md`.
- **Sun et al. (2025). NFQC** — weak analogy: cross-model quality variance — see `rq4/references.md`.
- **RQ4** per-model euros and cost/non-equiv — required evidence for RQ5 cost significance; see `rq4/references.md`.
- **RQ2** Jaccard excluded from RQ5 — unequal rep counts; stability stays RQ2.
- Zhao, Fan — LLM landscape (`rq2/references.md`); Tip et al. — original mixed open/proprietary roster (`rq0/references.md`).

## Outline hooks for this RQ (claim → citation)

| Claim | Citation |
|-------|----------|
| "RQ5 compares deployment categories (open-weight vs API-only)" | Manchanda (2024) motivation; model registry |
| **"All models served via OpenRouter — token economics only"** | **Discussion §5.5 lead**; Angermeir (2026); Methodology |
| "Self-host TCO (GPU, ops) not modeled" | Outline §5.5; Manchanda discusses local deploy *option* but not our measured costs |
| "Category labels ≠ identical serving conditions" | Background Block 2; Angermeir; Siddiq |
| "Null on effectiveness/equiv; significant on cost" | **FINDINGS only** — Mann–Whitney, Cliff's δ |
| "~16× cheaper open-weight median (API pricing)" | **FINDINGS**; qualify as OpenRouter token rates |
| "GPT-4o-mini bridges categories on cost/non-equiv" | **FINDINGS** |
| "DeepSeek hybrid sensitivity" | **FINDINGS** Table RQ5-C |
| "Do not choose by category on mutation quality" | **FINDINGS** + optional Sun NFQC analogy |
| "Jaccard excluded from category comparison" | RQ2 spec; unequal multi-run reps |
| Operational factors: privacy, pinning, lock-in | Manchanda; Liesenfeld |

## Mandatory caveat block (paste-ready for §5.5)

> All models in this study—including open-weight SKUs—were accessed through the OpenRouter API. Category labels reflect practitioner deployment paradigms (self-hostable weights vs API-only vendors), not the serving path used here. Cost comparisons therefore reflect **API token economics** at a pinned pricing snapshot, not self-hosting total cost of ownership. See Manchanda et al. (2024) for why the distinction matters in principle; our evidence applies only to the API-served configuration.

## Gaps

- None critical for RQ5 prose.
- Self-host TCO benchmarks for Llama/Qwen at thesis-six workload — out of scope; future work.
