import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/** thesis-code/ directory */
export const THESIS_CODE_ROOT = path.resolve(__dirname, "..");

/** llmorpheus repo root (parent of thesis-code/) */
export const REPO_ROOT = path.resolve(THESIS_CODE_ROOT, "..");

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

export function rqOutputDirs(rqName) {
  const base = path.join(THESIS_CODE_ROOT, rqName, "output");
  const thesis = path.join(base, "thesis");
  const appendix = path.join(base, "appendix");
  ensureDir(thesis);
  ensureDir(appendix);
  return { base, thesis, appendix };
}
