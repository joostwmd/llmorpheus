# Research Question 5: Open-weight vs API-only Model Comparison

## Overview

**Research Question:** How do open-weight vs API-only models compare?

**Hypothesis:** Open-weight models may offer better cost-efficiency; API-only models may be more expensive; differences in effectiveness and equivalence may be smaller than expected since category alone is not a strong predictor.

### Excluded metrics: cross-run consistency (Jaccard)

RQ5 **does not** compare cross-run Jaccard overlap between categories. That metric requires **5 reps per model** (see RQ2). Three premium API models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5) are **single-run only** (€15–40 per full run), so a category-level stability comparison would be unbalanced: open-weight models measured on 5 reps while top-tier API models cannot be included. **Stability analysis remains in RQ2** (7 affordable multi-run models only). RQ5 compares **mutation score, survivors, equivalent rate, and cost** on run1 data.

## Background and Motivation

The landscape of large language models is fundamentally divided between two deployment paradigms:

**Open-weight models:** Models with publicly available weights that can be deployed locally or on custom infrastructure (e.g., Llama, Mixtral, DeepSeek open variants)

**API-only models:** Models accessible exclusively through vendor APIs with proprietary weights and infrastructure (e.g., GPT-4o, Claude Sonnet, Gemini)

This distinction has profound implications for mutation testing adoption:

### Open-weight Model Advantages
- **Cost control:** Fixed infrastructure costs vs pay-per-token
- **Privacy:** Local deployment keeps code confidential  
- **Customization:** Fine-tuning and optimization possibilities
- **Availability:** No API rate limits or service dependencies
- **Reproducibility:** Consistent model weights across experiments

### API-only Model Advantages  
- **Performance:** Often state-of-the-art capabilities
- **Infrastructure:** Professionally managed, optimized serving
- **Updates:** Continuous improvements without manual intervention
- **Reliability:** Enterprise-grade uptime and support
- **Efficiency:** Optimized inference without local hardware requirements

Understanding performance differences across these categories enables practitioners to make informed architectural decisions for mutation testing deployments.

## Research Design

### Model Categorization

**Canonical labels:** `thesis/shared/modelRegistry.js` / `thesis/shared/modelMeta.js`

| Artifact ID | OpenRouter slug | Category | Run policy |
|-------------|-----------------|----------|------------|
| `meta-llama_llama-3.3-70b-instruct` | `meta-llama/llama-3.3-70b-instruct` | open-weight | multi (5 reps) |
| `meta-llama_llama-3.1-8b-instruct` | `meta-llama/llama-3.1-8b-instruct` | open-weight | multi |
| `qwen_qwen-2.5-coder-32b-instruct` | `qwen/qwen-2.5-coder-32b-instruct` | open-weight | multi |
| `openai_gpt-4o-mini` | `openai/gpt-4o-mini` | api-only | multi |
| `openai_gpt-4o` | `openai/gpt-4o` | api-only | single |
| `google_gemini-3.1-flash-lite` | `google/gemini-3.1-flash-lite` | api-only | multi |
| `google_gemini-3.5-flash` | `google/gemini-3.5-flash` | api-only | single |
| `anthropic_claude-haiku-4.5` | `anthropic/claude-haiku-4.5` | api-only | multi |
| `anthropic_claude-sonnet-4.5` | `anthropic/claude-sonnet-4.5` | api-only | single |
| `deepseek_deepseek-chat-v3.1` | `deepseek/deepseek-chat-v3.1` | **hybrid** | multi |

**RQ5 grouping:** 3 open-weight · 6 api-only · 1 hybrid  
**Comparison data:** run1 only (all 10 models)  
**Outputs:** `thesis/rq5/output/publication/` (see `artifacts_index.md`)

*DeepSeek has open weights but is accessed via OpenRouter API in this study. Sensitivity analysis: compare with/without DeepSeek in hybrid category.*

### Comparative Analysis Framework

#### 1. Performance Dimension Comparison

**Mutation testing effectiveness:**
- **Volume metrics:** Candidates generated, validity rates, duplicate rates
- **Quality metrics:** Mutation scores, survivor counts, equivalent mutant rates
- **Efficiency metrics:** Cost-effectiveness ratios, resource utilization

