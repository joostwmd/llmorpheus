RQ0 — Is the experimental pipeline ready?
Table

Aspect Detail
Input GitHub Actions runs (LLMorpheus + Stryker) on thesis-six for each model in the study matrix
Output Confirmation that artifacts are non-empty and parseable; standardized experimental constants documented
Aggregation Per model: successful end-to-end run with > 0 mutants per package; thesis-code organize/analysis succeeds
Expected result Pipeline validated; no external replication of the 2024 paper claimed — proceed to RQ1–RQ5
See thesis/RQ0_Replication.md for setup, checklist, and artifact layout.
RQ1 — How many mutants do different models produce and what are they?
Table

Aspect Detail
Input mutants.json (per model × package × run), StrykerOutput (per model × package × run)
Output Per model × package × run: #prompts, #candidates, #invalid, #identical, #duplicate, #valid mutants, #killed, #survived, #timed-out, mutation score, absolute Levenshtein (median/IQR), normalized Levenshtein (median/IQR)
Aggregation Per package first, then across 6 packages per model
Expected result Models differ in mutant volume and validity rates; some models produce more survivors but with larger edit distances (less subtle mutations); modern models expected to outperform original baselines
RQ2 — How consistent are different models across runs?
Table

Aspect Detail
Input mutants.json (3 runs per model × package), Stryker outputs (3 runs per model × package)
Output Per model × package: Jaccard overlap of mutant sets across runs, SD of mutation score across runs, SD of #survived across runs, SD of absolute Levenshtein across runs
Aggregation Per package first, then across 6 packages per model
Expected result Models vary significantly in stability even at T=0; open-weight models may differ from API models in consistency
RQ3 — How likely are different models to generate equivalent mutants?
Table

Aspect Detail
Input Surviving mutants from RQ1 (original fragment, replacement fragment, code context), validated equivalence classifier
Output Per model × package × run: #survived, #predicted equivalent, #predicted behavioral change, predicted equivalence rate among survivors
Aggregation Per package first, then across 6 packages per model
Expected result Equivalence rates differ across models; models with high survivor counts may be inflated by equivalents; "effective survivors" (predicted behavioral change) is a more honest metric than raw survival count
RQ4 — What does LLMorpheus cost per model?
Table

Aspect Detail
Input Token logs (input/output tokens per model × package × run), wall-clock runtime, pinned OpenRouter price snapshot, valid/survived/unique/non-equivalent mutant counts from RQ1–RQ3
Output Per model: total tokens (in/out), total cost (€), runtime, cost per valid mutant, cost per survived mutant, cost per unique survived mutant (union-based), cost per non-equivalent survived mutant, duplicate rate, invalid rate
Aggregation Summed across 6 packages per model per run, then averaged across 3 runs
Expected result Cheap models are not necessarily cost-efficient when accounting for duplicates and equivalents; Pareto frontier reveals a small subset of models with best effectiveness-to-cost ratio
RQ5 — How do open-weight vs API-only models compare?
Table

Aspect Detail
Input All outputs from RQ1–RQ4, model category labels (open-weight vs API-only)
Output Per category: distributions of mutation score, #survived, equivalence rate, stability metrics, cost per non-equivalent survivor
Aggregation Group models by category, report median/IQR per group
Expected result Open-weight models may offer better cost-efficiency but potentially lower consistency; API-only models may be more stable but more expensive; differences may be smaller than expected since category alone is not a strong predictor
