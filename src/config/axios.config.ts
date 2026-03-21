import axios, { AxiosError } from "axios";
import { baseRequestConfig } from "@config/axios/base-request.config";
import { Logger } from "@config/logger.config";
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
      logger.error({ error: error.message }, "Outgoing request failed");
      return Promise.reject(error);
    },
  );
  instance.interceptors.response.use(
    responseLoggerInterceptor(logger),
    (error: AxiosError) => {
      let message: string;
      try {
        /**
         * Intetionally strigify the error response data to ensure it's always a string.
         * This is because error.response.data can be of various types (object, string, etc.)
         * depending on the API and error. Stringifying it ensures we can log it consistently.
         */
        message = JSON.stringify(error.response?.data) || "";
      } catch {
        // @ts-expect-error: false positive error, it is always a string
        message = error.response?.data ?? "";
      }
      logger.error({ error: error.message, message }, "Upstream API error");
      return Promise.reject(error);
    },
  );
  return instance;
}
