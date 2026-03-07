import { fetchAllUser } from "@lib/user/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import {
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users
 * Fetch all users
 */
export async function GET(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const users = await fetchAllUser(config);

    if ("error" in users) {
      const error = users as CrudApiError;
      reqLogger.error("Failed to fetch users", {
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }

    return NextResponse.json(users, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "createCategory");
    const status = errMsg.status || 500;
    logger.error("Error during category creation", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
