#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REPO_ROOT, DEFAULT_ORGANIZED_DIR, rqOutputDirs, copyIfExists, ensureDir } from "../shared/paths.js";
import { clearRqOutput, distributeRqArtifacts } from "../shared/rqOutput.js";
import { readCsv, writeCsv } from "../shared/csv.js";
import { PACKAGES } from "../shared/artifacts.js";
import { getModelsForRq } from "../shared/modelRegistry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EM_ROOT = path.join(__dirname, "equivalent-mutants");
const ANALYZE_ROOT = path.join(EM_ROOT, "analyze");
const CLASSIFY_ROOT = path.join(EM_ROOT, "classify");

const argv = yargs(hideBin(process.argv))
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 1 })
  .option("skip-classifier", { type: "boolean", default: true })
  .option("force", { type: "boolean", default: false })
  .option("threshold", { type: "number", default: 0.8 })
  .parseSync();

const SKIP_DIRS = new Set(["_workflow"]);
const RUN_RE = /^run(\d+)$/i;

function discoverDatasetKeys(sourceDir) {
  const allowed = new Set(getModelsForRq("rq3"));
  const keys = [];
  if (!fs.existsSync(sourceDir)) return keys;
  for (const llm of fs.readdirSync(sourceDir)) {
    if (!allowed.has(llm)) continue;
    const llmDir = path.join(sourceDir, llm);
    if (!fs.statSync(llmDir).isDirectory()) continue;
    for (const run of fs.readdirSync(llmDir)) {
      if (!RUN_RE.test(run)) continue;
      if (run.toLowerCase() !== "run1") continue;
      const runDir = path.join(llmDir, run);
      if (!fs.statSync(runDir).isDirectory()) continue;
      for (const pkg of fs.readdirSync(runDir)) {
        if (SKIP_DIRS.has(pkg) || !PACKAGES.includes(pkg)) continue;
        if (!fs.existsSync(path.join(runDir, pkg, "mutants.json"))) continue;
        keys.push({ llm, run, package: pkg });
      }
    }
  }
  return keys;
}

function findMissingPredictions(sourceDir, resultsDir) {
  const missing = [];
  for (const { llm, run, package: pkg } of discoverDatasetKeys(sourceDir)) {
    const predPath = path.join(resultsDir, llm, run, `${pkg}_predictions.csv`);
    if (!fs.existsSync(predPath)) missing.push(predPath);
  }
  return missing;
}

function runClassifier(extraArgs = []) {
  runPython(path.join("..", "classify", "run_classifier.py"), [
    "--config",
    configPath,
    "--source",
    sourceArg,
    "--threshold",
    String(argv.threshold),
    ...extraArgs,
  ]);
}

function duplicatePredictionRuns(targetRuns, force) {
  const resultsRoot = path.join(CLASSIFY_ROOT, "results");
  if (!fs.existsSync(resultsRoot)) return;
  let created = 0;
  for (const llm of fs.readdirSync(resultsRoot)) {
    const llmDir = path.join(resultsRoot, llm);
    if (!fs.statSync(llmDir).isDirectory()) continue;
    const run1 = path.join(llmDir, "run1");
    if (!fs.existsSync(run1)) continue;
    for (let r = 2; r <= targetRuns; r++) {
      const dest = path.join(llmDir, `run${r}`);
      if (fs.existsSync(dest) && !force) continue;
      if (fs.existsSync(dest)) fs.rmSync(dest, { recursive: true, force: true });
      fs.cpSync(run1, dest, { recursive: true });
      created++;
    }
  }
  console.log(`Duplicated classifier prediction runs: ${created}`);
}

function filterAnalyzeCsv(outputDir, fileName, { run1Only = false } = {}) {
  const filePath = path.join(outputDir, fileName);
  if (!fs.existsSync(filePath)) return;
  const allowed = new Set(getModelsForRq("rq3"));
  const rows = readCsv(filePath);
  const filtered = rows.filter((row) => {
    if (row.llm && !allowed.has(row.llm)) return false;
    if (row.llm_a && (!allowed.has(row.llm_a) || !allowed.has(row.llm_b))) return false;
    if (run1Only && row.run && row.run !== "run1") return false;
    return true;
  });
  writeCsv(filePath, filtered);
}

function rebuildSummariesFromAggregated(outputDir) {
  const aggPath = path.join(outputDir, "aggregated_results.csv");
  if (!fs.existsSync(aggPath)) return;
  runPython("rebuild_llm_summary.py", [
    "--input",
    aggPath,
    "--output-dir",
    outputDir,
  ]);
}

