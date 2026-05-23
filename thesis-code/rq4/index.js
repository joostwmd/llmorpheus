#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { DEFAULT_ARTIFACTS_DIR, DEFAULT_ORGANIZED_DIR, rqOutputDirs, writeText } from "../shared/paths.js";
import { loadDatasets } from "../shared/artifacts.js";
import { simulateRuns } from "../shared/simulateRuns.js";
import { writeCsv, readCsv } from "../shared/csv.js";
import { buildTable, formatNum } from "../shared/tableGen.js";
import { displayName } from "../shared/modelMeta.js";
import { scatterChart, barChart } from "../shared/chartGen.js";
import { computeCosts } from "./costCalculator.js";
import { aggregateModelCosts } from "./qualityAdjustedCosts.js";
import { paretoFrontier } from "./paretoAnalysis.js";

const __dirnameRq4 = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .option("artifacts", { type: "string", default: DEFAULT_ARTIFACTS_DIR })
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 5 })
  .option("rq3-aggregated", {
    type: "string",
    default: path.join("rq3", "output", "thesis", "aggregated_results.csv"),
  })
  .parseSync();

let datasets = loadDatasets({
  artifactsDir: argv.artifacts,
  organizedDir: argv.organized,
  preferOrganized: true,
});
datasets = simulateRuns(datasets, argv.simulateRuns);

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

const { thesis, appendix } = rqOutputDirs("rq4");
writeCsv(path.join(appendix, "cost_all_runs.csv"), costRows);
writeCsv(path.join(thesis, "model_cost_summary.csv"), modelSummary);

for (const model of [...new Set(costRows.map((r) => r.model))]) {
  writeCsv(
    path.join(appendix, `${model}_cost_by_run.csv`),
    costRows.filter((r) => r.model === model)
  );
}

writeText(
  path.join(thesis, "cost_table.tex"),
  buildTable({
    caption: "RQ4: Cost-effectiveness per model (aggregated across packages and runs)",
    label: "tab:rq4-cost",
    headers: [
      "Model",
      "Total USD",
      "Cost/valid",
      "Cost/survivor",
      "Cost/non-equiv",
      "Rank",
      "Pareto",
    ],
    rows: modelSummary.map((m) => [
      displayName(m.model),
      `$${formatNum(m.totalCostUsd, 2)}`,
      `$${formatNum(m.medianCostPerValid, 4)}`,
      `$${formatNum(m.medianCostPerSurvivor, 4)}`,
      `$${formatNum(m.medianCostPerNonEquiv, 4)}`,
      String(m.efficiencyRank),
      m.paretoEfficient ? "yes" : "no",
    ]),
    colSpec: "l|rrrrrl",
  })
);

await barChart(
  path.join(thesis, "total_cost_by_model.png"),
  modelSummary.map((m) => ({ model: displayName(m.model), cost: m.totalCostUsd ?? 0 })),
  { x: "model", y: "cost", title: "RQ4: Total API cost by model", yTitle: "USD" }
);

await scatterChart(
  path.join(thesis, "cost_vs_mutation_score.png"),
  modelSummary.map((m) => ({
    model: displayName(m.model),
    costPerSurvivor: m.medianCostPerSurvivor ?? 0,
    mutationScore: m.medianMutationScore ?? 0,
  })),
  {
    x: "costPerSurvivor",
    y: "mutationScore",
    title: "RQ4: Cost per survivor vs mutation score",
    xTitle: "Cost per survivor (USD)",
    yTitle: "Mutation score (%)",
    labelField: "model",
  }
);

console.log(`RQ4 complete: ${thesis}`);
