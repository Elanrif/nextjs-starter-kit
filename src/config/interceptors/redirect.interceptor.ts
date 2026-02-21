import environment from "@config/environment.config";
import { InternalAxiosRequestConfig } from "axios";

const { api: apiConfig } = environment;

const REDIRECTED_URLS = [apiConfig.rest.endpoints.checkout];

const isRedirectedUrl = (candidate: string): boolean => {
  return REDIRECTED_URLS.some((url: string) => candidate.startsWith(url));
};

export const redirectionInterceptor = async (
  config: InternalAxiosRequestConfig,
) => {
  const { url } = config;
  if (url && isRedirectedUrl(url)) {
    config.maxRedirects = 0;
  }
  return config;
};
