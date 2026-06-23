import { createGroqChatCompletion } from "@/lib/groq";
import { SYSTEM_PROMPT, buildUserPrompt } from "@/lib/prompts";
import { AIResponse, Perspective } from "@/types";

export class AIService {
  /**
   * Generates a structured AI response for a user's question.
   * This layer is isolated so the AI provider can be swapped
   * or a RAG retrieval step can be inserted before the API call.
   */
  async generateResponse(
    question: string,
    perspectives: Perspective[]
  ): Promise<AIResponse> {
    const userPrompt = buildUserPrompt(question, perspectives);

    // RAG hook point: before calling the LLM, you could retrieve
    // relevant context from a vector DB and inject it into the prompt.
    // const ragContext = await retrieveContext(question);
    // const augmentedPrompt = injectContext(userPrompt, ragContext);

    const content = await createGroqChatCompletion([
      {
        role: "system",
        content: SYSTEM_PROMPT,
      },
      {
        role: "user",
        content: userPrompt,
      },
    ]);

    return this.parseResponse(content);
  }

  private parseResponse(rawText: string): AIResponse {
    try {
      // Strip any accidental markdown code fences
      const cleaned = rawText
        .replace(/^```json\s*/i, "")
        .replace(/^```\s*/i, "")
        .replace(/\s*```$/i, "")
        .trim();

      const parsed = JSON.parse(cleaned) as AIResponse;
      this.validateResponse(parsed);
      return parsed;
    } catch (error) {
      throw new Error(
        `Failed to parse AI response: ${error instanceof Error ? error.message : "Unknown error"}`
      );
    }
  }

  private validateResponse(response: AIResponse): void {
    const required: (keyof AIResponse)[] = [
      "situationSummary",
      "underlyingPattern",
      "historicalParallels",
      "perspectiveInsights",
      "repeatingPatterns",
      "practicalLessons",
      "bookRecommendations",
    ];

    for (const field of required) {
      if (!(field in response)) {
        throw new Error(`Missing required field in AI response: ${field}`);
      }
    }
  }
}

export const aiService = new AIService();
