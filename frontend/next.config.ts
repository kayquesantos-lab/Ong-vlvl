import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**' },
      { protocol: 'http', hostname: 'localhost' },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'recharts'],
  },
  // Impede que módulos Node.js sejam bundlados no middleware (Edge Runtime)
  serverExternalPackages: ['axios', 'js-cookie'],
}

export default nextConfig
