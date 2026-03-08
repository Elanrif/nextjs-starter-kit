/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/user/services/user.service";
import { cache } from "react";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { Session } from "@lib/auth/models/auth.model";

/** Logger instance for session operations */
const logger = getLogger("server");


/**
 * Retrieves the session from cookies without redirecting.
 * Used for API routes that need to check session status.
 * @returns Session object or null if no valid session
 */
export const getSession = cache(async (): Promise<Session | null> => {
  try {
    const cookie = await cookies();
    const sess = cookie.get("session")?.value;
    const session = await decrypt(sess);

    if (!session || !session.user?.userId) {
      logger.warn("No active session found during session check");
      return null;
    }

    return {
      user: {
        userId: session.user?.userId,
        email: session.user?.email,
        role: session.user?.role,
      },
      isAuth: true,
      expiresAt: session.expiresAt,
    };
  } catch (error) {
    logger.error("Error retrieving session", error);
    return null;
  }
});

/**
 * Retrieves the authenticated user from the server session.
 * Returns null if user cannot be fetched or session is invalid.
 * @returns User object or null
 */
export const getUserVerifiedSession = cache(async () => {
  const session = await getSession();
  // Distinguish between "no session" and "invalid session data" so we
  // return an auth-related status (401) instead of a server 500.
  if (session === null || !session.user?.userId) {
    logger.warn("No active session during user verification");
    return crudApiErrorResponse(new Error("No active session"), "session", { status: 401});

  }
  return fetchUserById(session.user?.userId);
});
