/**
 * Server-side session DAL (Data Access Layer).
 * Reads and decrypts the session cookie — no backend call needed.
 */
import "server-only";

import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";
import { cache } from "react";
import { Session } from "@lib/auth/models/auth.model";
import { decrypt } from ".";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { ApiError, unauthorizedApiError } from "@/shared/errors/api-error";

const logger = getLogger("server");

/**
 * Lit la session depuis le cookie et retourne les données complètes de l'utilisateur.
 * Équivalent de auth() dans NextAuth — ~1ms, aucun appel réseau.
 *
 * @example
 * const session = await auth();
 * if (!session.ok) redirect("/sign-in");
 * session.data.user.firstName
 */
export const auth = cache(async (): Promise<Result<Session, ApiError>> => {
  try {
    const cookie = await cookies();
    const sess = cookie.get("session")?.value;
    const payload = await decrypt(sess);

    if (!payload || !payload.user?.id) {
      logger.warn("No active session found");
      return {
        ok: false,
        error: unauthorizedApiError("No active session found"),
      };
    }

    return {
      ok: true,
      data: {
        user: payload.user,
        isAuth: true,
        expiresAt: payload.expiresAt,
        access_token: sess,
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving session");
    return {
      ok: false,
      error: ApiErrorResponse(error, "auth"),
    };
  }
});
