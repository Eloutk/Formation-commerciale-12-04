import { Sparkles } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function IaPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-3xl space-y-8">
        <div>
          <h1 className="mb-2 text-3xl font-bold">IA</h1>
          <p className="text-muted-foreground">
            Espace réservé aux administrateurs pour les outils et expérimentations basés sur
            l&apos;intelligence artificielle.
          </p>
        </div>

        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-[#E94C16]" aria-hidden />
              Outils IA
            </CardTitle>
            <CardDescription>
              Cet onglet accueillera prochainement les fonctionnalités IA de Link Academy.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">
              Aucun outil n&apos;est disponible pour le moment. Revenez bientôt pour découvrir les
              premières fonctionnalités.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
