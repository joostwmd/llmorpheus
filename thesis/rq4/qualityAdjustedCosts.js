import { median, mean } from "../shared/statistics.js";

export function aggregateModelCosts(costRows) {
  const byModel = new Map();
  for (const row of costRows) {
    if (!byModel.has(row.model)) byModel.set(row.model, []);
    byModel.get(row.model).push(row);
  }

  const summaries = [];
  for (const [model, rows] of byModel) {
    const totalCost = rows.reduce((s, r) => s + (r.totalCostUsd ?? 0), 0);
    const totalSurvived = rows.reduce((s, r) => s + (r.nrSurvived ?? 0), 0);
    const totalValid = rows.reduce((s, r) => s + (r.nrValid ?? 0), 0);
    const totalNonEquiv = rows.reduce((s, r) => s + (r.nonEquivSurvivors ?? 0), 0);

    summaries.push({
      model,
      nObservations: rows.length,
      totalCostUsd: totalCost,
      portfolioCostPerSurvivor: totalSurvived ? totalCost / totalSurvived : null,
      portfolioCostPerValid: totalValid ? totalCost / totalValid : null,
      portfolioCostPerNonEquiv: totalNonEquiv ? totalCost / totalNonEquiv : null,
      medianCostPerSurvivor: median(rows.map((r) => r.costPerSurvivor)),
      medianCostPerValid: median(rows.map((r) => r.costPerValid)),
      medianCostPerNonEquiv: median(rows.map((r) => r.costPerNonEquivSurvivor)),
      medianMutationScore: median(rows.map((r) => r.mutationScore)),
      meanDuplicateRate: mean(rows.map((r) => r.duplicateRate)),
      meanInvalidRate: mean(rows.map((r) => r.invalidRate)),
    });
  }

  summaries.sort((a, b) => (a.medianCostPerSurvivor ?? Infinity) - (b.medianCostPerSurvivor ?? Infinity));
  summaries.forEach((s, i) => {
    s.efficiencyRank = i + 1;
  });
  return summaries;
}
