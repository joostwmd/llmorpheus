# Thesis Experiment Runs Plan

## Overview

This document defines the complete experimental matrix for the thesis, including pipeline validation (RQ0), single-run expensive model comparison, and multi-run stability analysis.

**Total Models**: 10 (8 current + 2 additional models for tier comparisons)  
**Total Packages**: 6 (thesis-six.json)  
**Experimental Design**: Variable runs based on cost-feasibility

## ⚠️ **CONFIGURATION UPDATE - ALL RUNS NEED RERUNNING**

**Updated Configuration (May 25, 2026):**
- **Token limit**: Changed to **`200`** (standardized for consistency)
- **Reasoning**: Disabled for most models (`reasoning: { enabled: false }`); **Gemini 3.x** uses `{ effort: "minimal", exclude: true }` (OpenRouter requirement)
- **Google model**: Switched to **`google/gemini-3.1-flash-lite`** (83% cheaper than 3.5 Flash)
- **Analysis registry**: Model run policy and status live in `thesis/shared/modelRegistry.js` (`ready | pending | failed`)

**Impact**: 
- **Previous runs incompatible** - mixed token limits (250/8000) and no reasoning control
- **Cost optimization** - new Google model significantly reduces experimental costs
- **Consistency required** - standardized parameters needed for fair comparison

**Resolution**: **All experiments must be rerun** with the new standardized configuration:
- `maxTokensInCompletion: 200` (consistent across all runs)
- Reasoning disabled (Gemini 3.x: minimal effort, excluded from completion)
- Updated model list with cost-optimized Google alternative

**Status**: Workflow and model configuration updated. All previous runs invalidated.

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
| **Gemini 3.1 Flash Lite** | `google/gemini-3.1-flash-lite` | €0.25-0.75 | **Cheap Google alternative** |
| Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | €4 | Cheap Anthropic |
| Llama 3.3 70B | `meta-llama/llama-3.3-70b-instruct` | €0.5-2 | Open-weight 70B baseline |
| Llama 3.1 8B | `meta-llama/llama-3.1-8b-instruct` | €0.05 | Open-weight small model |
| Qwen 2.5 Coder 32B | `qwen/qwen-2.5-coder-32b-instruct` | €1 | Code-specialized open-weight |
| DeepSeek Chat v3.1 | `deepseek/deepseek-chat-v3.1` | €0.5-2 | Hybrid model |

---

## Experimental Matrix

### **Phase 0: Pipeline validation (RQ0)**
*Confirm CI + artifacts + `thesis` work — not external replication of the 2024 paper*

| Check | Status | Purpose |
|-------|--------|---------|
| GHA end-to-end (LLMorpheus → Stryker → artifacts) | ✅ **Complete** | Toolchain runs on thesis-six |
| Non-empty mutants per model × package | ✅ **Complete** (10-model matrix) | RQ1–RQ5 have valid inputs |
| `thesis` organize + analysis | ✅ **Complete** | Downstream RQs runnable |

See `thesis/rq0/replication.md` for checklist and experimental constants.

### **Phase 2: Single-Run Comparison (RQ1, RQ3, RQ4, RQ5)**
*All models compared on identical basis*

#### **Previous Runs (INVALIDATED - inconsistent configuration):**
| Model | Status | Notes |
|-------|--------|-------|
| `openai/gpt-4o-mini` | ❌ **Invalid** | Mixed token limits (250/8000), no reasoning control |
| `google/gemini-3.5-flash` | ❌ **Invalid** | Mixed token limits, model deprecated |
| `anthropic/claude-haiku-4.5` | ❌ **Invalid** | Mixed token limits (250/8000), no reasoning control |
| `anthropic/claude-sonnet-4.5` | ❌ **Invalid** | Mixed token limits, no reasoning control |
| `meta-llama/llama-3.3-70b-instruct` | ❌ **Invalid** | Mixed token limits (250/8000), no reasoning control |
| `meta-llama/llama-3.1-8b-instruct` | ❌ **Invalid** | Mixed token limits (250/8000), no reasoning control |
| `qwen/qwen-2.5-coder-32b-instruct` | ❌ **Invalid** | Mixed token limits (250/8000), no reasoning control |
| `deepseek/deepseek-chat-v3.1` | ❌ **Invalid** | Mixed token limits, reasoning errors |

