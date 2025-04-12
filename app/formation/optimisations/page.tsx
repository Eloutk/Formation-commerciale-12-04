import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, Info, AlertTriangle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

export default function Optimisations() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Optimisations</h1>

        <Tabs defaultValue="overview" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
            <TabsTrigger value="general">Cas généraux</TabsTrigger>
            <TabsTrigger value="google">Google Search</TabsTrigger>
          </TabsList>

          {/* Onglet Vue d'ensemble */}
          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Principes d'optimisation</CardTitle>
                <CardDescription>Comprendre les bases de l'optimisation des campagnes publicitaires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-semibold text-primary mb-4">Principe fondamental</h3>
                  <p className="text-lg mb-6">
                    Le principe est de zoomer et d'aller chercher de plus en plus dans le détail au fur et à mesure des
                    optimisations
                  </p>

                  <div className="bg-white p-4 rounded-lg border mb-6">
                    <p className="font-medium">Exemple concret :</p>
                    <p>
                      Nous prendrons comme exemple la campagne EFS Nouvelle Aquitaine qui a pour objectif des clics.
                      Pour rappel sur une campagne de clics, nous allons optimiser sur le CPC en gardant un œil sur les
                      CTR.
                    </p>
                  </div>
                </div>

                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-semibold text-primary mb-4">Objectif des optimisations</h3>
                  <p className="text-lg font-medium mb-4">
                    Le but ? Maximiser les performances des campagnes des clients.
                  </p>

                  <div className="mb-6">
                    <p className="font-medium text-primary mb-2">Tout paramétrage peut-être optimisé.</p>
                    <p className="mb-4">
                      C'est LA grande force du web : nous avons des résultats concrets et chiffrés sur énormément de
                      paramètres différents. C'est ce qui nous permet d'optimiser les campagnes.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-primary mb-4">Exemples d'optimisations</h3>
                    <ol className="list-decimal list-inside space-y-2">
                      <li>Les visuels</li>
                      <li>Les genres</li>
                      <li>Les âges</li>
                      <li>Les plateformes</li>
                      <li>Les placements</li>
                      <li>Les zones</li>
                      <li>Les audiences</li>
                      <li>Les mots clés</li>
                      <li>Les sites web / chaînes Youtube</li>
                      <li>Heure de diffusion</li>
                      <li>Etc</li>
                    </ol>
                  </div>

                  <div className="bg-primary/5 p-6 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-primary mb-4">Qu'est-ce qu'on optimise ?</h3>
                    <p className="font-medium mb-2">Sauf cas exceptionnel :</p>

                    <div className="space-y-4 mb-4">
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Campagne d'impression</span> →{" "}
                          <span className="text-green-600 font-medium border border-green-600 rounded px-2">CPM</span>{" "}
                          pour montrer au maximum
                        </p>
                        <p className="text-green-600">1 seul facteur d'optimisation</p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Campagne de clics</span> →{" "}
                          <span className="text-green-600 font-medium border border-green-600 rounded px-2">CPC</span>{" "}
                          pour faire cliquer au maximum & le CTR
                        </p>
                        <p className="text-green-600">1 seul facteur d'optimisation</p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Campagne de leads</span> →{" "}
                          <span className="text-green-600 font-medium border border-green-600 rounded px-2">
                            CPM & CPL
                          </span>{" "}
                          pour faire remplir un maximum de formulaire
                        </p>
                        <p className="text-green-600">
                          2 facteurs d'optimisation. Attention à bien prendre en compte les 2.
                        </p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Campagne de conversion</span> →{" "}
                          <span className="text-green-600 font-medium border border-green-600 rounded px-2">
                            CPM & CPA & ROAS
                          </span>
                        </p>
                        <p className="text-green-600">
                          3 facteurs d'optimisation. Attention à bien prendre en compte les 3. Surtout le CPM & le ROAS
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <Alert className="border-primary/50 bg-primary/10">
                  <Info className="h-4 w-4" />
                  <AlertDescription>
                    <p className="font-medium">
                      L'optimisation est un processus continu qui nécessite une analyse régulière des données et des
                      ajustements en fonction des résultats obtenus. Plus vous avez de données, plus vos optimisations
                      seront précises et efficaces.
                    </p>
                  </AlertDescription>
                </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Cas généraux */}
          <TabsContent value="general">
            <Card>
              <CardHeader>
                <CardTitle>Cas généraux d'optimisation</CardTitle>
                <CardDescription>Stratégies d'optimisation pour différents types de campagnes</CardDescription>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full mb-8">
                  <AccordionItem value="audiences">
                    <AccordionTrigger className="text-lg font-medium">Les audiences</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cas%20ge%CC%81ne%CC%81raux-Les%20audiences-6rlwnvpJcvxAa8Ds5l3cyRsfZIbEXL.png"
                            alt="Optimisation des audiences"
                            width={1200}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Dans cet exemple, les 3 audiences encadrées sont à couper car elles présentent un CPC trop
                            élevé par rapport aux autres audiences. Attention toutefois à maintenir un minimum de
                            dépenses pour chaque segment conservé.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="visuels">
                    <AccordionTrigger className="text-lg font-medium">Les visuels</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cas%20ge%CC%81ne%CC%81raux-Les%20visuels-ultUv6ePxxMsBsqxjcmBz3ll1jD4iE.png"
                            alt="Optimisation des visuels"
                            width={1200}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Lorsque les statistiques sont relativement proches entre deux visuels, comme dans cet
                            exemple, les deux peuvent être conservés pour maintenir une variété dans la campagne.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="detail">
                    <AccordionTrigger className="text-lg font-medium">Dans le détail</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="bg-primary/5 p-4 rounded-lg border border-primary/20 mb-4">
                          <p className="text-primary font-medium mb-2">
                            Une fois les audiences et les visuels optimisés, nous allons rentrer dans chaque petit
                            détail :
                          </p>
                          <ul className="list-disc list-inside space-y-1 ml-4">
                            <li>Âges</li>
                            <li>Genres</li>
                            <li>Zones</li>
                            <li>Appareils</li>
                            <li>Plateformes</li>
                            <li>Etc...</li>
                          </ul>
                        </div>

                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/cas%20ge%CC%81ne%CC%81raux-Dans%20le%20de%CC%81tail-rapUErBnEOYqFJMFu0pP9HQf7EGEwR.png"
                            alt="Analyse détaillée des performances"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert variant="destructive">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Dans cet exemple, on constate que les femmes doivent être enlevées de cette audience
                            particulière car leur CPC est significativement plus élevé (0,81 €) que celui des hommes
                            (0,35 €).
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google Search */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Optimisations Google Search</CardTitle>
                <CardDescription>Techniques spécifiques pour optimiser les campagnes Google Search</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-primary/5 p-6 rounded-lg border border-primary/20 mb-8">
                  <h3 className="text-xl font-semibold text-primary mb-4">Introduction</h3>

                  <div className="bg-white p-4 rounded-lg border">
                    <p className="font-medium text-primary mb-2">Points clés :</p>
                    <ul className="list-disc list-inside space-y-2">
                      <li>
                        Google Search est particulier : les optimisations sont entièrement basées sur les mots clés et
                        les termes de recherches.
                      </li>
                      <li>
                        Le terme de recherche est ce que l'utilisateur a écrit avant de cliquer sur notre publicité.
                      </li>
                      <li>L'exemple utilisé concerne un camping.</li>
                    </ul>
                  </div>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="mots-cles">
                    <AccordionTrigger className="text-lg font-medium">Les mots clés</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Search-les%20mots%20cles-uPMiP64tMKgfrz1b6BYfAYGW6zOScT.png"
                            alt="Optimisation des mots clés"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Alert className="bg-green-50 border-green-200">
                            <Info className="h-4 w-4 text-green-500" />
                            <AlertDescription className="text-green-700">
                              <span className="font-medium">Très bon CTR</span> - Les mots clés avec un CTR élevé (comme
                              29,39% et 31,85%) sont performants et doivent être conservés.
                            </AlertDescription>
                          </Alert>

                          <Alert className="bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">
                              <span className="font-medium">Trop chère. À couper</span> - Les mots clés avec un CPC trop
                              élevé (0,85 €) doivent être supprimés pour optimiser le budget.
                            </AlertDescription>
                          </Alert>

                          <Alert className="bg-amber-50 border-amber-200">
                            <Info className="h-4 w-4 text-amber-500" />
                            <AlertDescription className="text-amber-700">
                              <span className="font-medium">Trop peu de dépenses pour optimiser</span> - Certains mots
                              clés n'ont pas assez de données (dépenses trop faibles) pour prendre une décision
                              éclairée.
                            </AlertDescription>
                          </Alert>

                          <Alert className="bg-red-50 border-red-200">
                            <AlertTriangle className="h-4 w-4 text-red-500" />
                            <AlertDescription className="text-red-700">
                              <span className="font-medium">Problème de budget</span> - Le budget global semble trop
                              faible pour cette campagne, ce qui limite les possibilités d'optimisation.
                            </AlertDescription>
                          </Alert>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="termes-recherche">
                    <AccordionTrigger className="text-lg font-medium">Les termes de recherche</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Search-les%20termes%20de%20recherchee%CC%81-EPgeZ136r6xquqguqkaJS2lqDcX7tO.png"
                            alt="Optimisation des termes de recherche"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                          />
                        </div>

                        <Alert className="bg-primary/10 border-primary/20">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Processus d'optimisation des termes de recherche</AlertTitle>
                          <AlertDescription className="space-y-2 mt-2">
                            <p>
                              1. Analyser toutes les recherches qui ont été effectuées pour arriver à montrer notre
                              publicité
                            </p>
                            <p>2. Trier et exclure ce qui n'est pas pertinent pour ne pas perdre d'argent</p>
                            <p>
                              3. Identifier les termes qui ne correspondent pas à l'activité du client (ex: "Ce n'est
                              pas un camping vacaf", "Notre client ne vend pas de mobil home")
                            </p>
                            <p>
                              4. Exclure ces termes pour optimiser le budget et améliorer la pertinence des annonces
                            </p>
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Link href="/formation/optimisations/quiz">
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

