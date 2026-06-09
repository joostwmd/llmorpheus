# Thesis analysis code

Node.js pipelines for thesis research questions (RQ1–RQ5). RQ3 uses the Python equivalent-mutant classifier under `rq3/equivalent-mutants/`.

The thesis evaluates **10 models** (see `thesis/Model_Choices.md`); deprecated variants are excluded from CI and analysis. Per-model run policy and analysis status are defined in `shared/modelRegistry.js` (`ready | pending | failed`).

## Setup

```bash
cd thesis-code
npm install
pip install -r requirements.txt
```

Ensure `artifacts/` exists at the repo root (downloaded CI artifacts) and Python dependencies for RQ3 are installed:

```bash
pip install -r rq3/equivalent-mutants/classify/requirements.txt
pip install -r rq3/equivalent-mutants/analyze/requirements.txt
```

LaTeX preamble should include:

```latex
\usepackage{booktabs, siunitx, xcolor, colortbl}
```

## Run everything (real artifact reps)

```bash
npm run all
```

Or:

```bash
node run-all.js
```

Pipelines use **real reps** from `artifacts/` by default. RQ1/RQ3/RQ4/RQ5 use **run1** for all ready models; RQ2 uses **all reps** for affordable (`multi`) models only. Set `status: "pending"` in `shared/modelRegistry.js` to skip models until reruns complete.

## Run individual RQs

```bash
npm run rq1
npm run rq2
npm run rq3
npm run rq4
npm run rq5
```

Regenerate figures/tables only (after CSVs exist):

```bash
npm run rq1:plots
npm run rq2:plots
npm run rq4:plots
npm run rq5:plots
npm run plots:all
```

## Output layout

Each RQ clears and repopulates `rqX/output/` on every run:

- `thesis/` — main-paper artifacts (aggregated CSVs, key figures, tables)
- `appendix/` — supplementary artifacts (per-run CSVs, supporting figures, stats)
- `artifacts_index.md` — figure/table placement guide (thesis vs appendix)

Publication figures, LaTeX tables, and statistical test results are generated centrally under `thesis-code/output/`, then copied into per-RQ `thesis/` or `appendix/` according to `shared/outputManifest.js`:

```
output/
  figures/        # PDF figures (canonical build output)
  figures-png/    # PNG previews
  tables/         # booktabs .tex tables
  stats/          # statistical test CSVs
  data/           # canonical appendix CSV copies (optional)

rqX/output/
  thesis/         # include in main paper
  appendix/       # include in appendix
  artifacts_index.md
```

### Figures (PDF + PNG)

| File | RQ | Description |
|------|----|-------------|
| `rq1_mutation_score_box` | RQ1 | Mutation score distribution by model |
| `rq1_validity_stack` | RQ1 | Candidate composition (valid/invalid/identical/duplicate) |
| `rq1_edit_distance_ridge` | RQ1 | Levenshtein edit distance distributions |
| `rq1_score_vs_survivors` | RQ1 | Mutation score vs survivors |
| `rq1_per_package_heatmap` | RQ1 | Mutation score heatmap (model × package) |
| `rq1_tokens_per_valid` | RQ1 | Token efficiency (log scale) |
| `rq2_jaccard_box` | RQ2 | Jaccard overlap distribution |
| `rq2_cv_grouped_bar` | RQ2 | CV of score/survivors/edit distance |
| `rq2_score_across_runs_line` | RQ2 | Score drift across runs |
| `rq2_within_model_jaccard_heatmap` | RQ2 | Run-vs-run Jaccard heatmaps |
| `rq2_mutant_variability_stacked` | RQ2 | Mutant trial variability (stable / variable / unique) |
| `rq2_forest_plot` | RQ2 | Mutation score forest plot with bootstrap CI |
| `rq3_llm_comparison_boxplot` | RQ3 | Equivalent mutant rate boxplot |
| `rq3_llm_package_heatmap` | RQ3 | Equivalence rate heatmap |
| `rq3_llm_means_errorbar` | RQ3 | Mean equivalence with error bars |
| `rq3_package_complexity_scatter` | RQ3 | Package size vs equivalence |
| `rq3_effective_survivors` | RQ3 | Equivalent vs behavioral-change survivors |
| `rq3_score_vs_equiv_rate` | RQ3 | Mutation score vs equivalence rate |
| `rq4_cost_per_nonequiv_bar` | RQ4 | Cost per non-equivalent survivor (log) |
| `rq4_pareto_frontier` | RQ4 | Pareto frontier (cost vs score) |
| `rq4_cost_composition` | RQ4 | Input vs output token cost |
| `rq4_cost_vs_jaccard` | RQ4 | Cost vs consistency |
| `rq5_category_violins` | RQ5 | Category comparison violins |
| `rq5_effect_size_forest` | RQ5 | Cliff's delta forest plot |

### Thesis vs appendix placement

See `rqX/output/artifacts_index.md` after each run, or edit `shared/outputManifest.js` to change placement. By default:

| RQ | Main paper (`thesis/`) | Appendix (`appendix/`) |
|----|------------------------|-------------------------|
| RQ1 | mutation score, validity, score vs survivors | edit distance, package heatmap, token efficiency |
| RQ2 | Jaccard box, mutant variability | CV bars, run drift, Jaccard heatmap, forest plot |
| RQ3 | equiv rate boxplot, means errorbar, effective survivors | package heatmap, complexity scatter, score vs equiv |
| RQ4 | Pareto frontier, cost per non-equiv survivor | cost composition, cost vs Jaccard |
| RQ5 | category violins, effect-size forest (all figures) | detailed category test CSV |

### LaTeX tables

| File | RQ |
|------|-----|
| `rq1_volume_metrics.tex` | RQ1 |
| `rq1_edit_distance.tex` | RQ1 |
| `rq1_per_package_breakdown.tex` | RQ1 |
| `rq2_consistency.tex` | RQ2 |
| `rq2_per_package_consistency.tex` | RQ2 |
| `rq3_main_results.tex` | RQ3 |
| `rq3_statistical_tests.tex` | RQ3 |
| `rq4_cost.tex` | RQ4 |
| `rq4_pareto.tex` | RQ4 |
| `rq5_category_summary.tex` | RQ5 |
| `rq5_pairwise_effect.tex` | RQ5 |

## Dev-only: simulated runs

For local pipeline testing without full multi-rep data, pass `--simulate-runs N` (N > 1). This duplicates run1 in `organized/` and RQ2 only. Production analysis should use real reps (`--simulate-runs 1`, the default).

## Model registry

Edit `shared/modelRegistry.js` (mirrored in `shared/model_registry.json` for Python):

- `runPolicy`: `"single"` (3 expensive models) or `"multi"` (7 affordable, 5 reps)
- `status`: `"ready"` (include in analysis), `"pending"` (rerun in progress), `"failed"` (exclude)

## Architecture

JS pipelines extract metrics and write CSVs. Python scripts (`rqX/plots/generate_*.py`) consume those CSVs and emit figures (matplotlib/seaborn), booktabs tables, and statistical test results. Shared styling lives in `shared/plot_style.py`.
