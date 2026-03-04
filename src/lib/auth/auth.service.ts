import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@lib/user/models/user.model";
import {
  ApiError,
  CrudApiError,
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
 * Create a new product
 */
export async function signIn(
  login: Login,
  config?: Config,
): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(true, config).post<
      Login,
      AxiosResponse<User>
    >(loginUrl, login);
    logger.info("User signed in", { email: res.data.email });
    return res.data;
  } catch (error) {
    const err = error as AxiosError<CrudApiError>;
    const errMessage = {
      status: err.response?.status || 500,
      message: err.message || "Unknown error",
      error: "Error",
      timestamp: new Date().toISOString(),
    };

    const errorMsg = err.response?.data || errMessage;

    logger.error("Error signing in user", errorMsg);
    // Normalize the error to a CrudApiError format
    return err.response?.data || errMessage;
  }
}

export async function signUp(
  registration: Registrer,
  config?: Config,
): Promise<User | CrudApiError> {
  try {
    // try to register the user
    await apiClient(true, config).post<any, AxiosResponse<any>>(
      registerUrl,
      registration,
    );
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error signing up user", {
      status: err.response?.status,
      message: err.response?.data,
    });
    const errorMessage =
      typeof err.response?.data === "string"
        ? err.response.data
        : "Registration failed";
    throw new ApiError(errorMessage, 400);
  }

  // if registration is successful, sign in
  const maybeUser = await signIn(registration, config);
  if ("status" in maybeUser) {
    throw new Error(maybeUser.message);
  }
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
    return result.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    const errorMsg = err.response?.data?.error || "Could not update password";
    return { status: 400, message: errorMsg } as CrudApiError;
  }
}
