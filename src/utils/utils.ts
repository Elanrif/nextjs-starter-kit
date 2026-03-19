import { CrudApiError, Result } from "@/lib/shared/helpers/crud-api-error";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
