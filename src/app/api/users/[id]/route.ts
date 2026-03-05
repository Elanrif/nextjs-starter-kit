import { NextRequest, NextResponse } from "next/server";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { fetchUserById, updateUser } from "@/lib/user/services/user.service";
import { UserUpdate } from "@/lib/user/models/user.model";
import { CrudApiError, crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users/[id]
 * Fetch a user by ID
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const reqLogger = new RequestLogger(logger, request);

  const userId = Number.parseInt(params.id, 10);
  if (Number.isNaN(userId)) {
    const status = 400;
    const message = "Invalid user ID";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const user = await fetchUserById(userId, config);
    if (!user || "error" in user) {
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

/**
 * PATCH /api/users/[id]
 * Update a user by ID
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } },
) {
  const reqLogger = new RequestLogger(logger, request);

  const userId = Number.parseInt(params.id, 10);
  if (Number.isNaN(userId)) {
    const status = 400;
    const message = "Invalid user ID";
    reqLogger.error("Bad Request", { status, message });
    return NextResponse.json({ message }, { status });
  }

  const body = (await request.json()) as UserUpdate;
  if (
    !body?.firstName ||
    !body?.lastName ||
    !body?.email ||
    !body?.phoneNumber
  ) {
    const status = 400;
    const message =
      "Fields `first_name`, `last_name`, `email`, and `phone_number` are required";
    reqLogger.error(`Bad Request`, {
      status,
      message,
    });
    return NextResponse.json({ message }, { status });
  }

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const user = await updateUser(config, userId, body);
    if ("error" in user) {
      const error = user as CrudApiError;
      reqLogger.error("Failed to update user", {
        status: error.status,
        message: error.message,
      });
      return NextResponse.json(
        { message: error.message },
        { status: error.status },
      );
    }
    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateUser");
    const status = errMsg.status || 500;
    logger.error("Error during user update", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
