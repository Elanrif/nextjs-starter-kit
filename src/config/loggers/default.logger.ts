/* eslint-disable no-console */
import environment from "@config/environment.config";

const logConfig = environment.log.client;

const getLogLevelInt = (level: string) => {
  switch (level) {
    case "error": {
      return 2;
    }
    case "warn": {
      return 1;
    }
    case "debug": {
      return -1;
    }
    case "silly": {
      return -2;
    }
    default: {
      return 0;
    }
  }
};

// TODO: Replace with proper logger like Winston or Pino
// eslint-disable-next-line no-undef
export type Logger = Pick<Console, "error" | "warn" | "info" | "debug"> & {
  silly(message?: any, ...params: any[]): void;
};
let logger: Logger;
export const getDefaultLogger = () => {
  if (!logger) {
    logger = {
      error: (message?: any, ...params: any[]) => {
        if (getLogLevelInt(logConfig.level) <= getLogLevelInt("error")) {
          console.error(message, ...params);
        }
      },
      warn: (message?: any, ...params: any[]) => {
        if (getLogLevelInt(logConfig.level) <= getLogLevelInt("warn")) {
          console.warn(message, ...params);
        }
      },
      info: (message?: any, ...params: any[]) => {
        if (getLogLevelInt(logConfig.level) <= getLogLevelInt("info")) {
          console.info(message, ...params);
        }
      },
      debug: (message?: any, ...params: any[]) => {
        if (getLogLevelInt(logConfig.level) <= getLogLevelInt("debug")) {
          console.debug(message, ...params);
        }
      },
      silly: (message?: any, ...params: any[]) => {
        if (getLogLevelInt(logConfig.level) <= getLogLevelInt("silly")) {
          console.debug(message, ...params);
        }
      },
    };
  }
  return logger;
};
