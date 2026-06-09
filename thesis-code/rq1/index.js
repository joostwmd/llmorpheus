#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import {
  DEFAULT_ARTIFACTS_DIR,
  DEFAULT_ORGANIZED_DIR,
  rqOutputDirs,
} from "../shared/paths.js";
import { loadDatasets } from "../shared/artifacts.js";
import { aggregateAcrossRuns } from "../shared/simulateRuns.js";
import { filterForRq } from "../shared/filterDatasets.js";
import { writeCsv } from "../shared/csv.js";
import { displayName } from "../shared/modelMeta.js";
import { median } from "../shared/statistics.js";
import { runPlotPipeline } from "../shared/python_runner.js";
import { clearRqOutput } from "../shared/rqOutput.js";
import { extractVolumeMetrics } from "./volumeMetrics.js";
import { computeEditDistances } from "./editDistances.js";

const argv = yargs(hideBin(process.argv))
  .option("artifacts", { type: "string", default: DEFAULT_ARTIFACTS_DIR })
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 1 })
  .option("real-only", { type: "boolean", default: true })
  .parseSync();

let datasets = loadDatasets({
  artifactsDir: argv.artifacts,
  organizedDir: argv.organized,
  preferOrganized: true,
});
datasets = filterForRq(datasets, "rq1", {
  devSimulateRuns: argv.simulateRuns,
  realOnly: argv.realOnly,
});

clearRqOutput("rq1");

const volumeRows = extractVolumeMetrics(datasets);
const distanceRows = computeEditDistances(datasets);
const merged = volumeRows.map((v) => {
  const d = distanceRows.find(
    (x) => x.model === v.model && x.package === v.package && x.run === v.run
  );
  return { ...v, ...d };
});

const { thesis, appendix } = rqOutputDirs("rq1");

writeCsv(path.join(appendix, "raw_metrics_all_runs.csv"), merged);
writeCsv(path.join(appendix, "volume_metrics_all_runs.csv"), volumeRows);
writeCsv(path.join(appendix, "edit_distances_all_runs.csv"), distanceRows);

const models = [...new Set(datasets.map((d) => d.model))].sort();
const modelSummary = [];

for (const model of models) {
  const rows = merged.filter((r) => r.model === model);
  const byPackage = new Map();
  for (const r of rows) {
    if (!byPackage.has(r.package)) byPackage.set(r.package, []);
    byPackage.get(r.package).push(r);
  }

  const packageMedians = [];
  for (const [, pkgRows] of byPackage) {
    const agg = {
      candidates: aggregateAcrossRuns(pkgRows.map((r) => r.nrCandidates)),
      valid: aggregateAcrossRuns(pkgRows.map((r) => r.nrValid)),
      mutationScore: aggregateAcrossRuns(pkgRows.map((r) => r.mutationScore)),
      survived: aggregateAcrossRuns(pkgRows.map((r) => r.nrSurvived)),
      absLev: aggregateAcrossRuns(pkgRows.map((r) => r.medianAbsLevenshtein)),
      normLev: aggregateAcrossRuns(pkgRows.map((r) => r.medianNormLevenshtein)),
      validityRate: aggregateAcrossRuns(pkgRows.map((r) => r.validityRate)),
    };
    packageMedians.push(agg);
  }

  const medCandidates = median(packageMedians.map((p) => p.candidates.median));
  const medScore = median(packageMedians.map((p) => p.mutationScore.median));
  const medSurvived = median(packageMedians.map((p) => p.survived.median));
  const medAbs = median(packageMedians.map((p) => p.absLev.median));
  const medNorm = median(packageMedians.map((p) => p.normLev.median));
  const medValidity = median(packageMedians.map((p) => p.validityRate.median));

  modelSummary.push({
    model,
    displayName: displayName(model),
    nPackages: byPackage.size,
    nRuns: 1,
    medianCandidates: medCandidates,
    medianValidityRatePct: medValidity,
    medianMutationScore: medScore,
    medianSurvived: medSurvived,
    medianAbsLevenshtein: medAbs,
    medianNormLevenshtein: medNorm,
  });
}

writeCsv(path.join(thesis, "model_summary.csv"), modelSummary);

for (const model of models) {
  const rows = merged.filter((r) => r.model === model);
  writeCsv(path.join(appendix, `${model}_all_runs.csv`), rows);
}

runPlotPipeline("rq1");

console.log(`RQ1 complete: ${thesis}`);
