import type { ReactNode } from "react"
import type { Metadata, Viewport } from "next"
import "./globals.css"
import AuthWrapper from "@/components/auth-wrapper"

export const metadata: Metadata = {
  metadataBase: new URL('https://link-academy.vercel.app'),
  title: "Intranet de l'agence Link",
  description: "Intranet de l'agence Link",
  openGraph: {
    title: "Intranet de l'agence Link",
    description: "Intranet de l'agence Link",
    siteName: "Intranet de l'agence Link",
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/Logo Link Vertical (Orange).png',
        alt: "Intranet de l'agence Link",
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: "Intranet de l'agence Link",
    description: "Intranet de l'agence Link",
    images: ['/Logo Link Vertical (Orange).png'],
  },
  icons: {
    icon: "/Logo Link Vertical (Orange).png",
    shortcut: "/Logo Link Vertical (Orange).png",
    apple: "/Logo Link Vertical (Orange).png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body>
        {/* Early client-side redirect for Supabase recovery links to preserve hash */}
        <script
          dangerouslySetInnerHTML={{
            __html: `(() => { try { var loc = window.location; var path = loc.pathname; var hash = loc.hash || ''; if (hash && (path === '/' || path === '/login')) { var qs = new URLSearchParams(hash.slice(1)); var hasToken = qs.get('access_token') || qs.get('code'); var type = qs.get('type'); if (hasToken && (type === 'recovery' || !type)) { loc.replace('/reset-password' + hash); } } } catch (_) {} })();`,
          }}
        />
        <AuthWrapper>{children}</AuthWrapper>
      </body>
    </html>
  )
}


