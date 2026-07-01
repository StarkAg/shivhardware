/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['home-run.co'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'home-run.co',
        pathname: '/cdn/shop/files/**',
      },
    ],
    // Enable image optimization
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Add remote image domains here if needed
    // Example: ['cdn.example.com', 'images.unsplash.com']
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
  // Keep the earlier static catalogue link working after moving to Blob storage
  async redirects() {
    return [
      {
        source: '/catalogs/c/:slug.html',
        destination: '/catalogs/c/:slug',
        permanent: true,
      },
    ]
  },
  // Exclude scraping folder from compilation
  webpack: (config) => {
    config.watchOptions = {
      ...config.watchOptions,
      ignored: ['**/scraping/**'],
    }
    return config
  },
}

module.exports = nextConfig

