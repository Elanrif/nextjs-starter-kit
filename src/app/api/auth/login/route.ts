import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/auth.service";
import { Login } from "@/lib/auth/models/auth.model";
import { RequestLogger } from "@/config/loggers/request.logger";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const reqLogger = new RequestLogger(logger, req);

  const body = (await req.json()) as Login;

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
    const user = await signIn(body, config);

    if ("status" in user) {
      return NextResponse.json(
        { message: user.message || "Failed to sign in" },
        { status: user.status },
      );
    }

    return NextResponse.json(user, { status: 201 });
  } catch {
    const status = 500;
    const message = "Could not create account";
    reqLogger.error("Internal Server Error", { status, message });
    return NextResponse.json({ message }, { status });
  }
}
