# RQ4 — References for writing

> Curated from `thesis/references/processed/`. Primary = cite first for token cost, waste composition, and quality-adjusted efficiency.

## Primary sources (1)

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Sun, X., Ståhl, D., Sandahl, K., & Kessler, C. (2025). Quality assurance of LLM-generated code. | `quality-assurance-of-llm-generated-code` | Optional analogy: NFQC variance across models; improvements in one dimension cost another; metered API evaluation |

## Cross-RQ / background only

- **Tip et al. (2025). LLMorpheus** — RQ6 cost precedent: prompt/completion tokens, runtime (Table 8), USD illustration; invalid/duplicate funnel (Table 2); "rates vary over time" caveat — see `rq0/references.md` and `rq1/references.md`.
- **Wang, B., et al. (2025). Comprehensive LLM mutation** — effectiveness–cost trade-off: +36.1 pp compilability waste, +13.1 pp duplicates; generation time; model-dependent DMR — see `rq1/references.md`.
- **Angermeir et al. (2026)** — pinned pricing snapshot justification; API rate/version drift — see `rq0/references.md`.
- **RQ3** predicted equivalence → cost/non-equiv denominators — see `rq3/references.md`.
- **RQ5** category cost comparison — see `rq5/references.md`; RQ4 supplies per-model euros, RQ5 aggregates by category.
- **Tier comparison (§4.6)** — thesis-specific supplementary; Tip/Wang for general waste/cost context only.
- Zhao, Fan — LLM landscape (`rq2/references.md`); not needed for RQ4 cost prose.

## Outline hooks for this RQ (claim → citation)

| Claim | Citation |
|-------|----------|
| "LLMorpheus cost measured via tokens + runtime" | Tip (2025) §4.8, RQ6 |
| "Invalid and duplicate candidates waste generation budget" | Tip Table 2 funnel; Wang compilability + duplicate rates |
| "Effectiveness gains can increase waste composition" | Wang abstract (+36.1 / +13.1 / +4.2 pp trade-off) |
| "Cheap per-token price ≠ cost-efficient mutant yield" | Thesis hypothesis; Sun (optional NFQC analogy); **FINDINGS** for Pareto |
| "Multi-objective trade-offs across models (weak analogy)" | Sun et al. (2025) NFQC | Discussion §5.4 optional — not LLMorpheus-specific |
| "Cost per non-equivalent survivor" | Thesis metric (RQ3 classifier required); no direct literature metric |
| "Pareto-efficient models on score vs cost/non-equiv" | **FINDINGS** + `model_cost_summary.csv`; label 2D exploratory |
| "Pinned OpenRouter pricing snapshot" | Angermeir (2026); Tip "rates vary" caveat |
| "Tier upgrade: premium SKU cost/non-equiv vs cheap" | **FINDINGS** §4.6; no literature baseline |
| All € totals, ranks, Wilcoxon tier tests | **FINDINGS only** |

## Gaps

- Pizzoleto et al. (2019) mutation cost reduction SLR — not in library; optional Background enrichment.
- No prior work defines standard **cost per non-equivalent survivor** for LLMorpheus — thesis contribution.
