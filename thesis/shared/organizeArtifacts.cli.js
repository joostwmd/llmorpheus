#!/usr/bin/env node
import yargs from "yargs";
import { hideBin } from "yargs/helpers";
import path from "path";
import { fileURLToPath } from "url";
import { REPO_ROOT, DEFAULT_ARTIFACTS_DIR, DEFAULT_ORGANIZED_DIR } from "./shared/paths.js";
import { organizeArtifacts } from "./shared/organizeArtifacts.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const argv = yargs(hideBin(process.argv))
  .option("artifacts", { type: "string", default: DEFAULT_ARTIFACTS_DIR })
  .option("organized", { type: "string", default: DEFAULT_ORGANIZED_DIR })
  .option("simulate-runs", { type: "number", default: 0 })
  .option("force", { type: "boolean", default: false })
  .option("copy", { type: "boolean", default: false, describe: "Copy instead of symlink for simulated runs" })
  .parseSync();

const result = organizeArtifacts(argv.artifacts, argv.organized, {
  simulateRuns: argv.simulateRuns,
  useSymlinks: !argv.copy,
  force: argv.force,
});

console.log(`Organized ${result.runsOrganized} run(s) into ${result.organizedBase}`);
if (result.simulateRuns > 1) {
  console.log(`Simulated runs run2..run${result.simulateRuns} from run1`);
}
