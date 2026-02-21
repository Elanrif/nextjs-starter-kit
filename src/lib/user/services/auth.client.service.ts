import { AxiosError, AxiosResponse } from "axios";
import { UserWithToken } from "@lib/user/models/user.model";
import { CrudApiError } from "@lib/shared/helpers/crud-api-error";
import { proxyEnvironment } from "@config/proxy-api.config";
import { ChangePasswordInputType } from "@lib/user/queries/use-change-password";
import { frontendHttp } from "@config/axios/frontend-http.config";

const {
  api: {
    endpoints: {
      passwordChange: passwordChangeUrl,
      passwordReset: resetPasswordUrl,
    },
  },
} = proxyEnvironment;

export async function changeUserPassword({
  oldPassword,
  newPassword,
  confirmPassword,
}: ChangePasswordInputType): Promise<UserWithToken | CrudApiError> {
  try {
    const body = { oldPassword, newPassword, confirmPassword };
    const result = await frontendHttp() //
      .patch<any, AxiosResponse<UserWithToken>>(passwordChangeUrl, body);
    return result.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return {
      statusCode: err.response?.status || 500,
      message:
        err.response?.data.error ||
        "An error occurred while trying to change password",
    };
  }
}

export interface ResetPasswordInputType {
  email: string;
}

export async function resetUserPassword({
  email,
}: ResetPasswordInputType): Promise<boolean | CrudApiError> {
  try {
    const body = { email };
    const result = await frontendHttp() //
      .post<any, AxiosResponse<boolean | CrudApiError>>(resetPasswordUrl, body);
    return result.data;
  } catch (error) {
    const err = error as AxiosError<{ error: string }>;
    return {
      statusCode: err.response?.status || 500,
      message:
        err.response?.data.error ||
        "An error occurred while trying to reset password",
    };
  }
}
