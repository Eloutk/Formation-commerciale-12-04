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
        {/* Vue d'ensemble en en-tête */}
        <section className="mb-12">
          <Card>
            <CardHeader>
              <CardTitle>Vue d'ensemble des objectifs de campagne</CardTitle>
              <CardDescription>
                Chaque plateforme publicitaire propose différents objectifs de campagne. Ce schéma présente une vue d'ensemble des principaux types d'objectifs et leur rôle dans la stratégie marketing digitale.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <p>
                Chaque plateforme publicitaire propose différents objectifs de campagne. Ce schéma présente une vue d'ensemble des principaux types d'objectifs et leur rôle dans la stratégie marketing digitale.
              </p>
              <div className="my-8 flex justify-center">
                <Image
                  src="/images/Objectifs de campagne V2.png"
                  alt="Objectifs de campagne V2"
                  width={900}
                  height={600}
                  className="rounded-lg border shadow-sm"
                />
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-semibold text-primary">La notoriété</h3>
                  <p className="mt-2">
                    Les campagnes de notoriété visent à faire connaître votre marque, produit ou service auprès d'un maximum de personnes. L'objectif principal est d'atteindre un large public et de créer une première impression positive.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">Le trafic web</h3>
                  <p className="mt-2">
                    Ces campagnes ont pour but de générer des visites sur votre site web. Elles ciblent des personnes susceptibles d'être intéressées par votre offre et les encouragent à cliquer pour en savoir plus.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">Les leads</h3>
                  <p className="mt-2">
                    Les campagnes de leads sont traitées et gérées par l'univers META. Il s'agit d'un formulaire à remplir directement sur la plateforme sans pour autant se rendre sur le site internet du client. Ce n'est pas le site qui collecte les informations clients mais directement la plateforme publicitaire.
                  </p>
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary">La conversion</h3>
                  <p className="mt-2">
                    Ces campagnes visent à générer des actions spécifiques à forte valeur, comme des achats, des inscriptions ou des téléchargements directement sur le site de l'annonceur. Elles ciblent des personnes prêtes à passer à l'action et à devenir clients.
                  </p>
                </div>
              </div>
              <div className="bg-red-200 border border-red-500 text-red-800 p-4 rounded-lg mt-6">
                <h3 className="font-bold mb-2">Règle clé :</h3>
                <p>1 campagne = 1 objectif</p>
              </div>
            </CardContent>
          </Card>
        </section>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 mb-8">
            <TabsTrigger value="meta">META</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
            <TabsTrigger value="snap">Snapchat</TabsTrigger>
          </TabsList>

          {/* Onglet META */}
          <TabsContent value="meta">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/images/Logo META.png" alt="Logo META" width={32} height={32} className="rounded-sm" />
                  <CardTitle>Objectifs de campagne META (Facebook & Instagram)</CardTitle>
                </div>
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
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/images/Logo TikTok.png" alt="Logo TikTok" width={32} height={32} className="rounded-sm" />
                  <CardTitle>Objectifs de campagne TikTok</CardTitle>
                </div>
                <CardDescription>Les différents objectifs publicitaires disponibles sur TikTok</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  TikTok propose plusieurs objectifs de campagne regroupés en trois catégories principales : Awareness
                  (Notoriété), Consideration (Considération) et Conversion. Les objectifs encadrés en orange
                  représentent les services que nous proposons à nos clients.
                </p>

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
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/images/Logo LinkedIn.png" alt="Logo LinkedIn" width={32} height={32} className="rounded-sm" />
                  <CardTitle>Objectifs de campagne LinkedIn</CardTitle>
                </div>
                <CardDescription>Les différents objectifs publicitaires disponibles sur LinkedIn</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  LinkedIn propose des objectifs de campagne adaptés au contexte professionnel, regroupés en trois
                  catégories : Notoriété, Considération et Conversion. Les objectifs encadrés représentent les services
                  que nous proposons à nos clients.
                </p>

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

          {/* Onglet Google (nouvelle structure) */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Objectifs de campagne Google</CardTitle>
                <CardDescription>
                  Retrouvez ci-dessous la présentation indépendante des objectifs pour Google, YouTube et Display.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                {/* Vue d'ensemble des objectifs de campagne en introduction */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold mb-2">Vue d'ensemble des objectifs de campagne</h3>
                  <p>
                    Chaque plateforme publicitaire propose différents objectifs de campagne. Ce schéma présente une vue d'ensemble des principaux types d'objectifs et leur rôle dans la stratégie marketing digitale.
                  </p>
                </div>
                <Tabs defaultValue="google-search" className="w-full">
                  <TabsList className="mb-4 grid grid-cols-3">
                    <TabsTrigger value="google-search">Google</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                  </TabsList>
                  <TabsContent value="google-search">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo Google.png"
                          alt="Logo Google"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-semibold">Google</h3>
                      </div>
                      <p>Sur Search, les campagnes publicitaires sont exclusivement orientées vers des objectifs de clics ou de conversion.</p>
                      <div>
                        <h4 className="text-md font-semibold mt-4">Objectifs principaux proposés :</h4>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                          <li><span className="font-medium">Ventes :</span> Générer des ventes en ligne, via une application, par téléphone ou en magasin</li>
                          <li><span className="font-medium">Prospects :</span> Attirer les prospects et générer d'autres conversions en encourageant les clients à passer à l'action</li>
                          <li><span className="font-medium">Trafic vers le site Web :</span> Attirer sur votre site Web les personnes intéressées par vos produits ou services</li>
                          <li><span className="font-medium">Couverture et notoriété de la marque :</span> Toucher une audience élargie et renforcer la notoriété de votre marque</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="youtube">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo YouTube.png"
                          alt="Logo YouTube"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-semibold">YouTube</h3>
                      </div>
                      <p>Sur YouTube, seules les impressions ou la conversion peuvent être définies comme objectifs de campagne.</p>
                      <div>
                        <h4 className="text-md font-semibold mt-4">Objectifs principaux proposés :</h4>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                          <li><span className="font-medium">Ventes :</span> Générer des ventes en ligne, via une application, par téléphone ou en magasin</li>
                          <li><span className="font-medium">Prospects :</span> Attirer les prospects et générer d'autres conversions en encourageant les clients à passer à l'action</li>
                          <li><span className="font-medium">Trafic vers le site Web :</span> Attirer sur votre site Web les personnes intéressées par vos produits ou services</li>
                          <li><span className="font-medium">Couverture et notoriété de la marque :</span> Toucher une audience élargie et renforcer la notoriété de votre marque</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                  <TabsContent value="display">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo Google.png"
                          alt="Logo Google Display"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-semibold">Display</h3>
                      </div>
                      <p>Sur Display, il est possible de configurer des campagnes pour des objectifs de clics, d'impressions ou de conversion, selon le niveau d'engagement souhaité.</p>
                      <div>
                        <h4 className="text-md font-semibold mt-4">Objectifs principaux proposés :</h4>
                        <ul className="list-disc list-inside mt-2 space-y-2">
                          <li><span className="font-medium">Ventes :</span> Générer des ventes en ligne, via une application, par téléphone ou en magasin</li>
                          <li><span className="font-medium">Prospects :</span> Attirer les prospects et générer d'autres conversions en encourageant les clients à passer à l'action</li>
                          <li><span className="font-medium">Trafic vers le site Web :</span> Attirer sur votre site Web les personnes intéressées par vos produits ou services</li>
                          <li><span className="font-medium">Couverture et notoriété de la marque :</span> Toucher une audience élargie et renforcer la notoriété de votre marque</li>
                        </ul>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Spotify */}
          <TabsContent value="spotify">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/images/Logo Spotify.png" alt="Logo Spotify" width={32} height={32} className="rounded-sm" />
                  <CardTitle>Objectifs de campagne Spotify</CardTitle>
                </div>
                <CardDescription>Les différents objectifs publicitaires disponibles sur Spotify</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Spotify propose plusieurs objectifs de campagne adaptés à sa plateforme audio. Les objectifs encadrés
                  représentent les services que nous proposons à nos clients.
                </p>

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
                <div className="flex items-center gap-2 mb-2">
                  <Image src="/images/Logo Snapchat.png" alt="Logo Snapchat" width={32} height={32} className="rounded-sm" />
                  <CardTitle>Objectifs de campagne Snapchat</CardTitle>
                </div>
                <CardDescription>Les différents objectifs publicitaires disponibles sur Snapchat</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>
                  Snapchat propose plusieurs objectifs de campagne pour répondre à différents besoins marketing. Les
                  objectifs encadrés en orange représentent les services que nous proposons à nos clients.
                </p>

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

