# Research Question 4: Cost-Effectiveness Analysis

## Overview

**Research Question:** What does LLMorpheus cost per model?

**Hypothesis:** Cheap models are not necessarily cost-efficient when accounting for duplicates and equivalents; Pareto frontier reveals a small subset of models with best effectiveness-to-cost ratio.

## Study matrix (canonical)

**Registry:** `thesis/shared/modelRegistry.js` · **Detail:** `thesis/meta/model_choices.md`

| Scope | Models | Runs used |
|-------|--------|-----------|
| **All models** | 10 (same matrix as RQ1) | **run1 only** |

See RQ1 spec for the full 10-model table.  
**Pricing:** `.github/thesis-model-pricing.json` (pinned OpenRouter snapshot)  
**Datasets (RQ4):** 10 models × 6 packages × run1  
**Outputs:** `thesis/rq4/output/publication/` (see `artifacts_index.md`)

## Background and Motivation

The practical adoption of LLM-powered mutation testing depends critically on cost-effectiveness considerations. While raw API costs provide one dimension of comparison, the true value proposition requires analyzing:

- **Total computational costs:** Token usage across generation and mutation testing phases
- **Quality-adjusted costs:** Cost per valid, non-duplicate, non-equivalent mutant generated
- **Effectiveness ratios:** Cost per mutation score improvement, cost per survived mutant detected
- **Pareto efficiency:** Models offering optimal cost-effectiveness trade-offs
- **Resource budgeting:** Predictable cost models for production deployment planning

Understanding cost-effectiveness enables practitioners to make informed decisions about model selection based on budget constraints and quality requirements.

## Research Design

### Cost Model Framework

**Multi-dimensional cost analysis:**
1. **Direct API costs:** Token-based pricing for LLM generation
2. **Computational costs:** Mutation testing execution time and resources
3. **Quality-adjusted costs:** Cost normalized by mutant effectiveness metrics
4. **Opportunity costs:** Cost per unit of mutation testing improvement achieved

### Input Data Structure

**Source:** Combination of artifacts and pricing data
- **Token usage:** `summary.json` files containing prompt/completion token counts
- **Runtime data:** `LLMorpheusOutput.txt` and `StrykerInfo.json` for execution times
- **Pricing data:** `.github/thesis-model-pricing.json` with current API rates
- **Quality metrics:** Integration with RQ1 (volume/quality) and RQ3 (equivalent mutants)

**Per model × package × run data:**
```
Cost Calculation Inputs:
├── Token metrics (summary.json)
│   ├── totalPromptTokens      # Input cost component
│   ├── totalCompletionTokens  # Output cost component  
│   └── totalTokens           # Total usage for verification
├── Quality metrics (derived)
│   ├── nrSyntacticallyValid   # Usable mutant count
│   ├── nrSurvived            # Testing-relevant mutants
│   ├── mutationScore         # Effectiveness measure
│   └── predicted_equivalent   # Quality adjustment (from RQ3)
├── Runtime metrics
│   ├── llmorpheus_time       # Generation phase cost
│   └── stryker_time          # Testing phase cost
└── Pricing model
    ├── input_usd_per_million  # API input token rate
    └── output_usd_per_million # API output token rate
```

### Cost Calculation Methodology

#### 1. Direct API Cost Calculation

```python
def calculate_api_cost(summary_data, pricing_model):
    """Calculate direct API costs from token usage and pricing"""
    input_cost = (summary_data['totalPromptTokens'] / 1_000_000) * pricing_model['input_usd_per_million']
    output_cost = (summary_data['totalCompletionTokens'] / 1_000_000) * pricing_model['output_usd_per_million'] 
    total_cost = input_cost + output_cost
    
    return {
        'input_cost_usd': input_cost,
        'output_cost_usd': output_cost,
        'total_api_cost_usd': total_cost,
        'cost_per_prompt_token': input_cost / summary_data['totalPromptTokens'],
        'cost_per_completion_token': output_cost / summary_data['totalCompletionTokens']
    }
```

#### 2. Quality-Adjusted Cost Metrics

```python
def calculate_effectiveness_costs(api_costs, summary_data, stryker_data, equivalent_data=None):
    """Calculate cost-effectiveness ratios across quality dimensions"""
    
    total_cost = api_costs['total_api_cost_usd']
    
    # Basic effectiveness ratios
    cost_per_candidate = total_cost / summary_data['nrCandidates'] if summary_data['nrCandidates'] > 0 else float('inf')
    cost_per_valid = total_cost / summary_data['nrSyntacticallyValid'] if summary_data['nrSyntacticallyValid'] > 0 else float('inf')
    cost_per_survivor = total_cost / int(stryker_data['nrSurvived']) if int(stryker_data['nrSurvived']) > 0 else float('inf')
    
    # Quality-adjusted ratios
    unique_mutants = summary_data['nrSyntacticallyValid'] - summary_data['nrDuplicate']
    cost_per_unique = total_cost / unique_mutants if unique_mutants > 0 else float('inf')
    
    # Equivalent-adjusted ratios (if RQ3 data available)
    if equivalent_data:
        non_equivalent_survivors = equivalent_data['total_surviving'] - equivalent_data['predicted_equivalent']
        cost_per_non_equiv_survivor = total_cost / non_equivalent_survivors if non_equivalent_survivors > 0 else float('inf')
    else:
        cost_per_non_equiv_survivor = None
    
    # Effectiveness ratios
    mutation_score = float(stryker_data['mutationScore'])
    cost_per_mutation_score_point = total_cost / mutation_score if mutation_score > 0 else float('inf')
    
    return {
        'cost_per_candidate': cost_per_candidate,
        'cost_per_valid_mutant': cost_per_valid, 
        'cost_per_unique_mutant': cost_per_unique,
        'cost_per_survivor': cost_per_survivor,
        'cost_per_non_equiv_survivor': cost_per_non_equiv_survivor,
        'cost_per_mutation_score_point': cost_per_mutation_score_point,
        'duplicate_rate': summary_data['nrDuplicate'] / summary_data['nrCandidates'],
        'invalid_rate': summary_data['nrSyntacticallyInvalid'] / summary_data['nrCandidates']
    }
```

#### 3. Computational Cost Estimation

```python
def calculate_computational_costs(llmorpheus_time, stryker_time, hardware_cost_per_hour=0.50):
    """Estimate computational costs for generation and testing phases"""
    
    # Convert time strings to hours
    generation_hours = parse_time_to_hours(llmorpheus_time)  
    testing_hours = parse_time_to_hours(stryker_time)
    
    generation_cost = generation_hours * hardware_cost_per_hour
    testing_cost = testing_hours * hardware_cost_per_hour
    
    return {
        'generation_compute_cost': generation_cost,
        'testing_compute_cost': testing_cost, 
        'total_compute_cost': generation_cost + testing_cost,
        'generation_time_hours': generation_hours,
        'testing_time_hours': testing_hours
    }
```

### Statistical Analysis Framework

#### 1. Model Cost Ranking

```python
def rank_models_by_cost_effectiveness(cost_results):
    """Rank models across multiple cost-effectiveness dimensions"""
    
    rankings = []
    for model in cost_results['model'].unique():
        model_data = cost_results[cost_results['model'] == model]
        
        # Aggregate across packages (weighted by package complexity)
        total_cost = model_data['total_api_cost_usd'].sum()
        total_survivors = model_data['nrSurvived'].sum()
        total_valid = model_data['nrSyntacticallyValid'].sum()
        
        # Calculate portfolio-level metrics
        portfolio_cost_per_survivor = total_cost / total_survivors if total_survivors > 0 else float('inf')
        portfolio_cost_per_valid = total_cost / total_valid if total_valid > 0 else float('inf')
        
        # Efficiency scores (lower is better)
        efficiency_score = np.mean([
            model_data['cost_per_unique_mutant'].median(),
            model_data['cost_per_survivor'].median(),
            model_data['cost_per_mutation_score_point'].median()
        ])
        
        rankings.append({
            'model': model,
            'total_cost_usd': total_cost,
            'portfolio_cost_per_survivor': portfolio_cost_per_survivor,
            'portfolio_cost_per_valid': portfolio_cost_per_valid,
            'efficiency_score': efficiency_score,
            'cost_rank': None  # filled after sorting
        })
    
    # Sort and assign ranks
    rankings.sort(key=lambda x: x['efficiency_score'])
    for i, model in enumerate(rankings):
        model['cost_rank'] = i + 1
    
    return rankings
```

#### 2. Pareto Frontier Analysis

```python
def identify_pareto_frontier(cost_effectiveness_data):
    """Identify models on the Pareto frontier of cost vs effectiveness"""
    
    models = []
    for model in cost_effectiveness_data['model'].unique():
        model_data = cost_effectiveness_data[cost_effectiveness_data['model'] == model]
        
        # Define two key dimensions: cost (minimize) and effectiveness (maximize)
        avg_cost_per_survivor = model_data['cost_per_survivor'].mean()
        avg_mutation_score = model_data['mutation_score'].mean()
        
        models.append({
            'model': model,
            'cost': avg_cost_per_survivor,
            'effectiveness': avg_mutation_score,
            'pareto_efficient': False  # to be determined
        })
    
    # Identify Pareto efficient models
    for i, model_a in enumerate(models):
        is_dominated = False
        for model_b in models:
            if (model_b['cost'] <= model_a['cost'] and 
                model_b['effectiveness'] >= model_a['effectiveness'] and
                (model_b['cost'] < model_a['cost'] or model_b['effectiveness'] > model_a['effectiveness'])):
                is_dominated = True
                break
        models[i]['pareto_efficient'] = not is_dominated
    
    return models
```

### Expected Results Structure

#### Primary Cost-Effectiveness Table

| Model | Total Cost (USD) | Cost/Valid | Cost/Survivor | Cost/Non-Equiv | Efficiency Rank | Pareto Efficient |
|-------|------------------|------------|---------------|----------------|-----------------|------------------|
| (see `cost.tex`) | … | … | … | … | … | … |

Published values: `thesis/rq4/output/publication/cost.tex`, `model_cost_summary.csv`

*Costs aggregated across 6 packages per model*

#### Cost Breakdown Analysis

| Model | API Cost | Compute Cost | Total Cost | Cost Distribution |
|-------|----------|--------------|------------|-------------------|
| llama-3.3-70b | $2.34 (95%) | $0.12 (5%) | $2.46 | API-dominated |
| gpt-4o-mini | $8.47 (99%) | $0.08 (1%) | $8.55 | API-dominated |
| ... | ... | ... | ... | ... |

#### Quality vs Cost Trade-offs

| Model | Mutation Score | Total Cost | Cost/Score Point | Value Proposition |
|-------|----------------|------------|------------------|-------------------|
| llama-3.3-70b | 64.2% | $2.34 | $0.036 | High value |
| gpt-4o-mini | 61.9% | $8.47 | $0.137 | Moderate value |
| claude-sonnet-4.5 | 67.1% | $67.89 | $1.012 | Premium option |
| ... | ... | ... | ... | ... |

### Implementation Framework

#### Analysis Pipeline

```
cost-effectiveness-analysis/
├── extract_costs.py            # Parse token usage and runtime data  
├── load_pricing.py             # Import and validate pricing models
├── calculate_api_costs.py      # Direct API cost calculation
├── calculate_effectiveness.py   # Quality-adjusted cost ratios
├── integration_rq3.py          # Equivalent mutant cost adjustments  
├── pareto_analysis.py          # Efficiency frontier identification
├── statistical_analysis.py     # Rankings and significance tests
├── generate_tables.py          # LaTeX cost tables
├── generate_plots.py           # Cost-effectiveness visualizations
└── run_cost_analysis.py        # Master orchestrator
```

#### Data Integration Points

**RQ1 Integration:** Volume and quality metrics for cost denominators
```python
# Cost per valid mutant calculation
cost_effectiveness['cost_per_valid'] = api_costs / volume_metrics['nrSyntacticallyValid']
```

**RQ3 Integration:** Equivalent mutant adjustments for true value
```python
# Cost per non-equivalent survivor (highest quality metric)
effective_survivors = survivors - equivalent_mutants
cost_effectiveness['cost_per_effective_survivor'] = api_costs / effective_survivors  
```

**RQ5 Integration:** Category-based cost analysis
```python
# Open-weight vs API model cost comparison
open_weight_costs = cost_data[cost_data['category'] == 'open-weight']['cost_per_survivor'].mean()
api_costs = cost_data[cost_data['category'] == 'api-only']['cost_per_survivor'].mean()
```

### Execution Workflow

```bash
# Complete cost-effectiveness analysis
python cost-effectiveness-analysis/run_cost_analysis.py --source artifacts/ --pricing .github/thesis-model-pricing.json

# Individual analysis components
python cost-effectiveness-analysis/extract_costs.py --source artifacts/
python cost-effectiveness-analysis/calculate_api_costs.py --pricing .github/thesis-model-pricing.json
python cost-effectiveness-analysis/calculate_effectiveness.py --integrate-rq3 equivalent-mutants/analyze/output/
python cost-effectiveness-analysis/pareto_analysis.py
python cost-effectiveness-analysis/generate_tables.py
```

**Expected runtime:** ~3 minutes for cost extraction + ~1 minute for analysis

### Visualization Suite

#### Planned Outputs

**Cost comparison plots:**
- `cost_per_model_barplot.png` — Total costs across models
- `cost_breakdown_stacked.png` — API vs computational cost components
- `cost_effectiveness_scatter.png` — Cost vs mutation score relationship

**Efficiency analysis:**
- `pareto_frontier_plot.png` — Cost-effectiveness trade-off visualization
- `cost_per_survivor_ranking.png` — Quality-adjusted cost comparison
- `budget_allocation_pie.png` — Cost distribution across mutation testing phases

**Integration visualizations:**
- `cost_vs_quality_heatmap.png` — Multi-dimensional model comparison
- `efficiency_radar_chart.png` — Model profiles across cost metrics
- `budget_scenario_analysis.png` — Cost projections for different usage patterns

### Data Quality and Limitations

#### Pricing Model Assumptions
- **Static pricing:** Uses snapshot of May 2026 API rates (rates change frequently)
- **Bulk pricing:** Doesn't account for volume discounts or enterprise pricing
- **Currency fluctuations:** USD-based pricing may not reflect local costs
- **Hidden costs:** Doesn't include integration, monitoring, or failure handling costs

#### Computational Cost Estimates
- **Hardware standardization:** Assumes consistent computational environment
- **Opportunity costs:** Doesn't account for alternative model deployment options
- **Scaling factors:** Linear cost assumptions may not hold at different scales

#### Quality Metric Integration
- **RQ3 dependency:** Equivalent mutant cost adjustments require completed RQ3 analysis
- **Temporal alignment:** Cost and quality data must be from same experimental runs
- **Metric completeness:** Some quality adjustments may be unavailable for all models

### Practical Applications

#### Model Selection Guidance
1. **Budget-constrained scenarios:** Identify models offering best value within cost limits
2. **Quality-focused scenarios:** Understand premium costs for higher-effectiveness models
3. **Scale planning:** Predict costs for larger codebases and longer mutation campaigns
4. **ROI analysis:** Compare mutation testing investment to bug detection value

#### Cost Optimization Strategies
1. **Hybrid approaches:** Use cost-effective models for initial screening, premium models for critical paths
2. **Batch optimization:** Leverage bulk pricing and rate limits for cost reduction
3. **Quality thresholds:** Balance cost vs effectiveness based on testing requirements
4. **Resource allocation:** Optimize compute vs API cost ratios based on infrastructure

## Supplementary: Within-provider tier comparison

**Scope:** Extends RQ4 — **not** a separate research question. Compares cheap vs premium SKUs from the same vendor on run1 cost-effectiveness and upgrade economics.

### Tier pairs

Defined in `thesis/shared/modelRegistry.js` (`API_TIER_PAIRS`, `OPEN_WEIGHT_TIER_PAIR`).

| Pair | Cheap (multi-run) | Premium | Run policy |
|------|-------------------|---------|------------|
| OpenAI | GPT-4o-mini | GPT-4o | multi vs **single** |
| Google | Gemini 3.1 Flash Lite | Gemini 3.5 Flash | multi vs **single** |
| Anthropic | Claude Haiku 4.5 | Claude Sonnet 4.5 | multi vs **single** |
| Meta Llama *(appendix)* | Llama 3.1 8B | Llama 3.3 70B | **both multi-run** |

- **Main analysis:** 3 API provider pairs (cheap multi-run vs premium single-run).
- **Appendix pair:** Meta Llama 8B vs 70B — both multi-run; reported separately because both tiers have five reps (upgrade economics without API premium single-run asymmetry).

### Data scope and exclusions

- **run1 only** for all tier metrics (aligned with cross-model RQ4).
- **API premium models are single-run** → tier analysis uses rep1 on both sides; **no stability / Jaccard** in tier comparison (stability remains RQ2).
- Inputs: token logs, pinned pricing, RQ1 volume/validity counts, RQ3 non-equivalent survivor counts.

### Metrics

Portfolio-level (summed across 6 packages, run1):

| Metric | Definition |
|--------|------------|
| **Portfolio cost / unique valid** | Total API cost ÷ unique syntactically valid mutants |
| **Portfolio cost / non-equiv survivor** | Total API cost ÷ effective (non-equivalent) survivors (RQ3-adjusted) |
| **nonEquivYield** | Non-equivalent survivors per € spent (inverse of cost/non-equiv) |
| **Marginal cost per extra non-equiv survivor** | Δcost ÷ Δ(non-equiv survivors) when upgrading cheap → premium within provider |

Paired deltas (premium − cheap) per provider on mutation score, survivors, effective survivors, and cost metrics. Optional Wilcoxon signed-rank on per-package paired deltas (n = 6 packages; interpret with small-n caveat).

### Outputs

`thesis/rq4/output/publication/` (main) and `thesis/rq4/output/appendix/` (Meta Llama pair):

| Artifact | Content |
|----------|---------|
| `tier_comparison.csv` | Per-pair portfolio metrics (Layers A–C) |
| `tier_cost_efficiency.pdf` | Cost/non-equiv and nonEquivYield by tier |
| `tier_paired_deltas.csv` | Per-provider cheap vs premium deltas |
| `tier_wilcoxon.csv` | Per-package paired test statistics |
| `tier_comparison.tex` | Main-paper tier summary table |
| `tier_cost_efficiency_appendix.pdf` | Appendix: Meta Llama 8B vs 70B |

### Future Research Extensions

#### Dynamic Cost Modeling
1. **Real-time pricing:** Integrate with live API pricing feeds
2. **Usage optimization:** Model optimal batch sizes and request patterns
3. **Multi-vendor strategies:** Cost optimization across different API providers

#### Value-Based Analysis
1. **Bug detection ROI:** Connect mutation testing effectiveness to actual bug prevention value
2. **Development velocity:** Quantify impact of mutation testing quality on development speed  
3. **Technical debt reduction:** Measure long-term cost benefits of comprehensive testing

#### Advanced Cost Models
1. **Uncertainty quantification:** Model cost variability and risk factors
2. **Scenario planning:** Multi-dimensional cost analysis for different deployment patterns
3. **Comparative benchmarking:** Industry-standard cost-effectiveness baselines

The cost-effectiveness analysis provides critical decision-making data for practical LLM-powered mutation testing adoption, enabling evidence-based model selection and resource planning.