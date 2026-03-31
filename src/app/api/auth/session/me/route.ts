import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { getSession } from "@/lib/auth/jose/jose.service";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await getSession();
    if (!response.ok) {
      const status = response.error?.status || 500;
      return NextResponse.json(response, {
        status,
      });
    }
    return NextResponse.json(response, {
      status: 200,
    });
  } catch (error) {
    const errMsg = ApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    logger.error({ status, detail: errMsg.detail }, "Error during session verification");
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
