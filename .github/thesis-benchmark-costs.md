# Thesis benchmark run: results and LLM cost estimates

One full LLMorpheus pass over all **6 thesis packages** (mutant generation only). Costs below project the **same token usage** onto each OpenRouter model in the thesis set, using pricing from [OpenRouter `/api/v1/models`](https://openrouter.ai/api/v1/models) (see `.github/thesis-model-pricing.json`).

**Formula:** `cost = (prompt_tokens / 1M) × input_usd_per_million + (completion_tokens / 1M) × output_usd_per_million`

> Reasoning/thinking models may bill extra reasoning tokens beyond prompt/completion; these estimates use observed prompt + completion tokens only.

---

## Experiment results (reference run)

| Project | #Prompts | #Mutants | #Killed | #Survived | #Timeout | Mutation Score | LLMorpheus Time (s) | Stryker Time (s) | #Prompt Tokens | #Completion Tokens | #Total Tokens | #Retries | #Failures |
|---------|----------|----------|---------|-----------|----------|----------------|---------------------|------------------|----------------|--------------------|---------------|----------|-----------|
| Complex.js | 490 | 1077 | 675 | 402 | 0 | 62.67 | 1397.95 | 348.41 | 788,189 | 96,607 | 884,796 | 0 | 0 |
| countries-and-timezones | 106 | 225 | 187 | 38 | 0 | 83.11 | 298.95 | 239.23 | 82,293 | 21,801 | 104,094 | 0 | 0 |
| delta | 464 | 818 | 641 | 132 | 45 | 83.86 | 1329.06 | 2717.97 | 707,425 | 91,823 | 799,248 | 0 | 0 |
| node-jsonfile | 68 | 156 | 62 | 30 | 64 | 80.77 | 204.13 | 466.23 | 46,918 | 13,438 | 60,356 | 0 | 0 |
| pull-stream | 351 | 757 | 451 | 245 | 61 | 67.64 | 1058.74 | 1196.85 | 171,725 | 69,728 | 241,453 | 0 | 0 |
| zip-a-folder | 49 | 94 | 21 | 5 | 68 | 94.68 | 128.44 | 972.05 | 65,869 | 9,912 | 75,781 | 0 | 0 |
| **Total** | **1528** | **3127** | **2037** | **852** | **238** | — | **4417.27** | **5940.74** | **1,862,419** | **303,309** | **2,165,728** | **0** | **0** |

---

## Token usage summary

| Package | Prompt tokens | Completion tokens | Total tokens |
|---------|---------------|-----------------|--------------|
| Complex.js | 788,189 | 96,607 | 884,796 |
| countries-and-timezones | 82,293 | 21,801 | 104,094 |
| delta | 707,425 | 91,823 | 799,248 |
| node-jsonfile | 46,918 | 13,438 | 60,356 |
| pull-stream | 171,725 | 69,728 | 241,453 |
| zip-a-folder | 65,869 | 9,912 | 75,781 |
| **Total** | **1,862,419** | **303,309** | **2,165,728** |

---

## Estimated LLM cost: all 6 packages × one model

| Model | Slug | Input $/1M | Output $/1M | **1×** | **3×** | **5×** |
|-------|------|------------|-------------|--------|--------|--------|
| Meta: Llama 3.3 70B Instruct | `meta-llama/llama-3.3-70b-instruct` | $0.10 | $0.32 | **$0.28** | **$0.84** | **$1.40** |
| OpenAI: GPT-4o-mini | `openai/gpt-4o-mini` | $0.15 | $0.60 | **$0.46** | **$1.38** | **$2.30** |
| Meta: Llama 4 Maverick | `meta-llama/llama-4-maverick` | $0.15 | $0.60 | **$0.46** | **$1.38** | **$2.30** |
| DeepSeek: DeepSeek V3 | `deepseek/deepseek-chat` | $0.32 | $0.89 | **$0.87** | **$2.61** | **$4.35** |
| Google: Gemini 2.5 Flash | `google/gemini-2.5-flash` | $0.30 | $2.50 | **$1.32** | **$3.96** | **$6.60** |
| Google: Gemini 2.5 Flash (thinking) | `google/gemini-2.5-flash-thinking` | $0.30 | $2.50 | **$1.32** | **$3.96** | **$6.60** |
| DeepSeek: R1 | `deepseek/deepseek-r1` | $0.70 | $2.50 | **$2.06** | **$6.18** | **$10.30** |
| OpenAI: o4 Mini | `openai/o4-mini` | $1.10 | $4.40 | **$3.38** | **$10.14** | **$16.90** |
| Anthropic: Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | $3.00 | $15.00 | **$10.14** | **$30.42** | **$50.70** |
| Anthropic: Claude Sonnet 4.5 (thinking) | `anthropic/claude-sonnet-4.5-thinking` | $3.00 | $15.00 | **$10.14** | **$30.42** | **$50.70** |

**Cheapest (this token profile):** Meta: Llama 3.3 70B Instruct — $0.28 (1×) / $1.40 (5×)  
**Most expensive:** Anthropic: Claude Sonnet 4.5 — $10.14 (1×) / $50.70 (5×)

### Full thesis suite totals (10 models × 6 packages)

| Replications | Total LLM cost |
|--------------|----------------|
| **1×** (run every model once) | **$30.43** |
| **3×** (run every model three times) | **$91.29** |
| **5×** (run every model five times) | **$152.15** |

*Suite = all 6 thesis packages. Full thesis = all 10 OpenRouter models in the replication study, each tested on all 6 packages.*

---

## Replication runs (3× and 5×)

Assumes each replication repeats the **same token usage** as the reference run (e.g. variability studies at temperature 0.0, or `--replay` with new Stryker-only passes). Actual cost may differ if prompts/completions change between runs.

### Per model — all 6 packages

| Model | Slug | 1× | 3× | 5× |
|-------|------|-----|-----|-----|
| Meta: Llama 3.3 70B Instruct | `meta-llama/llama-3.3-70b-instruct` | $0.28 | $0.84 | $1.40 |
| OpenAI: GPT-4o-mini | `openai/gpt-4o-mini` | $0.46 | $1.38 | $2.30 |
| Meta: Llama 4 Maverick | `meta-llama/llama-4-maverick` | $0.46 | $1.38 | $2.30 |
| DeepSeek: DeepSeek V3 | `deepseek/deepseek-chat` | $0.87 | $2.61 | $4.35 |
| Google: Gemini 2.5 Flash | `google/gemini-2.5-flash` | $1.32 | $3.96 | $6.60 |
| Google: Gemini 2.5 Flash (thinking) | `google/gemini-2.5-flash-thinking` | $1.32 | $3.96 | $6.60 |
| DeepSeek: R1 | `deepseek/deepseek-r1` | $2.06 | $6.18 | $10.30 |
| OpenAI: o4 Mini | `openai/o4-mini` | $3.38 | $10.14 | $16.90 |
| Anthropic: Claude Sonnet 4.5 | `anthropic/claude-sonnet-4.5` | $10.14 | $30.42 | $50.70 |
| Anthropic: Claude Sonnet 4.5 (thinking) | `anthropic/claude-sonnet-4.5-thinking` | $10.14 | $30.42 | $50.70 |

### All 10 thesis models combined (summary)

| Replications | LLM cost (mutant generation) | × reference LLM time | × reference Stryker time |
|--------------|------------------------------|----------------------|--------------------------|
| **1×** | **$30.43** | 4,417 s (~1.2 h) | 5,941 s (~1.7 h) |
| **3×** | **$91.29** | 13,252 s (~3.7 h) | 17,822 s (~5.0 h) |
| **5×** | **$152.15** | 22,086 s (~6.1 h) | 29,704 s (~8.3 h) |

**5× full thesis suite (all models, all packages): $152.15** — this is 10 models × 6 packages × 5 replications at the reference token counts.

Reference times are from the table above (one pass over 6 packages per model). GitHub Actions runs packages in parallel, so wall-clock time is lower than these sums.

### Per model — one package (average)

Average cost per package ≈ **total ÷ 6**:

| Model | 1× / package | 3× / package | 5× / package |
|-------|--------------|--------------|--------------|
| Llama 3.3 70B | $0.05 | $0.14 | $0.23 |
| GPT-4o mini | $0.08 | $0.23 | $0.38 |
| Llama 4 Maverick | $0.08 | $0.23 | $0.38 |
| DeepSeek V3 | $0.15 | $0.44 | $0.73 |
| Gemini 2.5 Flash | $0.22 | $0.66 | $1.10 |
| Gemini 2.5 Flash (thinking) | $0.22 | $0.66 | $1.10 |
| DeepSeek R1 | $0.34 | $1.03 | $1.72 |
| o4-mini | $0.56 | $1.69 | $2.82 |
| Claude Sonnet 4.5 | $1.69 | $5.07 | $8.45 |
| Claude Sonnet 4.5 (thinking) | $1.69 | $5.07 | $8.45 |

---

## Per-package cost breakdown (selected models)

### OpenAI: GPT-4o-mini (`openai/gpt-4o-mini`)

| Package | Input cost | Output cost | Total |
|---------|------------|-------------|-------|
| Complex.js | $0.12 | $0.06 | $0.18 |
| countries-and-timezones | $0.01 | $0.01 | $0.03 |
| delta | $0.11 | $0.06 | $0.16 |
| node-jsonfile | $0.01 | $0.01 | $0.02 |
| pull-stream | $0.03 | $0.04 | $0.07 |
| zip-a-folder | $0.01 | $0.01 | $0.02 |
| **Total** | | | **$0.46** |

### Anthropic: Claude Sonnet 4.5 (`anthropic/claude-sonnet-4.5`)

| Package | Input cost | Output cost | Total |
|---------|------------|-------------|-------|
| Complex.js | $2.36 | $1.45 | $3.81 |
| countries-and-timezones | $0.25 | $0.33 | $0.57 |
| delta | $2.12 | $1.38 | $3.50 |
| node-jsonfile | $0.14 | $0.20 | $0.34 |
| pull-stream | $0.52 | $1.05 | $1.56 |
| zip-a-folder | $0.20 | $0.15 | $0.35 |
| **Total** | | | **$10.14** |

### Google: Gemini 2.5 Flash (`google/gemini-2.5-flash`)

| Package | Input cost | Output cost | Total |
|---------|------------|-------------|-------|
| Complex.js | $0.24 | $0.24 | $0.48 |
| countries-and-timezones | $0.02 | $0.05 | $0.08 |
| delta | $0.21 | $0.23 | $0.44 |
| node-jsonfile | $0.01 | $0.03 | $0.05 |
| pull-stream | $0.05 | $0.17 | $0.23 |
| zip-a-folder | $0.02 | $0.02 | $0.04 |
| **Total** | | | **$1.32** |

### DeepSeek: DeepSeek V3 (`deepseek/deepseek-chat`)

| Package | Input cost | Output cost | Total |
|---------|------------|-------------|-------|
| Complex.js | $0.25 | $0.09 | $0.34 |
| countries-and-timezones | $0.03 | $0.02 | $0.05 |
| delta | $0.23 | $0.08 | $0.31 |
| node-jsonfile | $0.02 | $0.01 | $0.03 |
| pull-stream | $0.05 | $0.06 | $0.12 |
| zip-a-folder | $0.02 | $0.01 | $0.03 |
| **Total** | | | **$0.87** |

### Meta: Llama 3.3 70B Instruct (`meta-llama/llama-3.3-70b-instruct`)

| Package | Input cost | Output cost | Total |
|---------|------------|-------------|-------|
| Complex.js | $0.08 | $0.03 | $0.11 |
| countries-and-timezones | $0.01 | $0.01 | $0.02 |
| delta | $0.07 | $0.03 | $0.10 |
| node-jsonfile | $0.00 | $0.00 | $0.01 |
| pull-stream | $0.02 | $0.02 | $0.04 |
| zip-a-folder | $0.01 | $0.00 | $0.01 |
| **Total** | | | **$0.28** |

---

## Pricing source

Fetched from `GET https://openrouter.ai/api/v1/models`. Stored in `.github/thesis-model-pricing.json`.
