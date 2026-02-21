export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }

  get statusCode() {
    return this.status;
  }

  set statusCode(value) {
    this.status = value;
  }
}

export type CrudApiError = {
  statusCode: number;
  message: string;
};
