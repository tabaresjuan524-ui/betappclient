/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  env: {
    NEXT_PUBLIC_USE_MOCK_API: process.env.USE_MOCK_API,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'juandata.github.io',
        pathname: '/publicAssets/images/**',
      },
    ],
  },

};

export default nextConfig;