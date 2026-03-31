import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { Registrer } from "@/lib/auth/models/auth.model";
import { signUp } from "@/lib/auth/api/auth";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Registrer;

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };

  try {
    const res = await signUp(body, config);

    if (!res.ok) {
      const error = res.error;
      return NextResponse.json(res, {
        status: error.status,
      });
    }

    logger.info({ userId: res.data.id }, "User registered");
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
