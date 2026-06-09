import { category, displayName } from "../shared/modelMeta.js";
import { median, mannWhitneyU } from "../shared/statistics.js";

const METRICS = [
  { key: "mutationScore", label: "Mutation score" },
  { key: "nrSurvived", label: "Survivors" },
  { key: "equivRatePct", label: "Equivalent rate (%)" },
  { key: "costPerSurvivor", label: "Cost per survivor" },
  { key: "costPerNonEquivSurvivor", label: "Cost per non-equiv survivor" },
];

export function compareCategories(rows, { groupA = "open-weight", groupB = "api-only" } = {}) {
  const enriched = rows.map((r) => ({ ...r, modelCategory: category(r.model) }));
  const a = enriched.filter((r) => r.modelCategory === groupA);
  const b = enriched.filter((r) => r.modelCategory === groupB);

  const comparisons = [];
  for (const metric of METRICS) {
    const sampleA = a.map((r) => Number(r[metric.key])).filter(Number.isFinite);
    const sampleB = b.map((r) => Number(r[metric.key])).filter(Number.isFinite);
    const test = mannWhitneyU(sampleA, sampleB);
    comparisons.push({
      metric: metric.key,
      label: metric.label,
      groupA,
      groupB,
      medianA: median(sampleA),
      medianB: median(sampleB),
      nA: sampleA.length,
      nB: sampleB.length,
      pValue: test.pValue,
      effectSize: test.effectSize,
    });
  }
  return { comparisons, groupA, groupB };
}

export function categoryDistribution(rows) {
  const cats = ["open-weight", "api-only", "hybrid"];
  return cats.map((cat) => {
    const subset = rows.filter((r) => category(r.model) === cat);
    return {
      category: cat,
      nModels: new Set(subset.map((r) => r.model)).size,
      nObservations: subset.length,
      medianMutationScore: median(subset.map((r) => Number(r.mutationScore))),
      medianSurvivors: median(subset.map((r) => Number(r.nrSurvived))),
      medianEquivRate: median(subset.map((r) => Number(r.equivRatePct))),
      medianCostPerSurvivor: median(subset.map((r) => Number(r.costPerSurvivor))),
    };
  });
}

export { displayName };
