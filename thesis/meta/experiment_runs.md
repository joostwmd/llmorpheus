# Experiment run matrix

Canonical summary of completed thesis runs. See `thesis/shared/modelRegistry.js` for status.

**Last updated:** June 2026  
**Config:** template-full, T=0, maxTokens=250, reasoning disabled, thesis-six packages  
**Data locations:** `artifacts/`, `organized/` (repo root, gitignored)

## Run policy

| Policy | Reps | Models | RQs |
|--------|------|--------|-----|
| **multi** | 5 (`rep1`–`rep5`) | 7 affordable models | RQ2 uses all reps; RQ1/RQ3/RQ4/RQ5 use run1 |
| **single** | 1 (`rep1`) | 3 expensive models | RQ1/RQ3/RQ4/RQ5 only |

## Model matrix (all runs complete)

| Artifact ID | OpenRouter slug | Policy | Reps | Status |
|-------------|-----------------|--------|------|--------|
| `openai_gpt-4o-mini` | `openai/gpt-4o-mini` | multi | 5 | ready |
| `openai_gpt-4o` | `openai/gpt-4o` | single | 1 | ready |
| `google_gemini-3.1-flash-lite` | `google/gemini-3.1-flash-lite` | multi | 5 | ready |
| `google_gemini-3.5-flash` | `google/gemini-3.5-flash` | single | 1 | ready |
| `anthropic_claude-haiku-4.5` | `anthropic/claude-haiku-4.5` | multi | 5 | ready |
| `anthropic_claude-sonnet-4.5` | `anthropic/claude-sonnet-4.5` | single | 1 | ready |
| `meta-llama_llama-3.3-70b-instruct` | `meta-llama/llama-3.3-70b-instruct` | multi | 5 | ready |
| `meta-llama_llama-3.1-8b-instruct` | `meta-llama/llama-3.1-8b-instruct` | multi | 5 | ready |
| `qwen_qwen-2.5-coder-32b-instruct` | `qwen/qwen-2.5-coder-32b-instruct` | multi | 5 | ready |
| `deepseek_deepseek-chat-v3.1` | `deepseek/deepseek-chat-v3.1` | multi | 5 | ready |

## Dataset counts

| Scope | Count |
|-------|-------|
| Multi-run model × package × rep | 7 × 6 × 5 = **210** |
| Single-run model × package | 3 × 6 = **18** |
| **Total package-level datasets** | **228** |
| RQ2 analysis scope | 7 models × 6 packages × 5 reps = **210** |
| Cross-model comparison (run1) | 10 models × 6 packages = **60** |

## Excluded legacy artifacts

Not in the study matrix (`thesis/shared/modelMeta.js`):

- `google_gemini-2.5-flash`
- `google_gemini-2.5-flash-thinking`
- `meta-llama_llama-4-maverick`

## Scheduling (reference)

```bash
# Affordable models — one rep at a time
.github/schedule-affordable-runs.sh <1-5>

# Expensive models — single rep
.github/schedule-expensive-runs.sh 1
```

Download: `.github/download-all-runs.sh`  
Analyze: `cd thesis && npm run all`
