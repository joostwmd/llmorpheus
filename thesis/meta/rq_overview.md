# Research questions overview

RQ number = folder name (`thesis/rq0/` … `thesis/rq5/`).  
**Model matrix:** `thesis/meta/model_choices.md` · **Registry:** `thesis/shared/modelRegistry.js`

## Run policy (all RQs)

- **7 multi-run models:** 5 reps (`rep1`–`rep5`) — used fully in **RQ2**; **run1 only** in RQ1, RQ3, RQ4, RQ5 for fair cross-model comparison
- **3 single-run models:** 1 rep (`rep1`) — included in RQ1, RQ3, RQ4, RQ5; **excluded from RQ2**

---

## RQ0 — Is the experimental pipeline ready?

| Aspect | Detail |
|--------|--------|
| **Input** | GitHub Actions runs (LLMorpheus + Stryker) on thesis-six for each model in the study matrix |
| **Output** | Confirmation that artifacts are non-empty and parseable; standardized experimental constants documented |
| **Aggregation** | Per model: successful end-to-end run with > 0 mutants per package; `thesis` organize/analysis succeeds |
| **Expected result** | Pipeline validated; no external replication of the 2024 paper claimed — proceed to RQ1–RQ5 |

See `thesis/rq0/replication.md`.

---

## RQ1 — How many mutants do different models produce and what are they?

| Aspect | Detail |
|--------|--------|
| **Input** | `mutants.json`, `StrykerInfo.json` per model × package × **run1** |
| **Models** | All **10** models |
| **Output** | Per model: #prompts, #candidates, #invalid, #identical, #duplicate, #valid, #killed, #survived, #timed-out, mutation score, Levenshtein (median/IQR) |
| **Aggregation** | Per package first, then median/IQR across 6 packages per model |
| **Expected result** | Models differ in volume, validity, and edit subtlety; modern models compared directionally to paper baselines (`gpt-4o-mini`, `llama-3.3-70b-instruct`) |

---

## RQ2 — How consistent are different models across runs?

| Aspect | Detail |
|--------|--------|
| **Input** | `mutants.json`, Stryker outputs — **5 reps** per model × package |
| **Models** | **7 multi-run models only** (3 single-run models excluded) |
| **Output** | Per model × package: Jaccard overlap, SD/CV of mutation score, survivors, edit distance |
| **Aggregation** | Per package first, then across 6 packages per model |
| **Expected result** | Models vary in stability even at T=0; stability is not assumed from category labels |

---

## RQ3 — How likely are different models to generate equivalent mutants?

| Aspect | Detail |
|--------|--------|
| **Input** | Surviving mutants from RQ1 (**run1**), UniXCoder equivalence classifier |
| **Models** | All **10** models |
| **Output** | Per model: #survived, #predicted equivalent, #predicted behavioral change, predicted equivalence rate, effective survivors |
| **Aggregation** | Per package first, then across 6 packages per model |
| **Expected result** | Equivalence rates differ; effective survivors more informative than raw survivor counts; paper 20.2% rate is directional reference only |

---

## RQ4 — What does LLMorpheus cost per model?

| Aspect | Detail |
|--------|--------|
| **Input** | Token logs (**run1**), pinned OpenRouter pricing, RQ1–RQ3 counts |
| **Models** | All **10** models |
| **Output** | Per model: total tokens, total cost (€), cost per valid/survived/non-equiv mutant, duplicate/invalid rates, Pareto frontier |
| **Aggregation** | Summed across 6 packages per model on **run1** |
| **Expected result** | Cheap models are not always cost-efficient when duplicates and equivalents are accounted for |

---

## RQ5 — How do open-weight vs API-only models compare?

| Aspect | Detail |
|--------|--------|
| **Input** | RQ1–RQ4 outputs (**run1**), category labels from registry |
| **Models** | 3 open-weight · 6 api-only · 1 hybrid (DeepSeek) |
| **Output** | Per category: distributions of mutation score, survivors, equivalence rate, cost per non-equiv survivor |
| **Excluded** | Cross-run Jaccard / stability (unequal rep counts — see RQ2) |
| **Aggregation** | Group by category; median/IQR; Mann–Whitney with small-n caveat |
| **Expected result** | Category alone is a weak predictor; differences may be smaller than expected |
