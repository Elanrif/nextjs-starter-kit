import * as authClientService from "@lib/auth/auth.client.service";
import * as joseClientService from "@lib/auth/jose/jose.client.service";
import { signInAction, signOutAction } from "@/lib/auth/actions/auth";
import { Registrer } from "@lib/auth/models/auth.model";

export const authClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      return signInAction({ email, password });
    },
    social: async (provider: string) => {
      // Simulate API call delay
    },
  },

  signUp: async ({ body }: { body: Registrer }) => {
    authClientService.signUp(body);
  },

  signOut: async () => {
    signOutAction();
  },

  getCurrentUser: async () => {
    return joseClientService.getCurrentUser();
  },

  useSession: () => {
    // ton hook React actuel
  },
};
