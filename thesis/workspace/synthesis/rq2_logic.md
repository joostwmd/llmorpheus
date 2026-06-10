# RQ2 — Synthesis

Run-to-run stability at T = 0 is not guaranteed. Jaccard overlap spans 0.50 (Llama 70B) to 0.99 (Claude Haiku), showing that some models regenerate nearly identical mutant sets while others produce largely different sets across five repetitions. Low CV in aggregate mutation scores can mask this set-level instability.

**Literature link:** Tip et al. (2025) reported temperature-dependent variability; we show model-dependent variability persists even at T = 0.

**Practitioner takeaway:** Benchmarks and CI pipelines should fix model *and* expect non-trivial variance for unstable models (Llama, DeepSeek). Stability does not align with open-weight vs API-only labels (RQ5).
