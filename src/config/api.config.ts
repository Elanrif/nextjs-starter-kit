import httpClient from "@config/axios.config";
import { anonTokenInterceptor, ownTokenInterceptor } from "@config/interceptors/auth.interceptor";
import { getLogger } from "@config/logger.config";

const logger = getLogger("server");

export type Config = {
  access_token?: string;
};

export default function apiClient(anon?: boolean, config?: Config) {
  const instance = httpClient({ logger });
  instance.interceptors.request.use(
    anon ? anonTokenInterceptor : (c) => ownTokenInterceptor(c, config?.access_token),
  );
  return instance;
}
