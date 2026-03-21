import { getLogger } from "@/config/logger.config";
import { AxiosError } from "axios";

// NOTE: logger.error writes to console.error on the Node process. Using
// logger.error for non-5xx conditions (auth/validation) will always produce
// noisy server logs in the Node console / hosting platform. Use
// logger.error prudently; prefer logger.warn for client/auth/validation
// failures that shouldn't be treated as internal server errors.
const logger = getLogger("server");

/*
 * ApiError class to represent API errors in a structured way.
 * This can be used to throw and handle errors consistently
 * across your application when making API calls.
 *
 */
export class ApiError extends Error {
  public timestamp: string;
  public error: string;

  constructor(
    message: string,
    public status: number,
    error?: string,
  ) {
    super(message);
    this.name = "ApiError";
    this.timestamp = new Date().toISOString();
    this.error = error || (status === 400 ? "Bad Request" : "Error");
  }

  get statusCode() {
    return this.status;
  }

  set statusCode(value) {
    this.status = value;
  }

  get errorType() {
    return this.error;
  }

  set errorType(value) {
    this.error = value;
  }
}

/*
 * ApiError reponse format from the API SPRING BOOT
 * You can customize this based on your API response structure.
 */
export type CrudApiError = {
  timestamp?: string;
  error: string; // errorType e.g., "Bad Request", "Unauthorized", etc.
  status: number; // HTTP status code
  message: string; // error message from the API
  details?: unknown; // optional validation details (e.g. Zod issues)
};

/**
 * Converts any caught error into a structured CrudApiError.
 * Handles both Axios errors and generic JS errors safely.
 */
export function crudApiErrorResponse(
  error: unknown,
  context?: string,
): CrudApiError {
  // Runtime check: is it really an Axios error?
  if (error instanceof AxiosError) {
    const apiError: CrudApiError = error.response?.data || {
      status: error.response?.status ?? 500,
      message: error.message || "Unknown Axios error",
      error: "Error",
      timestamp: new Date().toISOString(),
    };
    // Log as warn for non-5xx statuses to avoid noisy server errors
    if (apiError.status >= 500) {
      logger.error(
        apiError,
        `Nodejs server [Axios Error] [${context ?? "unknown"}]`,
      );
    } else {
      logger.warn(
        apiError,
        `Nodejs server [Axios Error] [${context ?? "unknown"}]`,
      );
    }
    return apiError;
  }

  const fallbackError: CrudApiError = {
    status: 500,
    message: (error as Error)?.message || "Unknown error",
    error: "Internal Error",
    timestamp: new Date().toISOString(),
  };
  // Non-Axios errors are always unexpected internal failures (status 500) → log as error
  logger.error(
    fallbackError,
    `Nodejs server [HTTP Error] [${context ?? "unknown"}]`,
  );
  return fallbackError;
}

// Generic Result type for API responses, can be used to represent success or error outcomes
export type Result<T, E> = { ok: true; data: T } | { ok: false; error: E };
