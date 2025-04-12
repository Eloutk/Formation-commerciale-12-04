import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"

export default function ObjectifsCampagne() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Objectifs de Campagne</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="meta">META</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="google">Google/YouTube</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
            <TabsTrigger value="snap">Snapchat</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Vue d'ensemble des objectifs de campagne</CardTitle>
                <CardDescription>
                  Comprendre les différents objectifs publicitaires et leur place dans le parcours client
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Chaque plateforme publicitaire propose différents objectifs de campagne, mais ils peuvent tous être
                  classés selon leur position dans le parcours client. Ce schéma présente une vue d'ensemble des
                  principaux types d'objectifs et leur rôle dans la stratégie marketing digitale.
                </p>

                <div className="my-8">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-31%20a%CC%80%2012.07.42-SyAy63zotBMfMhcJwjC2p4aUUti1ws.png"
                    alt="Vue d'ensemble des objectifs de campagne"
                    width={1200}
                    height={600}
                    className="rounded-lg border shadow-sm mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">La notoriété</h3>
                    <p className="mt-2">
                      Les campagnes de notoriété visent à faire connaître votre marque, produit ou service auprès d'un
                      maximum de personnes. L'objectif principal est d'atteindre un large public et de créer une
                      première impression positive.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary">Le trafic web</h3>
                    <p className="mt-2">
                      Ces campagnes ont pour but de générer des visites sur votre site web. Elles ciblent des personnes
                      susceptibles d'être intéressées par votre offre et les encouragent à cliquer pour en savoir plus.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary">Les leads</h3>
                    <p className="mt-2">
                      L'objectif est de collecter des informations de contact via des formulaires. Ces campagnes visent
                      à transformer les visiteurs en prospects qualifiés pour votre entreprise.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-semibold text-primary">La conversion</h3>
                    <p className="mt-2">
                      Ces campagnes visent à générer des actions spécifiques à forte valeur, comme des achats, des
                      inscriptions ou des téléchargements. Elles ciblent des personnes prêtes à passer à l'action et à
                      devenir clients.
                    </p>
                  </div>
                </div>

                <div className="bg-muted p-4 rounded-lg mt-6">
                  <h3 className="font-medium mb-2">Note importante :</h3>
                  <p>
                    Comme indiqué dans le schéma, une campagne de conversion n'est pas forcément liée à un achat direct.
                    Il s'agit d'une campagne visant une transformation sur le site internet, ce qui nécessite des outils
                    de tracking appropriés pour mesurer l'efficacité.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet META */}
          <TabsContent value="meta">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne META (Facebook & Instagram)</CardTitle>
                <CardDescription>
                  Les différents objectifs disponibles sur les plateformes Facebook et Instagram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  META (Facebook et Instagram) propose une variété d'objectifs de campagne adaptés à différentes étapes
                  du parcours client. Les objectifs encadrés en rouge représentent les services que nous proposons à nos
                  clients.
                </p>

                <div className="my-8 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Objectifs-de-campagne-META-IRwo961BRLVm86mYcJj1KVYDMm3Xrr.png"
                    alt="Objectifs de campagne META"
                    width={600}
                    height={600}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Objectifs principaux proposés :</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Notoriété :</span> Augmenter la visibilité de votre marque auprès
                        d'un large public
                      </li>
                      <li>
                        <span className="font-medium">Trafic :</span> Diriger les utilisateurs vers votre site web ou
                        application
                      </li>
                      <li>
                        <span className="font-medium">Interactions :</span> Générer des engagements comme des j'aime,
                        des commentaires ou des partages
                      </li>
                      <li>
                        <span className="font-medium">Prospects :</span> Collecter des informations de contact via des
                        formulaires
                      </li>
                      <li>
                        <span className="font-medium">Ventes :</span> Encourager les achats sur votre site web ou en
                        magasin
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet TikTok */}
          <TabsContent value="tiktok">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne TikTok</CardTitle>
                <CardDescription>Les différents objectifs publicitaires disponibles sur TikTok</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  TikTok propose plusieurs objectifs de campagne regroupés en trois catégories principales : Awareness
                  (Notoriété), Consideration (Considération) et Conversion. Les objectifs encadrés en orange
                  représentent les services que nous proposons à nos clients.
                </p>

                <div className="my-8 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Objectifs-de-campagne-Tiktok-qVRN6x3AoftuKg9xziWw9xuaFDi4PV.png"
                    alt="Objectifs de campagne TikTok"
                    width={500}
                    height={700}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Objectifs principaux proposés :</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Reach (Portée) :</span> Maximiser la portée de vos annonces auprès
                        d'un public large
                      </li>
                      <li>
                        <span className="font-medium">Traffic (Trafic) :</span> Diriger les utilisateurs vers votre site
                        web ou application
                      </li>
                      <li>
                        <span className="font-medium">Website conversions (Conversions sur site web) :</span> Encourager
                        des actions spécifiques sur votre site web
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet LinkedIn */}
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne LinkedIn</CardTitle>
                <CardDescription>Les différents objectifs publicitaires disponibles sur LinkedIn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  LinkedIn propose des objectifs de campagne adaptés au contexte professionnel, regroupés en trois
                  catégories : Notoriété, Considération et Conversion. Les objectifs encadrés représentent les services
                  que nous proposons à nos clients.
                </p>

                <div className="my-8 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Objectifs-de-campagne-Linkedin-miJVwemSQ5OBrGRweg9WOgprYsTCq5.png"
                    alt="Objectifs de campagne LinkedIn"
                    width={800}
                    height={700}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Objectifs principaux proposés :</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Notoriété de la marque :</span> Atteindre plus de personnes avec
                        votre post
                      </li>
                      <li>
                        <span className="font-medium">Visites du site web :</span> Obtenir plus de clics sur votre page
                        de destination
                      </li>
                      <li>
                        <span className="font-medium">Génération de leads :</span> Recueillir des informations sur les
                        personnes intéressées par votre activité
                      </li>
                      <li>
                        <span className="font-medium">Engagement :</span> Augmenter l'engagement social et les abonnés
                        sur la page
                      </li>
                      <li>
                        <span className="font-medium">Conversions de site web :</span> Attirer des leads ou générer des
                        actions sur votre site web
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google/YouTube */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne Google Ads & YouTube</CardTitle>
                <CardDescription>
                  Les différents objectifs publicitaires disponibles sur Google Ads et YouTube
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Google Ads et YouTube proposent une variété d'objectifs de campagne pour répondre à différents besoins
                  marketing. Les objectifs encadrés représentent les services que nous proposons à nos clients.
                </p>

                <div className="my-8 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Objectifs-de-campagne-Youtube%3AGoogle-PAXKvkoAOv2mxKmXRUt8aFZEEVhpJc.png"
                    alt="Objectifs de campagne Google Ads et YouTube"
                    width={1000}
                    height={600}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Objectifs principaux proposés :</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Ventes :</span> Générer des ventes en ligne, via une application,
                        par téléphone ou en magasin
                      </li>
                      <li>
                        <span className="font-medium">Prospects :</span> Attirer les prospects et générer d'autres
                        conversions en encourageant les clients à passer à l'action
                      </li>
                      <li>
                        <span className="font-medium">Trafic vers le site Web :</span> Attirer sur votre site Web les
                        personnes intéressées par vos produits ou services
                      </li>
                      <li>
                        <span className="font-medium">Couverture et notoriété de la marque :</span> Toucher une audience
                        élargie et renforcer la notoriété de votre marque
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Spotify */}
          <TabsContent value="spotify">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne Spotify</CardTitle>
                <CardDescription>Les différents objectifs publicitaires disponibles sur Spotify</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Spotify propose plusieurs objectifs de campagne adaptés à sa plateforme audio. Les objectifs encadrés
                  représentent les services que nous proposons à nos clients.
                </p>

                <div className="my-8 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Objectifs-de-campagne-Spotify-dEHsGb8GTXttVcIo0sYe1LsPVm3DYg.png"
                    alt="Objectifs de campagne Spotify"
                    width={1000}
                    height={800}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Objectifs principaux proposés :</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Portée :</span> Partagez vos annonces avec un public le plus large
                        possible pour développer votre notoriété
                      </li>
                      <li>
                        <span className="font-medium">Impressions :</span> Partagez vos annonces aussi souvent que
                        possible pour augmenter votre notoriété
                      </li>
                      <li>
                        <span className="font-medium">Vues de vidéo :</span> Captez l'attention et augmentez le nombre
                        de vues de votre annonce vidéo
                      </li>
                      <li>
                        <span className="font-medium">Website Traffic :</span> Amenez plus de personnes à visiter votre
                        site web
                      </li>
                      <li>
                        <span className="font-medium">Clics :</span> Suscitez de l'engagement en faisant en sorte que
                        davantage de personnes cliquent sur vos annonces
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Snapchat */}
          <TabsContent value="snap">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne Snapchat</CardTitle>
                <CardDescription>Les différents objectifs publicitaires disponibles sur Snapchat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Snapchat propose plusieurs objectifs de campagne pour répondre à différents besoins marketing. Les
                  objectifs encadrés en orange représentent les services que nous proposons à nos clients.
                </p>

                <div className="my-8 flex justify-center">
                  <Image
                    src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Objectifs-de-campagne-Snap-ZssmsesKN9fcqZSa2vFi57lLXXddZx.png"
                    alt="Objectifs de campagne Snapchat"
                    width={400}
                    height={600}
                    className="rounded-lg border shadow-sm"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold">Objectifs principaux proposés :</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Notoriété et engagement :</span> Augmenter la visibilité de votre
                        marque et encourager les interactions
                      </li>
                      <li>
                        <span className="font-medium">Trafic :</span> Diriger les utilisateurs vers votre site web ou
                        application
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Link href="/formation/objectifs-campagne/quiz">
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

