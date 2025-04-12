import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"

export default function MethodologieLink() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Méthodologie Link</h1>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Introduction</CardTitle>
            <CardDescription>Comprendre la Méthodologie Link</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p>
              La Méthodologie Link est une approche structurée pour la gestion des campagnes publicitaires digitales, de
              leur création jusqu'au reporting, en passant par leur mise en ligne et leur optimisation.
            </p>

            <div className="my-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-28%20a%CC%80%2014.27.32-W7jcGmwD3k8DmFk2aj75Bo53Cu6igi.png"
                alt="Méthodologie Link"
                width={800}
                height={300}
                className="rounded-lg border shadow-sm mx-auto"
              />
            </div>

            <h2 className="text-xl font-semibold mt-8 mb-4">Différence entre Community Manager et Traffic Manager</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Community Manager (CM)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Le community manager est chargé du développement et de l'animation des réseaux sociaux. Ses
                    responsabilités incluent :
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Création et planification des contenus</li>
                    <li>Interaction avec la communauté</li>
                    <li>Modération des commentaires</li>
                    <li>Veille stratégique et concurrentielle</li>
                    <li>Analyse de l'engagement social</li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Traffic Manager (TM)</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>
                    Le traffic manager est à l'origine de la stratégie et la gestion des canaux d'acquisition sur le
                    web. Ses responsabilités incluent :
                  </p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Gestion des leviers payants (paid media)</li>
                    <li>Optimisation du référencement (SEO)</li>
                    <li>Campagnes de publicité (SEA)</li>
                    <li>Analyse de performance et ROI</li>
                    <li>Stratégie d'acquisition de trafic</li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </CardContent>
          <CardFooter>
            <Link href="/formation/methodologie-link/quiz">
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

