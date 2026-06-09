import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/user.model";
import { VerificationCode } from "../../../../../lib/models/verification.model";

export async function POST(request: NextRequest) {
  try {
    const { email, code, newPassword } = await request.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: "All fields are required." }, { status: 400 });
    }

    if (newPassword.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
    }

    await connectDB();

    const record = await VerificationCode.findOne({
      email: email.toLowerCase(),
      type: "forgot-password",
      expiresAt: { $gt: new Date() },
    });

    if (!record || record.code !== code) {
      return NextResponse.json({ error: "Invalid or expired reset code." }, { status: 400 });
    }

    const passwordHash = await bcrypt.hash(newPassword, 12);

    const user = await User.findOneAndUpdate(
      { email: email.toLowerCase() },
      { passwordHash },
      { new: true }
    );

    if (!user) {
      return NextResponse.json({ error: "Account not found." }, { status: 404 });
    }

    // Cleanup OTP
    await VerificationCode.deleteMany({ email: email.toLowerCase(), type: "forgot-password" });

    return NextResponse.json({ message: "Password updated successfully. Please log in." });
  } catch (error) {
    console.error("[forgot-password/reset] Error:", error);
    return NextResponse.json({ error: "Failed to reset password. Please try again." }, { status: 500 });
  }
}
