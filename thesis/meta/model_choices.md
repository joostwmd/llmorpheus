# Thesis Model Selection

Defines the **10-model thesis set**, tier comparisons, pricing, and run strategy.

**Last updated:** June 2026  
**Registry (canonical):** `thesis/shared/modelRegistry.js` — all models `status: ready`  
**Pricing:** [OpenRouter `/api/v1/models`](https://openrouter.ai/api/v1/models) → `.github/thesis-model-pricing.json`

## Experimental configuration

| Parameter | Value |
|-----------|-------|
| **Packages** | thesis-six (6 JavaScript packages) — `.github/thesis-six.json` |
| **Template** | `template-full` |
| **Temperature** | `0.0` |
| **maxTokens** | `250` |
| **Reasoning** | Disabled; Gemini 3.x uses `{ effort: "minimal", exclude: true }` |
| **Serving** | All models via OpenRouter (not self-hosted) |

Authoritative config is `summary.json` → `metaInfo.maxTokens` (verified: 250 on all 228 datasets). Matches Tip et al. (2025).

## Run strategy

| Policy | Models | Reps | Used in |
|--------|--------|------|---------|
| **multi** | 7 affordable models | **5** (`rep1`–`rep5`) | RQ2 (all reps); RQ1/RQ3/RQ4/RQ5 use **run1** for cross-model comparison |
| **single** | 3 expensive models | **1** (`rep1` only) | RQ1/RQ3/RQ4/RQ5 only; **excluded from RQ2** |

Expensive models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5) are single-run for cost feasibility. Affordable models get five runs for stability analysis (Jaccard, CV).

## Final model list (10 models)

| # | Artifact ID | Display name | OpenRouter slug | Category | Run policy | Reps |
|---|-------------|--------------|-----------------|----------|------------|------|
| 1 | `openai_gpt-4o-mini` | GPT-4o-mini | `openai/gpt-4o-mini` | api-only | multi | 5 |
| 2 | `openai_gpt-4o` | GPT-4o | `openai/gpt-4o` | api-only | single | 1 |
| 3 | `google_gemini-3.1-flash-lite` | Gemini 3.1 Flash Lite | `google/gemini-3.1-flash-lite` | api-only | multi | 5 |
| 4 | `google_gemini-3.5-flash` | Gemini 3.5 Flash | `google/gemini-3.5-flash` | api-only | single | 1 |
| 5 | `anthropic_claude-haiku-4.5` | Claude Haiku 4.5 | `anthropic/claude-haiku-4.5` | api-only | multi | 5 |
| 6 | `anthropic_claude-sonnet-4.5` | Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | api-only | single | 1 |
| 7 | `meta-llama_llama-3.3-70b-instruct` | Llama 3.3 70B | `meta-llama/llama-3.3-70b-instruct` | open-weight | multi | 5 |
| 8 | `meta-llama_llama-3.1-8b-instruct` | Llama 3.1 8B | `meta-llama/llama-3.1-8b-instruct` | open-weight | multi | 5 |
| 9 | `qwen_qwen-2.5-coder-32b-instruct` | Qwen 2.5 Coder 32B | `qwen/qwen-2.5-coder-32b-instruct` | open-weight | multi | 5 |
| 10 | `deepseek_deepseek-chat-v3.1` | DeepSeek Chat v3.1 | `deepseek/deepseek-chat-v3.1` | hybrid | multi | 5 |

**RQ5 grouping:** 3 open-weight · 6 api-only · 1 hybrid (DeepSeek)

**Paper baselines in this study (not replication targets):** `gpt-4o-mini`, `llama-3.3-70b-instruct`

## Tier comparisons (within provider)

| Provider | Cheap (multi, 5 reps) | Premium (single, 1 rep) |
|----------|----------------------|-------------------------|
| OpenAI | GPT-4o-mini | GPT-4o |
| Google | Gemini 3.1 Flash Lite | Gemini 3.5 Flash |
| Anthropic | Claude Haiku 4.5 | Claude Sonnet 4.5 |

Tier comparisons use **run1** data only (asymmetric run counts).

## Excluded models (legacy artifacts)

These directories may exist locally but are **not** in the study matrix (`thesis/shared/modelMeta.js` → `EXCLUDED_MODELS`):

| Artifact ID | Reason |
|-------------|--------|
| `google_gemini-2.5-flash` | Superseded by Gemini 3.5 Flash |
| `google_gemini-2.5-flash-thinking` | Reasoning model — out of scope |
| `meta-llama_llama-4-maverick` | Redundant with Llama 3.3 70B |
| `meta-llama/codellama-34b-instruct` | No longer on OpenRouter (404) |

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
| GPT-4o | (see pricing JSON) | (see pricing JSON) |
| Claude Sonnet 4.5 | $3.00 | $15.00 |

## Estimated LLM cost (mutant generation only)

Token profile measured from `openai/gpt-4o-mini` rep1 over thesis-six: **1,292,856** prompt + **237,642** completion tokens.

**Formula:** `cost = (prompt_tokens / 1M) × input_rate + (completion_tokens / 1M) × output_rate`

### Per model — all 6 packages

| Model | 1 run | 5 runs |
|-------|-------|--------|
| Llama 3.1 8B Instruct | ~$0.04 | ~$0.19 |
| Llama 3.3 70B Instruct | ~$0.21 | ~$1.03 |
| GPT-4o-mini | ~$0.34 | ~$1.68 |
| DeepSeek Chat v3.1 | ~$0.46 | ~$2.30 |
| Gemini 3.1 Flash Lite | (see pricing JSON) | — |
| Qwen 2.5 Coder 32B | ~$1.09 | ~$5.45 |
| Claude Haiku 4.5 | ~$2.48 | ~$12.41 |
| Gemini 3.5 Flash | ~$4.08 | — (single run) |
| GPT-4o | (see pricing JSON) | — (single run) |
| Claude Sonnet 4.5 | ~$7.44 | — (single run) |

### Full thesis workload

```
7 multi-run models × 6 packages × 5 reps = 210 package-level jobs
3 single-run models × 6 packages × 1 rep  =  18 package-level jobs
Total                                    = 228 package-level jobs
```

## Related files

| File | Purpose |
|------|---------|
| `thesis/shared/modelRegistry.js` | Canonical model list, run policy, status |
| `thesis/shared/modelMeta.js` | Display names, categories, exclusions |
| `thesis/meta/experiment_runs.md` | Run matrix summary |
| `.github/workflows/openrouter-exp.yml` | CI workflow |
| `.github/thesis-model-pricing.json` | Pinned pricing for RQ4 |
| `thesis/rq0/replication.md` | Pipeline validation |

## References

- LLMorpheus method: [arXiv:2404.09952](https://arxiv.org/abs/2404.09952)
- RQ definitions: `thesis/meta/rq_overview.md`
