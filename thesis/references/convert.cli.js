#!/usr/bin/env node

import { PROCESSED_DIR, ReferencePdfConverter } from "./ReferencePdfConverter.js";

function printUsage() {
  console.log(`Usage:
  node convert.cli.js <pdf-path> [--slug name] [--overwrite] [--no-save-json]
  node convert.cli.js --from-json <elements.json> [--slug name] [--overwrite]

Example:
  node convert.cli.js input/my-paper.pdf --slug my-paper

Options:
  --slug          Output folder name under thesis/references/processed/
  --output-root   Override output root directory (default: processed/)
  --overwrite     Regenerate outputs even if paper.md exists
  --from-json     Rebuild markdown from cached Unstructured JSON
  --no-save-json  Skip writing paper.json when converting a PDF
  --help          Show this help`);
}

function parseArgs(argv) {
  /** @type {{ inputPath?: string, fromJson?: string, slug?: string, outputRoot?: string, overwrite: boolean, saveJson: boolean, help: boolean }} */
  const args = {
    overwrite: false,
    saveJson: true,
    help: false,
  };

  const positional = [];
  for (let i = 0; i < argv.length; i += 1) {
    const token = argv[i];
    if (token === "--help" || token === "-h") {
      args.help = true;
      continue;
    }
    if (token === "--overwrite") {
      args.overwrite = true;
      continue;
    }
    if (token === "--no-save-json") {
      args.saveJson = false;
      continue;
    }
    if (token === "--slug") {
      args.slug = argv[++i];
      continue;
    }
    if (token === "--output-root") {
      args.outputRoot = argv[++i];
      continue;
    }
    if (token === "--from-json") {
      args.fromJson = argv[++i];
      continue;
    }
    positional.push(token);
  }

  if (positional.length > 0) {
    args.inputPath = positional.join(" ");
  }

  return args;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  if (args.help) {
    printUsage();
    return 0;
  }

  const converter = new ReferencePdfConverter({
    outputRoot: args.outputRoot ?? PROCESSED_DIR,
  });

  try {
    if (!args.fromJson && !args.inputPath) {
      printUsage();
      throw new Error("PDF path is required unless --from-json is used");
    }

    const result = args.fromJson
      ? await converter.convertFromJson(args.fromJson, {
          slug: args.slug,
          overwrite: args.overwrite,
        })
      : await converter.convert(args.inputPath, {
          slug: args.slug,
          saveJson: args.saveJson,
          overwrite: args.overwrite,
        });

    console.log(`Slug:      ${result.slug}`);
    console.log(`Elements:  ${result.elementCount ?? "(from cache)"}`);
    console.log(`Markdown:  ${result.markdownPath}`);
    if (result.jsonPath) {
      console.log(`JSON:      ${result.jsonPath}`);
    }
    console.log(`Figures:   ${result.figuresDir} (${result.figures.length} file(s))`);
    for (const figure of result.figures) {
      console.log(`  - ${figure.relativePath}: ${figure.caption ?? "(no caption)"}`);
    }
    return 0;
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Error: ${message}`);
    return 1;
  }
}

main().then((code) => {
  process.exitCode = code;
});
