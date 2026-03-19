"server-only";

import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosResponse } from "axios";
import {
  parseResetPassword,
  ResetPassword,
  User,
} from "@lib/users/models/user.model";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
  validationError,
} from "@/lib/shared/helpers/crud-api-error";
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
import { validateId } from "@/utils/utils";

/**
 * ⚠️ Never trust the client input
 * ❌ Someone can bypass the form
 * ✅ Protection against malicious bugs
 */
const {
  api: {
    rest: {
      endpoints: {
        auth: {
          editProfile: editProfileUrl,
          changeProfilePasswordUrl: changeProfilePasswordUrl,
        },
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
export async function signIn(
  login: Login,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  const validation = parseLogin(login);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid login data");

  try {
    const { data } = await apiClient(true, config).post<
      any,
      AxiosResponse<User>
    >(loginUrl, login);
    await createSession(data.id, data.email, data.role);
    logger.info("User signed in successfully", { email: data.email });
    return { ok: true, data };
  } catch (error) {
    logger.error("Failed to sign in", { email: login.email });
    return { ok: false, error: crudApiErrorResponse(error, "signIn") };
  }
}

/**
 * Register a new user with email and password
 */
export async function signUp(
  registration: RegisterFormData,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  const validation = parseRegister(registration);
  if (!validation.success)
    return validationError(
      validation.error.issues,
      "Invalid registration data",
    );

  try {
    await apiClient(true, config).post<any, AxiosResponse<any>>(
      registerUrl,
      registration,
    );
  } catch (error) {
    logger.error("Failed to register user", { email: registration.email });
    return { ok: false, error: crudApiErrorResponse(error, "signUp") };
  }

  const maybeUser = await signIn(registration, config);
  if (!maybeUser.ok) {
    logger.error("Error after registration during sign in", {
      email: registration.email,
      message: maybeUser.error.message,
    });
    throw new Error(maybeUser.error.message);
  }
  return maybeUser;
}

export async function changeUserPassword(
  config: Config,
  userId: number,
  oldPassword: string,
  newPassword: string,
): Promise<Result<User, CrudApiError>> {
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
    logger.info("changeUserPassword", { userId });
    return { ok: true, data: result.data };
  } catch (error: any) {
    logger.error("Error during changeUserPassword", {
      userId,
      message: error.response?.data || error,
    });
    return {
      ok: false,
      error: crudApiErrorResponse(error, "changeUserPassword"),
    };
  }
}

/**
 * Change password for a user
 */
export async function resetPassword(
  data: ResetPassword,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  const validation = parseResetPassword(data);
  if (!validation.success)
    return validationError(
      validation.error.issues,
      "Invalid reset password data",
    );

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      resetPasswordUrl,
      data,
    );
    logger.info("Password reset successfully", { id: res.data.id });
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error("Failed to reset password", error.response?.data || error);
    return { ok: false, error: crudApiErrorResponse(error, "resetPassword") };
  }
}

/**
 * Edit user profile
 */
export async function editProfile(
  data: ProfileUserFormData,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  const validation = parseProfileUser(data);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid profile data");

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      editProfileUrl,
      data,
    );
    logger.info("Profile updated successfully", { id: res.data.id });
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error("Failed to update profile", error.response?.data || error);
    return { ok: false, error: crudApiErrorResponse(error, "editProfile") };
  }
}

/**
 * Change user profile password
 */
export async function changePasswordProfile(
  data: ChangePasswordProfileFormData,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  const validation = parseChangePasswordProfile(data);
  if (!validation.success)
    return validationError(validation.error.issues, "Invalid password data");

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      changeProfilePasswordUrl,
      data,
    );
    logger.info("Profile updated successfully", { id: res.data.id });
    return { ok: true, data: res.data };
  } catch (error: any) {
    logger.error("Failed to update profile", error.response?.data || error);
    return {
      ok: false,
      error: crudApiErrorResponse(error, "changeProfilePassword"),
    };
  }
}
