"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

type MobileNavUser = {
  name?: string
  email?: string
} | null

export function MobileNav({
  user,
  isAdmin,
  onLogout,
}: {
  user?: MobileNavUser
  isAdmin?: boolean
  onLogout?: () => void | Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const handleNav = () => setOpen(false)

  return (
    <div className="flex lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[280px] sm:w-[320px]">
          <SheetClose className="absolute top-4 right-4">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
          <div className="py-6">
            <Link href="/home" className="flex items-center gap-2 font-semibold mb-4" onClick={handleNav}>
              Link academy
            </Link>
            <nav className="flex flex-col space-y-3">
              <Link href="/home" className="text-sm hover:underline" onClick={handleNav}>
                Home
              </Link>
              <Link href="/diffusion" className="text-sm hover:underline" onClick={handleNav}>
                Diffusion
              </Link>
              <Link href="/chefferie" className="text-sm hover:underline" onClick={handleNav}>
                Chefferie de projet
              </Link>
              <Link href="/studio" className="text-sm hover:underline" onClick={handleNav}>
                Studio
              </Link>
              <Link href="/pdv" className="text-sm hover:underline" onClick={handleNav}>
                PDV
              </Link>
              <Link href="/documents" className="text-sm hover:underline" onClick={handleNav}>
                Document
              </Link>
              <Link href="/glossaire" className="text-sm hover:underline" onClick={handleNav}>
                Glossaire
              </Link>
              <Link href="/faq" className="text-sm hover:underline" onClick={handleNav}>
                FAQ
              </Link>
              {isAdmin && (
                <Link href="/admin" className="text-sm hover:underline text-orange-600" onClick={handleNav}>
                  Admin
                </Link>
              )}
              <div className="pt-4 mt-4 border-t">
                {user ? (
                  <div className="space-y-2">
                    <div className="text-xs text-muted-foreground truncate">
                      {user.name?.trim() ? user.name : (user.email || '').split('@')[0]}
                    </div>
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700"
                      onClick={async () => {
                        handleNav()
                        await onLogout?.()
                      }}
                    >
                      Se déconnecter
                    </Button>
                  </div>
                ) : (
                  <Button asChild className="w-full" onClick={handleNav}>
                    <Link href="/login">Connexion</Link>
                  </Button>
                )}
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

