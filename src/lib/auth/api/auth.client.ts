import { signInAction, signOutAction } from "@/lib/auth/actions/auth";

/**
 * Équivalent de useSession() dans NextAuth — lit la session depuis le SessionProvider.
 * Retourne { data: { user } | null, status: "authenticated" | "unauthenticated" }.
 *
 * @example
 * const { data: session, status } = useSession();
 * if (status === "unauthenticated") return null;
 * session.user.firstName
 */
export { useSession } from "@lib/auth/context/auth.user.context";

/**
 * Sign in depuis un Client Component (appelle la Server Action).
 * Équivalent de signIn("credentials", ...) dans NextAuth côté client.
 *
 * @example
 * const result = await signIn({ email, password });
 */
export async function signIn({ email, password }: { email: string; password: string }) {
  return signInAction({ email, password });
}

/**
 * Sign out depuis un Client Component (appelle la Server Action).
 * Équivalent de signOut() dans NextAuth côté client.
 *
 * @example
 * await signOut();
 * window.location.href = "/";
 */
export async function signOut() {
  return signOutAction();
}
