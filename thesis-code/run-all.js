#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import {
  REPO_ROOT,
  DEFAULT_ARTIFACTS_DIR,
  DEFAULT_ORGANIZED_DIR,
  rqOutputDirs,
  copyIfExists,
  ensureDir,
} from "./shared/paths.js";
import { organizeArtifacts } from "./shared/organizeArtifacts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .option("artifacts", { type: "string", default: DEFAULT_ARTIFACTS_DIR })
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 5 })
  .option("skip-organize", { type: "boolean", default: false })
  .option("skip-rq3", { type: "boolean", default: false, describe: "Skip Python RQ3 pipeline" })
  .option("force-organize", { type: "boolean", default: false })
  .parseSync();

function runNode(relScript, extraArgs = []) {
  const script = path.join(__dirname, relScript);
  console.log(`\n=== Running ${relScript} ===`);
  const result = spawnSync(process.execPath, [script, ...extraArgs], {
    stdio: "inherit",
    cwd: __dirname,
  });
  if (result.status !== 0) {
    process.exit(result.status ?? 1);
  }
}

const commonArgs = [
  "--artifacts",
  argv.artifacts,
  "--organized",
  argv.organized,
  "--simulate-runs",
  String(argv.simulateRuns),
];

if (!argv.skipOrganize) {
  console.log("\n=== Organizing artifacts ===");
  organizeArtifacts(argv.artifacts, argv.organized, {
    simulateRuns: argv.simulateRuns,
    useSymlinks: true,
    force: argv.forceOrganize,
  });
}

runNode("rq1/index.js", commonArgs);
runNode("rq2/index.js", commonArgs);

if (!argv.skipRq3) {
  runNode("rq3/index.js", [
    "--organized",
    argv.organized,
    "--simulate-runs",
    String(argv.simulateRuns),
    ...(argv.forceOrganize ? ["--force"] : []),
  ]);
} else {
  console.log("\n=== Skipping RQ3 (--skip-rq3) ===");
  const { thesis, appendix } = rqOutputDirs("rq3");
  // Copy from legacy location if present
  const legacyOut = path.join(REPO_ROOT, "equivalent-mutants", "analyze", "output");
  const movedOut = path.join(__dirname, "rq3", "equivalent-mutants", "analyze", "output");
  const src = fs.existsSync(movedOut) ? movedOut : legacyOut;
  if (fs.existsSync(src)) {
    for (const f of fs.readdirSync(src)) {
      copyIfExists(path.join(src, f), path.join(thesis, f));
    }
  }
}

runNode("rq4/index.js", commonArgs);
runNode("rq5/index.js", []);
runNode("rq6/index.js", []);

console.log("\n=== All thesis pipelines complete ===");
