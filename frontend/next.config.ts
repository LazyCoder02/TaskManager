/** @type {import('next').NextConfig} */
import config from "@/contexts/config"

const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: true,
  async rewrites() {
    const apiUrl =
      config.hostUrl;
    return [
      {
        source: "/api/:path*",
        destination: `${apiUrl}/:path*`, // Proxy to Backend
      },
    ];
  },
};

module.exports = nextConfig;
