import ModuleCard from "@/components/module-card"
import { filterFormationModulesForRole, getModulesProgress } from "@/lib/progress"
import { getPrimarySessionUser } from "@/lib/media-session"

export const dynamic = 'force-dynamic'

export default async function DiffusionPage() {
  const user = await getPrimarySessionUser()
  const { modules } = getModulesProgress()
  const visibleModules = filterFormationModulesForRole(
    modules,
    user?.role ?? null,
    user?.isClient,
  )

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

      {/* Modules Section */}
      <section className="py-4 md:py-8">
        <h2 className="mb-6 md:mb-8 text-center">Modules de formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
          {visibleModules.map((module) => {
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