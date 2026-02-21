/**
 * Better Auth Configuration
 * This file re-exports the better-auth configuration for backward compatibility
 *
 * For new code, import directly from "@/lib/auth/auth" or "@/lib/auth/auth-client"
 */

export { auth } from "@/lib/auth/auth";
export {
  authClient,
  signIn,
  signUp,
  signOut,
  useSession,
  getSession,
} from "@/lib/auth/auth-client";
