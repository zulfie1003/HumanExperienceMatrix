import Anthropic from "@anthropic-ai/sdk";

export const isAnthropicConfigured = Boolean(
  process.env.ANTHROPIC_API_KEY &&
    !process.env.ANTHROPIC_API_KEY.includes("your-anthropic-api-key")
);

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || "not-configured",
});

export const AI_MODEL = "claude-sonnet-4-6";
export const MAX_TOKENS = 4096;
