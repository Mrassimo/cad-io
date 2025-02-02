/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // WebAssembly support
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
    }

    if (!isServer) {
      // Client-side configuration
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }

      // Handle WASM files
      config.module.rules.push({
        test: /\.wasm$/,
        type: 'asset/resource',
        generator: {
          filename: 'static/wasm/[name][ext]',
        },
      })
    }

    return config
  },
  // Configure asset prefix for WASM files
  assetPrefix: process.env.NODE_ENV === 'production' ? undefined : '',
  // Configure headers for WASM files
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
        ],
      },
    ]
  },
}

module.exports = nextConfig 