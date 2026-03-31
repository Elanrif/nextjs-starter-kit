import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { auth } from "@/lib/auth/jose/jose.service";
import { unauthorizedApiError } from "@/shared/errors/api-error";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.ok) {
      logger.warn(
        { context: "createUser" },
        "Unauthorized: only authenticated users can change their password",
      );
      return NextResponse.json(
        { ok: false, error: unauthorizedApiError("You must be logged in") },
        { status: 401 },
      );
    }

    return NextResponse.json(session, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    logger.error({ status, detail: errMsg.detail }, "Error during session verification");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
