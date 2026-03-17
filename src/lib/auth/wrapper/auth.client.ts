import { signInAction, signOutAction } from "@/lib/actions/auth";
import { Registrer } from "@lib/auth/models/auth.model";
import { _signUp } from "@lib/auth/auth.client.service";
import { _getCurrentUser } from "@lib/auth/jose/jose.client.service";

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
    _signUp(body);
  },

  signOut: async () => {
    signOutAction();
  },

  getCurrentUser: async () => {
    return _getCurrentUser();
  },

  useSession: () => {
    // ton hoook React actuel
  },
};
