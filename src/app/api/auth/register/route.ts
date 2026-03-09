import { NextRequest, NextResponse } from "next/server";
import { signUp } from "@/lib/auth/auth.service";
import { getLogger } from "@/config/logger.config";
import { Registrer } from "@/lib/auth/models/auth.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Registrer;

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
    const res = await signUp(body, config);

    if (!res.ok) {
      const errMsg = crudApiErrorResponse(res, "signUp");
      return NextResponse.json({ ok: false, error: errMsg }, { status: res.error?.status || 500 });
    }

    return NextResponse.json({ ok: true, data: res.data }, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "register");
    const status = errMsg.status || 500;
    logger.error("Error during registration", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
