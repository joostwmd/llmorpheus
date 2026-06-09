import fs from "fs";
import path from "path";
import { ensureDir } from "./paths.js";
import { PACKAGES } from "./artifacts.js";
import { isExcludedModel } from "./modelMeta.js";

function mutantsFlattenedSource(mutantsDir, pkg) {
  const nested = path.join(mutantsDir, pkg);
  if (
    fs.existsSync(nested) &&
    (fs.existsSync(path.join(nested, "summary.json")) ||
      fs.existsSync(path.join(nested, "mutants.json")))
  ) {
    return nested;
  }
  return mutantsDir;
}

function copyDir(src, dest) {
  ensureDir(dest);
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const s = path.join(src, entry.name);
    const d = path.join(dest, entry.name);
    if (entry.isDirectory()) copyDir(s, d);
    else fs.copyFileSync(s, d);
  }
}

function symlinkOrCopy(src, dest, useSymlinks) {
  ensureDir(path.dirname(dest));
  if (fs.existsSync(dest)) {
    fs.rmSync(dest, { recursive: true, force: true });
  }
  if (useSymlinks) {
    fs.symlinkSync(src, dest, "dir");
  } else {
    copyDir(src, dest);
  }
}

/**
 * Flatten artifacts/ into organized/{model}/run{N}/{package}/.
 * @param {string} artifactsBase
 * @param {string} organizedBase
 * @param {{ simulateRuns?: number, useSymlinks?: boolean, force?: boolean }} [opts]
 */
export function organizeArtifacts(artifactsBase, organizedBase, opts = {}) {
  const simulateRuns = opts.simulateRuns ?? 0;
  const useSymlinks = opts.useSymlinks ?? true;
  const force = opts.force ?? false;
  let total = 0;

  if (!fs.existsSync(artifactsBase)) {
    throw new Error(`Artifacts directory not found: ${artifactsBase}`);
  }

  ensureDir(organizedBase);

  for (const model of fs.readdirSync(artifactsBase)) {
    if (isExcludedModel(model)) continue;
    const modelDir = path.join(artifactsBase, model);
    if (!fs.statSync(modelDir).isDirectory()) continue;

    for (const repName of fs.readdirSync(modelDir)) {
      const m = /^rep(\d+)$/.exec(repName);
      if (!m) continue;
      const repNr = m[1];
      const repDir = path.join(modelDir, repName);
      const runDir = path.join(organizedBase, model, `run${repNr}`);

      const hasMutants = fs
        .readdirSync(repDir)
        .some((n) => n.startsWith("mutants-") && fs.statSync(path.join(repDir, n)).isDirectory());
      if (!hasMutants) continue;

      if (force && fs.existsSync(runDir)) fs.rmSync(runDir, { recursive: true, force: true });
      ensureDir(runDir);

      for (const pkg of PACKAGES) {
        const mutantsDir = path.join(repDir, `mutants-${pkg}`);
        if (!fs.existsSync(mutantsDir)) continue;
        const src = mutantsFlattenedSource(mutantsDir, pkg);
        const pkgOut = path.join(runDir, pkg);
        copyDir(src, pkgOut);

        const resultsNested = path.join(repDir, `results-${pkg}`, `results-${pkg}`);
        const resultsFlat = path.join(repDir, "results", pkg);
        for (const resultsDir of [resultsNested, resultsFlat]) {
          if (!fs.existsSync(resultsDir)) continue;
          for (const file of ["StrykerInfo.json", "StrykerOutput.txt", "mutation.html"]) {
            const fp = path.join(resultsDir, file);
            if (fs.existsSync(fp)) fs.copyFileSync(fp, path.join(pkgOut, file));
          }
          break;
        }
      }

      total++;
    }

    // Simulate additional runs as symlinks/copies of run1
    const run1Dir = path.join(organizedBase, model, "run1");
    if (simulateRuns > 1 && fs.existsSync(run1Dir)) {
      for (let r = 2; r <= simulateRuns; r++) {
        const dest = path.join(organizedBase, model, `run${r}`);
        if (fs.existsSync(dest) && !force) continue;
        symlinkOrCopy(run1Dir, dest, useSymlinks);
      }
    }
  }

  return { organizedBase, runsOrganized: total, simulateRuns };
}
