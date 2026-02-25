import { NextRequest, NextResponse } from "next/server";
import { ROUTES } from "@utils/routes";
import { ensureRequestID, getProtectedPathsStarting } from "@utils/utils";

export const config = {
  matcher: [
    {
      source: `/((?!assets|legal-assets|images|js|_next/static|_next|pdf|favicon.ico|sw.jss|icon|apple-icon|manifest).*)`,
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
  ],
};

// Do not allow js, css, map files, and other assets to be prefetched
const matcherRegex = new RegExp(
  "^(?!/.*(?:map|chrome|legal-assets|js|icon|robot)).*",
);

const corsOptions = {
  "Access-Control-Allow-Origin": process.env.CORS_ALLOWED_ORIGIN || "*",
  "Access-Control-Allow-Credentials": "true",
  "Access-Control-Allow-Methods": "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
  "Access-Control-Allow-Headers":
    "Accept,Authorization,Cache-Control,Content-Type,DNT,Expires,If-Modified-Since,Pragma,Range,User-Agent,X-Requested-With",
  "Access-Control-Expose-Headers":
    "Cache-Control,Content-Language,Content-Length,Content-Type,Content-Range,Expires,Last-Modified,Pragma",
};

/**
 * Better Auth session cookie name
 * This is the default cookie name used by better-auth
 */
const SESSION_COOKIE_NAME = "better-auth.session_token";

/**
 * Check if user has a valid session
 * Better Auth stores session in cookies
 */
function hasValidSession(req: NextRequest): boolean {
  const sessionCookie = req.cookies.get(SESSION_COOKIE_NAME);
  return !!sessionCookie?.value;
}

export default async function middleware(req: NextRequest) {
  ensureRequestID(req);
  const isMiddlewareAllowed = matcherRegex.test(req.nextUrl.pathname);
  if (!isMiddlewareAllowed) {
    return NextResponse.next();
  }

  // Handle preflighted requests
  const isPreflight = req.method === "OPTIONS";
  if (isPreflight) {
    const preflightHeaders = {
      "Access-Control-Max-Age": "1728000",
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Length": "0",
      ...corsOptions,
    };
    return NextResponse.json({}, { headers: preflightHeaders });
  }

  // Skip middleware processing for server actions to avoid header manipulation
  const isServerAction =
    req.method === "POST" && req.headers.get("next-action") !== null;
  if (isServerAction) {
    return NextResponse.next();
  }

  // Skip middleware for API routes, proxy, and health check
  if (
    req.nextUrl.pathname.startsWith("/proxy") ||
    req.nextUrl.pathname.startsWith("/api") ||
    req.nextUrl.pathname.startsWith("/auth/v1") ||
    req.nextUrl.pathname.includes("chrome") ||
    req.nextUrl.pathname === "/health"
  ) {
    const response = NextResponse.next();
    updateResponseHeaders(req, response);
    return response;
  }

  const headers = new Headers(req.headers);

  // Skip _next internal routes
  if (!req.nextUrl.pathname.startsWith("/_next")) {
    const path = `${req.nextUrl.pathname}`;
    const query = req.nextUrl.searchParams;
    return NextResponse.redirect(
      new URL(`${path}${query.toString() ? `?${query}` : ""}`, req.url),
    );
  }

  // If a referer exists, continue with the request
  if (req.headers.has("referer")) {
    const response = NextResponse.next({ headers });
    return response;
  }

  // Check if user has a valid session
  const isAuthenticated = hasValidSession(req);

  // Redirect to login page if not logged in and trying to access protected routes
  const shouldRedirectToLogin = forceToLoginOnProtectedRoutes(
    req,
    isAuthenticated,
  );
  if (shouldRedirectToLogin) return shouldRedirectToLogin();

  // Redirect to home page if user is logged in and tries to access login/signup page
  if (isLoggedIn(req, isAuthenticated)) {
    return NextResponse.redirect(new URL(`/`, req.url));
  }

  // Handle simple requests
  const response = NextResponse.next({ headers });
  updateResponseHeaders(req, response);
  return response;
}

/**
 * Force redirect to login page if accessing protected routes without authentication
 */
export function forceToLoginOnProtectedRoutes(
  req: NextRequest,
  isAuthenticated: boolean,
) {
  if (
    !isAuthenticated &&
    getProtectedPathsStarting().some((p) => req.nextUrl.pathname.startsWith(p))
  ) {
    console.warn(`   => Path '${req.nextUrl.pathname}' is protected`);
    const nextQueryParams = req.nextUrl.searchParams;
    const nextQuery = new URLSearchParams({
      next: `${req.nextUrl.pathname}${nextQueryParams.toString() ? `?${nextQueryParams}` : ""}`,
    });
    const redirectUrl = new URL(`${ROUTES.SIGN_IN}?${nextQuery}`, req.url);

    console.warn(`   => Redirecting to '${redirectUrl}'`);
    return () => NextResponse.redirect(redirectUrl);
  }
  return;
}

/**
 * Update response headers with CORS and IP information
 */
function updateResponseHeaders(request: NextRequest, response: NextResponse) {
  for (const [key, value] of Object.entries(corsOptions)) {
    response.headers.set(key, value);
  }

  // 'X-Real-IP' and 'X-Forwarded-For'
  const ip =
    request.headers.get("cf-connecting-ip") ||
    request.headers.get("x-forwarded-for") ||
    request.headers.get("x-real-ip") ||
    "";
  if (ip) {
    response.headers.set("x-real-ip", ip);
    response.headers.set("x-forwarded-for", ip);
  }
}

/**
 * Check if user is logged in and trying to access auth pages
 */
function isLoggedIn(req: NextRequest, isAuthenticated: boolean) {
  return (
    (req.nextUrl.pathname.startsWith(`${ROUTES.SIGN_IN}`) ||
      req.nextUrl.pathname.startsWith(`${ROUTES.SIGN_UP}`)) &&
    isAuthenticated
  );
}
