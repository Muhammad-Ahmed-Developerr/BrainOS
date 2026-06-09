import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../lib/db";
import { User } from "../../../../lib/models/user.model";
import { VerificationCode } from "../../../../lib/models/verification.model";
import { signToken } from "../../../../lib/utils/jwt";

export async function POST(request: NextRequest) {
  try {
    const { email, code, password, fullName, goals, sleepTarget, workHours, stressBaseline } =
      await request.json();

    if (!email || !code || !password || !fullName) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();

    // Verify OTP
    const record = await VerificationCode.findOne({
      email: email.toLowerCase(),
      type: "signup",
      expiresAt: { $gt: new Date() },
    });

    if (!record || record.code !== code) {
      return NextResponse.json({ error: "Invalid or expired verification code." }, { status: 400 });
    }

    // Check duplicate
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      email: email.toLowerCase(),
      passwordHash,
      fullName,
      goals: goals || [],
      sleepTarget: sleepTarget || 8,
      workHours: workHours || 8,
      stressBaseline: stressBaseline || 5,
      emailVerified: true,
      provider: "email",
      avatarUrl: `https://api.dicebear.com/8.x/initials/svg?seed=${encodeURIComponent(fullName)}&backgroundColor=6d28d9`,
    });

    // Clean up OTP
    await VerificationCode.deleteMany({ email: email.toLowerCase(), type: "signup" });

    const token = signToken({ userId: user._id.toString(), email: user.email });

    const response = NextResponse.json({
      message: "Account created successfully.",
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

    response.cookies.set("brainos-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("[signup] Error:", error);
    return NextResponse.json({ error: "Failed to create account. Please try again." }, { status: 500 });
  }
}
