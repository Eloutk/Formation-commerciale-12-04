import type React from "react"
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body className={inter.className}>
        <AuthWrapper>
          {children}
        </AuthWrapper>
      </body>
    </html>
  )
}
