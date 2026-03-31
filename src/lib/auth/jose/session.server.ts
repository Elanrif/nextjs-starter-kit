import "server-only";

import { cookies } from "next/headers";
import type { SessionUser } from "@/lib/auth/models/auth.model";
import { encrypt, decrypt } from "./jwt";

/**
 * Server-only session cookie helpers (uses next/headers cookies()).
 * Do NOT import this module from middleware or client components.
 */

export async function createSession(user: SessionUser) {
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 days
  const session = await encrypt({ user, expiresAt });

  const cookieStore = await cookies();
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    expires: expiresAt,
    sameSite: "lax",
    path: "/",
  });
}

export async function updateSession() {
  const cookieStore = await cookies();
  const session = cookieStore.get("session")?.value;
  const payload = await decrypt(session);

  if (!session || !payload) return null;

  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
  cookieStore.set("session", session, {
    httpOnly: true,
    secure: process.env.ENV === "production",
    expires,
    sameSite: "lax",
    path: "/",
  });

  return { session, expires };
}

export async function deleteSession() {
  const cookieStore = await cookies();
  cookieStore.delete("session");
}
