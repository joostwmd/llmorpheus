#!/usr/bin/env node
/** Extract app.report from Stryker mutation.html (JS object literal, not strict JSON). */
const fs = require("fs");

const htmlPath = process.argv[2];
if (!htmlPath) {
  console.error("Usage: parse_stryker_report.js <mutation.html>");
  process.exit(1);
}

const html = fs.readFileSync(htmlPath, "utf8");
const marker = "app.report = ";
const start = html.indexOf(marker);
if (start < 0) {
  console.error("Could not find app.report assignment");
  process.exit(2);
}

let depth = 0;
let inString = false;
let escape = false;
const begin = start + marker.length;
let end = begin;

for (let idx = begin; idx < html.length; idx += 1) {
  const ch = html[idx];
  if (inString) {
    if (escape) {
      escape = false;
    } else if (ch === "\\") {
      escape = true;
    } else if (ch === '"') {
      inString = false;
    }
    continue;
  }
  if (ch === '"') {
    inString = true;
    continue;
  }
  if (ch === "{") {
    depth += 1;
  } else if (ch === "}") {
    depth -= 1;
    if (depth === 0) {
      end = idx + 1;
      break;
    }
  }
}

const report = eval(`(${html.slice(begin, end)})`);
process.stdout.write(JSON.stringify(report));
