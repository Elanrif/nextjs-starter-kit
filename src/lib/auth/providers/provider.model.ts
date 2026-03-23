"server-only";

import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";
import type { Registrer } from "@/lib/auth/models/auth.model";

/**
 * JWT tokens optionally returned by an auth provider.
 * Present when the provider issues its own tokens (backend JWT, KC access_token, etc.).
 */
export type AuthTokens = {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number; // seconds
};

/**
 * Normalized user returned by any auth provider.
 * externalId = KC sub (UUID) | backend numeric ID as string
 * tokens     = present if the provider returns its own JWT
 */
export type AuthUser = {
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  externalId: string;
  tokens?: AuthTokens;
};

/**
 * Contract every auth provider must implement — Keycloak, external backend, etc.
 * The session layer (Better Auth / NextAuth) calls these methods
 * without knowing which provider is actually used.
 */
export interface AuthProvider {
  signIn(email: string, password: string): Promise<Result<AuthUser, CrudApiError>>;
  signUp(data: Registrer): Promise<Result<void, CrudApiError>>;
}
