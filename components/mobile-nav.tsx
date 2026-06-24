"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { MobileNavMenu } from "@/components/nav/mobile-nav-menu"
import { AdminNavTab } from "@/components/nav/admin-nav-tab"
import {
  AIDE_LINKS,
  RESSOURCES_LINKS,
  STRATEGIE_LINKS,
  VENTE2_LINKS,
  MON_ESPACE_HREF,
  IA_HREF,
  filterNavItemsByAdmin,
  filterVente2LinksByRole,
  canShowVente2Nav,
  isAidePath,
  isIaPath,
  isMonEspacePath,
  isRessourcesPath,
  isStrategiePath,
  isVente2Path,
  withActiveItems,
} from "@/lib/nav-config"
import type { UserRole } from "@/lib/roles"

type MobileNavUser = {
  name?: string
  email?: string
} | null

export function MobileNav({
  user,
  isAdmin,
  role = null,
  onLogout,
}: {
  user?: MobileNavUser
  isAdmin?: boolean
  role?: UserRole | null
  onLogout?: () => void | Promise<void>
}) {
  const [open, setOpen] = React.useState(false)
  const pathname = usePathname()
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
              <MobileNavMenu
                label="Ressources"
                active={isRessourcesPath(pathname)}
                items={withActiveItems(pathname, filterNavItemsByAdmin(RESSOURCES_LINKS, !!isAdmin))}
                onNavigate={handleNav}
              />
              <MobileNavMenu
                label="Aide"
                active={isAidePath(pathname)}
                items={withActiveItems(pathname, filterNavItemsByAdmin(AIDE_LINKS, !!isAdmin))}
                onNavigate={handleNav}
              />
              <Link
                href="/vente"
                className="mt-1 rounded-md px-2 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-accent/80 active:bg-accent"
                onClick={handleNav}
              >
                Vente
              </Link>
              {canShowVente2Nav(role, !!isAdmin) && (
                <MobileNavMenu
                  label="Vente 2"
                  active={isVente2Path(pathname)}
                  accent
                  items={withActiveItems(pathname, filterVente2LinksByRole(VENTE2_LINKS, role, !!isAdmin))}
                  onNavigate={handleNav}
                />
              )}
              {isAdmin && (
                <MobileNavMenu
                  label="Stratégie"
                  active={isStrategiePath(pathname)}
                  accent
                  items={withActiveItems(pathname, STRATEGIE_LINKS)}
                  onNavigate={handleNav}
                />
              )}
              {isAdmin && (
                <AdminNavTab
                  href={IA_HREF}
                  label="IA"
                  active={isIaPath(pathname)}
                  className="mt-1 block px-2 py-2.5 text-sm transition-colors active:bg-violet-100"
                  onClick={handleNav}
                />
              )}
              <div className="pt-4 mt-4 border-t">
                {user ? (
                  <div className="space-y-2">
                    {isAdmin && (
                      <AdminNavTab
                        href={MON_ESPACE_HREF}
                        label="Mon espace"
                        active={isMonEspacePath(pathname)}
                        className="block px-2 py-2.5 text-sm transition-colors active:bg-violet-100"
                        onClick={handleNav}
                      />
                    )}
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
