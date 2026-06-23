export const isGroqConfigured = Boolean(
  process.env.GROQ_API_KEY &&
    !process.env.GROQ_API_KEY.includes("your-groq-api-key")
);

export const GROQ_BASE_URL =
  process.env.GROQ_BASE_URL || "https://api.groq.com/openai/v1";

export const AI_MODEL = process.env.GROQ_MODEL || "llama-3.3-70b-versatile";
export const MAX_TOKENS = Number(process.env.GROQ_MAX_TOKENS || 4096);

interface GroqMessage {
  role: "system" | "user";
  content: string;
}

interface GroqChatCompletion {
  choices?: Array<{
    message?: {
      content?: string | null;
    };
  }>;
  error?: {
    message?: string;
  };
}

export async function createGroqChatCompletion(
  messages: GroqMessage[]
): Promise<string> {
  if (!isGroqConfigured) {
    throw new Error(
      "GROQ_API_KEY is not configured with a real key. Add your Groq API key to .env and restart the dev server."
    );
  }

  const response = await fetch(`${GROQ_BASE_URL}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: AI_MODEL,
      messages,
      max_completion_tokens: MAX_TOKENS,
      response_format: { type: "json_object" },
      stream: false,
    }),
  });

  const payload = (await response.json().catch(() => null)) as
    | GroqChatCompletion
    | null;

  if (!response.ok) {
    throw new Error(
      payload?.error?.message || `Groq API request failed with ${response.status}`
    );
  }

  const content = payload?.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("No text content in Groq response");
  }

  return content;
}
