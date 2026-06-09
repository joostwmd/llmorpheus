# Thesis workspace

Unified bachelor thesis workspace for the LLMorpheus modern-model evaluation (RQ0–RQ5).

## Layout

| Path | Purpose |
|------|---------|
| `meta/` | Cross-cutting docs: RQ overview, model choices, experiment runs |
| `rq0/` | Pipeline validation (`replication.md`) |
| `rq1/` … `rq5/` | Per-RQ spec (`spec.md`), analysis code, and outputs |
| `shared/` | Model registry, artifact organization, plot styling |
| `output/` | Central figures, tables, and stats (built by plot pipelines) |
| `references/` | PDF-to-markdown converter and converted papers |
| `context/` | Shared domain context for agents (`thesis_context.md`, glossary, critique rubric) |
| `workspace/` | Agent handoffs (literature, analysis, synthesis, critique notes) |
| `draft/` | Thesis manuscript prose (Writing agent only) |
| `archive/` | Deprecated planning material (do not use for agents) |

Raw experiment data lives at the **repo root**: `../artifacts/` and `../organized/` (gitignored, downloaded from CI).

## Research questions

See [`meta/rq_overview.md`](meta/rq_overview.md). RQ number matches folder name (`rq1/` … `rq5/`).

## Setup

```bash
cd thesis
npm install
pip install -r requirements.txt
pip install -r rq3/equivalent-mutants/classify/requirements.txt
pip install -r rq3/equivalent-mutants/analyze/requirements.txt
```

Ensure `../artifacts/` exists (downloaded CI artifacts).

LaTeX preamble should include:

```latex
\usepackage{booktabs, siunitx, xcolor, colortbl}
```

## Run analysis

```bash
cd thesis
npm run all          # organize + RQ1–RQ5
npm run rq1          # individual RQ
npm run rq1:plots    # regenerate figures/tables only
```

Pipelines use **real reps** from `../artifacts/` by default. RQ1/RQ3/RQ4/RQ5 use **run1** for all ready models; RQ2 uses **all reps** for affordable (`multi`) models only. Flip `status` in `shared/modelRegistry.js` (`ready | pending | failed`).

## Output layout

Each RQ writes to `rqX/output/`:

- `publication/` — main-paper artifacts (figures, tables, key CSVs)
- `appendix/` — supplementary material
- `artifacts_index.md` — placement guide for LaTeX writing

Central build output is under `output/figures/`, `output/tables/`, `output/stats/`, then copied into per-RQ folders via `shared/outputManifest.js`.

## References

| Path | Purpose |
|------|---------|
| `references/input/` | Source PDFs (not committed) |
| `references/processed/{slug}/` | Converted `paper.md`, `paper.json`, `figures/` |
| `references/_index.md` | Slug catalog for agents (APA citations, RQ tags) |

Convert a PDF to markdown:

```bash
cd references
npm install
cp .env.example .env   # add Unstructured API key
node convert.cli.js input/paper.pdf --slug paper-slug
```

Output lands in `references/processed/paper-slug/`. Track converted papers in [`references/_index.md`](references/_index.md).

## Model registry

Edit `shared/modelRegistry.js` (mirrored in `shared/model_registry.json` for Python):

- `runPolicy`: `"single"` (expensive models) or `"multi"` (affordable, 5 reps)
- `status`: `"ready"` | `"pending"` | `"failed"`

The study evaluates **10 models** — see [`meta/model_choices.md`](meta/model_choices.md).

## Agent workflow

Thesis **content** lives here; **agent prompts** live in [`.cursor/`](../.cursor/).

| Step | Agent | Output |
|------|-------|--------|
| 1 | Literature + Data (parallel) | `workspace/literature/`, `workspace/analysis/` |
| 2 | Synthesis | `workspace/synthesis/` |
| 3 | Critique | `workspace/critique/` |
| 4 | Writing | `draft/` |

Entry point: [`.cursor/README.md`](../.cursor/README.md) and [`.cursor/agents/WORKFLOW.md`](../.cursor/agents/WORKFLOW.md).

Invoke via natural-language triggers (e.g. "Summarize RQ1 results", "Draft methodology") — routed by [`.cursor/rules/thesis-agents.mdc`](../.cursor/rules/thesis-agents.mdc).
