import { NextResponse } from "next/server";
import { headers, cookies } from "next/headers";
import { auth } from "@/lib/auth/better-auth/auth";

/**
 * Hard logout endpoint.
 *
 * Better Auth native POST /api/auth/sign-out invalidates the BA session cookie,
 * but our app also stores additional auth context in custom httpOnly cookies
 * (e.g. ba_access_token, ba_role). Those must be cleared too.
 */
export async function POST() {
  await auth.api.signOut({ headers: await headers() });

  const cookieStore = await cookies();
  cookieStore.delete("ba_access_token");
  cookieStore.delete("ba_role");

  return NextResponse.json({ ok: true });
}
