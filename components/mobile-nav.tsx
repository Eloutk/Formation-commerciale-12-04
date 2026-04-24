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
          <Button variant="ghost" size="icon" className="-ml-2 h-10 w-10 touch-manipulation">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[min(100vw-1rem,320px)] border-r border-border/80 pr-2">
          <SheetClose className="absolute right-4 top-4 rounded-md p-2 hover:bg-accent">
            <X className="h-5 w-5" />
            <span className="sr-only">Fermer le menu</span>
          </SheetClose>
          <div className="py-6 pr-2">
            <Link
              href="/home"
              className="mb-6 flex items-center gap-2 rounded-lg px-2 py-2 text-base font-semibold hover:bg-accent/70"
              onClick={handleNav}
            >
              Link academy
            </Link>
            <nav className="flex flex-col gap-1">
              <div className="space-y-2 pb-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Ressources</p>
                <div className="flex flex-col gap-0.5 border-l-2 border-[#E94C16]/35 pl-3">
                  <Link
                    href="/diffusion"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    Diffusion
                  </Link>
                  <Link
                    href="/chefferie"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    Chefferie de projet
                  </Link>
                  <Link
                    href="/studio"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    Studio
                  </Link>
                  <Link
                    href="/cartographie"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    Cartographie
                  </Link>
                </div>
              </div>
              <div className="space-y-2 pb-2">
                <p className="px-2 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Aide</p>
                <div className="flex flex-col gap-0.5 border-l-2 border-[#E94C16]/35 pl-3">
                  <Link
                    href="/documents"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    Document
                  </Link>
                  <Link
                    href="/glossaire"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    Glossaire
                  </Link>
                  <Link
                    href="/faq"
                    className="rounded-md px-2 py-2.5 text-sm text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                    onClick={handleNav}
                  >
                    FAQ
                  </Link>
                </div>
              </div>
              <Link
                href="/vente"
                className="mt-1 rounded-md px-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                onClick={handleNav}
              >
                Vente
              </Link>
              {isAdmin && (
                <Link
                  href="/calculateur-vente-2"
                  className="rounded-md px-2 py-2.5 text-sm text-orange-600 transition-colors hover:bg-orange-50 active:bg-orange-100 dark:hover:bg-orange-950/40"
                  onClick={handleNav}
                >
                  Vente 2
                </Link>
              )}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="rounded-md px-2 py-2.5 text-sm text-orange-600 transition-colors hover:bg-orange-50 active:bg-orange-100 dark:hover:bg-orange-950/40"
                  onClick={handleNav}
                >
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