**Statistical approach:**
```python
def compare_model_categories(results_df, category_mapping):
    """Compare open-weight vs API-only models across key metrics"""
    
    # Add category labels
    results_df['category'] = results_df['model'].map(category_mapping)
    
    # Group by category and calculate distributions  
    category_comparison = {}
    
    for category in ['open-weight', 'api-only']:
        category_data = results_df[results_df['category'] == category]
        
        category_comparison[category] = {
            'n_models': category_data['model'].nunique(),
            'mutation_score_dist': {
                'median': category_data['mutationScore'].median(),
                'iqr': category_data['mutationScore'].quantile([0.25, 0.75]).values,
                'mean': category_data['mutationScore'].mean(),
                'std': category_data['mutationScore'].std()
            },
            'survivor_count_dist': {
                'median': category_data['nrSurvived'].median(), 
                'iqr': category_data['nrSurvived'].quantile([0.25, 0.75]).values,
                'mean': category_data['nrSurvived'].mean(),
                'std': category_data['nrSurvived'].std()
            },
            'cost_effectiveness': {
                'median_cost_per_survivor': category_data['cost_per_survivor'].median(),
                'mean_total_cost': category_data['total_cost_usd'].mean()
            }
        }
    
    return category_comparison
```

#### 2. Consistency and Reliability Analysis

**Excluded from RQ5:** Cross-run Jaccard and stability metrics (unequal rep counts — see RQ2). The code below is **not** used in RQ5 publication outputs.

<details>
<summary>Legacy consistency sketch (not in RQ5 scope)</summary>

```python
def analyze_category_consistency(consistency_data, category_mapping):
    """Compare consistency patterns between model categories"""
    
    consistency_data['category'] = consistency_data['model'].map(category_mapping)
    
    consistency_comparison = {}
    for category in ['open-weight', 'api-only']:
        category_data = consistency_data[consistency_data['category'] == category]
        
        consistency_comparison[category] = {
            'cross_run_stability': {
                'mean_jaccard_overlap': category_data['jaccard_overlap'].mean(),
                'mutation_score_cv': category_data['mutation_score_cv'].mean(),
                'survivor_count_cv': category_data['survivor_count_cv'].mean()
            },
            'reliability_score': calculate_reliability_score(category_data)
        }
    
    return consistency_comparison
```

</details>

#### 3. Cost-Efficiency Dimension

**Category-level cost analysis:**
```python
def analyze_category_costs(cost_data, category_mapping):
    """Compare cost structures between open-weight and API-only models"""
    
    cost_data['category'] = cost_data['model'].map(category_mapping)
    
    cost_comparison = {}
    for category in ['open-weight', 'api-only']:
        category_data = cost_data[cost_data['category'] == category]
        
        cost_comparison[category] = {
            'direct_costs': {
                'mean_total_cost': category_data['total_api_cost_usd'].mean(),
                'cost_per_valid_mutant': category_data['cost_per_valid_mutant'].mean(),
                'cost_per_survivor': category_data['cost_per_survivor'].mean()
            },
            'efficiency_ranking': calculate_efficiency_ranking(category_data),
            'cost_predictability': {
                'cost_variance': category_data['total_api_cost_usd'].var(),
                'cost_range': category_data['total_api_cost_usd'].max() - category_data['total_api_cost_usd'].min()
            }
        }
    
    return cost_comparison
```

### Statistical Testing Framework

#### 1. Group Comparison Tests

**Non-parametric tests for category differences:**
```python
def test_category_differences(results_df, category_mapping):
    """Statistical tests for significant differences between model categories"""
    
    results_df['category'] = results_df['model'].map(category_mapping)
    open_weight_data = results_df[results_df['category'] == 'open-weight']
    api_only_data = results_df[results_df['category'] == 'api-only']
    
    tests = {}
    
    # Mann-Whitney U tests for continuous metrics
    metrics = ['mutationScore', 'nrSurvived', 'cost_per_survivor', 'equivalent_rate']
    for metric in metrics:
        if metric in results_df.columns:
            statistic, p_value = mannwhitneyu(
                open_weight_data[metric].dropna(), 
                api_only_data[metric].dropna(),
                alternative='two-sided'
            )
            
            # Effect size (rank-biserial correlation)
            n1, n2 = len(open_weight_data[metric].dropna()), len(api_only_data[metric].dropna())
            effect_size = 1 - (2 * statistic) / (n1 * n2)
            
            tests[metric] = {
                'statistic': statistic,
                'p_value': p_value, 
                'effect_size': effect_size,
                'significance': 'significant' if p_value < 0.05 else 'not significant',
                'interpretation': interpret_effect_size(effect_size)
            }
    
    return tests
```

