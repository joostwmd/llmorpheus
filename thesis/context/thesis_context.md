# Thesis context (shared by all agents)

Canonical domain context for the LLMorpheus modern-model evaluation thesis. **Do not** use `thesis/archive/outline.md` — it is outdated.

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
- **Config:** FULL prompt template, T=0, maxTokens=200, reasoning disabled (Gemini 3.x: minimal effort)
- **Runs:** `multi` policy → 5 reps (RQ2 stability); `single` policy → 1 rep (expensive API models)
- **Raw data:** `../artifacts/`, `../organized/` at repo root (gitignored)

## RQ dependencies

- RQ2 consumes multi-rep data (7 affordable models only for full stability analysis)
- RQ3 consumes surviving mutants from RQ1 + validated equivalence classifier
- RQ4 consumes RQ1–RQ3 counts + OpenRouter pricing snapshot
- RQ5 aggregates RQ1–RQ4 by category; **excludes** cross-run Jaccard from category comparison (unequal run counts)

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
