import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Middleware for authentication and authorization
 * Runs at the edge before requests reach the page
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Get access token from cookies
  const token = request.cookies.get("accessToken")?.value;

  // Protected routes that require authentication
  const protectedPaths = [
    "/customer",
    "/seller",
    "/admin",
    "/moderator",
    "/checkout",
  ];

  // Auth pages (should redirect to home if already logged in)
  const authPaths = ["/login", "/register"];

  // Check if current path is protected
  const isProtectedPath = protectedPaths.some((path) =>
    pathname.startsWith(path)
  );

  // Check if current path is an auth page
  const isAuthPath = authPaths.some((path) => pathname === path);

  // Redirect to login if accessing protected route without token
  if (isProtectedPath && !token) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect to home if accessing auth pages while logged in
  if (isAuthPath && token) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    // Protected routes
    "/customer/:path*",
    "/seller/:path*",
    "/admin/:path*",
    "/moderator/:path*",
    "/checkout/:path*",
    // Auth pages
    "/login",
    "/register",
  ],
};
