"use client";

// On the main branch, session state is managed via AuthUserContext.
// Use useAuthUser() from "@/lib/auth/context/auth.user.context" directly.
//
// Branches using jose/better-auth will replace this with a real server-side session fetch.

export { useAuthUser as useSession } from "@/lib/auth/context/auth.user.context";
