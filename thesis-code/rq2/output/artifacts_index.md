# RQ2 publication artifacts

Use files in `thesis/` in the main paper; use `appendix/` for supplementary material.

## Figures

| File | Placement | Description |
|------|-----------|-------------|
| `jaccard_box.pdf` | thesis | Jaccard overlap distribution across runs |
| `mutant_variability_stacked.pdf` | thesis | Mutant trial variability (stable / variable / unique) |
| `cv_grouped_bar.pdf` | appendix | Coefficient of variation for score, survivors, edit distance |
| `score_across_runs_line.pdf` | appendix | Mutation score drift across runs |
| `within_model_jaccard_heatmap.pdf` | appendix | Run-vs-run Jaccard overlap heatmaps |
| `forest_plot.pdf` | appendix | Mutation score forest plot with bootstrap CI |

## Tables

| File | Placement | Description |
|------|-----------|-------------|
| `consistency.tex` | thesis | Cross-run consistency metrics per model |
| `per_package_consistency.tex` | appendix | Per-package consistency breakdown |

## Statistics

| File | Placement | Description |
|------|-----------|-------------|
| `pairwise.csv` | appendix | Pairwise Mann–Whitney tests on consistency metrics |
| `bootstrap_ci.csv` | appendix | Bootstrap confidence intervals for RQ2 metrics |
