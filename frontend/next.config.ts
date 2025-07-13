import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: ['localhost', '127.0.0.1'],
  env: {
    API: process.env.API || 'http://0.0.0.0:8080',
  },
};

export default nextConfig;
