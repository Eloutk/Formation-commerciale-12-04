"use client"

import * as React from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet"

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
              <div className="pt-4 mt-4 border-t">
                <Button asChild className="w-full" onClick={handleNav}>
                  <Link href="/login">Connexion</Link>
                </Button>
              </div>
            </nav>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  )
}

