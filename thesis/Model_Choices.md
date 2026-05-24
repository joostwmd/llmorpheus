# Thesis Model Selection

This document defines the **8-model thesis set**, pricing, estimated LLM costs, and guidance on which existing artifact runs to keep or discard.

**Last updated:** May 2026 · Pricing from [OpenRouter `/api/v1/models`](https://openrouter.ai/api/v1/models) (stored in `.github/thesis-model-pricing.json`).

**Excluded from the study:** all reasoning / thinking variants (`*-thinking`, o-series, R1, etc.) — too expensive and prone to CI timeouts.

---

## Design rationale

The lineup is built in three layers:

| Layer | Models | Purpose |
|-------|--------|---------|
| **Cheap API (Big 3)** | GPT-4o-mini, Gemini 3.5 Flash, Claude Haiku 4.5 | What practitioners use by default; cross-vendor comparison at low cost |
| **Premium API** | Claude Sonnet 4.5 | Quality ceiling + **Haiku vs Sonnet** tier comparison (Anthropic only) |
| **Open-weight + hybrid** | Llama 3.3 70B, Llama 3.1 8B, Qwen Coder 32B, DeepSeek v3.1 | RQ5 depth: 70B baseline, small/local tier, non-Meta coder, cost-efficiency anchor |

We deliberately **do not** add premium pairs for OpenAI (GPT-4o) or Google (Gemini Pro) — Anthropic Haiku/Sonnet already covers the “cheap vs premium API” story without tripling CI cost.

---

## Final model list (8 models)

| # | Display name | OpenRouter slug | Category | Role |
|---|--------------|-----------------|----------|------|
| 1 | GPT-4o-mini | `openai/gpt-4o-mini` | API-only | Cheap OpenAI; original paper model |
| 2 | Gemini 3.5 Flash | `google/gemini-3.5-flash` | API-only | Cheap Google (latest Flash tier) |
| 3 | Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | API-only | Cheap Anthropic |
| 4 | Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | API-only | Premium Anthropic (pair with Haiku) |
| 5 | Llama 3.3 70B Instruct | `meta-llama/llama-3.3-70b-instruct` | Open-weight | Canonical 70B; original paper model |
| 6 | Llama 3.1 8B Instruct | `meta-llama/llama-3.1-8b-instruct` | Open-weight | Small / local-deployment tier |
| 7 | Qwen 2.5 Coder 32B | `qwen/qwen-2.5-coder-32b-instruct` | Open-weight | Code-specialist; non-Meta family |
| 8 | DeepSeek Chat v3.1 | `deepseek/deepseek-chat-v3.1` | Hybrid | Strong cost-efficiency (API access to open weights) |

**RQ5 grouping:** 3 open-weight · 4 API-only · 1 hybrid.

---

## Pricing (OpenRouter, per 1M tokens)

| Model | Input $/M | Output $/M |
|-------|-----------|------------|
| Llama 3.1 8B Instruct | $0.02 | $0.05 |
| Llama 3.3 70B Instruct | $0.10 | $0.32 |
| GPT-4o-mini | $0.15 | $0.60 |
| DeepSeek Chat v3.1 | $0.21 | $0.79 |
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

(use RQ0 replication with **1 rep** before starting this matrix).

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
| `thesis/RQ0_Replication.md` | Pipeline validation before full matrix |

---

## References

- Original LLMorpheus paper: [arXiv:2404.09952](https://arxiv.org/abs/2404.09952) — primary models `codellama-34b-instruct`, `llama-3.3-70b-instruct`, `gpt-4o-mini`
- RQ0 replication: `thesis/RQ0_Replication.md`
