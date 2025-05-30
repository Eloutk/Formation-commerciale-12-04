"use client";

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { InfoIcon } from "lucide-react"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

export default function ArchitectureCampagnes() {
  const [showMetaImages, setShowMetaImages] = useState(false);
  const [showDisplayImages, setShowDisplayImages] = useState(false);
  const [showSearchImage, setShowSearchImage] = useState(false);
  const [showLinkedinImage, setShowLinkedinImage] = useState(false);
  const [showTiktokImage, setShowTiktokImage] = useState(false);
  const [showSnapImage, setShowSnapImage] = useState(false);

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
            <div className="my-8">
              <Image
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-28%20a%CC%80%2015.37.04-pewNNZVxNM8WAWZTAOIDEerFQyQ7rl.png"
                alt="Principe général d'architecture de campagne"
                width={1200}
                height={600}
                className="rounded-lg border shadow-sm mx-auto"
              />
            </div>

            <Alert className="mt-4 border-primary/50">
              <InfoIcon className="h-5 w-5" />
              <AlertTitle>Toujours le même principe</AlertTitle>
              <AlertDescription>
                Quelle que soit la plateforme publicitaire utilisée, cette structure hiérarchique reste la base de
                l'architecture des campagnes. Les spécificités de chaque plateforme sont détaillées dans les onglets
                correspondants.
              </AlertDescription>
            </Alert>

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
          </CardContent>
        </Card>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="flex justify-between w-full mb-8 px-6">
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
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowMetaImages(!showMetaImages)}
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
                  >
                    {showMetaImages ? "Masquer l'image" : "Afficher l'image"}
                  </button>
                </div>
                {showMetaImages && (
                  <div className="flex flex-col md:flex-row gap-6 justify-center items-center mt-4">
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
                )}
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

                  {/* Tableau récapitulatif déplacé ici */}
                  <Accordion type="single" collapsible className="w-full border rounded-lg p-4 bg-muted/30 mt-8">
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
                            src="/images/Recap-possible-META.png"
                            alt="Tableau récapitulatif des possibilités META"
                            width={1000}
                            height={448}
                            className="rounded-lg border shadow-sm w-full max-w-2xl mx-auto"
                          />
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

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
              <CardContent className="space-y-8">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowDisplayImages(!showDisplayImages)}
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
                  >
                    {showDisplayImages ? "Masquer l'image" : "Afficher l'image"}
                  </button>
                </div>
                {showDisplayImages && (
                  <div className="flex flex-col gap-6 justify-center items-center mt-4">
                    <Image
                      src="/images/architechture-display-efs.png"
                      alt="Architechture Display EFS"
                      width={576}
                      height={384}
                      className="rounded-lg border shadow-sm w-full max-w-lg mx-auto"
                    />
                    <Image
                      src="/images/display-architechture-zone.png"
                      alt="Display architechture Zone"
                      width={576}
                      height={384}
                      className="rounded-lg border shadow-sm w-full max-w-lg mx-auto"
                    />
                  </div>
                )}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Niveau <span className='text-blue-700'>Campagne</span> <span className="font-normal">(ex. : "Avril 25 - EFS AURA MDD Part Dieu")</span></h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>C'est ici que l'on définit les grandes lignes : type de campagne, réseau de diffusion, objectifs.</li>
                      <li>Ce niveau sert de base à toute la structure : c'est le <span className="font-semibold">"cadre général "</span> de la campagne.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Niveau <span className='text-blue-700'>Groupe d'annonces</span> <span className="font-normal">(ex. : "Audience mots clés", "Placement site web")</span></h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>C'est ici que l'on paramètre les audiences : qui l'on souhaite toucher (en fonction de leur comportement, de leurs intérêts ou de leur navigation).</li>
                      <li>On crée plusieurs groupes pour tester différentes approches et comparer ce qui fonctionne le mieux.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Niveau <span className='text-blue-700'>Annonce</span></h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li>C'est là qu'on construit le message : visuels, titres, descriptions.</li>
                      <li>Ces éléments sont ceux que verront les internautes : ils doivent capter l'attention et donner envie d'en savoir plus.</li>
                    </ul>
                  </div>
                  <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                    <span className="font-semibold text-blue-700">À retenir :</span> <br />
                    Une bonne organisation permet de tester différentes cibles tout en gardant un message adapté à chacune.
                  </div>
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
              <CardContent className="space-y-8">
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowSearchImage(!showSearchImage)}
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
                  >
                    {showSearchImage ? "Masquer l'image" : "Afficher l'image"}
                  </button>
                </div>
                {showSearchImage && (
                  <div className="flex justify-center items-center mt-4">
                    <Image
                      src="/images/exemple-efs-google-search.png"
                      alt="Exemple EFS - Google Search"
                      width={576}
                      height={384}
                      className="rounded-lg border shadow-sm w-full max-w-lg mx-auto"
                    />
                  </div>
                )}
                <div className="space-y-8">
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Niveau <span className='text-blue-700'>Campagne</span></h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><span className="font-semibold">Budget quotidien :</span> c'est le plafond de dépenses par jour.</li>
                      <li><span className="font-semibold">Stratégie d'enchères :</span> pilotage automatique ou manuel des enchères (ex. : Maximiser les clics).</li>
                      <li><span className="font-semibold">Ciblage global :</span> zones géographiques, langue, type de réseau (ici : Réseau de Recherche).</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Niveau <span className='text-blue-700'>Groupe d'annonces</span> <span className="font-normal">(ex. : "Mot clé Exact", "Requête large")</span></h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><span className="font-semibold">Segmentation des mots-clés selon leur type de correspondance :</span></li>
                      <ul className="list-disc list-inside ml-8 space-y-1">
                        <li><span className="font-semibold">Mot clé exact :</span> très ciblé, touche les intentions précises.</li>
                        <li><span className="font-semibold">Expression exacte :</span> plus souple, mais garde l'ordre des mots.</li>
                        <li><span className="font-semibold">Requête large :</span> capte plus de volume mais moins précis</li>
                      </ul>
                      <li><span className="font-semibold">Objectif :</span> adapter les messages publicitaires au niveau d'intention de l'utilisateur.</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary mb-2">Niveau <span className='text-blue-700'>Annonce</span></h3>
                    <ul className="list-disc list-inside ml-4 space-y-1">
                      <li><span className="font-semibold">Texte de l'annonce :</span> titre, description, URL affichée</li>
                      <li><span className="font-semibold">Extensions :</span> liens annexes, numéros de téléphone, lieu, etc.</li>
                      <li><span className="font-semibold">Test A/B possible :</span> pour identifier quels arguments ou formulations convertissent le mieux.</li>
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
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowLinkedinImage(!showLinkedinImage)}
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
                  >
                    {showLinkedinImage ? "Masquer l'image" : "Afficher l'image"}
                  </button>
                </div>
                {showLinkedinImage && (
                  <div className="flex justify-center items-center mt-4">
                    <Image
                      src="/images/exemple-architechture-linkedin.png"
                      alt="Exemple architechture Linkedin"
                      width={320}
                      height={213}
                      className="rounded-lg border shadow-sm w-full max-w-xs mx-auto"
                    />
                  </div>
                )}

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
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowTiktokImage(!showTiktokImage)}
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
                  >
                    {showTiktokImage ? "Masquer l'image" : "Afficher l'image"}
                  </button>
                </div>
                {showTiktokImage && (
                  <div className="flex justify-center items-center mt-4">
                    <Image
                      src="/images/architechture-tiktok.png"
                      alt="Architechture Tiktok"
                      width={400}
                      height={267}
                      className="rounded-lg border shadow-sm w-full max-w-sm mx-auto"
                    />
                  </div>
                )}

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
                <div className="flex justify-center">
                  <button
                    onClick={() => setShowSnapImage(!showSnapImage)}
                    className="px-4 py-2 bg-primary text-white rounded shadow hover:bg-primary/80 transition"
                  >
                    {showSnapImage ? "Masquer l'image" : "Afficher l'image"}
                  </button>
                </div>
                {showSnapImage && (
                  <div className="flex justify-center items-center mt-4">
                    <Image
                      src="/images/architechture-snapchat.png"
                      alt="Architechture Snapchat"
                      width={576}
                      height={384}
                      className="rounded-lg border shadow-sm w-full max-w-lg mx-auto"
                    />
                  </div>
                )}

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

