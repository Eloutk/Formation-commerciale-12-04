import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function TunnelConversion() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tunnel de Conversion</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Le parcours client digital</CardTitle>
            <CardDescription>Comprendre et optimiser chaque étape du tunnel de conversion</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              Le tunnel de conversion représente le parcours que suit un utilisateur depuis sa première interaction avec
              votre marque jusqu'à la conversion finale (achat, inscription, etc.). Comprendre ce processus est
              essentiel pour optimiser vos campagnes marketing et maximiser votre retour sur investissement.
            </p>

            <div className="my-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-28%20a%CC%80%2015.19.56-sVOaVxCCZ4MdyzakbPxasm4MI3Q9tc.png"
                alt="Schéma du tunnel de conversion marketing"
                width={1200}
                height={600}
                className="rounded-lg border shadow-sm mx-auto"
              />
              <p className="text-sm text-muted-foreground text-center mt-2">
                Les différentes étapes du tunnel de conversion et leur impact sur le parcours client
              </p>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-semibold text-primary">1. Mettre en place</h3>
                <p className="mt-2">
                  Avant même de commencer à attirer des visiteurs, cette phase préparatoire est cruciale. Elle comprend
                  l'audit de la concurrence, la définition de votre stratégie digitale, la mise en place des outils
                  d'analyse, la définition des objectifs et KPIs, et l'identification précise de vos cibles. Cette étape
                  pose les fondations de toute votre stratégie d'acquisition.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary">2. Attirer (Étape 1)</h3>
                <p className="mt-2">
                  La première phase du tunnel vise à générer de la notoriété et à sensibiliser votre audience.
                  L'objectif est d'attirer un maximum d'internautes pertinents vers vos canaux digitaux. Les campagnes à
                  ce niveau se concentrent sur la visibilité et l'attraction, transformant des simples internautes en
                  visiteurs de votre site ou application.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary">3. Convertir (Étape 2)</h3>
                <p className="mt-2">
                  Cette phase intermédiaire transforme les visiteurs en prospects qualifiés. Elle se concentre sur la
                  considération et la génération de trafic qualifié. Les visiteurs commencent à s'intéresser activement
                  à vos produits ou services, et vos actions marketing visent à renforcer cet intérêt et à encourager
                  l'engagement.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary">4. Conclure (Étape 3)</h3>
                <p className="mt-2">
                  La phase finale du tunnel transforme les prospects en clients. C'est l'étape de conversion où se
                  concrétise le retour sur investissement de vos actions marketing. Les stratégies à ce niveau se
                  concentrent sur la réduction des frictions et l'incitation à l'action, avec pour objectif d'augmenter
                  le taux de conversion et de maximiser la valeur client.
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-6">
              <h3 className="font-medium mb-2">Points clés à retenir :</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Chaque étape du tunnel nécessite des stratégies et des messages différents</li>
                <li>La mesure des performances à chaque niveau permet d'identifier les points de friction</li>
                <li>L'optimisation continue du tunnel est essentielle pour améliorer les taux de conversion</li>
                <li>Un tunnel efficace maintient l'engagement de l'utilisateur tout au long de son parcours</li>
              </ul>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/formation/tunnel-conversion/quiz">
              <Button>
                Passer au quiz
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

