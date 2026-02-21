import apiClient, { Config } from "@config/api.config";
import { newOwnToken, TokenScope } from "@config/auth.config";
import { Registration } from "@lib/user/models/auth.model";
import environment from "@config/environment.config";
import { AxiosError, AxiosResponse } from "axios";
import { fetchUser } from "@lib/user/services/user.service";
import { UserWithToken } from "@lib/user/models/user.model";
import { ApiError, CrudApiError } from "@/lib/shared/helpers/crud-api-error";

const {
  api: {
    rest: {
      endpoints: {
        register: registerUrl,
        passwordChange: passwordChangeUrl,
        passwordReset: passwordResetUrl,
        emailVerification: emailVerificationUrl,
      },
    },
  },
} = environment;

export async function signIn(
  email: string,
  password: string,
): Promise<UserWithToken | CrudApiError> {
  try {
    const token = await newOwnToken(email, password, TokenScope.READ_WRITE);
    const userWithoutToken = await fetchUser({ token });
    if ("statusCode" in userWithoutToken) {
      return getCrudAPiError(userWithoutToken);
    }
    return { ...userWithoutToken, token } satisfies UserWithToken;
  } catch {
    return {
      statusCode: 500,
      message: "An error occurred while trying to sign in",
    };
  }
}

export async function signUp(
  registration: Registration,
): Promise<UserWithToken> {
  // Better-auth will catch raised exception as login/signup error message for the client
  try {
    // try to register the user
    await apiClient(true) //
      .post<any, AxiosResponse<any>>(registerUrl, registration);
  } catch (error_) {
    const error = error_ as AxiosError<{ non_field_errors?: string[] }>;
    if (!error.response?.data.non_field_errors?.length) {
      error.message = "An error occurred while trying to sign up";
      throw error;
    }
    let message = error.response.data.non_field_errors[0];
    if (message === "['Ce mot de passe est trop courant.']") {
      throw new ApiError("forms:text-auth-password-vulnerable", 400);
    }
    if (message === "A user with this email already exists") {
      throw new ApiError("forms:text-auth-email-already-used", 400);
    }
    message = "forms:text-auth-registration-failed";
    throw new ApiError(message, 400);
  }

  // if registration is successful, sign in
  const maybeUser = await signIn(registration.email, registration.password1);
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
  confirmPassword: string,
): Promise<UserWithToken | CrudApiError> {
  try {
    const body = {
      old_password: oldPassword,
      new_password: newPassword,
      confirm_password: confirmPassword,
    };
    const url = `${passwordChangeUrl}/${userId}`;
    const result = await apiClient(false, config) //
      .patch<any, AxiosResponse<UserWithToken>>(url, body);
    const userWithToken = result.data;
    userWithToken.token = config.token!;
    return userWithToken;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    const errorMsg = err.response?.data?.error || "Could not update password";
    return { statusCode: 400, message: errorMsg } as CrudApiError;
  }
}

export async function resetUserPassword(
  config: Config,
  email: string,
): Promise<boolean | CrudApiError> {
  try {
    const body = {
      email,
    };
    const result = await apiClient(true, config) //
      .post<any, AxiosResponse<string>>(passwordResetUrl, body);
    const status = result.status;
    return status === 200;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    const errorMsg = err.response?.data?.error || "Could not reset password";
    return { statusCode: 400, message: errorMsg } as CrudApiError;
  }
}

export async function sendVerificationEmail(
  email: string,
  config: Config,
): Promise<boolean | CrudApiError> {
  try {
    const result = await apiClient(false, config) //
      .post<any, AxiosResponse<string>>(emailVerificationUrl, { email });
    const status = result.status;
    return status === 200;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    const errorMsg =
      err.response?.data?.error || "Could not send verification email";
    return { statusCode: 400, message: errorMsg } as CrudApiError;
  }
}
