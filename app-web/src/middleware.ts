import { auth } from "@/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  // If user is not authenticated and not on login page, redirect to login
  if (!req.auth && !req.nextUrl.pathname.startsWith('/login')) {
    const loginUrl = new URL('/login', req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', req.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }
});

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
