import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/auth.service";
import { getLogger } from "@/config/logger.config";
import { Registrer } from "@/lib/auth/models/auth.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { createSession } from "@/lib/auth/session";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {

  const body = (await req.json()) as Registrer;

  // Validate required fields
  if (!body.email || !body.password) {
    logger.warn("[Proxy API] [REGISTER] Missing email or password", { body });
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };
  try {
    const res = await signUp(body, config);

    if ("error" in res) {
      logger.warn("[Proxy API] [REGISTER] Registration failed", {
        status: res.status,
        message: res.message,
      });
      const errMsg = crudApiErrorResponse(res, "signUp");
      return NextResponse.json(errMsg, { status: res.status });
    }

    const userId = res.id?.toString();
    logger.info("[Proxy API] [REGISTER] User registered successfully, creating session", {
      userId,
    });
    await createSession(res);

    logger.info("[Proxy API] [REGISTER] Registration completed", { userId });
    return NextResponse.json(res, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "register");
    const status = errMsg.status || 500;
    logger.error("[Proxy API] [REGISTER] Error during registration", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
