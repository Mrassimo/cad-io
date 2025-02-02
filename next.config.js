/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  webpack: (config, { isServer }) => {
    // WebAssembly support
    config.experiments = {
      asyncWebAssembly: true,
      layers: true,
      topLevelAwait: true,
    }

    // File loader for OpenCascade.js wasm files
    config.module.rules.push({
      test: /\.wasm$/,
      type: "asset/resource",
      generator: {
        filename: 'static/wasm/[name][ext]'
      }
    })

    // Handle OpenCascade.js fs module
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
        crypto: false,
      }
    }

    return config
  },
  // Allow WASM files
  experimental: {
    urlImports: ['https://unpkg.com/'],
    webAssembly: {
      sync: true,
    },
  },
}

module.exports = nextConfig 