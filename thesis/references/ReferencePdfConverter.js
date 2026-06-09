import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { openAsBlob } from "node:fs";
import { Strategy } from "unstructured-client/sdk/models/shared/index.js";
import { elementsToMarkdown } from "./elementsToMarkdown.js";

try {
  const dotenv = await import("dotenv");
  dotenv.config({ path: path.join(path.dirname(fileURLToPath(import.meta.url)), ".env") });
} catch {
  // dotenv is optional until npm install completes
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
export const PROCESSED_DIR = path.join(__dirname, "processed");
/** SDK default; it appends `/general/v0/general` itself. */
const DEFAULT_API_URL = "https://api.unstructuredapp.io";

/**
 * Normalize legacy or copy-pasted Unstructured API URLs.
 * @param {string | undefined} url
 * @returns {string | undefined}
 */
function normalizeApiUrl(url) {
  if (!url?.trim()) {
    return undefined;
  }

  let normalized = url.trim().replace(/\/+$/, "");
  normalized = normalized.replace("api.unstructured.io", "api.unstructuredapp.io");
  normalized = normalized.replace(/\/general\/v0\/general$/, "");
  return normalized;
}

/**
 * @param {unknown} response
 * @returns {object[]}
 */
function extractElements(response) {
  if (Array.isArray(response)) {
    return response;
  }
  if (response && typeof response === "object" && "elements" in response) {
    const elements = /** @type {{ elements?: object[] }} */ (response).elements;
    return Array.isArray(elements) ? elements : [];
  }
  return [];
}
const MIME_TO_EXT = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/**
 * @param {string} name
 * @param {number} [maxLength]
 */
export function slugify(name, maxLength = 80) {
  const stem = path.basename(name, path.extname(name));
  const slug = stem
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[-\s]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return (slug || "reference").slice(0, maxLength);
}

function ensureDir(dirPath) {
  fs.mkdirSync(dirPath, { recursive: true });
}

function writeJson(filePath, data) {
  ensureDir(path.dirname(filePath));
  fs.writeFileSync(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function loadExistingFigures(figuresDir) {
  if (!fs.existsSync(figuresDir)) {
    return [];
  }

  return fs
    .readdirSync(figuresDir)
    .filter((name) => fs.statSync(path.join(figuresDir, name)).isFile())
    .sort()
    .map((name) => {
      const pageMatch = name.match(/-p(\d+)/);
      return {
        caption: null,
        page: pageMatch ? Number(pageMatch[1]) : null,
        relativePath: `figures/${name}`,
        elementId: path.parse(name).name,
      };
    });
}

function figureCaptionText(element) {
  return (element.text ?? "").trim() || null;
}

/**
 * @param {object[]} elements
 * @param {number} index
 */
function resolveFigureCaption(elements, index) {
  const next = elements[index + 1];
  if (next?.type === "FigureCaption") {
    const text = figureCaptionText(next);
    if (text && /^Fig\.\s/i.test(text)) {
      return text;
    }
  }

  for (let j = index - 1; j >= 0; j -= 1) {
    const candidate = elements[j];
    if (candidate.type === "Header" || candidate.type === "Footer") {
      continue;
    }
    if (candidate.type === "FigureCaption") {
      const text = figureCaptionText(candidate);
      if (text && /^Fig\.\s/i.test(text)) {
        return text;
      }
    }
    break;
  }

  return null;
}

/**
 * @param {object[]} elements
 * @param {string} figuresDir
 */
function extractFigures(elements, figuresDir) {
  ensureDir(figuresDir);
  /** @type {Map<string, string>} */
  const figureMarkdownByElementId = new Map();
  /** @type {Array<{ caption: string | null, page: number | null, relativePath: string, elementId: string }>} */
  const figures = [];
  let figureIndex = 0;

  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];

    if (element.type !== "Image") {
      continue;
    }

    const metadata = element.metadata ?? {};
    const encoded = metadata.image_base64;
    if (!encoded) {
      continue;
    }

    figureIndex += 1;
    const mime = metadata.image_mime_type ?? "image/jpeg";
    const ext = MIME_TO_EXT[mime] ?? "jpg";
    const page = metadata.page_number;
    const pageSuffix = page != null ? `-p${page}` : "";
    const filename = `fig${String(figureIndex).padStart(2, "0")}${pageSuffix}.${ext}`;
    const outputPath = path.join(figuresDir, filename);
    const relativePath = `figures/${filename}`;
    const resolvedCaption = resolveFigureCaption(elements, i);
    const caption = resolvedCaption ?? `Figure ${figureIndex}`;

    fs.writeFileSync(outputPath, Buffer.from(encoded, "base64"));

    const markdown = `![${caption}](${relativePath})\n\n*${caption}*`;
    figureMarkdownByElementId.set(element.element_id, markdown);
    figures.push({
      caption: resolvedCaption,
      page: page ?? null,
      relativePath,
      elementId: element.element_id,
    });
  }

  return { figureMarkdownByElementId, figures };
}

export class ReferencePdfConverter {
  /**
   * @param {{ outputRoot?: string, apiKey?: string, apiUrl?: string }} [options]
   */
  constructor(options = {}) {
    this.outputRoot = path.resolve(options.outputRoot ?? PROCESSED_DIR);
    this.apiKey = options.apiKey ?? process.env.UNSTRUCTURED_API_KEY ?? "";
    const rawApiUrl = options.apiUrl ?? process.env.UNSTRUCTURED_API_URL ?? DEFAULT_API_URL;
    this.apiUrl = normalizeApiUrl(rawApiUrl) ?? DEFAULT_API_URL;
    this.client = null;
  }

  async getClient() {
    if (this.client) {
      return this.client;
    }
    const { UnstructuredClient } = await import("unstructured-client");
    this.client = new UnstructuredClient({
      serverURL: this.apiUrl,
      security: { apiKeyAuth: this.apiKey },
    });
    return this.client;
  }

  /**
   * @param {string} pdfPath
   * @param {{ slug?: string, saveJson?: boolean, overwrite?: boolean }} [options]
   */
  async convert(pdfPath, options = {}) {
    const { slug, saveJson = true, overwrite = false } = options;
    const resolvedPdf = path.resolve(pdfPath.replace(/^~(?=$|[/\\])/, process.env.HOME ?? ""));
    if (!fs.existsSync(resolvedPdf)) {
      throw new Error(
        `PDF not found: ${resolvedPdf}\n` +
          "If the path contains spaces, wrap it in quotes, e.g. node convert.cli.js \"path/to/my paper.pdf\""
      );
    }

    const resolvedSlug = slug ?? slugify(resolvedPdf);
    const outputDir = path.join(this.outputRoot, resolvedSlug);
    const markdownPath = path.join(outputDir, "paper.md");
    const jsonPath = saveJson ? path.join(outputDir, "paper.json") : null;

    if (!overwrite && fs.existsSync(markdownPath) && (!jsonPath || fs.existsSync(jsonPath))) {
      const figuresDir = path.join(outputDir, "figures");
      return {
        slug: resolvedSlug,
        outputDir,
        markdownPath,
        jsonPath: jsonPath && fs.existsSync(jsonPath) ? jsonPath : null,
        figuresDir,
        figures: loadExistingFigures(figuresDir),
      };
    }

    if (!this.apiKey) {
      throw new Error(
        "UNSTRUCTURED_API_KEY is required for PDF conversion. Set it in the environment or pass apiKey to ReferencePdfConverter."
      );
    }

    const client = await this.getClient();
    const response = await client.general.partition({
      partitionParameters: {
        files: await openAsBlob(resolvedPdf),
        strategy: Strategy.HiRes,
        languages: ["eng"],
        extractImageBlockTypes: ["Image"],
        skipInferTableTypes: [],
        splitPdfPage: true,
        splitPdfAllowFailed: false,
        splitPdfConcurrencyLevel: 8,
      },
    });

    const elements = extractElements(response);
    if (elements.length === 0) {
      throw new Error(
        "Unstructured API returned zero elements. Common causes:\n" +
          "  - Wrong UNSTRUCTURED_API_URL (use https://api.unstructuredapp.io, not api.unstructured.io)\n" +
          "  - Invalid or expired UNSTRUCTURED_API_KEY\n" +
          "  - All split-PDF page requests failed (check network connectivity)\n" +
          `  - API host in use: ${this.apiUrl}`
      );
    }
    if (saveJson && jsonPath) {
      writeJson(jsonPath, elements);
    }

    return this.buildOutputs(elements, {
      slug: resolvedSlug,
      outputDir,
      markdownPath,
      jsonPath,
      elementCount: elements.length,
    });
  }

  /**
   * @param {string} jsonPath
   * @param {{ slug?: string, overwrite?: boolean }} [options]
   */
  async convertFromJson(jsonPath, options = {}) {
    const { slug, overwrite = false } = options;
    const resolvedJson = path.resolve(jsonPath.replace(/^~(?=$|[/\\])/, process.env.HOME ?? ""));
    if (!fs.existsSync(resolvedJson)) {
      throw new Error(`JSON not found: ${resolvedJson}`);
    }

    const elements = readJson(resolvedJson);
    if (!Array.isArray(elements)) {
      throw new Error(`Expected a JSON array of elements in ${resolvedJson}`);
    }

    const resolvedSlug =
      slug ??
      (path.basename(resolvedJson) === "paper.json"
        ? path.basename(path.dirname(resolvedJson))
        : slugify(resolvedJson));
    const outputDir = path.join(this.outputRoot, resolvedSlug);
    const markdownPath = path.join(outputDir, "paper.md");

    if (!overwrite && fs.existsSync(markdownPath)) {
      const figuresDir = path.join(outputDir, "figures");
      return {
        slug: resolvedSlug,
        outputDir,
        markdownPath,
        jsonPath: resolvedJson,
        figuresDir,
        figures: loadExistingFigures(figuresDir),
      };
    }

    return this.buildOutputs(elements, {
      slug: resolvedSlug,
      outputDir,
      markdownPath,
      jsonPath: resolvedJson,
      elementCount: elements.length,
    });
  }

  /**
   * @param {object[]} elements
   * @param {{ slug: string, outputDir: string, markdownPath: string, jsonPath: string | null, elementCount?: number }} context
   */
  buildOutputs(elements, context) {
    const { slug, outputDir, markdownPath, jsonPath, elementCount } = context;
    ensureDir(outputDir);
    const figuresDir = path.join(outputDir, "figures");

    const { figureMarkdownByElementId, figures } = extractFigures(elements, figuresDir);
    const markdown = elementsToMarkdown(elements, { figureMarkdownByElementId });
    fs.writeFileSync(markdownPath, markdown, "utf8");

    return {
      slug,
      outputDir,
      markdownPath,
      jsonPath,
      figuresDir,
      figures,
      elementCount,
    };
  }
}
