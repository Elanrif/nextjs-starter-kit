import { NextRequest, NextResponse } from "next/server";
import { decrypt } from "@/lib/auth/jose";
import { UserRole } from "@/lib/users/models/user.model";
import { ROUTES } from "./utils/routes";

const { MY_ACCOUNT, DASHBOARD, SIGN_IN, SIGN_UP } = ROUTES;
const protectedRoutes = [MY_ACCOUNT, DASHBOARD];
const publicRoutePrefixes = [SIGN_IN, SIGN_UP];

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
  const cookieStore = req.cookies.get("session")?.value;
  const session = await decrypt(cookieStore);

  // If route is protected and user is not authenticated => redirect to sign-in
  if (isProtectedRoute && !session?.user?.id) {
    return NextResponse.redirect(new URL(SIGN_IN, req.nextUrl));
  }

  // If user is admin => redirect to admin (but not if already on /admin)
  if (
    isProtectedRoute &&
    session?.user?.id &&
    session?.user?.role === UserRole.ADMIN &&
    !normalized.startsWith(DASHBOARD) &&
    !normalized.startsWith(MY_ACCOUNT)
  ) {
    return NextResponse.redirect(new URL(DASHBOARD, req.nextUrl));
  }

  // If user is not admin => redirect to account (but not if already on /account)
  if (
    isProtectedRoute &&
    session?.user?.id &&
    session?.user?.role !== UserRole.ADMIN &&
    !normalized.startsWith(MY_ACCOUNT)
  ) {
    return NextResponse.redirect(new URL(MY_ACCOUNT, req.nextUrl));
  }

  // If route is public and user is authenticated => redirect to account/dashboard
  if (isPublicRoute && session?.user?.id) {
    return NextResponse.redirect(new URL(MY_ACCOUNT, req.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  // eslint-disable-next-line unicorn/prefer-string-raw
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
