import { AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { User } from "@lib/user/models/user.model";
import { UpdateUser } from "@lib/user/queries/use-update-customer";
import { getLogger } from "@config/logger.config";
import {
  CrudApiError,
  crudApiErrorResponse,
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
): Promise<User[] | CrudApiError> {
  try {
    const res = await apiClient(true, config) //
      .get<any, AxiosResponse<User[]>>(usersUrl);
    logger.info("Fetched users", { count: res.data.length });
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "fetchAllUser");
  }
}

export async function fetchUserById(
  id: number,
  config: Config,
): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(true, config) //
      .get<any, AxiosResponse<User>>(`${usersUrl}/${id}`);
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "fetchUserById");
  }
}

export async function updateUser(
  config: Config,
  id: number,
  user: UpdateUser,
): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(true, config) //
      .patch<any, AxiosResponse<User>>(`${usersUrl}/${id}`, user);
    return res.data;
  } catch (error) {
    return crudApiErrorResponse(error, "updateUser");
  }
}
