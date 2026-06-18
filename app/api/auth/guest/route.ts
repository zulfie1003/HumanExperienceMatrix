import { NextResponse } from "next/server";
import { userService } from "@/services/user.service";

export async function POST() {
  try {
    const guestUser = await userService.createGuestUser();
    return NextResponse.json({ userId: guestUser.id, isGuest: true });
  } catch (error) {
    console.error("Guest creation error:", error);
    return NextResponse.json(
      { error: "Failed to create guest session" },
      { status: 500 }
    );
  }
}
