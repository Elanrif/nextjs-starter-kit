/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import "server-only";

import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/users/services/user.service";
import { cache } from "react";
import { CurrentUser, Session } from "@lib/auth/models/auth.model";
import { decrypt } from ".";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError } from "@/shared/errors/api-error";

/** Logger instance for session operations */
const logger = getLogger("server");

/**
 * Retrieves the session from cookies without redirecting.
 * Used for API routes that need to check session status.
 * @returns Session object or null if no valid session
 */
export const getSession = cache(async (): Promise<Result<Session, ApiError>> => {
  try {
    const cookie = await cookies();
    const sess = cookie.get("session")?.value;
    const session = await decrypt(sess);

    if (!session || !session.user?.userId) {
      const err = {
        title: "Unauthorized",
        status: 401,
        detail: "No active session",
        instance: undefined,
        errorCode: "NO_ACTIVE_SESSION",
      };
      logger.warn("No active session found during session check");
      return {
        ok: false,
        error: err,
      };
    }

    return {
      ok: true,
      data: {
        user: {
          userId: session.user?.userId,
          email: session.user?.email,
          role: session.user?.role,
        },
        isAuth: true,
        expiresAt: session.expiresAt,
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving session");
    return {
      ok: false,
      error: ApiErrorResponse(error),
    };
  }
});

/**
 * Retrieves the authenticated user from the server session.
 * Returns null if user cannot be fetched or session is invalid.
 * @returns User object or null
 */
export const getCurrentUser = cache(async (): Promise<Result<CurrentUser, ApiError>> => {
  const session = await getSession();
  if (!session.ok || !session.data?.user?.userId) {
    const err = {
      title: "Unauthorized",
      status: 401,
      detail: "You must be logged in",
      instance: undefined,
      errorCode: "UNAUTHORIZED_ACCESS",
    };
    logger.warn(
      {
        status: err.status,
        detail: err.detail,
      },
      "Unauthorized",
    );
    return { ok: false, error: err };
  }

  const response = await fetchUserById(session.data.user.userId, {});

  if (!response.ok) {
    return {
      ok: false,
      error: response.error!,
    };
  }

  return {
    ok: true,
    data: {
      user: response.data,
      session: session.data,
    },
  };
});
