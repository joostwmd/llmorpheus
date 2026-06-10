# RQ0 Findings (source of truth)

## Data lock

| Field | Value |
|-------|-------|
| **Lock date** | June 2026 |
| **Registry** | `thesis/shared/modelRegistry.js` — all 10 models `status: ready` |
| **Package-level datasets** | **228** total (210 multi-run + 18 single-run) |
| **Cross-model comparison scope** | 10 models × 6 packages × run1 = **60** datasets |
| **RQ2 stability scope** | 7 multi-run models × 6 packages × 5 reps = **210** datasets |
| **Packages** | thesis-six (6 JavaScript): Complex.js, countries-and-timezones, node-jsonfile, pull-stream, spacl-core, zip-a-folder |
| **Template** | `template-full` |
| **System prompt** | `SystemPrompt-MutationTestingExpert` |
| **Temperature** | `0.0` |
| **maxTokens** | **250** (authoritative: `summary.json` → `metaInfo.maxTokens`; verified uniform on all 228 datasets) |
| **Reasoning** | Disabled; Gemini 3.x uses `{ effort: "minimal", exclude: true }` |
| **maxNrPrompts** | `2000` |
| **Stryker** | Custom `stryker-js` fork, `--concurrency 1`, precomputed mutators |
| **Provider** | OpenRouter only (all models) |
| **Raw artifacts** | `artifacts/`, `organized/` (repo root, gitignored) |
| **Analysis entry point** | `cd thesis && npm run all` (or per-RQ scripts) |

## Headline answer

**Yes — the experimental pipeline is ready.** All 10 models in the study matrix completed successful end-to-end runs on the thesis-six package subset. Artifacts are non-empty, parseable, and consumed without missing-input errors by the `thesis` analysis pipelines for RQ1–RQ5.

RQ0 validates **internal pipeline readiness**, not external replication of Tip et al. (2025).

## Key metrics tables (from CSVs - exact numbers)

### Model matrix (10 models)

| # | Artifact ID | OpenRouter slug | Category | Run policy | Reps | Status |
|---|-------------|-----------------|----------|------------|------|--------|
| 1 | `openai_gpt-4o-mini` | `openai/gpt-4o-mini` | api-only | multi | 5 | ready |
| 2 | `openai_gpt-4o` | `openai/gpt-4o` | api-only | single | 1 | ready |
| 3 | `google_gemini-3.1-flash-lite` | `google/gemini-3.1-flash-lite` | api-only | multi | 5 | ready |
| 4 | `google_gemini-3.5-flash` | `google/gemini-3.5-flash` | api-only | single | 1 | ready |
| 5 | `anthropic_claude-haiku-4.5` | `anthropic/claude-haiku-4.5` | api-only | multi | 5 | ready |
| 6 | `anthropic_claude-sonnet-4.5` | `anthropic/claude-sonnet-4.5` | api-only | single | 1 | ready |
| 7 | `meta-llama_llama-3.3-70b-instruct` | `meta-llama/llama-3.3-70b-instruct` | open-weight | multi | 5 | ready |
| 8 | `meta-llama_llama-3.1-8b-instruct` | `meta-llama/llama-3.1-8b-instruct` | open-weight | multi | 5 | ready |
| 9 | `qwen_qwen-2.5-coder-32b-instruct` | `qwen/qwen-2.5-coder-32b-instruct` | open-weight | multi | 5 | ready |
| 10 | `deepseek_deepseek-chat-v3.1` | `deepseek/deepseek-chat-v3.1` | hybrid | multi | 5 | ready |

**Excluded:** `meta-llama/codellama-34b-instruct` — removed from OpenRouter API (404 on every request).

### Dataset counts

| Scope | Count |
|-------|-------|
| Multi-run model × package × rep | 7 × 6 × 5 = **210** |
| Single-run model × package | 3 × 6 = **18** |
| **Total package-level datasets** | **228** |
| RQ2 analysis scope | 7 × 6 × 5 = **210** |
| Cross-model comparison (run1) | 10 × 6 = **60** |

### Run policy summary

| Policy | Reps | Models | RQs |
|--------|------|--------|-----|
| **multi** | 5 (`rep1`–`rep5`) | 7 affordable models | RQ2 uses all reps; RQ1/RQ3/RQ4/RQ5 use run1 |
| **single** | 1 (`rep1`) | 3 expensive models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5) | RQ1/RQ3/RQ4/RQ5 only |

### Pipeline health signals (from `replication.md`)

