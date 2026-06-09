import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const token = request.cookies.get("brainos-auth-token")?.value;
  const { pathname } = request.nextUrl;

  // Protected paths
  const protectedPaths = [
    "/dashboard",
    "/checkin",
    "/mood",
    "/journal",
    "/stress",
    "/burnout",
    "/focus",
    "/habits",
    "/coach",
    "/forecast",
    "/settings"
  ];

  // Auth pages (login, signup, forgot-password)
  const authPaths = ["/login", "/signup", "/forgot-password"];

  // Verify if accessing a protected route
  const isProtected = protectedPaths.some((path) => pathname === path || pathname.startsWith(path + "/"));
  const isAuthPage = authPaths.some((path) => pathname === path);

  if (isProtected && !token) {
    // Redirect to login if token is missing
    const loginUrl = new URL("/login", request.url);
    // Optionally preserve the path they wanted
    loginUrl.searchParams.set("from", pathname);
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthPage && token) {
    // Redirect to dashboard if logged in
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  // Run proxy on all App Router pages, excluding static files
  matcher: [
    "/dashboard/:path*",
    "/checkin/:path*",
    "/mood/:path*",
    "/journal/:path*",
    "/stress/:path*",
    "/burnout/:path*",
    "/focus/:path*",
    "/habits/:path*",
    "/coach/:path*",
    "/forecast/:path*",
    "/settings/:path*",
    "/login",
    "/signup",
    "/forgot-password"
  ]
};
