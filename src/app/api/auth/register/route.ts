import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { Registrer } from "@/lib/auth/models/auth.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { signUp } from "@/lib/auth";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Registrer;
  try {
    const res = await signUp(body);
    return NextResponse.json(res, {
      status: 201,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "register");
    const status = errMsg.status || 500;
    logger.error({ status, message: errMsg.detail }, "Error during registration");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
