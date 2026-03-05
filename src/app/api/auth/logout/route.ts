import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

export const dynamic = "force-dynamic";

export async function POST() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  logger.info("Session deleted");

  return NextResponse.json({ success: true });
}
