import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { AxiosResponse } from "axios";
import { ResetPassword, User } from "@lib/user/models/user.model";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";
import { getLogger } from "@/config/logger.config";
import { Login, Registrer } from "./models/auth.model";
import { createSession } from "./session";

// ============================================================================
// Auth API Service (Server-side)
// ============================================================================

/**
 * Use this service in:
 * - Server Components
 * - Route Handlers (API routes)
 * - Server Actions
 */

// API endpoints from environment config
const {
  api: {
    rest: {
      endpoints: { register: registerUrl, login: loginUrl, users: usersUrl },
    },
  },
} = environment;
const logger = getLogger("server");

// ============================================================================
// Auth CRUD
// ============================================================================

/**
 * Sign in a user with email and password
 */
export async function signIn(
  login: Login,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!login?.email || !login?.password) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Email and password are required",
        error: "Bad Request",
      },
    };
  }

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
  registration: Registrer,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!registration?.email || !registration?.password) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Email and password are required",
        error: "Bad Request",
      },
    };
  }

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
  } catch (error) {
    logger.error("Error during changeUserPassword", { userId, error });
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
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!data?.email || !data?.newPassword || !data?.resetToken || !data?.code) {
    return {
      ok: false,
      error: {
        status: 400,
        message:
          "Fields `email`, `newPassword`, `resetToken`, and `code` are required",
        error: "Bad Request",
      },
    };
  }

  try {
    const res = await apiClient(true, config).post<any, AxiosResponse<User>>(
      usersUrl,
      data,
    );
    logger.info("User created successfully", { id: res.data.id });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to create user", { email: data.email });
    return { ok: false, error: crudApiErrorResponse(error, "createUser") };
  }
}