| Signal | Healthy | Broken |
|--------|---------|--------|
| LLM logs | `*** prompt tokens: …` | `AxiosError: Request failed with status code 404` |
| Mutant output | `wrote N mutants` with **N > 0** | `wrote 0 mutants in 0 locations` |
| Workflow conclusion | Success **and** non-empty artifacts | Success but empty data |
| Downstream | `thesis` RQ scripts run without missing inputs | Organize/analysis fails |

## Statistical tests (p-values, effect sizes, unit of analysis)

RQ0 is a **validation gate**, not a hypothesis test. No inferential statistics apply.

**Unit of analysis:** One package-level dataset = one model × one package × one replication run, with associated `summary.json`, `mutants.json`, and Stryker results.

**Validation criteria (binary):**
- Model produces non-zero mutants per package
- Artifacts parse successfully
- Downstream RQ scripts complete without missing-input errors

All 10 models pass on all 6 packages (228/228 datasets present in analysis scope).

## Interpretation

1. **End-to-end toolchain works:** GitHub Actions workflow (`.github/workflows/openrouter-exp.yml`) runs LLMorpheus → Stryker → artifact upload; `thesis/` organizes and analyzes outputs for RQ1–RQ5.

2. **Fixed configuration holds:** All models compared under identical conditions (template-full, T=0, maxTokens=250, reasoning off). This supports internal validity for cross-model comparison in RQ1–RQ5.

3. **Run-policy asymmetry is intentional:** Seven affordable models have 5 reps for RQ2 stability; three expensive models have 1 rep for cost feasibility. This is a design choice documented in `modelRegistry.js`, not a pipeline failure.

4. **Not a replication study:** The thesis extends LLMorpheus methodology to modern LLMs. CodeLlama-34B (paper primary model) is unavailable; thesis uses 6 packages vs paper's 13. Directional comparison to Tip et al. belongs in Discussion §5.8, not RQ0.

5. **Paper baselines within this study:** `gpt-4o-mini` and `llama-3.3-70b-instruct` appear in both the original paper and this matrix as **peers for directional comparison**, not replication targets.

## Caveats

- **Spot-check recommended:** Checklist item "logs show >0 mutants per package" should be spot-checked before final submission (`replication.md` line 112).
- **No external replication claim:** RQ0 does not prove agreement with Tip et al. (2025) numbers or CodeLlama-34B baselines.
- **Package subset:** Six-package thesis-six subset differs from paper's 13 packages — main confound for aggregate score comparison.
- **OpenRouter-only serving:** All models accessed via OpenRouter; open-weight models are not self-hosted despite category label.
- **Legacy artifacts excluded:** `google_gemini-2.5-flash`, `google_gemini-2.5-flash-thinking`, `meta-llama_llama-4-maverick` are not in the study matrix.

## Artifact index

| Artifact | Path | Role |
|----------|------|------|
| Pipeline validation doc | `thesis/rq0/replication.md` | Methodology and checklist |
| Model registry | `thesis/shared/modelRegistry.js` | 10 models, run policy, status |
| Run matrix | `thesis/meta/experiment_runs.md` | Dataset counts, scheduling |
| Model choices | `thesis/meta/model_choices.md` | Pricing, tiers, config |
| Package list | `.github/thesis-six.json` | Six benchmark packages |
| CI workflow | `.github/workflows/openrouter-exp.yml` | End-to-end run definition |
| Schedule scripts | `.github/schedule-affordable-runs.sh`, `.github/schedule-expensive-runs.sh` | Replication scheduling |
| Download helpers | `.github/download-all-runs.sh` | Artifact retrieval |
| Analysis orchestrator | `thesis/run-all.js`, `thesis/package.json` | `npm run all` |
| Shared context | `thesis/context/thesis_context.md` | Cross-RQ constants |
| Short summary pointer | `thesis/workspace/analysis/rq0_summary.md` | Agent handoff |

## Outline snippets (copy-paste answer sentences)

- RQ0 confirms that the LLMorpheus → Stryker → artifact → analysis pipeline runs correctly for all ten models in the study matrix under a fixed configuration (template-full, T = 0, maxTokens = 250, reasoning disabled).
- All 10 models completed successful runs, yielding 228 package-level datasets (210 multi-run + 18 single-run) that downstream RQ1–RQ5 scripts consume without missing-input errors.
- RQ0 establishes internal validity for the comparative study; it does not claim external replication of Tip et al. (2025).
- CodeLlama-34B was excluded because OpenRouter returns 404; the thesis uses the thesis-six package subset (six JavaScript packages) rather than the paper's thirteen.
- Affordable models (n = 7) were replicated five times for RQ2 stability analysis; expensive API models (n = 3) were run once for cost feasibility.
