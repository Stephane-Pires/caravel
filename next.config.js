const { withContentlayer } = require("next-contentlayer2")

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ["next-contentlayer2"],
  experimental: {
    appDir: true,
    typedRoutes: true,
  },
}

module.exports = withContentlayer(nextConfig)
