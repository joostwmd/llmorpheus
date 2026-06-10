# RQ1 — Synthesis

## Answer to the RQ (1–2 sentences)

Modern LLMs produce similar mutant *volumes* but differ in *quality signals*. Validity rates and mutation scores spread more than candidate counts; package identity dominates model identity in omnibus tests. Model selection should consider mutation score *and* survivor/equivalence context (RQ3), not volume alone.

## Evidence from our data

- Comparable volumes (~301–354 candidates/package); validity 61–83%, mutation scores 74–89%.
- Descriptive leaders: Qwen 2.5 Coder (88.5% score, 24 survivors); Claude Haiku trails (73.6%, 39 survivors).
- Kruskal–Wallis: **no significant model effect** on score (p = 0.995) or survivors (p = 0.977); package effects dominate.
- Levenshtein: Llama models make larger relative edits; omnibus p = 0.133 (non-significant).
- Longitudinal peers `gpt-4o-mini` and `llama-3.3-70b` overlap Tip et al. roster — directional only, not replication targets.
- Source: `thesis/rq1/FINDINGS.md`, `model_summary.csv`.

## What the literature says

**Mutation testing foundations (Background Block 1).** Inozemtseva & Holmes (2014) find only low–moderate correlation between coverage and mutation-based effectiveness — coverage locates under-tested code, not adequacy. Jia & Harman (2010) formalize the competent programmer hypothesis (CPH) and coupling effect; mutation score = killed / non-equivalent mutants (conventions vary for invalid, equivalent, timed-out). Gopinath et al. (2014) qualify CPH empirically: typical bug-fix involves ~3–4 tokens; Ahmed et al. (2024) add that classic operators miss real fault patterns (method calls, new blocks) — bridging to LLMorpheus motivation. Papadakis et al. (2019): equivalent and redundant mutants inflate/depress scores; stillborn mutants must be filtered; mutation score alone is an imperfect adequacy proxy — aligns with reporting validity funnel + RQ3 equivalence adjustment.

**LLM mutation landscape (Background Block 5).** Wang et al. (2025 comprehensive) on 851 Java bugs: LLMs achieve higher fault detection and greater AST diversity than PIT/Major, but worse compilability (+36.1 pp), duplication (+13.1 pp), and equivalence (+4.2 pp). Complementary to our study (Java vs JS, different pipeline) — landscape contrast, not numeric benchmark. Tip et al. (2025): placeholder-guided JS mutants; validity funnel; wide package-level score spread; 20.2% manual equivalent among survivors; T = 0 variability for gpt-4o-mini and llama-3.3-70b; appendix edit distances. Wang, J., et al. (2024) survey positions mutation testing as accompaniment to LLM test generation — frames RQ1 as mutant-*generation* study.

**Scope exclusions.** MutGen (Wang, G., et al. 2025) maximizes mutation *score of generated tests* via mutation feedback — inverse direction. MuTAP (Dakhel et al. 2024) augments prompts with surviving mutants for test gen — cite only to delimit scope ("we generate mutants, not tests guided by mutants").

## Tension / gap between ours and prior work

- Wang comprehensive is Java/PIT-focused; numeric comparison to thesis-six JS medians is landscape-only, not competing benchmark.
- Tip aggregates use 13 packages — invalid for direct score comparison (Discussion §5.8); only `gpt-4o-mini` and `llama-3.3-70b` are directional peers.
- No processed paper directly compares ten modern LLMs on LLMorpheus JS volume/quality — **this thesis fills that gap**.
- Descriptive leaders (Qwen vs Haiku) coexist with non-significant omnibus tests — literature does not supply our p-values; package dominance is FINDINGS-backed with Tip precedent for wide package spread only.

## Suggested narrative for Writing (ordered bullets)

1. **Lead with package dominance + null omnibus** before naming descriptive leaders — avoid implying statistical superiority from medians alone.
2. Background Block 1: Inozemtseva & Holmes (2014); Jia & Harman (2010); Papadakis et al. (2019); optional Gopinath or Ahmed for CPH depth.
3. Background Block 5: Tip et al. (2025) + Wang comprehensive (2025) gap table; MutGen + MuTAP as **contrast only**.
4. Results RQ1: **FINDINGS** + `volume_metrics.tex` for all numbers; Tip for package-spread precedent only.
5. Discussion §5.1: package dominance (FINDINGS); Papadakis for score/survivor interpretation; **Gopinath (2014)** for Levenshtein caveat per outline §5.1; defer equivalence reframing to §5.3 / RQ3.
6. Scope exclusion sentence: "Unlike MutGen and MuTAP, this study evaluates LLM *mutant generation* via LLMorpheus, not mutation-guided *test* generation."
7. §5.8: invalid to compare 13-package paper aggregates vs 6-package thesis medians — Tip directional peers on shared packages only.
