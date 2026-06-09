import { readJson, DEFAULT_PRICING_FILE } from "./paths.js";

let _pricingCache = null;

export function loadPricing(pricingFile = DEFAULT_PRICING_FILE) {
  if (_pricingCache && _pricingCache.file === pricingFile) return _pricingCache;
  const entries = readJson(pricingFile);
  const bySlug = new Map();
  for (const e of entries) {
    bySlug.set(e.slug, e);
    bySlug.set(artifactNameFromSlug(e.slug), e);
  }
  _pricingCache = { file: pricingFile, bySlug, entries };
  return _pricingCache;
}

/** openai/gpt-4o-mini -> openai_gpt-4o-mini */
export function artifactNameFromSlug(slug) {
  const idx = slug.indexOf("/");
  if (idx === -1) return slug;
  return `${slug.slice(0, idx)}_${slug.slice(idx + 1)}`;
}

/** artifact dir name -> pricing slug */
export function modelToPricingSlug(modelDirName) {
  const idx = modelDirName.indexOf("_");
  if (idx === -1) return modelDirName;
  return `${modelDirName.slice(0, idx)}/${modelDirName.slice(idx + 1)}`;
}

export function lookupPricing(modelDirName, pricingCache = null) {
  const cache = pricingCache ?? loadPricing();
  return cache.bySlug.get(modelDirName) ?? cache.bySlug.get(modelToPricingSlug(modelDirName)) ?? null;
}

export function computeApiCost(summary, pricingEntry) {
  if (!pricingEntry) return { inputCostUsd: null, outputCostUsd: null, totalCostUsd: null };
  const promptTokens = Number(summary.totalPromptTokens ?? 0);
  const completionTokens = Number(summary.totalCompletionTokens ?? 0);
  const inputCostUsd = (promptTokens / 1_000_000) * pricingEntry.input_usd_per_million;
  const outputCostUsd = (completionTokens / 1_000_000) * pricingEntry.output_usd_per_million;
  return {
    inputCostUsd,
    outputCostUsd,
    totalCostUsd: inputCostUsd + outputCostUsd,
    promptTokens,
    completionTokens,
  };
}

export function parseStrykerTime(timeStr) {
  if (!timeStr || typeof timeStr !== "string") return null;
  const m = /^(\d+)m([\d.]+)s$/.exec(timeStr.trim());
  if (m) return Number(m[1]) * 60 + Number(m[2]);
  const s = /^([\d.]+)s$/.exec(timeStr.trim());
  if (s) return Number(s[1]);
  return null;
}
