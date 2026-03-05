"use client";

import { getClientSession } from "@/lib/auth/auth.client.service";

import useSWR from "swr";

export function useSession() {
  const { data: session, error } = useSWR("/api/auth/session", getClientSession);

  if (error) {
    console.error("Failed to fetch session:", error);
    return null;
  }

  return session;
}
