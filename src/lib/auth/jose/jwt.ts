import { SignJWT, jwtVerify } from "jose";
import type { SessionPayload } from "@/lib/auth/models/auth.model";

/**
 * JWT helpers used by both server and middleware.
 * IMPORTANT: keep this module edge-compatible (no next/headers, no server-only, no Node-only deps).
 */

function getEncodedKey(): Uint8Array {
  const secretKey = process.env.SESSION_SECRET;
  if (!secretKey) {
    throw new Error("SESSION_SECRET is not defined");
  }
  return new TextEncoder().encode(secretKey);
}

/**
 * Encrypts a session payload into a JWT token.
 */
export async function encrypt(payload: SessionPayload): Promise<string> {
  const encodedKey = getEncodedKey();
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

/**
 * Decrypts a JWT session token into a SessionPayload.
 * Returns undefined if session is missing or invalid.
 */
export async function decrypt(session?: string): Promise<SessionPayload | undefined> {
  if (!session) return undefined;

  try {
    const encodedKey = getEncodedKey();
    const { payload } = (await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })) as { payload: SessionPayload };

    return payload;
  } catch {
    return undefined;
  }
}
