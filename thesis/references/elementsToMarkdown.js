const SKIP_TYPES = new Set(["Header", "Footer", "Image"]);
const NOISE_LINE = /^\d+:\d+$|^Wang et al\.$/i;

/**
 * @param {string} title
 * @returns {number}
 */
export function headingLevel(title) {
  const text = title.trim();
  if (/^\d+\.\d+\.\d+/.test(text)) return 4;
  if (/^\d+\.\d+/.test(text)) return 3;
  if (/^\d+\s/.test(text)) return 2;
  return 2;
}

/**
 * @param {object} element
 * @returns {string | null}
 */
function tableHtml(element) {
  const html = element.metadata?.text_as_html;
  if (html) return html;
  const text = element.text?.trim();
  return text || null;
}

/**
 * @param {string} markdown
 * @returns {string}
 */
export function postProcessMarkdown(markdown) {
  const lines = [];
  let previousBlank = false;

  for (const line of markdown.split("\n")) {
    const stripped = line.trim();
    if (stripped && NOISE_LINE.test(stripped)) {
      continue;
    }
    if (stripped === "") {
      if (previousBlank) continue;
      previousBlank = true;
      lines.push("");
      continue;
    }
    previousBlank = false;
    lines.push(line.replace(/\s+$/, ""));
  }

  while (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }

  return lines.length > 0 ? `${lines.join("\n")}\n` : "";
}

/**
 * Convert Unstructured element dicts to markdown.
 *
 * @param {object[]} elements
 * @param {{ figureMarkdownByElementId?: Map<string, string> }} [options]
 * @returns {string}
 */
export function elementsToMarkdown(elements, options = {}) {
  const figureMarkdownByElementId = options.figureMarkdownByElementId ?? new Map();
  const blocks = [];
  let pendingCaption = null;

  for (let i = 0; i < elements.length; i += 1) {
    const element = elements[i];
    const type = element.type;
    const text = (element.text ?? "").trim();

    if (SKIP_TYPES.has(type)) {
      continue;
    }

    if (type === "FigureCaption") {
      pendingCaption = text || null;
      if (/^Fig\.\s/i.test(text ?? "")) {
        continue;
      }
      const nextType = elements[i + 1]?.type;
      if (nextType !== "Image" && nextType !== "Table") {
        if (pendingCaption) {
          blocks.push(`**${pendingCaption}**`);
        }
        pendingCaption = null;
      }
      continue;
    }

    if (type === "Image") {
      const figureMarkdown = figureMarkdownByElementId.get(element.element_id);
      if (figureMarkdown) {
        blocks.push(figureMarkdown);
      }
      pendingCaption = null;
      continue;
    }

    if (type === "Title") {
      if (!text) continue;
      const level = headingLevel(text);
      blocks.push(`${"#".repeat(level)} ${text}`);
      pendingCaption = null;
      continue;
    }

    if (type === "NarrativeText" || type === "UncategorizedText") {
      if (text) blocks.push(text);
      pendingCaption = null;
      continue;
    }

    if (type === "ListItem") {
      if (text) blocks.push(`- ${text}`);
      pendingCaption = null;
      continue;
    }

    if (type === "Table") {
      const html = tableHtml(element);
      if (pendingCaption) {
        blocks.push(`**${pendingCaption}**`);
      }
      if (html) {
        blocks.push(html);
      } else if (text) {
        blocks.push(text);
      }
      pendingCaption = null;
      continue;
    }

    if (type === "Formula") {
      if (text) blocks.push(`$$\n${text}\n$$`);
      pendingCaption = null;
      continue;
    }

    if (type === "CodeSnippet") {
      if (text) blocks.push("```\n" + text + "\n```");
      pendingCaption = null;
      continue;
    }

    if (text) {
      blocks.push(text);
      pendingCaption = null;
    }
  }

  return postProcessMarkdown(blocks.join("\n\n"));
}
