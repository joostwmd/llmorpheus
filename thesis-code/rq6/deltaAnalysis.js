import { REASONING_PAIRS } from "../shared/modelMeta.js";
import { median } from "../shared/statistics.js";

export function computePairedDeltas(mergedRows, pair) {
  const deltas = [];
  const packages = [...new Set(mergedRows.map((r) => r.package))];

  for (const pkg of packages) {
    const nonR = mergedRows.find(
      (r) => r.model === pair.nonReasoning && r.package === pkg
    );
    const reasoning = mergedRows.find(
      (r) => r.model === pair.reasoning && r.package === pkg
    );
    if (!nonR || !reasoning) continue;

    deltas.push({
      provider: pair.provider,
      package: pkg,
      deltaMutationScore: (reasoning.mutationScore ?? 0) - (nonR.mutationScore ?? 0),
      deltaSurvivors: (reasoning.nrSurvived ?? 0) - (nonR.nrSurvived ?? 0),
      deltaEquivRate: (reasoning.equivRatePct ?? 0) - (nonR.equivRatePct ?? 0),
      deltaCostPerSurvivor: (reasoning.costPerSurvivor ?? 0) - (nonR.costPerSurvivor ?? 0),
      deltaNormLevenshtein:
        (reasoning.medianNormLevenshtein ?? 0) - (nonR.medianNormLevenshtein ?? 0),
      nonReasoningMutationScore: nonR.mutationScore,
      reasoningMutationScore: reasoning.mutationScore,
    });
  }
  return deltas;
}

export function summarizeDeltas(deltas) {
  if (!deltas.length) return null;
  return {
    meanDeltaMutationScore: median(deltas.map((d) => d.deltaMutationScore)),
    meanDeltaSurvivors: median(deltas.map((d) => d.deltaSurvivors)),
    meanDeltaEquivRate: median(deltas.map((d) => d.deltaEquivRate)),
    meanDeltaCostPerSurvivor: median(deltas.map((d) => d.deltaCostPerSurvivor)),
    meanDeltaNormLevenshtein: median(deltas.map((d) => d.deltaNormLevenshtein)),
    nPackages: deltas.length,
  };
}

export { REASONING_PAIRS };
