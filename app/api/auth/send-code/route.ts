import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { saveVerificationCode } from '@/lib/verificationStore';
import { generateVerificationCode, sendVerificationEmail } from '@/lib/email';

export async function POST(req: NextRequest) {
  try {
    const { email, type } = await req.json();

    if (!email || !email.trim() || !email.includes('@')) {
      return NextResponse.json({ error: 'Please enter a valid email address' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const actionType = type === 'forgot-password' ? 'forgot-password' : 'signup';

    let dbConnected = false;
    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (dbErr) {
      console.warn('Database connection warning during send-code:', dbErr);
    }

    if (dbConnected) {
      const existingUser = await User.findOne({ email: normalizedEmail });

      if (actionType === 'signup' && existingUser) {
        return NextResponse.json(
          { error: 'An account with this email already exists. Please sign in instead.' },
          { status: 400 }
        );
      }

      if (actionType === 'forgot-password' && !existingUser) {
        return NextResponse.json(
          { error: 'No user account found with this email address.' },
          { status: 404 }
        );
      }
    }

    // Generate code & store it
    const code = generateVerificationCode();
    saveVerificationCode(normalizedEmail, code, actionType, 10);

    const subject = actionType === 'signup'
      ? 'BrainOS - Neural Profile Verification Code'
      : 'BrainOS - Neural Access Reset Code';

    const title = actionType === 'signup'
      ? 'Verify Your Neural Enclave Profile'
      : 'Reset Neural Access Credentials';

    const description = actionType === 'signup'
      ? 'Enter the 6-digit verification code below to verify your email address and activate your BrainOS account.'
      : 'Enter the 6-digit verification code below to reset your password and recover your BrainOS account.';

    const emailResult = await sendVerificationEmail(normalizedEmail, code, subject, title, description);

    return NextResponse.json({
      success: true,
      message: emailResult.sentViaSmtp
        ? `Verification code sent to ${normalizedEmail}. Check your inbox.`
        : `Verification code generated for ${normalizedEmail}.`,
      sentViaSmtp: emailResult.sentViaSmtp,
      devCode: code, // Supplied so user can seamlessly test in development environment
    });
  } catch (err: any) {
    console.error('Send code error:', err);
    return NextResponse.json(
      { error: err?.message || 'Failed to send verification code. Please try again.' },
      { status: 500 }
    );
  }
}
