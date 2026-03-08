import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { User } from "@lib/user/models/user.model";
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

export async function fetchUserById(
  id: number,
  config?: Config,
): Promise<Result<User, CrudApiError>> {
  try {
    const res = await apiClient(true, config) //
      .get<any, AxiosResponse<User>>(`${usersUrl}/${id}`);
    return { ok: true, data: res.data };
  } catch (error) {
    logger.error(`Error fetching user with ID ${id}`, {
      status: error instanceof Error ? (error as any).status || 500 : 500,
      message: error instanceof Error ? error.message : "Unknown error",
    }); 
    return { ok: false, error: crudApiErrorResponse(error, "fetchUserById") };
  }
}

export async function updateUser(
  config: Config,
  id: number,
  user: UpdateUser,
): Promise<Result<User, CrudApiError>> {
  try {
    const res = await apiClient(true, config) //
      .patch<any, AxiosResponse<User>>(`${usersUrl}/${id}`, user);
    return { ok: true, data: res.data };
  } catch (error) {
    const errMsg = crudApiErrorResponse(error, "updateUser");
    logger.error("Error updating user", {
      status: errMsg.status,
      message: errMsg.message,
    });
    return { ok: false, error: crudApiErrorResponse(error, "updateUser") };
  }
}
