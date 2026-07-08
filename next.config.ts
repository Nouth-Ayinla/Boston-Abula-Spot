import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Let Next.js know that the static assets like dishes can be optimized
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
