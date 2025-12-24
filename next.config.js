/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Для Docker деплоя
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
    ],
  },
};

module.exports = nextConfig;