#### 2. Multi-dimensional Analysis

**Principal Component Analysis for category separation:**
```python
def pca_category_analysis(normalized_metrics, category_mapping):
    """PCA to identify main dimensions separating model categories"""
    
    from sklearn.decomposition import PCA
    from sklearn.preprocessing import StandardScaler
    
    # Standardize metrics
    scaler = StandardScaler()
    scaled_metrics = scaler.fit_transform(normalized_metrics)
    
    # PCA analysis
    pca = PCA(n_components=2)
    pca_result = pca.fit_transform(scaled_metrics)
    
    # Analyze category clustering in PCA space
    category_separation = analyze_pca_separation(pca_result, category_mapping)
    
    return {
        'explained_variance': pca.explained_variance_ratio_,
        'component_loadings': pca.components_,
        'category_separation': category_separation,
        'feature_importance': get_feature_importance(pca, scaler.feature_names_in_)
    }
```

### Expected Results Structure

#### Primary Category Comparison Table

| Metric | Open-weight Models | API-only Models | Difference | P-value | Effect Size |
|--------|-------------------|-----------------|------------|---------|-------------|
| **Performance** | | | | | |
| Mutation Score | 63.2% [59.1%, 67.8%] | 64.7% [61.2%, 68.9%] | +1.5pp | 0.412 | Small (0.12) |
| Survivors (median) | 452 [398, 509] | 431 [385, 478] | -21 | 0.234 | Small (-0.18) |
| Equivalent Rate | 10.8% [9.1%, 12.4%] | 11.7% [10.2%, 13.1%] | +0.9pp | 0.298 | Small (0.15) |
| **Cost-Efficiency** | | | | | |
| Cost per Survivor | $0.0048 | $0.0156 | +225% | <0.001** | Large (0.78) |
| Total Cost | $1.89 | $24.32 | +1,187% | <0.001** | Large (0.89) |
| **Consistency*** | | | | | |
| Cross-run Stability | 0.74 ± 0.12 | 0.69 ± 0.15 | -0.05 | 0.167 | Medium (-0.34) |

*Values shown as Median [IQR] unless noted; **Significant at p<0.05; ***Requires multi-run data*

#### Category Performance Profiles

**Open-weight Models (Llama 3.3, Llama 3.1 8B, Qwen Coder 32B):**
- **Strengths:** Exceptional cost-efficiency, competitive quality metrics
- **Considerations:** Requires local infrastructure, potential consistency variations
- **Use cases:** Budget-conscious deployments, privacy-sensitive codebases, high-volume testing

**API-only Models (GPT-4o-mini, GPT-4o, Gemini Flash Lite/3.5, Haiku, Sonnet):**
- **Strengths:** Cutting-edge performance, managed infrastructure, consistent availability
- **Considerations:** Higher costs, API dependencies, rate limiting
- **Use cases:** Premium quality requirements, managed service preference, occasional usage

### Implementation Framework

#### Analysis Pipeline

```
category-comparison-analysis/
├── categorize_models.py        # Model category classification and validation
├── extract_category_data.py    # Group data by category with integration
├── statistical_comparison.py   # Mann-Whitney tests and effect sizes
├── performance_analysis.py     # Multi-dimensional performance comparison  
├── cost_analysis.py           # Category-specific cost-efficiency analysis
├── consistency_analysis.py    # Stability comparison (when multi-run data available)
├── pca_analysis.py            # Principal component category analysis
├── generate_tables.py         # LaTeX category comparison tables
├── generate_plots.py          # Category visualization suite
└── run_category_analysis.py   # Master orchestrator
```

#### Data Integration Requirements

**RQ1 Integration:** Volume and quality metrics for performance comparison
**RQ3 Integration:** Equivalent mutant rates for quality adjustment
**RQ4 Integration:** Cost-effectiveness metrics for economic comparison
**RQ2 Integration:** Consistency metrics when multi-run data available

### Visualization Suite

#### Planned Outputs

**Performance comparison:**
- `category_performance_boxplot.png` — Distribution comparison across key metrics
- `category_radar_chart.png` — Multi-dimensional category profiles
- `performance_vs_cost_scatter.png` — Cost-effectiveness positioning by category

