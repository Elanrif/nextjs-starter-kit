import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";

// Routes that require authentication (exact or prefix)
const protectedRoutes = ["/dashboard"];
// Public auth routes we want to hide from authenticated users
const publicRoutePrefixes = ["/sign-in", "/sign-up"];

export default async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // normalize path (remove trailing slash except for root)
  const normalized = path.endsWith("/") && path.length > 1 ? path.slice(0, -1) : path;

  const isProtectedRoute = protectedRoutes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );
  const isPublicRoute = publicRoutePrefixes.some(
    (p) => normalized === p || normalized.startsWith(p + "/"),
  );

  // decrypt session from cookie (if any)
  const cookieStore = await cookies();
  const raw = cookieStore.get("session")?.value;
  const session = await decrypt(raw);

  // If route is protected and user not authenticated => redirect to sign-in
  if (isProtectedRoute && !session?.user?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // If route is a public-auth page (sign-in / sign-up) and user is authenticated => redirect to dashboard
  if (isPublicRoute && session?.user?.userId) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: [String.raw`/((?!api|_next/static|_next/image|.*\.png$).*)/`],
};
