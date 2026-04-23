let userConfig = undefined
try {
  userConfig = await import('./v0-user-next.config')
} catch (e) {
  // ignore error
}

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async redirects() {
    return [
      // /vente = calculateur historique ; /calculateur-vente-2 = version complète (admin)
      { source: '/pdv', destination: '/vente', permanent: false },
      { source: '/pdv2', destination: '/calculateur-vente-2', permanent: true },
      { source: '/vente2', destination: '/calculateur-vente-2', permanent: true },
    ]
  },
  images: {
    domains: [
      'hebbkxlanhila5yf.public.blob.vercel-storage.com',
      'hebbkx1anhila5yf.public.blob.vercel-storage.com',
    ],
    remotePatterns: [
      { protocol: 'https', hostname: 'hebbkxlanhila5yf.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'hebbkx1anhila5yf.public.blob.vercel-storage.com' },
      { protocol: 'https', hostname: 'vercel-storage.com' },
    ],
  },
}

mergeConfig(nextConfig, userConfig)

function mergeConfig(nextConfig, userConfig) {
  if (!userConfig) {
    return
  }

  for (const key in userConfig) {
    if (
      typeof nextConfig[key] === 'object' &&
      !Array.isArray(nextConfig[key])
    ) {
      nextConfig[key] = {
        ...nextConfig[key],
        ...userConfig[key],
      }
    } else {
      nextConfig[key] = userConfig[key]
    }
  }
}

export default nextConfig
