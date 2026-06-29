import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ExternalLink, PlayCircle } from 'lucide-react'
import { TUTO_ITEMS } from '@/lib/nav-aide'

export default function TutoPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Tutoriels</h1>
        <p className="text-muted-foreground mb-8">
          Vidéos pas à pas pour les outils et démarches du quotidien.
        </p>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlayCircle className="h-5 w-5 text-[#E94C16]" aria-hidden />
              Tutoriels vidéo
            </CardTitle>
            <CardDescription>
              Chaque bouton ouvre la vidéo correspondante sur Vimeo dans un nouvel onglet.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
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
