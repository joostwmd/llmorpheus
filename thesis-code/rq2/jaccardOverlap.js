import fs from "fs";
import { readJson } from "../shared/paths.js";
import { jaccard } from "../shared/statistics.js";

function mutantKey(m) {
  return `${m.startLine}:${m.startColumn}:${m.originalCode ?? m.original}:${m.replacement}`;
}

export function mutantSetFromDataset(dataset) {
  if (!dataset.mutantsJsonPath || !fs.existsSync(dataset.mutantsJsonPath)) {
    return new Set();
  }
  const mutants = readJson(dataset.mutantsJsonPath);
  return new Set(mutants.map(mutantKey));
}

export function pairwiseJaccard(setA, setB) {
  return jaccard(setA, setB);
}

export function jaccardAcrossRuns(datasetsForModelPackage) {
  const byRun = new Map();
  for (const d of datasetsForModelPackage) {
    byRun.set(d.run, mutantSetFromDataset(d));
  }
  const runs = [...byRun.keys()].sort((a, b) => a - b);
  const pairs = [];
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      pairs.push({
        runA: runs[i],
        runB: runs[j],
        jaccard: pairwiseJaccard(byRun.get(runs[i]), byRun.get(runs[j])),
      });
    }
  }
  const values = pairs.map((p) => p.jaccard);
  const mean = values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
  return { pairs, meanJaccard: mean, nPairs: pairs.length };
}

export function pairwiseJaccardRows(model, pkg, datasetsForModelPackage) {
  const byRun = new Map();
  for (const d of datasetsForModelPackage) {
    byRun.set(d.run, mutantSetFromDataset(d));
  }
  const runs = [...byRun.keys()].sort((a, b) => a - b);
  const rows = [];
  for (let i = 0; i < runs.length; i++) {
    for (let j = i + 1; j < runs.length; j++) {
      rows.push({
        model,
        package: pkg,
        run_a: runs[i],
        run_b: runs[j],
        jaccard: pairwiseJaccard(byRun.get(runs[i]), byRun.get(runs[j])),
      });
    }
  }
  return rows;
}
