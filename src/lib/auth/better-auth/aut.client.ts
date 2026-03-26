"use client";

import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  // Better Auth is mounted under the Next.js catch-all route: /api/auth/*
  // So the client must target that base path, otherwise calls like "/sign-out"
  // will NOT invalidate the BA session cookie.
  baseURL: `${process.env.NEXT_PUBLIC_APP_URL!}/api/auth`,
});
