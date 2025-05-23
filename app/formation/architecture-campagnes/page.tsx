import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function ArchitectureCampagnes() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Architecture des Campagnes</h1>

        {/* Vue d'ensemble en en-tête */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Principe général d'architecture de campagne</CardTitle>
            <CardDescription>
              Comprendre la structure hiérarchique des campagnes publicitaires digitales
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <p>
              L'architecture des campagnes publicitaires suit généralement une structure hiérarchique à trois
              niveaux, quelle que soit la plateforme utilisée. Cette organisation permet une gestion efficace et une
              optimisation précise des performances.
            </p>

            <div className="my-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-28%20a%CC%80%2015.37.04-pewNNZVxNM8WAWZTAOIDEerFQyQ7rl.png"
                alt="Principe général d'architecture de campagne"
                width={1200}
                height={600}
                className="rounded-lg border shadow-sm mx-auto"
              />
            </div>

            <div className="space-y-4">
              <div>
                <h3 className="text-xl font-semibold text-primary">Structure à trois niveaux</h3>
                <ul className="list-disc list-inside mt-2 space-y-2">
                  <li>
                    <span className="font-medium">La campagne :</span> Niveau supérieur qui définit l'objectif
                    global, le budget total et la période de diffusion
                  </li>
                  <li>
                    <span className="font-medium">Le ciblage :</span> Niveau intermédiaire qui segmente l'audience
                    selon différents critères (démographiques, géographiques, centres d'intérêt, etc.)
                  </li>
                  <li>
                    <span className="font-medium">Les visuels :</span> Niveau inférieur qui contient les créations
                    publicitaires (images, vidéos, textes) montrées à l'audience
                  </li>
                </ul>
              </div>

              <div className="bg-muted p-4 rounded-lg mt-6">
                <h3 className="font-medium mb-2 flex items-center">
                  <InfoIcon className="h-5 w-5 mr-2 text-primary" />
                  Principe clé :
                </h3>
                <p>
                  <span className="text-primary font-semibold">
                    "Segmentation du ciblage = Optimisations plus poussées"
                  </span>
                  . Plus vous segmentez finement votre ciblage, plus vous pourrez optimiser précisément vos
                  campagnes et adapter vos messages à chaque segment d'audience.
                </p>
              </div>

              <Alert className="mt-4 border-primary/50">
                <InfoIcon className="h-5 w-5" />
                <AlertTitle>Terminologie importante</AlertTitle>
                <AlertDescription>
                  Dans notre jargon, le terme "Ciblage" est synonyme d'"Audience". Ces deux termes désignent le même concept : le groupe de personnes que vous souhaitez atteindre avec vos publicités.
                </AlertDescription>
              </Alert>
            </div>

            <p className="mt-4">
              Bien que la terminologie puisse varier d'une plateforme à l'autre, cette structure à trois niveaux
              reste constante :
            </p>
            <ul className="list-disc list-inside mt-2 space-y-2">
              <li>
                <span className="font-medium">Niveau 1 (rouge) :</span> Groupes de campagnes ou campagnes
              </li>
              <li>
                <span className="font-medium">Niveau 2 (orange) :</span> Campagnes ou ensembles de publicités
                (ciblage)
              </li>
              <li>
                <span className="font-medium">Niveau 3 (vert) :</span> Publicités ou annonces (visuels)
              </li>
            </ul>

            <Alert className="mt-8 border-primary/50">
              <InfoIcon className="h-5 w-5" />
              <AlertTitle>Toujours le même principe</AlertTitle>
              <AlertDescription>
                Quelle que soit la plateforme publicitaire utilisée, cette structure hiérarchique reste la base de
                l'architecture des campagnes. Les spécificités de chaque plateforme sont détaillées dans les onglets
                correspondants.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 mb-8">
            <TabsTrigger value="meta">META</TabsTrigger>
            <TabsTrigger value="google-display">Display & YouTube</TabsTrigger>
            <TabsTrigger value="google-search">Google Search</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="snap">Snapchat</TabsTrigger>
          </TabsList>

          {/* Onglet META */}
          <TabsContent value="meta">
            <Card>
              <CardHeader>
                <CardTitle>Architecture des campagnes META (Facebook & Instagram)</CardTitle>
                <CardDescription>
                  Structure et approches spécifiques pour les campagnes Facebook et Instagram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <Image
                    src="/images/exemple-efs-meta-2-architechture.png"
                    alt="Exemple EFS META 2 - Architechture"
                    width={320}
                    height={213}
                    className="rounded-lg border shadow-sm w-full max-w-xs mx-auto"
                  />
                  <Image
                    src="/images/exemple-efs-meta-architechture.png"
                    alt="Exemple EFS META - Architechture"
                    width={320}
                    height={213}
                    className="rounded-lg border shadow-sm w-full max-w-xs mx-auto"
                  />
                </div>

                <Accordion type="single" collapsible className="w-full border rounded-lg p-4 bg-muted/30">
                  <AccordionItem value="tableau-recap" className="border-none">
                    <AccordionTrigger className="text-lg font-semibold hover:no-underline">
                      <div className="flex items-center gap-2">
                        <InfoIcon className="h-5 w-5 text-primary" />
                        Tableau récapitulatif des possibilités META
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="my-4">
                        <Image
                          src="/images/recap-possible-meta.png"
                          alt="Tableau récapitulatif des possibilités META"
                          width={320}
                          height={213}
                          className="rounded-lg border shadow-sm w-full max-w-xs mx-auto"
                        />
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>

                <p>
                  Sur META (Facebook et Instagram), l'architecture des campagnes est particulièrement flexible et permet
                  différentes approches selon vos objectifs et votre stratégie de ciblage.
                </p>

                <div className="mt-8">
                  <h3 className="text-xl font-semibold mb-6">Différentes approches d'architecture sur META</h3>

                  <div className="space-y-8">
                    <div className="bg-muted/30 p-6 rounded-lg border">
                      <h4 className="text-lg font-semibold text-primary mb-4">
                        1. Campagne avec une seule zone géographique
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2">Avantages :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Être plus puissant sur les enchères (car budget plus élevé)</li>
                            <li>Budget se paramètre à l'échelle de la campagne</li>
                            <li>Ciblages conservés</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Inconvénients :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Pas de repiquage local</li>
                            <li>Pas de LP personnalisées</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-lg border">
                      <h4 className="text-lg font-semibold text-primary mb-4">
                        2. Campagne avec plusieurs zones (1 audience = 1 zone)
                      </h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2">Avantages :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Regrouper un petit budget pour plusieurs zones</li>
                            <li>Repiquage local possible</li>
                            <li>URL différente en fonction des zones géographiques</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Inconvénients :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>La répartition est totalement aléatoire entre les zones géographiques</li>
                            <li>On ne peut pas booster une zone plutôt qu'une autre</li>
                            <li>Ne pas dépasser plus de 5 zones géographiques à au-delà, l'algorithme se perd</li>
                            <li>Pas de ciblage</li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-muted/30 p-6 rounded-lg border">
                      <h4 className="text-lg font-semibold text-primary mb-4">3. Campagne par zone géographique</h4>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <h5 className="font-medium mb-2">Avantages :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Répartition du budget équitable entre chaque zones géographiques</li>
                            <li>Repiquage local dans les wordings et dans les visuels</li>
                            <li>URL différente en fonction des zones géographiques</li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-2">Inconvénients :</h5>
                          <ul className="list-disc list-inside space-y-1">
                            <li>
                              Un budget dédié à chaque zone géographique (donc si beaucoup de zones, cela implique un
                              gros budget)
                            </li>
                            <li>Paramétrage des campagnes plus long</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Alert className="mt-8 border-primary/50">
                    <InfoIcon className="h-5 w-5" />
                    <AlertTitle>Attention</AlertTitle>
                    <AlertDescription>
                      Les informations mentionnées ci-dessus ne sont valables que pour META (Facebook et Instagram) !
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google Display & YouTube */}
          <TabsContent value="google-display">
            <Card>
              <CardHeader>
                <CardTitle>Architecture des campagnes Google Display & YouTube</CardTitle>
                <CardDescription>Structure et spécificités des campagnes Display et YouTube</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
                  <Image
                    src="/images/display-architechture-zone.png"
                    alt="Display architechture Zone"
                    width={400}
                    height={267}
                    className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
                  />
                  <Image
                    src="/images/architechture-display-efs.png"
                    alt="Architechture Display EFS"
                    width={400}
                    height={267}
                    className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
                  />
                </div>

                <p>
                  Google Display et YouTube utilisent une structure hiérarchique similaire, adaptée à leurs formats respectifs.
                  Cette organisation permet un contrôle précis du budget, du ciblage et des enchères.
                </p>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-2">Spécificités Google Display & YouTube</h3>
                  <ul className="list-disc list-inside space-y-1">
                    <li>
                      Les groupes d'annonces peuvent être organisés par thématique (ex: "Expression exacte", "Mot clé
                      exact", "Requêtes larges")
                    </li>
                    <li>Chaque groupe d'annonces peut avoir ses propres enchères et mots-clés spécifiques</li>
                    <li>
                      Le budget est défini au niveau de la campagne, mais peut être réparti différemment entre les
                      groupes d'annonces selon leurs performances
                    </li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google Search */}
          <TabsContent value="google-search">
            <Card>
              <CardHeader>
                <CardTitle>Architecture des campagnes Google Search</CardTitle>
                <CardDescription>Structure et spécificités des campagnes Search</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center">
                  <Image
                    src="/images/exemple-efs-google-search.png"
                    alt="Exemple EFS - Google Search"
                    width={400}
                    height={267}
                    className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
                  />
                </div>

                <p>
                  Google Search utilise une structure hiérarchique spécifique optimisée pour les recherches en ligne.
                  Cette organisation permet un contrôle précis des mots-clés, du budget et des enchères.
                </p>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">Structure Google Search</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Campagne :</span> Niveau supérieur qui définit le budget, la zone
                        géographique, le réseau de diffusion et d'autres paramètres généraux
                      </li>
                      <li>
                        <span className="font-medium">Groupe d'annonces :</span> Niveau intermédiaire qui regroupe des
                        annonces autour d'un thème commun ou de mots-clés similaires
                      </li>
                      <li>
                        <span className="font-medium">Annonces :</span> Niveau inférieur qui contient les créations
                        publicitaires montrées aux utilisateurs
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Spécificités Google Search</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Les groupes d'annonces peuvent être organisés par thématique (ex: "Expression exacte", "Mot clé
                        exact", "Requêtes larges")
                      </li>
                      <li>Chaque groupe d'annonces peut avoir ses propres enchères et mots-clés spécifiques</li>
                      <li>
                        Le budget est défini au niveau de la campagne, mais peut être réparti différemment entre les
                        groupes d'annonces selon leurs performances
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
                <CardTitle>Architecture des campagnes LinkedIn</CardTitle>
                <CardDescription>Structure et spécificités des campagnes LinkedIn Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center">
                  <Image
                    src="/images/exemple-architechture-linkedin.png"
                    alt="Exemple architechture Linkedin"
                    width={320}
                    height={213}
                    className="rounded-lg border shadow-sm w-full max-w-xs mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">Structure LinkedIn Ads</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Groupes de campagnes :</span> Niveau supérieur qui permet
                        d'organiser les campagnes par objectif, produit ou marché
                      </li>
                      <li>
                        <span className="font-medium">Campagnes :</span> Niveau intermédiaire qui définit l'objectif, le
                        budget, le calendrier et le ciblage
                      </li>
                      <li>
                        <span className="font-medium">Publicités :</span> Niveau inférieur qui contient les créations
                        publicitaires (formats sponsorisés, InMail, etc.)
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Spécificités LinkedIn</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        LinkedIn permet un ciblage très précis basé sur des critères professionnels (poste, secteur,
                        compétences, etc.)
                      </li>
                      <li>Les dates, la zone géographique et le budget sont définis au niveau de la campagne</li>
                      <li>Les URL de destination sont définies au niveau des publicités</li>
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
                <CardTitle>Architecture des campagnes TikTok</CardTitle>
                <CardDescription>Structure et spécificités des campagnes TikTok Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center">
                  <Image
                    src="/images/architechture-tiktok.png"
                    alt="Architechture Tiktok"
                    width={400}
                    height={267}
                    className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">Structure TikTok Ads</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Campagnes :</span> Niveau supérieur qui définit l'objectif
                        publicitaire global
                      </li>
                      <li>
                        <span className="font-medium">Ensembles de publicités :</span> Niveau intermédiaire qui définit
                        le ciblage, le budget et le calendrier
                      </li>
                      <li>
                        <span className="font-medium">Publicités :</span> Niveau inférieur qui contient les créations
                        vidéo et les textes associés
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Spécificités TikTok</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>
                        Le budget, la zone géographique et les dates sont définis au niveau des ensembles de publicités
                      </li>
                      <li>Les URL de destination sont définies au niveau des publicités</li>
                      <li>TikTok met l'accent sur les formats vidéo courts et engageants, adaptés à sa plateforme</li>
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
                <CardTitle>Architecture des campagnes Snapchat</CardTitle>
                <CardDescription>Structure et spécificités des campagnes Snapchat Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center items-center">
                  <Image
                    src="/images/architechture-snapchat.png"
                    alt="Architechture Snapchat"
                    width={400}
                    height={267}
                    className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
                  />
                </div>

                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-primary">Structure Snapchat Ads</h3>
                    <ul className="list-disc list-inside mt-2 space-y-2">
                      <li>
                        <span className="font-medium">Groupes de campagnes :</span> Niveau supérieur qui permet
                        d'organiser les campagnes par objectif ou thématique
                      </li>
                      <li>
                        <span className="font-medium">Campagnes :</span> Niveau intermédiaire qui définit l'objectif, le
                        budget, le calendrier et le ciblage
                      </li>
                      <li>
                        <span className="font-medium">Publicités :</span> Niveau inférieur qui contient les créations
                        publicitaires (Snap Ads, Story Ads, Filters, etc.)
                      </li>
                    </ul>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-2">Spécificités Snapchat</h3>
                    <ul className="list-disc list-inside space-y-1">
                      <li>Les dates, la zone géographique et le budget sont définis au niveau de la campagne</li>
                      <li>Les URL de destination sont définies au niveau des publicités</li>
                      <li>
                        Snapchat propose des formats publicitaires uniques comme les filtres AR et les lentilles
                        interactives
                      </li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Link href="/formation/architecture-campagnes/quiz">
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

