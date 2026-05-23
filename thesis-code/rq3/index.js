#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { REPO_ROOT, DEFAULT_ORGANIZED_DIR, rqOutputDirs, copyIfExists, ensureDir } from "../shared/paths.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const EM_ROOT = path.join(__dirname, "equivalent-mutants");
const ANALYZE_ROOT = path.join(EM_ROOT, "analyze");
const CLASSIFY_ROOT = path.join(EM_ROOT, "classify");

const argv = yargs(hideBin(process.argv))
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 5 })
  .option("skip-classifier", { type: "boolean", default: true })
  .option("force", { type: "boolean", default: false })
  .option("threshold", { type: "number", default: 0.8 })
  .parseSync();

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

if (!argv.skipClassifier) {
  runPython(path.join("..", "classify", "run_classifier.py"), [
    "--config",
    configPath,
    "--source",
    sourceArg,
    ...(argv.force ? ["--force"] : []),
    "--threshold",
    String(argv.threshold),
  ]);
} else {
  duplicatePredictionRuns(argv.simulateRuns, argv.force);
  runPython(path.join("..", "classify", "convert_mutants.py"), [
    "--config",
    configPath,
    "--source",
    sourceArg,
    ...(argv.force ? ["--force"] : []),
  ]);
}

runPython("analyze_results.py", ["--config", configPath, "--source", sourceArg]);
runPython("generate_tables.py", ["--config", configPath]);
runPython("generate_plots.py", ["--config", configPath]);

const pythonOut = path.join(ANALYZE_ROOT, "output");
const { thesis, appendix } = rqOutputDirs("rq3");

if (fs.existsSync(pythonOut)) {
  for (const name of fs.readdirSync(pythonOut)) {
    copyIfExists(path.join(pythonOut, name), path.join(thesis, name));
  }
}

// Appendix: per-run rows from aggregated_results
const aggPath = path.join(thesis, "aggregated_results.csv");
if (fs.existsSync(aggPath)) {
  const text = fs.readFileSync(aggPath, "utf8").trim();
  const lines = text.split(/\r?\n/);
  const headers = lines[0].split(",");
  for (let i = 1; i < lines.length; i++) {
    const cols = lines[i].split(",");
    const row = Object.fromEntries(headers.map((h, idx) => [h, cols[idx]]));
    const outName = `${row.llm}_${row.run}_${row.package}_equiv.csv`;
    fs.writeFileSync(path.join(appendix, outName), `${lines[0]}\n${lines[i]}\n`);
  }
  fs.writeFileSync(path.join(appendix, "aggregated_results_all_runs.csv"), text + "\n");
}

console.log(`RQ3 complete: ${thesis}`);
