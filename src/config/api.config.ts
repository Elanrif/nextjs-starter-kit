import httpClient from "@config/axios.config";
import {
  anonTokenInterceptor,
  ownTokenInterceptor,
} from "@config/interceptors/auth.interceptor";
import { getLogger } from "@config/logger.config";
import { RequestLogger } from "@config/loggers/request.logger";
import { Token } from "./auth.utils";

const logger = getLogger("server");

export type Config = {
  token?: Token;
  headers?: Headers;
};

const apiLogger = (config?: Config) => {
  if (config?.headers) {
    const headers = new Headers(config.headers);
    const reqId = headers.get("X-Request-ID");
    if (reqId) {
      return new RequestLogger(logger, reqId);
    }
  }
  return logger;
};

export default function apiClient(anon?: boolean, config?: Config) {
  const instance = httpClient({
    logger: apiLogger(config),
  });
  instance.interceptors.request.use(
    anon ? anonTokenInterceptor : (c) => ownTokenInterceptor(c, config?.token),
  );
  return instance;
}
