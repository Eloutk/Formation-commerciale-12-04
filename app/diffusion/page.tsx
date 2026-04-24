import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { ExternalLink, MapPin } from "lucide-react"

const MONDAY_DEMANDE_POTENTIEL =
  "https://link599528.monday.com/boards/1397138702/views/28918344"
const MONDAY_POTENTIELS_AUDIENCE = "https://link599528.monday.com/boards/5025723216"
import ModuleCard from "@/components/module-card"
import { getModulesProgress } from "@/lib/progress"

export default function DiffusionPage() {
  // Récupérer les données de progression des modules
  const { modules } = getModulesProgress()

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      {/* Hero Section */}
      <section className="py-6 md:py-12 text-center">
        <h1 className="mb-3 md:mb-4">Diffusion</h1>
        <p className="text-base md:text-xl mb-6 md:mb-8 max-w-3xl mx-auto px-2">
          Bienvenue sur la plateforme de formation commerciale. Accédez facilement à toutes les ressources dont vous
          avez besoin pour améliorer vos compétences.
        </p>
      </section>

      {/* Progress Section removed per UX request */}

      <section
        className="py-2 md:py-3 max-w-3xl mx-auto"
        aria-label="Liens Monday.com — potentiels"
      >
        <div className="rounded-lg border border-[#E94C16]/25 bg-gradient-to-br from-[#E94C16]/[0.06] to-background px-3 py-2.5 shadow-sm sm:px-4 sm:py-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between sm:gap-3">
            <p className="text-center text-xs font-medium text-foreground sm:text-left sm:shrink-0">
              Potentiels &amp; audience (Monday.com)
            </p>
            <div className="flex flex-col gap-2 sm:flex-row sm:justify-end sm:gap-2 sm:min-w-0 sm:flex-1">
              <Button
                asChild
                size="sm"
                className="h-9 w-full border-0 bg-[#E94C16] px-3 text-xs text-white hover:bg-[#d43f12] sm:w-auto sm:shrink-0"
              >
                <a
                  href={MONDAY_DEMANDE_POTENTIEL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  Faire une demande de potentiel
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                </a>
              </Button>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="h-9 w-full border border-[#E94C16] bg-background px-3 text-xs text-[#E94C16] hover:bg-[#E94C16]/10 sm:w-auto sm:shrink-0"
              >
                <a
                  href={MONDAY_POTENTIELS_AUDIENCE}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-1.5"
                >
                  Potentiels d&apos;audience
                  <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-90" aria-hidden />
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-4 md:py-6 max-w-3xl mx-auto">
        <Card className="border-[#E94C16]/30 bg-gradient-to-br from-[#E94C16]/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-[#E94C16]" />
              Cartographie des zones de diffusion
            </CardTitle>
            <CardDescription>
              Ville et rayon, département, région ou codes postaux — aperçu cartographique et estimation de population.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white">
              <Link href="/cartographie">Ouvrir la cartographie</Link>
            </Button>
          </CardContent>
        </Card>
      </section>

      {/* Modules Section */}
      <section className="py-4 md:py-8">
        <h2 className="mb-6 md:mb-8 text-center">Modules de formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {modules.map((module) => {
            const moduleTitle = module.title === "Bilans de campagne" ? "Rapports de campagne" : module.title;
            return (
              <ModuleCard
                key={module.id}
                title={moduleTitle}
                description={module.description}
                href={module.href}
                progress={module.progress}
                quizScore={module.quizScore}
                icon={module.icon as any}
              />
            );
          })}
        </div>
      </section>
    </div>
  )
}