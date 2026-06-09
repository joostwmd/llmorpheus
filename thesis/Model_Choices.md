# Thesis Model Selection

This document defines the **10-model thesis set** with tier comparisons, pricing, estimated LLM costs, and run strategy based on cost-feasibility.

**Last updated:** May 2026 · Pricing from [OpenRouter `/api/v1/models`](https://openrouter.ai/api/v1/models) (stored in `.github/thesis-model-pricing.json`).

**Updated Configuration (May 25, 2026):**
- **Max tokens:** 200 (reduced from 250/8000 for consistency)
- **Reasoning:** Disabled for most models; Gemini 3.x uses `{ effort: "minimal", exclude: true }`
- **Analysis registry:** `thesis-code/shared/modelRegistry.js` — flip `status` to `ready` when CI artifacts are valid
- **Google model:** Switched to `google/gemini-3.1-flash-lite` (83% cheaper than 3.5 Flash)

**Study design:** Variable runs per model based on cost-feasibility - expensive models (€15+/run) get single runs for comparison, affordable models get multiple runs for stability analysis.

---

## Design rationale

**Updated strategy:** Complete tier comparisons for each major API provider, enabling direct cost-effectiveness analysis within providers while maintaining budget feasibility through variable run strategies.

| Provider | Cheap Model | Expensive Model | Purpose |
|----------|-------------|-----------------|---------|
| **OpenAI** | GPT-4o-mini (€2-5/run) | GPT-4o (€20-40/run) | Complete OpenAI tier comparison |
| **Google** | Gemini 3.1 Flash Lite (€0.25-0.75/run) | Gemini 3.5 Flash (€20+/run) | Complete Google tier comparison |
| **Anthropic** | Claude Haiku 4.5 (€4/run) | Claude Sonnet 4.5 (€15-25/run) | Complete Anthropic tier comparison |
| **Open-weight** | Llama 3.3 70B, Llama 3.1 8B, Qwen Coder 32B | N/A | Self-hostable alternatives |
| **Hybrid** | DeepSeek Chat v3.1 | N/A | API access to open weights |

**Run strategy:** Expensive models (€15+/run) get single runs for comparison, affordable models get multiple runs for stability analysis (RQ2).

We deliberately **do not** add premium pairs for OpenAI (GPT-4o) or Google (Gemini Pro) — Anthropic Haiku/Sonnet already covers the “cheap vs premium API” story without tripling CI cost.

---

## Final model list (10 models)

| # | Display name | OpenRouter slug | Category | Role |
|---|--------------|-----------------|----------|------|
| 1 | GPT-4o-mini | `openai/gpt-4o-mini` | API-only (Cheap) | Cheap OpenAI; original paper model |
| 2 | **GPT-4o** | `openai/gpt-4o` | API-only (Expensive) | **Premium OpenAI (tier comparison with 4o-mini)** |
| 3 | Gemini 3.1 Flash Lite | `google/gemini-3.1-flash-lite` | API-only (Cheap) | **Cheap Google alternative** |
| 4 | Gemini 3.5 Flash | `google/gemini-3.5-flash` | API-only (Expensive) | Premium Google (tier comparison with 8B) |
| 5 | Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | API-only (Cheap) | Cheap Anthropic |
| 6 | Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | API-only (Expensive) | Premium Anthropic (tier comparison with Haiku) |
| 7 | Llama 3.3 70B Instruct | `meta-llama/llama-3.3-70b-instruct` | Open-weight | Canonical 70B; original paper model |
| 8 | Llama 3.1 8B Instruct | `meta-llama/llama-3.1-8b-instruct` | Open-weight | Small / local-deployment tier |
| 9 | Qwen 2.5 Coder 32B | `qwen/qwen-2.5-coder-32b-instruct` | Open-weight | Code-specialist; non-Meta family |
| 10 | DeepSeek Chat v3.1 | `deepseek/deepseek-chat-v3.1` | Hybrid | Strong cost-efficiency (API access to open weights) |

**Run strategy:** 3 expensive models (single run) · 7 affordable models (multiple runs)  
**RQ5 grouping:** 3 open-weight · 6 API-only · 1 hybrid.

---

## Pricing (OpenRouter, per 1M tokens)

| Model | Input $/M | Output $/M |
|-------|-----------|------------|
| Llama 3.1 8B Instruct | $0.02 | $0.05 |
| Llama 3.3 70B Instruct | $0.10 | $0.32 |
| GPT-4o-mini | $0.15 | $0.60 |
| DeepSeek Chat v3.1 | $0.21 | $0.79 |
| Gemini 3.1 Flash Lite | $0.25 | $1.50 |
| Qwen 2.5 Coder 32B | $0.66 | $1.00 |
| Claude Haiku 4.5 | $1.00 | $5.00 |
| Gemini 3.5 Flash | $1.50 | $9.00 |
| Claude Sonnet 4.5 | $3.00 | $15.00 |

---

## Estimated LLM cost (mutant generation only)

Costs assume the **observed token profile** from one full pass over **thesis-six** (6 packages), totalling **1,292,856 prompt tokens** and **237,642 completion tokens** (measured from `openai/gpt-4o-mini` rep1).

**Formula:** `cost = (prompt_tokens / 1M) × input_rate + (completion_tokens / 1M) × output_rate`

Actual usage varies slightly per model; treat these as **projections**.

### Per model — all 6 thesis packages

| Model | 1 run (1×) | 5 runs (5×) |
|-------|------------|-------------|
| Llama 3.1 8B Instruct | **$0.04** | **$0.19** |
| Llama 3.3 70B Instruct | **$0.21** | **$1.03** |
| GPT-4o-mini | **$0.34** | **$1.68** |
| DeepSeek Chat v3.1 | **$0.46** | **$2.30** |
| Qwen 2.5 Coder 32B | **$1.09** | **$5.45** |
| Claude Haiku 4.5 | **$2.48** | **$12.41** |
| Gemini 3.5 Flash | **$4.08** | **$20.39** |
| Claude Sonnet 4.5 | **$7.44** | **$37.22** |

### Full thesis suite (all 8 models)

| Replications | Total LLM cost (generation only) |
|--------------|----------------------------------|
| **1×** (each model once) | **~$16.13** |
| **5×** (each model five times, for RQ2) | **~$80.66** |

> These are **LLM API costs only**. GitHub Actions compute time for Stryker is separate (often the dominant wall-clock cost). Gemini 3.5 Flash and Claude Sonnet 4.5 are the most expensive models in the set.

### Workload multiplier

Each full model run = **6 packages** (thesis-six) × **1 workflow** (packages run in parallel within the workflow).

For the complete thesis study with **5 replications** per model:

```
8 models × 6 packages × 5 reps = 240 package-level benchmark jobs
```

(confirm RQ0 pipeline checklist in `thesis/RQ0_Replication.md` before interpreting multi-rep results).

---

## Existing runs: keep vs delete

Current local artifacts (`artifacts/` and `organized/`) reflect an **older 7-model set** (including reasoning and redundant Llama). Only **rep1** is real data; runs 2–5 in `organized/` are simulated symlinks.

### Keep (still in the final 8-model set)

| Artifact directory | OpenRouter slug | Notes |
|--------------------|-----------------|-------|
| `openai_gpt-4o-mini` | `openai/gpt-4o-mini` | Keep rep1; re-run reps 2–5 live when ready |
| `anthropic_claude-sonnet-4.5` | `anthropic/claude-sonnet-4.5` | Premium tier — keep rep1 |
| `meta-llama_llama-3.3-70b-instruct` | `meta-llama/llama-3.3-70b-instruct` | Keep rep1 |
| `deepseek_deepseek-chat-v3.1` | `deepseek/deepseek-chat-v3.1` | Keep rep1 |

### Delete (not in final set)

| Artifact directory | Reason |
|--------------------|--------|
| `google_gemini-2.5-flash` | Replaced by **Gemini 3.5 Flash** |
| `google_gemini-2.5-flash-thinking` | Reasoning model — excluded from thesis |
| `meta-llama_llama-4-maverick` | Redundant with Llama 3.3 70B |

After deleting, remove matching folders under both `artifacts/` and `organized/`, then re-run `thesis-code` organize/analysis when new runs are available.

### Must run (no existing data)

| OpenRouter slug | Priority |
|-----------------|----------|
| `google/gemini-3.5-flash` | High — replaces 2.5 Flash |
| `anthropic/claude-haiku-4.5` | High — new cheap Anthropic tier |
| `meta-llama/llama-3.1-8b-instruct` | Medium — open small tier |
| `qwen/qwen-2.5-coder-32b-instruct` | Medium — open coder |

### Simulated runs (runs 2–5)

Any **simulated** run2–run5 data for kept models was duplicated from rep1 for pipeline testing. **Delete or overwrite** with real replications when you run the 5× study for RQ2.

---

## Models dropped from earlier plans

| Model | Why dropped |
|-------|-------------|
| Gemini 2.5 Flash | Superseded by Gemini 3.5 Flash |
| Gemini 2.5 Flash (thinking) | Reasoning / cost |
| Llama 4 Maverick | Too similar to Llama 3.3 70B |
| GPT-4o | Premium OpenAI pair not needed (Haiku/Sonnet covers tier story) |
| Gemini 2.5 / 3.5 Pro | Same — cost vs marginal insight |
| All o-series / R1 / `-thinking` | CI timeout and cost |

---

## Related files

| File | Purpose |
|------|---------|
| `.github/workflows/openrouter-exp.yml` | CI model dropdown |
| `.github/download-all-runs.sh` | Batch artifact download model list |
| `.github/thesis-model-pricing.json` | Pinned pricing for cost scripts |
| `thesis-code/shared/modelMeta.js` | Display names and RQ5 categories |
| `thesis/RQ0_Replication.md` | Pipeline validation & experimental setup (not paper replication) |

---

## References

- LLMorpheus (method): [arXiv:2404.09952](https://arxiv.org/abs/2404.09952) — this thesis extends the tool; `gpt-4o-mini` and `llama-3.3-70b-instruct` are study baselines, not replication targets. `codellama-34b-instruct` excluded (no longer on OpenRouter).
- RQ0 setup: `thesis/RQ0_Replication.md`
