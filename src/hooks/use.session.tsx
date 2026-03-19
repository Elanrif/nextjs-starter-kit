"use client";

import { Session } from "@/lib/auth/models/auth.model";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
import useSWR from "swr";

interface UseSessionReturn {
  session: Result<Session, CrudApiError> | undefined;
  isLoading: boolean;
  error: any;
  refresh: () => Promise<Result<Session, CrudApiError> | undefined>;
  invalidate: () => Promise<Result<Session, CrudApiError> | undefined>;
}

const fetcher = async (url: string): Promise<Result<Session, CrudApiError>> => {
  const res = await fetch(url, { credentials: "include" });

  // 401 / 403 is expected when not authenticated
  if (res.status === 401 || res.status === 403) {
    return {
      ok: false,
      error: {
        error: "Unauthorized",
        status: 401,
        message: "Not authenticated",
      },
    };
  }

  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Failed to fetch session" }));
    throw crudApiErrorResponse(errorData, "fetchSession");
  }

  const session: Result<Session, CrudApiError> = await res.json();

  if (!session.ok || !session.data?.user?.userId) {
    const err = {
      error: "Unauthorized",
      status: 401,
      message: "You must be logged in",
    };
    return { ok: false, error: err };
  }

  return session;
};

export const useSession = (): UseSessionReturn => {
  const { data, error, isLoading, mutate } = useSWR<
    Result<Session, CrudApiError>
  >("/api/auth/session", fetcher, {
    revalidateOnFocus: false,
    revalidateOnMount: true,
    //refreshInterval: 1000, // Rafraîchit toutes les 1 seconde
    //shouldRetryOnError: false,
  });

  return {
    session: data,
    isLoading,
    error,
    refresh: () => mutate(), // revalidate: refetch latest session data from server
    invalidate: () => mutate(undefined, false), // clear cache: reset session to undefined
  };
};
