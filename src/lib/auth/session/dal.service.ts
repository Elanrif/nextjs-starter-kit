/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { redirect } from "next/navigation";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/user/services/user.service";
import { cache } from "react";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import { Session } from "@lib/auth/models/auth.model";

/** Logger instance for session operations */
const logger = getLogger("server");

/**
 * Verifies the current session from cookies.
 * Redirects to sign-in if session is invalid or missing userId.
 * @returns Session object with authentication info
 */
export const verifySession = cache(async (): Promise<Session> => {
  const cookie = await cookies();
  const sess = cookie.get("session")?.value;
  const session = await decrypt(sess);

  /**
   * This function enforces that a session exists.
   * If the session is missing or invalid, it does not throw an error —
   * instead, it immediately redirects the user to the sign-in page.
   * Therefore, any code after calling this function is guaranteed to have a valid session.
   * Think of it as "requireSession" rather than just "verifySession".
   */
  if (!session?.user?.userId) {
    logger.warn("No active session found during session verification");
    redirect("/sign-in?callbackUrl=/dashboard");
  }

  logger.info("Session verified", session);
  return {
    user: {
      userId: session.user?.userId,
      email: session.user?.email,
      role: session.user?.role,
    },
    isAuth: true,
    expiresAt: session.expiresAt,
  };
});

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

    if (!session?.user?.userId) {
      logger.warn("No active session found during session check");
      return null;
    }

    logger.info("Session found", session);
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
  const {
    user: { userId },
  } = await verifySession();

  if (typeof userId !== "number") {
    const error = new Error("Invalid userId in session");
    logger.warn("Invalid userId in session", { userId });
    return crudApiErrorResponse(error, "fetchUserById");
  }
  logger.info("Fetching user by ID from session", { userId });
  return fetchUserById(userId);
});
