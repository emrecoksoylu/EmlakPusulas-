import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.sahibinden.com',
      },
      {
        protocol: 'https',
        hostname: '**.shbdn.com',
      },
      {
        protocol: 'https',
        hostname: '**.hepsiemlak.com',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
