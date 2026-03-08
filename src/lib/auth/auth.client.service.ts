import { AxiosResponse } from "axios";
import { CrudApiError, Result } from "@lib/shared/helpers/crud-api-error";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Login, Registrer } from "./models/auth.model";
import { User } from "../user/models/user.model";

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
      signOut: _signOutUrl,
      session: sessionUrl,
    },
  },
} = proxyEnvironment;

/**
 * Sign in a user with email and password.
 */
export async function signIn(
  login: Login,
): Promise<Result<User, CrudApiError>> {
  const result = await frontendHttp().post<
    any,
    AxiosResponse<Result<User, CrudApiError>>
  >(loginUrl, login);
  // data is the type of AxiosResponse's data
  return result.data;
}

/**
 * Register a new user.
 */
export async function signUp(
  registration: Registrer,
): Promise<Result<User, CrudApiError>> {
  const res = await frontendHttp().post<
    any,
    AxiosResponse<Result<User, CrudApiError>>
  >(registerUrl, registration);
  // data is the type of AxiosResponse's data
  return res.data;
}

/**
 * Get the current user's session.
 */
export async function getClientSession(): Promise<Result<User, CrudApiError>> {
  const result = await frontendHttp().get<
    any,
    AxiosResponse<Result<User, CrudApiError>>
  >(sessionUrl);
  // data is the type of AxiosResponse's data
  return result.data;
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
}): Promise<Result<User, CrudApiError>> {
  const body = { oldPassword, newPassword, confirmPassword };
  const result = await frontendHttp().patch<
    any,
    AxiosResponse<Result<User, CrudApiError>>
  >(passwordChangeUrl, body);
  // data is the type of AxiosResponse's data
  return result.data;
}
