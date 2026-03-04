import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/auth.service";
import { getLogger } from "@/config/logger.config";
import { RequestLogger } from "@/config/loggers/request.logger";
import { Registrer } from "@/lib/auth/models/auth.model";
import { createSession } from "@/lib/auth/session";
import { ApiError } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const reqLogger = new RequestLogger(logger, req);

  const body = (await req.json()) as Registrer;

  // Validate required fields
  if (!body.email || !body.password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };
  try {
    // Call the signUp service
    const user = await signUp(body, config);

    if ("status" in user) {
      return NextResponse.json(
        {
          status: user.status,
          timestamp: new Date().toISOString(),
          message: user.message || "Failed to sign up",
          error: user.status === 400 ? "Bad Request" : "Error",
        },
        { status: user.status },
      );
    }

    // Create session for the newly registered user
    const userId = user.id.toString();
    logger.info("User registered successfully, creating session", { userId });
    await createSession(userId);

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    const status = error instanceof ApiError ? error.status : 500;
    const message =
      error instanceof ApiError ? error.message : "Could not sign in user";
    reqLogger.error("Internal Server Error", { status, message });
    return NextResponse.json(
      {
        status,
        timestamp: new Date().toISOString(),
        message,
        error: status === 400 ? "Bad Request" : "Error",
      },
      { status },
    );
  }
}
