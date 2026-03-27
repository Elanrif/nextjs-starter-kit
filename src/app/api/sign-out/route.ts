import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth/better-auth/auth";

/**
 * Hard logout endpoint.
 *
 * Better Auth native POST /api/auth/sign-out invalidates the BA session cookie,
 * but our app also stores additional auth context in custom httpOnly cookies
 * (e.g. ba_access_token, ba_role). Those must be cleared too.
 *
 * We use asResponse: true to get the full Response from BetterAuth so we can
 * forward its Set-Cookie headers (which clear better-auth.session_token and any
 * session-cache cookies) back to the browser. Without this the BA cookie stays
 * in the browser and the header keeps showing the user as logged-in.
 */
export async function POST() {
  const signOutResponse = await auth.api.signOut({
    headers: await headers(),
    asResponse: true,
  });

  const cookieStore = await cookies();
  cookieStore.delete("ba_access_token");
  cookieStore.delete("ba_role");

  const response = NextResponse.json({ ok: true });

  // Forward every Set-Cookie header BetterAuth emits so the session cookie
  // (and any cookie-cache cookie) is properly expired in the browser.
  for (const cookie of signOutResponse.headers.getSetCookie()) {
    response.headers.append("set-cookie", cookie);
  }

  return response;
}
