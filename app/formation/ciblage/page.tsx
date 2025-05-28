"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, AlertTriangle, Info, X } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

export default function Ciblage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Ciblage</h1>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Introduction au ciblage publicitaire</CardTitle>
              <CardDescription>
                Comprendre les différentes options de ciblage disponibles sur les plateformes publicitaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le ciblage est un élément essentiel de toute stratégie publicitaire digitale. Il permet de définir
                précisément qui verra vos annonces, optimisant ainsi votre budget et maximisant l'efficacité de vos
                campagnes. Chaque plateforme offre des options de ciblage spécifiques, adaptées à son audience et à ses
                fonctionnalités.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ciblage démographique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Âge, sexe, situation familiale, niveau d'éducation, profession... Ces critères permettent de cibler des segments spécifiques de la population.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ciblage géographique</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Pays, régions, villes, codes postaux ou rayon autour d'un point précis. Permet de cibler des zones géographiques spécifiques.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Ciblage par centres d'intérêt</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Basé sur les intérêts, comportements et préférences des utilisateurs, déterminés par leur activité en ligne.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Retargeting & Look alike</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Cible les utilisateurs ayant déjà interagi avec votre marque, site web ou application (retargeting), ainsi que des profils similaires à ces utilisateurs (look alike), pour élargir votre audience tout en restant pertinent.
                    </p>
                  </CardContent>
                </Card>
              </div>
              <div className="flex justify-center my-2">
                <div className="bg-primary/10 border border-primary/20 rounded px-4 py-2 text-primary font-semibold text-center">
                  Le groupe "All" sert de ciblage générique, basé uniquement sur deux critères : l'âge et la localisation. Nous y reviendrons souvent.
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-7 mb-8">
            <TabsTrigger value="meta">META</TabsTrigger>
            <TabsTrigger value="search">Google Search</TabsTrigger>
            <TabsTrigger value="google">Google/YouTube</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="snap">Snapchat</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
          </TabsList>

          {/* Onglet META */}
          <TabsContent value="meta">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage META (Facebook & Instagram)</CardTitle>
                <CardDescription>
                  Découvrez les différentes possibilités de ciblage sur Facebook et Instagram
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Paramètres de base</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-white" />
                        </span>
                        <span>Calendrier de diffusion</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-white" />
                        </span>
                        <span>Ciblage âge et genre</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-white" />
                        </span>
                        <span>Ciblage par pays, régions, villes et rayons</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-white" />
                        </span>
                        <span>Diffusion sur une ou plusieurs plateformes (Insta ou Facebook seul)</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-red-100 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-red-500" />
                        </span>
                        <span>Ciblage mineurs</span>
                      </li>
                    </ul>

                    <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertDescription>
                        Attention : ne pas trop restreindre les ciblages, ni les zones géographiques.
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Types de ciblage avancés</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="retargeting">
                        <AccordionTrigger>Retargeting</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li>Re-cibler toutes les personnes qui ont interagi avec la page Facebook/Instagram du client</li>
                            <li>Re-cibler toutes les personnes qui ont interagi avec le site web du client (Pixel)</li>
                            <li>Options : achat, ajout au panier, inscription...</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="lookalike">
                        <AccordionTrigger>Look alike</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li>Profils similaires à ceux qui ont interagi avec la page Facebook</li>
                            <li>Profils similaires des personnes qui ont déjà acheté (Look alike achat, ajouté au panier, inscription...)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="categories">
                        <AccordionTrigger>Catégories spéciales</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li>Crédit (carte de crédit, prêts auto, financement ou autres offres similaires)</li>
                            <li>Emploi (offres d'emploi, stages, programmes de certification pro ou autres)</li>
                            <li>Logement (annonces immobilières, assurances habitations, prêts immobiliers ou autres offres similaires)</li>
                            <li>Enjeu social, électoral ou politique (économie ou les droits, civiques, sociaux, élections ou des personnalités ou campagnes)</li>
                          </ul>
                          <p className="mt-2 text-sm text-muted-foreground">
                            Sur ces catégories, nous diffuserons sans ciblage, 18/65+, dans un rayon de 50km min.
                          </p>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                {/* Séparation visuelle possible / difficile / impossible */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                    <h4 className="font-bold text-green-700 mb-2">Ciblages possibles</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Famille, parents, parents d'enfants de 0 à 26 ans</li>
                      <li>Situation familiale (en couple, célibataire, marié, parents, ...)</li>
                      <li>Étudiants</li>
                      <li>CSP</li>
                      <li>Centres d'intérêts</li>
                      <li>Anniversaires</li>
                      <li>Employeur (certains)</li>
                      <li>Métier (certains)</li>
                      <li>Retargeting & Look alike</li>
                    </ul>
                  </div>
                  <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded">
                    <h4 className="font-bold text-orange-700 mb-2">Ciblages possibles mais difficiles</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Entreprises ou chefs d'entreprises dans un secteur particulier</li>
                      <li>Campagnes : Alcool / Tabac / Cigarette électronique, Jeux d'argent, Sang, Nudité</li>
                      <li>Catégories spéciales (voir ci-dessus) : diffusion sans ciblage</li>
                    </ul>
                  </div>
                  <div className="bg-gray-100 border-l-4 border-gray-400 p-4 rounded">
                    <h4 className="font-bold text-gray-700 mb-2">Ciblages impossibles</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Certains secteurs très réglementés ou interdits par META</li>
                    </ul>
                  </div>
                </div>

                {/* Exemples META */}
                <AfficherExempleMeta />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google Search */}
          <TabsContent value="search">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage Google Search</CardTitle>
                <CardDescription>
                  Découvrez les spécificités du ciblage sur Google Search
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex flex-col items-center justify-center">
                  <img src="/images/Capture-decran-2025-05-23-15-23-41.png" alt="Exemple restaurant Bordeaux Search" className="max-w-xs md:max-w-md rounded shadow mx-auto" />
                </div>
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Spécificités Google Search</h3>
                  {/* Bloc d'options avec icônes */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Calendrier de diffusion</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage âge et genre</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage par pays, régions, villes et rayons</span>
                    </div>
                  </div>

                  <Alert className="mb-4 border-primary/50">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Peu importe les mots de liaison, les minuscules/majuscules ou les fautes d'orthographe.
                    </AlertDescription>
                  </Alert>

                  <div className="mt-6">
                    <h3 className="text-lg font-semibold mb-4">Types de correspondance des mots clés</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Requête large</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Permet à votre annonce de s'afficher sur des recherches contenant des synonymes, des expressions connexes et des variations.
                          </p>
                          <p className="text-sm mt-2">
                            Moins précis mais permet à l'algorithme de faire de nombreux tests et d'avoir de nouvelles idées.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Expression exacte</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Votre annonce peut s'afficher lorsque les termes de recherche incluent l'expression exacte que vous avez spécifiée, avec des mots avant ou après, mais pas entre les mots de l'expression.
                          </p>
                          <p className="text-sm mt-2">
                            Plus de flexibilité que les mots clés exacts sans être trop large.
                          </p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-base">Mot clé exact</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm">
                            Permet de mieux contrôler l'audience qui voit votre annonce. Votre annonce est susceptible d'apparaître uniquement lorsque l'utilisateur saisit exactement le terme de recherche spécifié.
                          </p>
                          <p className="text-sm mt-2">Très précis mais limite les possibilités de l'algorithme.</p>
                        </CardContent>
                      </Card>
                    </div>
                  </div>
                </div>
                {/* BOUTON AFFICHER L'EXEMPLE RESTAURANT BORDEAUX */}
                <AfficherExempleSearch />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google/YouTube (Display & YouTube uniquement) */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage Google Display & YouTube</CardTitle>
                <CardDescription>
                  Découvrez les différentes possibilités de ciblage sur Google Display et YouTube
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="mt-4">
                  <h3 className="text-lg font-semibold mb-4">Options de ciblage Display & YouTube</h3>
                  {/* Bloc d'options avec icônes */}
                  <div className="mb-6 space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage âge et genre possible</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage par pays, régions, villes et rayons</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage pour les mineurs</span>
                    </div>
                    <li className="flex items-start">
                      <span className="bg-red-100 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-red-500" />
                      </span>
                      <span>Pas de campagne de clics en dessous de 18 ans</span>
                    </li>
                  </div>
                  <p className="mb-4">
                    En Display ou YouTube, le ciblage par audience consiste à toucher des personnes selon qui elles sont (comportements, intérêts, intentions), tandis que le ciblage par placement permet de choisir précisément où les annonces s'affichent (sites, vidéos ou chaînes spécifiques).
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* Colonne Audiences */}
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-primary">Audiences</h4>
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="audience-interests">
                          <AccordionTrigger>Audience - centres d'intérêt</AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-2">Intérêts de l'audience (liste non exhaustive)</p>
                            <p className="mb-4">
                              <span className="font-medium">Exemple :</span> Nous allons sélectionner les centres d'intérêt des internautes.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                              <div>
                                <h4 className="font-medium mb-1">Centres d'intérêt populaires :</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Sports et fitness</li>
                                  <li>Technologie</li>
                                  <li>Voyage</li>
                                  <li>Mode et beauté</li>
                                  <li>Alimentation et cuisine</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Centres d'intérêt spécifiques :</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Jeux vidéo</li>
                                  <li>Automobile</li>
                                  <li>Finance personnelle</li>
                                  <li>Parentalité</li>
                                  <li>Décoration d'intérieur</li>
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="audience-keywords">
                          <AccordionTrigger>Audience - mots clés</AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-2">
                              Retargeting des personnes ayant récemment tapé des mots clés spécifiques.
                            </p>
                            <p className="mb-4">
                              <span className="font-medium">Exemple :</span> Nous avons paramétré le mot clé « Accessoires animaux » dans notre audience. Si l'internaute tape ce mot clé dans le moteur de recherche, nous allons pouvoir le toucher sur un site web/chaîne YouTube avec un emplacement publicitaire.
                            </p>
                            <Alert className="mt-2 border-primary/50 bg-primary/10">
                              <Info className="h-4 w-4" />
                              <AlertDescription>
                                Cette option permet de cibler des utilisateurs en fonction de leurs recherches récentes, même lorsqu'ils naviguent sur d'autres sites ou regardent des vidéos YouTube.
                              </AlertDescription>
                            </Alert>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="audience-website">
                          <AccordionTrigger>Audience - site web</AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-2">
                              Retargeting des personnes ayant été sur des sites spécifiques ou des chaînes pour YouTube
                            </p>
                            <p className="mb-4">
                              <span className="font-medium">Exemple :</span> Nous avons paramétré le site web « Maxi Zoo » dans notre audience. Si l'internaute se rend sur le site ou la chaîne YouTube de Maxi Zoo, nous allons pouvoir le toucher sur un autre site web avec un emplacement publicitaire.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                    {/* Colonne Placements */}
                    <div>
                      <h4 className="font-bold text-lg mb-2 text-primary">Placements</h4>
                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="placement-themes">
                          <AccordionTrigger>Placement - Thèmes</AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-2">
                              Thématiques de site ou des chaînes pour YouTube (Liste non exhaustive)
                            </p>
                            <p className="mb-4">
                              <span className="font-medium">Exemple :</span> Nous allons sélectionner les thèmes de site/chaînes YouTube où nous pouvons positionner la publicité.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm">
                              <div>
                                <h4 className="font-medium mb-1">Thèmes populaires :</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Arts & Divertissement</li>
                                  <li>Automobile</li>
                                  <li>Beauté & Fitness</li>
                                  <li>Livres & Littérature</li>
                                  <li>Business & Industrie</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Thèmes spécifiques :</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Informatique & Électronique</li>
                                  <li>Finance</li>
                                  <li>Alimentation & Boissons</li>
                                  <li>Jeux</li>
                                  <li>Santé</li>
                                </ul>
                              </div>
                              <div>
                                <h4 className="font-medium mb-1">Autres thèmes :</h4>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Maison & Jardin</li>
                                  <li>Internet & Télécoms</li>
                                  <li>Emploi & Éducation</li>
                                  <li>Actualités</li>
                                  <li>Shopping</li>
                                </ul>
                              </div>
                            </div>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="placement-keywords">
                          <AccordionTrigger>Placement - mots clés</AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-2">
                              Sites avec des mots clés spécifiques sur la page ou des chaînes pour YouTube
                            </p>
                            <p className="mb-4">
                              <span className="font-medium">Exemple :</span> Nous allons positionner la publicité sur des sites/chaînes YouTube contenant des mots clés spécifiques.
                            </p>
                            <p className="mb-2">
                              Si le site contient le mot clé « Accessoires animaux », nous allons pouvoir positionner la publicité.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                        <AccordionItem value="placement-website">
                          <AccordionTrigger>Placement - site web</AccordionTrigger>
                          <AccordionContent>
                            <p className="mb-2">
                              Ciblage sites en particulier (si disponible) ou des chaînes pour YouTube (si disponible)
                            </p>
                            <p className="mb-4">
                              <span className="font-medium">Exemple :</span> Nous allons positionner la publicité sur des sites/chaînes YouTube (avec des emplacements publicitaires) en lien avec l'activité du client/sujet de la campagne.
                            </p>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet LinkedIn */}
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage LinkedIn</CardTitle>
                <CardDescription>Découvrez les différentes possibilités de ciblage sur LinkedIn Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Paramètres de base</h3>
                    <ul className="space-y-2">
                      <li className="flex items-start">
                        <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-white" />
                        </span>
                        <span>Calendrier de diffusion possible</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-red-100 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-red-500" />
                        </span>
                        <span>Ciblage âge et genre</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                          <Info className="h-4 w-4 text-white" />
                        </span>
                        <span>Ciblage par pays, régions, villes (pas de rayon)</span>
                      </li>
                    </ul>

                    <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertDescription>
                        Attention : ciblage par âge non pertinent (LinkedIn se base sur le dernier diplôme obtenu et non
                        sur le déclaratif de l'internaute)
                      </AlertDescription>
                    </Alert>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Ciblages professionnels</h3>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Compétences professionnelles</li>
                      <li>Métiers</li>
                      <li>Études</li>
                      <li>Diplômes</li>
                      <li>Entreprises</li>
                      <li>Secteurs d'activité d'entreprise (tout n'est pas disponible)</li>
                      <li>Taille de l'entreprise</li>
                    </ul>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Retargeting</h3>
                  <p>Re-cibler les abonnés de la page du client</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet TikTok */}
          <TabsContent value="tiktok">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage TikTok</CardTitle>
                <CardDescription>Découvrez les différentes possibilités de ciblage sur TikTok Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Paramètres de base</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-red-100 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-red-500" />
                      </span>
                      <span>Calendrier de diffusion</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-100 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-red-500" />
                      </span>
                      <span>Ciblage pour les mineurs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage par pays, régions, villes (pas de rayon)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Minimum de dépense : 50 € par jour et par ciblage d'achat d'espace {">"} 50 € PDV par jour et
                        par ciblage</span>
                    </li>
                  </ul>
                </div>

                <Tabs defaultValue="geo" className="mt-6">
                  <TabsList>
                    <TabsTrigger value="geo">Zones géographiques</TabsTrigger>
                    <TabsTrigger value="interests">Centres d'intérêt</TabsTrigger>
                  </TabsList>

                  <TabsContent value="geo">
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-4">Disponibilité géographique</h3>
                      <p className="text-sm mb-4">
                        Toutes les villes ne sont pas disponibles. TikTok propose une liste exhaustive de villes
                        françaises regroupées par régions.
                      </p>
                      <Alert className="mb-4 border-primary/50">
                        <Info className="h-4 w-4" />
                        <AlertDescription>
                          TikTok peut avoir ajouté des villes depuis la création de cette formation.
                        </AlertDescription>
                      </Alert>

                      <Accordion type="multiple" className="w-full mt-4">
                        <AccordionItem value="nouvelle-aquitaine">
                          <AccordionTrigger>Nouvelle Aquitaine</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Charente</li>
                              <li>Charente Maritime (La Rochelle)</li>
                              <li>Correze</li>
                              <li>Creuse</li>
                              <li>Deux Sevres</li>
                              <li>Dordogne</li>
                              <li>Gironde (Bordeaux)</li>
                              <li>Haute Vienne</li>
                              <li>Landes</li>
                              <li>Lot et Garonne</li>
                              <li>Vienne</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="ile-de-france">
                          <AccordionTrigger>Ile de France</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Essonne</li>
                              <li>Hauts de Seine</li>
                              <li>Paris</li>
                              <li>Seine et Marne</li>
                              <li>Seine Saint Denis</li>
                              <li>Val de Marne</li>
                              <li>Val d'Oise</li>
                              <li>Yvelines (Mantes la Jolie)</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="grand-est">
                          <AccordionTrigger>Grand Est</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Ardennes</li>
                              <li>Aube</li>
                              <li>Bas rhin (Strasbourg)</li>
                              <li>Haute Marne</li>
                              <li>Haut Rhin</li>
                              <li>Marne (Reims)</li>
                              <li>Meurthe et Moselle</li>
                              <li>Meuse</li>
                              <li>Moselle</li>
                              <li>Vosges</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="hauts-de-france">
                          <AccordionTrigger>Hauts de France</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Aisne</li>
                              <li>Nord (Lille)</li>
                              <li>Oise (Beauvais)</li>
                              <li>Passe Calais</li>
                              <li>Somme (Amiens)</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="pays-de-la-loire">
                          <AccordionTrigger>Pays de la Loire</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Loire Atlantique (Nantes)</li>
                              <li>Maine et Loire (Angers)</li>
                              <li>Mayenne</li>
                              <li>Sarthe</li>
                              <li>Vendee</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="centre-val-de-loire">
                          <AccordionTrigger>Centre Val de Loire</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Cher</li>
                              <li>Eure et Loir</li>
                              <li>Indre</li>
                              <li>Indre et loire (Tours)</li>
                              <li>Loiret (Orléans)</li>
                              <li>Loire et Cher</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="bretagne">
                          <AccordionTrigger>Bretagne</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Côtes d'Armor</li>
                              <li>Finistère (Brest)</li>
                              <li>Ille et Vilaine (Rennes)</li>
                              <li>Morbihan</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="auvergne-rhone-alpes">
                          <AccordionTrigger>Auvergne Rhône Alpes</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Ain</li>
                              <li>Allier (Vichy)</li>
                              <li>Ardèche</li>
                              <li>Cantal</li>
                              <li>Drome</li>
                              <li>Haute Loire</li>
                              <li>Haute Savoie</li>
                              <li>Isère (Grenoble)</li>
                              <li>Loire (Saint Etienne)</li>
                              <li>Puy de Dome</li>
                              <li>Rhône (Lyon)</li>
                              <li>Savoie</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="paca">
                          <AccordionTrigger>PACA</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Alpes de Haute Provence (Forcalquier)</li>
                              <li>Alpes Maritimes (Grasse, Nice)</li>
                              <li>Bouches du Rhone (Marseille)</li>
                              <li>Hautes Alpes</li>
                              <li>Var</li>
                              <li>Vaucluse</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="normandie">
                          <AccordionTrigger>Normandie</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Calvados</li>
                              <li>Eure (Les Andelys)</li>
                              <li>Manche</li>
                              <li>Orne</li>
                              <li>Seine Maritime (Le Havre, Rouen)</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="bourgogne-franche-comte">
                          <AccordionTrigger>Bourgogne-Franche Comté</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Côte d'or (Dijon)</li>
                              <li>Doubs (Besançon)</li>
                              <li>Haute Saône</li>
                              <li>Jura</li>
                              <li>Nièvre</li>
                              <li>Saône et Loire</li>
                              <li>Territoire de Belfort</li>
                              <li>Yonne</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="occitanie">
                          <AccordionTrigger>Occitanie</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Ariège</li>
                              <li>Aude</li>
                              <li>Aveyron</li>
                              <li>Gard</li>
                              <li>Gers</li>
                              <li>Haute Garonne (Toulouse)</li>
                              <li>Herault (Montpellier)</li>
                              <li>Lot</li>
                              <li>Lozère</li>
                              <li>Pyrenees Orientales</li>
                              <li>Tarn</li>
                              <li>Tarn et Garonne</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="corse">
                          <AccordionTrigger>Corse</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Corse du Sud</li>
                              <li>Haute corse</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </TabsContent>

                  <TabsContent value="interests">
                    <div className="mt-4">
                      <h3 className="text-lg font-semibold mb-4">Catégories de ciblage disponibles</h3>

                      <Accordion type="multiple" className="w-full">
                        <AccordionItem value="applications">
                          <AccordionTrigger>Applications</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Réseaux sociaux</li>
                              <li>Lecteurs audios et vidéo</li>
                              <li>Actualités et lecture</li>
                              <li>Photographique</li>
                              <li>Enseignement</li>
                              <li>Courses en ligne</li>
                              <li>Services financiers</li>
                              <li>Divertissement et loisirs</li>
                              <li>Voyage</li>
                              <li>Santé et forme physique</li>
                              <li>Affaires et rentabilité</li>
                              <li>Éducation et enfants</li>
                              <li>Outils</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="beaute-soins">
                          <AccordionTrigger>Beauté et soins</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Hygiène buccodentaire</li>
                              <li>Soin capillaire</li>
                              <li>Perruques et coiffure</li>
                              <li>Soins de peau</li>
                              <li>Cosmétiques</li>
                              <li>Parfums et eaux de Cologne</li>
                              <li>Hygiène féminine</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="mode-accessoires">
                          <AccordionTrigger>Mode et accessoires</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Textiles et accessoires</li>
                              <li>Sacs</li>
                              <li>Montres</li>
                              <li>Bijoux</li>
                              <li>Chaussures</li>
                              <li>Vêtements</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="alimentation">
                          <AccordionTrigger>Alimentation et boissons</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Nourriture</li>
                              <li>Alimentation et produits frais</li>
                              <li>Boissons</li>
                              <li>Recettes</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="vehicules">
                          <AccordionTrigger>Véhicules et transports</AccordionTrigger>
                          <AccordionContent>
                            <ul className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              <li>Automobile</li>
                              <li>Accessoires automobiles</li>
                              <li>Entretien automobile</li>
                              <li>Pièces automobiles</li>
                              <li>Location de voiture</li>
                              <li>Voiture de l'occasion</li>
                              <li>Motos</li>
                              <li>Vélos</li>
                              <li>Trottinettes électriques</li>
                              <li>Véhicules aquatiques</li>
                              <li>Accessoires pour véhicules 2/3 roues</li>
                              <li>Concessions automobiles</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="jeux">
                          <AccordionTrigger>Jeux</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Jeux (par type)</li>
                              <li>Jeux mobile, jeux PC</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="services-vie-courante">
                          <AccordionTrigger>Services de la vie courante</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Photographie de mariage</li>
                              <li>Photographie</li>
                              <li>Cadeaux et fleurs</li>
                              <li>Ménage</li>
                              <li>Services de courses</li>
                              <li>Seconde main</li>
                              <li>Jardinage</li>
                              <li>Sport et remise en forme</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="appareils-technologiques">
                          <AccordionTrigger>Appareils technologiques et électroniques</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Téléphone</li>
                              <li>Ordinateur</li>
                              <li>Composants électroniques</li>
                              <li>Consoles de jeux</li>
                              <li>Accessoires informatiques</li>
                              <li>Équipement de bureaux</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="actualites-divertissement">
                          <AccordionTrigger>Actualités et divertissement</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Entreprises et économie</li>
                              <li>Science et technologie</li>
                              <li>Culture et histoire</li>
                              <li>Actions caritatives et intérêt général</li>
                              <li>Droit</li>
                              <li>Protection de l'environnement</li>
                              <li>Célébrités</li>
                              <li>Actualité mode de vie</li>
                              <li>Objets de collection et antiquités</li>
                              <li>Astrologie</li>
                              <li>Culture, art, danse, musique</li>
                              <li>Lecture</li>
                              <li>Films</li>
                              <li>Alimentation cuisine</li>
                              <li>Tourisme</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="bebes-enfants">
                          <AccordionTrigger>Bébés, enfants et maternité</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Poussette et berceaux</li>
                              <li>Lait en poudre</li>
                              <li>Couches et lingettes bébés</li>
                              <li>Literie bébé</li>
                              <li>Jouets pour enfants</li>
                              <li>Chaussure pour enfants</li>
                              <li>Siège auto</li>
                              <li>Accessoire pour alimentation enfant</li>
                              <li>Mode enfants</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="appareils">
                          <AccordionTrigger>Appareils</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Appareils de soins personnels</li>
                              <li>Appareils de cuisine et salle de bain</li>
                              <li>Gros électroménagers</li>
                              <li>Appareils ménagers</li>
                              <li>Appareils numériques</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="formation">
                          <AccordionTrigger>Formation</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Crèches et école maternelle</li>
                              <li>Enseignement primaire et secondaire</li>
                              <li>Enseignement supérieur</li>
                              <li>Études à l'étranger</li>
                              <li>Formation professionnelle</li>
                              <li>Formation en langues</li>
                              <li>Formation non universitaire (loisirs)</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="services-entreprises">
                          <AccordionTrigger>Services aux entreprises</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Immobilier et location immobilière</li>
                              <li>Équipement et fourniture de bureau</li>
                              <li>Recrutement et recherche d'emploi</li>
                              <li>Bâtiment</li>
                              <li>Dispositifs électroniques et électriques</li>
                              <li>Machine et équipements</li>
                              <li>Franchises</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="amenagement-interieur">
                          <AccordionTrigger>Aménagement intérieur</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Architecture d'intérieur</li>
                              <li>Meubles</li>
                              <li>Matériaux de constructions et éclairage</li>
                              <li>Matériel informatique et électrique</li>
                              <li>Décoration d'intérieur</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="sports-exterieur">
                          <AccordionTrigger>Sports et extérieur</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Équipement d'extérieur</li>
                              <li>Équipement de sport</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="commerce-electronique">
                          <AccordionTrigger>Commerce électronique</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Grandes surfaces</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="voyage">
                          <AccordionTrigger>Voyage</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Hôtels et hébergement</li>
                              <li>Visites guidées et attractions</li>
                              <li>Agence de voyage</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="services-financiers">
                          <AccordionTrigger>Services financiers</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Valeurs mobilières</li>
                              <li>Assurance</li>
                              <li>Bureaux et crédit</li>
                              <li>Opérations de change</li>
                              <li>Services de paiement tiers</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="animaux-compagnie">
                          <AccordionTrigger>Animaux de compagnie</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Accessoires et nourriture pour animaux</li>
                              <li>Services pour animaux</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>

                        <AccordionItem value="produits-menagers">
                          <AccordionTrigger>Produits ménagers</AccordionTrigger>
                          <AccordionContent>
                            <ul className="list-disc list-inside text-sm">
                              <li>Produits d'entretien</li>
                              <li>Produits de nettoyage</li>
                              <li>Articles ménagers</li>
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </Accordion>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Snapchat */}
          <TabsContent value="snap">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage Snapchat</CardTitle>
                <CardDescription>Découvrez les différentes possibilités de ciblage sur Snapchat Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Paramètres de base</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage par rayon à partir d'1 km</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage de 13 à 50+</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage pour les mineurs</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-red-100 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-red-500" />
                      </span>
                      <span>Pas de campagne de clics en dessous de 18 ans</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Dépenses minimales : 20 € par jour d'achat d'espace = 25 € PDV par jour</span>
                    </li>
                  </ul>

                  <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription>
                      Seule plateforme dispo pour cibler des mineurs (sans ciblage avancé)
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Centres d'intérêt disponibles</h3>

                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="shopping-mode">
                      <AccordionTrigger>Shopping et mode</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>
                            Acheteurs (automobile, dans les centres commerciaux, dans les friperies et les magasins
                            discount, de bijoux et de montres, de mode, de produits cosmétiques, de produits de luxe,
                            etc.)
                          </li>
                          <li>Amateurs de plein air</li>
                          <li>Bien-être et style de vie sain</li>
                          <li>Bricoleurs</li>
                          <li>Créateurs et fêtards</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="divertissement">
                      <AccordionTrigger>Divertissement</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Fans de fiction sous forme de conversation</li>
                          <li>
                            Gamers (fans d'e-sport, de jeux de combat et de tir à la première personne, jeux sur mobile,
                            culture geek)
                          </li>
                          <li>Fans de bandes dessinées et de films d'animation</li>
                          <li>Fans de sports (basket, fitness, course à pied, cyclisme, yoga)</li>
                          <li>
                            Fans de musique (amateurs de concerts et festivaliers, fans d'électro et de dance, hip-hop,
                            musique country, rock, pop, punk)
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="alimentation-snap">
                      <AccordionTrigger>Alimentation</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>
                            Gourmets (accros au fast-food, amateurs de bonbons et sucreries, burgers, café,
                            consommateurs de boissons non alcoolisées, de boissons énergétiques, fans de pizzas,
                            gourmets végé et bio, passionnés de cuisine)
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="mode-tendances">
                      <AccordionTrigger>Mode et tendances</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Gourous de la mode</li>
                          <li>Hipsters et précurseurs</li>
                          <li>Style de vie féminin</li>
                          <li>Style de vie masculin (hommes tirés à quatre épingles)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="finances-carriere">
                      <AccordionTrigger>Finances et carrière</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Investisseurs et entrepreneurs</li>
                          <li>Personnes attentives à l'argent</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="education-famille">
                      <AccordionTrigger>Éducation et famille</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Lycéens</li>
                          <li>Étudiants</li>
                          <li>Écoles</li>
                          <li>Parentalité</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="passions-interets">
                      <AccordionTrigger>Passions et intérêts</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Passionnés de crypto</li>
                          <li>Passionnés de grands espaces et de nature</li>
                          <li>Passionnés de maths et de sciences</li>
                          <li>
                            Passionnés de voyages (clients d'hôtels réguliers, clients de casino, grands voyageurs,
                            visiteurs de parcs d'attractions, voyageurs en famille, voyageurs internationaux réguliers,
                            voyageurs réguliers, voyageurs réguliers en avion)
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sports-loisirs">
                      <AccordionTrigger>Sports et loisirs</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>
                            Fans de sports (baseball, basketball, basketball universitaire, combats et de lutte,
                            cricket, football, football américain, football universitaire, hockey, sports aquatiques,
                            sports d'hiver, sports mécaniques, sports urbains, jeux olympiques, joueurs de golf,
                            passionnés de tennis et sports de raquette)
                          </li>
                          <li>Fans de fitness (course à pied, cyclisme, yoga)</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="medias-divertissement">
                      <AccordionTrigger>Médias et divertissement</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>
                            Fans de TV et de cinéma (fans d'émissions de découverte de talents, de comédies, de films
                            d'horreur, de supers héros, dramatiques, de films et comédie romantiques, fantastiques et de
                            science-fiction, de films indépendants et étrangers, de films pour adolescents et jeunes
                            adultes, films pour toute la famille, de films à suspense et policiers, fans de talk-shows,
                            fans de thrillers et de films d'action, fans de télé-réalité, fans de grand écran,
                            visionneurs de vidéos sur internet)
                          </li>
                          <li>
                            Personnes qui suivent l'actualité (personnes qui suivent l'actualité des stars, l'actualité
                            politique, économique)
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="technologie-gadgets">
                      <AccordionTrigger>Technologie et gadgets</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Fans de gadgets et de technologie</li>
                          <li>Personnes qui recherchent un nouveau téléphone</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="divers">
                      <AccordionTrigger>Divers</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Amis des animaux</li>
                          <li>Aventuriers dans l'âme</li>
                          <li>Clubbers et fêtards</li>
                          <li>Expert de l'art et de la culture</li>
                          <li>Expert en beauté</li>
                          <li>Experts en décoration d'intérieur</li>
                          <li>Fans d'automobile</li>
                          <li>Fans de mèmes</li>
                          <li>Personnes qui ne boivent qu'en société (amateurs de vins, de bières, de spiritueux)</li>
                          <li>Philanthropes</li>
                          <li>Photographes</li>
                          <li>Rats de bibliothèques et gros lecteurs</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Spotify */}
          <TabsContent value="spotify">
            <Card>
              <CardHeader>
                <CardTitle>Options de ciblage Spotify</CardTitle>
                <CardDescription>Découvrez les différentes possibilités de ciblage sur Spotify Ads</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Paramètres de base</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Calendrier de diffusion possible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage âge et genre possible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage par pays, régions, villes (pas de rayon)</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Ciblage pour les mineurs possible</span>
                    </li>
                    <li className="flex items-start">
                      <span className="bg-green-300 rounded-full p-1 flex items-center justify-center mr-3">
                        <Info className="h-4 w-4 text-white" />
                      </span>
                      <span>Dépenses minimales : investissement mini 250 € d'achat d'espace {">"} 625 € PDV</span>
                    </li>
                  </ul>

                  <Alert className="mt-4 border-amber-500/50 bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription>
                      Le ciblage par département n'est pas disponible. Attention, si vous souhaitez diffuser sur
                      Toulouse, seule la ville de Toulouse sera sélectionnée. Nous ne diffuserons pas sur la périphérie
                      de Toulouse.
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Options de ciblage avancées</h3>
                  <ul className="space-y-2">
                    <li className="flex items-start">
                      <span className="bg-primary/10 text-primary rounded-full p-1 mr-2 mt-0.5">
                        <Info className="h-4 w-4" />
                      </span>
                      <span>
                        Il est maintenant possible de cibler par intérêts (plusieurs peuvent être sélectionnés dans une
                        même campagne) mais également par communauté de fans (en choisissant certains artistes par leurs
                        noms)
                      </span>
                    </li>
                  </ul>

                  <Alert className="mt-4 border-primary/50">
                    <Info className="h-4 w-4" />
                    <AlertTitle>Étude de potentiel INCONTOURNABLE !</AlertTitle>
                    <AlertDescription>
                      L'équipe doit vérifier le nombre de compte dispo et vous donner le nombre d'impressions max nous
                      pouvons réaliser sur la zone demandée.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Centres d'intérêt disponibles</h3>

                  <Accordion type="multiple" className="w-full">
                    <AccordionItem value="culture-pop">
                      <AccordionTrigger>Culture et divertissement</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Cinéma</li>
                          <li>Cuisine</li>
                          <li>Jeux vidéo</li>
                          <li>Livres et littérature</li>
                          <li>Musique</li>
                          <li>Télévision</li>
                          <li>Films d'humour</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="sports">
                      <AccordionTrigger>Sports</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Football américain</li>
                          <li>Courses automobiles</li>
                          <li>Baseball</li>
                          <li>Basketball</li>
                          <li>Sports universitaires</li>
                          <li>Cyclisme</li>
                          <li>Volleyball</li>
                          <li>Football</li>
                          <li>Golf</li>
                          <li>Tennis</li>
                          <li>Sports extrêmes</li>
                          <li>Ligue fantasy</li>
                          <li>Cricket</li>
                          <li>Vélo</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="business-finance">
                      <AccordionTrigger>Business et finance</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Ressources humaines</li>
                          <li>Technologie et affaires</li>
                          <li>Gestion</li>
                          <li>Marketing et publicité</li>
                          <li>Secteur des technologies</li>
                          <li>Leadership exécutif et management</li>
                          <li>Entreprises et finances</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="shopping">
                      <AccordionTrigger>Shopping</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Mode</li>
                          <li>Beauté</li>
                          <li>Produits de beauté</li>
                          <li>Tendances de mode</li>
                          <li>Soins personnels</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="lifestyle">
                      <AccordionTrigger>Style de vie</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Fitness et exercice physique</li>
                          <li>Course et jogging</li>
                          <li>Vie saine</li>
                          <li>Jardinage</li>
                          <li>Aménagement intérieur</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="famille-relations">
                      <AccordionTrigger>Famille et relations</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Parents</li>
                          <li>Famille et relations</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="education">
                      <AccordionTrigger>Éducation</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Enseignement supérieur</li>
                          <li>Étudier et se concentrer</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="voyages">
                      <AccordionTrigger>Voyages</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Voyage d'aventure</li>
                          <li>Escapades à la plage</li>
                          <li>Voyages en famille</li>
                          <li>Road trips</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="technologie-informatique">
                      <AccordionTrigger>Technologie et informatique</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Technologie</li>
                          <li>Informatique</li>
                          <li>Téléphonie mobile</li>
                          <li>Réseaux sociaux</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="jeux-video">
                      <AccordionTrigger>Jeux vidéo</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Jeux vidéo d'action et d'aventure</li>
                          <li>Jeux sur mobile</li>
                          <li>Jeux PC</li>
                          <li>RPG</li>
                          <li>eSports</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="automobile">
                      <AccordionTrigger>Automobile</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Automobile</li>
                          <li>Voitures et véhicules</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="alimentation-boissons">
                      <AccordionTrigger>Alimentation et boissons</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Boissons alcoolisées</li>
                          <li>Barbecues et grillades</li>
                          <li>Cuisine</li>
                          <li>Alimentation et boissons</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="arts-sciences">
                      <AccordionTrigger>Arts et sciences</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Arts et sciences humaines : histoire</li>
                          <li>Médecine et soins de santé</li>
                          <li>Beaux-arts</li>
                          <li>Théâtre</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="evenements-celebrations">
                      <AccordionTrigger>Événements et célébrations</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Fêtes et événements saisonniers</li>
                          <li>Mariages</li>
                          <li>Concerts et festivals</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="interets-universitaires">
                      <AccordionTrigger>Intérêts universitaires</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Sciences</li>
                          <li>Mathématiques</li>
                          <li>Histoire</li>
                          <li>Langues</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="carriere">
                      <AccordionTrigger>Carrière</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Recherche d'emploi</li>
                          <li>Développement professionnel</li>
                          <li>Déplacements domicile-travail</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="actualite-politique">
                      <AccordionTrigger>Actualité et politique</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Actualités nationales</li>
                          <li>Actualités internationales</li>
                          <li>Politique</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="finances-personnelles">
                      <AccordionTrigger>Finances personnelles</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Investissements</li>
                          <li>Épargne</li>
                          <li>Crédit</li>
                          <li>Assurances</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="animaux-domestiques">
                      <AccordionTrigger>Animaux domestiques</AccordionTrigger>
                      <AccordionContent>
                        <ul className="list-disc list-inside space-y-1 text-sm">
                          <li>Chiens</li>
                          <li>Chats</li>
                          <li>Animaux de compagnie</li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Link href="/formation/ciblage/quiz">
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

