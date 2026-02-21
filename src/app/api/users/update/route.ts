import { UserUpdate } from "@lib/user/models/user.model";
import { auth } from "@/lib/auth/auth";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { updateUser } from "@lib/user/services/user.service";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function PATCH(request: NextRequest) {
  const reqLogger = new RequestLogger(logger, request);

  // Get session using better-auth
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    const status = 401;
    const message = "You must be logged in";
    reqLogger.error(`Unauthorized`, {
      status,
      message,
    });
    return NextResponse.json({ message }, { status });
  }
  const body = (await request.json()) as UserUpdate;
  if (
    !body?.first_name ||
    !body?.last_name ||
    !body?.email ||
    !body?.phone_number
  ) {
    const status = 400;
    const message =
      "Fields `first_name`, `last_name`, `email`, and `phone_number` are required";
    reqLogger.error(`[${session.user.id}] - Bad Request`, {
      status,
      message,
    });
    return NextResponse.json({ message }, { status });
  }
  const reqHeaders = new Headers(request.headers);
  const config = { headers: reqHeaders };
  const userId = Number.parseInt(session.user.id, 10);
  try {
    const user = await updateUser(config, userId, body);
    return NextResponse.json(user, { status: 200 });
  } catch {
    const status = 500;
    const message = "Could not update user";
    reqLogger.error("Internal Server Error", {
      status,
      message,
    });
    return NextResponse.json({ message }, { status });
  }
}
