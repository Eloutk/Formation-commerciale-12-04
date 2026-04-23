import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { MapPin } from "lucide-react"
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

      <section className="py-4 md:py-6 max-w-3xl mx-auto">
        <Card className="border-[#E94C16]/30 bg-gradient-to-br from-[#E94C16]/5 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-lg">
              <MapPin className="h-5 w-5 text-[#E94C16]" />
              Carte des zones de diffusion
            </CardTitle>
            <CardDescription>
              Ville et rayon, département ou région — aperçu cartographique et export PNG pour vos présentations
              clients.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white">
              <Link href="/diffusion/zones">Ouvrir la carte zones</Link>
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