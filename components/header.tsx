"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, LogIn, LogOut, User2 } from "lucide-react"
import { MobileNav } from "@/components/mobile-nav"
import Image from 'next/image'


const modules = [
  {
    title: "Méthodologie Link",
    href: "/formation/methodologie-link",
    description: "CM vs TM et processus marketing",
  },
  {
    title: "Plateformes et placements",
    href: "/formation/plateformes-placement",
    description: "Réseaux sociaux, Google, et SMS",
  },
  {
    title: "Tunnel de conversion",
    href: "/formation/tunnel-conversion",
    description: "Optimisez votre stratégie de conversion",
  },
  {
    title: "Objectifs de campagne",
    href: "/formation/objectifs-campagne",
    description: "Définissez des objectifs SMART",
  },
  {
    title: "Ciblage",
    href: "/formation/ciblage",
    description: "Stratégies de ciblage par plateforme",
  },
  {
    title: "Architecture des campagnes",
    href: "/formation/architecture-campagnes",
    description: "Structurez efficacement vos campagnes",
  },
  {
    title: "Tracking",
    href: "/formation/tracking",
    description: "Analyse des performances",
  },
  {
    title: "Score qualité",
    href: "/formation/score-qualite",
    description: "Améliorez vos annonces et landing pages",
  },
  {
    title: "Optimisations",
    href: "/formation/optimisations",
    description: "Maximisez vos résultats",
  },
  {
    title: "Rapports de campagne",
    href: "/formation/rapports-campagne",
    description: "Analysez et optimisez vos campagnes grâce à des bilans interactifs",
  },
  {
    title: "Demandes de potentiels",
    href: "/formation/demandes-potentiels",
    description: "Fiche brief avancée pour estimer le potentiel d'une campagne",
  },
]

export default function Header() {
  const pathname = usePathname()
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showResults, setShowResults] = React.useState(false);


  // Filtrer les modules selon la recherche
  const filteredModules = modules.filter(
    (module) =>
      module.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      module.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background">
      <div className="container flex items-center justify-between h-16 gap-6 px-4 mx-auto">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <Image
            src="/Logo Link Vertical (Orange).png"
            alt="Logo Link Academy"
            width={28}
            height={28}
            className="object-contain h-8 w-auto"
          />
          Link academy
        </Link>

        <div className="hidden lg:flex lg:flex-1 items-center justify-between">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Diffusion</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[600px] gap-3 p-4 md:grid-cols-2">
                    {modules.map((module) => (
                      <ListItem key={module.title} title={module.title} href={module.href}>
                        {module.description}
                      </ListItem>
                    ))}
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/studio" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Studio</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/chefferie" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Chefferie de projet</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/pdv" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>PDV</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/documents" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Documents</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/glossaire" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>Glossaire</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link href="/faq" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>FAQ</NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Rechercher..."
                className="w-64 pl-8"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowResults(e.target.value.length > 0);
                }}
                onBlur={() => setTimeout(() => setShowResults(false), 150)}
                onFocus={() => setShowResults(searchTerm.length > 0)}
              />
              {showResults && filteredModules.length > 0 && (
                <div className="absolute left-0 mt-2 w-full bg-white border border-gray-200 rounded shadow-lg z-50">
                  {filteredModules.map((module) => (
                    <Link
                      key={module.title}
                      href={module.href}
                      className="block px-4 py-2 hover:bg-orange-100 text-sm text-gray-900 cursor-pointer"
                      onClick={() => setShowResults(false)}
                    >
                      <span className="font-semibold">{module.title}</span>
                      <span className="block text-xs text-gray-500">{module.description}</span>
                    </Link>
                  ))}
                </div>
              )}
            </div>

            <Button asChild variant="default" size="sm">
              <Link href="/login">
                <LogIn className="mr-2 h-4 w-4" />
                Connexion
              </Link>
            </Button>
          </div>
        </div>

        <MobileNav />
      </div>
    </header>
  )
}

const ListItem = React.forwardRef<React.ElementRef<"a">, React.ComponentPropsWithoutRef<"a">>(
  ({ className, title, children, ...props }, ref) => {
    return (
      <li>
        <NavigationMenuLink asChild>
          <a
            ref={ref}
            className={cn(
              "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
              className,
            )}
            {...props}
          >
            <div className="text-sm font-medium leading-none">{title}</div>
            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">{children}</p>
          </a>
        </NavigationMenuLink>
      </li>
    )
  },
)
ListItem.displayName = "ListItem"

