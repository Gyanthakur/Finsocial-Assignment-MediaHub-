/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  // images: {
  //   domains: ['res.cloudinary.com'],
  //   formats: ['image/webp', 'image/avif'],
  // },
  // compress: true,
  // swcMinify: true,
  // reactStrictMode: true,
  // experimental: {
  //   optimizePackageImports: ['@react-three/fiber', 'three'],
  // },

  //  images: {
  //   domains: [
  //     'res.cloudinary.com',
  //     'images.unsplash.com',
  //     'via.placeholder.com'
  //   ],
  //   formats: ['image/webp', 'image/avif'],
  //   deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  //   imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  // },
  // compress: true,
  // swcMinify: true,
  // reactStrictMode: true,
  // experimental: {
  //   optimizePackageImports: ['@react-three/fiber', 'three', 'framer-motion'],
  // },
  // headers: async () => {
  //   return [
  //     {
  //       source: '/api/:path*',
  //       headers: [
  //         { key: 'Cache-Control', value: 'public, max-age=3600' },
  //         { key: 'X-Content-Type-Options', value: 'nosniff' },
  //         { key: 'X-Frame-Options', value: 'DENY' }
  //       ],
  //     },
  //   ];
  // },
 images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'via.placeholder.com',
      'localhost',
      '127.0.0.1',
    ],
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },
};

export default nextConfig;

