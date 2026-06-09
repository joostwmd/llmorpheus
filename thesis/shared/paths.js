import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** thesis/ workspace directory */
export const THESIS_ROOT = path.resolve(__dirname, "..");

/** llmorpheus repo root (parent of thesis/) */
export const REPO_ROOT = path.resolve(THESIS_ROOT, "..");

export const DEFAULT_ARTIFACTS_DIR = path.join(REPO_ROOT, "artifacts");
export const DEFAULT_ORGANIZED_DIR = path.join(REPO_ROOT, "organized");
export const DEFAULT_PRICING_FILE = path.join(
  REPO_ROOT,
  ".github",
  "thesis-model-pricing.json"
);
export const DEFAULT_PACKAGES_FILE = path.join(
  REPO_ROOT,
  ".github",
  "thesis-six.json"
);

export function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

export function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

export function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export function writeText(filePath, content) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, content, "utf8");
}

export function copyIfExists(src, dest) {
  if (!fs.existsSync(src)) return false;
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
  return true;
}

export function globalOutputDirs() {
  const base = path.join(THESIS_ROOT, "output");
  const figures = path.join(base, "figures");
  const figuresPng = path.join(base, "figures-png");
  const tables = path.join(base, "tables");
  const stats = path.join(base, "stats");
  const data = path.join(base, "data");
  for (const d of [figures, figuresPng, tables, stats, data]) {
    ensureDir(d);
  }
  return { base, figures, figuresPng, tables, stats, data };
}

export function rqOutputDirs(rqName) {
  const base = path.join(THESIS_ROOT, rqName, "output");
  const publication = path.join(base, "publication");
  const appendix = path.join(base, "appendix");
  ensureDir(publication);
  ensureDir(appendix);
  globalOutputDirs();
  return { base, publication, appendix };
}

