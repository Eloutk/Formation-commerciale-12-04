import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight, Info } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function ScoreQualite() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Score Qualité</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Qu'est-ce que le score qualité ?</CardTitle>
            <CardDescription>Comprendre l'impact du score qualité sur vos campagnes publicitaires</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-lg text-primary font-medium mb-4">
                Le score qualité est une évaluation de l'ensemble des annonces et des pages de destination. Ce score
                détermine notre rang dans le processus d'enchères publicitaires.
              </p>
              <p className="mb-4">
                Cette notation a été créé par Facebook puis repris par l'ensemble des acteurs du marché.
              </p>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Critères d'évaluation</h3>
              <p className="text-lg text-primary font-medium mb-4">
                Le score qualité attribue une note et se base sur plusieurs critères :
              </p>
              <ul className="space-y-2 ml-4">
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Le respect des formats de diffusion et le cahier des charges</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Le paramétrage de campagne</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>La pertinence du ciblage, la qualité des audiences</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>La gestion des objectifs</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>L'optimisation</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                    <Info className="h-4 w-4" />
                  </span>
                  <span>Etc...</span>
                </li>
              </ul>
            </div>

            <div className="mt-8">
              <h3 className="text-xl font-semibold mb-4">Impact sur les enchères</h3>
              <p className="mb-6">
                Le score qualité joue un rôle crucial dans le processus d'enchères publicitaires. Voici comment il
                fonctionne :
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.35-r8Rp84pWHUQdo77VTeA9Ko2wBRPtRc.png"
                    alt="Calcul du score qualité avec exemples Nike, Uber Eats et IKEA"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.50-kR4F67aOJuuA4d1nVK2tYMvQFN05LA.png"
                    alt="Impact du score qualité sur le coût de la campagne"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.45-3sK7x1e2ZBdBSDHJmpVg6LrU4ICZaQ.png"
                    alt="Exemples de calcul de score qualité"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>

                <div className="border rounded-lg overflow-hidden">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2011.03.28-jZHUuRMiJMsRiVR1rM99hTT0Wl8MuH.png"
                    alt="Processus d'enchères publicitaires"
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                </div>
              </div>

              <Alert className="mt-8 border-primary/50 bg-primary/10">
                <AlertDescription>
                  <p className="font-medium">
                    Comme vous pouvez le voir dans les exemples ci-dessus, un meilleur score qualité peut compenser une
                    enchère plus basse. IKEA, avec une enchère de seulement 0,15€ mais un score qualité de 9, obtient
                    une note finale de 135, supérieure à celle de Nike (120) qui a une enchère plus élevée (0,20€) mais
                    un score qualité inférieur (6).
                  </p>
                </AlertDescription>
              </Alert>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex justify-end">
          <Link href="/formation/score-qualite/quiz">
            <Button>
              Passer au quiz
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

