import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/user.model";
import { verifyToken } from "../../../../lib/utils/jwt";

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get("brainos-auth-token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Not authenticated." }, { status: 401 });
    }

    const payload = verifyToken(token);
    if (!payload) {
      return NextResponse.json({ error: "Invalid or expired session." }, { status: 401 });
    }

    await connectDB();

    const user = await User.findById(payload.userId).select("-passwordHash");
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        fullName: user.fullName,
        avatarUrl: user.avatarUrl,
        goals: user.goals,
        preferences: user.preferences,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    console.error("[me] Error:", error);
    return NextResponse.json({ error: "Failed to fetch user." }, { status: 500 });
  }
}
