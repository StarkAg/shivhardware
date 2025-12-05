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
    // Add remote image domains here if needed
    // Example: ['cdn.example.com', 'images.unsplash.com']
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
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

