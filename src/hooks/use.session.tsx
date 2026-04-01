"use client";

import { Session } from "@/lib/auth/models/auth.model";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const SESSION_QUERY_KEY = ["session"];

const fetcher = async (): Promise<Result<Session, ApiError>> => {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
  });
  // 401 / 403 is expected when not authenticated — not an error, just unauthenticated state
  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      error: {
        title: "Unauthorized",
        status: 401,
        detail: "Not authenticated",
        instance: undefined,
        errorCode: "UNAUTHORIZED_ACCESS",
      },
    };
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({
      message: "Failed to fetch session",
    }));
    throw {
      title: "Error",
      status: errorData.status ?? res.status,
      detail: errorData.message ?? "Failed to fetch session",
      instance: undefined,
      errorCode: "SESSION_FETCH_ERROR",
    } as ApiError;
  }

  const session: Result<Session, ApiError> = await res.json();

  if (!session.ok || !session.data?.user?.id) {
    return {
      ok: false,
      error: {
        title: "Unauthorized",
        status: 401,
        detail: "You must be logged in",
        instance: undefined,
        errorCode: "UNAUTHORIZED_ACCESS",
      },
    };
  }

  return session;
};

export const useSession = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Result<Session, ApiError>>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetcher,
    refetchOnWindowFocus: false,
    retry: false,
  });

  return {
    session: data,
    isLoading,
    error,
    // Refetch latest session data from server
    refresh: () =>
      queryClient.invalidateQueries({
        queryKey: SESSION_QUERY_KEY,
      }),
    // Clear session cache (e.g. after sign-out) without refetching
    invalidate: () => queryClient.setQueryData(SESSION_QUERY_KEY, undefined),
  };
};
