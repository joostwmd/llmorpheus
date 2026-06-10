#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_ARTIFACTS_DIR, DEFAULT_ORGANIZED_DIR, rqOutputDirs } from "../shared/paths.js";
import { loadDatasets } from "../shared/artifacts.js";
import { filterForRq } from "../shared/filterDatasets.js";
import { writeCsv, readCsv } from "../shared/csv.js";
import { runPlotPipeline } from "../shared/python_runner.js";
import { clearRqOutput } from "../shared/rqOutput.js";
import { computeCosts } from "./costCalculator.js";
import { aggregateModelCosts } from "./qualityAdjustedCosts.js";
import { paretoFrontier } from "./paretoAnalysis.js";
import { API_TIER_PAIRS } from "../shared/modelRegistry.js";
import {
  ALL_TIER_PAIRS,
  computeTierComparison,
  computeTierPairedDeltas,
} from "./tierComparison.js";

const __dirnameRq4 = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .option("artifacts", { type: "string", default: DEFAULT_ARTIFACTS_DIR })
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 1 })
  .option("real-only", { type: "boolean", default: true })
  .option("rq3-aggregated", {
    type: "string",
    default: path.join("rq3", "output", "publication", "aggregated_results.csv"),
  })
  .parseSync();

let datasets = loadDatasets({
  artifactsDir: argv.artifacts,
  organizedDir: argv.organized,
  preferOrganized: true,
});
datasets = filterForRq(datasets, "rq4", {
  devSimulateRuns: argv.simulateRuns,
  realOnly: argv.realOnly,
});

clearRqOutput("rq4");

const equivPath = path.isAbsolute(argv.rq3Aggregated)
  ? argv.rq3Aggregated
  : path.join(__dirnameRq4, "..", argv.rq3Aggregated);
const equivRows = readCsv(equivPath);
const equivByKey = new Map();
for (const row of equivRows) {
  equivByKey.set(`${row.llm}::${row.package}::${row.run}`, row);
}

const costRows = computeCosts(datasets, equivByKey);
const modelSummary = paretoFrontier(aggregateModelCosts(costRows));
const tierComparison = computeTierComparison(costRows, modelSummary, API_TIER_PAIRS);
const tierPairedDeltas = computeTierPairedDeltas(costRows, ALL_TIER_PAIRS);

const { publication, appendix } = rqOutputDirs("rq4");
writeCsv(path.join(appendix, "cost_all_runs.csv"), costRows);
writeCsv(path.join(publication, "model_cost_summary.csv"), modelSummary);
writeCsv(path.join(publication, "tier_comparison.csv"), tierComparison);
writeCsv(path.join(appendix, "tier_paired_deltas.csv"), tierPairedDeltas);

for (const model of [...new Set(costRows.map((r) => r.model))]) {
  writeCsv(
    path.join(appendix, `${model}_cost_by_run.csv`),
    costRows.filter((r) => r.model === model)
  );
}

runPlotPipeline("rq4");

console.log(`RQ4 complete: ${publication}`);
