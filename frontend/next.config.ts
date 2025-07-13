import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  output: 'standalone',
  
  allowedDevOrigins: ['0.0.0.0', 'localhost'],

  
};

export default nextConfig;
