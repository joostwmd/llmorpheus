# Research Question 2: Model Consistency Analysis

## Overview

**Research Question:** How consistent are different models across runs?

**Hypothesis:** Models vary significantly in stability even at T=0; reasoning models may be less stable due to more complex generation behavior; open-weight models may differ from API models in consistency.

## Background and Motivation

Even with deterministic settings (temperature=0), large language models can exhibit variation across runs due to:

- **Implementation differences:** Floating-point precision, batching strategies, hardware variations
- **Model architecture:** Reasoning models may have additional stochastic components  
- **API vs local deployment:** Different serving infrastructure and optimization strategies
- **Prompt sensitivity:** Minor context variations affecting generation paths

Understanding cross-run consistency is critical for:
- **Reproducibility:** Ensuring research results can be replicated
- **Production reliability:** Predicting mutation testing variability in deployment
- **Model comparison fairness:** Distinguishing inherent model differences from random variation
- **Quality assurance:** Identifying unexpectedly unstable model behaviors

## Research Design

### Experimental Requirements

**Critical limitation:** This research question **cannot be fully answered with current data**, as it requires **multiple runs per model × package combination**.

**Current data:** 1 run per model × package (42 datasets total)
**Required data:** 3+ runs per model × package (126+ datasets minimum)

### Input Data Structure (Required)

**Target structure for complete analysis:**
```
artifacts/{model}/
├── rep1/                      # First run (current data)
│   ├── mutants-{package}/
│   └── results-{package}/
├── rep2/                      # Second run (MISSING)
│   ├── mutants-{package}/
│   └── results-{package}/
└── rep3/                      # Third run (MISSING)
    ├── mutants-{package}/
    └── results-{package}/
```

**Analysis scope with complete data:**
- **7 LLMs × 6 packages × 3 runs = 126 datasets**
- **Consistency metrics:** Cross-run stability for each model × package pair
- **Statistical power:** 3 runs enables meaningful variance estimation

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

#### Data Collection Requirements

**Critical need:** Additional runs must be collected to complete this analysis
```bash
# Example collection strategy for complete RQ2 analysis
for model in gpt-4o-mini claude-sonnet-4.5 gemini-2.5-flash ...; do
  for package in Complex.js countries-and-timezones ...; do
    for run in rep2 rep3; do
      # Execute LLMorpheus with identical configuration
      llmorpheus --model ${model} --package ${package} --output artifacts/${model}/${run}/
    done
  done  
done
```

**Computational cost estimation:** 
- **Additional data needed:** 2 × 42 = 84 new runs  
- **Estimated time:** ~40 hours of LLM generation + ~20 hours Stryker testing
- **Estimated cost:** $200-800 depending on model pricing (API models)

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

### Partial Analysis with Current Data

#### Limited Insights Available

While complete cross-run analysis is impossible, some preliminary consistency indicators can be derived:

**1. Internal consistency checks:**
- Mutant generation patterns within single runs
- Prompt-to-prompt variation in mutation types
- Location targeting consistency across prompts

**2. Cross-package stability:**
- Models showing consistent performance patterns across different packages
- Identifying packages that reveal model instabilities

**3. Quality variance indicators:**
- Models with highly variable mutant quality within single runs
- Outlier detection in generation patterns

#### Placeholder Implementation

```python
# Partial analysis with current single-run data
def analyze_within_run_consistency(artifacts_dir):
    """Extract what consistency insights are possible from single runs"""
    
    results = []
    for model_dir in artifacts_dir.glob("*/rep1"):
        model_name = model_dir.parent.name
        
        # Analyze prompt-to-prompt variation within each package
        for mutants_file in model_dir.glob("mutants-*/*/mutants.json"):
            package_name = mutants_file.parent.parent.name.replace("mutants-", "")
            mutants_data = json.load(mutants_file.open())
            
            # Group mutants by prompt ID and analyze internal consistency
            prompt_groups = {}
            for mutant in mutants_data:
                prompt_id = mutant['promptId'] 
                if prompt_id not in prompt_groups:
                    prompt_groups[prompt_id] = []
                prompt_groups[prompt_id].append(mutant)
            
            # Calculate within-prompt consistency metrics
            prompt_consistency = analyze_prompt_consistency(prompt_groups)
            
            results.append({
                'model': model_name,
                'package': package_name,
                'within_prompt_consistency': prompt_consistency,
                'cross_prompt_variance': calculate_cross_prompt_variance(prompt_groups)
            })
    
    return results
```

## Research Question Status

### Current Status: **BLOCKED - Insufficient Data**

**Completion requirements:**
1. **Data collection:** Execute 2 additional runs per model × package combination
2. **Infrastructure setup:** Automated run management and artifact organization  
3. **Analysis implementation:** Multi-run comparison and statistical testing
4. **Validation:** Cross-run reproducibility verification

### Alternative Research Directions

#### RQ2a: Package-Induced Consistency Patterns
**Research question:** Do certain packages induce higher model variability than others?
**Feasibility:** Analyzable with current data using cross-package performance variance
**Implementation effort:** Low (2-3 days)

#### RQ2b: Within-Run Generation Consistency  
**Research question:** How consistent are models across prompts within a single generation run?
**Feasibility:** Fully analyzable with current data structure
**Implementation effort:** Medium (1 week)

#### RQ2c: Model Architecture and Consistency
**Research question:** Do reasoning models show different consistency patterns than standard models?
**Feasibility:** Requires additional reasoning model variants but analyzable framework exists
**Implementation effort:** Medium (pending model variants)

## Integration with Other Research Questions

**RQ1 foundation:** Volume/quality metrics provide baseline for consistency comparison
**RQ3 stability:** Equivalent mutant rates may vary across runs - affects interpretation  
**RQ4 implications:** Cost calculations should account for result variability
**RQ5-6 enhancement:** Category comparisons more robust with consistency data

## Future Work and Recommendations

### Immediate Actions (if additional runs collected)
1. **Systematic data collection:** Standardized multi-run generation protocol
2. **Analysis pipeline:** Implement complete consistency analysis framework
3. **Baseline establishment:** Document expected consistency ranges for future studies

### Alternative Approaches  
1. **Focus on RQ2b:** Within-run consistency analysis with current data
2. **Pilot study:** Collect multi-run data for subset of models/packages  
3. **Literature integration:** Compare single-run results to published LLM consistency studies

### Long-term Research Program
1. **Longitudinal consistency:** Track model consistency changes over API updates
2. **Configuration sensitivity:** Vary temperature, prompts, context to study consistency drivers
3. **Hardware dependency:** Compare consistency across different deployment environments

The consistency analysis represents a critical gap in current LLM mutation testing research that requires dedicated data collection and analysis infrastructure to address comprehensively.