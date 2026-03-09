import { NextRequest, NextResponse } from "next/server";
import { signIn } from "@/lib/auth/auth.service";
import { Login } from "@/lib/auth/models/auth.model";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as Login;

  // Validate required fields
  if (!body.email || !body.password) {
    return NextResponse.json({ ok: false, error: { message: "Email and password are required" } }, { status: 400 });
  }

  const reqHeaders = new Headers(req.headers);
  const config = { headers: reqHeaders };
  try {
    const response = await signIn(body, config);

    if (!response.ok) {
      const err = crudApiErrorResponse(response, "login");
      return NextResponse.json({ ok: false, error: err }, { status: err.status || 500 });
    }
    return NextResponse.json({ ok: true, data: response.data }, { status: 201 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "login");
    const status = errMsg.status || 500;
    logger.error("Error during sign in", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
