import pino from "pino";

/**
 * Logger configuration using pino (used by next-logger)
 *
 * Usage:
 *   import logger from "@/lib/logger";
 *   logger.info("Message");
 *   logger.error({ err }, "Error message");
 *   logger.warn("Warning message");
 *   logger.debug({ data }, "Debug info");
 */

const isDev = process.env.NODE_ENV === "development";

const logger = pino({
  level: isDev ? "debug" : "info",
  transport: isDev
    ? {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      }
    : undefined,
  base: {
    env: process.env.NODE_ENV,
  },
});

export default logger;

/**
 * Create a child logger with a specific context
 * @param context - The context name (e.g., "UserService", "AuthService")
 */
export const createLogger = (context: string) => {
  return logger.child({ context });
};
