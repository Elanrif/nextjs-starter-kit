"use client";

import type { AuthPayload } from "@/lib/auth/models/auth.model";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSession } from "@/lib/auth/auth.client.service";

export const SESSION_QUERY_KEY = ["session"];

const fetcher = async (): Promise<Result<AuthPayload, ApiError>> => {
  return await getSession();
};

export const useSession = () => {
  const queryClient = useQueryClient();

  const { data, error, isPending } = useQuery<Result<AuthPayload, ApiError>>({
    queryKey: SESSION_QUERY_KEY,
    queryFn: fetcher,
    refetchOnWindowFocus: true, // Refetch when tab regains focus
    refetchOnMount: true, // Refetch when component mounts
    retry: 1,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  return {
    session: data, // Return the full Result so caller can check session.ok
    isLoading: isPending,
    error,
    refresh: () =>
      queryClient.invalidateQueries({
        queryKey: SESSION_QUERY_KEY,
      }),
    invalidate: () => queryClient.setQueryData(SESSION_QUERY_KEY, undefined),
    isLoggedIn: data?.ok ?? false,
    user: data?.ok ? data.data.user : null,
  };
};
