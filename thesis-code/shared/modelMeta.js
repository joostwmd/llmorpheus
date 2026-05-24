/** Artifact directory names excluded from thesis analysis (deprecated / reasoning models). */
export const EXCLUDED_MODELS = new Set([
  "google_gemini-2.5-flash-thinking",
  "google_gemini-2.5-flash",
  "meta-llama_llama-4-maverick",
]);

export const MODEL_DISPLAY_NAMES = {
  "openai_gpt-4o-mini": "GPT-4o-mini",
  "google_gemini-3.5-flash": "Gemini 3.5 Flash",
  "anthropic_claude-haiku-4.5": "Claude Haiku 4.5",
  "anthropic_claude-sonnet-4.5": "Claude Sonnet 4.5",
  "meta-llama_llama-3.3-70b-instruct": "Llama 3.3 70B",
  "meta-llama_llama-3.1-8b-instruct": "Llama 3.1 8B",
  "qwen_qwen-2.5-coder-32b-instruct": "Qwen 2.5 Coder 32B",
  "deepseek_deepseek-chat-v3.1": "DeepSeek Chat v3.1",
};

export const MODEL_CATEGORIES = {
  "openai_gpt-4o-mini": "api-only",
  "google_gemini-3.5-flash": "api-only",
  "anthropic_claude-haiku-4.5": "api-only",
  "anthropic_claude-sonnet-4.5": "api-only",
  "meta-llama_llama-3.3-70b-instruct": "open-weight",
  "meta-llama_llama-3.1-8b-instruct": "open-weight",
  "qwen_qwen-2.5-coder-32b-instruct": "open-weight",
  "deepseek_deepseek-chat-v3.1": "hybrid",
};

export function isExcludedModel(model) {
  return EXCLUDED_MODELS.has(model);
}

export function displayName(model) {
  return MODEL_DISPLAY_NAMES[model] ?? model;
}

export function category(model) {
  return MODEL_CATEGORIES[model] ?? "unknown";
}
