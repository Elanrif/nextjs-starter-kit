import "server-only";

import { headers, cookies } from "next/headers";
import { cache } from "react";
import { auth } from "./auth";
import { getLogger } from "@/config/logger.config";
import { AuthPayload, CurrentUser } from "@/lib/auth/models/auth.model";
import { User, UserRole } from "@/lib/users/models/user.model";
import { Result } from "@/shared/models/response.model";
import { ApiError } from "@/shared/errors/api-error";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

const logger = getLogger("server");

type BaUser = {
  id: string;
  email: string;
  role?: string;
  externalId?: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
  refreshExpiresIn?: number;
  [key: string]: unknown;
};

export const getSession = cache(async (): Promise<Result<AuthPayload, ApiError>> => {
  try {
    const reqHeaders = await headers();
    const baSession = await auth.api.getSession({ headers: reqHeaders });

    if (!baSession?.user) {
      logger.warn("No active Better Auth session");
      return {
        ok: false,
        error: ApiErrorResponse({
          title: "Unauthorized",
          status: 401,
          detail: "No active session",
          instance: undefined,
          errorCode: "UNAUTHORIZED",
        }),
      };
    }

    const u = baSession.user as BaUser;

    // BA's getSession doesn't return additionalFields — fall back to the signed cookie
    const cookieStore = await cookies();
    const cookieAccessToken = cookieStore.get("ba_access_token")?.value;
    const access_token = u.accessToken ?? cookieAccessToken;

    return {
      ok: true,
      data: {
        ...(access_token && {
          access_token,
          refresh_token: u.refreshToken,
          expires_in: u.expiresIn,
          refresh_expires_in: u.refreshExpiresIn,
        }),
        user: {
          id: u.externalId ?? u.id,
          email: u.email,
          firstName: u.firstName ?? "",
          lastName: u.lastName ?? "",
          phoneNumber: u.phoneNumber ?? "",
          role: u.role ?? UserRole.USER,
        },
      },
    };
  } catch (error) {
    logger.error({ err: error }, "Error retrieving Better Auth session");
    return { ok: false, error: ApiErrorResponse(error) };
  }
});

export const getCurrentUser = cache(async (): Promise<Result<CurrentUser, ApiError>> => {
  const session = await getSession();

  if (!session.ok || !session.data?.user) {
    logger.warn("getCurrentUser: no valid session");
    return {
      ok: false,
      error: {
        title: "Unauthorized",
        status: 401,
        detail: "You must be logged in",
        instance: undefined,
        errorCode: "UNAUTHORIZED",
      },
    };
  }

  const { user: s } = session.data;

  const user: User = {
    id: 0,
    email: s.email,
    firstName: s.firstName,
    lastName: s.lastName,
    phoneNumber: s.phoneNumber,
    password: "",
    avatarUrl: null,
    role: (s.role as UserRole) ?? UserRole.USER,
    isActive: true,
    externalId: s.id,
  };

  return { ok: true, data: { user, session: session.data } };
});
