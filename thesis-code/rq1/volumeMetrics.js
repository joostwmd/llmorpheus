import { lookupPricing, computeApiCost, parseStrykerTime } from "../shared/pricing.js";

export function extractVolumeRow(dataset) {
  const s = dataset.summary;
  const st = dataset.strykerInfo ?? {};
  const candidates = Number(s.nrCandidates ?? 0);
  const valid = Number(s.nrSyntacticallyValid ?? 0);
  const invalid = Number(s.nrSyntacticallyInvalid ?? 0);
  const identical = Number(s.nrIdentical ?? 0);
  const duplicate = Number(s.nrDuplicate ?? 0);
  const killed = Number(st.nrKilled ?? 0);
  const survived = Number(st.nrSurvived ?? 0);
  const timedOut = Number(st.nrTimedOut ?? 0);
  const mutationScore = st.mutationScore != null ? Number(st.mutationScore) : null;

  const pricing = lookupPricing(dataset.model);
  const costs = computeApiCost(s, pricing);

  return {
    model: dataset.model,
    package: dataset.package,
    run: dataset.run,
    runLabel: dataset.runLabel,
    simulated: dataset.simulated,
    nrPrompts: Number(s.nrPrompts ?? 0),
    nrCandidates: candidates,
    nrValid: valid,
    nrInvalid: invalid,
    nrIdentical: identical,
    nrDuplicate: duplicate,
    validityRate: candidates ? (valid / candidates) * 100 : null,
    duplicateRate: candidates ? (duplicate / candidates) * 100 : null,
    invalidRate: candidates ? (invalid / candidates) * 100 : null,
    mutationScore,
    nrKilled: killed,
    nrSurvived: survived,
    nrTimedOut: timedOut,
    strykerTimeSec: parseStrykerTime(st.time),
    totalPromptTokens: costs.promptTokens,
    totalCompletionTokens: costs.completionTokens,
    totalCostUsd: costs.totalCostUsd,
  };
}

export function extractVolumeMetrics(datasets) {
  return datasets.map(extractVolumeRow);
}
