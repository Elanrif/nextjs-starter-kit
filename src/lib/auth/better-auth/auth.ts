import { APIError, betterAuth } from "better-auth";
import Database from "better-sqlite3";
import { z } from "zod";
import { getLogger } from "@/config/logger.config";
import { createAuthEndpoint } from "better-auth/api";
import { authProvider } from "@/lib/auth/providers";

const logger = getLogger("server");

const SESSION_MAX_AGE = 7 * 24 * 60 * 60; // 7 days in seconds

export const auth = betterAuth({
  database: new Database(process.env.DATABASE_URL ?? "./dev.db"),
  secret: process.env.BETTER_AUTH_SECRET!,
  baseURL:
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",

  /**
   * Extended user fields — populated by the active auth backend provider.
   * externalId = KC sub UUID | backend numeric ID as string
   */
  user: {
    additionalFields: {
      role: { type: "string", required: false, defaultValue: "USER", input: false },
      externalId: { type: "string", required: false, input: false },
      firstName: { type: "string", required: false, input: false },
      lastName: { type: "string", required: false, input: false },
      phoneNumber: { type: "string", required: false, input: false },
      accessToken: { type: "string", required: false, input: false },
      refreshToken: { type: "string", required: false, input: false },
      expiresIn: { type: "number", required: false, input: false },
      refreshExpiresIn: { type: "number", required: false, input: false },
    },
  },

  plugins: [
    {
      id: "auth-provider-credentials",
      endpoints: {
        /**
         * POST /api/auth/sign-in
         * Delegates to the active AUTH_BACKEND_PROVIDER, syncs the user
         * into BA's local SQLite DB, and creates a BA session + cookie.
         */
        signIn: createAuthEndpoint(
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

            const result = await authProvider.signIn(email, password);
            if (!result.ok) {
              logger.warn({ email }, "Auth provider sign-in failed");
              throw new APIError("UNAUTHORIZED", { message: result.error.message });
            }

            const {
              user: u,
              access_token,
              refresh_token,
              expires_in,
              refresh_expires_in,
            } = result.data;

            // Upsert user in BA local SQLite
            const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
              includeAccounts: false,
            });

            const tokenFields = {
              accessToken: access_token,
              refreshToken: refresh_token,
              expiresIn: expires_in,
              refreshExpiresIn: refresh_expires_in,
            };

            let baUserId: string;
            if (existing?.user) {
              baUserId = existing.user.id;
              await ctx.context.internalAdapter.updateUser(baUserId, {
                name: `${u.firstName} ${u.lastName}`,
                role: u.role,
                externalId: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                phoneNumber: u.phoneNumber,
                ...tokenFields,
              });
            } else {
              const newUser = await ctx.context.internalAdapter.createUser({
                email: u.email,
                name: `${u.firstName} ${u.lastName}`,
                emailVerified: true,
                role: u.role,
                externalId: u.id,
                firstName: u.firstName,
                lastName: u.lastName,
                phoneNumber: u.phoneNumber,
                ...tokenFields,
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

            // Store access token in a separate httpOnly cookie since BA's getSession
            // does not return additionalFields server-side
            if (access_token) {
              ctx.setCookie("ba_access_token", access_token, {
                httpOnly: true,
                secure: process.env.ENV === "production",
                sameSite: "lax",
                path: "/",
                maxAge: SESSION_MAX_AGE,
              });
              logger.debug("ba_access_token cookie set");
            }

            logger.info({ email, baUserId }, "Sign-in successful");
            return ctx.json({
              user: {
                id: baUserId,
                externalId: u.id,
                email: u.email,
                name: `${u.firstName} ${u.lastName}`,
                role: u.role,
              },
              session: { id: session.id, expiresAt: session.expiresAt },
            });
          },
        ),

        /**
         * POST /api/auth/sign-up
         * Delegates registration to the active AUTH_BACKEND_PROVIDER,
         * then signs in to create a BA session.
         */
        signUp: createAuthEndpoint(
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

            // 1. Register via active provider
            const signUpResult = await authProvider.signUp({
              email,
              password,
              firstName,
              lastName,
              phoneNumber,
              confirmPassword,
            });
            if (!signUpResult.ok) {
              logger.warn({ email }, "Auth provider sign-up failed");
              throw new APIError("UNPROCESSABLE_ENTITY", {
                message: signUpResult.error.message,
              });
            }

            const { user: su } = signUpResult.data;

            // 2. Create BA user + session
            const existing = await ctx.context.internalAdapter.findUserByEmail(email, {
              includeAccounts: false,
            });

            let baUserId: string;
            if (existing?.user) {
              baUserId = existing.user.id;
            } else {
              const newUser = await ctx.context.internalAdapter.createUser({
                email: su.email,
                name: `${su.firstName} ${su.lastName}`,
                emailVerified: true,
                role: su.role,
                externalId: su.id,
                firstName: su.firstName,
                lastName: su.lastName,
                phoneNumber: su.phoneNumber,
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

            logger.info({ email, baUserId }, "Sign-up successful");
            return ctx.json({
              user: {
                id: baUserId,
                externalId: su.id,
                email: su.email,
                name: `${su.firstName} ${su.lastName}`,
                role: su.role,
              },
              session: { id: session.id, expiresAt: session.expiresAt },
            });
          },
        ),
      },
    },
  ],
});
