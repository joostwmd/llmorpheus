import fs from "fs";
import path from "path";
import { readJson } from "./paths.js";
import { isExcludedModel } from "./modelMeta.js";

const PACKAGES = [
  "Complex.js",
  "countries-and-timezones",
  "node-jsonfile",
  "pull-stream",
  "spacl-core",
  "zip-a-folder",
];

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

function parseRepNumber(repName) {
  const m = /^rep(\d+)$/.exec(repName);
  return m ? Number(m[1]) : null;
}

/**
 * @typedef {Object} Dataset
 * @property {string} model
 * @property {number} run
 * @property {string} runLabel
 * @property {string} package
 * @property {boolean} simulated
 * @property {string} packageDir - path to organized-style package dir (if available)
 * @property {object} summary
 * @property {object|null} strykerInfo
 * @property {string|null} mutantsJsonPath
 * @property {string|null} mutationHtmlPath
 */

/**
 * Discover datasets from artifacts/ layout.
 * @param {string} artifactsBase
 * @param {{ packages?: string[], models?: string[] }} [opts]
 * @returns {Dataset[]}
 */
export function discoverFromArtifacts(artifactsBase, opts = {}) {
  const packages = opts.packages ?? PACKAGES;
  const datasets = [];

  if (!fs.existsSync(artifactsBase)) {
    return datasets;
  }

  for (const model of fs.readdirSync(artifactsBase)) {
    if (isExcludedModel(model)) continue;
    if (opts.models && !opts.models.includes(model)) continue;
    const modelDir = path.join(artifactsBase, model);
    if (!fs.statSync(modelDir).isDirectory()) continue;

    for (const repName of fs.readdirSync(modelDir)) {
      const run = parseRepNumber(repName);
      if (run == null) continue;
      const repDir = path.join(modelDir, repName);
      if (!fs.statSync(repDir).isDirectory()) continue;

      for (const pkg of packages) {
        const mutantsDir = path.join(repDir, `mutants-${pkg}`);
        if (!fs.existsSync(mutantsDir)) continue;

        const src = mutantsFlattenedSource(mutantsDir, pkg);
        const summaryPath = path.join(src, "summary.json");
        if (!fs.existsSync(summaryPath)) continue;

        const summary = readJson(summaryPath);
        const mutantsJsonPath = fs.existsSync(path.join(src, "mutants.json"))
          ? path.join(src, "mutants.json")
          : null;

        let strykerInfo = null;
        let mutationHtmlPath = null;

        const resultsNested = path.join(
          repDir,
          `results-${pkg}`,
          `results-${pkg}`
        );
        const resultsFlat = path.join(repDir, "results", pkg);
        for (const resultsDir of [resultsNested, resultsFlat]) {
          const infoPath = path.join(resultsDir, "StrykerInfo.json");
          if (fs.existsSync(infoPath)) {
            strykerInfo = readJson(infoPath);
            const htmlPath = path.join(resultsDir, "mutation.html");
            mutationHtmlPath = fs.existsSync(htmlPath) ? htmlPath : null;
            break;
          }
        }

        datasets.push({
          model,
          run,
          runLabel: `run${run}`,
          package: pkg,
          simulated: false,
          packageDir: src,
          summary,
          strykerInfo,
          mutantsJsonPath,
          mutationHtmlPath,
        });
      }
    }
  }

  return datasets.sort((a, b) =>
    `${a.model}:${a.run}:${a.package}`.localeCompare(`${b.model}:${b.run}:${b.package}`)
  );
}

/**
 * Discover datasets from organized/ layout.
 * @param {string} organizedBase
 * @param {{ packages?: string[], models?: string[] }} [opts]
 * @returns {Dataset[]}
 */
export function discoverFromOrganized(organizedBase, opts = {}) {
  const packages = opts.packages ?? PACKAGES;
  const datasets = [];

  if (!fs.existsSync(organizedBase)) return datasets;

  for (const model of fs.readdirSync(organizedBase)) {
    if (model.startsWith(".") || model === "_workflow") continue;
    if (isExcludedModel(model)) continue;
    if (opts.models && !opts.models.includes(model)) continue;
    const modelDir = path.join(organizedBase, model);
    if (!fs.statSync(modelDir).isDirectory()) continue;

    for (const runLabel of fs.readdirSync(modelDir)) {
      const m = /^run(\d+)$/.exec(runLabel);
      if (!m) continue;
      const run = Number(m[1]);
      const runDir = path.join(modelDir, runLabel);

      for (const pkg of packages) {
        const pkgDir = path.join(runDir, pkg);
        if (!fs.existsSync(pkgDir)) continue;
        const summaryPath = path.join(pkgDir, "summary.json");
        if (!fs.existsSync(summaryPath)) continue;

        const summary = readJson(summaryPath);
        const mutantsJsonPath = fs.existsSync(path.join(pkgDir, "mutants.json"))
          ? path.join(pkgDir, "mutants.json")
          : null;
        const strykerPath = path.join(pkgDir, "StrykerInfo.json");
        const strykerInfo = fs.existsSync(strykerPath)
          ? readJson(strykerPath)
          : null;
        const htmlPath = path.join(pkgDir, "mutation.html");
        const mutationHtmlPath = fs.existsSync(htmlPath) ? htmlPath : null;

        datasets.push({
          model,
          run,
          runLabel,
          package: pkg,
          simulated: false,
          packageDir: pkgDir,
          summary,
          strykerInfo,
          mutantsJsonPath,
          mutationHtmlPath,
        });
      }
    }
  }

  return datasets.sort((a, b) =>
    `${a.model}:${a.run}:${a.package}`.localeCompare(`${b.model}:${b.run}:${b.package}`)
  );
}

export function loadDatasets({ artifactsDir, organizedDir, preferOrganized = false }) {
  if (preferOrganized && organizedDir && fs.existsSync(organizedDir)) {
    const fromOrg = discoverFromOrganized(organizedDir);
    if (fromOrg.length) return fromOrg;
  }
  if (artifactsDir) {
    const fromArt = discoverFromArtifacts(artifactsDir);
    if (fromArt.length) return fromArt;
  }
  if (organizedDir) return discoverFromOrganized(organizedDir);
  return [];
}

export { PACKAGES };
