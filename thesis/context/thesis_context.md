# Thesis context (shared by all agents)

Canonical domain context for the LLMorpheus modern-model evaluation thesis.

**Outline:** `thesis/context/outline.md` (canonical chapter/RQ planning document).  
**Do not** use `thesis/archive/outline.md` — it is outdated.

## Study goal

Re-evaluate the LLMorpheus mutation-testing pipeline on **modern LLMs** under a fixed configuration. Compare effectiveness, stability, cost, equivalence rates, and open-weight vs API-only deployment — not prompt/temperature optimization.

**Scope exclusions:** No LLM-based test generation. Tests are the existing project test suites.

## Research questions

RQ number = folder name (`thesis/rq1/` … `thesis/rq5/`).

| RQ | Question | Primary outputs |
|----|----------|-----------------|
| RQ0 | Is the experimental pipeline ready? | `rq0/replication.md`; validated artifacts |
| RQ1 | How many mutants do models produce and what are they? | Volume, validity, mutation score, Levenshtein |
| RQ2 | How consistent are models across runs? | Jaccard overlap, SD of score/survivors/edit distance |
| RQ3 | How likely are models to generate equivalent mutants? | Predicted equivalence rate, effective survivors |
| RQ4 | What does LLMorpheus cost per model? | Tokens, €, cost per valid/survived/non-equiv mutant, Pareto |
| RQ5 | How do open-weight vs API-only models compare? | Category distributions on RQ1–RQ4 metrics |

Detail: `thesis/meta/rq_overview.md`. Per-RQ methodology: `thesis/rqX/spec.md`.

## Experimental setup

- **Packages:** 6 JavaScript packages (thesis-six subset; see `.github/thesis-six.json`)
- **Models:** 10 (see `thesis/meta/model_choices.md`, registry in `thesis/shared/modelRegistry.js`)
- **Categories:** `api-only`, `open-weight`, `hybrid` (DeepSeek)
- **Config:** FULL prompt template, T=0, maxTokens=250, reasoning disabled (Gemini 3.x: minimal effort). Authoritative value: `summary.json` → `metaInfo.maxTokens` (verified: 250 on all 228 datasets; matches Tip et al., 2025).
- **Runs:** `multi` policy → **5 reps** (7 affordable models; RQ2 uses all reps); `single` policy → **1 rep** (3 expensive models)
- **Raw data:** `../artifacts/`, `../organized/` at repo root (gitignored)

## Relation to Tip et al. (2025)

This study **extends** the LLMorpheus methodology to modern LLMs; it is **not** a replication of Tip et al. (2025). There is **no dedicated RQ6**. Directional comparison to the original paper is scoped to Discussion outline **§5.8** and baseline references in RQ1/RQ3 — cited for context, not as a replication target.

### Setup alignment vs divergence

| Factor | Tip et al. (2025) | This study | Impact |
|--------|-------------------|------------|--------|
| maxTokens | 250 | **250** (artifact metadata) | Aligned — not a confound |
| Packages | 13 | 6 (thesis-six subset) | **Main confound** for aggregate scores |
| Models | 5 (CodeLlama-34B primary) | 10 modern; **2 overlap** (`gpt-4o-mini`, `llama-3.3-70b-instruct`) | CodeLlama-34B unavailable (OpenRouter 404) |
| Equivalence | Manual labeling (20.2% among survivors) | UniXCoder classifier (θ = 0.80) | Directional comparison only |
| Provider | Mixed | OpenRouter only | Serving / routing difference |

### Key directional findings (for agents and drafting)

