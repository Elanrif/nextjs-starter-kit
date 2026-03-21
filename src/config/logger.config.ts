import type { Level, TransportTargetOptions } from "pino";
import environment from "@config/environment.config";

// ── Public Logger interface ───────────────────────────────────────────────────
// Subset of Pino's Logger that all call sites depend on.
// The `child()` method creates a derived logger that automatically includes
// extra fields (e.g. reqId) in every log entry — use it instead of RequestLogger.

// Preferred call: logger.info({ key: val }, "message") — context first, message second.
// Plain string: logger.info("message") — when there is no context to attach.
export type LogFn = {
  (obj: object, msg?: string): void;
  (msg: string): void;
};

export interface Logger {
  error: LogFn;
  warn: LogFn;
  info: LogFn;
  debug: LogFn;
  child(bindings: Record<string, unknown>): Logger;
}

// ── Browser console fallback ──────────────────────────────────────────────────
// Used when logger.config is imported by a file that is also bundled
// for the browser (e.g. crud-api-error.ts types re-exported to client hooks).
// Pino itself is never loaded in the browser.

// Level hierarchy — same order as Pino.
const LOG_LEVELS = { debug: 0, info: 1, warn: 2, error: 3 } as const;
type ClientLevel = keyof typeof LOG_LEVELS;

// eslint-disable-next-line no-empty-function
function noop(_obj?: unknown, _msg?: string): void {}

function buildConsoleFallback(): Logger {
  const { level, output } = environment.log.client;

  // "none" output → silence everything
  if (!output.includes("console")) {
    return {
      error: noop,
      warn: noop,
      info: noop,
      debug: noop,
      child() {
        return this;
      },
    };
  }

  const minRank = LOG_LEVELS[level as ClientLevel] ?? LOG_LEVELS.info;
  const allow = (lvl: ClientLevel) => LOG_LEVELS[lvl] >= minRank;

  /* eslint-disable no-console */
  return {
    error: allow("error")
      ? (o: any, m?: string) => console.error(m ?? o, m ? o : "")
      : noop,
    warn: allow("warn")
      ? (o: any, m?: string) => console.warn(m ?? o, m ? o : "")
      : noop,
    info: allow("info")
      ? (o: any, m?: string) => console.info(m ?? o, m ? o : "")
      : noop,
    debug: allow("debug")
      ? (o: any, m?: string) => console.debug(m ?? o, m ? o : "")
      : noop,
    child() {
      return this;
    },
  };
  /* eslint-enable no-console */
}

const consoleFallback: Logger = buildConsoleFallback();

// ── Pino server logger (Node only) ───────────────────────────────────────────
let _serverLogger: Logger | undefined;

function buildServerLogger(): Logger {
  // Lazy require keeps Pino out of the browser bundle entirely.
  // next.config.ts lists pino / pino-pretty in serverExternalPackages
  // so webpack never attempts to inline them.
  // eslint-disable-next-line @typescript-eslint/no-require-imports, unicorn/prefer-module
  const pinoModule = require("pino");
  // Handle both ESM default export and direct CJS export
  const pino = (pinoModule.default ?? pinoModule) as {
    (opts: object, transport?: object): Logger;
    transport(opts: object): object;
  };

  const { level, output, file } = environment.log.server;
  const isDev = process.env.NODE_ENV !== "production";

  const targets: TransportTargetOptions[] = [];

  if (output.includes("console")) {
    targets.push(
      isDev
        ? {
            target: "pino-pretty",
            options: {
              colorize: true,
              translateTime: "SYS:standard",
              ignore: "pid,hostname",
            },
            level,
          }
        : { target: "pino/file", options: { destination: 1 }, level }, // stdout JSON in prod
    );
  }

  if (output.includes("file") && file?.path) {
    targets.push({
      target: "pino/file",
      options: { destination: file.path, mkdir: true },
      level,
    });
  }

  if (targets.length === 0) {
    // Fallback: always log to stdout
    targets.push({ target: "pino/file", options: { destination: 1 }, level });
  }

  const transport =
    targets.length > 1
      ? pino.transport({ targets })
      : pino.transport(targets[0]);

  return pino({ level: level as Level }, transport) as unknown as Logger;
}

// ── Public factory ────────────────────────────────────────────────────────────
// type="server"  → Pino on Node, throws if called in browser (hard boundary)
// type="client"  → consoleFallback always (safe for Client Components)
// type="default" → auto-detect: Pino on Node, consoleFallback in browser
export function getLogger(
  type: "client" | "server" | "default" = "default",
): Logger {
  if (typeof window !== "undefined") {
    // Hard guard: calling getLogger("server") inside a Client Component is a bug.
    if (type === "server") {
      throw new Error(
        '[logger] getLogger("server") was called in a browser context. ' +
          'Use getLogger("client") or getLogger() in Client Components.',
      );
    }
    return consoleFallback;
  }
  return (_serverLogger ??= buildServerLogger());
}
