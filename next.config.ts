import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/education",
        destination: "/education/index.html",
      },
      {
        source: "/restaurant",
        destination: "/restaurant/index.html",
      },
      {
        source: "/construction",
        destination: "/construction/index.html",
      },
      {
        source: "/auto-service",
        destination: "/auto-service/index.html",
      },
      {
        source: "/dental-clinic",
        destination: "/dental-clinic/index.html",
      },
    ];
  },
};

export default nextConfig;
