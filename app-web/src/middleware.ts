export { auth as middleware } from "@/auth";

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
