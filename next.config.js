/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'gbtsummit2024.com',
      },
    ],
  },
}

module.exports = nextConfig;
