"server-only";

import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosResponse } from "axios";
import { parseResetPassword, ResetPassword, User } from "@lib/users/models/user.model";
import { getLogger } from "@/config/logger.config";
import {
  ChangePasswordProfileFormData,
  Login,
  parseChangePasswordProfile,
  parseLogin,
  parseProfileUser,
  parseRegister,
  ProfileUserFormData,
  RegisterFormData,
} from "@lib/auth/models/auth.model";
import { createSession } from "@lib/auth/jose";
import { validateId, validationError } from "@/utils/utils.server";
import { ApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: {
        auth: { editProfile: editProfileUrl, changeProfilePasswordUrl: changeProfilePasswordUrl },
        register: registerUrl,
        login: loginUrl,
        resetPassword: resetPasswordUrl,
      },
    },
  },
} = environment;
const logger = getLogger("server");

/**
 * Sign in a user with email and password
 */
export async function signIn(login: Login, config?: Config): Promise<Result<User, ApiError>> {
  const validation = parseLogin(login);
  if (!validation.success) return validationError(validation.error.issues, "Invalid login data");

  try {
    const { data } = await apiClient(true, config).post<any, AxiosResponse<User>>(loginUrl, login);
    await createSession({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      avatarUrl: data.avatarUrl ?? null,
      isActive: data.isActive,
    });
    logger.info({ email: data.email }, "User signed in successfully");
    return { ok: true, data };
  } catch (error) {
    logger.error({ email: login.email }, "Failed to sign in");
    return {
      ok: false,
      error: ApiErrorResponse(error, "signIn"),
    };
  }
}

/**
 * Register a new user with email and password
 */
export async function signUp(
  registration: RegisterFormData,
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseRegister(registration);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid registration data");

  try {
    await apiClient(true, config).post<any, AxiosResponse<any>>(registerUrl, registration);
  } catch (error) {
    logger.error({ email: registration.email }, "Failed to register user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "signUp"),
    };
  }

  const maybeUser = await signIn(registration, config);
  if (!maybeUser.ok) {
    logger.error(
      {
        email: registration.email,
        detail: maybeUser.error.detail,
      },
      "Error after registration during sign in",
    );
    throw new Error(maybeUser.error.detail);
  }
  return maybeUser;
}

export async function changeUserPassword(
  config: Config,
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<Result<User, ApiError>> {
  const idError = validateId(userId);
  if (idError) return idError;

  try {
    const body = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    const url = `/${userId}`;
    const result = await apiClient(true, config) //
      .patch<any, AxiosResponse<User>>(url, body);
    logger.info({ userId }, "changeUserPassword");
    return { ok: true, data: result.data };
  } catch (error: any) {
    logger.error(
      {
        userId,
        err: error.response?.data ?? error,
      },
      "Error during changeUserPassword",
    );
    return {
      ok: false,
      error: ApiErrorResponse(error, "changeUserPassword"),
    };
  }
}

/**
 * Change password for a user
 */
export async function resetPassword(
  data: ResetPassword,
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseResetPassword(data);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid reset password data");

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      resetPasswordUrl,
      data,
    );
    logger.info({ id: res.data.id }, "Password reset successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to reset password");
    return {
      ok: false,
      error: ApiErrorResponse(error, "resetPassword"),
    };
  }
}

/**
 * Edit user profile
 */
export async function editProfile(
  data: ProfileUserFormData,
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseProfileUser(data);
  if (!validation.success) return validationError(validation.error.issues, "Invalid profile data");

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(editProfileUrl, data);
    logger.info({ id: res.data.id }, "Profile updated successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to update profile");
    return {
      ok: false,
      error: ApiErrorResponse(error, "editProfile"),
    };
  }
}

/**
 * Change user profile password
 */
export async function changePasswordProfile(
  data: ChangePasswordProfileFormData,
  config?: Config,
): Promise<Result<User, ApiError>> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) return validationError(validation.error.issues, "Invalid password data");

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      changeProfilePasswordUrl,
      data,
    );
    logger.info({ id: res.data.id }, "Profile updated successfully");
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error({ err: error.response?.data ?? error }, "Failed to update profile");
    return {
      ok: false,
      error: ApiErrorResponse(error, "changeProfilePassword"),
    };
  }
}
