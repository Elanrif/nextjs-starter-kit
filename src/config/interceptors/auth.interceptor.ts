import environment from "@config/environment.config";
import { InternalAxiosRequestConfig } from "axios";
import { Token } from "@config/auth.utils";
import { ApiError } from "@/lib/shared/helpers/crud-api-error";
import { getLogger } from "@config/logger.config";

const { api: apiConfig, auth: authConfig } = environment;
const logger = getLogger();
const SAFE_URLS = [apiConfig.rest.endpoints.register, apiConfig.rest.endpoints.login];

const isSafeUrl = (candidate: string): boolean => {
  return SAFE_URLS.some((url: string) => candidate.startsWith(url));
};

export const anonTokenInterceptor = async (config: InternalAxiosRequestConfig) => {
  const { url } = config;
  if (url && isSafeUrl(url)) {
    logger.info(`Request to safe URL ${url}, skipping token interceptor`);
  }
  return config;
};

export const ownTokenInterceptor = async (config: InternalAxiosRequestConfig, token?: Token) => {
  const { headers } = config;
  if (token) {
    headers["Authorization"] = `Bearer ${token.accessToken}`;
  } else {
    throw new ApiError("Not Authenticated", 401);
  }
  return config;
};
