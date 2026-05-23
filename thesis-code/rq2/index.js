#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { DEFAULT_ARTIFACTS_DIR, DEFAULT_ORGANIZED_DIR, rqOutputDirs, writeText } from "../shared/paths.js";
import { loadDatasets } from "../shared/artifacts.js";
import { simulateRuns, groupByModelPackage } from "../shared/simulateRuns.js";
import { writeCsv } from "../shared/csv.js";
import { buildTable, formatNum, formatPct } from "../shared/tableGen.js";
import { displayName } from "../shared/modelMeta.js";
import { median } from "../shared/statistics.js";
import { barChart } from "../shared/chartGen.js";
import { jaccardAcrossRuns } from "./jaccardOverlap.js";
import { stabilityForGroup } from "./stabilityMetrics.js";

const argv = yargs(hideBin(process.argv))
  .option("artifacts", { type: "string", default: DEFAULT_ARTIFACTS_DIR })
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 5 })
  .option("real-only", { type: "boolean", default: false })
  .parseSync();

let datasets = loadDatasets({
  artifactsDir: argv.artifacts,
  organizedDir: argv.organized,
  preferOrganized: true,
});
if (!argv.realOnly && argv.simulateRuns > 1) {
  datasets = simulateRuns(datasets, argv.simulateRuns);
}

const groups = groupByModelPackage(datasets);
const detailRows = [];
const modelAgg = new Map();

for (const [key, group] of groups) {
  const [model, pkg] = key.split("::");
  const jaccard = jaccardAcrossRuns(group);
  const stability = stabilityForGroup(group);
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
writeCsv(path.join(appendix, "consistency_by_model_package.csv"), detailRows);

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

writeText(
  path.join(thesis, "consistency_table.tex"),
  buildTable({
    caption: "RQ2: Cross-run consistency metrics per model (median across packages)",
    label: "tab:rq2-consistency",
    headers: ["Model", "Jaccard overlap", "CV mutation score", "CV survivors", "CV edit distance"],
    rows: modelSummary.map((m) => [
      m.displayName,
      formatNum(m.meanJaccardOverlap, 3),
      formatPct(m.medianCvMutationScore),
      formatPct(m.medianCvSurvivors),
      formatPct(m.medianCvAbsLevenshtein),
    ]),
    colSpec: "l|rrrr",
  })
);

await barChart(
  path.join(thesis, "jaccard_overlap_by_model.png"),
  modelSummary.map((m) => ({
    model: m.displayName,
    jaccard: m.meanJaccardOverlap ?? 0,
  })),
  { x: "model", y: "jaccard", title: "RQ2: Mean Jaccard overlap across runs", yTitle: "Jaccard" }
);

console.log(`RQ2 complete: ${thesis}`);
