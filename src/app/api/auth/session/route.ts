import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { RequestLogger } from "@/config/loggers/request.logger";
import { verifySession } from "@/lib/auth/session/dal.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);
  try {
    /**
     * verifySesison redirect when no session or invalid session,
     * so not need checking session validity here,
     * just get userId from session and fetch user info.
     * after verifySession, we can guarantee the session is valid with
     * ! at the end of data exp: userId!, because if session is invalid,
     * it will redirect to sign-in page, and won't execute the code below.
     */
    const session = await verifySession();

    return NextResponse.json(session, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    reqLogger.error("Error during session verification", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
