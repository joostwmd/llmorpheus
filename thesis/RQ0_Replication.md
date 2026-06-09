# RQ0 — Replication of the Original LLMorpheus Study

## Overview

**Goal:** Validate that this repository’s pipeline (LLMorpheus → Stryker → artifacts) works correctly and produces results consistent with the original [LLMorpheus paper](https://arxiv.org/abs/2404.09952) before running the thesis experiments (RQ1–RQ5).

**Scope:** Partial replication on the **thesis-six** benchmark (6 packages), using the paper’s **primary model** (`codellama-34b-instruct`). This is a sanity check, not a full 13-package reproduction.

| Aspect | Detail |
|--------|--------|
| **Packages** | `.github/thesis-six.json` — Complex.js, countries-and-timezones, node-jsonfile, pull-stream, spacl-core, zip-a-folder |
| **Model** | `codellama-34b-instruct` (paper’s main model; OpenRouter slug likely `meta-llama/codellama-34b-instruct`) |
| **Replications** | **1** — sufficient for pipeline validation; use 5 reps only when studying variability (thesis RQ2) |
| **Template** | `template-full` |
| **System prompt** | `SystemPrompt-MutationTestingExpert` |
| **Temperature** | `0.0` |
| **maxTokens** | **`250`** (paper setting — not 8000) |
| **maxNrPrompts** | `2000` |

## What This Does and Does Not Prove

**Proves:**

- Checkout, build, mutant generation, Stryker, and artifact extraction work end-to-end
- Per-package metrics are in the same ballpark as the paper for the 6 thesis packages
- `thesis-code` analysis can consume the produced artifacts

**Does not prove:**

- Full 13-package aggregate totals from Table 3 in the paper
- Exact numeric equality on live API runs (LLMs are nondeterministic even at T=0)
- Behavior of modern thesis models (Claude, Gemini, DeepSeek, etc.)

---

## Phase 1 — Replay (recommended first, no LLM cost)

Replay uses recorded prompts and completions from the original authors. Mutant **generation** is deterministic; only Stryker is re-executed.

### 1. Get recorded data

Clone the public dataset:

```bash
git clone https://github.com/neu-se/mutation-testing-data.git
```

Recordings are organized as:

```
mutation-testing-data/
  {package}/
    codellama-34b-instruct/
      template-full-0.0/
        run354/   # … run359 (5 original replications)
          zip/mutants.zip
```

Pick **one run** (e.g. `run354`). Unzip `mutants.zip` for each thesis package you want to test. The unzipped directory must contain `summary.json` and a `prompts/` folder (see `src/model/ReplayModel.ts`).

### 2. Build LLMorpheus

```bash
npm install
npm run build
```

### 3. Replay mutant generation (local)

For each package, check the `files` glob in `.github/thesis-six.json`, then:

```bash
# Example: zip-a-folder
node benchmark/createMutants.js \
  --path /path/to/zip-a-folder \
  --mutate "lib/*.ts" \
  --replay /path/to/unzipped-recording
```

Replay infers model, temperature, maxTokens, and system prompt from the recording’s `summary.json`. No OpenRouter API key is required.

### 4. Run Stryker (same as CI)

Follow the steps in the root `README.md` (custom Stryker from `neu-se/stryker-js`, `--usePrecomputed`, `MUTANTS_FILE` pointing at the generated `mutants.json`).

### 5. Compare results

Check `summary.json` after replay against the recording’s original `summary.json`:

- `nrPrompts`, `nrCandidates`, `nrSyntacticallyValid`, `nrSyntacticallyInvalid`
- `nrIdentical`, `nrDuplicate`, `nrLocations`

These should match exactly. Token counts may differ (replay reports 0 tokens).

After Stryker, compare `StrykerInfo.json` against the paper’s per-package rows (codellama-34b-instruct, T=0, run #312):

| Package | #Mutants | #Killed | #Survived | #Timeout | Mutation score |
|---------|----------|---------|-----------|----------|----------------|
| Complex.js | 1,199 | 725 | 473 | 1 | 60.55 |
| countries-and-timezones | 217 | 188 | 29 | 0 | 86.64 |
| node-jsonfile | 154 | 49 | 48 | 57 | 68.83 |
| pull-stream | 769 | 441 | 271 | 57 | 64.76 |
| spacl-core | 239 | 199 | 39 | 1 | 83.68 |
| zip-a-folder | 100 | 23 | 3 | 74 | 97.00 |

Small differences in Stryker counts can occur if Node/Stryker versions differ from 2024; large divergences indicate a pipeline bug.

### Replay in GitHub Actions

The current `.github/workflows/openrouter-exp.yml` workflow does **not** support `--replay`; it always calls the live API. For CI-based replay you would need to:

1. Download/unzip the relevant `mutants.zip` in a workflow step
2. Pass `--replay <dir>` instead of `--model …` to `createMutants.js`
3. Omit OpenRouter secrets for the generation step

Phase 1 can be done **locally** without workflow changes.

---

## Phase 2 — Live run (optional, validates OpenRouter + CI)

Run this after Phase 1 passes, if you want to confirm the **GitHub Actions + OpenRouter** path works with today’s provider.

### GitHub Actions settings

Use workflow: **Mutation Testing Experiment (OpenRouter)** (`.github/workflows/openrouter-exp.yml`).

| Input | Value |
|-------|-------|
| **packages** | `thesis-six.json` |
| **model** | `meta-llama/codellama-34b-instruct` (verify slug on OpenRouter) |
| **template** | `template-full` |
| **systemPrompt** | `SystemPrompt-MutationTestingExpert` |
| **temperature** | `0.0` |
| **maxTokensInCompletion** | **`250`** |
| **replication** | `1` |

Ensure repository secrets `OPENROUTER_LLM_API_ENDPOINT`, `OPENROUTER_LLM_AUTH_HEADERS`, and `LLMORPHEUS_LLM_PROVIDER` are set.

### After the workflow completes

1. Download artifacts (`mutants-*`, `results-*`) or use `.github/download-all-runs.sh` if configured
2. Place under `artifacts/meta-llama_codellama-34b-instruct/rep1/` (or run `thesis-code` organize step)
3. Compare per-package `summary.json` and `StrykerInfo.json` to the reference table above

Expect **qualitative** agreement (similar rank order and magnitudes), not bit-identical mutants. The paper reports 89–99% mutant overlap across 5 live runs for Code Llama 34B at T=0.

---

## Phase 3 — Wire into thesis analysis (optional)

Once artifacts exist:

```bash
cd thesis-code
node run-all.js
```

Or organize manually and run individual RQs. RQ0 does not require simulated runs (`--simulate-runs`).

---

## Checklist

- [ ] **Phase 1:** Replay `codellama-34b-instruct` on ≥1 thesis package; `summary.json` matches recording
- [ ] **Phase 1:** Stryker results for all 6 thesis packages are plausible vs paper table
- [ ] **Phase 2 (optional):** One live GHA run on `thesis-six.json` with `maxTokens=250`
- [ ] **Phase 2 (optional):** Artifacts land in `artifacts/` with expected layout
- [ ] Document any justified divergences (Stryker version, package pin drift, provider change)

---

## When to Stop and Proceed to Thesis Experiments

You are ready to run the main thesis model matrix (RQ1–RQ5) when:

1. Replay proves mutant extraction matches published completions
2. Stryker + artifact layout produce parseable `StrykerInfo.json` / `mutants.json`
3. (Optional) One live replication run completes without CI failures on all 6 packages

Use **5 replications per model** only for the formal thesis study — especially **RQ2 (consistency)** — not for this RQ0 validation.

---

## References

- Paper: [LLMorpheus: Mutation Testing using Large Language Models](https://arxiv.org/abs/2404.09952)
- Recorded runs: [neu-se/mutation-testing-data](https://github.com/neu-se/mutation-testing-data)
- Replay usage: root `README.md` (`--replay` section)
- Thesis packages: `.github/thesis-six.json`
- CI workflow: `.github/workflows/openrouter-exp.yml`
