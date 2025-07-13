import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['0.0.0.0', '0.0.0.0'],
  env: {
    API: 'http://0.0.0.0:8080',
  },
};

export default nextConfig;
