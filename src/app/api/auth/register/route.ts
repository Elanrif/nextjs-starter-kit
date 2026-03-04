import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/auth.service";
import { getLogger } from "@/config/logger.config";
import { RequestLogger } from "@/config/loggers/request.logger";
import { Registrer } from "@/lib/auth/models/auth.model";

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

    if ("statusCode" in user) {
      return NextResponse.json(
        { message: user.message || "Failed to sign up" },
        { status: user.statusCode },
      );
    }

    return NextResponse.json(user, { status: 200 });
  } catch {
     const status = 500;
     const message = "Could not sign in user";
     reqLogger.error("Internal Server Error", { status, message });
     return NextResponse.json({ message }, { status });
  }
}
