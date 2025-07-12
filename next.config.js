/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Using pages directory for now
  env: {
    NEXT_PUBLIC_APP_NAME: 'FreightFlow',
    NEXT_PUBLIC_APP_DESCRIPTION: 'Manufacturing SMB Freight Optimization Platform',
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
  },
  images: {
    domains: [
      'images.unsplash.com',
      'via.placeholder.com',
    ],
  },
  async redirects() {
    return [
      {
        source: '/shipping-aggregator',
        destination: '/freight-optimization',
        permanent: true,
      },
    ]
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig