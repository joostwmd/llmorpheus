# Thesis Experiment Runs Plan

## Overview

This document defines the complete experimental matrix for the thesis, including replication validation, single-run expensive model comparison, and multi-run stability analysis.

**Total Models**: 10 (8 current + 2 additional models for tier comparisons)  
**Total Packages**: 6 (thesis-six.json)  
**Experimental Design**: Variable runs based on cost-feasibility

## ⚠️ **CRITICAL ERROR DISCOVERED - ALL RUNS NEED RERUNNING**

**Issue**: All completed runs (rep 1) used **`maxTokensInCompletion: 8000`** instead of the original paper's **`250`**.

**Impact**: 
- **Invalid for replication** - doesn't match original LLMorpheus conditions
- **Inflated costs** - much higher output token usage than intended
- **Potential different mutations** - models may generate different patterns with 8x more token budget
- **Incomparable results** - cannot compare with original paper or other studies

**Resolution**: **All experiments must be rerun** with `maxTokensInCompletion: 250` to ensure:
- Scientific validity and replication accuracy
- Proper cost-effectiveness analysis 
- Fair model comparisons under identical constraints

**Status**: Workflow updated to correct token limit. All previous runs invalidated.

---

## Model Categories

### **Expensive Models (Single Run Only)**
*Cost: €15-25+ per run - prohibitive for multiple runs*

| Model | OpenRouter Slug | Cost/Run | Purpose |
|-------|-----------------|----------|---------|
| Gemini 3.5 Flash | `google/gemini-3.5-flash` | €20+ | Premium Google model |
| Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | €15-25 | Premium Anthropic (tier comparison with Haiku) |
| **GPT-4o** | `openai/gpt-4o` | €20-40 | **MISSING - Premium OpenAI (tier comparison with 4o-mini)** |

### **Affordable Models (Multiple Runs)**
*Cost: €0.05-5 per run - feasible for stability analysis*

| Model | OpenRouter Slug | Cost/Run | Purpose |
|-------|-----------------|----------|---------|
| GPT-4o-mini | `openai/gpt-4o-mini` | €2-5 | Cheap OpenAI baseline |
| **Gemini 3.5 Flash 8B** | `google/gemini-3.5-flash-8b` | €1-3 | **MISSING - Cheap Google alternative** |
| Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | €4 | Cheap Anthropic |
| Llama 3.3 70B | `meta-llama/llama-3.3-70b-instruct` | €0.5-2 | Open-weight 70B baseline |
| Llama 3.1 8B | `meta-llama/llama-3.1-8b-instruct` | €0.05 | Open-weight small model |
| Qwen 2.5 Coder 32B | `qwen/qwen-2.5-coder-32b-instruct` | €1 | Code-specialized open-weight |
| DeepSeek Chat v3.1 | `deepseek/deepseek-chat-v3.1` | €0.5-2 | Hybrid model |

---

## Experimental Matrix

### **Phase 1: Replication Validation (RQ0)**
*Validate pipeline reproduces original LLMorpheus results*

| Model | Runs | Status | Purpose |
|-------|------|--------|---------|
| `meta-llama/llama-3.3-70b-instruct` | 1 | ✅ **Complete** | Baseline replication (original paper model) |

### **Phase 2: Single-Run Comparison (RQ1, RQ3, RQ4, RQ5)**
*All models compared on identical basis*

#### **Previous Runs (INVALIDATED - used wrong token limit):**
| Model | Status | Notes |
|-------|--------|-------|
| `openai/gpt-4o-mini` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `google/gemini-3.5-flash` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `anthropic/claude-haiku-4.5` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `anthropic/claude-sonnet-4.5` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `meta-llama/llama-3.3-70b-instruct` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `meta-llama/llama-3.1-8b-instruct` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `qwen/qwen-2.5-coder-32b-instruct` | ❌ **Invalid** | Used 8000 tokens instead of 250 |
| `deepseek/deepseek-chat-v3.1` | ❌ **Invalid** | Used 8000 tokens instead of 250 |

#### **All Runs Needed (correct 250 token limit):**
| Model | Status | Priority | Cost/Run | Notes |
|-------|--------|----------|----------|-------|
| `openai/gpt-4o-mini` | ❌ **Need rerun** | HIGH | €2-5 | Rerun with 250 tokens |
| `openai/gpt-4o` | ❌ **Need to run** | HIGH | €20-40 | New expensive model, 250 tokens |
| `google/gemini-3.5-flash-8b` | ❌ **Need to run** | HIGH | €1-3 | New cheap alternative, 250 tokens |
| `google/gemini-3.5-flash` | ❌ **Need rerun** | HIGH | €20+ | Rerun with 250 tokens |
| `anthropic/claude-haiku-4.5` | ❌ **Need rerun** | HIGH | €4 | Rerun with 250 tokens |
| `anthropic/claude-sonnet-4.5` | ❌ **Need rerun** | HIGH | €15-25 | Rerun with 250 tokens |
| `meta-llama/llama-3.3-70b-instruct` | ❌ **Need rerun** | HIGH | €0.5-2 | Rerun with 250 tokens |
| `meta-llama/llama-3.1-8b-instruct` | ❌ **Need rerun** | HIGH | €0.05 | Rerun with 250 tokens |
| `qwen/qwen-2.5-coder-32b-instruct` | ❌ **Need rerun** | HIGH | €1 | Rerun with 250 tokens |
| `deepseek/deepseek-chat-v3.1` | ❌ **Need rerun** | HIGH | €0.5-2 | Rerun with 250 tokens |

