import type { ReactNode } from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import AuthWrapper from "@/components/auth-wrapper"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Formation Commerciale Interactive",
  description: "Plateforme de formation commerciale pour améliorer vos compétences",
  generator: "v0.dev",
  icons: {
    icon: "/Logo Link Vertical (Orange).png",
    shortcut: "/Logo Link Vertical (Orange).png",
    apple: "/Logo Link Vertical (Orange).png",
  },
}

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
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


