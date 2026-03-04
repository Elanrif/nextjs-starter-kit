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

/* ApiError reponse format from the API SPRING BOOT
 * You can customize this based on your API response structure.
 */
export type CrudApiError = {
  timestamp?: string;
  error?: string; // errorType e.g., "Bad Request", "Unauthorized", etc.
  status: number; // HTTP status code
  message: string;
};
