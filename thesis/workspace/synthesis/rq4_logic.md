# RQ4 — Synthesis

## Answer to the RQ (1–2 sentences)

Cost spans two orders of magnitude across models on thesis-six. Per-token cheapness does not imply cost efficiency: invalid and duplicate mutants waste spend. **Cost per non-equivalent survivor** separates value leaders from premium models; Pareto analysis on mutation score vs cost/non-equiv identifies four efficient models on that 2D slice only.

## Evidence from our data

- Six-package run1 API cost: **$0.035** (Llama 3.1 8B) to **$8.93** (Claude Sonnet 4.5).
- Cost per non-equivalent survivor: **$0.00005–$0.020** — primary decision metric.
- **Four Pareto-efficient** models: Llama 8B, Llama 70B, GPT-4o-mini, Qwen 2.5 Coder 32B.
- Tier comparison: cheap API SKUs win nonEquivYield **3/3** provider pairs; marginal cost per extra non-equiv survivor when upgrading: $0.039–$0.058.
- Waste: Claude Haiku 32.2% invalid rate inflates cost despite moderate token price.
- RQ2 link: cost vs Jaccard ρ = 0.964 (p = 0.00045) — cheap models less stable.
- Source: `thesis/rq4/FINDINGS.md`, `model_cost_summary.csv`.

## What the literature says

**Tip et al. (2025) — direct cost precedent.** RQ6 assesses cost via running time and prompt/completion token counts (§4.8). Table 8 (codellama-34b, 13 packages): 5.84M prompt + 0.72M completion tokens; LLMorpheus wall-clock ~6.6 h vs Stryker ~7.1 h. USD illustration: full 13-package run ≈ $3.62; order-of-magnitude spread across models at fixed workload. Invalid/duplicate waste: Table 2 funnel — 29% invalid, identical and duplicate candidates filtered before Stryker. **Gap vs thesis:** Tip reports aggregate portfolio cost, not cost per non-equivalent survivor, Pareto frontier, or tier upgrade economics.

**Wang et al. (2025 comprehensive) — effectiveness–validity–efficiency trade-off.** LLM mutants achieve +37.5 pp higher real-bug detection vs rule-based, but pay +36.1 pp worse compilability, +13.1 pp duplicate rate, +4.2 pp equivalent rate. Model-dependent redundancy (GPT-4o 7.8% DMR vs PIT 0%; CodeLlama 37.1%). RQ3 efficiency: rule-based dominates wall-clock; LLM studies must add API token cost (not measured in Wang). Motivates **quality-adjusted cost** — this thesis operationalizes via LLMorpheus funnel + RQ3 classifier.

**Sun et al. (2025) NFQC — weak analogy.** Functionally correct LLM patches show high variance across quality dimensions; improving one degrades another. Per-instance API cost caps ($1) — precedent for metered spend. Three-model comparison spans closed and open families — cautious analogy: headline benchmark rank ≠ best value on secondary axes. **Do not** equate NFQC with mutation score.

**Angermeir et al. (2026) — pricing snapshot justification.** Commercial LLM studies face model version drift; reproduction runs cost up to $500/study. Supports pinned OpenRouter pricing snapshot (`.github/thesis-model-pricing.json`) and explicit temporal caveat.

## Tension / gap between ours and prior work

- Pareto frontier omits stability (RQ2) and equivalence precision (RQ3 classifier uncertainty in non-equiv denominator).
- No prior work defines a standard **cost per non-equivalent survivor** metric for LLMorpheus — thesis contribution.
- Wang comprehensive measures generation time but not token-dollar cost; Sun NFQC is a weak multi-objective analogy, not mutation-specific.
- All €/$ totals, Pareto counts, tier Wilcoxon p-values are **FINDINGS only** — literature supplies framing, not our numbers.
- OpenRouter pricing snapshot; open-weight models not self-hosted — cost findings are API token economics, not self-host TCO (RQ5).

## Suggested narrative for Writing (ordered bullets)

1. Methodology RQ4: Tip et al. (2025) for token logging precedent; pinned OpenRouter snapshot + Angermeir (2026) for pricing validity caveat.
2. Background cost model: Tip (RQ6 tokens + runtime); Wang comprehensive (effectiveness–validity trade-off).
3. Tie **cost/non-equiv** explicitly to RQ3 classifier — predicted equivalence in denominator; always say "predicted."
4. Discussion §5.4: Wang (invalid/duplicate waste); Tip (portfolio-level $/run illustration); **FINDINGS** for all € figures, Pareto counts, tier deltas.
5. Optional NFQC analogy (Sun): multi-dimensional model trade-offs — label as weak analogy; do not map NFQC dimensions to mutation score.
6. Tier upgrade (§4.6): thesis-specific supplementary; Tip/Wang for general waste/cost context only; cheap wins yield 3/3 from FINDINGS.
7. Cross-RQ: link cheap + unstable models (RQ2 Jaccard) to cost multiplication — ρ = 0.964 from FINDINGS; Pareto excludes stability by design — state as limitation.
