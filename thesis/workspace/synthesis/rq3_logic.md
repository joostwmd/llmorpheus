# RQ3 — Synthesis

Equivalent mutants inflate survivor-based comparisons by roughly 17–24% across models — comparable to the 20.2% manual baseline in Tip et al. (2025) and far above StrykerJS operators (4.7%). Differences between modern models are modest; DeepSeek is highest (~24%), Llama 3.1 8B lowest (~17%). Effective survivors (predicted behavioral change) are the fairer comparison unit.

**Literature link:** Automated equivalence detection (see `llms-for-equivalent-mutant-detection`) enables scale; our UniXCoder classifier (macro-F1 ≈ 0.80) trades manual precision for throughput.

**Practitioner takeaway:** Do not rank models on raw survivor counts alone. Report equivalence-adjusted metrics alongside mutation scores.
