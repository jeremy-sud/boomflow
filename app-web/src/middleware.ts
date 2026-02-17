import { NextRequest, NextResponse } from "next/server";

// Auth middleware temporarily disabled for local development.
// In production, auth is enforced at the page/API level via `auth()` from @/auth.
// Next.js 16 Edge runtime does not support Node.js 'crypto' module
// required by next-auth/jwt. Use the "proxy" convention when available.
export async function middleware(_req: NextRequest) {
  return NextResponse.next();
}

// Protect all routes except login, api/auth and static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api/auth (auth endpoints)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - login (login page)
     * - public assets
     */
    "/((?!api/auth|_next/static|_next/image|favicon.ico|login).*)",
  ],
};
