import httpClient, { baseRequestConfig } from "@config/axios.config";
import environment from "@config/environment.config";
import moment from "moment";
//import { slashInterceptor } from "@config/interceptors/slash.interceptor";
//import { ApiError } from "@lib/shared/helpers/CrudApiError";
import { getLogger } from "./logger.config";
import { Token } from "@config/auth.utils";
import { ApiError } from "@/lib/shared/helpers/crud-api-error";

const logger = getLogger();

export enum TokenScope {
  READ = "read",
  WRITE = "write",
  READ_WRITE = "read write",
}

const { auth: authConfig, format: formatConfig } = environment;

const authRequestConfig = {
  ...baseRequestConfig,
  headers: {
    ...baseRequestConfig.headers,
    "Content-Type": "application/x-www-form-urlencoded",
  },
} as const;

const authClient = () => {
  const instance = httpClient({
    logger,
  });
  //instance.interceptors.request.use(slashInterceptor);
  return instance;
};

const decorateToken = (token: any, owned: boolean) => {
  const now = moment();
  const expiry = now
    .add(token.expires_in, "seconds")
    .format(formatConfig.dateTime);
  return {
    ...token,
    expiry,
    owned,
  };
};

//---------- Own Token ----------//

export const newOwnToken = async (
  username: string,
  password: string,
  scope: string = TokenScope.READ,
): Promise<Token> => {
  const _username = encodeURIComponent(username);
  const _password = encodeURIComponent(password);
  const options = {
    ...authRequestConfig,
    auth: {
      username: authConfig.keys.owner.clientID,
      password: authConfig.keys.owner.clientSecret,
    },
  };

  const requestBody = `grant_type=password&username=${_username}&password=${_password}&scope=${scope}`;
  const authUrl = authConfig.endpoints.token;
  const { status, data } = await authClient() //
    .post(authUrl, requestBody, options);

  if (status === 200) {
    return decorateToken(data, true);
  }

  throw new ApiError("Not Authenticated", 401);
};

export const verifyOwnToken = async (accessToken: string): Promise<boolean> => {
  try {
    const { data } = await authClient().post(
      authConfig.endpoints.introspect,
      `token=${accessToken}`,
      {
        ...authRequestConfig,
        auth: {
          username: authConfig.keys.owner.clientID,
          password: authConfig.keys.owner.clientSecret,
        },
      },
    );
    return data?.active === true;
  } catch {
    return false;
  }
};

export async function refreshOwnToken(refreshToken: string): Promise<Token> {
  const { status, data } = await authClient() //
    .post(
      authConfig.endpoints.token,
      `grant_type=refresh_token&refresh_token=${refreshToken}`,
      {
        ...authRequestConfig,
        auth: {
          username: authConfig.keys.owner.clientID,
          password: authConfig.keys.owner.clientSecret,
        },
      },
    );
  if (status !== 200) {
    throw new ApiError("Not Authenticated", 401);
  }
  return decorateToken(data, true);
}
