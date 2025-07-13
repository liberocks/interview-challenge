import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: [
    'localhost',
    '127.0.0.1',
    process.env.NEXT_PUBLIC_API?.replace(/^https?:\/\//, ''),
  ].filter(Boolean) as string[],
  env: {
    NEXT_PUBLIC_API: (process.env.NEXT_PUBLIC_API || 'http://0.0.0.0:8080'),
  },
};

export default nextConfig;
