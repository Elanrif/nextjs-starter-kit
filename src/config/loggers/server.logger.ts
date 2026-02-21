/* eslint-disable no-console */
import environment from "@config/environment.config";

// NOTE: winston (and Node's fs) must not be imported at module level because
// this file may be referenced from code that is bundled for the browser.
// We'll dynamically import winston asynchronously inside getServerLogger which is only called on the server.

let logger: any;
export const getServerLogger = () => {
  if (typeof window !== "undefined") {
    // Called on client - return a console-based logger to avoid errors
    return {
      error: console.error.bind(console),
      warn: console.warn.bind(console),
      info: console.info.bind(console),
      debug: console.debug.bind(console),
      silly: console.debug.bind(console),
    } as any;
  }

  if (logger) return logger;

  // Proxy logger: while the real winston logger is being loaded asynchronously,
  // use console methods. Once winston is imported and the real logger constructed,
  // we replace `logger` with the real instance.
  logger = {
    error: (...args: any[]) => console.error(...args),
    warn: (...args: any[]) => console.warn(...args),
    info: (...args: any[]) => console.info(...args),
    debug: (...args: any[]) => console.debug(...args),
    silly: (...args: any[]) => console.debug(...args),
  } as any;

  // Asynchronously import winston and build the real logger. We intentionally
  // don't await here to keep getServerLogger synchronous for callers.
  (async () => {
    try {
      const mod = await import("winston");
      const winston = (mod && (mod as any).default) || mod;

      const logConfig = environment.log.server;

      const getLogFormat = () => {
        switch (logConfig.format) {
          case "json": {
            return winston.format.json();
          }
          default: {
            return winston.format.simple();
          }
        }
      };

      const getLogTransports = () => {
        return logConfig.output.split(",").map((output: string) => {
          switch (output) {
            case "file": {
              return new winston.transports.File({
                filename: logConfig.file.path,
              });
            }
            default: {
              return new winston.transports.Console();
            }
          }
        });
      };

      const shouldColorize =
        logConfig.format === "simple" || logConfig.output === "console";

      const realLogger = winston.createLogger({
        level: logConfig.level,
        transports: getLogTransports(),
        format: winston.format.combine(
          winston.format.splat(),
          ...(shouldColorize ? [] : [winston.format.colorize({ all: true })]),
          winston.format.timestamp(),
          getLogFormat(),
        ),
      });

      // Replace proxy with the real logger instance
      logger = realLogger as any;
    } catch (error) {
      // If import fails for any reason, keep using the console proxy.
      // We deliberately swallow errors here to avoid crashing server startup.
      // Optionally, you can log the error using console.error(error).
      console.error("Failed to load winston logger:", error);
    }
  })();

  return logger;
};
