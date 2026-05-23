#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import {
  DEFAULT_ARTIFACTS_DIR,
  DEFAULT_ORGANIZED_DIR,
  rqOutputDirs,
  writeText,
} from "../shared/paths.js";
import { loadDatasets } from "../shared/artifacts.js";
import { simulateRuns, aggregateAcrossRuns } from "../shared/simulateRuns.js";
import { writeCsv } from "../shared/csv.js";
import { buildTable, formatNum, formatPct } from "../shared/tableGen.js";
import { displayName } from "../shared/modelMeta.js";
import { median, iqr, formatIqr } from "../shared/statistics.js";
import { barChart } from "../shared/chartGen.js";
import { extractVolumeMetrics } from "./volumeMetrics.js";
import { computeEditDistances } from "./editDistances.js";

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
    nRuns: argv.simulateRuns,
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

const tableRows = modelSummary.map((m) => [
  m.displayName,
  formatNum(m.medianCandidates, 0),
  formatPct(m.medianValidityRatePct),
  formatPct(m.medianMutationScore),
  formatNum(m.medianSurvived, 0),
  formatNum(m.medianAbsLevenshtein, 2),
  formatNum(m.medianNormLevenshtein, 3),
]);

writeText(
  path.join(thesis, "volume_metrics_table.tex"),
  buildTable({
    caption: "RQ1: Mutant volume and quality metrics per model (median across packages and runs)",
    label: "tab:rq1-volume",
    headers: [
      "Model",
      "Candidates",
      "Validity",
      "Mutation score",
      "Survived",
      "Abs. Levenshtein",
      "Norm. Levenshtein",
    ],
    rows: tableRows,
    colSpec: "l|rrrrrr",
  })
);

await barChart(
  path.join(thesis, "mutation_score_by_model.png"),
  modelSummary.map((m) => ({ model: m.displayName, mutationScore: m.medianMutationScore ?? 0 })),
  { x: "model", y: "mutationScore", title: "RQ1: Median mutation score by model", yTitle: "Mutation score (%)" }
);

await barChart(
  path.join(thesis, "survivors_by_model.png"),
  modelSummary.map((m) => ({ model: m.displayName, survived: m.medianSurvived ?? 0 })),
  { x: "model", y: "survived", title: "RQ1: Median survivors by model", yTitle: "Survivors" }
);

console.log(`RQ1 complete: ${thesis}`);
