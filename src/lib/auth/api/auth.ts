"server-only";

import * as authService from "@lib/auth/auth.service";
import * as joseService from "@lib/auth/jose/jose.service";
import { Login, Registrer } from "@lib/auth/models/auth.model";
import { deleteSession } from "@lib/auth/jose";
import { Config } from "@/config/api.config";

/**
 * Lit la session courante depuis le cookie (server-only).
 * Équivalent de auth() dans NextAuth — utilisable dans RSC, Server Actions, API Routes.
 *
 * @example
 * const session = await auth();
 * if (!session.ok) redirect("/sign-in");
 * session.data.user.userId
 */
export const auth = joseService.getSession;

/**
 * Appel backend sign-in (utilisé dans les Server Actions / API Routes).
 * Équivalent de signIn("credentials", ...) dans NextAuth.
 */
export async function signIn(credentials: Login, config?: Config) {
  return authService.signIn(credentials, config);
}

/**
 * Appel backend sign-up.
 */
export async function signUp(body: Registrer, config?: Config) {
  return authService.signUp(body, config);
}

/**
 * Supprime le cookie de session.
 * Équivalent de signOut() dans NextAuth.
 */
export async function signOut() {
  return deleteSession();
}
