# Glossary (locked terminology)

Use these terms consistently across all agents and draft prose.

| Term | Definition |
|------|------------|
| **Mutation testing** | Technique that evaluates test suites by injecting faults (mutants) and checking whether tests detect them |
| **Mutant** | Modified version of the program under test |
| **LLMorpheus** | LLM-driven mutation testing tool: placeholders in source code are filled by an LLM with buggy replacements |
| **Mutation score** | Fraction of non-equivalent mutants killed by the test suite (killed / (killed + survived + timed-out), excluding invalid) |
| **Valid mutant** | Syntactically acceptable, non-identical, non-duplicate candidate that runs in Stryker |
| **Surviving mutant** | Valid mutant not killed by tests (may indicate weak tests or equivalence) |
| **Equivalent mutant** | Mutant with identical behavior to the original program; surviving equivalents do not indicate test weakness |
| **Effective survivors** | Survivors predicted to be behavioral changes (non-equivalent) by the RQ3 classifier |
| **Predicted equivalence rate** | Share of survivors classified as equivalent (RQ3); screening estimate, not ground truth |
| **Jaccard overlap** | Similarity of mutant sets across repeated runs (RQ2 stability) |
| **Levenshtein distance** | Edit distance between original fragment and replacement; proxy for mutation subtlety (absolute and normalized) |
| **Open-weight model** | Model with publicly available weights; self-hostable category in this study |
| **API-only model** | Proprietary model accessed only via vendor API |
| **Hybrid model** | Open weights accessed via API (DeepSeek Chat v3.1 in this study) |
| **Cost per non-equivalent survivor** | Token cost divided by survivors predicted to be behavioral changes (RQ4) |
| **Pareto frontier** | Models not dominated on mutation score vs cost (RQ4) |
| **Run policy** | `single` (one rep) or `multi` (five reps) per model in `modelRegistry.js` |
| **Publication artifacts** | Main-paper outputs in `rqX/output/publication/` |
| **Appendix artifacts** | Supplementary outputs in `rqX/output/appendix/` |
