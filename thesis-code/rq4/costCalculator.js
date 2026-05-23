import { lookupPricing, computeApiCost } from "../shared/pricing.js";
import { extractVolumeRow } from "../rq1/volumeMetrics.js";

export function computeCostRow(dataset, equivData = null) {
  const volume = extractVolumeRow(dataset);
  const totalCost = volume.totalCostUsd ?? 0;
  const valid = volume.nrValid || 0;
  const duplicate = volume.nrDuplicate || 0;
  const unique = Math.max(valid - duplicate, 0);
  const survived = volume.nrSurvived || 0;
  const candidates = volume.nrCandidates || 0;

  let predictedEquivalent = 0;
  if (equivData) {
    predictedEquivalent = Number(equivData.predicted_equivalent ?? 0);
  }
  const nonEquivSurvivors = Math.max(survived - predictedEquivalent, 0);

  return {
    ...volume,
    totalCostUsd: totalCost,
    costPerCandidate: candidates ? totalCost / candidates : null,
    costPerValid: valid ? totalCost / valid : null,
    costPerUnique: unique ? totalCost / unique : null,
    costPerSurvivor: survived ? totalCost / survived : null,
    costPerNonEquivSurvivor: nonEquivSurvivors ? totalCost / nonEquivSurvivors : null,
    costPerMutationScorePoint:
      volume.mutationScore && volume.mutationScore > 0 ? totalCost / volume.mutationScore : null,
    predictedEquivalent,
    nonEquivSurvivors,
  };
}

export function computeCosts(datasets, equivByKey = new Map()) {
  return datasets.map((d) => {
    const key = `${d.model}::${d.package}::${d.runLabel}`;
    return computeCostRow(d, equivByKey.get(key) ?? equivByKey.get(`${d.model}::${d.package}::run1`));
  });
}
