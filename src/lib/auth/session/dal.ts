import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/user/services/user.service";
import { cache } from "react";
import { CrudApiError } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger("server");

export const verifySession = cache(async () => {
  const cookie = await cookies();
  const sess = cookie.get("session")?.value;
  const session = await decrypt(sess);

  logger.info("Session verified", session);
  if (!session?.userId) {
    redirect("/sign-up?callbackUrl=/dashboard");
  }

  return {
    isAuth: true,
    userId: session.userId,
    email: session.email,
    role: session.role,
    expiresAt: session.expiresAt,
  };
});

export const getServerSession = cache(async () => {
  const session = await verifySession();
  if (!session) return null;
  try {
    const reqHeaders = new Headers();
    const config = { headers: reqHeaders };

    const user = await fetchUserById(Number(session.userId), config);
    if ("error" in user) {
      const error = user as CrudApiError;
      logger.error("Failed to fetch user", {
        status: error.status,
        message: error.message,
      });
      return null;
    }
    return user;
  } catch {
    logger.error("Failed to fetch user");
    return null;
  }
});
