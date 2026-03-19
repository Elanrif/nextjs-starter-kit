"server-only";

import * as authService from "@lib/auth/auth.service";
import * as joseService from "@lib/auth/jose/jose.service";
import { Login, Registrer } from "@lib/auth/models/auth.model";
import { deleteSession } from "@lib/auth/jose";
import { Config } from "@/config/api.config";

export const auth = {
  api: {
    signIn: async ({ body, config }: { body: Login; config?: Config }) => {
      return authService.signIn(body, config);
    },

    signUp: async ({ body, config }: { body: Registrer; config?: Config }) => {
      return authService.signUp(body, config);
    },

    signOut: async () => {
      deleteSession();
    },

    getSession: async () => {
      return joseService.getSession();
    },

    getCurrentUser: async () => {
      return joseService.getCurrentUser();
    },

    verifyEmail: async ({ query }: { query: { token: string } }) => {
      // Simulate API call delay
    },
  },
};
