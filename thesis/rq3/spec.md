# Research Question 3: Equivalent Mutant Analysis

## Overview

**Research Question:** How likely are different models to generate equivalent mutants?

**Hypothesis:** Equivalence rates differ across models; models with high survivor counts may be inflated by equivalents; effective survivors (predicted behavioral change) is more informative than raw survival count.

## Study matrix (canonical)

**Registry:** `thesis/shared/modelRegistry.js` · **Detail:** `thesis/meta/model_choices.md`

| Scope | Models | Runs used |
|-------|--------|-----------|
| **All models** | 10 (same matrix as RQ1) | **run1 only** |

See RQ1 spec for the full 10-model table.  
**Datasets (RQ3):** surviving mutants from 10 models × 6 packages × run1  
**Outputs:** `thesis/rq3/output/publication/` (see `artifacts_index.md`)

**Classifier:** UniXCoder ensemble, θ = 0.80 for pipeline application (θ ≈ 0.94 for OOF model selection)

## Background and Motivation

Equivalent mutants are a significant challenge in mutation testing — they are syntactically different from the original program but semantically identical (produce the same output for all possible inputs). These mutants:

- **Cannot be killed** by any test case, regardless of test suite quality
- **Inflate mutation scores** artificially by increasing the denominator without contributing meaningful test targets
- **Waste computational resources** during test execution
- **Complicate mutation score interpretation** for developers

In the context of LLM-generated mutants, equivalent mutant rates become a critical quality metric. A model that generates many equivalent mutants produces less valuable mutations for testing purposes, even if it generates a high total volume of mutants.

## Research Design

### Comparison to Original LLMorpheus Study

This analysis extends the original LLMorpheus paper's RQ2, which found a **20.2% equivalent mutant rate** among surviving mutants using manual labeling. Our automated approach:

- Uses the same **surviving-mutants-only** denominator for direct comparability
- Applies a trained UniXCoder classifier instead of manual annotation
- Covers **10 models** across **6 JavaScript packages** (thesis-six)
- Provides confidence intervals and statistical testing between models
- Paper 20.2% rate is a **directional reference only** (different corpus, manual labels)

### Input Data

**Source:** `organized/` / `artifacts/` — surviving mutants from RQ1 (**run1**)
- **10 models** (see Study matrix)
- **6 JavaScript packages:** thesis-six subset
- **60 datasets:** 10 models × 6 packages × run1

**Raw data per package:**
- `mutants.json` — All LLM-generated mutants with metadata (original code, replacement, location, prompt/completion IDs)
- `mutation.html` — Stryker mutation testing results with pass/fail/timeout/survived status per mutant
- `StrykerInfo.json` — Aggregate statistics (total tested, killed, survived, timeout counts)

**Filtering:** Only mutants with `status == "Survived"` in Stryker reports are included in the analysis, consistent with the original paper's methodology.

### Methodology

#### 1. Data Preprocessing (`equivalent-mutants/classify/`)

**Survivor Extraction:**
- Parse Stryker HTML reports using Node.js to extract embedded JavaScript object literals
- Match surviving mutants to `mutants.json` entries by location and replacement text
- Handle mismatches between LLM output and Stryker's reformatted code through fuzzy matching
- Convert to classifier-compatible CSV format with columns: project, file, line, column, original, replacement

**Key Challenge - Index Alignment:**
For most packages, `mutants.json` and Stryker results have identical lengths and ordering, enabling simple index-based matching. However, for `spacl-core` packages, some LLM-generated mutants fail Stryker's parsing phase (typically regex syntax issues), requiring location-based matching with normalization of whitespace and parentheses.

#### 2. Automated Classification (`equivalent-mutants/classify/`)

**Model:** UniXCoder ensemble `ensemble-20260517-130830Z-window-w0-ep18-k5-s3-isplitdiff-pclsmm-focal2-bs-ck-tfeq-ls5-eqw175-ml512-bs8-lr2e-4-equiv-push-v1`

**Performance Characteristics:**
- **Macro-F1:** ~0.797 on labeled validation set
- **Asymmetric reliability:** When predicting `BEHAVIORAL_CHANGE`, precision ~99% (very few false behavioral predictions)
- **Equivalent precision:** ~78% at threshold θ=0.8 (more conservative on equivalent calls)
- **Threshold:** θ=0.8 chosen to balance precision/recall based on validation performance

**Classification Process:**
- Input: (original_code, replacement_code) pairs from surviving mutants
- Output: Binary prediction (EQUIVALENT vs BEHAVIORAL_CHANGE) with confidence scores
- Batch processing: all surviving mutants across 60 datasets (count in `aggregated_results.csv`)

#### 3. Statistical Analysis (`equivalent-mutants/analyze/`)

**Metrics Computed:**
- **Equivalent rate per dataset:** `predicted_equivalent / total_surviving * 100%`  
- **LLM-level aggregation:** Mean ± standard deviation across packages
- **Weighted equivalent rate:** Total equivalent predictions / total surviving mutants (accounts for different package sizes)
- **Bootstrap confidence intervals:** 95% CI around weighted rates
- **Ranking:** LLMs ordered by weighted equivalent rate (ascending = better)

**Statistical Tests:**
- **Pairwise t-tests** between LLMs for significance testing
- **Cohen's d** for effect size measurement
- **Coefficient of variation** to assess consistency across packages

