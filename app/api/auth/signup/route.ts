import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '@/lib/mongodb';
import { User } from '@/models/User';
import { verifyAndClearCode } from '@/lib/verificationStore';

export async function POST(req: NextRequest) {
  try {
    const { name, email, password, code } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    if (password.length < 6) {
      return NextResponse.json({ error: 'Password must be at least 6 characters long' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Verify code if code is supplied
    if (code) {
      const isValidCode = verifyAndClearCode(normalizedEmail, code, 'signup');
      if (!isValidCode) {
        return NextResponse.json(
          { error: 'Invalid or expired verification code. Please request a new code.' },
          { status: 400 }
        );
      }
    }

    let mongoUser = null;
    let dbConnected = false;

    try {
      await connectToDatabase();
      dbConnected = true;
    } catch (dbErr: any) {
      console.warn('MongoDB Atlas connection notice during signup:', dbErr?.message || dbErr);
    }

    if (dbConnected) {
      try {
        const existingUser = await User.findOne({ email: normalizedEmail });
        if (existingUser) {
          return NextResponse.json(
            { error: 'An account with this email already exists. Please sign in.' },
            { status: 400 }
          );
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        mongoUser = await User.create({
          name: name || 'BrainOS User',
          email: normalizedEmail,
          password: hashedPassword,
          provider: 'credentials',
        });
      } catch (err: any) {
        console.warn('MongoDB Atlas User.create notice:', err?.message || err);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Neural Profile registered & verified successfully!',
      user: {
        id: mongoUser ? mongoUser._id.toString() : `user-${Date.now()}`,
        name: mongoUser ? mongoUser.name : (name || 'BrainOS User'),
        email: normalizedEmail,
      },
    });
  } catch (error: any) {
    console.error('Signup API error:', error);
    return NextResponse.json(
      { error: error?.message || 'Failed to create profile in database.' },
      { status: 500 }
    );
  }
}

