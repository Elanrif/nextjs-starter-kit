import { createSecureHeaders } from "next-secure-headers";
import { NextConfig } from "next";

/** @type {import('next').NextConfig} */
const nextConfig: NextConfig = {
  reactCompiler: true,
  reactStrictMode: true,
  poweredByHeader: false,
  output: "standalone",
  images: {
    qualities: [25, 50, 75],
    dangerouslyAllowLocalIP: true,
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "picsum.photos",
        pathname: "**",
      },
      {
        protocol: "http",
        hostname: "localhost",
        pathname: "**",
      },
    ],
  },
  ...(process.env.NODE_ENV === "production" && {
    typescript: {
      ignoreBuildErrors: true,
    },
  }),

  async redirects() {
    const redirects: {
      source: string;
      destination: string;
      permanent: boolean;
    }[] = [];
    return redirects;
  },

  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          ...createSecureHeaders(),
          // https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Strict-Transport-Security
          {
            key: "X-DNS-Prefetch-Control",
            value: "on",
          },
          {
            key: "Strict-Transport-Security",
            value: "max-age=31536000; includeSubDomains; preload", //
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "X-Frame-Options",
            value: "SAMEORIGIN",
          },
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "Referrer-Policy",
            value: "origin-when-cross-origin",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: process.env.CORS_ALLOWED_ORIGIN!,
          },
          {
            key: "Access-Control-Allow-Credentials",
            value: "true",
          },
          {
            key: "Access-Control-Allow-Methods",
            value: "GET,POST,PUT,PATCH,DELETE,HEAD,OPTIONS",
          },
          {
            key: "Access-Control-Allow-Headers",
            value:
              "Accept,Authorization,Cache-Control,Content-Type,DNT,Expires,If-Modified-Since,Pragma,Range,User-Agent,X-Requested-With",
          },
          {
            key: "Access-Control-Expose-Headers",
            value: "Content-Length,Content-Range",
          },
        ],
      },
      {
        source: "/api/api-auth/:path*",
        headers: [
          {
            // don't cache auth pages
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
      // don't cache routes under `/api-proxy/`
      {
        source: "/api-proxy/:path*",
        headers: [
          {
            key: "Cache-Control",
            value: "no-store, max-age=0",
          },
        ],
      },
    ];
  },

  turbopack: {
    rules: {
      "*.svg": {
        loaders: [
          {
            loader: "@svgr/webpack",
            options: {
              typescript: true,
              icon: true,
            },
          },
        ],
        as: "*.tsx",
      },
    },
  },
};

export default nextConfig;
