import {
  API_TIER_PAIRS,
  OPEN_WEIGHT_TIER_PAIR,
} from "../shared/modelRegistry.js";

export const ALL_TIER_PAIRS = [...API_TIER_PAIRS, OPEN_WEIGHT_TIER_PAIR];

function filterRun1Rows(costRows) {
  return costRows.filter((r) => r.run === 1 || r.runLabel === "run1");
}

function rowsForModel(costRows, model) {
  return filterRun1Rows(costRows).filter((r) => r.model === model);
}

/**
 * Aggregate tier metrics for one model from run1 cost rows and its summary row.
 * @param {object[]} costRows
 * @param {object|null} modelSummaryRow
 */
export function summarizeTierModel(costRows, modelSummaryRow) {
  const rows = modelSummaryRow ? rowsForModel(costRows, modelSummaryRow.model) : [];
  const totalSurvived = rows.reduce((s, r) => s + (r.nrSurvived ?? 0), 0);
  const totalPredictedEquivalent = rows.reduce((s, r) => s + (r.predictedEquivalent ?? 0), 0);
  const totalNonEquivSurvivors = rows.reduce((s, r) => s + (r.nonEquivSurvivors ?? 0), 0);

  return {
    model: modelSummaryRow?.model ?? null,
    meanInvalidRate: modelSummaryRow?.meanInvalidRate ?? null,
    meanDuplicateRate: modelSummaryRow?.meanDuplicateRate ?? null,
    portfolioCostPerValid: modelSummaryRow?.portfolioCostPerValid ?? null,
    portfolioCostPerUnique: modelSummaryRow?.portfolioCostPerUnique ?? null,
    equivRatePct: totalSurvived ? (totalPredictedEquivalent / totalSurvived) * 100 : null,
    totalNonEquivSurvivors,
    portfolioCostPerNonEquiv: modelSummaryRow?.portfolioCostPerNonEquiv ?? null,
    nonEquivYield: modelSummaryRow?.nonEquivYield ?? null,
    totalCostUsd: modelSummaryRow?.totalCostUsd ?? null,
  };
}

function prefixMetrics(metrics, tier) {
  const out = {};
  for (const [key, value] of Object.entries(metrics)) {
    if (key === "model") continue;
    out[`${tier}_${key}`] = value;
  }
  return out;
}

/**
 * Compare cheap vs premium tiers per provider.
 * @param {object[]} costRows
 * @param {object[]} modelSummary
 * @param {object[]} pairs
 */
export function computeTierComparison(costRows, modelSummary, pairs) {
  const summaryByModel = new Map(modelSummary.map((row) => [row.model, row]));

  return pairs.map(({ provider, cheap, premium }) => {
    const cheapMetrics = summarizeTierModel(costRows, summaryByModel.get(cheap));
    const premiumMetrics = summarizeTierModel(costRows, summaryByModel.get(premium));

    const cheapCostPerNonEquiv = cheapMetrics.portfolioCostPerNonEquiv;
    const premiumCostPerNonEquiv = premiumMetrics.portfolioCostPerNonEquiv;
    const premiumMultiplierCostPerNonEquiv =
      cheapCostPerNonEquiv && premiumCostPerNonEquiv
        ? premiumCostPerNonEquiv / cheapCostPerNonEquiv
        : null;

    const extraNonEquiv =
      (premiumMetrics.totalNonEquivSurvivors ?? 0) - (cheapMetrics.totalNonEquivSurvivors ?? 0);
    const extraCost = (premiumMetrics.totalCostUsd ?? 0) - (cheapMetrics.totalCostUsd ?? 0);
    const marginalCostPerExtraNonEquiv = extraNonEquiv ? extraCost / extraNonEquiv : null;

    return {
      provider,
      cheapModel: cheap,
      premiumModel: premium,
      ...prefixMetrics(cheapMetrics, "cheap"),
      ...prefixMetrics(premiumMetrics, "premium"),
      premiumMultiplierCostPerNonEquiv,
      marginalCostPerExtraNonEquiv,
    };
  });
}

/**
 * Per provider × package paired deltas (cheap − premium) on run1 rows.
 * @param {object[]} costRows
 * @param {object[]} pairs
 */
export function computeTierPairedDeltas(costRows, pairs) {
  const run1 = filterRun1Rows(costRows);
  const deltas = [];

  for (const { provider, cheap, premium } of pairs) {
    const packages = [...new Set(run1.filter((r) => r.model === cheap).map((r) => r.package))];
    for (const pkg of packages) {
      const cheapRow = run1.find((r) => r.model === cheap && r.package === pkg);
      const premiumRow = run1.find((r) => r.model === premium && r.package === pkg);
      if (!cheapRow || !premiumRow) continue;

      deltas.push({
        provider,
        package: pkg,
        cheapModel: cheap,
        premiumModel: premium,
        deltaCostPerUnique: (cheapRow.costPerUnique ?? 0) - (premiumRow.costPerUnique ?? 0),
        deltaCostPerNonEquivSurvivor:
          (cheapRow.costPerNonEquivSurvivor ?? 0) - (premiumRow.costPerNonEquivSurvivor ?? 0),
        deltaNonEquivSurvivors:
          (cheapRow.nonEquivSurvivors ?? 0) - (premiumRow.nonEquivSurvivors ?? 0),
      });
    }
  }

  return deltas;
}
