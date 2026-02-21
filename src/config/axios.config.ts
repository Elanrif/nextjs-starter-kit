import axios, { AxiosError } from "axios";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { Logger } from "@config/loggers/default.logger";
import {
  requestLoggerInterceptor,
  responseLoggerInterceptor,
} from "@config/interceptors/logger.interceptor";

export { baseRequestConfig } from "@config/axios/base-request.config";
export default function httpClient({ logger }: { logger: Logger }) {
  const instance = axios.create({ ...baseRequestConfig });
  instance.interceptors.request.use(
    requestLoggerInterceptor(logger),
    (error: any) => {
      logger.error("Request error:", { error: error.message });
      return Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    responseLoggerInterceptor(logger),
    (error: AxiosError) => {
      let message: string;
      try {
        message = JSON.stringify(error.response?.data) || "";
      } catch {
        // @ts-expect-error: false positive error, it is always a string
        message = error.response?.data ?? "";
      }
      logger.error("Response error:", { error: error.message, message });
      return Promise.reject(error);
    },
  );
  return instance;
}
