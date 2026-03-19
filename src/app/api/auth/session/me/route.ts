import { NextResponse } from "next/server";
import { getLogger } from "@/config/logger.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { getCurrentUser } from "@/lib/auth/jose/jose.service";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const response = await getCurrentUser();
    if (!response.ok) {
      const status = response.error?.status || 500;
      return NextResponse.json(response, { status });
    }
    return NextResponse.json(response, { status: 200 });
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "session");
    const status = errMsg.status || 500;
    logger.error("Error during session verification", {
      status,
      message: errMsg.message,
    });
    return NextResponse.json({ ok: false, error: errMsg }, { status });
  }
}
