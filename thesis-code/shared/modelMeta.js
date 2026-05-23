export const MODEL_DISPLAY_NAMES = {
  "openai_gpt-4o-mini": "GPT-4o-mini",
  "anthropic_claude-sonnet-4.5": "Claude Sonnet 4.5",
  "google_gemini-2.5-flash": "Gemini 2.5 Flash",
  "google_gemini-2.5-flash-thinking": "Gemini 2.5 Flash (thinking)",
  "meta-llama_llama-3.3-70b-instruct": "Llama 3.3 70B",
  "meta-llama_llama-4-maverick": "Llama 4 Maverick",
  "deepseek_deepseek-chat-v3.1": "DeepSeek Chat v3.1",
};

export const MODEL_CATEGORIES = {
  "openai_gpt-4o-mini": "api-only",
  "anthropic_claude-sonnet-4.5": "api-only",
  "google_gemini-2.5-flash": "api-only",
  "google_gemini-2.5-flash-thinking": "api-only",
  "meta-llama_llama-3.3-70b-instruct": "open-weight",
  "meta-llama_llama-4-maverick": "open-weight",
  "deepseek_deepseek-chat-v3.1": "hybrid",
};

export const REASONING_PAIRS = [
  {
    provider: "Google",
    nonReasoning: "google_gemini-2.5-flash",
    reasoning: "google_gemini-2.5-flash-thinking",
  },
];

export function displayName(model) {
  return MODEL_DISPLAY_NAMES[model] ?? model;
}

export function category(model) {
  return MODEL_CATEGORIES[model] ?? "unknown";
}

export function isReasoningModel(model) {
  return REASONING_PAIRS.some((p) => p.reasoning === model);
}

export function getReasoningPairForModel(model) {
  return REASONING_PAIRS.find((p) => p.nonReasoning === model || p.reasoning === model) ?? null;
}
