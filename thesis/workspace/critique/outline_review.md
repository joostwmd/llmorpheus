# Outline critique

## Verdict
revise_before_writing

## Executive summary

The canonical outline is structurally strong: RQ0–RQ5 map cleanly to chapters, scope exclusions are explicit, the variable run-policy asymmetry is mostly handled, and the classifier methodology (Block 9) is unusually thorough for a bachelor thesis. However, the Results/Discussion/Conclusion sections embed **specific empirical claims** (Qwen 88.5%, RQ5 p-values) while `thesis/meta/experiment_runs.md` states prior runs are **invalidated** and multi-run data may be incomplete or simulated. Several meta files (`rq_overview.md`, all `rqX/spec.md` except partial RQ5) still describe the **old 7-model / Gemini 2.5** design. Background is under-specified relative to the chapter map. Fix outline–data alignment and demote provisional numbers to placeholders before drafting.

## Structural strengths

- Clear RQ0–RQ5 spine from Introduction through Conclusion; each RQ has Methodology (Block 8) + Results block + Discussion subsection.
- Scope discipline: no test generation, no reasoning comparison, no 40-bug replication, no external paper replication — repeated in multiple blocks.
- Run-policy asymmetry (7× multi / 3× single) is documented with explicit RQ2 exclusions and RQ5 Jaccard exclusion.
- Run1 as cross-model common denominator (Results chapter intro) is the right design choice for fair RQ1/RQ3/RQ4/RQ5 comparison.
- Equivalence classifier Block 9 is detailed: gold provenance, OOF validation, dual-threshold policy (θ≈0.94 vs θ=0.80), asymmetric reliability, domain-shift threat.
- Threats to validity (Methodology Block 11 + Discussion 5.6) cover construct, internal, external, and reliability concerns.
- Glossary-aligned metric definitions (mutation score denominator, effective survivors, predicted equivalence rate).
- Practitioner recommendations table (5.7) is appropriately conditional, not prescriptive.
- Artifact/output conventions tie outline blocks to `thesis/rqX/output/publication/` filenames.

## Structural weaknesses / gaps

- **Background chapter incomplete.** Chapter map (Intro Block 6) promises equivalent mutants, related work, and LLM foundations; outline Background stops at 3 blocks (mutation testing, LLMs, LLMorpheus). No dedicated blocks for equivalent-mutant literature, LLM-based mutation testing related work, or Stryker/precomputed-mutant positioning.
  - *Fix:* Add Background Blocks 4–6 (equivalent mutants; related LLM mutation work; study positioning vs Tip et al. 2025).
- **Premature empirical results in planning doc.** RQ1 answer template (lines 847–847), RQ5 answer template (964–964), Conclusion table (1073–1077), and practitioner table (1052) bake in numbers/p-values as if final.
  - *Fix:* Replace with `[PLACEHOLDER]` tokens tied to artifact regeneration gate; add explicit “provisional — regenerate after standardized rerun” banner in Results section header.
- **Within-provider tier comparisons are orphaned.** Methodology Block 4 and RQ5 Block mention cheap vs premium pairs (OpenAI, Google, Anthropic) but no Results subsection, figures, or Discussion thread.
  - *Fix:* Either add `Block RQ5b — Within-provider tier comparison` (appendix) or demote to a single Discussion paragraph with explicit non-RQ status.
- **Hybrid (DeepSeek) sensitivity analysis lacks artifacts.** RQ5 goal mentions sensitivity analysis; no table/figure slot.
  - *Fix:* Add Table RQ5-C “RQ5 with/without DeepSeek” or appendix rerun note.
- **RQ4 aggregation ambiguity.** Block 8 says RQ4 metrics are “averaged across reps for multi-run models” while Results use run1 for cross-model comparison.
  - *Fix:* State explicitly: **primary RQ4 cross-model table = run1**; rep-averaging only for optional stability-of-cost appendix.
- **Levenshtein union rule ambiguous.** Results aggregation says “optionally deduplicate mutants across reps” without choosing default for RQ1 reporting.
  - *Fix:* Lock RQ1 Levenshtein to **run1 per-mutant**; reserve union-dedup for RQ2 appendix only.
