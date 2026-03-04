import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosResponse } from "axios";
import { User } from "@lib/user/models/user.model";
import {
  ApiError,
  CrudApiError,
  crudApiErrorResponse,
} from "@/lib/shared/helpers/crud-api-error";
import { getLogger } from "@/config/logger.config";
import { Login, Registrer } from "./models/auth.model";

const {
  api: {
    rest: {
      endpoints: { register: registerUrl, login: loginUrl },
    },
  },
} = environment;
const logger = getLogger("server");

/**
 * Attempts to perform the operation.
 *
 * On failure (`catch`), may return a value instead of throwing.
 * This allows callers to handle errors using `"key" in res` checks.
 *
 * Example usage:
 *   const res = await myFunction(params);
 *   if ("key" in res) {
 *     // handle the error here
 *   } else {
 *     // handle success here
 *   }
 */
export async function signIn(
  login: Login,
  config?: Config,
): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(true, config).post<any, AxiosResponse<User>>(
      loginUrl,
      login,
    );
    logger.info("[SIGNIN] User signed in", res.data);
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "signIn");
  }
}

/**
 * Attempts to perform the operation.
 *
 * On failure (`catch`), throws an exception to be handled with try/catch.
 *
 * Example usage:
 *   try {
 *     const result = await myFunction(params);
 *     // handle success here
 *   } catch (error) {
 *     // handle the error here
 *   }
 *
 */
export async function signUp(
  registration: Registrer,
  config?: Config,
): Promise<User | CrudApiError> {
  try {
    await apiClient(true, config).post<any, AxiosResponse<any>>(
      registerUrl,
      registration,
    );
    logger.info("[SIGNUP] User registered", { email: registration.email });
  } catch (error) {
    const {message, status, error: errorType} = crudApiErrorResponse(error, "signUp");
    throw new ApiError(message, status, errorType);
  }

  const maybeUser = await signIn(registration, config);
  if ("error" in maybeUser) {
    logger.error("[SIGNUP] Error after registration during sign in", {
      message: maybeUser.message,
    });
    throw new Error(maybeUser.message);
  }
  logger.info("[SIGNUP] User signed in after registration", {
    email: registration.email,
  });
  return maybeUser;
}

export async function changeUserPassword(
  config: Config,
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<User | CrudApiError> {
  try {
    const body = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    const url = `/${userId}`;
    const result = await apiClient(true, config) //
      .patch<any, AxiosResponse<User>>(url, body);
    logger.info("[CHANGE_PASSWORD] Password changed successfully", { userId });
    return result.data;
  } catch (error) {
    return crudApiErrorResponse(error, "changeUserPassword");
  }
}
