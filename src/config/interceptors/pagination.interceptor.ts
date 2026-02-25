import environment from "@config/environment.config";
import { InternalAxiosRequestConfig } from "axios";

const { api: apiConfig, pagination: paginationConfig } = environment;

const PAGINATED_URLS = [apiConfig.rest.endpoints.products];

const isPaginatedUrl = (candidate: string): boolean => {
  return PAGINATED_URLS.some((url: string) => candidate.startsWith(url));
};

export const paginationInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const { method, url } = config;
  if (method?.toUpperCase() === "GET" && url && isPaginatedUrl(url)) {
    try {
      // Use WHATWG URL to parse and modify query params. If `url` is relative,
      // new URL(url) would throw — however, `isPaginatedUrl` only matches
      // absolute endpoints defined in environment, so this should be safe.
      const _url = new URL(url);
      const params = new URLSearchParams(_url.search);
      if (!params.has("limit")) {
        params.set("limit", String(paginationConfig.limit));
        _url.search = params.toString();
        config.url = _url.toString();
      }
    } catch (error) {
      // If parsing fails for any reason, don't modify the request.
      // Swallow the error to avoid breaking the request flow.

      console.error("paginationInterceptor parse error", error);
    }
  }
  return config;
};
