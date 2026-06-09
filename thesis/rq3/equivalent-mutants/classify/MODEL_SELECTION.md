# Model performance and selection

This note summarises **`runs/*/metrics.json`** (outputs written after training/OOF evaluation). **Important:** metrics are **not all on the same sample size**:

| **`n`** | Meaning |
|---------|--------|
| **954** | Full labeled dataset (typically **ensemble OOF/stacked predictions** aligned to `data/all.csv`). |
| **191** | **Validation split only** (`data/validation.csv`) for single `train.py` runs. |

Do **not** compare FP/TP counts **across rows with different `n`** as if they were the same benchmark.

---

## How well did the models perform?

- **Lead ensemble (`n=954`)** — **`ensemble-20260517-130830Z-window-w0-ep18-k5-s3-isplitdiff-pclsmm-focal2-bs-ck-tfeq-ls5-eqw175-ml512-bs8-lr2e-4-equiv-push-v1`**  
  - **Macro-F1 ~0.797**, **κ ~0.595**, **MCC ~0.608**, accuracy ~0.92.  
  - **Equivalent class (at stored `chosen_threshold` ≈ 0.94 on OOF):** precision-equiv **~0.78**, recall-equiv **~0.54**, **FP = 19** behavioural mutants called equivalent (**126** gold equivalents ⇒ **FN = 58** misses).  
  - **Behavioural class:** **`precision_behavioral`** is **very high** (~0.93–0.99 depending on θ) at common thresholds — **when the model predicts `BEHAVIORAL_CHANGE`, it is almost always correct**. The harder side is **`precision_equiv`** / false equivalents. See README → *Asymmetric reliability*.
- **Second ensemble (`best-effort`, same `n=954`):** macro-F1 **~0.786**, **higher recall-equiv (~0.56)** but **more false positives (FP = 31)** — worse under a **“avoid false equivalents first”** policy.

- **Single best checkpoint on validation (`n=191`):** **`20260516-161534Z-window-w0-ep15-frozen-ml512-bs8-lr2e-4`** achieves **macro-F1 ~0.795** there with **FP = 5** and recall-equiv **0.56**. It is **not** directly comparable row-for-row with the ensembles (different `n` / protocol).

Generated leaderboard (sorted by macro-F₁):

```bash
cd equivalent-mutants/classify
source .venv/bin/activate   # optional
python compare_runs.py
python compare_runs.py --pick-best
# Recall filter for --pick-best (default ≥ 0.45):
python compare_runs.py --pick-best --pick-min-recall-equiv 0.5
python compare_runs.py --pick-best --pick-min-recall-equiv 0   # pure min-FP then max-recall
```

---

## Chosen model (your criteria)

**Policy:** minimise **false positives** (behavioural mutants predicted equivalent); **second**, maximise **recall on true equivalents** (TP / (TP + FN)).

1. **`n = 954` (use for thesis inference on the full pipeline)**  
   **Pick:** **`ensemble-20260517-130830Z-…-equiv-push-v1`**. Among the **full-benchmark ensembles** it has the **fewer FP** (**19 vs 31**), comparable recall-equiv (~0.54 vs ~0.56), **best macro‑F₁**, κ, and MCC.  
   **There is no run with FP = 0** in the saved metrics without pushing the threshold so high that recall collapses; “no FP” here means **minimal FP among strong, usable models**.

2. **`n = 191` validation-only leaderboard (single `train.py` snapshots)**  
   With **`compare_runs.py --pick-best`** and default **recall-equiv ≥ 0.45** (drops degenerate ultra-low-recall checkpoints), the script picks **`20260516-161534Z-window-w0-ep15-frozen-ml512-bs8-lr2e-4`** (FP = 5, recall-equiv ≈ 0.56).

**Production recommendation:** use the **`-equiv-push-v1`** ensemble directory for **`predict.py` / downstream analysis**, with a **threshold** documented in your thesis (**~0.94** matches `metrics.json` OOF tuning; **0.80** was used for a balanced macro‑F₁ / precision‑recall trade-off on **`evaluate.py`** over **`data/all.csv`** — see README).

Full directory name:

`runs/ensemble-20260517-130830Z-window-w0-ep18-k5-s3-isplitdiff-pclsmm-focal2-bs-ck-tfeq-ls5-eqw175-ml512-bs8-lr2e-4-equiv-push-v1`

---

## Port to the analysis repo

See **[PORTING.md](PORTING.md)** — copy **`model.py`**, **`inference.py`**, **`context.py`**, **`predict.py`**, that **`runs/…`** folder, merge **`requirements.txt`**, then e.g.

`python predict.py --run-dir …/ensemble-…-equiv-push-v1 --csv YOUR.csv --threshold 0.80`

Adjust **`--threshold`** to match what you report in Ch. Methods.
