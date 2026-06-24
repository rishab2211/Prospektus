import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Next.js Middleware — Route Protection
 *
 * This runs on every request and checks:
 *   1. If the route is public → allow through
 *   2. If the route is protected and user has no refresh token cookie → redirect to /sign-in
 *   3. If user is authenticated and tries to access /sign-in or /sign-up → redirect to /dashboard
 *
 * Note: We check for the refreshToken cookie presence as a proxy for "logged in".
 * The actual JWT verification happens on the backend when making API calls.
 */

// Routes that don't require authentication
const publicRoutes = ["/", "/sign-in", "/sign-up", "/preview"];

// Routes that are always accessible (API routes, static files, etc.)
const alwaysAllowPrefixes = ["/api", "/_next", "/favicon.ico"];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    // Always allow API routes, Next.js internals, and static files
    if (alwaysAllowPrefixes.some((prefix) => pathname.startsWith(prefix))) {
        return NextResponse.next();
    }

    const hasRefreshToken = request.cookies.has("refreshToken");

    // Check if the current path is a public route
    const isPublicRoute = publicRoutes.some(
        (route) => pathname === route || pathname.startsWith(`${route}/`)
    );

    // Authenticated user trying to access auth pages → redirect to dashboard
    if (hasRefreshToken && (pathname === "/sign-in" || pathname === "/sign-up")) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Unauthenticated user trying to access protected route → redirect to sign-in
    if (!hasRefreshToken && !isPublicRoute) {
        const signInUrl = new URL("/sign-in", request.url);
        // Store the attempted URL so we can redirect back after login
        signInUrl.searchParams.set("callbackUrl", pathname);
        return NextResponse.redirect(signInUrl);
    }

    return NextResponse.next();
}

export const config = {
    // Run middleware on all routes except static files and images
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
