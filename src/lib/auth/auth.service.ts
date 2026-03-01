import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosError, AxiosResponse } from "axios";
import { User } from "@lib/user/models/user.model";
import { ApiError, CrudApiError } from "@/lib/shared/helpers/crud-api-error";
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
      unknown,
      AxiosResponse<User>
    >(loginUrl, login);
    logger.info("User signed in", { email: res.data.email });
    return res.data;
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error signing in user", {
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: err.response?.status || 500,
      message: "Failed to sign in user",
    };
  }
}

export async function signUp(
  registration: Registrer,
  config?: Config,
): Promise<User> {
  try {
    // try to register the user
    await apiClient(true, config).post<any, AxiosResponse<any>>(
      registerUrl,
      registration,
    );
  } catch (error_) {
    const error = error_ as AxiosError;
    const errorMessage =
      typeof error.response?.data === "string"
        ? error.response.data
        : "Registration failed";
    throw new ApiError(errorMessage, 400);
  }

  // if registration is successful, sign in
  const maybeUser = await signIn(registration, config);
  if ("statusCode" in maybeUser) {
    throw new Error(maybeUser.message);
  }
  return maybeUser;
}

function getCrudAPiError(error: CrudApiError | ApiError) {
  return {
    statusCode: error.statusCode,
    message: error.message,
  };
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
    return { statusCode: 400, message: errorMsg } as CrudApiError;
  }
}
