"server-only";

import apiClient from "@/config/api.config";
import environment from "@/config/environment.config";
import { crudApiErrorResponse } from "@/lib/shared/helpers/crud-api-error.server";
import type { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error.server";
import type { Registrer } from "@/lib/auth/models/auth.model";
import type { AxiosResponse } from "axios";
import { getLogger } from "@/config/logger.config";
import type { AuthProvider, AuthUser } from "./provider.model";

const logger = getLogger("server");

const {
  api: {
    rest: {
      endpoints: { login: loginUrl, register: registerUrl },
    },
  },
} = environment;

/**
 * Shape returned by the backend login endpoint.
 * Case A: returns only a User object        → no tokens field
 * Case B: returns User + JWT tokens         → tokens field present
 */
type BackendLoginResponse = {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  phoneNumber: string;
  role: string;
  // Optional — only if the backend issues its own JWT
  accessToken?: string;
  refreshToken?: string;
  expiresIn?: number;
};

export const restProvider: AuthProvider = {
  async signIn(email: string, password: string): Promise<Result<AuthUser, CrudApiError>> {
    try {
      const { data } = await apiClient(true).post<any, AxiosResponse<BackendLoginResponse>>(
        loginUrl,
        { email, password },
      );

      logger.info({ email }, "Backend sign-in successful");
      return {
        ok: true,
        data: {
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          phoneNumber: data.phoneNumber,
          role: data.role,
          externalId: String(data.id),
          // tokens is set only when the backend returns them
          ...(data.accessToken && {
            tokens: {
              accessToken: data.accessToken,
              refreshToken: data.refreshToken,
              expiresIn: data.expiresIn,
            },
          }),
        },
      };
    } catch {
      logger.warn({ email }, "Backend sign-in failed");
      return {
        ok: false,
        error: {
          error: "Unauthorized",
          status: 401,
          message: "Email ou mot de passe incorrect",
        },
      };
    }
  },

  async signUp(data: Registrer): Promise<Result<void, CrudApiError>> {
    try {
      await apiClient(true).post(registerUrl, {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        confirmPassword: data.confirmPassword,
      });

      logger.info({ email: data.email }, "Backend sign-up successful");
      return { ok: true, data: undefined };
    } catch (error) {
      logger.warn({ email: data.email }, "Backend sign-up failed");
      return { ok: false, error: crudApiErrorResponse(error, "backendProvider.signUp") };
    }
  },
};
