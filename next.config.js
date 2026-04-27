/** @type {import('next').NextConfig} */
const API_BASE = process.env.INSIGHTA_API_BASE || 'https://pep3ec3gaj.us-east-1.awsapprunner.com';

const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${API_BASE}/api/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;