- **RQ2 data readiness not reflected in outline.** `experiment_runs.md` shows rep2–5 missing/simulated; outline writes RQ2 as if complete (only `[LOW]`/`[HIGH]` placeholders remain).
  - *Fix:* Add Results preface: “RQ2 contingent on live multi-run data”; gate RQ2 answer template on data checklist.
- **No explicit RQ1 baseline comparison protocol.** Intro gap 1 asks how modern models compare to paper baselines, but RQ1 Results block has no baseline row, figure, or statistical test vs `gpt-4o-mini` / `llama-3.3-70b-instruct` only.
  - *Fix:* Add appendix table or Discussion 5.1 bullet: directional comparison to Tip et al. numbers with different corpus caveat.
- **Literature integration hooks missing.** Outline cites Tip, Inozemtseva, Zhao but no pointers to `thesis/workspace/literature/` or synthesis cross-refs for Discussion claims.
  - *Fix:* Add “Literature anchor” bullets in Discussion blocks referencing expected synthesis files.

## RQ-by-RQ alignment

| RQ | Status | Specifics |
|----|--------|-----------|
| **RQ0** | **aligned** (minor drift) | Outline matches `thesis_context.md` and `rq0/replication.md` intent. **Drift:** `rq0/replication.md` still lists `maxTokens = 250`; outline/Block 5 says **200**. |
| **RQ1** | **misaligned** (spec stale; results provisional) | Outline 10 models, run1, Levenshtein, volume metrics — good. `rq1/spec.md` still describes **7 old models**, Gemini 2.5, 1 run, “implementation to be created.” Embedded Qwen 88.5% etc. may be from **invalidated** runs. |
| **RQ2** | **misaligned** (spec stale; data gap) | Outline: 7 models × **5 reps**. `rq2/spec.md`: **BLOCKED**, 3 runs, old models, single-run only. `rq_overview.md`: **3 runs**. `experiment_runs.md`: rep2–5 **missing**; table shows 1/3 progress. |
| **RQ3** | **aligned** (outline); **misaligned** (spec) | Outline classifier workflow, θ=0.80, 20.2% directional reference — excellent. `rq3/spec.md` uses old 7-model results (Gemini 2.5 rankings, 4,816 survivors) — stale. |
| **RQ4** | **aligned** (outline); **misaligned** (spec) | Outline Pareto, cost/non-equiv, pinned pricing — good. `rq4/spec.md` still references gemini-2.5-flash in example tables; rep-averaging rule unclear vs run1. |
| **RQ5** | **mostly aligned** | Outline Jaccard exclusion, Mann–Whitney, small-n caveat — good. `rq5/spec.md` header updated but body still lists Llama 4 Maverick / Gemini 2.5; includes Jaccard category code despite exclusion note. **Risk:** p-values in outline answer template may be from old data. |

## Rubric checklist (critique_rubric.md)

