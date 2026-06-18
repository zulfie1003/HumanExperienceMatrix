import {
  anthropicClient,
  AI_MODEL,
  MAX_TOKENS,
  isAnthropicConfigured,
} from "@/lib/claude";
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
    if (!isAnthropicConfigured) {
      return this.generateDemoResponse(question, perspectives);
    }

    const userPrompt = buildUserPrompt(question, perspectives);

    // RAG hook point: before calling the LLM, you could retrieve
    // relevant context from a vector DB and inject it into the prompt.
    // const ragContext = await retrieveContext(question);
    // const augmentedPrompt = injectContext(userPrompt, ragContext);

    const message = await anthropicClient.messages.create({
      model: AI_MODEL,
      max_tokens: MAX_TOKENS,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: userPrompt,
        },
      ],
    });

    const textContent = message.content.find((block) => block.type === "text");
    if (!textContent || textContent.type !== "text") {
      throw new Error("No text content in AI response");
    }

    return this.parseResponse(textContent.text);
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

  private generateDemoResponse(
    question: string,
    perspectives: Perspective[]
  ): AIResponse {
    const selected =
      perspectives.includes("all") || perspectives.length === 0
        ? "history, psychology, philosophy, entrepreneurship, science, and spirituality"
        : perspectives.join(", ");

    return {
      situationSummary: `Demo analysis for: "${question}". Add a real ANTHROPIC_API_KEY in .env to receive live Claude responses.`,
      underlyingPattern:
        "The core pattern is a search for clarity under uncertainty: naming the problem, separating facts from interpretations, and choosing a next small action.",
      historicalParallels: [
        {
          figure: "Marcus Aurelius",
          era: "Roman Empire",
          situation:
            "Led through pressure, conflict, and incomplete information while trying to preserve judgment.",
          lesson:
            "Focus attention on what is controllable, then act with discipline instead of waiting for perfect certainty.",
        },
      ],
      perspectiveInsights: [
        {
          perspective: selected,
          insight:
            "Across these lenses, progress usually begins when the situation is made concrete enough to test with one practical step.",
          keyThinkers: ["Marcus Aurelius", "William James", "Carol Dweck"],
        },
      ],
      repeatingPatterns: [
        "People overestimate the need for total certainty before beginning.",
        "Small experiments reduce anxiety faster than abstract rumination.",
        "Writing the problem clearly often reveals the next useful move.",
      ],
      practicalLessons: [
        "Define the decision or fear in one sentence.",
        "List what is known, unknown, and controllable.",
        "Take one reversible action within the next 24 hours.",
      ],
      bookRecommendations: [
        {
          title: "Meditations",
          author: "Marcus Aurelius",
          relevance:
            "A compact guide to keeping judgment steady when life feels noisy or pressured.",
        },
      ],
    };
  }
}

export const aiService = new AIService();
