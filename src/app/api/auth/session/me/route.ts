import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { RequestLogger } from "@/config/loggers/request.logger";
import { fetchUserById } from "@/lib/user/services/user.service";
import { getSession } from "@/lib/auth/session/dal.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);
  try {
    const session = await getSession();

    if (!session.ok) {
      return NextResponse.json(session, { status: 401 });
    }

    const userId = session.data?.user?.userId;

    if (typeof userId !== "number") {
      const error = new Error("Invalid userId in session");
      const errMsg = crudApiErrorResponse(error, "session");
      const status = errMsg.status || 500;
      return NextResponse.json({ ok: false, error: errMsg }, { status });
    }

    const response = await fetchUserById(userId);
    if (!response.ok) {
      const status = response.error?.status || 500;
      return NextResponse.json(response, { status });
    }
    return NextResponse.json(response, { status: 200 });
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
