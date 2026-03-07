"use client";

import { Session } from "@/lib/auth/models/auth.model";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error";
import useSWR from "swr";

const fetcher = async (url: string): Promise<Session | null> => {
  const res = await fetch(url, { credentials: "include" });
  
  // 401 is expected when not authenticated - return null instead of throwing
  if (res.status === 401) {
    return null;
  }
  
  if (!res.ok) {
    const errorData = await res
      .json()
      .catch(() => ({ message: "Failed to fetch session" }));
    throw crudApiErrorResponse(errorData, "fetchSession");
  }
  
  return res.json();
};

export const useSession = () => {
  const { data, error, isLoading, mutate } = useSWR<Session | null>(
    "/api/auth/session",
    fetcher,
    {
      revalidateOnFocus: false,
      revalidateOnMount: true,
      //refreshInterval: 1000, // Rafraîchit toutes les 1 seconde
      // shouldRetryOnError: false,
    },
  );

  return {
    session: data,
    isLoading,
    error,
    refresh: mutate, // allows manual refresh of session data
    invalidate: () => mutate(null, false), // invalide complètement le cache
  };
};
