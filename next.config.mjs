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
  experimental: {
    serverComponentsExternalPackages: ['pptx-automizer'],
    serverActions: {
      bodySizeLimit: '80mb',
    },
  },
  /**
   * En dev, le cache Webpack des bundles serveur peut parfois référencer des chunks
   * supprimés (ex. Cannot find module './9276.js' sur une route API). Désactiver le
   * cache Webpack côté serveur en dev évite cet état incohérent après HMR / redémarrages.
   * @see https://nextjs.org/docs/app/api-reference/config/next-config-js/webpack
   */
  webpack: (config, { dev }) => {
    // Désactiver le cache Webpack en dev (client + serveur) pour éviter ChunkLoadError /
    // chemins _next/undefined après HMR ou gros changements de chunks dynamiques.
    if (dev) {
      config.cache = false
    }
    return config
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
        ],
      },
    ]
  },
  async redirects() {
    return [
      { source: '/pdv', destination: '/mon-espace/social-media', permanent: false },
      { source: '/vente', destination: '/mon-espace/social-media', permanent: true },
      { source: '/pdv2', destination: '/mon-espace/social-media', permanent: true },
      { source: '/vente2', destination: '/mon-espace/social-media', permanent: true },
      { source: '/diffusion/zones', destination: '/strategie/cartographie', permanent: true },
      { source: '/formation', destination: '/academy/diffusion', permanent: true },
      { source: '/formation/:path*', destination: '/academy/:path*', permanent: true },
      { source: '/demandes-potentiels', destination: '/academy/demandes-potentiels', permanent: true },
      { source: '/strategie/social-media', destination: '/strategie/plan-media', permanent: true },
      { source: '/cartographie', destination: '/strategie/cartographie', permanent: true },
      { source: '/studio', destination: '/guides/studio', permanent: true },
      { source: '/media', destination: '/guides/media', permanent: true },
      { source: '/glossaire', destination: '/guides/lexique', permanent: true },
      { source: '/faq', destination: '/guides/faq', permanent: true },
      { source: '/tuto', destination: '/guides/tutos', permanent: true },
      { source: '/diffusion', destination: '/academy/diffusion', permanent: true },
      {
        source: '/calculateur-vente-2/social-media',
        destination: '/mon-espace/social-media',
        permanent: true,
      },
      {
        source: '/calculateur-vente-2/sms-rcs',
        destination: '/mon-espace/sms-rcs',
        permanent: true,
      },
      {
        source: '/calculateur-vente-2/tarifs-studio',
        destination: '/mon-espace/tarifs-studio',
        permanent: true,
      },
      { source: '/mon-espace', destination: '/mon-espace/mes-projets', permanent: false },
      {
        source: '/strategie/pige-commerciale',
        destination: '/mon-espace/pige-commerciale',
        permanent: true,
      },
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
