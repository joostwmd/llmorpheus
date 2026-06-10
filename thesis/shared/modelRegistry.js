/**
 * Central model registry: display names, categories, run policy, and analysis status.
 * Flip `status` manually as CI reruns complete (ready | pending | failed).
 */

/** @typedef {"single" | "multi"} RunPolicy */
/** @typedef {"ready" | "pending" | "failed"} ModelStatus */
/** @typedef {"api-only" | "open-weight" | "hybrid"} ModelCategory */

/**
 * @type {Record<string, {
 *   openRouterSlug: string,
 *   displayName: string,
 *   category: ModelCategory,
 *   runPolicy: RunPolicy,
 *   status: ModelStatus,
 * }>}
 */
export const MODEL_REGISTRY = {
  "openai_gpt-4o-mini": {
    openRouterSlug: "openai/gpt-4o-mini",
    displayName: "GPT-4o-mini",
    category: "api-only",
    runPolicy: "multi",
    status: "ready",
  },
  "openai_gpt-4o": {
    openRouterSlug: "openai/gpt-4o",
    displayName: "GPT-4o",
    category: "api-only",
    runPolicy: "single",
    status: "ready",
  },
  "google_gemini-3.1-flash-lite": {
    openRouterSlug: "google/gemini-3.1-flash-lite",
    displayName: "Gemini 3.1 Flash Lite",
    category: "api-only",
    runPolicy: "multi",
    status: "ready",
  },
  "google_gemini-3.5-flash": {
    openRouterSlug: "google/gemini-3.5-flash",
    displayName: "Gemini 3.5 Flash",
    category: "api-only",
    runPolicy: "single",
    status: "ready",
  },
  "anthropic_claude-haiku-4.5": {
    openRouterSlug: "anthropic/claude-haiku-4.5",
    displayName: "Claude Haiku 4.5",
    category: "api-only",
    runPolicy: "multi",
    status: "ready",
  },
  "anthropic_claude-sonnet-4.5": {
    openRouterSlug: "anthropic/claude-sonnet-4.5",
    displayName: "Claude Sonnet 4.5",
    category: "api-only",
    runPolicy: "single",
    status: "ready",
  },
  "meta-llama_llama-3.3-70b-instruct": {
    openRouterSlug: "meta-llama/llama-3.3-70b-instruct",
    displayName: "Llama 3.3 70B",
    category: "open-weight",
    runPolicy: "multi",
    status: "ready",
  },
  "meta-llama_llama-3.1-8b-instruct": {
    openRouterSlug: "meta-llama/llama-3.1-8b-instruct",
    displayName: "Llama 3.1 8B",
    category: "open-weight",
    runPolicy: "multi",
    status: "ready",
  },
  "qwen_qwen-2.5-coder-32b-instruct": {
    openRouterSlug: "qwen/qwen-2.5-coder-32b-instruct",
    displayName: "Qwen 2.5 Coder 32B",
    category: "open-weight",
    runPolicy: "multi",
    status: "ready",
  },
  "deepseek_deepseek-chat-v3.1": {
    openRouterSlug: "deepseek/deepseek-chat-v3.1",
    displayName: "DeepSeek Chat v3.1",
    category: "hybrid",
    runPolicy: "multi",
    status: "ready",
  },
};

const SINGLE_RUN_MODELS = new Set(
  Object.entries(MODEL_REGISTRY)
    .filter(([, m]) => m.runPolicy === "single")
    .map(([id]) => id)
);

const MULTI_RUN_MODELS = new Set(
  Object.entries(MODEL_REGISTRY)
    .filter(([, m]) => m.runPolicy === "multi")
    .map(([id]) => id)
);

/** @param {string} rq */
export function getModelsForRq(rq) {
  const ready = getReadyModels();
  if (rq === "rq2") {
    return ready.filter((m) => isMultiRunModel(m));
  }
  return ready;
}

export function getReadyModels() {
  return Object.entries(MODEL_REGISTRY)
    .filter(([, m]) => m.status === "ready")
    .map(([id]) => id);
}

export function getRegistryEntry(model) {
  return MODEL_REGISTRY[model] ?? null;
}

export function modelStatus(model) {
  return MODEL_REGISTRY[model]?.status ?? null;
}

export function isReadyModel(model) {
  return modelStatus(model) === "ready";
}

export function isMultiRunModel(model) {
  return MULTI_RUN_MODELS.has(model);
}

export function isSingleRunModel(model) {
  return SINGLE_RUN_MODELS.has(model);
}

export function maxExpectedRuns(model) {
  return isMultiRunModel(model) ? 5 : 1;
}

export function skipReason(model, rq) {
  const entry = getRegistryEntry(model);
  if (!entry) return "not in registry";
  if (entry.status === "pending") return "status pending";
  if (entry.status === "failed") return "status failed";
  if (rq === "rq2" && entry.runPolicy !== "multi") return "single-run model excluded from RQ2";
  return null;
}

export const API_TIER_PAIRS = [
  { provider: "OpenAI", cheap: "openai_gpt-4o-mini", premium: "openai_gpt-4o" },
  { provider: "Google", cheap: "google_gemini-3.1-flash-lite", premium: "google_gemini-3.5-flash" },
  { provider: "Anthropic", cheap: "anthropic_claude-haiku-4.5", premium: "anthropic_claude-sonnet-4.5" },
];
export const OPEN_WEIGHT_TIER_PAIR = {
  provider: "Meta",
  cheap: "meta-llama_llama-3.1-8b-instruct",
  premium: "meta-llama_llama-3.3-70b-instruct",
};
