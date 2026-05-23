#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { rqOutputDirs, writeText } from "../shared/paths.js";
import { writeCsv, readCsv } from "../shared/csv.js";
import { buildTable, formatNum, formatPct } from "../shared/tableGen.js";
import { barChart } from "../shared/chartGen.js";
import { computePairedDeltas, summarizeDeltas, REASONING_PAIRS } from "./deltaAnalysis.js";
import { displayName } from "../shared/modelMeta.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THESIS_CODE = path.resolve(__dirname, "..");

const argv = yargs(hideBin(process.argv))
  .option("rq1-appendix", { type: "string", default: path.join(THESIS_CODE, "rq1/output/appendix/raw_metrics_all_runs.csv") })
  .option("rq3-aggregated", { type: "string", default: path.join(THESIS_CODE, "rq3/output/thesis/aggregated_results.csv") })
  .option("rq4-costs", { type: "string", default: path.join(THESIS_CODE, "rq4/output/appendix/cost_all_runs.csv") })
  .parseSync();

const rq1 = readCsv(argv.rq1Appendix);
const rq3 = readCsv(argv.rq3Aggregated);
const rq4 = readCsv(argv.rq4Costs);

// Use run1 medians per model×package for paired comparison
const merged = [];
const keys = new Set(rq4.map((r) => `${r.model}::${r.package}`));
for (const key of keys) {
  const [model, pkg] = key.split("::");
  const costs = rq4.filter((r) => r.model === model && r.package === pkg);
  const r1 = rq1.filter((r) => r.model === model && r.package === pkg);
  const r3 = rq3.filter((r) => r.llm === model && r.package === pkg);
  merged.push({
    model,
    package: pkg,
    mutationScore: medianNums(costs.map((c) => Number(c.mutationScore))),
    nrSurvived: medianNums(costs.map((c) => Number(c.nrSurvived))),
    equivRatePct: medianNums(r3.map((x) => Number(x.equiv_rate_pct))),
    costPerSurvivor: medianNums(costs.map((c) => Number(c.costPerSurvivor))),
    medianNormLevenshtein: medianNums(r1.map((x) => Number(x.medianNormLevenshtein))),
  });
}

function medianNums(vals) {
  const nums = vals.filter(Number.isFinite);
  if (!nums.length) return null;
  nums.sort((a, b) => a - b);
  return nums[Math.floor(nums.length / 2)];
}

const { thesis, appendix } = rqOutputDirs("rq6");
const allDeltas = [];
const summaries = [];

for (const pair of REASONING_PAIRS) {
  const deltas = computePairedDeltas(merged, pair);
  allDeltas.push(...deltas);
  const summary = summarizeDeltas(deltas);
  if (summary) {
    summaries.push({ provider: pair.provider, ...summary });
  }
}

writeCsv(path.join(appendix, "paired_deltas_by_package.csv"), allDeltas);
writeCsv(path.join(thesis, "reasoning_pair_summary.csv"), summaries);

if (summaries.length) {
  writeText(
    path.join(thesis, "reasoning_comparison_table.tex"),
    buildTable({
      caption: "RQ6: Reasoning vs non-reasoning paired deltas (reasoning − non-reasoning, median across packages)",
      label: "tab:rq6-reasoning",
      headers: ["Provider", "Δ Mutation score", "Δ Survivors", "Δ Equiv rate", "Δ Cost/survivor", "Packages"],
      rows: summaries.map((s) => [
        s.provider,
        formatPct(s.meanDeltaMutationScore),
        formatNum(s.meanDeltaSurvivors, 1),
        formatPct(s.meanDeltaEquivRate),
        `$${formatNum(s.meanDeltaCostPerSurvivor, 4)}`,
        String(s.nPackages),
      ]),
      colSpec: "l|rrrrr",
    })
  );
}

if (allDeltas.length) {
  await barChart(
    path.join(thesis, "delta_mutation_score_by_package.png"),
    allDeltas.map((d) => ({
      package: d.package,
      delta: d.deltaMutationScore,
    })),
    {
      x: "package",
      y: "delta",
      title: "RQ6: Δ mutation score (reasoning − non-reasoning) by package",
      yTitle: "Percentage points",
    }
  );
}

console.log(`RQ6 complete: ${thesis}`);
