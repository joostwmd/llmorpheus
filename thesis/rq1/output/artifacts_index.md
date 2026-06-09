# RQ1 publication artifacts

Use files in `publication/` in the main paper; use `appendix/` for supplementary material.

## Figures

| File | Placement | Description |
|------|-----------|-------------|
| `mutation_score_box.pdf` | publication | Mutation score distribution by model |
| `validity_stack.pdf` | publication | Candidate composition (valid / invalid / identical / duplicate) |
| `score_vs_survivors.pdf` | publication | Mutation score vs survivor count |
| `edit_distance_ridge.pdf` | appendix | Levenshtein edit distance distributions |
| `per_package_heatmap.pdf` | appendix | Mutation score heatmap (model × package) |
| `tokens_per_valid.pdf` | appendix | Token efficiency per valid mutant (log scale) |

## Tables

| File | Placement | Description |
|------|-----------|-------------|
| `volume_metrics.tex` | publication | Volume and quality metrics per model |
| `edit_distance.tex` | appendix | Edit distance with bootstrap confidence intervals |
| `per_package_breakdown.tex` | appendix | Median mutation score by package and model |

## Statistics

| File | Placement | Description |
|------|-----------|-------------|
| `pairwise.csv` | appendix | Pairwise Mann–Whitney tests on RQ1 metrics |
