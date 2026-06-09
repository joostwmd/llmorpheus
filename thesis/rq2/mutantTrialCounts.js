import fs from "fs";
import { readJson } from "../shared/paths.js";

/**
 * Stable mutant identity across runs (aligned with benchmark/generateVariabilityTable.ts).
 * @param {string} pkg
 * @param {object} mutant
 */
export function mutantKey(pkg, mutant) {
  return JSON.stringify({
    package: pkg,
    fileName: mutant.fileName ?? mutant.file,
    startLine: mutant.startLine,
    startColumn: mutant.startColumn,
    endLine: mutant.endLine,
    endColumn: mutant.endColumn,
    originalCode: mutant.originalCode ?? mutant.original,
    replacement: mutant.replacement,
  });
}

function mutantSetFromDataset(dataset) {
  if (!dataset.mutantsJsonPath || !fs.existsSync(dataset.mutantsJsonPath)) {
    return new Set();
  }
  const mutants = readJson(dataset.mutantsJsonPath);
  return new Set(mutants.map((m) => mutantKey(dataset.package, m)));
}

/**
 * For each model, count how many distinct mutants were observed in exactly k runs.
 * @param {import('../shared/artifacts.js').Dataset[]} datasets
 * @returns {{ rows: object[], nRunsByModel: Map<string, number> }}
 */
export function computeMutantTrialCounts(datasets) {
  const byModel = new Map();

  for (const dataset of datasets) {
    if (!byModel.has(dataset.model)) {
      byModel.set(dataset.model, { runs: new Set(), runSets: new Map() });
    }
    const entry = byModel.get(dataset.model);
    entry.runs.add(dataset.run);

    if (!entry.runSets.has(dataset.run)) {
      entry.runSets.set(dataset.run, new Set());
    }
    const runSet = entry.runSets.get(dataset.run);
    for (const key of mutantSetFromDataset(dataset)) {
      runSet.add(key);
    }
  }

  const rows = [];

  for (const [model, entry] of byModel) {
    const runs = [...entry.runs].sort((a, b) => a - b);
    const nRuns = runs.length;
    const trialHist = new Map();
    for (let k = 1; k <= nRuns; k++) {
      trialHist.set(k, 0);
    }

    const allMutants = new Set();
    for (const runSet of entry.runSets.values()) {
      for (const key of runSet) {
        allMutants.add(key);
      }
    }

    for (const mutant of allMutants) {
      let trials = 0;
      for (const run of runs) {
        if (entry.runSets.get(run)?.has(mutant)) {
          trials += 1;
        }
      }
      trialHist.set(trials, (trialHist.get(trials) ?? 0) + 1);
    }

    const totalDistinct = allMutants.size;
    for (let trialsObserved = 1; trialsObserved <= nRuns; trialsObserved++) {
      rows.push({
        model,
        nRuns,
        trialsObserved,
        count: trialHist.get(trialsObserved) ?? 0,
        totalDistinct,
      });
    }
  }

  rows.sort((a, b) =>
    `${a.model}:${a.trialsObserved}`.localeCompare(`${b.model}:${b.trialsObserved}`)
  );

  const nRunsByModel = new Map(
    [...byModel.entries()].map(([model, entry]) => [model, entry.runs.size])
  );

  return { rows, nRunsByModel };
}
