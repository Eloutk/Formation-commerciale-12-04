"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MobileNav() {
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
        <SheetContent side="left" className="w-[300px] sm:w-[360px]">
          <SheetClose className="absolute top-4 right-4">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
          <div className="py-6">
            <Link href="/formation" className="flex items-center gap-2 font-semibold" onClick={handleNav}>
              Link academy
            </Link>
            <div className="mt-4 space-y-3">
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="formations">
                  <AccordionTrigger className="text-sm">Formation</AccordionTrigger>
                  <AccordionContent>
                    <div className="flex flex-col space-y-2 pl-4">
                      {[
                        { name: "Méthodologie Link", href: "/formation/methodologie-link" },
                        { name: "Plateformes et placement", href: "/formation/plateformes-placement" },
                        { name: "Architecture des campagnes", href: "/formation/architecture-campagnes" },
                        { name: "Tunnel de conversion", href: "/formation/tunnel-conversion" },
                        { name: "Objectifs de campagne", href: "/formation/objectifs-campagne" },
                        { name: "Ciblage", href: "/formation/ciblage" },
                        { name: "Tracking", href: "/formation/tracking" },
                        { name: "Score qualité", href: "/formation/score-qualite" },
                        { name: "Optimisations", href: "/formation/optimisations" },
                        { name: "Rapports de campagne", href: "/formation/bilans-campagne" },
                        { name: "Demandes de potentiels", href: "/formation/demandes-potentiels" },
                      ].map((item) => (
                        <Link key={item.href} href={item.href} className="text-sm hover:underline" onClick={handleNav}>
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>

              <Link href="/glossaire" className="text-sm hover:underline" onClick={handleNav}>
                Glossaire
              </Link>
              <Link href="/documents" className="text-sm hover:underline" onClick={handleNav}>
                Documents
              </Link>
              <Link href="/pdv" className="text-sm hover:underline" onClick={handleNav}>
                PDV
              </Link>
              <Link href="/faq" className="text-sm hover:underline" onClick={handleNav}>
                FAQ
              </Link>

              <div className="pt-4 mt-4 border-t">
                <Button asChild className="w-full" onClick={handleNav}>
                  <Link href="/login">Connexion</Link>
                </Button>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

