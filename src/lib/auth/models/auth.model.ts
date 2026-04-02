/**
 * Auth types — API contracts and session shapes (no validation)
 * See: src/lib/auth/schemas/auth.schema.ts for form validation
 */

import { UserRole } from "@/lib/users/models/user.model";

export interface AuthSignIn {
  action?: "SIGN_IN" | "SIGN_UP";
}

export interface Registrer extends AuthSignIn {
  firstName: string;
  lastName: string;
  phoneNumber: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface Login extends AuthSignIn {
  email: string;
  password: string;
}

/**
 * User data embedded in the session cookie.
 * Mirrors the User model without sensitive fields (no password).
 */
export type SessionUser = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: UserRole;
  avatarUrl?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  [key: string]: any; // allows createdAt, emailVerified, etc. from backend
};

export interface SessionPayload {
  user: SessionUser;
  expiresAt: Date;
  [key: string]: unknown; // required by jose's JWTPayload
}

/**
 * Session returned by auth() — contains the full user, no extra fetch needed.
 */
export type Session = {
  user: SessionUser;
  isAuth: boolean;
  expiresAt?: Date;
  access_token?: string;
};