function filterAnalyzeOutputs(outputDir) {
  filterAnalyzeCsv(outputDir, "aggregated_results.csv", { run1Only: true });
  rebuildSummariesFromAggregated(outputDir);
}

function runPython(script, args = []) {
  const py = process.env.PYTHON ?? "python3";
  const cmd = [py, script, ...args];
  console.log(`Running: ${cmd.join(" ")} (cwd=${ANALYZE_ROOT})`);
  const result = spawnSync(py, [script, ...args], { cwd: ANALYZE_ROOT, stdio: "inherit" });
  if (result.status !== 0) process.exit(result.status ?? 1);
}

if (!fs.existsSync(EM_ROOT)) {
  console.error(`Missing equivalent-mutants at ${EM_ROOT}`);
  process.exit(1);
}

clearRqOutput("rq3");

const sourceArg = path.resolve(argv.organized);
const configPath = path.join(ANALYZE_ROOT, "config.yaml");

if (argv.simulateRuns > 1) {
  runPython("duplicate_runs_for_testing.py", [
    "--config",
    configPath,
    "--source",
    sourceArg,
    "--target-runs",
    String(argv.simulateRuns),
    ...(argv.force ? ["--force"] : []),
  ]);
}

const resultsDir = path.join(CLASSIFY_ROOT, "results");
const convertArgs = [
  "--config",
  configPath,
  "--source",
  sourceArg,
  ...(argv.force ? ["--force"] : []),
];

if (!argv.skipClassifier) {
  runClassifier(argv.force ? ["--force"] : []);
} else {
  if (argv.simulateRuns > 1) {
    duplicatePredictionRuns(argv.simulateRuns, argv.force);
  }
  runPython(path.join("..", "classify", "convert_mutants.py"), convertArgs);

  const missing = findMissingPredictions(sourceArg, resultsDir);
  if (missing.length > 0) {
    console.log(
      `Classifier predictions missing for ${missing.length} dataset(s); reconverting and running classifier.`,
    );
    runPython(path.join("..", "classify", "convert_mutants.py"), [...convertArgs, "--force"]);
    runClassifier(argv.force ? ["--force"] : []);
    if (argv.simulateRuns > 1) {
      duplicatePredictionRuns(argv.simulateRuns, argv.force);
    }
  }
}

runPython("analyze_results.py", ["--config", configPath, "--source", sourceArg]);
filterAnalyzeOutputs(path.join(ANALYZE_ROOT, "output"));
runPython("generate_tables.py", ["--config", configPath]);
runPython("generate_plots.py", ["--config", configPath]);

const pythonOut = path.join(ANALYZE_ROOT, "output");
const { publication, appendix } = rqOutputDirs("rq3");

const SKIP_PUBLICATION_EXTS = new Set([".png", ".pdf", ".tex"]);
if (fs.existsSync(pythonOut)) {
  for (const name of fs.readdirSync(pythonOut)) {
    if (SKIP_PUBLICATION_EXTS.has(path.extname(name))) continue;
    copyIfExists(path.join(pythonOut, name), path.join(publication, name));
  }
}

// Appendix: per-run rows from aggregated_results
const aggPath = path.join(publication, "aggregated_results.csv");
if (fs.existsSync(aggPath)) {
  const allowed = new Set(getModelsForRq("rq3"));
  const text = fs.readFileSync(aggPath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(",");
  const llmIdx = headers.indexOf("llm");
  const runIdx = headers.indexOf("run");
  const kept = [lines[0]];
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const row = Object.fromEntries(headers.map((h, idx) => [h, cols[idx]]));
    if (!allowed.has(row.llm) || row.run !== "run1") continue;
    kept.push(lines[i]);
    const outName = `${row.llm}_${row.run}_${row.package}_equiv.csv`;
    fs.writeFileSync(path.join(appendix, outName), `${lines[0]}\n${lines[i]}\n`);
  }
  const filtered = `${kept.join("\n")}\n`;
  fs.writeFileSync(aggPath, filtered);
  fs.writeFileSync(path.join(appendix, "aggregated_results_all_runs.csv"), filtered);
  if (llmIdx >= 0 && runIdx >= 0) {
    const skipped = lines.length - 1 - (kept.length - 1);
    if (skipped > 0) {
      console.log(`[rq3] Filtered ${skipped} aggregated row(s) (non-ready models or run != run1)`);
    }
  }
}

distributeRqArtifacts("rq3");

console.log(`RQ3 complete: ${publication}`);
