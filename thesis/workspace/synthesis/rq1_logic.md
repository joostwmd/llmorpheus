# RQ1 — Synthesis

Modern LLMs produce similar mutant *volumes* but differ in *quality signals*. Validity rates (61–83%) and mutation scores (74–89%) spread more than candidate counts. Qwen 2.5 Coder leads on mutation score with the fewest survivors; Claude Haiku trails on both validity and score. Edit-distance analysis shows Llama models make larger relative edits than Claude Sonnet.

**Literature link:** Tip et al. (2025) established that LLM mutants can complement operator-based mutation; Wang et al. (2025) note model choice matters for LLM mutation testing — our data confirm model-specific outcomes under fixed prompting.

**Practitioner takeaway:** Model selection should consider mutation score *and* survivor/equivalence context (RQ3), not volume alone. Package effects dominate; six-package scope limits generalization.
