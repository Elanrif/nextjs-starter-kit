import { fetchAllUser, createUser } from "@lib/user/services/user.service";
import { NextRequest, NextResponse } from "next/server";
import { User } from "@/lib/user/models/user.model";
import { getLogger } from "@config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

/**
 * GET /api/users
 * Fetch all users
 */
export async function GET(request: NextRequest) {
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await fetchAllUser(config);

    if (!response.ok) {
      return NextResponse.json(response, { status: response.error?.status || 500 });
    }

    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "fetchAllUser");
    const status = errMsg.status || 500;
    logger.error("Error during user fetching", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}

/**
 * POST /api/users
 * Create a new user
 */
export async function POST(request: NextRequest) {

  const body = (await request.json()) as Omit<User, 'id'>;

  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };

  try {
    const response = await createUser(config, body);

    if (!response.ok) {
      const error = response.error;
      return NextResponse.json(error, { status: error.status });
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "createUser");
    const status = errMsg.status || 500;
    logger.error("Error during user creation", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
