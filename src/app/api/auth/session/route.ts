import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/better-auth/better-auth.service";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session
 *
 * Proxy endpoint that wraps BetterAuth's server-side getSession and returns
 * it in the Result<AuthPayload, ApiError> shape expected by useSession / auth.client.service.
 *
 * Note: Next.js resolves this static route before the [...all] catch-all, so it
 * does NOT interfere with the other BetterAuth endpoints.
 */
export async function GET() {
  const result = await getSession();
  return NextResponse.json(result);
}
