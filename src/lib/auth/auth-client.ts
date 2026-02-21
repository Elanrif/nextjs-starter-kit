import { createAuthClient } from "better-auth/react";

/**
 * Client-side Better Auth instance
 * Use this in React Client Components for authentication
 *
 * @example
 * ```tsx
 * "use client";
 * import { useSession, signIn, signOut } from "@/lib/auth/auth-client";
 *
 * export function AuthButton() {
 *   const { data: session, isPending } = useSession();
 *
 *   if (isPending) return <div>Loading...</div>;
 *
 *   if (session) {
 *     return (
 *       <button onClick={() => signOut()}>
 *         Sign out {session.user.email}
 *       </button>
 *     );
 *   }
 *
 *   return <button onClick={() => signIn.email({ email, password })}>Sign in</button>;
 * }
 * ```
 */
export const authClient = createAuthClient({
  /**
   * Base URL for the auth API
   * This should match your application's URL
   */
  baseURL: process.env.NEXT_PUBLIC_WEBSITE_URL || "http://localhost:3000",
});

// ============================================================================
// Re-export commonly used methods and hooks
// ============================================================================

/**
 * Sign in with email and password
 *
 * @example
 * ```tsx
 * const { data, error } = await signIn.email({
 *   email: "user@example.com",
 *   password: "password123",
 * });
 * ```
 */
export const signIn = authClient.signIn;

/**
 * Sign up with email and password
 *
 * @example
 * ```tsx
 * const { data, error } = await signUp.email({
 *   email: "user@example.com",
 *   password: "password123",
 *   name: "John Doe",
 * });
 * ```
 */
export const signUp = authClient.signUp;

/**
 * Sign out the current user
 *
 * @example
 * ```tsx
 * await signOut();
 * // or with redirect
 * await signOut({ redirect: true, redirectTo: "/" });
 * ```
 */
export const signOut = authClient.signOut;

/**
 * React hook to get the current session
 * Use this in Client Components
 *
 * @example
 * ```tsx
 * const { data: session, isPending, error } = useSession();
 * ```
 */
export const useSession = authClient.useSession;

/**
 * Get the current session (non-hook version)
 * Useful for one-time session checks
 *
 * @example
 * ```tsx
 * const session = await getSession();
 * ```
 */
export const getSession = authClient.getSession;
