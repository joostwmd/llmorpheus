import { spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { THESIS_CODE_ROOT } from "./paths.js";
import { distributeRqArtifacts } from "./rqOutput.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function pythonExecutable() {
  return process.env.PYTHON ?? "python3";
}

export function spawnPython(scriptPath, args = [], { cwd = THESIS_CODE_ROOT, optional = false } = {}) {
  const py = pythonExecutable();
  const absScript = path.isAbsolute(scriptPath) ? scriptPath : path.join(THESIS_CODE_ROOT, scriptPath);
  if (!fs.existsSync(absScript)) {
    const msg = `Python script not found: ${absScript}`;
    if (optional) {
      console.warn(msg);
      return { status: 0, skipped: true };
    }
    throw new Error(msg);
  }
  const cmd = [py, absScript, ...args];
  console.log(`Running: ${cmd.join(" ")} (cwd=${cwd})`);
  const result = spawnSync(py, [absScript, ...args], { cwd, stdio: "inherit" });
  if (result.error?.code === "ENOENT" && optional) {
    console.warn(`Python not found (${py}); skipping ${absScript}`);
    return { status: 0, skipped: true };
  }
  if (result.status !== 0) {
    if (optional) {
      console.warn(`Python script failed (${absScript}); exit ${result.status}`);
      return { status: result.status ?? 1, skipped: false };
    }
    process.exit(result.status ?? 1);
  }
  return { status: 0, skipped: false };
}

export function runPlotPipeline(rqName) {
  const plotsDir = path.join(rqName, "plots");
  for (const script of ["generate_plots.py", "generate_tables.py", "generate_stats.py"]) {
    spawnPython(path.join(plotsDir, script), [], { optional: true });
  }
  distributeRqArtifacts(rqName);
}
