# Research Question 1: Mutant Volume and Quality Analysis

## Overview

**Research Question:** How many mutants do different models produce and what are they?

**Hypothesis:** Models differ in mutant volume and validity rates; some models produce more survivors but with larger edit distances (less subtle mutations); modern models expected to outperform original baselines.

## Background and Motivation

The effectiveness of mutation testing depends not only on the total number of mutants generated, but also on their quality characteristics. Key quality dimensions include:

- **Volume metrics:** Total candidates generated, syntactic validity rates, duplicate rates
- **Semantic quality:** Mutation scores achieved, survivor counts, timeout rates  
- **Edit complexity:** Levenshtein distances indicating mutation subtlety
- **Efficiency ratios:** Valid mutants per prompt, unique mutations per attempt

Understanding these characteristics across different LLMs enables practitioners to select models that provide the best mutation testing value for their computational budget.

## Research Design

### Comparison to Original LLMorpheus Study

This analysis systematizes the mutant generation analysis from the original LLMorpheus paper, extending it to cover modern LLMs with standardized metrics across consistent experimental conditions.

### Input Data Structure

**Source:** `artifacts/` directory containing structured LLM mutation testing results
- **7 LLMs:** GPT-4o-mini, Claude Sonnet 4.5, Gemini 2.5 Flash (+ thinking), Llama 3.3 70B, Llama 4 Maverick, DeepSeek Chat v3.1
- **6 JavaScript packages:** Complex.js, countries-and-timezones, node-jsonfile, pull-stream, spacl-core, zip-a-folder
- **1 run per LLM** (42 datasets total: 7 LLMs × 6 packages × 1 run)

**Raw data structure per model × package × run:**
```
artifacts/{model}/rep{run}/
├── mutants-{package}/
│   └── {package}/
│       ├── mutants.json          # All generated mutants with metadata
│       ├── summary.json          # Volume and token statistics
│       ├── LLMorpheusOutput.txt  # Generation logs and timing
│       └── promptSpecs.json      # Prompt configuration details
└── results-{package}/
    └── results-{package}/
        ├── StrykerInfo.json      # Aggregate test results
        ├── StrykerOutput.txt     # Detailed mutation testing log
        └── mutation.html         # Interactive result report
```

### Methodology

#### 1. Data Extraction and Aggregation

**Volume Metrics (from `summary.json`):**
- `nrPrompts`: Number of generation attempts made
- `nrCandidates`: Total mutants generated across all prompts
- `nrSyntacticallyValid`: Mutants passing JavaScript syntax validation
- `nrSyntacticallyInvalid`: Mutants with syntax errors
- `nrIdentical`: Mutants identical to original code
- `nrDuplicate`: Mutants identical to previously generated mutants
- `nrLocations`: Unique code locations targeted for mutation

**Token Usage Metrics (from `summary.json`):**
- `totalPromptTokens`: Input tokens consumed
- `totalCompletionTokens`: Output tokens generated  
- `totalTokens`: Combined token usage
- Generation efficiency ratios (mutants per token, valid mutants per prompt)

**Mutation Testing Results (from `StrykerInfo.json`):**
- `mutationScore`: Percentage of mutants killed by test suite
- `nrKilled`: Mutants detected by tests (test suite killed them)
- `nrSurvived`: Mutants not detected by tests (escaped test suite)
- `nrTimedOut`: Mutants causing test execution timeouts
- `time`: Wall-clock time for mutation testing execution

#### 2. Edit Distance Analysis

**Implementation:** Calculate Levenshtein distances from `mutants.json` entries:
```python
def calculate_edit_distances(mutants_data):
    distances = []
    for mutant in mutants_data:
        original = mutant['originalCode'] 
        replacement = mutant['replacement']
        absolute_distance = levenshtein_distance(original, replacement)
        normalized_distance = absolute_distance / max(len(original), len(replacement))
        distances.append({
            'absolute': absolute_distance,
            'normalized': normalized_distance,
            'original_length': len(original),
            'replacement_length': len(replacement)
        })
    return distances
```

**Metrics computed:**
- **Absolute Levenshtein:** Character-level edit distance (median/IQR per model × package)
- **Normalized Levenshtein:** Distance divided by max sequence length (accounts for mutation scope)
- **Distribution analysis:** Quartiles, outliers, and variability within each model

#### 3. Statistical Analysis Framework

**Per-package aggregation:**
- Compute all metrics for each model × package combination
- Handle missing data (e.g., timeout packages) with explicit flagging
- Calculate derived ratios (efficiency metrics)

