import fs from "fs";
import path from "path";
import { globalOutputDirs, rqOutputDirs, copyIfExists, writeText } from "./paths.js";
import { OUTPUT_MANIFEST } from "./outputManifest.js";

const KEEP_FILES = new Set([".gitkeep"]);

function stripRqPrefix(rqName, basename) {
  const prefix = `${rqName}_`;
  return basename.startsWith(prefix) ? basename.slice(prefix.length) : basename;
}

/** Remove generated artifacts from rqX/output/publication and appendix (keeps .gitkeep). */
export function clearRqOutput(rqName) {
  const { publication, appendix } = rqOutputDirs(rqName);
  for (const dir of [publication, appendix]) {
    if (!fs.existsSync(dir)) continue;
    for (const name of fs.readdirSync(dir)) {
      if (KEEP_FILES.has(name)) continue;
      fs.rmSync(path.join(dir, name), { recursive: true, force: true });
    }
  }
}

function copyArtifact(rqName, src, destDir, destName) {
  if (!fs.existsSync(src)) {
    console.warn(`[${rqName}] missing source: ${src}`);
    return false;
  }
  const dest = path.join(destDir, destName);
  return copyIfExists(src, dest);
}

/** Copy figures, tables, and stats from central output/ into per-RQ publication/ or appendix/. */
export function distributeRqArtifacts(rqName) {
  const manifest = OUTPUT_MANIFEST[rqName];
  if (!manifest) {
    console.warn(`No output manifest for ${rqName}`);
    return;
  }

  const { publication, appendix } = rqOutputDirs(rqName);
  const { figures, figuresPng, tables, stats } = globalOutputDirs();
  const rqPrefix = `${rqName}_`;
  let copied = 0;

  for (const [stem, meta] of Object.entries(manifest.figures ?? {})) {
    const destDir = meta.placement === "publication" ? publication : appendix;
    const centralStem = `${rqPrefix}${stem}`;
    if (copyArtifact(rqName, path.join(figures, `${centralStem}.pdf`), destDir, `${stem}.pdf`)) copied++;
    if (copyArtifact(rqName, path.join(figuresPng, `${centralStem}.png`), destDir, `${stem}.png`)) copied++;
  }

  for (const [stem, meta] of Object.entries(manifest.tables ?? {})) {
    const destDir = meta.placement === "publication" ? publication : appendix;
    const centralName = stem.endsWith(".tex") ? stem : `${stem}.tex`;
    const destName = stripRqPrefix(rqName, centralName);
    if (copyArtifact(rqName, path.join(tables, centralName), destDir, destName)) copied++;
  }

  for (const [stem, meta] of Object.entries(manifest.stats ?? {})) {
    const destDir = meta.placement === "publication" ? publication : appendix;
    const centralName = stem.endsWith(".csv") ? stem : `${stem}.csv`;
    const destName = stripRqPrefix(rqName, centralName);
    if (copyArtifact(rqName, path.join(stats, centralName), destDir, destName)) copied++;
  }

  writeArtifactsIndex(rqName);
  console.log(`[${rqName}] distributed ${copied} publication artifact(s) to publication/ and appendix/`);
}

/** Write a human-readable index of figure/table/stats placement for LaTeX writing. */
export function writeArtifactsIndex(rqName) {
  const manifest = OUTPUT_MANIFEST[rqName];
  if (!manifest) return;

  const { base } = rqOutputDirs(rqName);
  const lines = [
    `# ${rqName.toUpperCase()} publication artifacts`,
    "",
    "Use files in `publication/` in the main paper; use `appendix/` for supplementary material.",
    "",
    "## Figures",
    "",
    "| File | Placement | Description |",
    "|------|-----------|-------------|",
  ];

  for (const [stem, meta] of Object.entries(manifest.figures ?? {})) {
    lines.push(`| \`${stem}.pdf\` | ${meta.placement} | ${meta.description} |`);
  }

  if (Object.keys(manifest.tables ?? {}).length) {
    lines.push("", "## Tables", "", "| File | Placement | Description |", "|------|-----------|-------------|");
    for (const [stem, meta] of Object.entries(manifest.tables ?? {})) {
      const fname = stripRqPrefix(rqName, `${stem}.tex`);
      lines.push(`| \`${fname}\` | ${meta.placement} | ${meta.description} |`);
    }
  }

  if (Object.keys(manifest.stats ?? {}).length) {
    lines.push("", "## Statistics", "", "| File | Placement | Description |", "|------|-----------|-------------|");
    for (const [stem, meta] of Object.entries(manifest.stats ?? {})) {
      const fname = stripRqPrefix(rqName, `${stem}.csv`);
      lines.push(`| \`${fname}\` | ${meta.placement} | ${meta.description} |`);
    }
  }

  lines.push("");
  writeText(path.join(base, "artifacts_index.md"), lines.join("\n"));
}
