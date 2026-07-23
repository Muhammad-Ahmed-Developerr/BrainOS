import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyAndClearCode } from '@/lib/verificationStore';

export async function POST(req: NextRequest) {
  try {
    const { email, code, newPassword } = await req.json();

    if (!email || !code || !newPassword) {
      return NextResponse.json({ error: 'Email, verification code, and new password are required.' }, { status: 400 });
    }

    if (newPassword.length < 6) {
      return NextResponse.json({ error: 'New password must be at least 6 characters long.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify OTP code
    const isCodeValid = verifyAndClearCode(normalizedEmail, code, 'forgot-password');
    if (!isCodeValid) {
      return NextResponse.json({ error: 'Invalid or expired verification code. Please request a new code.' }, { status: 400 });
    }

    let dbConnected = false;
    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (dbErr) {
      console.warn('Database offline during password reset:', dbErr);
    }

    if (dbConnected) {
      const user = await User.findOne({ email: normalizedEmail });
      if (user) {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;
        await user.save();
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Password reset successfully! You can now sign in with your new password.',
    });
  } catch (err: any) {
    console.error('Reset password error:', err);
    return NextResponse.json(
      { error: err?.message || 'An error occurred while resetting your password.' },
      { status: 500 }
    );
  }
}