**Cross-package aggregation per model:**
- **Central tendency:** Median values across packages (robust to package-specific outliers)
- **Variability:** Interquartile ranges indicating consistency
- **Weighted averages:** Account for different package sizes and complexity

**Cross-model comparisons:**
- **Rankings:** Order models by key effectiveness metrics
- **Statistical tests:** Kruskal-Wallis for non-parametric group comparisons
- **Effect sizes:** Quantify practical significance of differences

### Expected Results Structure

#### Primary Comparison Table

| Model | Median #Candidates | Validity Rate | Median Mutation Score | Median #Survived | Median Abs. Levenshtein | Median Norm. Levenshtein |
|-------|-------------------|---------------|----------------------|------------------|------------------------|--------------------------|
| gpt-4o-mini | 1,395 | 76.8% | 61.90% | 408 | 3.5 [2.0-6.0] | 0.42 [0.25-0.67] |
| claude-sonnet-4.5 | ... | ... | ... | ... | ... | ... |
| gemini-2.5-flash | ... | ... | ... | ... | ... | ... |
| ... | ... | ... | ... | ... | ... | ... |

#### Generated Artifacts (Implementation Plan)

**Analysis Scripts (to be created):**
```
mutation-volume-analysis/
├── extract_metrics.py          # Parse artifacts/ into structured CSV
├── calculate_distances.py      # Levenshtein analysis from mutants.json
├── aggregate_results.py        # Cross-package and cross-model summaries
├── statistical_analysis.py     # Rankings, tests, effect sizes
├── generate_tables.py          # LaTeX output generation
├── generate_plots.py           # Visualization suite
└── run_volume_analysis.py      # Master pipeline orchestrator
```

**Output Data Files:**
- `raw_metrics.csv` — Per-dataset volume and quality measurements
- `model_summary.csv` — Aggregated statistics per model
- `package_summary.csv` — Package-specific patterns across models
- `edit_distances.csv` — Detailed Levenshtein analysis results
- `statistical_tests.csv` — Cross-model comparison results

**Visualizations:**
- `volume_comparison_barplot.png` — Candidate generation rates
- `quality_vs_quantity_scatter.png` — Mutation score vs. survivor count
- `edit_distance_distributions.png` — Subtlety comparison across models
- `efficiency_radar_chart.png` — Multi-dimensional model comparison
- `package_complexity_heatmap.png` — Model performance by package characteristics

**LaTeX Tables:**
- `volume_metrics_table.tex` — Core generation statistics
- `quality_metrics_table.tex` — Mutation testing effectiveness  
- `edit_distance_table.tex` — Mutation subtlety analysis
- `efficiency_comparison_table.tex` — Cost-normalized effectiveness metrics

## Technical Implementation

### Data Processing Pipeline

#### Phase 1: Metric Extraction
```python
# Extract core metrics from artifacts structure
def extract_volume_metrics(artifacts_dir):
    results = []
    for model_dir in artifacts_dir.glob("*/rep1"):
        model_name = model_dir.parent.name
        for package_dir in model_dir.glob("mutants-*"):
            package_name = package_dir.name.replace("mutants-", "")
            
            # Volume metrics from summary.json
            summary_path = package_dir / package_name / "summary.json"
            summary_data = json.load(summary_path.open())
            
            # Testing results from StrykerInfo.json  
            results_dir = model_dir / f"results-{package_name}" / f"results-{package_name}"
            stryker_path = results_dir / "StrykerInfo.json"
            stryker_data = json.load(stryker_path.open())
            
            # Combine metrics
            record = {
                'model': model_name,
                'package': package_name, 
                'run': 1,
                **summary_data,
                **stryker_data
            }
            results.append(record)
    
    return pd.DataFrame(results)
```

#### Phase 2: Edit Distance Calculation
```python
# Calculate Levenshtein distances for mutation subtlety analysis
def analyze_edit_distances(artifacts_dir):
    distance_results = []
    for model_dir in artifacts_dir.glob("*/rep1"):
        model_name = model_dir.parent.name
        for mutants_file in model_dir.glob("mutants-*/*/mutants.json"):
            package_name = mutants_file.parent.parent.name.replace("mutants-", "")
            
            mutants_data = json.load(mutants_file.open())
            for mutant in mutants_data:
                abs_dist = levenshtein_distance(mutant['originalCode'], mutant['replacement'])
                max_len = max(len(mutant['originalCode']), len(mutant['replacement']))
                norm_dist = abs_dist / max_len if max_len > 0 else 0
                
                distance_results.append({
                    'model': model_name,
                    'package': package_name,
                    'absolute_levenshtein': abs_dist,
                    'normalized_levenshtein': norm_dist,
                    'original_length': len(mutant['originalCode']),
                    'replacement_length': len(mutant['replacement']),
                    'mutation_reason': mutant.get('reason', 'unknown')
                })
    
    return pd.DataFrame(distance_results)
```

