import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  watchOptions: {
    pollIntervalMs: 1000, // Adjust the polling interval as needed
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ["images.unsplash.com"],
  },
};

export default nextConfig;
