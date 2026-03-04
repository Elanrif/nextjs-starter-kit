import { AxiosError, AxiosResponse } from "axios";
import { CrudApiError } from "@lib/shared/helpers/crud-api-error";
import { proxyEnvironment } from "@config/proxy-api.config";
import { frontendHttp } from "@config/axios/frontend-http.config";
import { Login, Registrer } from "./models/auth.model";

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
  try {
    const result = await frontendHttp().post<any, AxiosResponse<any>>(
      loginUrl,
      login,
    );
    return result.data;
  } catch (error) {
    const err = error as AxiosError;
    return {
      status: err.response?.status || 500,
      message: "Failed to sign in user",
    };
  }
}

/**
 * Register a new user.
 */
export async function signUp(
  registration: Registrer,
): Promise<any | CrudApiError> {
  try {
    await frontendHttp().post<any, AxiosResponse<any>>(
      registerUrl,
      registration,
    );
    const maybeUser = await signIn({
      email: registration.email,
      password: registration.password,
    });
    if ("status" in maybeUser) {
      throw new Error(maybeUser.message);
    }
    return maybeUser;
  } catch (error) {
    const err = error as AxiosError;
    return {
      status: err.response?.status || 400,
      message: "Registration failed",
    };
  }
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
  try {
    const body = { oldPassword, newPassword, confirmPassword };
    const result = await frontendHttp().patch<any, AxiosResponse<any>>(
      passwordChangeUrl,
      body,
    );
    return result.data;
  } catch (error) {
    const err = error as AxiosError;
    return {
      status: err.response?.status || 500,
      message: "An error occurred while trying to change password",
    };
  }
}
