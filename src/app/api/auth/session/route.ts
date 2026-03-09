import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
import { RequestLogger } from "@/config/loggers/request.logger";
import { getSession } from "@/lib/auth/session/dal.service";
import { Session } from "@/lib/auth/models/auth.model";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(
  request: NextRequest,
): Promise<NextResponse<Result<Session, CrudApiError>>> {
  const reqLogger = new RequestLogger(logger, request);
  try {
    // Use getSession instead of getSession to avoid redirects
    const session = await getSession();

    if (!session.ok) {
      const err = session.error;
      return NextResponse.json(
        { ok: false, error: err },
        { status: 401 },
      );
    }

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    reqLogger.error("Error during session verification", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
