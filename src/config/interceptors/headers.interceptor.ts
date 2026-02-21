import { InternalAxiosRequestConfig } from "axios";

const DOWNSTREAM_HEADERS = [
  "X-Forwarded-Proto",
  "X-Forwarded-Host",
  "X-Forwarded-For",
  "X-Client-IP",
  "X-Client-IPv6",
  "X-Client-Country",
  "Accept",
  "Content-Type",
  "Authorization",

  "cookie",
  "accept-language",
  "user-agent",
  "X-Request-ID",
];

export const headersInterceptor =
  (headers: Headers) => (config: InternalAxiosRequestConfig) => {
    const items = Object.values(DOWNSTREAM_HEADERS);
    for (const item of items) {
      const value = headers.get(item);
      if (value) {
        config.headers[item] = value;
      }
    }

    return config;
  };
