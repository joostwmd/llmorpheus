# Equivalent Mutants

Pipeline for classifying **Stryker-surviving mutants** with the UniXCoder ensemble and analyzing equivalent-mutant rates across LLMs.

```
equivalent-mutants/
├── classify/          # UniXCoder model + batch classification
│   ├── data/          # converted mutant CSVs (+ training data)
│   ├── results/       # classifier predictions
│   └── runs/          # model checkpoints
├── analyze/           # aggregation, statistics, tables, plots
│   ├── config.yaml
│   ├── output/
│   └── logs/
└── lib/               # shared config, discovery, Stryker parsing
```

## Setup

From the repo root:

```bash
python3 -m venv equivalent-mutants/.venv
source equivalent-mutants/.venv/bin/activate
pip install -r equivalent-mutants/classify/requirements.txt
pip install -r equivalent-mutants/analyze/requirements.txt
export PYTORCH_ENABLE_MPS_FALLBACK=1
```

Ensure the classifier checkpoint exists under `equivalent-mutants/classify/runs/ensemble-…-equiv-push-v1/`.

## Run everything

```bash
source equivalent-mutants/.venv/bin/activate
python equivalent-mutants/analyze/run_complete_analysis.py --source organized --threshold 0.8
```

Use `--force` to reconvert and reclassify. Use `--skip-classifier` if predictions already exist.

## Run steps individually

```bash
# 1. Convert surviving mutants to CSV
python equivalent-mutants/classify/convert_mutants.py --source organized

# 2. Classify with UniXCoder
python equivalent-mutants/classify/run_classifier.py --source organized --threshold 0.8

# 3. Analyze, tables, plots
python equivalent-mutants/analyze/run_complete_analysis.py --source organized --skip-classifier
```

Only mutants with `status == "Survived"` in `mutation.html` are converted and classified (aligned with the original LLMorpheus paper RQ2 denominator).
