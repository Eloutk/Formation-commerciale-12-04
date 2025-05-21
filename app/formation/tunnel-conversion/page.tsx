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
              Le tunnel de conversion représente le parcours que suit un utilisateur depuis sa première interaction avec l'annonceur jusqu'à la conversion finale souhaitée. Comprendre ce processus est essentiel pour optimiser vos campagnes marketing et maximiser votre retour sur investissement. Attention, chaque campagne publicitaire n'a pas forcément un objectif d'achat. La conversion dans une campagne publicitaire désigne l'action précise qu'un utilisateur accomplit après avoir cliqué (ou vu) une publicité, et qui correspond à l'objectif fixé par l'annonceur (récolter de prospect, achats, ou inscription par exemple).
            </p>

            <div className="my-8">
              <Image
                src="/images/tunnel-conversion.png"
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
                <h3 className="text-xl font-semibold text-primary">La mise en place</h3>
                <p className="mt-2">
                  Cette phase préparatoire est cruciale et permet de poser correctement le cadre à nos équipes supports pour la création de la campagne. Elle comprend l'audit de la concurrence, la définition de votre stratégie digitale, la mise en place des outils de tracking, la définition des objectifs et KPIs, et l'identification précise de vos cibles.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary">Attirer</h3>
                <p className="mt-2">
                  La première phase du tunnel vise à générer de la notoriété (pilotée à l'impression) et à sensibiliser votre audience. L'objectif est d'attirer un maximum d'internautes pertinents vers vos canaux digitaux. Cette phase permet à l'algorithme de comprendre la campagne, de travailler le ciblage, mais surtout d'accumuler de la data pour la prochaine phase.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary">Convertir</h3>
                <p className="mt-2">
                  Cette phase se sert de la phase précédente dans le but de générer du trafic qualifié sur la landing page de l'annonceur. On parle ici de campagne pilotée au clic. Les visiteurs commencent à s'intéresser activement à la publicité mais aussi au site internet.
                </p>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-primary">Conclure</h3>
                <p className="mt-2">
                  La phase finale du tunnel est la phase de conversion. Après avoir mené toutes les phases dans l'ordre, l'algorithme a cumulé beaucoup de data et a déterminé un profil susceptible de transformer. C'est l'étape de conversion où se concrétise le retour sur investissement. (Si campagne de conversion achat, formulaire sur site… ne pas oublier la pose des outils de tracking lors de la mise en place). Pas obliger d'aller au bout du tunnel de conversion.
                </p>
              </div>
            </div>

            <div className="bg-muted p-4 rounded-lg mt-6">
              <h3 className="font-medium mb-2">Points clés à retenir :</h3>
              <ul className="list-disc list-inside space-y-1">
                <li>Chaque étape du tunnel nécessite des stratégies et messages différents.</li>
                <li>La conversion ne veut pas forcément dire achat.</li>
                <li>Chaque étape du tunnel est indispensable pour obtenir des résultats performants et de qualité.</li>
                <li>L'algorithme doit cumuler de la data avant de changer d'objectif de campagne.</li>
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

