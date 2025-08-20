import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/components/auth-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Formation Commerciale Interactive",
  description: "Plateforme de formation commerciale pour améliorer vos compétences",
  generator: "v0.dev",
  icons: {
    icon: "/images/logo-link.png",
    shortcut: "/images/logo-link.png",
    apple: "/images/logo-link.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID // ex: G-XXXXXXX

  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        {gaId && (
          <>
            {/* Charge gtag.js le plus tôt possible pour qu’il apparaisse aussi dans le code source */}
            <Script
              id="ga4-src"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="beforeInteractive"
            />
            <Script id="ga4-init" strategy="beforeInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());

                // Consent par défaut (adapte si besoin)
                gtag('consent', 'default', {
                  ad_storage: 'granted',
                  analytics_storage: 'granted',
                  functionality_storage: 'granted',
                  personalization_storage: 'granted',
                  security_storage: 'granted'
                });

                // Config de base
                gtag('config', '${gaId}', {
                  anonymize_ip: true
                });
              `}
            </Script>
          </>
        )}
      </head>
      <body className={inter.className} suppressHydrationWarning>


        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <footer className="py-6 border-t">
                <div className="container mx-auto px-4 text-center text-muted-foreground">
                  © {new Date().getFullYear()} Formation Commerciale Link Academy<br />
                  Tous droits réservés à l'agence Link
                </div>
              </footer>
            </div>
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
