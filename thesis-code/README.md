# Thesis analysis code

Node.js pipelines for thesis research questions (RQ1–RQ5). RQ3 uses the existing Python equivalent-mutant classifier under `rq3/equivalent-mutants/`.

The thesis evaluates **8 non-reasoning models** (see `thesis/Model_Choices.md`); reasoning and deprecated variants are excluded from CI and analysis.

## Setup

```bash
cd thesis-code
npm install
```

Ensure `artifacts/` exists at the repo root (downloaded CI artifacts) and Python dependencies for RQ3 are installed:

```bash
pip install -r rq3/equivalent-mutants/classify/requirements.txt
pip install -r rq3/equivalent-mutants/analyze/requirements.txt
```

## Run everything (5 simulated runs from rep1)

```bash
npm run all -- --simulate-runs 5
```

Or:

```bash
node run-all.js --simulate-runs 5
```

## Run individual RQs

```bash
npm run rq1 -- --simulate-runs 5
npm run rq2 -- --simulate-runs 5
npm run rq3 -- --simulate-runs 5
npm run rq4 -- --simulate-runs 5
npm run rq5
```

## Output layout

Each RQ writes to `rqX/output/`:

- `thesis/` — aggregated tables, LaTeX, and charts for the main thesis body
- `appendix/` — per-run and per-model CSVs for the appendix

## Simulated runs

With only `rep1` data available, `--simulate-runs 5` duplicates run1 four times (symlinks in `organized/`, in-memory duplication for JS RQs, copied prediction CSVs for RQ3). Replace with real runs as experiments complete; use `--real-only` on RQ1/RQ2 when multiple reps exist.
