import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

// ============================================================================
// Middleware Configuration
// ============================================================================

/**
 * Routes that require authentication
 * Add your protected routes here
 */
const PROTECTED_ROUTES = ["/dashboard", "/profile", "/settings", "/account"];

/**
 * Routes that should redirect to home if user is already authenticated
 */
const AUTH_ROUTES = ["/sign-in", "/sign-up", "/login", "/register"];

/**
 * Public routes that bypass all middleware checks
 */
const PUBLIC_ROUTES = [
  "/api",
  "/auth",
  "/_next",
  "/favicon.ico",
  "/images",
  "/assets",
];

// ============================================================================
// CORS Configuration
// ============================================================================

const corsOptions = {
  "Access-Control-Allow-Origin": process.env.CORS_ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
  "Access-Control-Allow-Headers":
    "Accept,Authorization,Cache-Control,Content-Type,DNT,Expires,If-Modified-Since,Pragma,Range,User-Agent,X-Requested-With",
  "Access-Control-Expose-Headers":
    "Cache-Control,Content-Language,Content-Length,Content-Type,Content-Range,Expires,Last-Modified,Pragma",
};

// ============================================================================
// Middleware
// ============================================================================

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Handle preflight requests (CORS)
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Max-Age": "1728000",
        ...corsOptions,
      },
    });
  }

  // Skip middleware for public routes
  if (PUBLIC_ROUTES.some((route) => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Get session from Better Auth cookie
  const sessionCookie = getSessionCookie(request);
  const isAuthenticated = !!sessionCookie;

  // Redirect authenticated users away from auth pages
  if (AUTH_ROUTES.some((route) => pathname.startsWith(route))) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/", request.url));
    }
    return NextResponse.next();
  }

  // Protect routes that require authentication
  if (PROTECTED_ROUTES.some((route) => pathname.startsWith(route)) && !isAuthenticated) {
      const signInUrl = new URL("/sign-in", request.url);
      // Preserve the original URL as a callback
      signInUrl.searchParams.set("callbackUrl", pathname);
      return NextResponse.redirect(signInUrl);
    }

  // Continue to the route
  const response = NextResponse.next();

  // Add CORS headers to the response
  for (const [key, value] of Object.entries(corsOptions)) {
    response.headers.set(key, value);
  }

  return response;
}

// ============================================================================
// Matcher Configuration
// ============================================================================

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files (images, etc.)
     */
    String.raw`/((?!_next/static|_next/image|favicon.ico|.*\.(?:svg|png|jpg|jpeg|gif|webp)$).*)`,
  ],
};
