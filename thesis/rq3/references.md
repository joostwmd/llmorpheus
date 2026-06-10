# RQ3 — References for writing

> Curated from `thesis/references/processed/`. Primary = cite first for equivalent mutants and classifier methodology.

## Primary sources (4)

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Madeyski, L., Orzeszyna, W., Torkar, R., & Józala, M. (2014). Overcoming the equivalent mutant problem. *IEEE TSE*, 40(1), 23–42. | `overcoming_the_equivalent_mutant_problem_a_systematic_literature_review_and_a_co` | EMP definition; undecidability; DEM/SEM/AEMG taxonomy |
| Yao, X., Harman, M., & Jia, Y. (2014). Equivalent and stubborn mutation operators. *ICSE* (pp. 919–930). | `a-study-on-equivalent-and-stubborn` | Operator-dependent equivalence; ~23% equiv among unkilled; stubborn vs equivalent relationship |
| Guo, D., Lu, S., Duan, N., Wang, Y., Zhou, M., & Yin, J. (2022). UniXcoder. *ACL* (pp. 7212–7225). | `unixcoder-unified-croos-modal` | **Our** classifier base encoder (Method Block 9) |
| Wang, D., Chen, J., Tian, Z., Cao, X., Shu, H., & Kamei, Y. (2024). LLMs for equivalent mutant detection. *ISSTA* (pp. 1–13). | `llms-for-equivalent-mutant-detection` | **Related** LLM/embedding EMD on Java — not our method |

## Supporting sources (2)

| APA (short) | Slug | Use when writing |
|-------------|------|------------------|
| Schuler, D., & Zeller, A. (2013). Covering and uncovering equivalent mutants. *STVR*, 23(5), 353–374. | `covering-and-uncovering-equivalent-mutants` | Manual equiv cost (~15 min); 45% equiv among undetected; screening ≠ proof |
| Papadakis, M., Kintis, M., Zhang, J., Jia, Y., Le Traon, Y., & Harman, M. (2019). Mutation testing advances. *Advances in Computers*, 112, 275–378. | `mutation-testing-advances` | EMP in mutation workflow; mutation-score interpretability; pointer to Madeyski/Yao |

## Cross-RQ / background only

- **Tip et al. (2025). LLMorpheus** — manual equiv **20.2%** among survivors; gold-label corpus (954 mutants, ω = 0.846); equivalent-mutant patterns — see `rq1/references.md`.
- Jia & Harman (2010) mutation survey — foundations via `rq1/references.md`.
- Wang comprehensive (2025) Java LLM mutation study — RQ1/RQ5 landscape, not RQ3 classifier.
- Tip paper cites Tian et al. / Kushigian et al. for EMD context — optional depth only; Wang (2024) is the processed primary for LLM EMD.

## Outline hooks for this RQ (claim → citation)

| Claim | Citation | Notes |
|-------|----------|-------|
| "Equivalent mutants confound survivor counts and mutation scores" | Madeyski; Tip; Papadakis | Background Block 4 |
| "Equivalence detection is undecidable; labels are predicted" | Madeyski; Yao | Background Block 4 + Method Block 9 |
| "In this study (RQ3, θ=0.80): package-dependent 40–47% vs <2% predicted equiv" | **FINDINGS only** | Outline Bg 4 labels as thesis data — not literature benchmarks |
| "20.2% manual equiv among survivors — directional reference only" | Tip | Discussion 5.3; §5.8.2 |
| "Manual equivalence does not scale (~15 min/mutant)" | Schuler & Zeller; Tip | Background Block 4 → automation motivation |
| "Equivalence rates vary by operator/package" | Yao | Background Block 4; package heatmap discussion |
| "Fine-tuned UniXCoder ensemble at θ = 0.80 (our method)" | Guo; Tip (gold); **FINDINGS** (rates) | Method Block 9; Results RQ3 |
| "Classifier not ground-truth semantic proof" | Schuler; Method Block 9 limits | Discussion 5.3 |
| "LLM-as-judge rejected for batch screening" | Generic sentence only | **No GEPA cite** |
| "Wang EMD: LLM embeddings outperform classical EMD on Java" | Wang (2024) | Related work contrast — **not our pipeline** |
| "17–24% predicted equiv across models" | **FINDINGS only** | Do not attribute to literature |
| "Effective survivors preferred over raw survivors" | Tip + Yao (motivation); FINDINGS (magnitudes) | Discussion 5.3; RQ4 link |

## Gaps (optional external cites)

- Kushigian et al. (2024) equivalent mutants in the wild — prevalence taxonomy; mentioned in Tip related work, not in library.
- Ma et al. preliminary ChatGPT EMD (small N) — superseded by Wang (2024) for writing.