### Output Data and Results

#### Primary Results Table

Published values: `thesis/rq3/output/publication/main_results.tex`, `aggregated_results.csv`

| LLM | Weighted equiv rate | Rank |
|-----|---------------------|------|
| (10 models) | see publication outputs | … |

**Paper reference (directional):** 20.2% manual equivalent rate among survivors (Tip et al., 2025) — not a replication target.

#### Key findings (interpretation)

1. Equivalence rates vary across the 10-model matrix
2. Effective survivors (predicted behavioral change) should be preferred over raw survivor counts
3. Classifier labels are **predicted**, not ground-truth equivalence
4. Comparison to paper 20.2% is directional only (6 vs 13 packages, different models, automated vs manual)

#### Generated Artifacts

**Tables (LaTeX):**
- `main_results_table.tex` — LLM comparison with statistics
- `package_breakdown_table.tex` — Per-package equivalent rates
- `statistical_tests_table.tex` — Pairwise significance tests

**Visualizations:**
- `llm_comparison_boxplot.png` — Distribution of rates across packages per LLM
- `llm_package_heatmap.png` — Package-specific equivalent rates by LLM
- `llm_means_errorbar.png` — Mean rates with confidence intervals
- `package_complexity_scatter.png` — Relationship between package size and equivalent rates

**Data Files:**
- `aggregated_results.csv` — Raw per-dataset results
- `llm_summary.csv` — LLM-level statistics  
- `package_summary.csv` — Package-level statistics
- `pairwise_llm_tests.csv` — Statistical test results
- `statistical_summary.json` — Overall analysis metadata

## Technical Pipeline

### Architecture

```
equivalent-mutants/
├── classify/                    # UniXCoder classification pipeline
│   ├── convert_mutants.py      # JSON → CSV conversion with survivor filtering  
│   ├── run_classifier.py       # Batch UniXCoder inference
│   ├── data/                   # Converted mutant CSVs  
│   ├── results/                # Classification predictions
│   └── runs/                   # Model checkpoints
├── analyze/                    # Statistical analysis and visualization
│   ├── analyze_results.py      # Aggregate predictions into datasets
│   ├── statistical_tests.py    # Bootstrap CIs, t-tests, effect sizes
│   ├── generate_tables.py      # LaTeX table generation
│   ├── generate_plots.py       # Matplotlib/seaborn visualizations
│   ├── run_complete_analysis.py # Master pipeline orchestrator
│   └── output/                 # Final results and artifacts
└── lib/                        # Shared utilities
    ├── config.py               # Configuration and path resolution
    ├── discovery.py            # Dataset enumeration from organized/
    └── stryker_report.py       # HTML report parsing and survivor matching
```

### Execution

```bash
# Complete pipeline
python equivalent-mutants/analyze/run_complete_analysis.py --source organized --threshold 0.8

# Individual steps
python equivalent-mutants/classify/convert_mutants.py --source organized
python equivalent-mutants/classify/run_classifier.py --source organized --threshold 0.8  
python equivalent-mutants/analyze/analyze_results.py --source organized
```

**Runtime:** ~8 minutes for classification (4,816 mutants) + ~30 seconds for analysis on Apple Silicon MacBook.

### Data Quality and Limitations

#### Survivor Matching Accuracy
- Survivor extraction via Stryker HTML + `mutants.json` alignment
- `spacl-core` may require location-based matching when Stryker reformats expressions
- Coverage details in `thesis/rq3/output/appendix/`

#### Classifier Limitations
- **Training bias:** Model trained on manually-labeled equivalent mutants may not perfectly generalize to LLM-generated patterns
- **Conservative threshold:** θ=0.8 chosen to minimize false equivalent predictions, potentially underestimating true equivalent rates
- **Language scope:** Trained primarily on JavaScript mutations; may not transfer to other languages

#### Study Limitations
- **Single run per LLM:** Standard deviations reflect package variation, not cross-run stability
- **Package selection:** Limited to 6 JavaScript packages; results may not generalize to other codebases
- **Temporal snapshot:** LLMs evolve rapidly; results reflect models as of May 2026

## Implications for Mutation Testing

### Practical Impact

1. **Tool Selection:** Prefer models with lower predicted equivalence rates when survivor quality matters

2. **Quality vs Quantity:** Raw mutant count is insufficient — equivalent rate is a critical quality metric for LLM-generated mutation suites

3. **Computational Efficiency:** Lower equivalent rates mean more productive use of testing resources and cleaner mutation scores

### Future Research Directions

1. **Multi-run stability:** Assess whether equivalent rate rankings are consistent across multiple LLM runs
2. **Language generalization:** Extend analysis to Python, Java, C++ to validate cross-language patterns  
3. **Prompt engineering:** Investigate whether specific prompting strategies can reduce equivalent mutant generation
4. **Human validation:** Manually validate a subset of classifier predictions to calibrate automated results
5. **Mutation operator analysis:** Determine which types of mutations (operators, AST transformations) are most prone to equivalence per LLM

## Reproducibility

All code, data, and results are available in the `equivalent-mutants/` directory. The analysis is fully automated and can be rerun with:

```bash
python equivalent-mutants/analyze/run_complete_analysis.py --source organized --threshold 0.8 --force
```

Configuration parameters (threshold, packages, model path) are specified in `equivalent-mutants/analyze/config.yaml`.