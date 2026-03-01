const XXX_BASEURL = process.env.XXX_BASEURL ?? "http://localhost:8081";
const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";
const HOST_NAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost";
const XXX_BASE_V1 = `${XXX_BASEURL}/api/v1`;

const environment = {
  name: process.env.ENV,
  baseUrl: BASE_URL,
  rootDomain: HOST_NAME,
  apiBaseUrl: `${BASE_URL}/api`,
  apiProxyBase: `/api`,
  baApiBaseUrl: XXX_BASEURL,
  api: {
    rest: {
      endpoints: {
        categories: `${XXX_BASE_V1}/categories`,
        products: `${XXX_BASE_V1}/products`,

        // Managed user endpoints
        auth: `${XXX_BASE_V1}/auth`,
        users: `${XXX_BASE_V1}/users`,
        login: `${XXX_BASE_V1}/login`,
        register: `${XXX_BASE_V1}/register`,
      },
    },
  },

  auth: {
    endpoints: {
      token: `${XXX_BASEURL}/auth/v1/token`,
      introspect: `${XXX_BASEURL}/auth/v1/introspect`,
    },
  },
  format: {
    dateTime: process.env.FORMAT_DATETIME_ISO || "YYYY-MM-DDThh:mm:ss",
  },
  log: {
    client: {
      format: process.env.NEXT_PUBLIC_LOG_FORMAT || "simple",
      level:
        process.env.NEXT_PUBLIC_LOG_LEVEL || process.env.LOG_LEVEL || "info",
      output: process.env.NEXT_PUBLIC_LOG_OUTPUT || "console",
    },
    server: {
      file: {
        path: process.env.LOG_FILE_PATH,
      },
      format: process.env.LOG_FORMAT || "simple",
      level: process.env.LOG_LEVEL || "info",
      output: process.env.LOG_OUTPUT || "console",
    },
  },
} as const;

function parseBoolean(
  value: string | undefined,
  dft: boolean = false,
): boolean {
  return value ? value.trim().toLocaleLowerCase() === "true" : dft;
}

export default environment;
