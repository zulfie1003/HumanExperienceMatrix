import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { conversationService } from "@/services/conversation.service";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const guestUserId = req.headers.get("x-guest-user-id");
    const userId = session?.user?.id ?? guestUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversation = await conversationService.getConversationById(
      id,
      userId
    );

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ conversation });
  } catch (error) {
    console.error("Get conversation error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversation" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    const guestUserId = req.headers.get("x-guest-user-id");
    const userId = session?.user?.id ?? guestUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deleted = await conversationService.deleteConversation(
      id,
      userId
    );

    if (!deleted) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete conversation error:", error);
    return NextResponse.json(
      { error: "Failed to delete conversation" },
      { status: 500 }
    );
  }
}
