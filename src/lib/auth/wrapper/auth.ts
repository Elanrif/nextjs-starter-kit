"server-only";

import { _signUp, _signIn } from "@lib/auth/auth.service";
import { Login, Registrer } from "@lib/auth/models/auth.model";
import { deleteSession } from "@lib/auth/jose";
import { Config } from "@/config/api.config";
import { _getCurrentUser, _getSession } from "@lib/auth/jose/jose.service";

export const auth = {
  api: {
    signIn: async ({ body, config }: { body: Login; config?: Config }) => {
      return _signIn(body, config);
    },

    signUp: async ({ body, config }: { body: Registrer; config?: Config }) => {
      return _signUp(body, config);
    },

    signOut: async () => {
      deleteSession();
    },

    getSession: async () => {
      return _getSession();
    },

    getCurrentUser: async () => {
      return _getCurrentUser();
    },

    verifyEmail: async ({ query }: { query: { token: string } }) => {
      // Simulate API call delay
    },
  },
};
