/**
 * DAL (Data Access Layer) for session management.
 * Provides server-side session verification and retrieval utilities.
 */
import "server-only";

import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";
import { fetchUserById } from "@/lib/user/services/user.service";
import { cache } from "react";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
import { CurrentUser, Session } from "@lib/auth/models/auth.model";
import { ApiError } from "next/dist/server/api-utils";
import { decrypt } from ".";

/** Logger instance for session operations */
const logger = getLogger("server");

/**
 * Retrieves the session from cookies without redirecting.
 * Used for API routes that need to check session status.
 * @returns Session object or null if no valid session
 */
export const _getSession = cache(
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
export const _getCurrentUser = cache(
  async (): Promise<Result<CurrentUser, CrudApiError>> => {
    const session = await _getSession();
    if (!session.ok || !session.data?.user?.userId) {
      const err = {
        error: "Unauthorized",
        status: 401,
        message: "You must be logged in",
      };
      logger.warn("Unauthorized", {
        status: err.status,
        message: err.message,
      });
      return { ok: false, error: err };
    }

    const response = await fetchUserById(session.data.user.userId);

    if (!response.ok) {
      return { ok: false, error: response.error! };
    }

    return { ok: true, data: { user: response.data, session: session.data } };
  },
);