#### **All Runs Needed (new standardized configuration):**
| Model | Status | Priority | Cost/Run | Notes |
|-------|--------|----------|----------|-------|
| `openai/gpt-4o-mini` | ❌ **Need rerun** | HIGH | €2-5 | 200 tokens, reasoning disabled |
| `openai/gpt-4o` | ❌ **Need to run** | HIGH | €20-40 | New expensive model |
| `google/gemini-3.1-flash-lite` | ❌ **Need to run** | HIGH | €0.25-0.75 | New cheap alternative (83% cheaper) |
| `google/gemini-3.5-flash` | ❌ **Need rerun** | HIGH | €20+ | Keep for tier comparison |
| `anthropic/claude-haiku-4.5` | ❌ **Need rerun** | HIGH | €4 | 200 tokens, reasoning disabled |
| `anthropic/claude-sonnet-4.5` | ❌ **Need rerun** | HIGH | €15-25 | 200 tokens, reasoning disabled |
| `meta-llama/llama-3.3-70b-instruct` | ❌ **Need rerun** | HIGH | €0.5-2 | 200 tokens, reasoning disabled |
| `meta-llama/llama-3.1-8b-instruct` | ❌ **Need rerun** | HIGH | €0.05 | 200 tokens, reasoning disabled |
| `qwen/qwen-2.5-coder-32b-instruct` | ❌ **Need rerun** | HIGH | €1 | 200 tokens, reasoning disabled |
| `deepseek/deepseek-chat-v3.1` | ❌ **Need rerun** | HIGH | €0.5-2 | 200 tokens, reasoning disabled |

### **Phase 3: Multi-Run Stability Analysis (RQ2)**
*Consistency evaluation for cost-feasible models*

#### **Required Additional Runs (rep 2–5):**

**Affordable Models (up to 5 reps each):**
| Model | Rep 2 | Rep 3 | Total Runs | Purpose |
|-------|-------|-------|------------|---------|
| `openai/gpt-4o-mini` | ❌ | ❌ | 1/3 | Stability analysis |
| `google/gemini-3.1-flash-lite` | ❌ | ❌ | 0/3 | Stability analysis (new cheaper model) |
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
1. **✅ Workflow updated (May 25, 2026):**
   - ✅ Updated model list: `google/gemini-3.1-flash-lite` (replaces 3.5-flash-8b)
   - ✅ Standardized `maxTokensInCompletion` to 200 (consistent limit)
   - ✅ Added global reasoning disabled (`reasoning: { enabled: false }`)

2. **Rerun ALL models with standardized configuration (10 runs for rep 1):**
   - All models with `maxTokensInCompletion: 200` and `reasoning: { enabled: false }`
   - **Expensive models** (€60-85 total): GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5
   - **Affordable models** (€8-15 total): All others (reduced cost with new Google model)

### **Secondary (Priority 2):**
4. **Multi-run stability analysis (16 runs):**
   - Rep 2 & 3 for all 7 affordable models
   - Rep 2 & 3 for new `google/gemini-3.1-flash-lite` (once rep 1 is complete)

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
| **RQ0** (Pipeline validation) | ✅ | N/A | All 10 models (end-to-end CI) |
| **RQ1** (Volume & Quality) | ✅ All 10 models | N/A | All models (fair comparison) |
| **RQ2** (Consistency) | N/A | ✅ 7 affordable models | Excludes 3 expensive models |
| **RQ3** (Equivalent Mutants) | ✅ All 10 models | N/A | All models (UniXCoder classifier) |
| **RQ4** (Cost-Effectiveness) | ✅ All 10 models | ✅ 7 affordable models | Includes cost-feasibility analysis |
| **RQ5** (Open-weight vs API) | ✅ All 10 models (run1) | N/A (no Jaccard) | Effectiveness, equivalence, cost only — stability in RQ2 |

---

## Timeline

- **Week 1**: Add missing models to workflow, run expensive models, download existing runs
- **Week 2-3**: Execute multi-run stability analysis (7 models × 2 additional reps)
- **Week 4**: Data analysis and results generation

**Target Completion**: End of May 2026