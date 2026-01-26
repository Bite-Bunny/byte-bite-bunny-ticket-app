import type { NextConfig } from 'next'
import createNextIntlPlugin from 'next-intl/plugin'

const withNextIntl = createNextIntlPlugin('./src/core/i18n/i18n.ts')

const nextConfig: NextConfig = {
  env: {
    API_URL: process.env.NEXT_PUBLIC_API_URL,
    MOCK_INIT_AUTH: process.env.NEXT_PUBLIC_MOCK_INIT_AUTH,
    QUERY_STALE_TIME_IN_MINUTES:
      process.env.NEXT_PUBLIC_QUERY_STALE_TIME_IN_MINUTES,
  },
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
  },

  // Optimize production builds
  productionBrowserSourceMaps: false,

  // Experimental features for better performance
  experimental: {
    optimizePackageImports: [
      '@react-three/fiber',
      '@react-three/drei',
      'framer-motion',
      'lucide-react',
      '@tanstack/react-query',
    ],
  },

  // Compiler options to reduce legacy JavaScript
  compiler: {
    // Remove console.log in production
    removeConsole:
      process.env.NODE_ENV === 'production'
        ? {
            exclude: ['error', 'warn'],
          }
        : false,
  },

  // Webpack optimizations
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      // Optimize bundle splitting
      config.optimization = {
        ...config.optimization,
        moduleIds: 'deterministic',
        runtimeChunk: 'single',
        splitChunks: {
          chunks: 'all',
          maxInitialRequests: 25,
          minSize: 20000,
          cacheGroups: {
            // Separate vendor chunks
            vendor: {
              test: /[\\/]node_modules[\\/]/,
              name: 'vendors',
              priority: 10,
              reuseExistingChunk: true,
              minChunks: 1,
            },
            // Separate three.js and related 3D libraries (large)
            three: {
              test: /[\\/]node_modules[\\/](three|@react-three)[\\/]/,
              name: 'three',
              priority: 20,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate framer-motion (large)
            framerMotion: {
              test: /[\\/]node_modules[\\/]framer-motion[\\/]/,
              name: 'framer-motion',
              priority: 20,
              reuseExistingChunk: true,
              enforce: true,
            },
            // Separate axios
            axios: {
              test: /[\\/]node_modules[\\/]axios[\\/]/,
              name: 'axios',
              priority: 15,
              reuseExistingChunk: true,
            },
            // Common chunks
            common: {
              minChunks: 2,
              priority: 5,
              reuseExistingChunk: true,
            },
          },
        },
      }
    }
    return config
  },

  // Headers for caching
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
      {
        source: '/models/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/:all*(svg|jpg|jpeg|png|gif|ico|webp|avif)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ]
  },
}

export default withNextIntl(nextConfig)