1. **Do not compare** paper 13-package aggregates (~53–56% mutation score) to thesis 6-package medians (~74–89%) without explaining that excluded packages (notably `q`) and other corpus differences depress the paper aggregate.
2. **Fairer comparison:** on the **six shared packages**, paper CodeLlama-34B median mutation score ≈ **76%** vs modern models **74–89%** — a modest shift, not a ~30 percentage-point jump.
3. **Overlapping models** (`gpt-4o-mini`, `llama-3.3-70b-instruct`): per-package score changes are modest (±7pp); instability at T = 0 persists (Jaccard ~0.50–0.57 in RQ2).
4. **Models not in the paper:** Qwen 2.5 Coder 32B (best mutation score, 88.5%); Claude Haiku 4.5 (best stability, Jaccard ~0.99); Llama 3.1 8B (best cost efficiency).
5. **Equivalence:** predicted rates **17–24%** vs paper **20.2%** manual — aligned directionally; automated vs manual labels limit strict comparison.
6. **Two metrics, two goals:** high **mutation score** assesses test-suite strength (more mutants killed); **effective survivors** (RQ3) signal gap-finding potential — fewer raw survivors does not automatically mean better for test improvement.

### Artifact pointers

- **Paper:** Tip et al. Table 2 (per-package scores), Table 7 (model totals), Table 4 (equivalence); raw data in `neu-se/mutation-testing-data`.
- **Thesis:** `thesis/rq1/output/publication/model_summary.csv`; per-model appendix CSVs for overlapping baselines; RQ3 `llm_summary.csv` for equivalence rates.

## RQ dependencies

- RQ2 consumes multi-rep data (7 affordable models only for full stability analysis)
- RQ3 consumes surviving mutants from RQ1 + validated equivalence classifier
- RQ4 consumes RQ1–RQ3 counts + OpenRouter pricing snapshot
- RQ5 aggregates RQ1–RQ4 by category; **excludes** cross-run Jaccard from category comparison (unequal run counts)

### RQ5 split verdict (locked FINDINGS)

- **Null on effectiveness/equivalence:** Mann–Whitney finds no significant category differences on mutation score (p = 0.633), survivors (p = 0.993), or predicted equivalence (p = 0.861); |Cliff's δ| ≤ 0.08.
- **Significant on cost:** Cost per survivor (p ≈ 2.75×10⁻⁵) and cost per non-equiv survivor (p ≈ 3.51×10⁻⁵); open-weight ~16× cheaper at the median (δ ≈ −0.70).
- **OpenRouter caveat:** All models API-served; cost findings are token economics, not self-host TCO. See outline §5.5.

## Literature / writing gate

Before drafting Background, Methodology, or Discussion:

1. Load `thesis/rqX/references.md` for the relevant RQ + `thesis/workspace/critique/outline_literature_review.md`.
2. Use `thesis/workspace/synthesis/rqX_logic.md` for narrative hooks.
3. **Do not cite literature for empirical numbers** — all headline stats from `thesis/rqX/FINDINGS.md` only.
4. Discussion §5.2: cite Yuan/Song/Tip as **plausible** mechanisms; do not claim causal proof in our OpenRouter setup.
5. Discussion §5.5: lead with OpenRouter serving caveat before category cost findings.
6. **No GEPA** or python-classifier references.
7. Harmonize Angermeir et al. to **(2026)** in prose.

## Output conventions

Per RQ: `thesis/rqX/output/publication/` (main paper) and `thesis/rqX/output/appendix/` (supplementary). See `artifacts_index.md` in each RQ output folder.

Central figures/tables: `thesis/output/figures/`, `thesis/output/tables/`, `thesis/output/stats/`.

## Chapter map (draft targets)

| Chapter | Content | RQs |
|---------|---------|-----|
| Introduction | Motivation, problem, contributions | — |
| Background | Mutation testing, LLMorpheus, related work | — |
| Methodology | Setup, models, metrics, classifier | RQ0 |
| Results | Empirical findings | RQ1–RQ5 |
| Discussion | Interpretation, threats, practitioner guidance | all |
| Conclusion | Summary, future work | all |

Draft files: `thesis/draft/` (see `thesis/draft/README.md`).

## Agent handoffs

- Literature → `thesis/workspace/literature/rqX_notes.md`
- Data → `thesis/workspace/analysis/rqX_summary.md`
- Synthesis → `thesis/workspace/synthesis/rqX_logic.md`
- Critique → `thesis/workspace/critique/`
- Writing → `thesis/draft/`

Agent definitions: `.cursor/agents/` (not in `thesis/`).
