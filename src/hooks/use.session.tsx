"use client";

import { authClient } from "@/lib/auth/better-auth/auth.client";
import type { AuthPayload } from "@/lib/auth/models/auth.model";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error";

export const useSession = () => {
  const { data, isPending, error, refetch } = authClient.useSession();

  const session: Result<AuthPayload, CrudApiError> | undefined = data
    ? {
        ok: true,
        data: {
          access_token: (data.user as any).accessToken,
          refresh_token: (data.user as any).refreshToken,
          expires_in: (data.user as any).expiresIn,
          refresh_expires_in: (data.user as any).refreshExpiresIn,
          user: {
            id: (data.user as any).externalId ?? data.user.id,
            email: data.user.email,
            firstName: (data.user as any).firstName ?? "",
            lastName: (data.user as any).lastName ?? "",
            phoneNumber: (data.user as any).phoneNumber ?? "",
            role: (data.user as any).role ?? "USER",
          },
        },
      }
    : undefined;

  return {
    session,
    isLoading: isPending,
    error,
    refresh: refetch,
    invalidate: refetch,
  };
};
