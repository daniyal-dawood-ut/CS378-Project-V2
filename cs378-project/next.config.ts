import type { NextConfig } from "next";

// const isProd = process.env.NODE_ENV === "production";
const nextConfig: NextConfig = {
  /* config options here */
  output: 'export',
  // basePath: "/cs378-project",
  // assetPrefix: "/cs378-project/",
  images: { unoptimized: true }
};

export default nextConfig;
