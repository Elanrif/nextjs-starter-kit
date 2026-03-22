import * as authClientService from "@lib/auth/auth.client.service";
import { signInAction, signOutAction } from "@/lib/auth/actions/auth";
import { Registrer } from "@lib/auth/models/auth.model";

export const authClient = {
  signIn: {
    email: async ({ email, password }: { email: string; password: string }) => {
      return signInAction({ email, password });
    },
    social: async (_provider: string) => {
      // TODO: implement social sign-in
    },
  },

  signUp: async ({ body }: { body: Registrer }) => {
    return authClientService.signUp(body);
  },

  signOut: async () => {
    return signOutAction();
  },

  useSession: () => {
    // use useAuthUser() from AuthUserContext instead
  },
};
