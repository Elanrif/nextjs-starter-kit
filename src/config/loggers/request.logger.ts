import { ensureRequestID } from "@utils/utils";
import { NextRequest } from "next/server";
import { Logger } from "@config/loggers/default.logger";

export class RequestLogger implements Logger {
  private readonly reqId: string;

  constructor(
    private readonly logger: Logger,
    reqOrId: NextRequest | string,
  ) {
    this.reqId =
      typeof reqOrId === "string" ? reqOrId : ensureRequestID(reqOrId);
  }

  error(message?: any, ...params: any[]) {
    this.logger.error(`[${this.reqId}] ${message}`, ...params);
  }

  warn(message?: any, ...params: any[]) {
    this.logger.warn(`[${this.reqId}] ${message}`, ...params);
  }

  info(message?: any, ...params: any[]) {
    this.logger.info(`[${this.reqId}] ${message}`, ...params);
  }

  debug(message?: any, ...params: any[]) {
    this.logger.debug(`[${this.reqId}] ${message}`, ...params);
  }

  silly(message?: any, ...params: any[]) {
    this.logger.silly(`[${this.reqId}] ${message}`, ...params);
  }
}