| Rubric item | Outline posture | Notes |
|-------------|-----------------|-------|
| Category labels as causal (RQ5) | **HANDLES** | Null findings, overlapping distributions, “weak predictor” framing (RQ5 template, 5.5, 6.2). |
| “Better model” without metric | **RISKS** | Practitioner table (5.7) names Qwen/GPT-4o-mini for “highest mutation score” without simultaneous validity/stability/equiv caveats in same row. Discussion 5.1 partially qualifies. |
| Modern models outperform baselines | **RISKS** | Intro gap 1 poses baseline question; no controlled baseline comparison block. `rq_overview.md` still says “expected to outperform.” Outline does not claim outright but Conclusion repeats Qwen leadership without baseline test. |
| Single-run vs multi-run fairness | **HANDLES** | Run1 common denominator; RQ2 scoped to 7 models; premium exclusion stated repeatedly. |
| Raw survivors without equivalence | **HANDLES** | RQ3 + effective survivors; Discussion 5.1/5.3 link survivors to RQ3 reframing. |
| High score from coarse edits (Levenshtein) | **HANDLES** | Levenshtein in RQ1; Discussion 5.1 “style proxy, not realism.” |
| Cost per mutant ignores dup/invalid | **HANDLES** | RQ4 duplicate/invalid rates, cost per valid, cost/non-equiv. |
| Effective survivors = ground truth | **HANDLES** | Repeated “predicted equivalent,” screening language, θ trade-off in Block 9. |
| RQ2 stability on single-run models | **HANDLES** | Explicit exclusion of 3 premium models from RQ2. |
| RQ5 includes Jaccard | **HANDLES** | Explicit exclusion in RQ5 block and thesis_context. |
| T=0 variability understated | **HANDLES** | RQ2 dedicated; Background API drift; Discussion 5.2. |
| Generalization beyond 6 packages | **HANDLES** | Scope bullets, Block 3 validity, 5.6 external threats. |
| Other languages / prompts | **HANDLES** | Fixed configuration; deferred work listed. |
| Pricing snapshot timeless | **HANDLES** | Pinned May 2026; Discussion 5.4, 6.4 recompute caveat. |
| Classifier domain shift | **RISKS** | Block 9 mentions gold from 13 projects; threat listed but Discussion 5.3 could stress **modern-model mutant distribution shift** more prominently. |
| Literature support for synthesis | **RISKS** | Outline cites papers but no workspace/literature hooks; Writing agent may overclaim without synthesis files. |
| Overstate replication | **HANDLES** | Strong “not replication” language for RQ0, RQ3 20.2%, contributions. |
| Prior work misrepresented | **HANDLES** | LLMorpheus scope accurately summarized in Background Block 3. |
| “Use model X” without trade-offs | **RISKS** | Table 5.7 has caveats column but “Highest mutation score → Qwen” still risks overclaim if stability/equiv not co-reported. |
| Self-hosting not evaluated | **HANDLES** | OpenRouter-only serving, 5.5 operational factors, 5.7 self-hosting caveat. |

## Weak / overclaimed (outline-level)

- **Claim:** Qwen 2.5 Coder 32B achieved highest median mutation score (88.5%) with fewest survivors (23.5) — stated as RQ1 answer template and Conclusion fact.
  - **Problem:** `experiment_runs.md` invalidates all prior runs (mixed 250/8000 tokens, reasoning uncontrolled). Numbers may not survive standardized rerun at maxTokens=200.
  - **Fix:** Downgrade to `[PROVISIONAL]` until post-rerun `volume_metrics.tex` verified; add config-hash footnote.