function AfficherExempleSearch() {
  const [show, setShow] = useState(false)
  return (
    <div className="flex flex-col items-center justify-center mt-8">
      <button
        className="px-4 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition mb-4"
        onClick={() => setShow((v) => !v)}
      >
        {show ? "Masquer l'exemple" : "Afficher l'exemple"}
      </button>
      {show && (
        <img
          src="/images/Capture-decran-2025-05-23-15-23-23.png"
          alt="Exemple groupe All Search 1"
          className="max-w-xs md:max-w-md rounded shadow mx-auto"
        />
      )}
    </div>
  )
}

function AfficherExempleMeta() {
  const [show, setShow] = useState(false);
  const [currentExample, setCurrentExample] = useState(0);
  const examples = [
    {
      title: "Configuration initiale du ciblage",
      image: "/images/Lucie-Arnaud1.png"
    },
    {
      title: "Ajout des options de ciblage avancées",
      image: "/images/Lucie-Arnaud2.png"
    },
    {
      title: "Configuration finale",
      image: "/images/Lucie-Arnaud3.png"
    }
  ];

  return (
    <div className="mt-8">
      <div className="flex flex-col items-center justify-center">
        <button
          className="px-4 py-2 rounded bg-orange-600 text-white font-semibold hover:bg-orange-700 transition mb-4"
          onClick={() => setShow((v) => !v)}
        >
          {show ? "Masquer l'exemple" : "Révéler l'exemple"}
        </button>
        
        {show && (
          <>
            <div className="flex gap-4 mb-4">
              {examples.map((_, index) => (
                <button
                  key={index}
                  className={`px-4 py-2 rounded font-semibold transition ${
                    currentExample === index
                      ? "bg-primary text-white"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                  onClick={() => setCurrentExample(index)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
            <div className="text-center mb-4">
              <h4 className="text-lg font-semibold">{examples[currentExample].title}</h4>
            </div>
            <img
              src={examples[currentExample].image}
              alt={examples[currentExample].title}
              className="max-w-full md:max-w-2xl rounded shadow-lg"
            />
          </>
        )}
      </div>
    </div>
  );
}

