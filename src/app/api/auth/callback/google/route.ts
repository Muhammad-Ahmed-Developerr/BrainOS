import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "../../../../../lib/db";
import { User } from "../../../../../lib/models/user.model";
import { signToken } from "../../../../../lib/utils/jwt";

export async function GET(request: NextRequest) {
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");

  if (error || !code) {
    return NextResponse.redirect(`${baseUrl}/login?error=google_oauth_cancelled`);
  }

  try {
    const clientId = process.env.GOOGLE_CLIENT_ID!;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
    const redirectUri = `${baseUrl}/api/auth/callback/google`;

    // Exchange code for tokens
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_token_failed`);
    }

    // Fetch Google user profile
    const profileRes = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileRes.json();

    if (!profile.email) {
      return NextResponse.redirect(`${baseUrl}/login?error=google_no_email`);
    }

    await connectDB();

    // Upsert user - find by googleId or email
    let user = await User.findOne({
      $or: [{ googleId: profile.id }, { email: profile.email.toLowerCase() }],
    });

    if (user) {
      // Update Google fields if needed
      if (!user.googleId) user.googleId = profile.id;
      if (!user.avatarUrl && profile.picture) user.avatarUrl = profile.picture;
      user.provider = "google";
      await user.save();
    } else {
      user = await User.create({
        email: profile.email.toLowerCase(),
        fullName: profile.name || profile.email.split("@")[0],
        avatarUrl: profile.picture || "",
        googleId: profile.id,
        emailVerified: true,
        provider: "google",
        goals: [],
      });
    }

    const token = signToken({ userId: user._id.toString(), email: user.email });

    const response = NextResponse.redirect(`${baseUrl}/dashboard`);
    response.cookies.set("brainos-auth-token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });

    return response;
  } catch (err) {
    console.error("[callback/google] Error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=google_callback_failed`);
  }
}
