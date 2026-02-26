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
                <div className="bg-white p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-semibold text-primary mb-4">Principe fondamental</h3>
                  <p className="text-lg mb-6">
                    Le principe est de zoomer et d'aller chercher de plus en plus dans le détail au fur et à mesure des
                    optimisations
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg border border-primary/20">
                  <h3 className="text-xl font-semibold text-primary mb-4">Objectif des optimisations</h3>
                  <p className="text-lg font-medium mb-4">
                    Le but ? Maximiser les performances des campagnes des clients.
                  </p>

                  <div className="mb-6">
                    <p className="font-medium text-primary mb-2">Tout paramétrage peut-être optimisé.</p>
                    <p className="mb-4">
                      C'est LA grande force de notre travail : nous avons des résultats concrets et chiffrés sur énormément de paramètres différents. C'est ce qui nous permet d'optimiser les campagnes.
                    </p>
                  </div>

                  <div className="mb-6">
                    <p className="mb-2">
                      Optimiser, c'est tout simplement améliorer les résultats d'une publicité en analysant ce qui fonctionne bien… et en changeant ce qui ne fonctionne pas
                      <br />💡 <span className="font-semibold">But :</span> Dépenser moins pour avoir plus de résultats (plus de clics, plus de ventes, plus de personnes intéressées).
                    </p>
                    <p className="mb-2">
                      On regarde tous les jours les campagnes, on optimise dès que c'est besoin, c'est notre force (contrairement à la programmatique)
                    </p>
                    <p className="mb-2 font-semibold">Pourquoi faire des optimisations dans les campagnes digitales :</p>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>Pertinence/qualité de la campagne (capable de payer un clic plus cher si il est pertinent pour l'annonceur)</li>
                      <li>Maximiser le ROI (dans les campagnes de conversion)</li>
                      <li>Réduire les coûts d'acquisition</li>
                      <li>Améliorer les performances grâce à l'A/B testing</li>
                      <li>Cibler les bonnes audiences</li>
                      <li>Adapter en temps réel aux évolutions du marché</li>
                    </ul>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white p-6 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-primary mb-4">Exemples d'optimisations</h3>
                    <ul className="list-disc list-inside space-y-2">
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
                    </ul>
                  </div>

                  <div className="bg-white p-6 rounded-lg border border-primary/20">
                    <h3 className="text-lg font-semibold text-primary mb-4">Qu'est-ce qu'on optimise ?</h3>
                    <p className="font-medium mb-2">Sauf cas exceptionnel :</p>

                    <div className="space-y-4 mb-4">
                      <div className="bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Campagne d'impression</span> →{" "}
                          <span className="text-green-600 font-medium border border-green-600 rounded px-2">CPM</span>{" "}
                          pour montrer au maximum
                        </p>
                        <p className="text-green-600">1 seul facteur clé d'optimisation</p>
                      </div>

                      <div className="bg-white p-3 rounded border">
                        <p>
                          <span className="font-medium">Campagne de clics</span> →{" "}
                          <span className="text-green-600 font-medium border border-green-600 rounded px-2">CPC</span>{" "}
                          pour faire cliquer au maximum & le CTR
                        </p>
                        <p className="text-green-600">1 seul facteur clé d'optimisation</p>
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
                          2 facteurs clés d'optimisation. Attention à bien prendre en compte les 2.
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
                          3 facteurs clés d'optimisation. Attention à bien prendre en compte les 3. Surtout le CPM & le ROAS
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
                            src="/images/Optimisations-audience-tableau.png"
                            alt="Optimisation des audiences"
                            width={1200}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert className="bg-white border-neutral-200">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <AlertDescription>
                            Ce tableau compare les performances des différentes audiences. Repérez les audiences avec un CPC trop élevé ou un volume trop faible pour ajuster vos ciblages et maximiser l'efficacité de la campagne.
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
                            src="/images/Optimisations-visuels-tableau.png"
                            alt="Optimisation des visuels"
                            width={1200}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert>
                          <Info className="h-4 w-4" />
                          <AlertDescription>
                            Ce tableau permet de comparer les performances des différents visuels. Gardez les visuels qui génèrent le meilleur CTR et ajustez ceux qui sous-performent pour améliorer les résultats de la campagne.
                          </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="detail">
                    <AccordionTrigger className="text-lg font-medium">Dans le détail</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="bg-white p-4 rounded-lg border border-primary/20 mb-4">
                          <p className="text-primary font-medium mb-2">
                            Une fois les audiences et les visuels optimisés, nous allons rentrer dans chaque petit détail :
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
                            src="/images/Optimisations-detail-tableau.png"
                            alt="Analyse détaillée des performances"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert className="bg-white border-neutral-200">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-700">
                            Ce tableau d'analyse détaillée permet d'identifier les segments (âge, genre, zone, etc.) qui sur-performent ou sous-performent. Ajustez vos ciblages en conséquence pour optimiser chaque paramètre de la campagne.
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
                <div className="bg-white p-6 rounded-lg border border-primary/20 mb-8">
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
                      <li>L'exemple utilisé concerne un opticien qui propose des lunettes en ligne.</li>
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
                            src="/images/Optimisations-motscles-tableau.png"
                            alt="Optimisation des mots clés"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert className="bg-white border-neutral-200">
                          <AlertTriangle className="h-4 w-4 text-red-500" />
                          <AlertDescription className="text-red-700">
Nous allons regarder à la fois le CPC et le CTR car nous sommes dans le cas d'une campagne pilotée au Clic. Ici, le mieux pour les performances de la campagne est de couper la diffusion sur les mots clés "lunettes pas cher abonnement" et "lunettes sans engagement".                            </AlertDescription>
                        </Alert>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="termes-recherche">
                    <AccordionTrigger className="text-lg font-medium">Les termes de recherche</AccordionTrigger>
                    <AccordionContent>
                      <div className="space-y-4">
                        <div className="border rounded-lg overflow-hidden">
                          <Image
                            src="/images/Optimisations-termesderecherche-tableau.png"
                            alt="Optimisation des termes de recherche"
                            width={1200}
                            height={600}
                            className="w-full h-auto"
                          />
                        </div>
                        <Alert className="bg-primary/10 border-primary/20">
                          <Info className="h-4 w-4" />
                          <AlertTitle>Analyse des termes de recherche</AlertTitle>
                          <AlertDescription className="space-y-2 mt-2">
                            <p>
                              Ce tableau permet d'identifier les termes de recherche réellement tapés par les internautes. Nous allons exclure les termes non pertinents ou trop coûteux pour améliorer la pertinence et la rentabilité de nos campagnes.
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

      {/* Quiz button removed */}
      </div>
    </div>
  )
}

