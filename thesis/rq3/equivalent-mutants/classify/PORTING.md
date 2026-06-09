# Porting the classifier to your analysis repo

Use this when the **experiment repo** trains the UniXcoder ensemble and another repo holds **RQ analysis** (counts, plots, comparative stats).

## What to copy

### 1. Weights + config (the “model”)

Copy the **entire** ensemble run directory, e.g.:

`runs/ensemble-…-equiv-push-v1/`

It must contain at least:

| Path | Purpose |
|------|---------|
| `config.json` | `window`, `input_format`, `pooling`, `model_name`, `ensemble`, … |
| `tokenizer/` | Saved tokenizer (local) |
| `folds/fold*_seed*/classifier_head.pt` | One head per fold×seed |
| `thresholds.json` | Optional; `predict.py` defaults to `macro_f1` threshold unless you pass `--threshold` |

First inference run also downloads **`microsoft/unixcoder-base`** from Hugging Face (~500 MB) unless it is already in the HF cache.

### 2. Python modules (inference-only)

These files are enough for **batch prediction** (no training, no `python-classifier`):

- `model.py`
- `inference.py`
- `context.py` — for `--window 0` + `split_diff`, only `pair_text_for_model` is used (no `benchmarks/libs` needed). If you ever use `window > 0` or `full`, you must ship benchmark sources or refactor context extraction.
- `predict.py`

Keep them in a single package directory in the analysis repo, e.g. `tools/unixcoder_infer/`, and run from that directory **or** set `PYTHONPATH`.

You do **not** need: `train.py`, `train_cv.py`, `evaluate.py`, `metrics.py`, `losses.py`, `dataset.py` (unless you add training there).

### 3. Dependencies

Copy `requirements.txt` (or merge into the analysis project):

- `torch`, `transformers`, `pandas`, `numpy`, `tqdm`, `python-dotenv` (dotenv optional if you do not use `.env`)

## How to run in the analysis repo

From the folder that contains the four modules (or with `PYTHONPATH` pointing there):

```bash
export PYTORCH_ENABLE_MPS_FALLBACK=1   # Apple Silicon — optional but common
python predict.py \
  --run-dir /path/to/ensemble-…-equiv-push-v1 \
  --csv mutants.csv \
  --threshold 0.8
```

`predict.py` writes `mutants.predictions.csv` next to the input, with columns `pred_eval`, `equiv_prob`, `threshold`, etc.

**CSV columns:** For **`window`** `0` (your best setup), rows need text fragments **`original`** / **`replacement`**, or **`original_code`** / **`mutant_code`** (aliases are normalized in `predict.py`). Match the same fragment convention as in training.

**Fixed rule for thesis:** use the **same** `--run-dir`, **`--threshold 0.8`**, and **same input format** for every generator/run you compare.

## Pinning reproducibility

- Record: run directory name, commit hash of this repo (or tarball of the run dir), `config.json`, and **θ = 0.8**.
- In the thesis methods: “predicted equivalent” = softmax class-1 probability ≥ 0.8; cite validation metrics on the labeled benchmark (precision/recall at 0.8).

## Optional: installable package

For a cleaner analysis repo, you can turn the four files into a minimal `pyproject.toml` package (e.g. `mutant-classifier-infer`) and ship the `runs/…` path via config or env `CLASSIFIER_RUN_DIR`.
