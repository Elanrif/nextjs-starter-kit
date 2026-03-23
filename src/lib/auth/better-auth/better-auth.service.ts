import "server-only";

import { headers } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { getLogger } from "@/config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error.server";
import { CurrentUser, Session } from "@/lib/auth/models/auth.model";
import { User, UserRole } from "@/lib/users/models/user.model";

const logger = getLogger("server");

type BaUser = {
  id: string;
  email: string;
  name?: string;
  role?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  accessToken?: string;
  refreshToken?: string;
  [key: string]: unknown;
};

/**
 * Reads the current Better Auth session from the request headers.
 * Returns a normalized Session populated from BA's local SQLite user record.
 */
export const getSession = cache(async (): Promise<Result<Session, CrudApiError>> => {
  try {
    const reqHeaders = await headers();
    const baSession = await auth.api.getSession({ headers: reqHeaders });

    if (!baSession?.user) {
      logger.warn("No active Better Auth session");
      return {
        ok: false,
        error: { error: "Unauthorized", status: 401, message: "No active session" },
      };
    }

    const user = baSession.user as BaUser;

    return {
      ok: true,
      data: {
        user: {
          userId: undefined,
          email: user.email,
          role: user.role ?? "USER",
          firstName: user.firstName,
          lastName: user.lastName,
          phoneNumber: user.phoneNumber,
          externalId: user.externalId,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        },
        isAuth: true,
        expiresAt: new Date(baSession.session.expiresAt),
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving Better Auth session");
    return { ok: false, error: crudApiErrorResponse(error) };
  }
});

/**
 * Returns the full User object.
 * User data is synced into BA's local SQLite on every sign-in
 * — no external backend fetch needed.
 */
export const getCurrentUser = cache(async (): Promise<Result<CurrentUser, CrudApiError>> => {
  const session = await getSession();

  if (!session.ok || !session.data?.user) {
    logger.warn("getCurrentUser: no valid session");
    return {
      ok: false,
      error: { error: "Unauthorized", status: 401, message: "You must be logged in" },
    };
  }

  const { user: s } = session.data;

  const user: User = {
    id: 0,
    email: s.email ?? "",
    firstName: s.firstName ?? "",
    lastName: s.lastName ?? "",
    phoneNumber: s.phoneNumber ?? "",
    password: "",
    avatarUrl: null,
    role: (s.role as UserRole) ?? UserRole.USER,
    isActive: true,
    externalId: s.externalId,
  };

  return { ok: true, data: { user, session: session.data } };
});
