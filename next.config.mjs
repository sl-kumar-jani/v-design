/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
    domains: ['blob.v0.dev', 'hebbkx1anhila5yf.public.blob.vercel-storage.com']
  },
  // Remove static export for now to fix deployment
  // output: 'export',
  // trailingSlash: true,
}

export default nextConfig
