"server-only";

import { getCurrentUser } from "@/lib/auth/next-auth/next-auth.service";

export const auth = {
  api: {
    getCurrentUser: async () => {
      return getCurrentUser();
    },
  },
};
