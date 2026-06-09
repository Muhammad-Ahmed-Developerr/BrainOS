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
    return NextResponse.redirect(`${baseUrl}/login?error=github_oauth_cancelled`);
  }

  try {
    const clientId = process.env.GITHUB_CLIENT_ID!;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET!;
    const redirectUri = `${baseUrl}/api/auth/callback/github`;

    // Exchange code for access token
    const tokenRes = await fetch("https://github.com/login/oauth/access_token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Accept: "application/json",
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return NextResponse.redirect(`${baseUrl}/login?error=github_token_failed`);
    }

    // Fetch GitHub user profile
    const profileRes = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        Accept: "application/vnd.github.v3+json",
      },
    });
    const profile = await profileRes.json();

    // Fetch email separately (GitHub may not return it in profile)
    let email = profile.email;
    if (!email) {
      const emailsRes = await fetch("https://api.github.com/user/emails", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
          Accept: "application/vnd.github.v3+json",
        },
      });
      const emails = await emailsRes.json();
      const primaryEmail = emails.find((e: { primary: boolean; email: string }) => e.primary);
      email = primaryEmail?.email;
    }

    if (!email) {
      return NextResponse.redirect(`${baseUrl}/login?error=github_no_email`);
    }

    await connectDB();

    let user = await User.findOne({
      $or: [{ githubId: String(profile.id) }, { email: email.toLowerCase() }],
    });

    if (user) {
      if (!user.githubId) user.githubId = String(profile.id);
      if (!user.avatarUrl && profile.avatar_url) user.avatarUrl = profile.avatar_url;
      await user.save();
    } else {
      user = await User.create({
        email: email.toLowerCase(),
        fullName: profile.name || profile.login || email.split("@")[0],
        avatarUrl: profile.avatar_url || "",
        githubId: String(profile.id),
        emailVerified: true,
        provider: "github",
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
    console.error("[callback/github] Error:", err);
    return NextResponse.redirect(`${baseUrl}/login?error=github_callback_failed`);
  }
}
