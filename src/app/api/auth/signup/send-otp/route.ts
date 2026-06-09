import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/user.model";
import { VerificationCode } from "../../../../../lib/models/verification.model";
import { sendVerificationCode, generateOTP } from "../../../../../lib/utils/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }

    await connectDB();

    // Check if email is already registered
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    // Delete any previous OTPs for this email
    await VerificationCode.deleteMany({ email: email.toLowerCase(), type: "signup" });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      type: "signup",
      expiresAt,
    });

    await sendVerificationCode(email, code, "signup");

    return NextResponse.json({ message: "Verification code sent to your email." });
  } catch (error) {
    console.error("[send-otp] Error:", error);
    return NextResponse.json({ error: "Failed to send verification code. Please try again." }, { status: 500 });
  }
}
