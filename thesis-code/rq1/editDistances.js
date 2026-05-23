import fs from "fs";
import { readJson } from "../shared/paths.js";
import { distancesForMutants, summarizeDistances } from "../shared/levenshtein.js";

export function loadMutants(mutantsJsonPath) {
  if (!mutantsJsonPath || !fs.existsSync(mutantsJsonPath)) return [];
  return readJson(mutantsJsonPath);
}

export function computeEditDistanceRow(dataset) {
  const mutants = loadMutants(dataset.mutantsJsonPath);
  const distances = distancesForMutants(mutants);
  const summary = summarizeDistances(distances);
  return {
    model: dataset.model,
    package: dataset.package,
    run: dataset.run,
    runLabel: dataset.runLabel,
    simulated: dataset.simulated,
    nMutants: mutants.length,
    medianAbsLevenshtein: summary.medianAbs,
    q1AbsLevenshtein: summary.q1Abs,
    q3AbsLevenshtein: summary.q3Abs,
    medianNormLevenshtein: summary.medianNorm,
    q1NormLevenshtein: summary.q1Norm,
    q3NormLevenshtein: summary.q3Norm,
  };
}

export function computeEditDistances(datasets) {
  return datasets.map(computeEditDistanceRow);
}