#### Phase 3: Statistical Aggregation
```python
# Aggregate metrics with robust statistics
def aggregate_model_metrics(raw_metrics_df, distance_df):
    model_summaries = []
    
    for model in raw_metrics_df['model'].unique():
        model_data = raw_metrics_df[raw_metrics_df['model'] == model]
        model_distances = distance_df[distance_df['model'] == model]
        
        summary = {
            'model': model,
            'n_packages': len(model_data),
            'median_candidates': model_data['nrCandidates'].median(),
            'median_valid': model_data['nrSyntacticallyValid'].median(), 
            'validity_rate_median': (model_data['nrSyntacticallyValid'] / model_data['nrCandidates']).median(),
            'median_mutation_score': model_data['mutationScore'].astype(float).median(),
            'median_survived': model_data['nrSurvived'].astype(int).median(),
            'median_abs_levenshtein': model_distances['absolute_levenshtein'].median(),
            'iqr_abs_levenshtein': model_distances['absolute_levenshtein'].quantile([0.25, 0.75]).values,
            'median_norm_levenshtein': model_distances['normalized_levenshtein'].median(),
            'iqr_norm_levenshtein': model_distances['normalized_levenshtein'].quantile([0.25, 0.75]).values,
        }
        model_summaries.append(summary)
    
    return pd.DataFrame(model_summaries)
```

### Execution Workflow

```bash
# Complete RQ1 analysis pipeline
python mutation-volume-analysis/run_volume_analysis.py --source artifacts/

# Individual analysis steps  
python mutation-volume-analysis/extract_metrics.py --source artifacts/
python mutation-volume-analysis/calculate_distances.py --source artifacts/
python mutation-volume-analysis/aggregate_results.py 
python mutation-volume-analysis/statistical_analysis.py
python mutation-volume-analysis/generate_tables.py
python mutation-volume-analysis/generate_plots.py
```

**Expected runtime:** ~5 minutes for metric extraction + ~2 minutes for statistical analysis

### Data Quality Considerations

#### Coverage Verification
- **Complete datasets:** Verify all 42 combinations (7 models × 6 packages) present
- **Data integrity:** Validate JSON parsing success rates across all files
- **Outlier detection:** Flag packages with unusual generation patterns (e.g., excessive timeouts)

#### Limitations and Assumptions
- **Single run analysis:** Results represent single-run performance, not cross-run stability  
- **Package selection bias:** Results limited to 6 JavaScript packages, may not generalize
- **Temporal snapshot:** Model capabilities as of evaluation date (May 2026)
- **Configuration consistency:** All models used identical prompts and temperature settings

### Integration with Other Research Questions

**RQ2 dependency:** Multi-run data would enhance this analysis with consistency metrics
**RQ3 integration:** Survivor counts connect to equivalent mutant analysis  
**RQ4 synergy:** Token usage directly feeds into cost-effectiveness calculations
**RQ5-6 foundation:** Volume/quality metrics enable category-based comparisons

## Practical Implications

### Model Selection Guidance
1. **High-volume needs:** Identify models generating most valid candidates per prompt
2. **Quality-focused:** Prioritize models with high mutation scores and low duplicate rates  
3. **Subtlety preference:** Select models producing smaller edit distances for nuanced testing
4. **Balanced approach:** Consider efficiency ratios combining volume, quality, and computational cost

### Mutation Testing Strategy
- **Package-specific adaptation:** Some models may excel on certain code characteristics
- **Resource planning:** Volume metrics enable accurate computational budget estimation
- **Quality thresholds:** Establish minimum validity rates and mutation scores for production use

## Reproducibility and Extension

The analysis framework is designed for extensibility:
- **New models:** Add artifacts following the established directory structure
- **Additional packages:** Include new benchmarks with same data format
- **Language expansion:** Adapt metrics extraction for Python, Java, C++ codebases
- **Longitudinal studies:** Track model evolution over time with consistent methodology

All analysis code, intermediate results, and final outputs will be available in the `mutation-volume-analysis/` directory with comprehensive documentation and configuration management.