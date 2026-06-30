import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { ExternalLink, PlayCircle } from 'lucide-react'
import { TUTO_ITEMS } from '@/lib/nav-aide'

export default function TutoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="mb-2 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <PlayCircle className="h-6 w-6" aria-hidden />
            </span>
            Tutoriels vidéo
          </h1>
          <p className="text-muted-foreground">
            Chaque bouton ouvre la vidéo correspondante sur Vimeo dans un nouvel onglet.
          </p>
        </div>
        <Card>
          <CardContent className="grid gap-3 pt-6 sm:grid-cols-2">
            {TUTO_ITEMS.map((item) => (
              <Button
                key={item.href}
                asChild
                variant="outline"
                className="h-auto min-h-11 justify-between gap-3 px-4 py-3 text-left whitespace-normal border-[#E94C16]/25 hover:bg-orange-50 hover:text-[#E94C16] hover:border-[#E94C16]/40"
              >
                <a href={item.href} target="_blank" rel="noopener noreferrer">
                  <span className="font-medium">{item.label}</span>
                  <ExternalLink className="h-4 w-4 shrink-0 opacity-60" aria-hidden />
                </a>
              </Button>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
