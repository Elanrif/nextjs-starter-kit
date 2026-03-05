import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { verifySession } from "@/lib/auth/session/dal";
import { fetchUserById } from "@/lib/user/services/user.service";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { RequestLogger } from "@/config/loggers/request.logger";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);
  const { userId } = await verifySession();
  if (!userId) {
    logger.warn("No active session found during session check");
    return NextResponse.json(
      { success: false, message: "No active session" },
      { status: 200 },
    );
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const user = await fetchUserById(userId, config);
    if ("error" in user) {
      const status = 404;
      const message = "User not found";
      reqLogger.error("Not Found", { status, message });
      return NextResponse.json({ message }, { status });
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchUserById");
    const status = errMsg.status || 500;
    logger.error("Error during user fetching", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
