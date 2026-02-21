import { betterAuth } from "better-auth";
import { headers } from "next/headers";

/**
 * Server-side Better Auth configuration
 * Documentation: https://www.better-auth.com
 *
 * This file configures the Better Auth instance for server-side use.
 * For client-side authentication, use auth-client.ts
 */
export const auth = betterAuth({
  /**
   * Base URL for the auth API
   * This should match your application's URL
   */
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",

  /**
   * Secret key for signing tokens
   * IMPORTANT: Use a strong, unique secret in production
   * Generate with: npx @better-auth/cli@latest secret
   */
  secret: process.env.BETTER_AUTH_SECRET,

  /**
   * Email & Password authentication
   */
  emailAndPassword: {
    enabled: true,
    // Configure password requirements
    minPasswordLength: 8,
    // Require email verification before allowing sign in
    // requireEmailVerification: true,
  },

  /**
   * Session configuration
   */
  session: {
    // Session expiration in seconds (7 days)
    expiresIn: 60 * 60 * 24 * 7,
    // Update session expiry on each request (1 day)
    updateAge: 60 * 60 * 24,
    // Cookie configuration
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5, // 5 minutes cache
    },
  },

  /**
   * Database adapter configuration
   * Uncomment and configure based on your database:
   *
   * For Prisma:
   * ```
   * import { prismaAdapter } from "better-auth/adapters/prisma";
   * import { prisma } from "@/lib/prisma";
   *
   * database: prismaAdapter(prisma, {
   *   provider: "postgresql", // or "mysql", "sqlite"
   * }),
   * ```
   *
   * For Drizzle:
   * ```
   * import { drizzleAdapter } from "better-auth/adapters/drizzle";
   * import { db } from "@/lib/db";
   *
   * database: drizzleAdapter(db, {
   *   provider: "pg", // or "mysql", "sqlite"
   * }),
   * ```
   */
  // database: prismaAdapter(prisma, { provider: "postgresql" }),

  /**
   * Social providers (uncomment to enable)
   */
  // socialProviders: {
  //   google: {
  //     clientId: process.env.GOOGLE_CLIENT_ID!,
  //     clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  //   },
  //   github: {
  //     clientId: process.env.GITHUB_CLIENT_ID!,
  //     clientSecret: process.env.GITHUB_CLIENT_SECRET!,
  //   },
  // },

  /**
   * Trusted origins for CORS
   */
  trustedOrigins: [process.env.BETTER_AUTH_URL || "http://localhost:3000"],

  /**
   * Advanced configuration
   */
  advanced: {
    // Use secure cookies in production
    useSecureCookies: process.env.NODE_ENV === "production",
    // Cookie prefix
    cookiePrefix: "better-auth",
  },
});

// ============================================================================
// Type Exports
// ============================================================================

/**
 * Session type inferred from Better Auth configuration
 */
export type Session = typeof auth.$Infer.Session;

/**
 * User type inferred from Better Auth configuration
 */
export type User = typeof auth.$Infer.Session.user;

// ============================================================================
// Server-side Session Helpers
// ============================================================================

/**
 * Get the current session on the server side (Server Components, Route Handlers)
 *
 * @example
 * ```tsx
 * // In a Server Component
 * import { getServerSession } from "@/lib/auth/auth";
 *
 * export default async function DashboardPage() {
 *   const session = await getServerSession();
 *
 *   if (!session) {
 *     redirect("/sign-in");
 *   }
 *
 *   return <div>Welcome, {session.user.name}!</div>;
 * }
 * ```
 */
export async function getServerSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  return session;
}

/**
 * Check if the current user is authenticated on the server side
 *
 * @example
 * ```tsx
 * const isAuth = await isAuthenticated();
 * if (!isAuth) redirect("/sign-in");
 * ```
 */
export async function isAuthenticated(): Promise<boolean> {
  const session = await getServerSession();
  return !!session?.user;
}
