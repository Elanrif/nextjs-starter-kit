import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "@lib/auth/models/auth.model";
import { cookies } from "next/headers";
import { getLogger } from "@/config/logger.config";
import { User } from "@/lib/user/models/user.model";

const logger = getLogger("server");
const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
): Promise<SessionPayload | undefined>   {
  try {
    const { payload } = (await jwtVerify(session, encodedKey, {
      algorithms: ["HS256"],
    })) as { payload: SessionPayload };
    logger.info("Session decrypted successfully", { userId: payload.user?.id });
    return payload;
  } catch (error) {
    logger.error("Failed to decrypt session:", error);
  }
}

export async function createSession(user: User) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // Expires in 7 days
  const session = await encrypt({ user, expiresAt });
  const cookieStore = await cookies();

  cookieStore.set("session", session, {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
  logger.info("Session created for user", { userId: user.id });
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
    secure: true,
    expires: expires,
    sameSite: "lax",
    path: "/",
  });
  logger.info("Session updated for user", payload.user?.id);
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
  logger.info("Session deleted");
}
