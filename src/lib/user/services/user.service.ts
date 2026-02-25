import { AxiosError, AxiosResponse } from "axios";
import apiClient, { Config } from "@config/api.config";
import environment from "@config/environment.config";
import { User } from "@lib/user/models/user.model";
import { Page } from "@lib/shared/models/response.model";
import { UpdateUser } from "@lib/user/queries/use-update-customer";
import { getLogger } from "@config/logger.config";
import { ApiError, CrudApiError } from "@/lib/shared/helpers/crud-api-error";

const {
  api: {
    rest: {
      endpoints: { users: usersUrl },
    },
  },
} = environment;
const logger = getLogger("server");

export async function fetchUser(config: Config): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(false, config) //
      .get<any, AxiosResponse<Page<User[]>>>(usersUrl);
    return res.data.results[0];
  } catch (error) {
    const err = error as AxiosError;
    logger.error("Error fetching user", {
      status: err.response?.status,
      message: err.response?.data,
    });
    return {
      statusCode: (error as AxiosError).response?.status || 500,
      message: "Problème d'authentification",
    };
  }
}

export async function updateUser(
  config: Config,
  id: number,
  user: UpdateUser,
): Promise<User | CrudApiError> {
  try {
    const res = await apiClient(false, config) //
      .patch<any, AxiosResponse<User>>(`${usersUrl}/${id}`, user);
    return res.data;
  } catch (error) {
    return {
      statusCode: (error as ApiError).statusCode || 500,
      message: "Erreur du serveur",
    };
  }
}
