import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@lib/auth/models/auth.model";
import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";
import { AxiosError } from "axios";

const logger = getLogger("server");
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
  logger.info("Session encrypted successfully:", `${token}`);
  return token;
}

export async function decrypt(
  session?: string,
): Promise<SessionPayload | undefined> {
  if (!session) return undefined;

  try {
    const { payload } = (await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })) as { payload: SessionPayload };
    logger.info("Session decrypted successfully", payload);
    return payload;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Failed to decrypt session:", error);
  }
}

export async function createSession(
  userId: number,
  email: string,
  role: string,
) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
  const session = await encrypt({ userId, email, role, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  logger.info("Session created for user", email);
}

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
  logger.info("Session updated for user", payload);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  logger.info("Session deleted");
}
