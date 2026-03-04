import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/user/services/user.service";
import { NextRequest } from "next/server";
import { cache } from "react";

const logger = getLogger("server");

export const verifySession = cache(async () => {
  const cookie = await cookies();
  const sess = cookie.get("session")?.value;
  const session = await decrypt(sess);

  if (!session?.user) {
    redirect("/sign-in");
  }

  return { isAuth: true, user: session.user, expiresAt: session.expiresAt };
});

export const getUser = cache(async (req: NextRequest) => {
  const session = await verifySession();
  if (!session) return null;

  try {
    const reqHeaders = new Headers(req.headers);
    const config = { headers: reqHeaders };
    const user = await fetchUserById(Number(session.user?.id), config);
    return user;
  } catch {
    logger.error("Failed to fetch user:");
    return null;
  }
});
