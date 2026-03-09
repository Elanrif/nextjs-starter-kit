import "server-only";

import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@lib/auth/models/auth.model";
import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";

/**
 * Session management utilities for authentication.
 * Uses JWT for session encryption/decryption and cookie storage.
 */
const logger = getLogger("server");
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

/**
 * Encrypts a session payload into a JWT token.
 * @param payload - SessionPayload object to encrypt
 * @returns JWT token as string
 */
export async function encrypt(payload: SessionPayload) {
  if (!secretKey) {
    throw new Error("secret key is not defined");
  }
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  console.warn("token:", token);
  return token;
}

/**
 * Decrypts a JWT session token into a SessionPayload.
 * @param session - JWT token string
 * @returns SessionPayload or undefined if invalid
 */
export async function decrypt(
  session?: string,
): Promise<SessionPayload | undefined> {
  if (!session) return undefined;

  try {
    const { payload } = (await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })) as { payload: SessionPayload };
    return payload;
  } catch (error) {
    logger.error("Failed to decrypt session:", error);
    return undefined;
  }
}

/**
 * Creates a session cookie for a user.
 * @param userId - User ID
 * @param email - User email
 * @param role - User role
 */
export async function createSession(
  userId: number,
  email: string,
  role: string,
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
  const session = await encrypt({ user: { userId, email, role }, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Updates the session cookie, extending its expiration.
 * @returns null if session is missing or invalid
 */
export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) {
    return null;
  }

  // Extend expiration by 7 days
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
}

/**
 * Deletes the session cookie.
 */
export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
