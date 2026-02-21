import httpClient from "@config/axios.config";
import { slashInterceptor } from "@config/interceptors/slash.interceptor";
import { redirectionInterceptor } from "@config/interceptors/redirect.interceptor";
import {
  anonTokenInterceptor,
  ownTokenInterceptor,
} from "@config/interceptors/auth.interceptor";
import { paginationInterceptor } from "@config/interceptors/pagination.interceptor";
import { getLogger } from "@config/logger.config";
import { headersInterceptor } from "@config/interceptors/headers.interceptor";
import { RequestLogger } from "@config/loggers/request.logger";
import { Token } from "@config/auth.utils";

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
  instance.interceptors.request.use(slashInterceptor);
  instance.interceptors.request.use(redirectionInterceptor);
  instance.interceptors.request.use(
    anon ? anonTokenInterceptor : (c) => ownTokenInterceptor(c, config?.token),
  );
  instance.interceptors.request.use(paginationInterceptor);
  if (config?.headers) {
    instance.interceptors.request.use(headersInterceptor(config.headers));
  }
  return instance;
}

export function graphqlApiClient(config?: Config) {
  const instance = httpClient({
    logger: apiLogger(config),
  });
  if (config?.headers) {
    instance.interceptors.request.use(headersInterceptor(config.headers));
  }

  return instance;
}
