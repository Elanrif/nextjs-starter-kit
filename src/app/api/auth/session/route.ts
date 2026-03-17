import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
import { Session } from "@/lib/auth/models/auth.model";
import { _getSession } from "@/lib/auth/jose/jose.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(): Promise<
  NextResponse<Result<Session, CrudApiError>>
> {
  try {
    // Use getSession instead of getSession to avoid redirects
    const session = await _getSession();

    if (!session.ok) {
      const err = {
        error: "Unauthorized",
        status: 401,
        message: "You must be logged in",
      };
      logger.error("Unauthorized", {
        status: err.status,
        message: err.message,
      });
      return NextResponse.json({ ok: false, error: err });
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    logger.error("Error during session verification", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