### **Phase 3: Multi-Run Stability Analysis (RQ2)**
*Consistency evaluation for cost-feasible models*

#### **Required Additional Runs (rep 2 & 3):**

**Affordable Models (14 runs needed):**
| Model | Rep 2 | Rep 3 | Total Runs | Purpose |
|-------|-------|-------|------------|---------|
| `openai/gpt-4o-mini` | ❌ | ❌ | 1/3 | Stability analysis |
| `google/gemini-3.5-flash-8b` | ❌ | ❌ | 0/3 | Stability analysis (new model) |
| `anthropic/claude-haiku-4.5` | ❌ | ❌ | 1/3 | Stability analysis |
| `meta-llama/llama-3.3-70b-instruct` | ❌ | ❌ | 1/3 | Stability analysis |
| `meta-llama/llama-3.1-8b-instruct` | ❌ | ❌ | 1/3 | Stability analysis |
| `qwen/qwen-2.5-coder-32b-instruct` | ❌ | ❌ | 1/3 | Stability analysis |
| `deepseek/deepseek-chat-v3.1` | ❌ | ❌ | 1/3 | Stability analysis |

**Expensive Models (excluded from multi-run):**
| Model | Runs | Reason |
|-------|------|--------|
| `google/gemini-3.5-flash` | 1 only | Cost prohibitive (€20+/run) |
| `anthropic/claude-sonnet-4.5` | 1 only | Cost prohibitive (€15-25/run) |
| `openai/gpt-4o` | 1 only | Cost prohibitive (€20-40/run) |

---

## Action Items

### **Immediate (Priority 1):**
1. **✅ Workflow updated:**
   - ✅ Added all 10 models to `.github/workflows/openrouter-exp.yml` dropdown
   - ✅ Corrected `maxTokensInCompletion` from 8000 to 250 (original paper value)

2. **Rerun ALL models with corrected settings (10 runs for rep 1):**
   - All models must be rerun with `maxTokensInCompletion: 250`
   - **Expensive models** (€60-85 total): GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5
   - **Affordable models** (€10-20 total): All others

### **Secondary (Priority 2):**
4. **Multi-run stability analysis (16 runs):**
   - Rep 2 & 3 for all 7 affordable models
   - Rep 2 & 3 for new `google/gemini-3.5-flash-8b` (once rep 1 is complete)

---

## Cost Analysis

### **Completed Runs (€32+ spent):**
- Single runs for 8 models: ~€32+ (including expensive Gemini 3.5 Flash)

### **Corrected Budget Analysis:**
**Previous spending (~€32)**: **WASTED** - all runs used wrong token limit and must be redone

**New budget required:**
- **Complete rep 1 rerun (10 models)**: €70-105
  - 3 expensive models: €60-85
  - 7 affordable models: €10-20
- **Stability runs (7 affordable × 2 reps)**: €20-40  
- **Total corrected budget**: €90-145

**Impact**: Higher total cost due to need to rerun everything, but **lower per-run costs** going forward due to 250 token limit vs 8000.

---

## Research Question Coverage

| Research Question | Single Run Data | Multi-Run Data | Models Included |
|------------------|------------------|----------------|-----------------|
| **RQ0** (Replication) | ✅ | N/A | Llama 3.3 70B |
| **RQ1** (Volume & Quality) | ✅ All 10 models | N/A | All models (fair comparison) |
| **RQ2** (Consistency) | N/A | ✅ 7 affordable models | Excludes 3 expensive models |
| **RQ3** (Equivalent Mutants) | ✅ All 10 models | N/A | All models (UniXCoder classifier) |
| **RQ4** (Cost-Effectiveness) | ✅ All 10 models | ✅ 7 affordable models | Includes cost-feasibility analysis |
| **RQ5** (Open-weight vs API) | ✅ All 10 models | ✅ 7 affordable models | Category comparisons |

---

## Timeline

- **Week 1**: Add missing models to workflow, run expensive models, download existing runs
- **Week 2-3**: Execute multi-run stability analysis (7 models × 2 additional reps)
- **Week 4**: Data analysis and results generation

**Target Completion**: End of May 2026