import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { ResetPassword, User } from "@lib/user/models/user.model";
import { UpdateUser } from "@lib/user/queries/use-update-customer";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
} from "@/lib/shared/helpers/crud-api-error";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = environment;
const logger = getLogger("server");

export async function fetchAllUser(
  config: Config,
): Promise<Result<User[], CrudApiError>> {
  try {
    const res = await apiClient(true, config) //
      .get<any, AxiosResponse<User[]>>(usersUrl);
    logger.info("Fetched users", { count: res.data.length });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Error fetching users", error);
    return { ok: false, error: crudApiErrorResponse(error, "fetchAllUser") };
  }
}

/**
 * Create a new user
 */
export async function createUser(
  config: Config,
  user: Omit<User, "id">,
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (
    !user?.firstName ||
    !user?.lastName ||
    !user?.email ||
    !user?.phoneNumber
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message:
          "Fields `firstName`, `lastName`, `email`, and `phoneNumber` are required",
        error: "Bad Request",
      },
    };
  }

  try {
    const res = await apiClient(true, config).post<any, AxiosResponse<User>>(
      usersUrl,
      user,
    );
    logger.info("User created successfully", { id: res.data.id });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to create user", { email: user.email });
    return { ok: false, error: crudApiErrorResponse(error, "createUser") };
  }
}

export async function fetchUserById(
  id: number,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Invalid user ID",
        error: "Bad Request",
      },
    };
  }

  try {
    const res = await apiClient(true, config).get<any, AxiosResponse<User>>(
      `${usersUrl}/${id}`,
    );
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to fetch user", { id });
    return { ok: false, error: crudApiErrorResponse(error, "fetchUserById") };
  }
}

export async function updateUser(
  config: Config,
  id: number,
  user: UpdateUser,
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Invalid user ID",
        error: "Bad Request",
      },
    };
  }

  if (
    !user?.firstName ||
    !user?.lastName ||
    !user?.email ||
    !user?.phoneNumber
  ) {
    return {
      ok: false,
      error: {
        status: 400,
        message:
          "Fields `firstName`, `lastName`, `email`, and `phoneNumber` are required",
        error: "Bad Request",
      },
    };
  }

  try {
    const res = await apiClient(true, config).patch<any, AxiosResponse<User>>(
      `${usersUrl}/${id}`,
      user,
    );
    logger.info("User updated successfully", { id });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to update user", { id });
    return { ok: false, error: crudApiErrorResponse(error, "updateUser") };
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
  if (!data?.email || !data?.oldPassword || !data?.newPassword) {
    return {
      ok: false,
      error: {
        status: 400,
        message:
          "Fields `email`, `oldPassword`, and `newPassword` are required",
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

/**
 * Delete a user
 */
export async function deleteUser(
  id: number,
  config?: Config,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  if (!id || id <= 0) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Invalid user ID",
        error: "Bad Request",
      },
    };
  }

  try {
    await apiClient(true, config).delete(`${usersUrl}/${id}`);
    logger.info("User deleted successfully", { id });
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error("Failed to delete user", { id });
    return { ok: false, error: crudApiErrorResponse(error, "deleteUser") };
  }
}
