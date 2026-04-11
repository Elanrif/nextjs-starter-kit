import { NextRequest, NextResponse } from "next/server";
import { Login } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { signIn } from "@/lib/auth/services/auth.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Sign in a user
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Login;

  try {
    const response = await signIn(body);
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "login");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during sign in");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
