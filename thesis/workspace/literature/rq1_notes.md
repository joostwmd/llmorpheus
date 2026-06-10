# RQ1 — Literature notes

## Sources consulted

| Slug | Citation | Sections read |
|------|----------|---------------|
| `llmorpheus-paper-with-appendix-27mar2025` | Tip, F., Bell, J., & Schäfer, M. (2025) | Intro, §3 approach, §4 evaluation, appendix validity funnel tables, edit-distance appendix, manual equivalence |
| `comprehensive-study-on-llms-for-mutation-test` | Wang, B., et al. (2025) | §1–2 study design, RQ1 effectiveness, RQ2 validity (compilability/duplicate/equiv), diversity & AST edit distance |
| `an_analysis_and_survey_of_the_development_of_mutat` | Jia, Y., & Harman, M. (2010) | §II theory: CPH, coupling, mutation process, mutation score definition, equivalent mutant problem |
| `coverage-is-not-correlated` | Inozemtseva, L., & Holmes, R. (2014) | Abstract, §1–4: coverage vs mutation effectiveness on large Java programs |
| `mutant-census` | Gopinath, R., et al. (2014) | Abstract, §1–2: CPH qualification via bug-fix token patterns (~3–4 tokens typical) |
| `software-testing-verif-rel-2024-ahmed-a-new-perspective-on-the-competent-program` | Ahmed, Z., et al. (2024) | Abstract, §1: CPH via Defects4J higher-order mutation paths; operator gaps |
| `mutation-testing-advances` | Papadakis, M., et al. (2019) | §2 background (mutation score, stillborn/live), §3 coverage correlation limits, §9 experimental methodology |
| `wang-software-testing-with-llms-2024` | Wang, J., et al. (2024) | §1–2: LLM testing survey; mutation testing as accompaniment to LLM test gen |
| `mutation-guided-unit-test-gen-with-llms` | Wang, G., et al. (2025) MutGen | §I: scope contrast — mutation guides *test* generation, not mutant generation |
| `effective-test-generation-using-pre-trained-llms` | Dakhel, A. M., et al. (2024) MuTAP | §1: scope contrast — surviving mutants augment prompts for *tests* |

## Findings relevant to RQ1

### Background Block 1 — mutation testing foundations

- **Mutation testing operationalizes adequacy beyond coverage.** Inozemtseva & Holmes (2014) find only low–moderate correlation between statement/decision/MC/DC coverage and mutation-based effectiveness when suite size is controlled — coverage is useful for locating under-tested code, not as a quality target. Supports thesis motivation; does **not** predict per-model LLM ranking in our study.
- **CPH and coupling justify small syntactic faults.** Jia & Harman (2010) formalize competent programmer hypothesis and coupling effect as foundations for first-order mutants; mutation score = killed / non-equivalent mutants (conventions vary for invalid, equivalent, timed-out).
- **CPH is empirically qualified, not assumed.** Gopinath et al. (2014) on 5,000 OSS projects: typical bug-fix involves **~3–4 tokens**; most real faults do not match a single standard operator — supports interpreting Levenshtein as *comparative subtlety*, not semantic realism. Ahmed et al. (2024) add that CPH may hold while **classic operators miss** real fault patterns (method calls, new blocks) — bridges to LLMorpheus motivation (Tip et al.).
- **Mutation score interpretation caveats.** Papadakis et al. (2019): equivalent and redundant mutants inflate/depress scores; stillborn (invalid) mutants must be filtered; mutation score alone is an imperfect adequacy proxy — aligns with RQ1 reporting validity funnel + RQ3 equivalence adjustment in Discussion.

### Background Block 5 — LLM mutation testing landscape

