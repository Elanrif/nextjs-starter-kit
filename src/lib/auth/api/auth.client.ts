"use client";

import { signOut } from "next-auth/react";
import { signInAction, signUpAction } from "@/lib/auth/actions/auth";
import type { Login, Registrer } from "@/lib/auth/models/auth.model";

export const authClient = {
  signIn: {
    email: async (credentials: Pick<Login, "email" | "password">) => {
      return signInAction(credentials);
    },
  },

  signUp: async (body: Registrer) => {
    return signUpAction(body);
  },

  signOut: async (redirectTo?: string) => {
    await signOut({ redirectTo: redirectTo ?? "/" });
  },

  useSession: () => {
    // Utiliser useSession() de next-auth/react directement dans les composants
    throw new Error("Use useSession() from next-auth/react directly");
  },
};
