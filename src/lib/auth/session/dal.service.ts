/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import "server-only";

import { cookies } from "next/headers";
import { decrypt } from "@/lib/auth/session";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/user/services/user.service";
import { User } from "@/lib/user/models/user.model";
import { cache } from "react";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
import { Session } from "@lib/auth/models/auth.model";
import { ApiError } from "next/dist/server/api-utils";

/** Logger instance for session operations */
const logger = getLogger("server");

/**
 * Retrieves the session from cookies without redirecting.
 * Used for API routes that need to check session status.
 * @returns Session object or null if no valid session
 */
export const getSession = cache(
  async (): Promise<Result<Session, CrudApiError>> => {
    try {
      const cookie = await cookies();
      const sess = cookie.get("session")?.value;
      const session = await decrypt(sess);

      if (!session || !session.user?.userId) {
        const err = new ApiError(401, "No active session");
        logger.warn("No active session found during session check");
        return { ok: false, error: crudApiErrorResponse(err) };
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
      logger.error("Error retrieving session", error);
      return { ok: false, error: crudApiErrorResponse(error) };
    }
  },
);

/**
 * Retrieves the authenticated user from the server session.
 * Returns null if user cannot be fetched or session is invalid.
 * @returns User object or null
 */
export const getUserVerifiedSession = cache(
  async (): Promise<Result<User, CrudApiError>> => {
    const res = await getSession();
    // Distinguish between "no session" and "invalid session data" so we
    // return an auth-related status (401) instead of a server 500.
    if (!res.ok || !res.data?.user?.userId) {
      const err = new ApiError(401, "No active session");
      logger.warn("No active session during user verification");
      return { ok: false, error: crudApiErrorResponse(err) };
    }

    const response = await fetchUserById(res.data.user.userId);
    if (!response.ok) {
      logger.error("Failed to fetch user during session verification", {
        status: response.error?.status,
        message: response.error?.message,
      });
      return { ok: false, error: crudApiErrorResponse(response.error) };
    }

    return { ok: true, data: response.data };
  },
);
