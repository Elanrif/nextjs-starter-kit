"server-only";

import * as authService from "@lib/auth/auth.service";
import { Login, Registrer } from "@lib/auth/models/auth.model";
import { Config } from "@/config/api.config";

export const auth = {
  api: {
    signIn: async ({ body, config }: { body: Login; config?: Config }) => {
      return authService.signIn(body, config);
    },

    signUp: async ({ body, config }: { body: Registrer; config?: Config }) => {
      return authService.signUp(body, config);
    },
  },
};
