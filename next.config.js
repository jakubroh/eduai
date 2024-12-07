const MonacoWebpackPlugin = require('monaco-editor-webpack-plugin');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: ['localhost'],
  },
  webpack: (config, { isServer, dev }) => {
    if (!isServer) {
      config.plugins.push(
        new MonacoWebpackPlugin({
          languages: ['javascript', 'typescript', 'python', 'java', 'cpp', 'csharp'],
          filename: 'static/[name].worker.js',
          publicPath: '_next',
        })
      );
    }

    if (!dev && !isServer) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          ...config.optimization.splitChunks,
          chunks: 'all',
          minSize: 20000,
          maxSize: 244000,
        },
      };
    }

    return config;
  },
  experimental: {
    optimizePackageImports: ['monaco-editor'],
  },
  output: 'standalone',
}

module.exports = nextConfig 