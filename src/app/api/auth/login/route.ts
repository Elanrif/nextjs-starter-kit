import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/auth.service";
import { Login } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { createSession } from "@/lib/auth/session";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Login;

  // Validate required fields
  if (!body.email || !body.password) {
    logger.warn("Missing email or password", { body });
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };
  try {
    const user = await signIn(body, config);

    if ("error" in user) {
      logger.warn("Failed to sign in", {
        status: user.status,
        message: user.message,
      });
      return NextResponse.json(
        { message: user.message || "Failed to sign in" },
        { status: user.status },
      );
    }

    await createSession(user.id, user.email, user.role);
    logger.info("User signed in successfully", {
      userId: user.id,
      email: user.email,
    });
    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "login");
    const status = errMsg.status || 500;
    logger.error("Error during sign in", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json(errMsg, { status });
  }
}
