/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
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

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   /* config options here */

//   reactStrictMode: true,
//   compress: true,
//   swcMinify: true,
//  images: {
//     domains: [
//       'res.cloudinary.com',
//       'images.unsplash.com',
//       'via.placeholder.com',
//       'localhost',
//       '127.0.0.1',
//     ],
//     formats: ['image/avif', 'image/webp'],
//     remotePatterns: [
//       {
//         protocol: 'https',
//         hostname: '**.cloudinary.com',
//       },
//       {
//         protocol: 'https',
//         hostname: '**.unsplash.com',
//       },
//       {
//         protocol: 'https',
//         hostname: '**.googleapis.com',
//       },
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//       },
//       {
//         protocol: 'http',
//         hostname: '127.0.0.1',
//       },
//     ],
//     formats: ['image/avif', 'image/webp'],
//     deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
//     imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  
//   },
//   experimental: {
//     optimizePackageImports: ['@react-three/fiber', 'three', 'framer-motion'],
//   },
//   webpack: (config, { isServer }) => {
//     if (!isServer) {
//       config.optimization.splitChunks.cacheGroups = {
//         ...config.optimization.splitChunks.cacheGroups,
//         three: {
//           test: /[\\\\/]node_modules[\\\\/]three[\\\\/]/,
//           name: 'three',
//           priority: 30,
//           reuseExistingChunk: true,
//           enforce: true,
//         },
//       };
//     }

//     return config;
//   },
// };

// export default nextConfig;

