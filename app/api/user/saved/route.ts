import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { conversationService } from "@/services/conversation.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await conversationService.getSavedConversations(
      session.user.id
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Get saved conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch saved conversations" },
      { status: 500 }
    );
  }
}
