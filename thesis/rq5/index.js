#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { rqOutputDirs } from "../shared/paths.js";
import { writeCsv, readCsv } from "../shared/csv.js";
import { runPlotPipeline } from "../shared/python_runner.js";
import { clearRqOutput } from "../shared/rqOutput.js";
import { getModelsForRq } from "../shared/modelRegistry.js";
import { compareCategories, categoryDistribution } from "./categoryComparison.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const THESIS_CODE = path.resolve(__dirname, "..");

const argv = yargs(hideBin(process.argv))
  .option("rq1-summary", { type: "string", default: path.join(THESIS_CODE, "rq1/output/thesis/model_summary.csv") })
  .option("rq3-aggregated", { type: "string", default: path.join(THESIS_CODE, "rq3/output/thesis/aggregated_results.csv") })
  .option("rq4-costs", { type: "string", default: path.join(THESIS_CODE, "rq4/output/appendix/cost_all_runs.csv") })
  .parseSync();

clearRqOutput("rq5");

const allowed = new Set(getModelsForRq("rq5"));
const rq1 = readCsv(argv.rq1Summary);
const rq3 = readCsv(argv.rq3Aggregated);
const rq4 = readCsv(argv.rq4Costs).filter((r) => allowed.has(r.model) && Number(r.run) === 1);

const merged = [];
for (const cost of rq4) {
  const r1 = rq1.find((r) => r.model === cost.model);
  const r3runs = rq3.filter((r) => r.llm === cost.model && r.package === cost.package);
  const r3 = r3runs.find((r) => r.run === cost.runLabel) ?? r3runs[0];
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
    medianCandidates: r1 ? Number(r1.medianCandidates) : null,
  });
}

const { thesis, appendix } = rqOutputDirs("rq5");
writeCsv(path.join(appendix, "merged_metrics.csv"), merged);

const catDist = categoryDistribution(merged);
writeCsv(path.join(thesis, "category_summary.csv"), catDist);

const { comparisons } = compareCategories(merged);
writeCsv(path.join(thesis, "category_comparisons.csv"), comparisons);

runPlotPipeline("rq5");

console.log(`RQ5 complete: ${thesis}`);
