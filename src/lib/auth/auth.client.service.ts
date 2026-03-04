import { AxiosResponse } from "axios";
import { CrudApiError } from "@lib/shared/helpers/crud-api-error";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Login, Registrer } from "./models/auth.model";

/**
 * ⚠️ NO Logging and error Handling is needed here as the proxy API routes will handle logging.
 * Auth client service for handling user authentication operations.
 * This service interacts with the proxy API endpoints for authentication.
 */
const {
  api: {
    endpoints: {
      passwordChange: passwordChangeUrl,
      register: registerUrl,
      login: loginUrl,
    },
  },
} = proxyEnvironment;

/**
 * Sign in a user with email and password.
 */
export async function signIn(login: Login): Promise<any | CrudApiError> {
  const result = await frontendHttp().post<any, AxiosResponse<any>>(
    loginUrl,
    login,
  );
  return result.data;
}

/**
 * Register a new user.
 */
export async function signUp(
  registration: Registrer,
): Promise<any | CrudApiError> {
  const res = await frontendHttp().post<any, AxiosResponse<any>>(
    registerUrl,
    registration,
  );
  return res.data;
}

/**
 * Change the password of an authenticated user.
 */
export async function changeUserPassword({
  oldPassword,
  newPassword,
  confirmPassword,
}: {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<any | CrudApiError> {
  const body = { oldPassword, newPassword, confirmPassword };
  const result = await frontendHttp().patch<any, AxiosResponse<any>>(
    passwordChangeUrl,
    body,
  );
  return result.data;
}
