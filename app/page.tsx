import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { UserCircle, LogIn } from "lucide-react"
import ModuleCard from "@/components/module-card"
import { getModulesProgress } from "@/lib/progress"

export default function Home() {
  // Récupérer les données de progression des modules
  const { modules, overallProgress } = getModulesProgress()

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero Section */}
      <section className="py-12 text-center">
        <h1 className="text-4xl font-bold mb-4">Formation Commerciale Interactive</h1>
        <p className="text-xl mb-8 max-w-3xl mx-auto">
          Bienvenue sur la plateforme de formation commerciale. Accédez facilement à toutes les ressources dont vous
          avez besoin pour améliorer vos compétences.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Button asChild size="lg">
            <Link href="/login">
              <LogIn className="mr-2 h-5 w-5" />
              Se connecter
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">
              <UserCircle className="mr-2 h-5 w-5" />
              Créer un compte
            </Link>
          </Button>
        </div>
      </section>

      {/* Progress Section */}
      <section className="py-8 max-w-3xl mx-auto mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Votre progression</CardTitle>
            <CardDescription>Suivez votre avancement dans les modules de formation</CardDescription>
          </CardHeader>
          <CardContent>
            <Progress value={overallProgress} className="h-3" />
            <div className="flex justify-between mt-2 text-sm text-muted-foreground">
              <span>{overallProgress}%</span>
              <span>Complété</span>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Modules Section */}
      <section className="py-8">
        <h2 className="text-3xl font-bold mb-8 text-center">Modules de formation</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                icon={module.icon as "BookOpen" | "Layout" | "GitBranch" | "Target" | "FolderTree" | "Users" | "LineChart" | "BadgeCheck" | "Settings"}
              />
            );
          })}
        </div>
      </section>
    </div>
  )
}

