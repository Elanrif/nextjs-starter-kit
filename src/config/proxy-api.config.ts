import environment from "@config/environment.config";

const { baseUrl, apiBaseUrl, apiProxyBase } = environment;

export const protectedPaths = {
  // Basket
  cart: `/cart`,

  // checkout
  checkout: `/checkout`,
  order: `/order`,
};

export const proxyEnvironment = {
  baseUrl,
  apiBaseUrl,
  apiProxyBase,
  api: {
    endpoints: {
      ...protectedPaths,
      categories: `/categories`,

      products: `/products`,
      productById: `/products/:id`,
      login: `/auth/login`,
      signOut: `/auth/logout`,
      session: `/auth/session`,
      register: `/auth/register`,
      passwordChange: `/auth/password-change`,
      usersUpdate: `/users/update`,
      users: `/users`,
      userById: `/users/:id`,
    },
  },
};