**Category analysis:**
- `pca_category_separation.png` — Principal component analysis visualization  
- `category_heatmap.png` — Comprehensive metric comparison matrix
- `model_category_clustering.png` — Hierarchical clustering with category overlay

**Economic analysis:**
- `cost_efficiency_comparison.png` — Category-level cost-effectiveness comparison
- `total_cost_breakdown.png` — Cost structure analysis by category
- `budget_scenario_analysis.png` — Deployment cost projections by category

### Data Quality and Limitations

#### Category Classification Challenges

**Hybrid model handling:**
- **DeepSeek dilemma:** Open weights but API access - classification sensitivity analysis required
- **Local deployment costs:** Open-weight models have hidden infrastructure costs not captured in analysis
- **Version control:** API models update continuously while open-weight analysis uses fixed checkpoints

#### Sample Size Considerations

**Current model distribution:**
- **Open-weight:** 3 models (Llama 3.3 70B, Llama 3.1 8B, Qwen Coder 32B)
- **API-only:** 6 models (GPT-4o-mini, GPT-4o, Gemini 3.1 Flash Lite, Gemini 3.5 Flash, Haiku, Sonnet)
- **Hybrid:** 1 model (DeepSeek Chat v3.1)

**Statistical power implications:**
- **Effect size detection:** Small effects may not reach significance with limited samples
- **Generalizability:** Results may not represent broader category differences
- **Temporal stability:** API model performance changes over time, open-weight models remain fixed

#### Confounding Variables

**Model capability differences:**
- **Parameter count:** Models vary significantly in size within categories  
- **Training data:** Different training cutoffs and data sources
- **Architecture:** Various transformer architectures and optimizations
- **Tuning:** Different fine-tuning approaches for instruction following

**Deployment context:**
- **API optimization:** Different serving infrastructure optimizations
- **Rate limiting:** API models subject to different throughput constraints
- **Geographic variation:** API performance may vary by region and time

### Practical Implications

#### Deployment Decision Framework

**Choose Open-weight when:**
1. **Budget constraints:** Cost-efficiency is primary concern
2. **Privacy requirements:** Code confidentiality mandatory  
3. **High volume:** Consistent heavy usage justifies infrastructure investment
4. **Customization needs:** Fine-tuning or specialized optimization required
5. **Dependency minimization:** Avoiding external service dependencies

**Choose API-only when:**
1. **Quality priority:** Maximum performance regardless of cost
2. **Operational simplicity:** Managed service preferred over infrastructure
3. **Occasional usage:** Intermittent testing doesn't justify local deployment
4. **Latest capabilities:** Access to cutting-edge model improvements
5. **Enterprise support:** Professional SLA and support requirements

#### Hybrid Deployment Strategies

**Cost-tiered approach:**
1. **Screening with open-weight:** Initial mutation generation with cost-effective models
2. **Refinement with API models:** Final pass with premium models for critical paths
3. **Quality validation:** Cross-validation between category predictions

**Workload-specific allocation:**
1. **Package complexity matching:** Simple packages → open-weight, complex → API-only
2. **Budget phase management:** Development → open-weight, production → API-only
3. **Risk-based selection:** High-stakes code → premium models, routine testing → efficient models

### Future Research Directions

#### Category Evolution Tracking
1. **Longitudinal comparison:** Track category differences as models evolve
2. **New model integration:** Expand analysis as additional open-weight/API models emerge
3. **Performance convergence:** Monitor whether category gaps narrow over time

#### Advanced Category Analysis
1. **Fine-grained categorization:** Sub-categories within open-weight (foundation vs fine-tuned) and API-only (reasoning vs standard)
2. **Hybrid model taxonomy:** Systematic classification of models with mixed deployment options
3. **Infrastructure cost modeling:** Comprehensive TCO including deployment and operational costs

#### Practical Deployment Studies
1. **Real-world case studies:** Category selection outcomes in production environments
2. **Migration analysis:** Costs and benefits of switching between categories
3. **Scaling characteristics:** How category differences change with usage volume

The category comparison analysis provides essential guidance for architectural decisions in LLM-powered mutation testing, enabling evidence-based selection between open-weight and API-only deployment strategies based on specific organizational requirements and constraints.