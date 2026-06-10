# RQ3 — Literature notes

## Sources consulted

| Slug | Citation | Sections read |
|------|----------|---------------|
| llmorpheus-paper-with-appendix-27mar2025 | Tip, F., Bell, J., & Schäfer, M. (2025) | §4.4 RQ2 manual equivalence study; related work (Tian et al. EMD); equivalent-mutant patterns |
| overcoming_the_equivalent_mutant_problem_a_systematic_literature_review_and_a_co | Madeyski, L., et al. (2014) | EMP SLR; taxonomy (DEM/SEM/AEMG); undecidability; manual-cost citation |
| a-study-on-equivalent-and-stubborn | Yao, X., Harman, M., & Jia, Y. (2014) | Manual equivalence procedure; operator-class distributions; prevalence on unkilled mutants |
| covering-and-uncovering-equivalent-mutants | Schuler, D., & Zeller, A. (2013) | Manual classification cost; 45% equiv among undetected; coverage heuristic limits |
| llms-for-equivalent-mutant-detection | Wang, D., Chen, J., et al. (2024) ISSTA | LLM vs classical EMD; fine-tuned embedding strategy; UniXCoder as *related* SOTA baseline |
| unixcoder-unified-croos-modal | Guo, D., et al. (2022) ACL | Architecture; code-fragment representation; contrastive pre-training |
| mutation-testing-advances | Papadakis, M., et al. (2019) | EMP in mutation workflow; mutation-score interpretability; cites Madeyski/Yao |

## Findings relevant to RQ3

### Problem framing (Background Block 4)

- **Equivalent mutants confound survivor-based comparisons.** An equivalent mutant preserves observable behavior; no test suite can kill it. Such mutants inflate survivor counts, depress mutation scores, and waste analysis effort without revealing test weaknesses (Tip et al., 2025; Madeyski et al., 2014; Papadakis et al., 2019).
- **The problem is undecidable** in general (Madeyski et al., 2014; Yao et al., 2014). Automated approaches therefore produce **predicted equivalence**, not proofs — a constraint the thesis must state explicitly (Schuler & Zeller, 2013; outline Block 9).
- **Prevalence varies by context.** Reported equivalent-mutant rates span a wide range depending on denominator (all mutants vs survivors vs undetected), operator set, language, and test-suite strength:
  - Tip et al. (2025): **20.2%** equivalent among **524 manually examined surviving** LLMorpheus mutants (106/524) vs **5%** for StrykerJS survivors — LLM mutants are far more equivalence-prone than rule-based mutants.
  - Schuler & Zeller (2013): **45%** of **undetected** mutants equivalent in a 140-mutation Java sample; only **7.39%** relative to all mutants.
  - Yao et al. (2014): **~23%** equivalent among **1,230 unkilled** mutants (branch-adequate suites) across 18 C programs and 58 operators.
  - Wang et al. (2024) cite **4–39%** in real-world scenarios (secondary cite via Kushigian et al.).
- **Operator/package dependence** (Yao et al., 2014): equivalence and stubbornness are unevenly distributed — e.g., ABS and half of UOI generate many equivalents; LCR generates many stubborn mutants. Supports interpreting **package-dependent** predicted-equivalence rates in thesis RQ3 (small packages with few survivors can show high percentages).

### Manual examination limits (motivation for automation)

- Tip et al. (2025): two authors, κ = **0.846** after pilot (κ = 0.873); conservative definition (any possible client-visible change → non-equivalent); some equivalents require bespoke test code.
- Schuler & Zeller (2013): **~15 min per mutation** on average (14 min 28 s across 140 mutations); manual equivalence does not scale to 10-model × multi-package modern studies.
- Madeyski SLR (2014): catalogs **17 DEM techniques** in three categories — **detecting** (DEM), **suggesting** (SEM), **avoiding generation** (AEMG) — but concludes DEM results remain far from perfect.

### Related LLM/embedding EMD work (not our method)

- **Wang et al. (2024) ISSTA** is the first large-scale LLM EMD study on **3,302 method-level Java** pairs (MutantBench). Key results for positioning:
  - LLM-based techniques outperform compiler-, ML-, and tree-NN baselines (average **+35.69% F1** vs all baselines combined).
  - **Fine-tuned code embedding** beats prompt-only strategies; **fine-tuned UniXCoder** is their best single configuration.
  - Prompting alone cannot match embedding classifiers.
- **Contrast with thesis method:** Wang et al. evaluate on Java rule-based mutants with MutantBench train/test split. **Our classifier** is a thesis-trained **UniXCoder ensemble** on Tip et al.'s **manual gold corpus** (954 labeled JS mutant pairs, 13 projects), applied at **θ = 0.80** to **LLMorpheus survivors** on thesis-six. Cite Wang EMD as *related landscape*, never as the thesis methodology.

