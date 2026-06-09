#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { DEFAULT_ARTIFACTS_DIR, DEFAULT_ORGANIZED_DIR, rqOutputDirs } from "../shared/paths.js";
import { loadDatasets } from "../shared/artifacts.js";
import { groupByModelPackage } from "../shared/simulateRuns.js";
import { filterForRq } from "../shared/filterDatasets.js";
import { writeCsv } from "../shared/csv.js";
import { displayName } from "../shared/modelMeta.js";
import { median } from "../shared/statistics.js";
import { runPlotPipeline } from "../shared/python_runner.js";
import { clearRqOutput } from "../shared/rqOutput.js";
import { extractVolumeRow } from "../rq1/volumeMetrics.js";
import { jaccardAcrossRuns, pairwiseJaccardRows } from "./jaccardOverlap.js";
import { computeMutantTrialCounts } from "./mutantTrialCounts.js";
import { stabilityForGroup } from "./stabilityMetrics.js";

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
datasets = filterForRq(datasets, "rq2", {
  devSimulateRuns: argv.simulateRuns,
  realOnly: argv.realOnly,
});

clearRqOutput("rq2");

const groups = groupByModelPackage(datasets);
const detailRows = [];
const modelAgg = new Map();
const pairwiseRows = [];
const perRunLong = datasets.map((d) => {
  const vol = extractVolumeRow(d);
  return {
    model: d.model,
    package: d.package,
    run: d.run,
    runLabel: d.runLabel,
    mutationScore: vol.mutationScore,
    nrSurvived: vol.nrSurvived,
  };
});

for (const [key, group] of groups) {
  const [model, pkg] = key.split("::");
  const jaccard = jaccardAcrossRuns(group);
  const stability = stabilityForGroup(group);
  pairwiseRows.push(...pairwiseJaccardRows(model, pkg, group));
  const row = {
    model,
    package: pkg,
    nRuns: group.length,
    meanJaccardOverlap: jaccard.meanJaccard,
    cvMutationScore: stability.cvMutationScore,
    stdMutationScore: stability.stdMutationScore,
    cvSurvivors: stability.cvSurvivors,
    stdSurvivors: stability.stdSurvivors,
    cvAbsLevenshtein: stability.cvAbsLevenshtein,
    mutationScoreRange: stability.scoreRange,
    survivorRange: stability.survivorRange,
  };
  detailRows.push(row);
  if (!modelAgg.has(model)) modelAgg.set(model, []);
  modelAgg.get(model).push(row);
}

const { thesis, appendix } = rqOutputDirs("rq2");
const { rows: trialCountRows } = computeMutantTrialCounts(datasets);

writeCsv(path.join(appendix, "consistency_by_model_package.csv"), detailRows);
writeCsv(path.join(appendix, "per_run_long.csv"), perRunLong);
writeCsv(path.join(appendix, "pairwise_jaccard.csv"), pairwiseRows);
writeCsv(path.join(appendix, "mutant_trial_counts.csv"), trialCountRows);

const modelSummary = [...modelAgg.entries()]
  .map(([model, rows]) => ({
    model,
    displayName: displayName(model),
    meanJaccardOverlap: median(rows.map((r) => r.meanJaccardOverlap)),
    medianCvMutationScore: median(rows.map((r) => r.cvMutationScore)),
    medianCvSurvivors: median(rows.map((r) => r.cvSurvivors)),
    medianCvAbsLevenshtein: median(rows.map((r) => r.cvAbsLevenshtein)),
  }))
  .sort((a, b) => (a.meanJaccardOverlap ?? 0) - (b.meanJaccardOverlap ?? 0));

writeCsv(path.join(thesis, "model_consistency_summary.csv"), modelSummary);

runPlotPipeline("rq2");

console.log(`RQ2 complete: ${thesis}`);
