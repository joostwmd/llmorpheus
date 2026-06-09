# Research Question 2: Model Consistency Analysis

## Overview

**Research Question:** How consistent are different models across runs?

**Hypothesis:** Models vary significantly in stability even at T=0; open-weight and API models may differ in consistency, but category labels are not assumed causal.

## Study matrix (canonical)

**Registry:** `thesis/shared/modelRegistry.js` · **Detail:** `thesis/meta/model_choices.md`

RQ2 includes **only multi-run models** (single-run models excluded — see `filterForRq` in `thesis/shared/filterDatasets.js`).

| # | Artifact ID | OpenRouter slug | Reps |
|---|-------------|-----------------|------|
| 1 | `openai_gpt-4o-mini` | `openai/gpt-4o-mini` | 5 |
| 2 | `google_gemini-3.1-flash-lite` | `google/gemini-3.1-flash-lite` | 5 |
| 3 | `anthropic_claude-haiku-4.5` | `anthropic/claude-haiku-4.5` | 5 |
| 4 | `meta-llama_llama-3.3-70b-instruct` | `meta-llama/llama-3.3-70b-instruct` | 5 |
| 5 | `meta-llama_llama-3.1-8b-instruct` | `meta-llama/llama-3.1-8b-instruct` | 5 |
| 6 | `qwen_qwen-2.5-coder-32b-instruct` | `qwen/qwen-2.5-coder-32b-instruct` | 5 |
| 7 | `deepseek_deepseek-chat-v3.1` | `deepseek/deepseek-chat-v3.1` | 5 |

**Excluded from RQ2:** `openai_gpt-4o`, `google_gemini-3.5-flash`, `anthropic_claude-sonnet-4.5` (single-run policy)

**Packages:** thesis-six (6 packages)  
**Datasets (RQ2):** 7 models × 6 packages × 5 reps = **210**  
**Outputs:** `thesis/rq2/output/publication/` (see `artifacts_index.md`)

## Background and Motivation

Even with deterministic settings (temperature=0), large language models can exhibit variation across runs due to:

- **Implementation differences:** Floating-point precision, batching strategies, hardware variations
- **Model architecture:** Serving and batching differences across providers  
- **API vs local deployment:** Different serving infrastructure and optimization strategies
- **Prompt sensitivity:** Minor context variations affecting generation paths

Understanding cross-run consistency is critical for:
- **Reproducibility:** Ensuring research results can be replicated
- **Production reliability:** Predicting mutation testing variability in deployment
- **Model comparison fairness:** Distinguishing inherent model differences from random variation
- **Quality assurance:** Identifying unexpectedly unstable model behaviors

## Research Design

### Input Data Structure

```
artifacts/{model}/
├── rep1/ … rep5/              # 5 reps for each multi-run model
│   ├── mutants-{package}/
│   └── results-{package}/
```

**Analysis scope:**
- **7 models × 6 packages × 5 runs = 210 datasets**
- **Consistency metrics:** Jaccard overlap, CV/SD of score, survivors, edit distance across reps

### Methodology Framework

#### 1. Mutant Set Overlap Analysis

**Jaccard Similarity Coefficient:**
```python
def calculate_jaccard_overlap(run1_mutants, run2_mutants):
    """Calculate Jaccard similarity between mutant sets from different runs"""
    # Convert mutants to comparable format (location + replacement)
    set1 = {(m['startLine'], m['startColumn'], m['originalCode'], m['replacement']) 
            for m in run1_mutants}
    set2 = {(m['startLine'], m['startColumn'], m['originalCode'], m['replacement']) 
            for m in run2_mutants}
    
    intersection = len(set1.intersection(set2))
    union = len(set1.union(set2))
    
    return intersection / union if union > 0 else 0.0
```

**Metrics per model × package:**
- **Pairwise Jaccard:** Overlap between each run pair (run1-run2, run1-run3, run2-run3)
- **Mean overlap:** Average Jaccard across all run pairs
- **Overlap stability:** Standard deviation of pairwise Jaccard scores

#### 2. Mutation Score Stability

**Cross-run mutation score variance:**
```python
def analyze_score_consistency(model_package_runs):
    """Analyze mutation score stability across runs"""
    scores = [run['mutationScore'] for run in model_package_runs]
    
    return {
        'mean_mutation_score': np.mean(scores),
        'std_mutation_score': np.std(scores),
        'cv_mutation_score': np.std(scores) / np.mean(scores),  # coefficient of variation
        'min_score': min(scores),
        'max_score': max(scores),
        'score_range': max(scores) - min(scores)
    }
```

#### 3. Survivor Count Variability

**Analysis of survivor count consistency:**
```python  
def analyze_survivor_consistency(model_package_runs):
    """Analyze survivor count stability across runs"""
    survivor_counts = [int(run['nrSurvived']) for run in model_package_runs]
    
    return {
        'mean_survivors': np.mean(survivor_counts),
        'std_survivors': np.std(survivor_counts),
        'cv_survivors': np.std(survivor_counts) / np.mean(survivor_counts),
        'survivor_range': max(survivor_counts) - min(survivor_counts),
        'relative_range': (max(survivor_counts) - min(survivor_counts)) / np.mean(survivor_counts)
    }
```

#### 4. Edit Distance Consistency

