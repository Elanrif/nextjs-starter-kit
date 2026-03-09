import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/auth.service";
import { getLogger } from "@/config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { Registrer } from "@/lib/auth/models/auth.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/register
 * Register a new user
 */
export async function POST(req: NextRequest) {
  const reqLogger = new RequestLogger(logger, req);
  const body = (await req.json()) as Registrer;

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };

  try {
    const res = await signUp(body, config);

    if (!res.ok) {
      const error = res.error;
      return NextResponse.json(res, { status: error.status });
    }

    reqLogger.info("User registered", { userId: res.data.id });
    return NextResponse.json(res, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "register");
    const status = errMsg.status || 500;
    reqLogger.error("Error during registration", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
