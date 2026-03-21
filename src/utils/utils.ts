import { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { NextRequest } from "next/server";
import type { ZodError } from "zod";
import { getLogger } from "@/config/logger.config";

const logger = getLogger("server");

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Returns the request ID from the `x-request-id` header, or generates a new one. */
export function ensureRequestID(req: NextRequest): string {
  return req.headers.get("x-request-id") ?? crypto.randomUUID();
}

export function validateId(id: number): Result<never, CrudApiError> | null {
  if (!Number.isInteger(id) || id <= 0) {
    return {
      ok: false,
      error: {
        status: 400,
        message: "Invalid user ID",
        error: "Bad Request",
      },
    };
  }
  return null;
}

/**
 * Returns a structured 400 validation error from Zod issues.
 * Use `message` to identify the entity (e.g. "Invalid user data", "Invalid product data").
 */
export function validationError(
  issues: ZodError["issues"],
  message: string,
): Result<never, CrudApiError> {
  logger.warn({ errors: issues }, message);
  return {
    ok: false,
    error: { status: 400, message, error: "Bad Request", details: issues },
  };
}
