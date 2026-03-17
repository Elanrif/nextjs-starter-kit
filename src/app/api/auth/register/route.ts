import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { Registrer } from "@/lib/auth/models/auth.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { auth } from "@/lib/auth/wrapper/auth";

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
    const res = await auth.api.signUp({ body, config });

    if (!res.ok) {
      const error = res.error;
      return NextResponse.json(res, { status: error.status });
    }

    logger.info("User registered", { userId: res.data.id });
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "register");
    const status = errMsg.status || 500;
    logger.error("Error during registration", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
