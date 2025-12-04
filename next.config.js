/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [],
    // Add remote image domains here if needed
    // Example: ['cdn.example.com', 'images.unsplash.com']
  },
  // Optimize for production
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig

