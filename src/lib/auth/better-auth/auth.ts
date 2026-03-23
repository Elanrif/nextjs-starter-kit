import "server-only";

import { APIError, betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { z } from "zod";
import { getLogger } from "@/config/logger.config";
import { createAuthEndpoint } from "better-auth/api";
import { kcSignIn, kcSignUp } from "@/lib/auth/keycloak/keycloak.service";

const logger = getLogger("server");

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const auth = betterAuth({
  database: new Database(process.env.DATABASE_URL ?? "./dev.db"),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL:
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  /**
   * Extend the BA user with Keycloak fields.
   * These are synced from the Keycloak id_token on every sign-in.
   */
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "USER", input: false },
      kcSub: { type: "string", required: false, input: false },
      firstName: { type: "string", required: false, input: false },
      lastName: { type: "string", required: false, input: false },
      phoneNumber: { type: "string", required: false, input: false },
    },
  },

  plugins: [
    {
      id: "keycloak-credentials",
      endpoints: {
        /**
         * POST /api/auth/sign-in
         * Verifies credentials via Keycloak ROPC, syncs the user into BA's
         * local SQLite DB, and creates a BA session + cookie.
         */
        signInWithKeycloak: createAuthEndpoint(
          "/sign-in",
          {
            method: "POST",
            body: z.object({
              email: z.string().email(),
              password: z.string().min(1),
            }),
          },
          async (ctx) => {
            const { email, password } = ctx.body;

            // 1. ROPC → Keycloak
            const kcResult = await kcSignIn(email, password);
            if (!kcResult.ok) {
              logger.warn({ email }, "Keycloak sign-in failed");
              throw new APIError("UNAUTHORIZED", { message: kcResult.error.message });
            }

            const kcUser = kcResult.data;

            // 2. Upsert user in BA local SQLite
            const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
              includeAccounts: false,
            });

            let baUserId: string;
            if (existing?.user) {
              baUserId = existing.user.id;
              await ctx.context.internalAdapter.updateUser(baUserId, {
                name: `${kcUser.firstName} ${kcUser.lastName}`,
                role: kcUser.role,
                kcSub: kcUser.kcSub,
                firstName: kcUser.firstName,
                lastName: kcUser.lastName,
                phoneNumber: kcUser.phoneNumber,
              });
            } else {
              const newUser = await ctx.context.internalAdapter.createUser({
                email: kcUser.email,
                name: `${kcUser.firstName} ${kcUser.lastName}`,
                emailVerified: true,
                role: kcUser.role,
                kcSub: kcUser.kcSub,
                firstName: kcUser.firstName,
                lastName: kcUser.lastName,
                phoneNumber: kcUser.phoneNumber,
              });
              baUserId = newUser.id;
            }

            // 3. Create BA session + cookie
            const session = await ctx.context.internalAdapter.createSession(baUserId);
            await ctx.setSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              session.token,
              ctx.context.secret,
              {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
              },
            );

            logger.info({ email, baUserId }, "Keycloak sign-in → BA session created");
            return ctx.json({
              user: {
                id: baUserId,
                kcSub: kcUser.kcSub,
                email: kcUser.email,
                name: `${kcUser.firstName} ${kcUser.lastName}`,
                role: kcUser.role,
              },
              session: { id: session.id, expiresAt: session.expiresAt },
            });
          },
        ),

        /**
         * POST /api/auth/sign-up
         * Creates the user in Keycloak via Admin API, then signs in via ROPC
         * to get the full user, creates a BA user + session.
         */
        signUpWithKeycloak: createAuthEndpoint(
          "/sign-up",
          {
            method: "POST",
            body: z.object({
              email: z.string().email(),
              password: z.string().min(6),
              firstName: z.string().min(1),
              lastName: z.string().min(1),
              phoneNumber: z.string().min(10),
              confirmPassword: z.string().min(6),
            }),
          },
          async (ctx) => {
            const { email, password, firstName, lastName, phoneNumber, confirmPassword } = ctx.body;

            // 1. Create user in Keycloak via Admin API
            const signUpResult = await kcSignUp({
              email,
              password,
              firstName,
              lastName,
              phoneNumber,
              confirmPassword,
            });
            if (!signUpResult.ok) {
              logger.warn({ email }, "Keycloak sign-up failed");
              throw new APIError("UNPROCESSABLE_ENTITY", { message: signUpResult.error.message });
            }

            // 2. ROPC to get the full user from the id_token
            const kcResult = await kcSignIn(email, password);
            if (!kcResult.ok) {
              throw new APIError("INTERNAL_SERVER_ERROR", {
                message: "Inscription réussie mais connexion échouée. Veuillez vous connecter.",
              });
            }

            const kcUser = kcResult.data;

            // 3. Create BA user + session
            const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
              includeAccounts: false,
            });

            let baUserId: string;
            if (existing?.user) {
              baUserId = existing.user.id;
            } else {
              const newUser = await ctx.context.internalAdapter.createUser({
                email: kcUser.email,
                name: `${kcUser.firstName} ${kcUser.lastName}`,
                emailVerified: true,
                role: kcUser.role,
                kcSub: kcUser.kcSub,
                firstName: kcUser.firstName,
                lastName: kcUser.lastName,
                phoneNumber: kcUser.phoneNumber,
              });
              baUserId = newUser.id;
            }

            const session = await ctx.context.internalAdapter.createSession(baUserId);
            await ctx.setSignedCookie(
              ctx.context.authCookies.sessionToken.name,
              session.token,
              ctx.context.secret,
              {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
              },
            );

            logger.info({ email, baUserId }, "Keycloak sign-up → BA session created");
            return ctx.json({
              user: {
                id: baUserId,
                kcSub: kcUser.kcSub,
                email: kcUser.email,
                name: `${kcUser.firstName} ${kcUser.lastName}`,
                role: kcUser.role,
              },
              session: { id: session.id, expiresAt: session.expiresAt },
            });
          },
        ),
      },
    },
  ],
});
