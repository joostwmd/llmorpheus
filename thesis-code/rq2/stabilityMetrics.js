import { coefficientOfVariation, stdDev, mean } from "../shared/statistics.js";
import { extractVolumeRow } from "../rq1/volumeMetrics.js";
import { computeEditDistanceRow } from "../rq1/editDistances.js";

export function stabilityForGroup(datasets) {
  const volume = datasets.map((d) => extractVolumeRow(d));
  const distances = datasets.map((d) => computeEditDistanceRow(d));

  return {
    cvMutationScore: coefficientOfVariation(volume.map((v) => v.mutationScore)),
    stdMutationScore: stdDev(volume.map((v) => v.mutationScore)),
    meanMutationScore: mean(volume.map((v) => v.mutationScore)),
    cvSurvivors: coefficientOfVariation(volume.map((v) => v.nrSurvived)),
    stdSurvivors: stdDev(volume.map((v) => v.nrSurvived)),
    meanSurvivors: mean(volume.map((v) => v.nrSurvived)),
    cvAbsLevenshtein: coefficientOfVariation(distances.map((d) => d.medianAbsLevenshtein)),
    stdAbsLevenshtein: stdDev(distances.map((d) => d.medianAbsLevenshtein)),
    scoreRange:
      Math.max(...volume.map((v) => v.mutationScore ?? 0)) -
      Math.min(...volume.map((v) => v.mutationScore ?? 0)),
    survivorRange:
      Math.max(...volume.map((v) => v.nrSurvived ?? 0)) -
      Math.min(...volume.map((v) => v.nrSurvived ?? 0)),
  };
}
