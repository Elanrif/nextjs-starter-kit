import environment from "@config/environment.config";

const { baseUrl, apiBaseUrl, apiProxyBase } = environment;

export const protectedPaths = {
  // Basket
  cart: `/cart`,
  addToCart: `/cart/add`,

  // checkout
  checkout: `/checkout`,
  order: `/order`,
  users: `/users`,
  usersUpdate: `/users/update`,

  //passwords
  passwordReset: `/password-reset`,
  passwordChange: `/password-change`,
};

export const proxyEnvironment = {
  baseUrl,
  apiBaseUrl,
  apiProxyBase,
  api: {
    endpoints: {
      ...protectedPaths,

      categories: `/categories`,
      categoriesPromoted: `/categories/promoted`,

      // invoices
      invoices: "/invoices",

      products: `/products`,
      productById: `/products/:id`,
      register: `/register`,

      //   search
      search: `/search`,

      services: {
        // custom proxy endpoints
        checkout: "/services/checkout",
        beneficiaries: "/services/beneficiaries",
      },
    },
  },
};
