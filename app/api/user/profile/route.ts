import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { userService } from "@/services/user.service";

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { name } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    const updated = await userService.updateUser(session.user.id, {
      name: name.trim(),
    });

    return NextResponse.json({ user: { id: updated.id, name: updated.name } });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await userService.getUserById(session.user.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const conversationCount = await userService.getConversationCount(session.user.id);

    return NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        createdAt: user.createdAt,
        conversationCount,
      },
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}
