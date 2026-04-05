export const baseRequestConfig = {
  baseURL: "",
  timeout: 60_000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json; charset=utf-8",
  },
} as const;
