import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/user.model";
import { VerificationCode } from "../../../../../lib/models/verification.model";
import { sendVerificationCode, generateOTP } from "../../../../../lib/utils/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required." }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      // Return success anyway to prevent user enumeration attacks
      return NextResponse.json({ message: "If an account exists, a reset code has been sent." });
    }

    if (user.provider !== "email") {
      return NextResponse.json(
        { error: "This account uses Google or GitHub login. Password reset is not available." },
        { status: 400 }
      );
    }

    // Delete previous reset codes
    await VerificationCode.deleteMany({ email: email.toLowerCase(), type: "forgot-password" });

    const code = generateOTP();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await VerificationCode.create({
      email: email.toLowerCase(),
      code,
      type: "forgot-password",
      expiresAt,
    });

    await sendVerificationCode(email, code, "forgot-password");

    return NextResponse.json({ message: "If an account exists, a reset code has been sent." });
  } catch (error) {
    console.error("[forgot-password/send-otp] Error:", error);
    return NextResponse.json({ error: "Failed to send reset code. Please try again." }, { status: 500 });
  }
}
