import environment from "@config/environment.config";
import { InternalAxiosRequestConfig } from "axios";
import { isTokenExpired, Token } from "@config/auth.utils";
import { getLogger } from "@config/logger.config";
import { ApiError_ } from "@/shared/errors/api-error";

const { api: apiConfig } = environment;
const logger = getLogger();
const SAFE_URLS = [apiConfig.endpoints.auth.register, apiConfig.endpoints.auth.login];

const isSafeUrl = (candidate: string): boolean => {
  return SAFE_URLS.some((url: string) => candidate.startsWith(url));
};

export const anonTokenInterceptor = async (config: InternalAxiosRequestConfig) => {
  const { url } = config;
  if (url && isSafeUrl(url)) {
    logger.info({ url }, "Request to safe URL, skipping token interceptor");
  }
  return config;
};

export const ownTokenInterceptor = async (config: InternalAxiosRequestConfig, token?: Token) => {
  const { headers } = config;
  if (token && isTokenExpired(token.expiry) && token.refresh_token) {
    // token = await refreshOwnToken(token.refresh_token);
    logger.info({ expiry: token.expiry }, "Token expired, skipping refresh");
  }
  if (token) {
    headers["Authorization"] = `Bearer ${token.access_token}`;
  } else {
    throw new ApiError_("Not Authenticated", 401);
  }
  return config;
};
