import { InternalAxiosRequestConfig } from "axios";
import environment from "@config/environment.config";

const { http: httpConfig } = environment;

function appendSlash(url: string): string {
  if (url) {
    const slash = "/";
    if (url.includes("?")) {
      const tokens = url.split("?");
      if (!endsWith(tokens[0], slash)) {
        return `${tokens[0]}/?${tokens[1]}`;
      }
    } else if (!endsWith(url, slash)) {
      return url + slash;
    }
  }
  return url;
}

function endsWith(value: string | undefined, end: string): boolean {
  return Boolean(value?.endsWith(end));
}

const isEnabled = () => httpConfig.request.appendSlash;

export function slashInterceptor(
  config: InternalAxiosRequestConfig,
): InternalAxiosRequestConfig {
  const { url } = config;
  if (url && isEnabled()) {
    config.url = appendSlash(url);
  }
  return config;
}
