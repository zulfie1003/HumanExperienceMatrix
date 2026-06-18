import { prisma } from "@/lib/prisma";
import { AIResponse, ConversationWithParsedResponse, Perspective } from "@/types";

export class ConversationService {
  async createConversation(
    userId: string,
    question: string,
    perspectives: Perspective[],
    aiResponse: AIResponse
  ): Promise<ConversationWithParsedResponse> {
    const title = this.generateTitle(question);

    const conversation = await prisma.conversation.create({
      data: {
        userId,
        userQuestion: question,
        selectedPerspectives: JSON.stringify(perspectives),
        aiResponse: JSON.stringify(aiResponse),
        title,
      },
    });

    return {
      ...conversation,
      selectedPerspectives: perspectives,
      aiResponse,
    };
  }

  async getUserConversations(
    userId: string,
    limit = 20,
    offset = 0
  ): Promise<ConversationWithParsedResponse[]> {
    const conversations = await prisma.conversation.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
      take: limit,
      skip: offset,
    });

    return conversations.map((c: (typeof conversations)[0]) => ({
      ...c,
      selectedPerspectives: this.parsePerspectives(c.selectedPerspectives),
      aiResponse: this.parseAiResponse(c.aiResponse),
    }));
  }

  async getConversationById(
    id: string,
    userId: string
  ): Promise<ConversationWithParsedResponse | null> {
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) return null;

    return {
      ...conversation,
      selectedPerspectives: this.parsePerspectives(conversation.selectedPerspectives),
      aiResponse: this.parseAiResponse(conversation.aiResponse),
    };
  }

  async deleteConversation(id: string, userId: string): Promise<boolean> {
    const conversation = await prisma.conversation.findFirst({
      where: { id, userId },
    });

    if (!conversation) return false;

    await prisma.conversation.delete({ where: { id } });
    return true;
  }

  async saveConversation(
    userId: string,
    conversationId: string
  ): Promise<void> {
    await prisma.savedConversation.upsert({
      where: { userId_conversationId: { userId, conversationId } },
      update: {},
      create: { userId, conversationId },
    });
  }

  async unsaveConversation(
    userId: string,
    conversationId: string
  ): Promise<void> {
    await prisma.savedConversation.deleteMany({
      where: { userId, conversationId },
    });
  }

  async getSavedConversations(
    userId: string
  ): Promise<ConversationWithParsedResponse[]> {
    const saved = await prisma.savedConversation.findMany({
      where: { userId },
      include: { conversation: true },
      orderBy: { savedAt: "desc" },
    });

    return saved.map((s: (typeof saved)[0]) => ({
      ...s.conversation,
      selectedPerspectives: this.parsePerspectives(
        s.conversation.selectedPerspectives
      ),
      aiResponse: this.parseAiResponse(s.conversation.aiResponse),
    }));
  }

  async isConversationSaved(
    userId: string,
    conversationId: string
  ): Promise<boolean> {
    const saved = await prisma.savedConversation.findUnique({
      where: { userId_conversationId: { userId, conversationId } },
    });
    return !!saved;
  }

  private generateTitle(question: string): string {
    return question.length > 60 ? question.slice(0, 60) + "..." : question;
  }

  private parsePerspectives(value: string): string[] {
    try {
      const parsed = JSON.parse(value);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  private parseAiResponse(value: string): AIResponse {
    return JSON.parse(value) as AIResponse;
  }
}

export const conversationService = new ConversationService();
