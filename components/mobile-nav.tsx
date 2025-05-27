"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export function MobileNav() {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="flex lg:hidden">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="-ml-2 h-9 w-9">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-[300px] sm:w-[400px]">
          <SheetClose className="absolute top-4 right-4">
            <X className="h-5 w-5" />
            <span className="sr-only">Close</span>
          </SheetClose>
          <div className="py-6">
            <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen(false)}>
              Formation Commerciale
            </Link>
            <div className="mt-4 space-y-2">
              <div className="flex flex-col space-y-3">
                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="formations">
                    <AccordionTrigger className="text-sm">Formation</AccordionTrigger>
                    <AccordionContent>
                      <div className="flex flex-col space-y-2 pl-4">
                        {[
                          { name: "Méthodologie Link", href: "/formation/methodologie-link" },
                          { name: "Plateformes et placement", href: "/formation/plateformes-placement" },
                          { name: "Tunnel de conversion", href: "/formation/tunnel-conversion" },
                          { name: "Objectifs de campagne", href: "/formation/objectifs-campagne" },
                          { name: "Architecture des campagnes", href: "/formation/architecture-campagnes" },
                          { name: "Ciblage", href: "/formation/ciblage" },
                          { name: "Tracking", href: "/formation/tracking" },
                          { name: "Score qualité", href: "/formation/score-qualite" },
                          { name: "Optimisations", href: "/formation/optimisations" },
                          { name: "Bilans de campagne", href: "/formation/bilans-campagne" },
                          { name: "Demandes de potentiels", href: "/formation/demandes-potentiels" },
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="text-sm hover:underline"
                            onClick={() => setOpen(false)}
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <Link href="/glossaire" className="text-sm hover:underline" onClick={() => setOpen(false)}>
                  Glossaire
                </Link>
                <Link href="/examen" className="text-sm hover:underline" onClick={() => setOpen(false)}>
                  Examen
                </Link>
                <Link href="/faq" className="text-sm hover:underline" onClick={() => setOpen(false)}>
                  FAQ
                </Link>

                <div className="pt-4 mt-4 border-t">
                  <Button asChild className="w-full" onClick={() => setOpen(false)}>
                    <Link href="/login">Connexion</Link>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

