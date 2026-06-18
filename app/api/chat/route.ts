import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { aiService } from "@/services/ai.service";
import { conversationService } from "@/services/conversation.service";
import { ChatRequest, ChatResponse, ApiError } from "@/types";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();

    // Check for guest user ID in header (set by client for guest sessions)
    const guestUserId = req.headers.get("x-guest-user-id");
    const userId = session?.user?.id ?? guestUserId;

    if (!userId) {
      return NextResponse.json<ApiError>(
        { error: "Unauthorized. Please sign in or continue as guest." },
        { status: 401 }
      );
    }

    const body = (await req.json()) as ChatRequest;
    const { question, perspectives } = body;

    if (!question || question.trim().length === 0) {
      return NextResponse.json<ApiError>(
        { error: "Question is required" },
        { status: 400 }
      );
    }

    if (question.trim().length > 2000) {
      return NextResponse.json<ApiError>(
        { error: "Question is too long. Please keep it under 2000 characters." },
        { status: 400 }
      );
    }

    const effectivePerspectives =
      !perspectives || perspectives.length === 0 ? ["all"] : perspectives;

    // Call AI service (swap provider here in future)
    const aiResponse = await aiService.generateResponse(
      question.trim(),
      effectivePerspectives as ChatRequest["perspectives"]
    );

    // Persist conversation
    const conversation = await conversationService.createConversation(
      userId,
      question.trim(),
      effectivePerspectives as ChatRequest["perspectives"],
      aiResponse
    );

    return NextResponse.json<ChatResponse>({
      conversationId: conversation.id,
      response: aiResponse,
    });
  } catch (error) {
    console.error("Chat API error:", error);
    const message =
      error instanceof Error ? error.message : "An unexpected error occurred";
    return NextResponse.json<ApiError>(
      { error: "Failed to process your request", details: message },
      { status: 500 }
    );
  }
}
