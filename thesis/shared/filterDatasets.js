import { getModelsForRq, skipReason } from "./modelRegistry.js";
import { simulateRuns } from "./simulateRuns.js";

const RUN1_RQS = new Set(["rq1", "rq3", "rq4", "rq5"]);

/**
 * Filter datasets for a research question using the model registry.
 * @param {import('./artifacts.js').Dataset[]} datasets
 * @param {string} rq
 * @param {{ devSimulateRuns?: number, realOnly?: boolean }} [opts]
 * @returns {import('./artifacts.js').Dataset[]}
 */
export function filterForRq(datasets, rq, opts = {}) {
  const devSimulateRuns = opts.devSimulateRuns ?? 1;
  const allowed = new Set(getModelsForRq(rq));
  const skipped = new Map();

  let filtered = datasets.filter((d) => {
    if (allowed.has(d.model)) return true;
    const reason = skipReason(d.model, rq) ?? "excluded";
    skipped.set(d.model, reason);
    return false;
  });

  if (RUN1_RQS.has(rq)) {
    filtered = filtered.filter((d) => d.run === 1);
  }

  if (!opts.realOnly && devSimulateRuns > 1 && rq === "rq2") {
    filtered = simulateRuns(filtered, devSimulateRuns);
  }

  if (skipped.size) {
    const summary = [...skipped.entries()]
      .map(([model, reason]) => `${model} (${reason})`)
      .sort()
      .join(", ");
    console.log(`[${rq}] Skipped models: ${summary}`);
  }

  return filtered;
}
