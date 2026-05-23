#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { rqOutputDirs, writeText } from "../shared/paths.js";
import { writeCsv, readCsv } from "../shared/csv.js";
import { buildTable, formatNum, formatPct } from "../shared/tableGen.js";
import { groupedBarChart } from "../shared/chartGen.js";
import { compareCategories, categoryDistribution } from "./categoryComparison.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THESIS_CODE = path.resolve(__dirname, "..");

const argv = yargs(hideBin(process.argv))
  .option("rq1-summary", { type: "string", default: path.join(THESIS_CODE, "rq1/output/thesis/model_summary.csv") })
  .option("rq2-detail", { type: "string", default: path.join(THESIS_CODE, "rq2/output/appendix/consistency_by_model_package.csv") })
  .option("rq3-aggregated", { type: "string", default: path.join(THESIS_CODE, "rq3/output/thesis/aggregated_results.csv") })
  .option("rq4-costs", { type: "string", default: path.join(THESIS_CODE, "rq4/output/appendix/cost_all_runs.csv") })
  .parseSync();

const rq1 = readCsv(argv.rq1Summary);
const rq2 = readCsv(argv.rq2Detail);
const rq3 = readCsv(argv.rq3Aggregated);
const rq4 = readCsv(argv.rq4Costs);

const merged = [];
for (const cost of rq4) {
  const r1 = rq1.find((r) => r.model === cost.model);
  const r3runs = rq3.filter((r) => r.llm === cost.model && r.package === cost.package);
  const r3 = r3runs.find((r) => r.run === cost.runLabel) ?? r3runs[0];
  const r2 = rq2.find((r) => r.model === cost.model && r.package === cost.package);
  merged.push({
    model: cost.model,
    package: cost.package,
    run: cost.run,
    runLabel: cost.runLabel,
    mutationScore: Number(cost.mutationScore),
    nrSurvived: Number(cost.nrSurvived),
    equivRatePct: r3 ? Number(r3.equiv_rate_pct) : null,
    costPerSurvivor: Number(cost.costPerSurvivor),
    costPerNonEquivSurvivor: Number(cost.costPerNonEquivSurvivor),
    meanJaccardOverlap: r2 ? Number(r2.meanJaccardOverlap) : null,
    medianCandidates: r1 ? Number(r1.medianCandidates) : null,
  });
}

const { thesis, appendix } = rqOutputDirs("rq5");
writeCsv(path.join(appendix, "merged_metrics.csv"), merged);

const catDist = categoryDistribution(merged);
writeCsv(path.join(thesis, "category_summary.csv"), catDist);

const { comparisons } = compareCategories(merged);
writeCsv(path.join(thesis, "category_comparisons.csv"), comparisons);

writeText(
  path.join(thesis, "category_table.tex"),
  buildTable({
    caption: "RQ5: Open-weight vs API-only model comparison (median across observations)",
    label: "tab:rq5-category",
    headers: ["Category", "Models", "Mutation score", "Survivors", "Equiv rate", "Cost/survivor"],
    rows: catDist.map((c) => [
      c.category,
      String(c.nModels),
      formatPct(c.medianMutationScore),
      formatNum(c.medianSurvivors, 0),
      formatPct(c.medianEquivRate),
      `$${formatNum(c.medianCostPerSurvivor, 4)}`,
    ]),
    colSpec: "l|r|rrrr",
  })
);

await groupedBarChart(
  path.join(thesis, "mutation_score_by_category.png"),
  catDist.map((c) => ({ category: c.category, mutationScore: c.medianMutationScore ?? 0 })),
  { x: "category", y: "mutationScore", title: "RQ5: Mutation score by model category" }
);

console.log(`RQ5 complete: ${thesis}`);
