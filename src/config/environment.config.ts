const APP_URL = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";
const API_URL = `${process.env.API_URL ?? "http://localhost:8081"}/api/v1`;

const environment = {
  baseUrl: APP_URL,
  apiBaseUrl: `${APP_URL}/api`,
  apiProxyBase: `/api`,
  api: {
    rest: {
      endpoints: {
        comments: `${API_URL}/comments`,
        posts: `${API_URL}/posts`,
        users: `${API_URL}/users`,
        auth: {
          // keycloak endpoints
          login: `${API_URL}/keycloak/login`,
          register: `${API_URL}/keycloak/register`,
          refreshToken: `${API_URL}/keycloak/refresh-token`,
          logout: `${API_URL}/keycloak/logout`,

          // auth endpoints
          editProfile: `${API_URL}/auth/edit-profile`,
          updatePassword: `${API_URL}/auth/change-password-profile`,
          resetPassword: `${API_URL}/auth/reset-password`,
        },
      },
    },
  },
  log: {
    client: {
      level: process.env.NEXT_PUBLIC_LOG_LEVEL || "info",
      // "console" → browser devtools | "none" → silence all (useful in test/CI)
      output: process.env.NEXT_PUBLIC_LOG_OUTPUT || "console",
    },
    server: {
      file: {
        path: process.env.LOG_FILE_PATH,
      },
      level: process.env.LOG_LEVEL || "info",
      output: process.env.LOG_OUTPUT || "console",
    },
  },
} as const;

export default environment;
