"server-only";

import { getCurrentUser } from "@/lib/auth/better-auth/better-auth.service";
import { auth as baAuth } from "@/lib/auth/better-auth/auth";
import { headers } from "next/headers";

export const auth = {
  api: {
    getCurrentUser: async () => {
      return getCurrentUser();
    },

    signOut: async () => {
      await baAuth.api.signOut({ headers: await headers() });
    },
  },
};
