"server-only";

import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosResponse } from "axios";
import { ResetPassword, User } from "@lib/users/models/user.model";
import { parseResetPassword } from "@lib/users/schemas/user.schema";
import { getLogger } from "@/config/logger.config";
import { Login } from "@lib/auth/models/auth.model";
import {
  ChangePasswordProfileFormData,
  parseChangePasswordProfile,
  parseLogin,
  parseProfileUser,
  parseRegister,
  ProfileUserFormData,
  RegisterFormData,
} from "@lib/auth/schemas/auth.schema";
import { createSession } from "@lib/auth/jose/session.server";
import { validateId } from "@/utils/utils.server";
import { ApiError, badRequestApiError, unauthorizedApiError } from "@/shared/errors/api-error";
import { Result } from "@/shared/models/response.model";
import { ApiErrorResponse } from "@/shared/errors/api-error.server";
import { auth } from "../auth";

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
export async function signIn(login: Login): Promise<Result<User, ApiError>> {
  /**
   * Validate input data
   */
  const validation = parseLogin(login);
  if (!validation.success) {
    logger.warn({ context: "signIn" }, "Validation failed for sign in");
    return {
      ok: false,
      error: badRequestApiError(validation.error.message),
    };
  }

  /**
   * Attempt to sign in via API
   */
  try {
    const { data } = await apiClient(true).post<any, AxiosResponse<User>>(loginUrl, login);
    await createSession({
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      phoneNumber: data.phoneNumber,
      role: data.role,
      avatarUrl: data.avatarUrl,
      isActive: data.isActive,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    });

    const session = await auth();
    logger.info({ session }, "Session created successfully");
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
export async function signUp(registration: RegisterFormData): Promise<Result<User, ApiError>> {
  /**
   * Validate input data
   */
  const validation = parseRegister(registration);
  if (!validation.success) {
    logger.warn({ context: "signUp" }, "Validation failed for sign up");
    return {
      ok: false,
      error: badRequestApiError(validation.error.message),
    };
  }

  /**
   * Attempt to register via API
   */
  try {
    await apiClient(true).post<any, AxiosResponse<any>>(registerUrl, registration);
  } catch (error) {
    logger.error({ email: registration.email }, "Failed to register user");
    return {
      ok: false,
      error: ApiErrorResponse(error, "signUp"),
    };
  }

  const maybeUser = await signIn(registration);
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
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.ok) {
    logger.warn(
      { context: "changeUserPassword" },
      "Unauthorized: only authenticated users can change their password",
    );
    return {
      ok: false,
      error: unauthorizedApiError("You must be logged in to change your password"),
    };
  }
  const config: Config = { access_token: session.data.access_token };

  /**
   * Validate input parameters
   */
  const idError = validateId(userId);
  if (idError) return idError;

  /**
   * Attempt to change password via API
   */
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
export async function resetPassword(data: ResetPassword): Promise<Result<User, ApiError>> {
  /**
   * Validate input data
   */
  const validation = parseResetPassword(data);
  if (!validation.success) {
    logger.warn({ context: "resetPassword" }, "Validation failed for reset password");
    return {
      ok: false,
      error: badRequestApiError(validation.error.message),
    };
  }

  /**
   * Attempt to reset password via API
   */
  try {
    const res = await apiClient(true).patch<any, AxiosResponse<User>>(resetPasswordUrl, data);
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
export async function editProfile(data: ProfileUserFormData): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.ok) {
    logger.warn(
      { context: "editProfile" },
      "Unauthorized: only authenticated users can edit their profile",
    );
    return {
      ok: false,
      error: unauthorizedApiError("You must be logged in to edit your profile"),
    };
  }
  const config: Config = { access_token: session.data.access_token };

  /**
   * Validate input data
   */
  const validation = parseProfileUser(data);
  if (!validation.success) {
    logger.warn({ context: "editProfile" }, "Validation failed for profile update");
    return {
      ok: false,
      error: badRequestApiError(validation.error.message),
    };
  }

  /**
   * Attempt to update profile via API
   */
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
): Promise<Result<User, ApiError>> {
  /**
   * Check user authentication (RBAC)
   */
  const session = await auth();
  if (!session?.ok) {
    logger.warn(
      { context: "changePasswordProfile" },
      "Unauthorized: only authenticated users can change their password",
    );
    return {
      ok: false,
      error: unauthorizedApiError("You must be logged in to change your password"),
    };
  }
  const config: Config = { access_token: session.data.access_token };

  /**
   * Validate input data
   */
  const validation = parseChangePasswordProfile(data);
  if (!validation.success) {
    logger.warn({ context: "changePasswordProfile" }, "Validation failed for password change");
    return {
      ok: false,
      error: badRequestApiError(validation.error.message),
    };
  }

  /**
   * Attempt to change password via API
   */
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
