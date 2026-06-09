/** Artifact directory names excluded from thesis analysis (deprecated / reasoning models). */
import { MODEL_REGISTRY } from "./modelRegistry.js";

export const EXCLUDED_MODELS = new Set([
  "google_gemini-2.5-flash-thinking",
  "google_gemini-2.5-flash",
  "meta-llama_llama-4-maverick",
]);

export const MODEL_DISPLAY_NAMES = Object.fromEntries(
  Object.entries(MODEL_REGISTRY).map(([id, m]) => [id, m.displayName])
);

export const MODEL_CATEGORIES = Object.fromEntries(
  Object.entries(MODEL_REGISTRY).map(([id, m]) => [id, m.category])
);

export function isExcludedModel(model) {
  return EXCLUDED_MODELS.has(model);
}

export function displayName(model) {
  return MODEL_DISPLAY_NAMES[model] ?? model;
}

export function category(model) {
  return MODEL_CATEGORIES[model] ?? "unknown";
}