- **Claim:** RQ5 Mann–Whitney p ≈ 0.63 / 0.99 / 0.85 / 0.39 and “no significant category differences” in answer template, Discussion 5.5, Conclusion 6.2.
  - **Problem:** With n=3 vs n=6, non-significance is **low informational value**; embedding p-values in the outline invites writing them as findings before data lock. Spec/body may reflect old 7-model set.
  - **Fix:** Report effect sizes (Cliff's δ) as primary; p-values as secondary; add “underpowered category test” upfront in RQ5 Results intro.

- **Claim:** “Pipeline completed successfully for all ten models” (RQ0 answer template).
  - **Problem:** `experiment_runs.md` says GPT-4o and Gemini 3.1 Flash Lite **need to run**; rep1 reruns needed for all. Premature universal success claim.
  - **Fix:** Conditional template: “All models in matrix with **status=ready** in `modelRegistry.js` under config hash X.”

- **Claim:** Stability analysis with **5 reps × 7 models** (contributions, RQ2 block).
  - **Problem:** `experiment_runs.md` Phase 3 table tracks **1/3** reps; `model_choices.md` warns run2–5 may be **simulated symlinks**. Outline assumes 5 reps exist.
  - **Fix:** Align rep count across meta docs; outline should state actual target (3 vs 5) and minimum viable reps for Jaccard.

- **Claim:** Open-weight vs API-only comparison informs “self-hostable vs proprietary deployment.”
  - **Problem:** All models served via OpenRouter — category is **labeling paradigm**, not measured deployment mode.
  - **Fix:** Strengthen caveat in RQ5 Goal and 5.5: study compares **model families associated with** open-weight/API access, not self-hosted inference.

- **Claim:** Tier comparisons (4o-mini/4o, Flash Lite/3.5 Flash, Haiku/Sonnet) support “within-vendor cost-effectiveness analysis.”
  - **Problem:** No Results narrative; premium tiers are single-run while cheap tiers are multi-run — asymmetric for stability and cost averaging.
  - **Fix:** Scope tier analysis to run1 cost-effectiveness only; one appendix figure or drop from contributions.

- **Claim:** RQ3 weighted study-wide equivalence rate `[X]%` compared to paper 20.2%.
  - **Problem:** Classifier on modern survivors may systematically differ from manual labels; different package count (6 vs 13).
  - **Fix:** Outline already says “directional” — elevate this constraint in RQ3 answer template to **prevent** replication framing.

## Reviewer questions (prioritized, examiner-style)

1. **Data validity:** If May 2026 standardized config required rerunning all models, which results in this outline are from the **final** config hash? How do you prevent draft prose from citing invalidated runs?
2. **Rep count:** Is the study **3 or 5** repetitions for multi-policy models? `rq_overview.md` and `rq2/spec.md` say 3; outline says 5. Which drives the thesis?
3. **RQ2 evidentiary status:** If multi-run data are incomplete or simulated, is RQ2 a **full empirical contribution** or a **planned/future** analysis? Can the thesis stand if only 3 reps exist?
4. **RQ5 statistical value:** With three open-weight models, what is the power of Mann–Whitney? Why is category comparison an RQ if the design cannot detect moderate effects?
5. **OpenRouter vs open-weight:** How can you discuss self-hosting benefits when no model was self-hosted? What would change if Llama were run locally?
6. **Baseline comparison:** You name `gpt-4o-mini` and `llama-3.3-70b-instruct` as paper baselines — where is the **quantitative** comparison to Tip et al. under comparable metrics, and how do you handle the 6-vs-13 package mismatch?
7. **Classifier generalization:** Gold labels come from 13 paper projects and older models; survivors come from 6 packages and 2025–2026 LLMs. What validation did you perform on **thesis-six survivors** beyond OOF on gold?
8. **Premium model exclusion:** GPT-4o, Gemini 3.5 Flash, and Sonnet appear in effectiveness rankings (RQ1/RQ4/RQ5) but not stability (RQ2). How should practitioners interpret a “best” premium model that lacks repeatability evidence?
9. **Mutation score vs survivors:** You highlight Qwen’s high score and low survivors — does Levenshtein analysis show **subtler** or **coarser** edits for top scorers? Could high scores reflect easy-to-kill coarse mutants?
10. **Pareto definition:** RQ4 Pareto uses mutation score vs cost — why not cost per **non-equivalent survivor** as the effectiveness axis, given RQ3’s construct?
11. **CodeLlama exclusion:** How does dropping CodeLlama 34B affect claims about “modern re-evaluation” of the original study?
12. **Tier pairs:** What is the hypothesis for cheap vs premium within the same vendor, and where in Results is it answered?

## Internal inconsistencies (outline vs specs vs thesis_context)

| Topic | Outline | Other source | Severity |
|-------|---------|--------------|----------|
| Model count | 10 models incl. GPT-4o, Gemini 3.1 Flash Lite | `model_choices.md` “Models dropped” lists **GPT-4o** as dropped; also “8 models” in cost table | High |
| Multi-run reps | **5 reps** (7 models) | `rq_overview.md` **3 runs**; `rq2/spec.md` **3 runs**; `experiment_runs.md` rep2–3 only (1/3) | High |
| maxTokens | **200** (Block 5) | `rq0/replication.md` **250**; `experiment_runs.md` notes 250/8000 mixed in old runs | High |
| Model roster | Gemini **3.1/3.5**, Qwen, Haiku, GPT-4o | `rq1/2/3/4/spec.md`: Gemini **2.5**, Llama **4 Maverick**, thinking variants | High |
| RQ2 status | Full Results block | `rq2/spec.md`: **BLOCKED** insufficient data | High |
| RQ3 question | “How likely are models to generate equivalent mutants?” | `rq3/spec.md`: “Which LLM generates the **fewest** equivalent mutants?” | Medium |
| Data validity | Results numbers present | `experiment_runs.md`: **all previous runs invalidated** | Critical |
| RQ4 aggregation | Average across reps (Block 8) | Results: run1 cross-model comparison | Medium |
| API-only count | 6 API-only + 1 hybrid + 3 open-weight | `rq5/spec.md` table: 4 API + hybrids, old slugs | Medium |
| RQ0 success | All 10 models pass | `experiment_runs.md`: several models **need rerun/missing** | High |

## Suggested outline edits (concrete, section/block references)

1. **Results chapter intro (lines 764–790):** Add “Data lock” subsection: config hash (`maxTokens=200`, reasoning off), `modelRegistry.js` status, rep completeness checklist; flag all numeric templates below as provisional.

2. **Block RQ1 answer template (line 847):** Replace hard numbers with placeholders; add bullet “Baseline comparison: gpt-4o-mini and llama-3.3-70b vs Tip et al. — qualitative/directional only (6 vs 13 packages).”

3. **Block RQ2 (lines 859–884):** Add prerequisite callout: “Requires ≥3 live reps per multi-policy model; current inventory per `experiment_runs.md`.” Harmonize **3 vs 5** reps to one number repo-wide.

4. **Block RQ5 (lines 943–969):** Add Table RQ5-C hybrid sensitivity; move p-values out of answer template into “illustrative — verify from `category_tests.csv`”; add underpowered-design sentence in Goal.

5. **Methodology Block 8 RQ4 (lines 631–636):** Clarify “Table RQ4-A uses **run1** token logs; rep-averaging optional appendix only.”

6. **Methodology Block 8 RQ1 Levenshtein (lines 608–609):** Lock default: “report median/IQR on **run1 mutants**; union across reps = appendix only.”

7. **Introduction Block 3 (line 72):** Add caveat to baseline gap: “Directional only — different package subset and CodeLlama unavailable.”

8. **Background — new Block 4:** Equivalent mutants problem (manual labeling limits, EMPI literature pointer).

9. **Background — new Block 5:** Related work: LLM mutation testing, precomputed mutants, contrast with operator-based tools.

10. **Discussion 5.5 (lines 1028–1035):** Lead with “All models accessed via OpenRouter; category labels are correlational deployment paradigms, not causal.”

11. **Contributions Block 5 (lines 209–210):** Qualify category insights: “exploratory, low power” or demote if RQ5 remains null.

12. **Conclusion 6.2 table (lines 1070–1077):** Replace numeric cells with “see Results — data lock required.”

## Suggested caveats for Writing (copy-paste ready)

> This study re-evaluates LLMorpheus on modern LLMs under a fixed configuration; it does **not** replicate the original LLMorpheus paper's experimental numbers or package corpus.

> All models were accessed via OpenRouter. Open-weight vs API-only labels describe **deployment paradigms**, not measured self-hosted inference in this study.

> Cross-model comparisons for RQ1, RQ3, RQ4, and RQ5 use **run1** data. Three premium API models (GPT-4o, Gemini 3.5 Flash, Claude Sonnet 4.5) were run once for cost feasibility and are **excluded** from RQ2 stability analysis.

> Equivalence labels are **predicted** by a UniXCoder classifier (θ = 0.80), not ground-truth semantic equivalence. Behavioral-change predictions are more reliable than equivalent predictions.

> The equivalence classifier was validated on 954 manually labeled mutants from 13 paper projects; application to thesis-six survivors may differ due to **domain shift**.

> Results are limited to six JavaScript packages (thesis-six); `delta` and seven other paper packages are excluded.

> Cost figures use a pinned OpenRouter price snapshot (May 2026) and reflect **LLM API charges only**, not GitHub Actions compute or hypothetical self-hosting TCO.

> Category comparisons (RQ5) are **underpowered** (n = 3 open-weight vs n = 6 API-only) and should be interpreted as exploratory; non-significant tests do not prove equivalence of categories.

> Reported stability metrics (RQ2) apply only to models with complete multi-run data under the standardized configuration; simulated or duplicated reps must not be cited.

## Route back

- [x] Outline edits
- [x] Spec sync
- [ ] Synthesis
- [ ] Data
- [ ] Literature
