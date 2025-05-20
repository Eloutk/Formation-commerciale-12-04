import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function MethodologieLink() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Méthodologie Link</h1>

        <Tabs defaultValue="processus" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="processus">Processus Marketing</TabsTrigger>
            <TabsTrigger value="roles">Rôles CM vs TM</TabsTrigger>
          </TabsList>

          <TabsContent value="processus">
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
          </TabsContent>

          <TabsContent value="roles">
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Rôles CM vs TM</CardTitle>
                <CardDescription>Comprendre les différences entre Community Manager et Traffic Manager</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Community Manager (CM)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Le Community Manager est responsable de :</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Gestion de la communauté</li>
                        <li>Création de contenus organiques</li>
                        <li>Planification éditoriale</li>
                        <li>Modération des commentaires</li>
                      </ul>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Le contenu réalisé par un CM est visible sur les réseaux de l'annonceur.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Traffic Manager (TM)</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>Le Traffic Manager est responsable de :</p>
                      <ul className="list-disc list-inside mt-2 space-y-1">
                        <li>Gestion des campagnes publicitaires (paid media)</li>
                        <li>Analyse de la performance</li>
                        <li>Optimisations des campagnes</li>
                        <li>Création de stratégie d'acquisition</li>
                      </ul>
                      <p className="mt-4 text-sm text-muted-foreground">
                        Le contenu diffusé par un TM n'est pas visible sur les réseaux de l'annonceur. Nous diffusons des publicités en dark, non publiées sur les réseaux.
                      </p>
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
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

