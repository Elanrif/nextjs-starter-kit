import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Auth is handled client-side via AuthUserContext.
// Each branch (jose, better-auth, etc.) can replace this with real session verification.
export function proxy(_req: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [],
};
