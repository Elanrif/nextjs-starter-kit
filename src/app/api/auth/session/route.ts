import { getSession } from "@/lib/auth/next-auth/next-auth.service";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

/**
 * GET /api/auth/session
 * Returns Result<Session, CrudApiError> for the client-side useSession hook.
 * Wraps the NextAuth session into the app's unified Result format.
 */
export async function GET() {
  const session = await getSession();

  if (!session.ok) {
    return NextResponse.json(session, { status: 401 });
  }

  return NextResponse.json(session, { status: 200 });
}
