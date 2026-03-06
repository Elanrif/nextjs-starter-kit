import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";

// 1. Specify that this route should be treated as dynamic
const protectedRoutes = new Set(["/dashboard"]);
const publicRoutes = new Set(["/sign-in", "/sign-up"]);

export default async function proxy(req: NextRequest) {
  // 2. Check if the request is for a protected route
  const path = req.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.has(path);
  const isPublicRoute = publicRoutes.has(path);

  // 3. Decrypt the session from the cookie
  const cookie = await cookies();
  const res = cookie.get("session")?.value;
  const session = await decrypt(res);

  // 4. Redirect to /sign-in if the user is not authenticated
  if (isProtectedRoute && !session?.user?.userId) {
    return NextResponse.redirect(new URL("/sign-in", req.nextUrl));
  }

  // 4. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.user?.userId &&
    !req.nextUrl.pathname.startsWith("/dashboard")
  ) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }
  return NextResponse.next();
}

// Routes Proxy should not run on
export const config = {
  matcher: [String.raw`/((?!api|_next/static|_next/image|.*\.png$).*)/`],
};
