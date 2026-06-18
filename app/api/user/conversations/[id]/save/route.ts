import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { conversationService } from "@/services/conversation.service";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await conversationService.saveConversation(session.user.id, id);
    return NextResponse.json({ saved: true });
  } catch (error) {
    console.error("Save conversation error:", error);
    return NextResponse.json(
      { error: "Failed to save conversation" },
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
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await conversationService.unsaveConversation(session.user.id, id);
    return NextResponse.json({ saved: false });
  } catch (error) {
    console.error("Unsave conversation error:", error);
    return NextResponse.json(
      { error: "Failed to unsave conversation" },
      { status: 500 }
    );
  }
}