**Levenshtein distance stability analysis:**
```python
def analyze_distance_consistency(run1_distances, run2_distances, run3_distances):
    """Compare edit distance distributions across runs"""
    # Calculate distribution statistics for each run
    run_medians = [
        np.median(run1_distances),
        np.median(run2_distances), 
        np.median(run3_distances)
    ]
    
    return {
        'median_distance_std': np.std(run_medians),
        'median_distance_cv': np.std(run_medians) / np.mean(run_medians),
        'ks_test_p_value': scipy.stats.ks_2samp(run1_distances, run2_distances)[1],
        'distribution_similarity': 'stable' if ks_p > 0.05 else 'variable'
    }
```

### Statistical Analysis Framework

#### Cross-Model Consistency Ranking
```python
def rank_model_consistency(consistency_results):
    """Rank models by overall consistency across metrics"""
    model_rankings = []
    
    for model in consistency_results['model'].unique():
        model_data = consistency_results[consistency_results['model'] == model]
        
        # Aggregate consistency scores (lower = more consistent)
        consistency_score = (
            model_data['cv_mutation_score'].mean() +
            model_data['cv_survivors'].mean() + 
            (1 - model_data['mean_jaccard_overlap'].mean()) +  # invert for consistency
            model_data['median_distance_cv'].mean()
        ) / 4
        
        model_rankings.append({
            'model': model,
            'consistency_score': consistency_score,
            'rank': None  # to be filled after sorting
        })
    
    # Sort by consistency score and assign ranks
    model_rankings.sort(key=lambda x: x['consistency_score'])
    for i, model_rank in enumerate(model_rankings):
        model_rank['rank'] = i + 1
        
    return model_rankings
```

#### Package-Level Consistency Patterns
```python
def analyze_package_consistency(consistency_results):
    """Identify packages that induce higher/lower model stability"""
    package_analysis = []
    
    for package in consistency_results['package'].unique():
        package_data = consistency_results[consistency_results['package'] == package]
        
        package_analysis.append({
            'package': package,
            'mean_model_consistency': package_data['consistency_score'].mean(),
            'consistency_variance': package_data['consistency_score'].var(),
            'most_stable_model': package_data.loc[package_data['consistency_score'].idxmin(), 'model'],
            'least_stable_model': package_data.loc[package_data['consistency_score'].idxmax(), 'model']
        })
    
    return package_analysis
```

### Expected Results Structure

#### Primary Consistency Table

| Model | Mean Jaccard Overlap | CV Mutation Score | CV Survivors | CV Edit Distance | Overall Consistency Rank |
|-------|---------------------|-------------------|--------------|------------------|-------------------------|
| gpt-4o-mini | 0.73 ± 0.12 | 0.08 ± 0.03 | 0.15 ± 0.07 | 0.22 ± 0.09 | 1 |
| claude-sonnet-4.5 | 0.69 ± 0.15 | 0.12 ± 0.05 | 0.18 ± 0.08 | 0.28 ± 0.12 | 2 |
| ... | ... | ... | ... | ... | ... |

*CV = Coefficient of Variation (lower = more consistent)*

#### Package-Specific Consistency Patterns

| Package | Mean Model CV | Most Stable | Least Stable | Complexity Factor |
|---------|---------------|-------------|--------------|-------------------|
| zip-a-folder | 0.12 ± 0.04 | gpt-4o-mini | deepseek-v3.1 | Low (simple structure) |
| Complex.js | 0.28 ± 0.11 | claude-sonnet | gemini-thinking | High (math operations) |
| ... | ... | ... | ... | ... |

### Implementation Plan

#### Analysis pipeline

**Implementation:** `thesis/rq2/index.js`, `thesis/rq2/plots/`  
**Schedule affordable reps:** `.github/schedule-affordable-runs.sh <1-5>`

#### Analysis Scripts Framework

```
model-consistency-analysis/
├── collect_runs.py              # Data collection orchestration  
├── extract_consistency_data.py  # Parse multi-run artifacts
├── calculate_overlaps.py        # Jaccard similarity analysis
├── stability_metrics.py         # CV and variance calculations
├── consistency_ranking.py       # Cross-model comparison
├── package_analysis.py          # Package-specific patterns
├── statistical_tests.py         # Significance testing
├── generate_tables.py           # LaTeX output
├── generate_plots.py            # Visualization suite
└── run_consistency_analysis.py  # Master orchestrator
```

#### Visualization Suite

**Planned outputs:**
- `consistency_ranking_barplot.png` — Model stability comparison
- `jaccard_overlap_heatmap.png` — Pairwise run similarities  
- `score_variance_boxplot.png` — Mutation score stability by model
- `package_consistency_radar.png` — Multi-dimensional consistency per package
- `stability_vs_performance_scatter.png` — Consistency-effectiveness tradeoffs

## Research Question Status

### Current Status: **READY**

All 7 multi-run models have 5 complete reps. Run `cd thesis && node rq2/index.js` (or `npm run all`) to regenerate outputs.

## Integration with Other Research Questions

**RQ1 foundation:** Volume/quality metrics provide baseline for consistency comparison
**RQ3 stability:** Equivalent mutant rates may vary across runs - affects interpretation  
**RQ4 implications:** Cost calculations should account for result variability
**RQ5 note:** Category-level Jaccard comparison is **excluded** from RQ5 (unequal rep counts across categories).

## Future Work

- Longitudinal consistency as API providers update models
- Configuration sensitivity (temperature, prompt variants)
- Self-hosted vs OpenRouter serving consistency