- **Operator-based vs LLM-generated trade-off (Wang comprehensive 2025).** On 851 Java bugs (Defects4J + ConDefects), six LLMs vs PIT/Major/LEAM/μBert: LLMs achieve **higher fault detection** (e.g. GPT-4o-mini 90.8% vs PIT 40.1%) and **greater AST diversity** (49 new node types vs Major's 2), but worse **compilability** (+36.1 pp), **duplication** (+13.1 pp), and **equivalence** (+4.2 pp) vs rule-based tools. Major: 97.6% compilability, 0% duplicates, 2.0% equivalent. **Complementary to our study** (Java vs JS, different pipeline) — cite for landscape contrast, not numeric comparison to thesis-six medians.
- **LLMorpheus baseline (Tip et al. 2025).** Placeholder-guided JS mutants; validity funnel (#invalid, #identical, #duplicate → #mutants); package-level score spread (e.g. Complex.js ~60%, zip-a-folder ~97%, `q` ~12%); **20.2% manual equivalent among survivors** (codellama-34b subset); T=0 variability for gpt-4o-mini, llama-3.3-70b. Appendix reports string edit distances per model. Directional peers for this thesis: `gpt-4o-mini`, `llama-3.3-70b-instruct` only — not replication of 13-package aggregates.
- **LLM testing survey positioning.** Wang, J., et al. (2024): mutation testing commonly **accompanies** LLM test generation; acknowledges coverage weakness — positions RQ1 as mutant-*generation* study within broader LLM-for-testing literature.
- **Scope exclusions (Block 5).** **MutGen** (Wang, G., et al. 2025): maximizes mutation *score of generated tests* via mutation feedback in prompts — inverse direction from LLMorpheus. **MuTAP** (Dakhel et al. 2024): augments prompts with surviving mutants to improve test effectiveness (93.57% MS on synthetic bugs) — cite only to delimit scope (“we generate mutants, not tests guided by mutants”).

### Discussion §5.1 hooks — what literature supports vs FINDINGS-only

| Discussion claim | Literature support | Our data |
|------------------|-------------------|----------|
| Package dominates model (KW p≈1 on score/survivors) | Tip et al.: wide package spread on shared benchmarks | **FINDINGS** for omnibus tests |
| Score vs survivors trade-off (Qwen vs Haiku) | Papadakis: score and survivor counts confounded by equivalence | **FINDINGS** for model medians |
| Validity wastes budget independently of score | Wang comprehensive: LLM validity costs; Tip funnel metrics | **FINDINGS** (e.g. Haiku ~61% validity) |
| Levenshtein as style proxy, not realism | Gopinath ~3–4 token faults; Wang comprehensive AST edit distance | **FINDINGS**; omnibus p=0.133 |
| Descriptive leaders ≠ statistical superiority | — | **FINDINGS only** — do not cite literature for p-values |
| Cross-package ranking instability | Tip per-package tables; Wang comprehensive project variance | **FINDINGS** heatmap |

## Gaps in our library

- DeMillo et al. (1978) founding paper — cite via Jia & Harman (2010) survey.
- Foster et al. (2025) Meta mutation-guided test gen — optional Block 5 contrast; not in processed library.
- Direct Java↔JS comparability study — none; Wang comprehensive and Tip remain language-specific peers.

## Suggested citations for Writing

- **Background Block 1:** Inozemtseva & Holmes (2014); Jia & Harman (2010); Papadakis et al. (2019); optional Gopinath et al. (2014) or Ahmed et al. (2024) for CPH depth.
- **Background Block 5:** Tip et al. (2025); Wang, B., et al. (2025 comprehensive); MutGen + MuTAP as **contrast only**.
- **Background Block 6 / positioning:** Tip + Wang comprehensive gap table (ten models, stability, equiv-adjusted cost) — see outline Block 6.
- **Results RQ1:** **FINDINGS** + `volume_metrics.tex` for all numbers; Tip for package-spread precedent only.
- **Discussion §5.1:** Lead package dominance (FINDINGS); cite Papadakis for score/survivor interpretation; cite Gopinath or Wang comprehensive for Levenshtein caveat; defer equivalence reframing to §5.3 / RQ3 refs.
- **Scope exclusion sentence:** “Unlike MutGen and MuTAP, this study evaluates LLM *mutant generation* via LLMorpheus, not mutation-guided *test* generation.”
