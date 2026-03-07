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
    const userId = session?.user?.userId;

    if (typeof userId !== "number") {
      const error = new Error("Invalid userId in session");
      logger.warn("Invalid userId in session", { userId });
      const errMsg = crudApiErrorResponse(error, "session");
      const status = errMsg.status || 500;
      reqLogger.error("Error during session verification", {
        status,
        message: errMsg.message,
      });
      return NextResponse.json(errMsg, { status });
    }

    const user = await fetchUserById(userId);
    if ("error" in user) {
      logger.warn("Failed to fetch user by ID", {
        status: user.status,
        message: user.message,
      });
      const error = new Error("Invalid userId in session");
      logger.warn("Invalid userId in session", { userId });
      const errMsg = crudApiErrorResponse(error, "session");
      const status = errMsg.status || 500;
      reqLogger.error("Error during session verification", {
        status,
        message: errMsg.message,
      });
      return NextResponse.json(errMsg, { status });
    }
    return NextResponse.json(user, { status: 200 });
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
