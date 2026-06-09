/**
 * Identify Pareto-efficient models: minimize cost per survivor, maximize mutation score.
 */
export function paretoFrontier(modelSummaries) {
  return modelSummaries.map((m) => {
    const cost = m.medianCostPerSurvivor ?? Infinity;
    const effectiveness = m.medianMutationScore ?? 0;
    let dominated = false;
    for (const other of modelSummaries) {
      if (other.model === m.model) continue;
      const oCost = other.medianCostPerSurvivor ?? Infinity;
      const oEff = other.medianMutationScore ?? 0;
      if (oCost <= cost && oEff >= effectiveness && (oCost < cost || oEff > effectiveness)) {
        dominated = true;
        break;
      }
    }
    return { ...m, paretoEfficient: !dominated };
  });
}
