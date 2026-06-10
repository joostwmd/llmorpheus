# RQ5 — Synthesis

## Answer to the RQ (1–2 sentences)

Open-weight vs API-only is a **weak grouping for LLMorpheus effectiveness outcomes** but a **strong grouping for cost**. Mann–Whitney tests find no significant category differences on mutation score, survivors, or predicted equivalence (|δ| ≤ 0.08); cost per survivor and cost/non-equiv differ significantly (~16× median, Cliff's δ ≈ −0.70). All models were served via OpenRouter — cost findings reflect API token economics, not self-host TCO.

## Evidence from our data

- **Split verdict:** null on mutation score (p = 0.633), survivors (p = 0.993), equivalence rate (p = 0.861); **significant** on cost per survivor (p = 2.75×10⁻⁵) and cost/non-equiv (p = 3.51×10⁻⁵), Cliff's δ ≈ −0.70.
- Medians: open-weight $0.00034/survivor vs API-only $0.00546 (~16×); GPT-4o-mini ($0.00051/non-equiv) bridges categories.
- Hybrid sensitivity: reclassifying or excluding DeepSeek does not overturn the split verdict.
- Individual model effects dominate category: Qwen (open-weight) leads on score; Claude Haiku (API-only) trails on validity; Llama models least stable (RQ2).
- Jaccard/stability excluded from RQ5 (unequal rep counts across categories).
- Source: `thesis/rq5/FINDINGS.md`, `category_summary.csv`, `rq5_category_tests.csv`.

## What the literature says

**Deployment framing (Manchanda et al., 2024).** Three paradigms: closed-source (API-mediated), hybrid (selective disclosure), open-source (weights public). Closed-source: SOTA benchmarks and SLAs but restricted reproducibility and version pinning. Open-source: reproducibility, transparency, computational accessibility in principle; enables local deployment and domain adaptation. **Critical caveat:** Manchanda discusses self-hosting as an open-weight option; this study serves all models via **OpenRouter API** — cite for deployment *paradigm*, not measured self-host savings.

**API-serving and reproducibility (Angermeir et al.; Siddiq et al.).** Angermeir: 0/5 OpenAI artefact studies fully reproduced; commercial models update without transparent changelog; API runs cost up to $500/study. Siddiq: 640 LLM-for-SE papers — persistent Model and Access/Legal smells; volatile endpoints. Supports Discussion §5.5 lead: all thesis models (including open-weight Llama/Qwen) accessed via same API broker → category labels reflect license paradigm, not identical serving conditions.

**Openness is multidimensional (Liesenfeld et al., 2023).** 13-feature openness scale; API discontinuation risk (Codex dropped with 3 days' notice). Nuances hybrid DeepSeek classification (open weights, API access in this study).

**Landscape comparator (Wang et al., 2025 comprehensive).** Compares 3 closed vs 3 open LLMs on Java mutation — effectiveness/validity, not deployment cost or LLMorpheus. Individual model effects, not clean category verdict. Notes Tip concurrent JS work with three open-source LLMs only — this thesis extends to 10-model matrix + category synthesis.

**Tangential disambiguation (Ahmed et al., 2024).** Open-weight category ≠ open-source *code* domain — Codex trained on OSS; performance differs on proprietary vs OSS. One sentence only.

**Weak analogy (Sun et al., 2025 NFQC).** Claude, DeepSeek, GPT-4o differ on quality dimensions — model identity matters more than license label. Do not map NFQC to mutation outcomes.

## Tension / gap between ours and prior work

- Literature (Manchanda) motivates cost/transparency differences but **does not predict** null effectiveness tests — our data reject category-as-quality-proxy while confirming category-as-price-proxy.
- All models API-served via OpenRouter — cannot claim self-hosting cost savings or identical serving conditions.
- Wang comprehensive compared open/closed on Java with different pipeline — complementary landscape, not competing numeric benchmark.
- Hybrid DeepSeek sensitivity (highest equiv. rate at 20.0%) does not flip verdict when reclassified.
- No infrastructure TCO studies for self-hosted Llama/Qwen at thesis-six scale — future work, not in library.

## Suggested narrative for Writing (ordered bullets)

1. **Discussion §5.5 lead:** OpenRouter/token-economics caveat upfront — all models including open-weight SKUs accessed via OpenRouter; category labels = practitioner deployment paradigms, not serving path used here.
2. Split verdict from **FINDINGS**: null effectiveness/equiv; significant cost (~16× median, δ ≈ −0.70) — qualify as OpenRouter token rates, not self-host TCO.
3. Background Block 2: Manchanda (closed/hybrid/open paradigms); Liesenfeld optional (openness gradations); model registry labels.
4. Motivation: Manchanda for why practitioners compare categories (pinning, privacy, cost control *in principle*); Angermeir/Siddiq for why API-served results need temporal caveat.
5. GPT-4o-mini bridges categories on cost/non-equiv — category label alone misleads for budget decisions.
6. DeepSeek hybrid sensitivity: report Table RQ5-C; reclassification does not overturn verdict.
7. Do **not** claim: self-hosting savings, category predicts mutation quality, or identical serving — not supported by data or design.
8. Ahmed closed/open data: one-sentence disambiguation — open-weight ≠ OSS code domain.
9. Cross-RQ: RQ4 supplies per-model euros; RQ2 Jaccard excluded from category comparison (unequal reps); operational factors (privacy, pinning, lock-in) from Manchanda + Liesenfeld.
