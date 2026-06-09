# RQ0 — Pipeline Validation & Experimental Setup

## Overview

**Goal:** Confirm that this repository’s end-to-end toolchain works before interpreting results from RQ1–RQ5.

This is **not** an external replication of the original [LLMorpheus paper](https://arxiv.org/abs/2404.09952). The thesis does not claim to reproduce the paper’s CodeLlama 34B numbers or to prove the paper right or wrong. The paper is cited as the **method and tool** this work extends; RQ1–RQ5 are a **new comparative study** of modern LLMs under a shared, standardized setup.

**What RQ0 answers:** *Does our pipeline (LLMorpheus → Stryker → artifacts → `thesis-code`) run correctly and produce parseable data for all models in the study?*

---

## What the GitHub Actions workflow already validates

Workflow: **Mutation Testing Experiment (OpenRouter)** (`.github/workflows/openrouter-exp.yml`).

Each package job runs the full loop:

1. Checkout and build the benchmark package
2. **LLMorpheus** mutant generation (live OpenRouter API)
3. **Stryker** with precomputed mutants (`--usePrecomputed`)
4. Upload artifacts (`mutants-*`, `results-*`)

If runs complete with **non-zero mutants** and `thesis-code` can organize and analyze the artifacts, the pipeline is validated. No separate replay step or comparison to the 2024 paper is required.

### Signs of a healthy run

| Signal | Healthy | Broken (e.g. deprecated model) |
|--------|---------|--------------------------------|
| LLM logs | `*** prompt tokens: …` | `AxiosError: Request failed with status code 404` |
| Mutant output | `wrote N mutants` with **N > 0** | `wrote 0 mutants in 0 locations` |
| Workflow conclusion | Success **and** non-empty artifacts | Success but empty data (errors swallowed per prompt) |
| Downstream | `thesis-code` RQ scripts run without missing inputs | Organize/analysis fails |

---

## Experimental constants (held fixed across RQ1–RQ5)

All models are compared under **identical** conditions. These are design choices for internal validity, not replication of the paper’s exact configuration.

| Parameter | Value |
|-----------|-------|
| **Packages** | `.github/thesis-six.json` — Complex.js, countries-and-timezones, node-jsonfile, pull-stream, spacl-core, zip-a-folder |
| **Template** | `template-full` |
| **System prompt** | `SystemPrompt-MutationTestingExpert` |
| **Temperature** | `0.0` |
| **maxTokens** | `250` (see `thesis/Experiment_Runs.md` if a repo-wide config change applies) |
| **maxNrPrompts** | `2000` |
| **Stryker** | Custom `stryker-js` fork, `--concurrency 1`, precomputed mutators |

---

## Model matrix

**10 models** in the thesis study (see `thesis/Model_Choices.md`). Each is a peer in the comparison — including `gpt-4o-mini` and `llama-3.3-70b-instruct`, which also appeared in the original paper, but only as **baselines within this study**, not as replication targets.

| Included | OpenRouter slug | Role in this thesis |
|----------|-----------------|---------------------|
| ✅ | `openai/gpt-4o-mini` | Cheap OpenAI baseline |
| ✅ | `openai/gpt-4o` | Premium OpenAI (tier comparison) |
| ✅ | `google/gemini-3.1-flash-lite` | Cheap Google |
| ✅ | `google/gemini-3.5-flash` | Premium Google |
| ✅ | `anthropic/claude-haiku-4.5` | Cheap Anthropic |
| ✅ | `anthropic/claude-sonnet-4.5` | Premium Anthropic |
| ✅ | `meta-llama/llama-3.3-70b-instruct` | Open-weight 70B |
| ✅ | `meta-llama/llama-3.1-8b-instruct` | Open-weight small |
| ✅ | `qwen/qwen-2.5-coder-32b-instruct` | Code-specialized open-weight |
| ✅ | `deepseek/deepseek-chat-v3.1` | Hybrid / cost-efficient |
| ❌ | `meta-llama/codellama-34b-instruct` | **Excluded** — removed from OpenRouter API (404 on every request) |

---

## Artifact layout

After workflows finish, artifacts are organized for analysis:

```
artifacts/
  {provider}_{model}/     # e.g. openai_gpt-4o-mini
    rep1/
      {package}/
        summary.json
        mutants.json
        StrykerInfo.json
        ...
```

Download helpers: `.github/download-run.sh`, `.github/download-all-runs.sh`  
Organize and analyze: `thesis-code/` (`node run-all.js` or per-RQ scripts)

---

## What RQ0 does and does not prove

**Proves (internal validity):**

- CI checkout, build, LLMorpheus, Stryker, and artifact extraction work end-to-end
- Every model in the matrix can produce non-empty, parseable results
- `thesis-code` can consume artifacts for RQ1–RQ5

**Does not prove:**

- Agreement with the 2024 LLMorpheus paper (no external replication claim)
- That any model “matches” CodeLlama 34B or other legacy baselines
- Full 13-package coverage from the original study (thesis uses 6 packages only)

---

## Checklist — ready for RQ1–RQ5?

- [ ] At least one successful GHA run per model in the matrix (or documented reason for exclusion)
- [ ] Logs show token usage and **> 0 mutants** per package (not 404 / empty runs)
- [ ] Artifacts organized under `artifacts/` / `organized/` with expected layout
- [ ] `cd thesis-code && npm run all` (or equivalent) completes without missing-input errors
- [ ] Experimental parameters documented in methods section (template, T=0, maxTokens, packages)

---

## Scheduling runs

Affordable models (multiple reps for RQ2):

```bash
.github/schedule-affordable-runs.sh <rep_number>
```

Expensive models (single rep):

```bash
.github/schedule-expensive-runs.sh 1
```

Workflow inputs: `thesis-six.json`, `template-full`, `SystemPrompt-MutationTestingExpert`, `temperature=0.0`, `maxTokensInCompletion=250`.

Repository secrets: `OPENROUTER_LLM_API_ENDPOINT`, `OPENROUTER_LLM_AUTH_HEADERS` (optional: `LLMORPHEUS_LLM_PROVIDER`).

---

## Relation to main research questions

| RQ | Depends on RQ0? |
|----|------------------|
| **RQ1** Volume & quality | Yes — needs valid `mutants.json` / `summary.json` per model |
| **RQ2** Consistency | Yes — needs multiple reps with non-empty mutant sets |
| **RQ3** Equivalent mutants | Yes — needs surviving mutants from Stryker |
| **RQ4** Cost | Yes — needs token logs from live generation |
| **RQ5** Open-weight vs API | Yes — needs complete RQ1–RQ4 inputs |

Once the checklist above passes, proceed with the full model matrix. Use **5 replications** per affordable model for RQ2; single rep for expensive models (see `thesis/Experiment_Runs.md`).

---

## References

- LLMorpheus (method): [arXiv:2404.09952](https://arxiv.org/abs/2404.09952)
- Model list & pricing: `thesis/Model_Choices.md`
- Run matrix & status: `thesis/Experiment_Runs.md`
- CI workflow: `.github/workflows/openrouter-exp.yml`
- Packages: `.github/thesis-six.json`
