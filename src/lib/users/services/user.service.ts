"server-only";

import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import {
  parseUserCreate,
  parseUserUpdate,
  User,
  UserUpdateFormData,
} from "@lib/users/models/user.model";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
  Result,
  validationError,
} from "@/lib/shared/helpers/crud-api-error";
import { validateId } from "@/utils/utils";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = environment;

const logger = getLogger("server");

export async function fetchAllUsers(
  config: Config,
): Promise<Result<User[], CrudApiError>> {
  try {
    const res = await apiClient(true, config).get<User[]>(usersUrl);
    logger.info("Fetched users", { count: res.data.length });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Error fetching users", { context: "fetchAllUsers" });
    return { ok: false, error: crudApiErrorResponse(error, "fetchAllUsers") };
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
  const parse = parseUserCreate(user);
  if (!parse.success)
    return validationError(parse.error.issues, "Invalid user data");

  try {
    const res = await apiClient(true, config).post<User>(usersUrl, parse.data);
    logger.info("User created successfully", { id: res.data.id });
    return { ok: true, data: res.data };
  } catch (error) {
    // ✅ Email supprimé des logs (RGPD — PII)
    logger.error("Failed to create user", { context: "createUser" });
    return { ok: false, error: crudApiErrorResponse(error, "createUser") };
  }
}

export async function fetchUserById(
  id: number,
  config: Config, // ✅ Config requis (cohérence avec les autres fonctions)
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  const idError = validateId(id);
  if (idError) return idError;

  try {
    const res = await apiClient(true, config).get<User>(`${usersUrl}/${id}`);
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to fetch user", { id });
    return { ok: false, error: crudApiErrorResponse(error, "fetchUserById") };
  }
}

export async function updateUser(
  id: number,
  user: UserUpdateFormData,
  config: Config,
): Promise<Result<User, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  // ✅ Validation centralisée
  const idError = validateId(id);
  if (idError) return idError;

  const parse = parseUserUpdate(user);
  if (!parse.success)
    return validationError(parse.error.issues, "Invalid user data");

  try {
    const res = await apiClient(true, config).patch<User>(
      `${usersUrl}/${id}`,
      parse.data,
    );
    logger.info("User updated successfully", { id });
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error("Failed to update user", { id });
    return { ok: false, error: crudApiErrorResponse(error, "updateUser") };
  }
}

/**
 * Delete a user
 */
export async function deleteUser(
  id: number,
  config: Config,
): Promise<Result<{ success: boolean }, CrudApiError>> {
  /**
   * ⚠️ Never trust the client input
   * ❌ Someone can bypass the form
   * ✅ Protection against malicious bugs
   */
  const idError = validateId(id);
  if (idError) return idError;

  try {
    await apiClient(true, config).delete(`${usersUrl}/${id}`);
    logger.info("User deleted successfully", { id });
    return { ok: true, data: { success: true } };
  } catch (error) {
    logger.error("Failed to delete user", { id });
    return { ok: false, error: crudApiErrorResponse(error, "deleteUser") };
  }
}
