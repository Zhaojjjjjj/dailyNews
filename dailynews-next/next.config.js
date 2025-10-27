/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // 为 Vercel 优化
  output: 'standalone',
  // 允许使用 node-fetch
  experimental: {
    serverComponentsExternalPackages: ['jsdom', 'node-fetch']
  }
}

module.exports = nextConfig

