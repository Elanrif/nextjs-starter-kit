"use client";

import { useAuth } from "../../../lib/auth/auth-client";

/**
 * Client Session Hook
 *
 * A custom hook that provides session data with additional utilities.
 * Use this in Client Components for real-time session updates.
 *
 * @example
 * ```tsx
 * "use client";
 * import { useClientSession } from "@/components/auth/useClientSession";
 *
 * export function ProfileCard() {
 *   const { user, isAuthenticated, isLoading } = useClientSession();
 *
 *   if (isLoading) return <div>Loading...</div>;
 *   if (!isAuthenticated) return <div>Please sign in</div>;
 *
 *   return <div>Hello, {user.name}!</div>;
 * }
 * ```
 */
export function useClientSession() {
  const { data: session, isPending, error } = useAuth();

  return {
    /** The full session object */
    session,
    /** The current user (null if not authenticated) */
    user: session?.user ?? null,
    /** Whether the user is authenticated */
    isAuthenticated: !!session?.user,
    /** Whether the session is being loaded */
    isLoading: isPending,
    /** Any error that occurred while fetching the session */
    error,
  };
}
