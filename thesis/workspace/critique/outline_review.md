# Outline critique (post-upgrade, June 2026)

> **Scope:** Verify that the June 2026 outline upgrade resolved prior critique gaps, cross-check embedded numbers against `thesis/rqX/FINDINGS.md`, and gate the Writing agent.

## Verdict

**proceed_with_caveats**

The outline upgrade resolves all eight targeted gaps from the prior review. Empirical claims in Results/Discussion/Conclusion now align with locked FINDINGS and publication CSVs (including the corrected RQ5 split verdict: null on effectiveness/equivalence, significant on cost). Remaining risks are secondary: literature synthesis stubs, per-RQ argument reviews not yet written, one stale handoff line in `rq4/FINDINGS.md`, and TeX/CSV artifact inconsistencies. None block drafting if Writing cites FINDINGS/CSVs only.

---

## Prior-gap verification (user checklist)

| Gap | Prior state | Current state | Evidence |
|-----|-------------|---------------|----------|
| **Background Blocks 4–6** | Background stopped at Block 3 | **Fixed** | `outline.md` Background Blocks 4 (equivalent mutants), 5 (related LLM mutation work), 6 (study positioning vs Tip/Wang) — lines 408–522 |
| **RQ5 cost p-value** | Cost p ≈ 0.39 bundled with null effectiveness | **Fixed** | Split verdict: effectiveness/equiv p = 0.633 / 0.993 / 0.861 (null); cost p = 2.75×10⁻⁵ / 3.51×10⁻⁵ (significant, Cliff's δ ≈ −0.70). Matches `rq5/FINDINGS.md` and `thesis/output/stats/rq5_category_tests.csv` |
| **RQ2 placeholders** | `[LOW]`/`[HIGH]` or contingent language | **Fixed** | Full answer template: Jaccard 0.505–0.993, H = 35.18, p = 3.98×10⁻⁶, η² = 0.83, CV details. Matches `rq2/FINDINGS.md` |
| **Data lock subsection** | Missing; numbers treated as provisional | **Fixed** | Results intro §“Data lock and source of truth” (lines 921–933): June 2026 lock, run1 vs multi-run rules, aggregation conventions |
| **Hybrid sensitivity Table RQ5-C** | No artifact slot | **Fixed** | Table RQ5-C + `hybrid_sensitivity.csv` in RQ5 block; three scenarios documented in `rq5/FINDINGS.md` |
| **Kruskal–Wallis caveat RQ1** | Risk of overclaiming Qwen leadership | **Fixed** | RQ1 answer template + Discussion §5.1: null omnibus (p = 0.995 / 0.977), package dominance, descriptive leaders ≠ statistical superiority |
| **OpenRouter caveat Discussion 5.5** | Category framed as deployment without serving caveat | **Fixed** | §5.5 leads with OpenRouter serving caveat; self-host TCO not modeled |
| **FINDINGS as source of truth** | `workspace/analysis/rqX_summary.md` handoff risk | **Fixed** | Explicit table: authoritative prose = `thesis/rqX/FINDINGS.md`; summaries agent-only |

### Additional prior gaps also resolved (not in user checklist)

| Gap | Status |
|-----|--------|
| Within-provider tier comparison orphaned | **Fixed** — Block Tier (§4.6), Methodology Block 8 tier bullets, Discussion §5.4 hook |
| RQ4 run1 vs rep-averaging ambiguity | **Fixed** — Block 8 data lock: Table RQ4-A run1 only |
| RQ1 Levenshtein union ambiguity | **Fixed** — run1 per-mutant medians locked; union reserved for RQ2 |
| Baseline / Tip et al. comparison protocol | **Fixed** — Discussion §5.8, Intro gap baseline caveat, Table RQ1-B per-package peers |
| RQ5 underpowered design | **Fixed** — RQ5 Goal design note; Cliff's δ primary in FINDINGS |
| Contributions overclaim on category | **Fixed** — Block 5 split verdict language |

---

## Remaining gaps (specific)

1. **Literature synthesis hooks still absent.** Discussion blocks cite Tip/Wang/Inozemtseva but do not point to `thesis/workspace/literature/rqX_notes.md` (all still `<!-- TODO -->`). Writing may lack synthesis-backed mechanism claims unless Literature agent runs first.

2. **Per-RQ argument reviews not populated.** `thesis/workspace/critique/rq0–rq5_argument_review.md` remain TODO stubs. Outline gate is clear; per-RQ devil's-advocate passes are still outstanding before section drafting.

3. **Stale cross-reference in RQ4 FINDINGS.** `rq4/FINDINGS.md` RQ5 handoff still says cost “directional in RQ5; *p* ≈ 0.39” — contradicts locked `rq5_category_tests.csv`. Outline is correct; fix FINDINGS handoff line before Writing copies from RQ4 file.

4. **Publication artifact inconsistencies (RQ4).** `cost.tex` marks all models Pareto=yes; `rq4_pareto.tex` empty. Outline correctly prefers `model_cost_summary.csv`; Writing must not cite TeX Pareto column without CSV check.

5. **Spec/meta drift (outline-external).** Prior review flagged `rqX/spec.md` and `rq_overview.md` stale vs 10-model matrix. Outline and FINDINGS are aligned; spec sync is still a documentation hygiene task, not an outline blocker.

6. **RQ3 dual-rate reporting.** Outline answer template emphasizes mean rates (17–24%) and portfolio-weighted 11.1%. Writing must explain both (package-composition confound) or reviewers will ask why “~one in five” coexists with 11.1% study-wide.

---

## Strong claims (defensible)

- **RQ0:** Pipeline ready for all 10 models; 228 package-level datasets; internal validity, not external replication.
- **RQ1:** Comparable volumes; descriptive score spread (Qwen 88.5% vs Haiku 73.6%); **no significant omnibus model effect** on score/survivors; package effects dominate.
- **RQ2:** Large stability spread at T = 0 (Jaccard 0.505–0.993); **significant** model effect on Jaccard (p = 3.98×10⁻⁶); score CV low but set overlap can be ~50%.
- **RQ3:** Mean predicted equivalence 17–24% among survivors; directionally consistent with paper 20.2%; **no pairwise model difference** after Holm; effective survivors reframe rankings.
- **RQ4:** Cost/non-equiv separates models; four Pareto-efficient models on score vs cost/non-equiv; cheap API tiers win nonEquivYield 3/3; tier upgrade marginal cost $0.039–$0.058 per extra non-equiv survivor.
- **RQ5 (split verdict):** **Null** on mutation score, survivors, equivalence (|δ| ≤ 0.08); **significant** cost separation (~16× median, δ ≈ −0.70); hybrid sensitivity does not change verdict.
- **Positioning:** Extends Tip et al.; directional comparison on six shared packages; invalid 13-vs-6 aggregate comparison explicitly blocked in §5.8.

---

## Weak / overclaimed

- **Claim:** “Qwen leads” / practitioner table “Highest mutation score → Qwen”
  - **Problem:** Kruskal–Wallis p = 0.995; n = 6 packages per model; no Holm-significant pairwise pair.
  - **Fix:** Always pair with “descriptive leader, not statistically confirmed superiority”; cite per-package heatmap.

- **Claim:** “Category predicts API cost” / open-weight ~16× cheaper
  - **Problem:** All open-weight models served via OpenRouter; cost finding is **token-price economics**, not self-host TCO. Three open-weight models vs six API-only — cost significance is robust but category is coarse.
  - **Fix:** Qualify as “open-weight **models in this OpenRouter study**”; GPT-4o-mini as API counterexample.

- **Claim:** “Four Pareto-efficient models”
  - **Problem:** 2D frontier only (mutation score vs cost/non-equiv); omits stability, validity, equivalence. TeX artifacts disagree with CSV.
  - **Fix:** Cite `model_cost_summary.csv` `paretoEfficient` column; note stability–cost tension (ρ = 0.964, n = 7).

- **Claim:** RQ3 equivalence rates “consistent with” paper 20.2%
  - **Problem:** Automated θ = 0.80 vs manual labels; 6 vs 13 packages; portfolio-weighted 11.1% ≠ paper headline without composition discussion.
  - **Fix:** “Directionally aligned”; report mean (17–24%) and weighted (11.1%) with package table.

- **Claim:** Tier premium “yields more non-equiv survivors”
  - **Problem:** Portfolio +98–107 survivors but Wilcoxon on per-package counts not significant (except borderline OpenAI p = 0.0625); premium single-run asymmetry.
  - **Fix:** “Descriptive portfolio gain”; emphasize cost/non-equiv and nonEquivYield, not survivor-count significance.

- **Claim:** “Persistent T = 0 instability” for longitudinal peers
  - **Problem:** Strong for GPT-4o-mini / Llama 3.3 70B in this matrix; premium peers lack RQ2 data.
  - **Fix:** Scope instability claims to seven multi-run models; name peers explicitly.

---

## Reviewer questions (prioritized)

1. With n = 6 packages per model, what power do Kruskal–Wallis and Mann–Whitney tests have to detect moderate model or category effects? How do you avoid interpreting null tests as proof of equivalence?
2. All models—including open-weight—ran via OpenRouter. What can you claim about self-hosting vs API deployment beyond token list prices?
3. The equivalence classifier was validated on 954 paper mutants (13 projects). What evidence supports applying it to 2025–2026 LLM survivors on thesis-six beyond OOF metrics?
4. Premium API models appear in effectiveness and cost rankings but lack RQ2 stability data. How should practitioners weigh a high run1 score without repeatability evidence?
5. Qwen has the highest mutation score but also high normalized Levenshtein (0.630). Could high scores reflect easier-to-kill edits rather than subtler faults?
6. RQ5 uses 18 vs 36 package-level observations (3 vs 6 models). Why is category comparison an RQ if effectiveness tests are underpowered by design?
7. Portfolio-weighted equivalence is 11.1% but per-model means are 17–24%. Which rate should practitioners use, and why do they diverge?
8. CodeLlama-34B is unavailable. How does that limit claims about “modern re-evaluation” of the original LLMorpheus study?
9. Pareto analysis uses mutation score as the quality axis—why not effective survivors or cost per non-equiv on both axes?
10. Several publication TeX files disagree with CSV locks (`cost.tex` Pareto). Which artifact chain did you treat as authoritative?

---

## Suggested caveats for Writing (copy-paste ready)

> Headline numbers are locked from `thesis/rqX/FINDINGS.md` and publication CSVs (June 2026). Do not cite `thesis/workspace/analysis/rqX_summary.md` in draft prose.

> This study extends LLMorpheus on modern LLMs; it does **not** replicate Tip et al. (2025) aggregates. Comparisons to the paper are **directional** and limited to shared packages where noted (§5.8).

> Cross-model comparisons for RQ1, RQ3, RQ4, and RQ5 use **run1**. Three premium API models were run once and are **excluded** from RQ2 stability analysis.

> All models were accessed via **OpenRouter**. Open-weight vs API-only labels describe deployment paradigms relevant to practitioners, not measured self-hosted inference or TCO.

> RQ1 descriptive leaders (e.g., Qwen 88.5% mutation score) coexist with **non-significant** Kruskal–Wallis omnibus tests (p = 0.995 / 0.977); **package identity explains more variance than model identity**.

> Equivalence labels are **predicted** (UniXCoder, θ = 0.80), not ground-truth proofs. Behavioral-change predictions are more reliable than equivalent predictions.

> RQ5 **split verdict:** Mann–Whitney finds **no significant** category differences on mutation score (p = 0.633), survivors (p = 0.993), or equivalence rate (p = 0.861), but **significant** differences on cost per survivor (p = 2.75×10⁻⁵) and cost per non-equiv survivor (p = 3.51×10⁻⁵). Non-significant quality tests do **not** prove category equivalence (n = 3 vs 6 models).

> Cost figures use a pinned OpenRouter snapshot (May 2026) and reflect **LLM API charges only**, not GitHub Actions compute or self-hosting infrastructure.

> Pareto membership and tier economics: cite `model_cost_summary.csv` and `tier_comparison.csv`, not TeX columns that may be stale.

---

## Rubric checklist (critique_rubric.md)

| Rubric item | Post-upgrade posture |
|-------------|---------------------|
| Category labels as causal (RQ5) | **HANDLES** — split verdict, correlational framing, underpowered caveat |
| “Better model” without metric | **HANDLES** — metric-specific Discussion; practitioner table still needs co-caveats per row |
| Modern models outperform baselines | **HANDLES** — §5.8 directional only; modest shift on shared six packages |
| Single-run vs multi-run fairness | **HANDLES** — run1 common denominator; RQ2 scoped |
| Raw survivors without equivalence | **HANDLES** — RQ3 effective survivors threaded through RQ4/RQ5 |
| Levenshtein confound | **HANDLES** — style proxy language; Qwen high norm. Levenshtein noted |
| Cost ignores dup/invalid | **HANDLES** — RQ4 waste metrics |
| Effective survivors = ground truth | **HANDLES** — predicted/screening language throughout |
| RQ2 on single-run models | **HANDLES** — explicit exclusion |
| RQ5 includes Jaccard | **HANDLES** — excluded with rationale |
| T=0 variability | **HANDLES** — RQ2 + Background API drift |
| Six-package generalization | **HANDLES** — repeated scope limits |
| Pricing timeless | **HANDLES** — pinned snapshot + recompute caveat |
| Classifier domain shift | **RISKS** — Block 9 + §5.3; needs survivor-sample validation narrative in prose |
| Literature support | **RISKS** — synthesis stubs empty |
| Replication overclaim | **HANDLES** — strong not-replication language |
| Practitioner “use model X” | **RISKS** — table 5.7 usable if each row carries stability/equiv/cost co-caveats |
| Self-hosting not evaluated | **HANDLES** — OpenRouter caveat prominent |

---

## Route back

- [x] Outline edits (June 2026 upgrade complete)
- [ ] **Synthesis** — populate `workspace/literature/rqX_notes.md` before mechanism-heavy Discussion prose
- [ ] **Data** — fix stale RQ4→RQ5 handoff in `rq4/FINDINGS.md`; regenerate or quarantine `cost.tex` / `rq4_pareto.tex` inconsistencies
- [ ] **Literature** — Background Blocks 4–5 cite Wang et al. and equivalent-mutant detection; ensure `references/processed/` slugs match draft citations
- [ ] **Critique (per-RQ)** — run argument-mode reviews (`rq0–rq5_argument_review.md`) before Writing drafts each Results subsection

---

## Writing gate

| Condition | Status |
|-----------|--------|
| Outline verdict | **proceed_with_caveats** |
| FINDINGS locked for RQ0–RQ5 | **Yes** |
| Eight targeted outline gaps | **All resolved** |
| Blockers for draft start | **None** if Writing reads FINDINGS + cites CSVs only |
| Recommended before Discussion | Synthesis + per-RQ argument critiques |
