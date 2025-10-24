"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, AlertTriangle, Info, X, Image, Video, Monitor, Smartphone } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { useState } from "react"

export default function StudioPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Studio - Guide des formats visuels</h1>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Guide des formats visuels et contraintes</CardTitle>
              <CardDescription>
                Découvrez les formats visuels optimaux pour chaque plateforme publicitaire
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Chaque plateforme publicitaire a ses propres contraintes et recommandations en matière de formats visuels. 
                Ce guide vous accompagne dans la création de contenus visuels optimisés pour maximiser l'impact de vos campagnes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Formats d'images
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Formats recommandés : JPG, PNG, GIF. Respectez les dimensions et poids maximum pour chaque plateforme.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Video className="h-4 w-4" />
                      Formats vidéo
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Formats recommandés : MP4, MOV. Durée, résolution et poids optimaux selon la plateforme.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Monitor className="h-4 w-4" />
                      Formats desktop
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Formats adaptés aux écrans d'ordinateur avec des dimensions spécifiques pour chaque placement.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Formats mobile
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Formats optimisés pour les appareils mobiles avec des contraintes de taille et de performance.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-8 mb-8">
            <TabsTrigger value="meta">META</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
            <TabsTrigger value="youtube">YouTube</TabsTrigger>
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="tiktok">TikTok</TabsTrigger>
            <TabsTrigger value="snap">Snapchat</TabsTrigger>
            <TabsTrigger value="spotify">Spotify</TabsTrigger>
            <TabsTrigger value="programmatic">Programmatique</TabsTrigger>
          </TabsList>

          {/* Onglet META */}
          <TabsContent value="meta">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels META (Facebook & Instagram)</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Facebook et Instagram Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats d'images</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="carre">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 1440 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1080 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="vertical">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 2560 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1920 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="horizontal">
                        <AccordionTrigger>Format horizontal</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 754 px</li>
                            <li><strong>Ratio :</strong> 1.91:1</li>
                            <li><strong>Résolution alternative :</strong> 1200 x 628 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats vidéo</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="video-carre">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1080 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Fichiers acceptés :</strong> .mov, .mp4</li>
                            <li><strong>Durée optimale :</strong> 6-14 secondes</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="video-vertical">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1920 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Fichiers acceptés :</strong> .mov, .mp4</li>
                            <li><strong>Durée optimale :</strong> 6-14 secondes</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="video-tv">
                        <AccordionTrigger>Format TV</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1920 x 1080 px</li>
                            <li><strong>Ratio :</strong> 16:9</li>
                            <li><strong>Fichiers acceptés :</strong> .mov, .mp4</li>
                            <li><strong>Durée optimale :</strong> 6-14 secondes</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Facebook</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Texte principal :</strong> 50-150 caractères</li>
                          <li><strong>Titre :</strong> 27 caractères</li>
                          <li><strong>Description :</strong> 27 caractères</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Instagram</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Texte principal :</strong> 125 caractères</li>
                          <li><strong>Titre :</strong> 40 caractères</li>
                          <li><strong>Description :</strong> 27 caractères</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Marges de sécurité pour Stories et Reels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marge supérieure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Zone :</strong> 21% (≈400px)</li>
                          <li><strong>Recommandation :</strong> Éviter texte/images importants</li>
                          <li><strong>Statut :</strong> Tolérable</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marge inférieure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Zone CTA :</strong> 15% (≈285px)</li>
                          <li><strong>Zone interactions :</strong> 30% (≈570px)</li>
                          <li><strong>Recommandation :</strong> Éviter éléments importants</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par META</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Groupe publicitaire standard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <strong className="text-sm">Média minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 1 image/vidéo en 3 formats (carré, vertical, horizontal)</li>
                              <li>• 3 groupes publicitaires recommandés</li>
                            </ul>
                          </div>
                          <div>
                            <strong className="text-sm">Wordings minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 1 texte principal</li>
                              <li>• 1 titre</li>
                              <li>• 1 CTA</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Groupe publicitaire carrousel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <strong className="text-sm">Média minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 2-10 images/vidéos (format carré)</li>
                              <li>• 3 groupes publicitaires recommandés</li>
                            </ul>
                          </div>
                          <div>
                            <strong className="text-sm">Wordings minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 1 texte principal</li>
                              <li>• 2+ titres (selon vignettes)</li>
                              <li>• 1 CTA</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <Alert className="border-green-500/50 bg-green-500/10">
                        <Info className="h-4 w-4 text-green-500" />
                        <AlertDescription>
                          <strong>Logo et nom de marque :</strong> Pas besoin sur le visuel (déjà présents via photo de profil et nom de page)
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-blue-500/50 bg-blue-500/10">
                        <Info className="h-4 w-4 text-blue-500" />
                        <AlertDescription>
                          <strong>Limite de texte :</strong> Maximum 20% de texte sur les visuels
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-purple-500/50 bg-purple-500/10">
                        <Info className="h-4 w-4 text-purple-500" />
                        <AlertDescription>
                          <strong>Emojis :</strong> Maximum 3 emojis par wording
                        </AlertDescription>
                      </Alert>
                    </div>
                    <div className="space-y-3">
                      <Alert className="border-red-500/50 bg-red-500/10">
                        <X className="h-4 w-4 text-red-500" />
                        <AlertDescription>
                          <strong>Interdictions :</strong> CTA ou curseur sur visuels, logos META, hashtags
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-orange-500/50 bg-orange-500/10">
                        <AlertTriangle className="h-4 w-4 text-orange-500" />
                        <AlertDescription>
                          <strong>Catégories spéciales :</strong> Immobilier, crédit, emploi, politique, genre
                        </AlertDescription>
                      </Alert>
                      <Alert className="border-amber-500/50 bg-amber-500/10">
                        <AlertTriangle className="h-4 w-4 text-amber-500" />
                        <AlertDescription>
                          <strong>Publicités responsives :</strong> Création automatique impossible à empêcher
                        </AlertDescription>
                      </Alert>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels Google Display</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Google Display Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats d'images</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="carre">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 1440 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1080 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                            <li><strong>Poids max :</strong> 5120 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="vertical">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 2560 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1920 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                            <li><strong>Poids max :</strong> 5120 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="horizontal">
                        <AccordionTrigger>Format horizontal</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 754 px</li>
                            <li><strong>Ratio :</strong> 1.91:1</li>
                            <li><strong>Résolution alternative :</strong> 1200 x 628 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                            <li><strong>Poids max :</strong> 5120 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats vidéo</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="video-carre">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1080 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Format :</strong> Lien YouTube uniquement</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="video-vertical">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1920 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Format :</strong> Lien YouTube uniquement</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="video-tv">
                        <AccordionTrigger>Format TV</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1920 x 1080 px</li>
                            <li><strong>Ratio :</strong> 16:9</li>
                            <li><strong>Format :</strong> Lien YouTube uniquement</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Logos obligatoires</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Format carré</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Dimensions :</strong> 1080 x 1080 px</li>
                          <li><strong>Ratio :</strong> 1:1</li>
                          <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          <li><strong>Poids max :</strong> 5120 ko</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Format bannière</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Dimensions :</strong> 800 x 200 px</li>
                          <li><strong>Ratio :</strong> 4:1</li>
                          <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          <li><strong>Poids max :</strong> 5120 ko</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Titres</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>1 titre long (obligatoire) :</strong> 90 caractères</li>
                          <li><strong>5 titres courts (1 obligatoire) :</strong> 30 caractères</li>
                          <li><strong>Nom d'entreprise (obligatoire) :</strong> 25 caractères</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Descriptions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>5 descriptions (1 obligatoire) :</strong> 90 caractères</li>
                          <li><strong>1 CTA obligatoire</strong></li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par Google Display</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Média minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 image/vidéo en 3 formats (carré, vertical, horizontal)</li>
                          <li>• Maximum 5 visuels</li>
                          <li>• 2 logos (carré et bannière)</li>
                          <li>• Maximum 5 logos</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Wordings minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 titre long</li>
                          <li>• 1 titre court</li>
                          <li>• 1 description</li>
                          <li>• Nom d'entreprise</li>
                          <li>• 1 CTA</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <X className="h-4 w-4 text-red-500" />
                      <AlertDescription>
                        <strong>Contrainte importante :</strong> Le format .gif est incompatible avec les publicités responsives
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Vidéos YouTube :</strong> Doivent être hébergées sur votre chaîne YouTube (peuvent être non listées mais doivent être publiques)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription>
                        <strong>Limite de caractères :</strong> Aucune tolérance - dépasser empêche la création de campagnes
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-purple-500/50 bg-purple-500/10">
                      <Info className="h-4 w-4 text-purple-500" />
                      <AlertDescription>
                        <strong>Ponctuation :</strong> Interdite en fin de phrase pour titres longs et descriptions
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-amber-500/50 bg-amber-500/10">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <AlertDescription>
                        <strong>Impossible :</strong> Diffuser uniquement des vidéos - les visuels images sont obligatoires pour configurer la campagne
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet YouTube */}
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels YouTube Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour YouTube Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats vidéo</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="infeed">
                        <AccordionTrigger>Format InFeed</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 1440 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1080 px</li>
                            <li><strong>Format :</strong> Lien YouTube uniquement</li>
                            <li><strong>Durée optimale :</strong> 6-14 secondes</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="shorts">
                        <AccordionTrigger>Format Shorts</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 2560 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1920 px</li>
                            <li><strong>Format :</strong> Lien YouTube uniquement</li>
                            <li><strong>Durée optimale :</strong> 6-14 secondes</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="instream">
                        <AccordionTrigger>Format InStream/Bumper</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 2560 x 1440 px</li>
                            <li><strong>Ratio :</strong> 16:9</li>
                            <li><strong>Résolution alternative :</strong> 1200 x 628 px</li>
                            <li><strong>Format :</strong> Lien YouTube uniquement</li>
                            <li><strong>Durée optimale :</strong> 6-14 secondes</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Bannière associée</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="banner">
                        <AccordionTrigger>Format bannière</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 300 x 60 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Contraintes vidéo YouTube</h3>
                  <div className="space-y-3">
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Hébergement obligatoire :</strong> Les vidéos doivent être hébergées sur votre chaîne YouTube (peuvent être non listées mais doivent être publiques)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription>
                        <strong>Importation :</strong> Uniquement via le lien YouTube de votre vidéo
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-purple-500/50 bg-purple-500/10">
                      <Info className="h-4 w-4 text-purple-500" />
                      <AlertDescription>
                        <strong>Limite :</strong> Maximum 4 liens vidéo par campagne
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Titres</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>1 titre long (obligatoire) :</strong> 90 caractères</li>
                          <li><strong>1 titre court (obligatoire) :</strong> 30 caractères</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Descriptions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>1 description (obligatoire) :</strong> 70 caractères</li>
                          <li><strong>1 CTA obligatoire</strong></li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par YouTube</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Média minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 lien vidéo YouTube (format InStream/Bumper obligatoire)</li>
                          <li>• 3 formats recommandés (InFeed, Shorts, InStream/Bumper)</li>
                          <li>• Maximum 4 liens vidéo</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Wordings minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 titre long</li>
                          <li>• 1 titre court</li>
                          <li>• 1 description</li>
                          <li>• 1 CTA</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <X className="h-4 w-4 text-red-500" />
                      <AlertDescription>
                        <strong>Limite de caractères :</strong> Aucune tolérance - dépasser empêche la création de campagnes
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-purple-500/50 bg-purple-500/10">
                      <Info className="h-4 w-4 text-purple-500" />
                      <AlertDescription>
                        <strong>Ponctuation :</strong> Interdite en fin de phrase pour titres longs et descriptions
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet LinkedIn */}
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels LinkedIn Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour LinkedIn Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertTriangle className="h-4 w-4 text-orange-500" />
                  <AlertDescription>
                    <strong>Important :</strong> Il est impossible de mixer les différents groupes publicitaires sur LinkedIn pour une même campagne. Maximum 2 groupes publicitaires (standard ou carrousel) par campagne.
                  </AlertDescription>
                </Alert>

                <Alert className="border-red-500/50 bg-red-500/10">
                  <X className="h-4 w-4 text-red-500" />
                  <AlertDescription>
                    <strong>Format déprécié :</strong> En date du 01/09/2023, le format Story a été déprécié par LinkedIn. En conséquence, nous ne réalisons plus ce format.
                  </AlertDescription>
                </Alert>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats d'images</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="carre">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 1440 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1080 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="vertical">
                        <AccordionTrigger>Format vertical (déprécié)</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 2560 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1920 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                            <li><strong>Statut :</strong> Déprécié depuis le 01/09/23</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="horizontal">
                        <AccordionTrigger>Format horizontal</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 754 px</li>
                            <li><strong>Ratio :</strong> 1.91:1</li>
                            <li><strong>Résolution alternative :</strong> 1200 x 628 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats vidéo</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="video-carre">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1080 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Fichiers acceptés :</strong> .mp4</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="video-vertical">
                        <AccordionTrigger>Format vertical (déprécié)</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1920 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Fichiers acceptés :</strong> .mp4</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                            <li><strong>Statut :</strong> Déprécié depuis le 01/09/23</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="video-tv">
                        <AccordionTrigger>Format TV</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1920 x 1080 px</li>
                            <li><strong>Ratio :</strong> 16:9</li>
                            <li><strong>Fichiers acceptés :</strong> .mp4</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                            <li><strong>Sous-titres :</strong> .srt accepté</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Textes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Texte principal :</strong> 150 caractères maximum</li>
                          <li><strong>Titre :</strong> 70 caractères maximum</li>
                          <li><strong>Description :</strong> 70 caractères maximum</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Carrousel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Titre carrousel :</strong> 45 caractères maximum</li>
                          <li><strong>Description carrousel :</strong> 70 caractères maximum</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par LinkedIn</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Groupe publicitaire standard</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <strong className="text-sm">Média minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 1 visuel image/vidéo en 2 formats (carré, horizontal)</li>
                              <li>• 2 groupes publicitaires recommandés</li>
                            </ul>
                          </div>
                          <div>
                            <strong className="text-sm">Wordings minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 1 texte principal</li>
                              <li>• 1 titre</li>
                              <li>• 1 CTA</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Groupe publicitaire carrousel</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <strong className="text-sm">Média minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 2-10 visuels (format carré uniquement)</li>
                              <li>• 2 groupes publicitaires recommandés</li>
                            </ul>
                          </div>
                          <div>
                            <strong className="text-sm">Wordings minimum :</strong>
                            <ul className="text-sm ml-2 mt-1">
                              <li>• 1 texte principal</li>
                              <li>• 2+ titres (selon vignettes)</li>
                              <li>• 1 CTA</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        <strong>Logo et nom de marque :</strong> Pas besoin sur le visuel (déjà présents via photo de profil et nom de page)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription>
                        <strong>Limite de caractères :</strong> Dépasser les limites tronque le texte et empêche la lisibilité complète
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Marges de sécurité :</strong> Respecter les marges pour les médias story - éléments importants peuvent devenir illisibles
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet TikTok */}
          <TabsContent value="tiktok">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels TikTok Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour TikTok Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats vidéo</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="tiktok-vertical">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1920 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Fichiers acceptés :</strong> .mov, .mp4</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Logos obligatoires</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="tiktok-logo">
                        <AccordionTrigger>Format carré</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1080 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Textes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Texte principal :</strong> 100 caractères maximum</li>
                          <li><strong>Photo de profil :</strong> Obligatoire</li>
                          <li><strong>Nom de marque :</strong> Obligatoire</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Éléments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Bloc navigation :</strong> Automatique</li>
                          <li><strong>Interactions :</strong> Automatiques</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Marges de sécurité pour publicités verticales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marge supérieure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Zone :</strong> 6% (≈126px)</li>
                          <li><strong>Bloc :</strong> Following / For You</li>
                          <li><strong>Recommandation :</strong> Éviter éléments essentiels</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marge inférieure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Zone :</strong> 20% (≈400px)</li>
                          <li><strong>Bloc :</strong> Nom de marque + texte + interactions</li>
                          <li><strong>Recommandation :</strong> Éviter éléments importants</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par TikTok</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Média minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 vidéo en format vertical</li>
                          <li>• Maximum 2 visuels</li>
                          <li>• 1 logo en format carré</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Wordings minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• Nom de marque</li>
                          <li>• 1 texte principal</li>
                          <li>• 1 CTA</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        <strong>Nom de marque :</strong> Pas besoin sur le visuel (déjà présent via photo de profil et nom dans l'en-tête)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <X className="h-4 w-4 text-red-500" />
                      <AlertDescription>
                        <strong>Limite de caractères :</strong> Aucune tolérance - dépasser empêche la création de campagnes
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Marges de sécurité :</strong> Respecter les marges pour les médias story - éléments importants peuvent devenir illisibles
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Snapchat */}
          <TabsContent value="snap">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels Snapchat Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Snapchat Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats d'images</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="snap-image">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 2560 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1920 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                            <li><strong>Poids max :</strong> 5 MB</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats vidéo</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="snap-video">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1920 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Fichiers acceptés :</strong> .mov, .mp4, H.264</li>
                            <li><strong>Durée optimale :</strong> 14 secondes maximum</li>
                            <li><strong>Durée maximum :</strong> 30 secondes</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Textes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Nom de marque + "Publicité" :</strong> 25 caractères maximum</li>
                          <li><strong>Titre :</strong> 34 caractères maximum</li>
                          <li><strong>Répétition nom + titre + lien :</strong> Variable</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Éléments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Photo de profil :</strong> Obligatoire</li>
                          <li><strong>Bloc CTA :</strong> Obligatoire</li>
                          <li><strong>Bloc navigation :</strong> Automatique</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Marges de sécurité pour publicités verticales</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marge supérieure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Zone :</strong> 6% (≈126px)</li>
                          <li><strong>Bloc :</strong> Following / For You</li>
                          <li><strong>Recommandation :</strong> Éviter éléments importants</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Marge inférieure</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Zone :</strong> 20% (≈400px)</li>
                          <li><strong>Bloc :</strong> Nom de marque + texte + interactions</li>
                          <li><strong>Recommandation :</strong> Éviter éléments essentiels</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par Snapchat</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Média minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 image/vidéo en format vertical</li>
                          <li>• Maximum 2 visuels</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Wordings minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• Nom de marque</li>
                          <li>• 1 titre</li>
                          <li>• 1 CTA</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        <strong>Nom de marque :</strong> Pas besoin sur le visuel (déjà présent via photo de profil et nom dans l'en-tête)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <X className="h-4 w-4 text-red-500" />
                      <AlertDescription>
                        <strong>Limite de caractères :</strong> Aucune tolérance - dépasser empêche la création de campagnes
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Marges de sécurité :</strong> Respecter les marges pour les médias story - éléments importants peuvent devenir illisibles
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Spotify */}
          <TabsContent value="spotify">
            <Card>
              <CardHeader>
                <CardTitle>Formats visuels Spotify Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Spotify Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats d'images</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="spotify-direct">
                        <AccordionTrigger>Format Direct IO et Ad Studio</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1440 x 1440 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Résolution alternative :</strong> 1080 x 1080 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="spotify-logo">
                        <AccordionTrigger>Logo obligatoire</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1080 px</li>
                            <li><strong>Ratio :</strong> 1:1</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Canvas associés</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="spotify-canvas">
                        <AccordionTrigger>Format vertical</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 1080 x 1920 px</li>
                            <li><strong>Ratio :</strong> 9:16</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .mov, .mp4 (sans audio)</li>
                            <li><strong>Durée de boucle :</strong> 3-8 secondes (sans audio)</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Formats audio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Fichiers acceptés</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Formats :</strong> .mp3, .ogg, .wav</li>
                          <li><strong>Poids max :</strong> 500 MB</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Caractéristiques audio</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Stéréo :</strong> Obligatoire</li>
                          <li><strong>Échantillonnage :</strong> 44.1 kHz</li>
                          <li><strong>Débit :</strong> 192 kbit/s</li>
                          <li><strong>Niveau sonore :</strong> -16 LUFS</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Textes</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Nom de marque :</strong> 25 caractères maximum</li>
                          <li><strong>Accroche :</strong> 40 caractères maximum</li>
                          <li><strong>Photo de profil :</strong> Obligatoire</li>
                          <li><strong>Mention "Publicité" :</strong> Automatique</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Éléments</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li><strong>Bloc CTA :</strong> Obligatoire</li>
                          <li><strong>Navigation :</strong> Automatique</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par Spotify</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Média minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 1 visuel image en format carré</li>
                          <li>• 1 logo en format carré</li>
                          <li>• 1 fichier audio (30 secondes maximum)</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Wordings minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• Nom de marque</li>
                          <li>• 1 accroche</li>
                          <li>• 1 CTA</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-red-500/50 bg-red-500/10">
                      <X className="h-4 w-4 text-red-500" />
                      <AlertDescription>
                        <strong>Limite de caractères :</strong> Aucune tolérance - dépasser empêche la création de campagnes
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription>
                        <strong>Audio :</strong> Caractéristiques techniques strictes (stéréo, 44.1 kHz, 192 kbit/s, -16 LUFS)
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Canvas :</strong> Durée de boucle limitée à 3-8 secondes sans audio
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Programmatique / Mix IAB */}
          <TabsContent value="programmatic">
            <Card>
              <CardHeader>
                <CardTitle>Publicités programmatique / Mix IAB</CardTitle>
                <CardDescription>
                  Formats et contraintes pour la publicité programmatique
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Formats d'images</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="megabanner">
                        <AccordionTrigger>Mégabannière</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 728 x 90 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="banner">
                        <AccordionTrigger>Bannière</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 320 x 50 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="skyscraper">
                        <AccordionTrigger>Skyscraper</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 160 x 600 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="wide-angle">
                        <AccordionTrigger>Grand angle</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 300 x 600 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="interstitial">
                        <AccordionTrigger>Interstitiel</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 320 x 480 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="parallax">
                        <AccordionTrigger>Pavé parallax</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 300 x 250 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Landing pages</h3>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="lp-megabanner">
                        <AccordionTrigger>Mégabannière</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 728 x 90 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                      <AccordionItem value="lp-banner">
                        <AccordionTrigger>Bannière</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li><strong>Dimensions :</strong> 320 x 50 px</li>
                            <li><strong>Fichiers acceptés :</strong> .jpg, .png, .gif</li>
                            <li><strong>Poids max :</strong> 150 ko</li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus en programmatique</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Média minimum obligatoires</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• 6 visuels à tous les formats</li>
                          <li>• Formats IAB standard</li>
                          <li>• Optimisation pour tous les écrans</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Contraintes techniques</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-1 text-sm">
                          <li>• Poids maximum : 150 ko par visuel</li>
                          <li>• Formats acceptés : .jpg, .png, .gif</li>
                          <li>• Compatibilité multi-navigateurs</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-3">
                    <Alert className="border-blue-500/50 bg-blue-500/10">
                      <Info className="h-4 w-4 text-blue-500" />
                      <AlertDescription>
                        <strong>Formats IAB :</strong> Respecter les standards IAB pour une diffusion optimale
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertTriangle className="h-4 w-4 text-orange-500" />
                      <AlertDescription>
                        <strong>Poids des fichiers :</strong> Limite stricte de 150 ko pour éviter les problèmes de chargement
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-green-500/50 bg-green-500/10">
                      <Info className="h-4 w-4 text-green-500" />
                      <AlertDescription>
                        <strong>Optimisation :</strong> Créer des visuels adaptés à tous les formats pour maximiser la portée
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
