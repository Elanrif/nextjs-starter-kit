"use client";

import { betterAuthClient } from "@/lib/auth/better-auth/auth.client";
import type { Session } from "@/lib/auth/models/auth.model";

/**
 * Wrapper around Better Auth's native useSession hook.
 * Normalizes the BA session format to the app's Session type.
 */
export const useSession = () => {
  const { data, isPending, error, refetch } = betterAuthClient.useSession();

  const session: ({ ok: true; data: Session } | { ok: false }) | undefined = data
    ? {
        ok: true,
        data: {
          user: {
            userId: (data.user as any).backendId,
            email: data.user.email,
            role: (data.user as any).role ?? "USER",
          },
          isAuth: true,
          expiresAt: new Date(data.session.expiresAt),
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