### Our classifier base (Method Block 9)

- **Guo et al. (2022) UniXcoder:** unified cross-modal pre-training (code + AST + comments); mask-attention modes; code-fragment embeddings via contrastive learning and cross-modal generation. Provides the **encoder architecture** underlying the thesis ensemble.
- **Classifier choice (outline Block 9):** fine-tuned UniXCoder ensemble with frozen/shared encoder + MLP head; gold labels reused from Tip manual corpus (ω = 0.846; 126 equivalent / 828 behavioral = 13.2%). OOF validation: macro-F1 ≈ 0.797; asymmetric reliability — behavioral-change precision ~93–99%, equivalent precision ~78% at θ ≈ 0.94; operational threshold **θ = 0.80** for pipeline.
- **Rejected alternative:** prompt-based LLM batch screening was **not** used (reproducibility, cost, precision asymmetry). State generically only — **no GEPA citation, no python-classifier naming** in thesis prose.

### Tip et al. (2025) as directional baseline (Discussion 5.3)

- Paper RQ2 denominator matches thesis: **surviving mutants only**.
- **20.2% manual equivalent rate** is a **directional reference**, not a replication target — confounds include 6 vs 13 packages, 10 modern models vs CodeLlama-centric study, automated vs manual labels, different survivor populations.
- Thesis weighted predicted rates (**~17–24%** across models per `llm_summary.csv`) are directionally aligned with 20.2%.
- Common LLM equivalent patterns in Tip (null/undefined rewrites, `substring`/`substr`/`slice`, inert regex flags, extra call arguments) inform why embedding classifiers may struggle on equivalent side (subtle semantic-preserving edits).

### Papadakis advances (supporting)

- Mutation score assumes equal mutant value, but equivalent/redundant mutants make the metric hard to interpret (Section on subsumed/redundant mutants).
- Mutation workflow Step 3: remove equivalent mutants before scoring.
- Explicitly references Madeyski EMP SLR and Yao operator analysis — use as secondary EMP overview cite when Block 4 needs a survey pointer beyond the SLR itself.

## Gaps in our library

- Kushigian et al. (2024) equivalent mutants in the wild — optional modern prevalence cite (Tip related work mentions it).
- Papadakis & Malevris (2015) mutation testing survey chapter — optional if Block 4 needs method-history depth.
- Ma et al. preliminary ChatGPT EMD (200 mutants) — Wang EMD supersedes for scale; optional footnote only.

## Suggested citations for Writing

| Outline block | Claim / content | Primary cites |
|---------------|-----------------|---------------|
| **Background Block 4** | EMP definition, undecidability, score inflation | Madeyski et al. (2014); Papadakis et al. (2019) |
| **Background Block 4** | Prevalence in LLMorpheus context (20.2%) | Tip et al. (2025) |
| **Background Block 4** | Manual cost / scale limits | Schuler & Zeller (2013); Tip et al. (2025) |
| **Background Block 4** | Operator/package dependence | Yao et al. (2014) |
| **Background Block 4** | LLM/embedding EMD landscape (related) | Wang et al. (2024) |
| **Background Block 4** | UniXCoder as code-representation foundation | Guo et al. (2022) |
| **Method Block 9** | Classifier architecture + gold provenance | Guo et al. (2022); Tip et al. (2025) |
| **Method Block 9** | Why not LLM-as-judge for batch screening | Generic sentence only (reproducibility, cost) |
| **Method Block 9** | Wang EMD informed embedding approach | Wang et al. (2024) — **related work only** |
| **Discussion 5.3** | 20.2% directional; not replication | Tip et al. (2025) |
| **Discussion 5.3** | Predicted equivalence / effective survivors | Thesis FINDINGS; Schuler & Zeller (2013) on screening limits |
| **Discussion 5.3** | θ = 0.80 construct-validity caveat | Method Block 9 metrics; no literature p-values |
| **§5.8.2** | 17–24% vs 20.2% directional alignment | Tip et al. (2025) + FINDINGS |

## Literature ↔ thesis data bridge

- Always prefix applied labels: **predicted equivalent** / **predicted behavioral change**.
- Rank models on **effective survivors** (predicted behavioral change), not raw survivor counts — literature (Tip, Yao, Schuler) motivates; thesis magnitudes come from FINDINGS only.
- Package heatmap extremes (e.g., small packages 40–47%, high-volume <2%) echo Yao's operator/program unevenness — cite Yao for mechanism, not for exact percentages.
