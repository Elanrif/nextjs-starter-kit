import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/auth.service";
import { Login } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * POST /api/auth/login
 * Sign in a user
 */
export async function POST(req: NextRequest) {
  const body = (await req.json()) as Login;

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await signIn(body, config);

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(response, { status: error.status });
    }

    logger.info("User signed in", { userId: response.data.id });
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "login");
    const status = errMsg.status || 500;
    logger.error("Error during sign in", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
