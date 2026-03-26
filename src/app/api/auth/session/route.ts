import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { Session } from "@/lib/auth/models/auth.model";
import { getSession } from "@/lib/auth/jose/jose.service";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse<Result<Session, ApiError>>> {
  try {
    // Use getSession instead of getSession to avoid redirects
    const session = await getSession();

    if (!session.ok) {
      const err = {
        title: "Unauthorized",
        status: 401,
        detail: "You must be logged in",
        instance: undefined,
        errorCode: "UNAUTHORIZED_ACCESS",
      };
      logger.error(
        {
          status: err.status,
          detail: err.detail,
        },
        "Unauthorized",
      );
      return NextResponse.json({
        ok: false,
        error: err,
      });
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
