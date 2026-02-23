const XXX_BASEURL = process.env.XXX_BASEURL ?? "http://localhost:8081";
const BASE_URL = process.env.NEXT_PUBLIC_WEBSITE_URL ?? "http://localhost:3000";
const HOST_NAME = process.env.NEXT_PUBLIC_ROOT_DOMAIN ?? "localhost";
const XXX_BASE_V1 = `${XXX_BASEURL}/api/v1`;

const environment = {
  name: process.env.ENV,
  baseUrl: BASE_URL,
  rootDomain: HOST_NAME,
  apiBaseUrl: `${BASE_URL}/api-proxy`,
  apiProxyBase: `/api-proxy`,
  baApiBaseUrl: XXX_BASEURL,
  defaultCurrency: process.env.NEXT_PUBLIC_DEFAULT_CURRENCY || "EUR",
  api: {
    graphql: {
      endpoint: `${XXX_BASEURL}/graphql`,
    },
    rest: {
      endpoints: {
        // market
        basket: `${XXX_BASE_V1}/basket`,
        baskets: `${XXX_BASE_V1}/baskets`,
        categories: `${XXX_BASE_V1}/categories`,
        orders: `${XXX_BASE_V1}/orders`,
        checkout: `${XXX_BASE_V1}/checkout`,
        products: `${XXX_BASE_V1}/products`,
        productAttributes: `${XXX_BASE_V1}/productattributes`,

        // client/location/address
        beneficiaries: `${XXX_BASE_V1}/beneficiaries`,
        countries: `${XXX_BASE_V1}/countries`,
        regions: `${XXX_BASE_V1}/regions`,
        options: `${XXX_BASE_V1}/options`,
        forms: `${XXX_BASE_V1}/forms`,

        contact: `${XXX_BASE_V1}/contact`,
        contacts: `${XXX_BASE_V1}/contacts`,

        // Telecom
        telecomProducts: `${XXX_BASE_V1}/telecom/products`,
        telecomForfaitContract: `${XXX_BASE_V1}/telecom/contract`,

        territories: `${XXX_BASE_V1}/territories`,

        // search
        search: `${XXX_BASE_V1}/products/search`,

        // user AND password
        auth: `${XXX_BASE_V1}/auth`,
        users: `${XXX_BASE_V1}/users`,
        useraddresses: `${XXX_BASE_V1}/useraddresses`,
        userstats: `${XXX_BASE_V1}/userstats`,
        passwordChange: `${XXX_BASE_V1}/password-change`,
        passwordReset: `${XXX_BASE_V1}/password-reset`,
        emailVerification: `${XXX_BASE_V1}/email-verification`,
        register: `${XXX_BASE_V1}/register`,
      },
    },
  },

  auth: {
    endpoints: {
      token: `${XXX_BASEURL}/auth/v1/token`,
      introspect: `${XXX_BASEURL}/auth/v1/introspect`,
    },
    keys: {
      anonymous: {
        clientID: process.env.AUTH_KEYS_ANON_CLIENT_ID!,
        clientSecret: process.env.AUTH_KEYS_ANON_CLIENT_SECRET!,
      },
      owner: {
        clientID: process.env.AUTH_KEYS_OWN_CLIENT_ID!,
        clientSecret: process.env.AUTH_KEYS_OWN_CLIENT_SECRET!,
      },
    },
    strapi: {
      token: process.env.STRAPI_AUTH_TOKEN || "",
    },
  },
  format: {
    dateTime: process.env.FORMAT_DATETIME_ISO || "YYYY-MM-DDThh:mm:ss",
  },
  http: {
    request: {
      appendSlash: parseBoolean(process.env.HTTP_REQUEST_APPEND_SLASH, true),
      timeout:
        // @ts-expect-error: value is not null or undefined
        Number.parseInt(process.env.HTTP_REQUEST_TIMEOUT_MILLISECONDS) ||
        60_000,
    },
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
  pagination: {
    // @ts-expect-error: value is not null or undefined
    limit: Number.parseInt(process.env.PAGINATION_LIMIT) || 20,
    scroll: {
      // @ts-expect-error: value is not null or undefined
      threshold: Number.parseInt(process.env.PAGINATION_SCROLL_THRESHOLD) || 10,
    },
  },
} as const;

export function isProd() {
  return environment.name === "prod";
}

export function shouldUseHttps() {
  return isProd() || environment.baseUrl.startsWith("https:");
}

function parseBoolean(
  value: string | undefined,
  dft: boolean = false,
): boolean {
  return value ? value.trim().toLocaleLowerCase() === "true" : dft;
}

export default environment;
