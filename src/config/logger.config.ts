import { getDefaultLogger, Logger } from "./loggers/default.logger";

let serverLogger: Logger | undefined;

export const getLogger = (
  type: "client" | "server" | "default" = "default",
): Logger => {
  if (type === "server") {
    // If on the client, fall back to the default (console) logger
    if (typeof window !== "undefined") {
      return getDefaultLogger();
    }

    // If we've already resolved a server logger, return it
    if (serverLogger) return serverLogger;

    // Create a proxy logger that delegates to the default logger initially
    const proxy = getDefaultLogger();
    serverLogger = proxy;

    // Asynchronously import the real server logger and replace the proxy when ready.
    // Use a computed path string to avoid some bundlers from statically analyzing the import.
    (async () => {
      try {
        const mod = await import(`./loggers/server.logger`);
        const { getServerLogger } = mod as any;
        serverLogger = getServerLogger();
      } catch (error) {
        // Keep using the proxy (default logger) if import fails.
        // Intentionally swallow to avoid crashing server startup.
        console.error("Failed to dynamically import server logger:", error);
      }
    })();

    return proxy;
  }
  return getDefaultLogger();
};
