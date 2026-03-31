"use client";

import { Session } from "@/lib/auth/models/auth.model";
import { createContext, useContext } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type SessionStatus = "authenticated" | "unauthenticated";

type SessionContextValue = {
  data: Session | null;
  status: SessionStatus;
};

// ─── Context ──────────────────────────────────────────────────────────────────

const SessionContext = createContext<SessionContextValue>({
  data: null,
  status: "unauthenticated",
});

// ─── Provider ─────────────────────────────────────────────────────────────────

/**
 * Équivalent de <SessionProvider> dans NextAuth.
 * À placer dans les layouts protégés après avoir lu la session côté serveur.
 *
 * @example
 * const result = await auth();
 * <SessionProvider session={result.ok ? result.data : null}>
 *   {children}
 * </SessionProvider>
 */
export function SessionProvider({
  session,
  children,
}: {
  session: Session | null;
  children: React.ReactNode;
}) {
  const status: SessionStatus = session?.isAuth ? "authenticated" : "unauthenticated";

  return (
    <SessionContext.Provider value={{ data: session, status }}>{children}</SessionContext.Provider>
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────

/**
 * Équivalent de useSession() dans NextAuth.
 * Retourne { data: Session | null, status }.
 *
 * @example
 * const { data: session, status } = useSession();
 * if (status === "unauthenticated") return null;
 * session.user.firstName
 */
export function useSession() {
  return useContext(SessionContext);
}
