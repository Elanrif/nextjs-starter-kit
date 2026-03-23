import { auth } from "@/lib/auth/better-auth/auth";
import { toNextJsHandler } from "better-auth/next-js";

/**
 * Better Auth catch-all route.
 * Intercepts all /api/auth/* requests and delegates to the BA handler.
 *
 * Endpoints exposés :
 *   - POST /api/auth/sign-in     → plugin custom (vérifie via backend externe)
 *   - POST /api/auth/sign-up     → plugin custom (inscription via backend externe)
 *   - POST /api/auth/sign-out    → natif BA (invalide la session + supprime le cookie)
 *   - GET  /api/auth/get-session → natif BA (retourne la session courante)
 */
export const { GET, POST } = toNextJsHandler(auth);
