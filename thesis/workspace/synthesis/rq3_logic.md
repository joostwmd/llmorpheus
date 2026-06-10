# RQ3 — Synthesis

## Answer to the RQ (1–2 sentences)

Equivalent mutants inflate survivor-based comparisons by roughly 17–24% across models — directionally aligned with Tip et al.'s 20.2% manual baseline, not a replication claim. Differences between modern models are modest; no pairwise difference survives Holm correction. **Effective survivors** (predicted behavioral change) are the fairer comparison unit.

## Evidence from our data

- Per-model mean predicted equivalence among survivors: **17.1%** (Llama 3.1 8B) to **24.0%** (DeepSeek Chat v3.1); portfolio-weighted rate **11.1%** (883 / 7,962 survivors).
- Tip et al. manual baseline: **20.2%** among 524 examined survivors — directional reference only.
- **0 significant** pairwise differences after Holm correction (all p_holm = 1.0); largest Cohen's d = 0.33.
- Effective survivors range **520–837** on run1; Gemini 3.5 leads both raw (963) and effective (837) — high raw survivors ≠ high equivalence.
- Package heterogeneity: pull-stream ~1.9%, spacl-core ~46.9% weighted equiv. rate.
- Classifier: fine-tuned UniXCoder ensemble at θ = 0.80; macro-F1 ≈ 0.80; equivalent-class precision ~78%.
- Source: `thesis/rq3/FINDINGS.md`, `llm_summary.csv`.

## What the literature says

**Problem framing (Background Block 4).** Equivalent mutants preserve observable behavior; inflate survivor counts, depress mutation scores, and waste analysis effort (Tip et al.; Madeyski et al.; Papadakis et al.). The problem is **undecidable** in general (Madeyski; Yao) — automated approaches produce **predicted equivalence**, not proofs (Schuler & Zeller). Prevalence varies by denominator and context: Tip 20.2% among surviving LLMorpheus mutants vs 5% for StrykerJS survivors; Schuler & Zeller 45% among undetected (7.39% of all); Yao ~23% among unkilled mutants across 18 C programs. Operator/package dependence (Yao): equivalence unevenly distributed — supports interpreting package-dependent predicted rates.

**Manual examination limits.** Tip: two authors, κ = 0.846; conservative non-equivalent definition. Schuler & Zeller: ~15 min per mutation — manual equivalence does not scale to 10-model × multi-package studies. Madeyski SLR: catalogs 17 DEM techniques in three categories; DEM results remain far from perfect.

**Related LLM/embedding EMD (not our method).** Wang et al. (2024 ISSTA): first large-scale LLM EMD on 3,302 Java method pairs; fine-tuned UniXCoder beats prompt-only; LLM techniques +35.69% F1 vs baselines. **Contrast:** Wang evaluates Java rule-based mutants; our classifier is thesis-trained UniXCoder ensemble on Tip's manual gold corpus (954 labeled JS pairs), applied at θ = 0.80 to LLMorpheus survivors on thesis-six.

**Classifier base (Method Block 9).** Guo et al. (2022) UniXcoder: unified cross-modal pre-training; code-fragment embeddings via contrastive learning. Gold labels from Tip manual corpus (126 equivalent / 828 behavioral = 13.2%). Prompt-based LLM batch screening rejected (reproducibility, cost, precision asymmetry) — state generically only.

**Tip as directional baseline (Discussion 5.3).** Paper RQ2 denominator matches thesis (surviving mutants only). Common LLM equivalent patterns (null/undefined rewrites, substring/substr/slice, inert regex flags) explain why embedding classifiers struggle on the equivalent side.

## Tension / gap between ours and prior work

- Classifier labels are **predicted**, not proven; precision on equivalent class is lower (~78% at θ = 0.80) — construct-validity caveat for Discussion 5.3.
- Gold labels are from paper authors on 13-package manual sample, not re-labeled here; 6 vs 13 packages, 10 modern models vs CodeLlama-centric study, automated vs manual labels.
- Wang EMD is Java/rule-based; cite as related landscape, never as thesis methodology.
- No literature p-values for our 17–24% rates or pairwise null results — magnitudes are FINDINGS-only; Tip 20.2% is directional alignment only.

## Suggested narrative for Writing (ordered bullets)

1. Always prefix applied labels: **predicted equivalent** / **predicted behavioral change** — undecidability cite (Madeyski; Yao).
2. Background Block 4: Madeyski (EMP definition, taxonomy); Papadakis (workflow step 3); Schuler & Zeller (manual cost); Yao (operator dependence); Tip (20.2% LLM context).
3. Method Block 9: Guo et al. (UniXCoder architecture); Tip (gold corpus provenance); Wang EMD (2024) as **related work only** — not our pipeline.
4. Results: report effective survivors alongside raw survivors; mean vs weighted equiv. rate — mean for cross-model fairness, weighted for portfolio interpretation.
5. Discussion 5.3: 20.2% directional; not replication — confounds explicit; θ = 0.80 construct-validity caveat from Method Block 9 metrics.
6. §5.8.2: 17–24% vs 20.2% directional alignment — Tip + FINDINGS; package heatmap extremes cite Yao for mechanism, not exact percentages.
7. Cross-RQ: rank models on effective survivors for RQ4 cost/non-equiv denominators; defer € figures to RQ4 FINDINGS.
