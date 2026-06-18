import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { conversationService } from "@/services/conversation.service";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const guestUserId = req.headers.get("x-guest-user-id");
    const userId = session?.user?.id ?? guestUserId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const limit = parseInt(url.searchParams.get("limit") ?? "20");
    const offset = parseInt(url.searchParams.get("offset") ?? "0");

    const conversations = await conversationService.getUserConversations(
      userId,
      limit,
      offset
    );

    return NextResponse.json({ conversations });
  } catch (error) {
    console.error("Get conversations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch conversations" },
      { status: 500 }
    );
  }
}
