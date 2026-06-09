# Critique rubric (study-specific)

Checklist for the Critique agent when stress-testing arguments. Apply to synthesis notes and draft sections.

## Overclaiming

- [ ] Category labels (open-weight vs API-only) treated as causal when only correlational (RQ5)
- [ ] "Better model" stated without specifying metric (score vs cost vs stability vs equivalence)
- [ ] Modern models "outperform" baselines without naming which baseline and which metric (RQ1)
- [ ] Single-run expensive models compared fairly to multi-run affordable models without caveat

## Metric confounds

- [ ] Raw survivor counts used without equivalence context (RQ3)
- [ ] High mutation score attributed to quality when driven by coarse/large edits (Levenshtein, RQ1)
- [ ] Cost per mutant ignores duplicate and invalid rates (RQ4)
- [ ] "Effective survivors" equated to ground-truth non-equivalence (classifier is screening, not proof)

## Stability and design asymmetry

- [ ] RQ2 stability claims applied to models with only single runs
- [ ] RQ5 category comparison includes Jaccard/stability metrics despite documented exclusion
- [ ] Run-to-run variability at T=0 understated

## Scope and validity

- [ ] Generalization beyond 6 JavaScript packages
- [ ] Generalization to other languages or prompt templates
- [ ] OpenRouter pricing snapshot treated as timeless
- [ ] Classifier trained on labeled set — domain shift to new models/packages acknowledged?

## Literature alignment

- [ ] Synthesis claim lacks support in `thesis/workspace/literature/` or `thesis/references/_index.md`
- [ ] Comparison to original LLMorpheus paper overstates replication (this is an updated evaluation, not replication)
- [ ] Prior work on equivalent mutants or LLM mutation testing misrepresented

## Practitioner recommendations

- [ ] Actionable "use model X" without cost, stability, and equivalence trade-offs
- [ ] Recommendations that require infrastructure the study did not evaluate (self-hosting ops, etc.)

## Verdict guidance

- **blocked:** factual error, invented statistic, or claim contradicts analysis summary
- **revise_before_writing:** overclaim or missing caveat that would mislead a reviewer
- **proceed_with_caveats:** argument is defensible if listed caveats appear in draft
