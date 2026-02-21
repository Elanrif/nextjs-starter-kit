import { AxiosError, AxiosResponse } from "axios";
import { proxyEnvironment } from "@config/proxy-api.config";
import { User, UserUpdate } from "@lib/user/models/user.model";
import { frontendHttp } from "@config/axios/frontend-http.config";

const {
  api: {
    endpoints: { usersUpdate: userUpdateUrl },
  },
} = proxyEnvironment;

export async function updateUser(user: UserUpdate) {
  return await frontendHttp()
    .patch<any, AxiosResponse<User>>(userUpdateUrl, user)
    .then((response) => response.data)
    .catch((error) => {
      const err = error as AxiosError<{ message: string }>;
      return err.response?.data;
    });
}
