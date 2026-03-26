"use client";

import { AuthPayload } from "@/lib/auth/models/auth.model";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { useQuery, useQueryClient } from "@tanstack/react-query";

export const SESSION_QUERY_KEY = ["session"];

const fetcher = async (): Promise<Result<AuthPayload, ApiError>> => {
  const res = await fetch("/api/auth/session", {
    credentials: "include",
  });

  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      error: {
        title: "Unauthorized",
        status: 401,
        detail: "Not authenticated",
        errorCode: "UNAUTHORIZED",
        instance: undefined,
      },
    };
  }

  if (!res.ok) {
    const errorData = await res.json().catch(() => ({ detail: "Failed to fetch session" }));
    throw {
      title: errorData.title ?? "Error",
      status: errorData.status ?? res.status,
      detail: errorData.detail ?? "Failed to fetch session",
      errorCode: errorData.errorCode ?? "FETCH_ERROR",
      instance: undefined,
    } as ApiError;
  }

  const session: Result<AuthPayload, ApiError> = await res.json();

  if (!session.ok || !session.data?.user?.id) {
    return {
      ok: false,
      error: {
        title: "Unauthorized",
        status: 401,
        detail: "You must be logged in",
        errorCode: "NO_SESSION",
        instance: undefined,
      },
    };
  }

  return session;
};

export const useSession = () => {
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery<Result<AuthPayload, ApiError>>({
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
