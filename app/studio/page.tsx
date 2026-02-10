"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, AlertTriangle, X, Image, Video, Monitor, Smartphone, Eye } from "lucide-react"
import NextImage from "next/image"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from "@/components/ui/tooltip"
import { useState } from "react"
import MetaRecommendationsTabs from "@/components/meta/MetaRecommendationsTabs"

export default function StudioPage() {
  const [tooltip1Open, setTooltip1Open] = useState(false)
  const [tooltip2Open, setTooltip2Open] = useState(false)
  const [tooltip3Open, setTooltip3Open] = useState(false)
  const [marginsTooltip1Open, setMarginsTooltip1Open] = useState(false)
  const [marginsTooltip2Open, setMarginsTooltip2Open] = useState(false)

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="mb-4 md:mb-8">Studio - Guide des formats visuels</h1>

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
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="meta" className="w-full">
          <TabsList className="flex justify-between w-full gap-1 md:gap-2 mb-4 md:mb-8">
            <TabsTrigger value="meta">META</TabsTrigger>
            <TabsTrigger value="google">Display</TabsTrigger>
            <TabsTrigger value="googlesearch">Search</TabsTrigger>
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
                <h1>Publicités sur META (Facebook & Instagram)</h1>
                <CardDescription>
                  Formats et contraintes pour Facebook et Instagram Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Livrables attendus - priorité haute, mis en avant en orange */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d'œil</strong>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colonne gauche : Pré-requis média minimum obligatoires */}
                        <div>
                          <h3 className="font-semibold mb-3">Pré-requis média minimum obligatoires :</h3>
                          <p className="text-sm mb-2">
                            1 visuel image et/ou vidéo, décliné aux 3 formats (carré, vertical et horizontal).
                          </p>
                          <p className="text-sm mb-4">
                            3 groupes publicitaires (standard et/ou carrousel) recommandés.
                          </p>
                          
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm ml-4 list-disc space-y-1 mb-4">
                            <li>1 texte principal.</li>
                            <li>1 titre.</li>
                            <li>1 CTA².</li>
                          </ul>
                          
                          <p className="text-sm font-semibold mb-2">Mécanique de fonctionnement :</p>
                          <p className="text-sm">
                            Sous forme d'images ou de vidéos simples, sans interaction particulière.
                          </p>
                        </div>
                        
                        {/* Colonne droite : groupe publicitaire carrousel */}
                        <div>
                          <h3 className="font-semibold mb-3">groupe publicitaire carrousel</h3>
                          <p className="text-sm mb-2">image ou vidéo</p>
                          
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <p className="text-sm mb-1">
                            2 visuels image et/ou vidéo, en format carré.
                          </p>
                          <p className="text-sm mb-1">
                            2 minimum et 10 maximum.
                          </p>
                          <p className="text-sm mb-4">
                            3 groupes publicitaires (standard et/ou carrousel) recommandés.
                          </p>
                          
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm ml-4 list-disc space-y-1 mb-4">
                            <li>1 texte principal.</li>
                            <li>2 titres minimum (en fonction du nombre de vignettes).</li>
                            <li>1 CTA².</li>
                          </ul>
                          
                          <p className="text-sm font-semibold mb-2">Mécanique de fonctionnement :</p>
                          <p className="text-sm">
                            Sous forme d'images ou de vidéos disposées sous forme de vignettes les unes à côté des autres qui peuvent être visionnées en naviguant vers la droite.
                          </p>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                <div className="space-y-8">
                  {/* Bloc 2: Liste des formats */}
                  <div>
                    <h2 className="mb-6">Liste des formats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Colonne gauche: publicités images */}
                      <div>
                        <h3 className="font-semibold mb-4">publicités images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-start">
                          {/* Encart 1: format carré */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[240px] mb-2">
                              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format carré</p>
                              <p>1440 × 1440 px</p>
                              <p>ratio 1:1</p>
                            </div>
                          </div>

                          {/* Encart 2: format vertical */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[135px] mb-2">
                              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-auto object-contain" />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format vertical</p>
                              <p>1440 × 2560 px</p>
                              <p>ratio 9:16</p>
                            </div>
                          </div>

                          {/* Encart 3: format horizontal */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[240px] mb-2">
                              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <NextImage src="/images/format%20horizontal_tv_instream@10x.png" alt="Format horizontal" width={1440} height={754} className="w-full h-auto object-contain" />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format horizontal</p>
                              <p>1440 × 754 px</p>
                              <p>ratio 1.91:1</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Colonne droite: publicités vidéos */}
                      <div>
                        <h3 className="font-semibold mb-4">publicités vidéos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          {/* Encart 1: format carré */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[240px] mb-2">
                              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1080} height={1080} className="w-full h-auto object-contain" />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format carré</p>
                              <p>1080 × 1080 px</p>
                              <p>ratio 1:1</p>
                            </div>
                          </div>

                          {/* Encart 2: format vertical */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[135px] mb-2">
                              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-auto object-contain" />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format vertical</p>
                              <p>1080 × 1920 px</p>
                              <p>ratio 9:16</p>
                            </div>
                          </div>

                          {/* Encart 3: format TV */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[240px] mb-2">
                              <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                                <NextImage
                                  src="/images/format%20horizontal_tv_instream@10x.png"
                                  alt="Format TV"
                                  width={1920}
                                  height={1080}
                                  className="w-full h-auto object-contain"
                                />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format TV</p>
                              <p>1920 × 1080 px</p>
                              <p>ratio 16:9</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloc 3: Fichiers acceptés */}
                  <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Colonne gauche: Résolutions alternatives + Fichiers images empilés */}
                      <div className="space-y-4">
                        <div className="rounded-md border border-muted bg-muted/20 px-3 py-2">
                          <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Résolutions alternatives acceptables</h5>
                          <ul className="space-y-0.5 text-xs text-muted-foreground">
                            <li>format carré : 1080 × 1080 px</li>
                            <li>format vertical : 1080 × 1920 px</li>
                            <li>format horizontal : 1200 × 628 px</li>
                          </ul>
                        </div>
                        <Alert className="py-3 border-[#E94C16] bg-white">
                          <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4" />
                          <AlertDescription className="text-sm">
                            <strong className="font-semibold">Fichiers acceptés pour les publicités images :</strong>
                            <br />
                            .jpg, .png
                          </AlertDescription>
                        </Alert>
                      </div>
                      {/* Colonne droite: Fichiers vidéos */}
                      <div>
                        <Alert className="border-[#E94C16] bg-white">
                          <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4" />
                          <AlertDescription>
                            <strong className="font-semibold">Fichiers acceptés pour les publicités vidéos :</strong>
                            <br />
                            .mov, .mp4
                            <br />
                            <br />
                            Durée optimale : entre 6 et 14 secondes maximum
                            <br />
                            Durée maximum : 30 secondes
                            <br />
                            <br />
                            Fichier accepté de sous-titrage (si dialogue, voix-off…) :
                            <br />
                            .srt
                            <br />
                            <br />
                            Nommage fichier srt : nomvidéo_fr_FR.srt
                          </AlertDescription>
                        </Alert>
                      </div>
                  </div>
                  </div>
                </div>

                  {/* Bloc 4 & 5 : Wordings + Marges de sécurité côte à côte */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                      {/* Bloc 4: Limites de caractères pour les wordings */}
                      <div>
                        <h2 className="text-xl font-bold text-orange-500 mb-4 md:mb-6 leading-tight">
                          Limites de caractères pour les wordings
                        </h2>
                        <div className="flex justify-center">
                          <div className="w-full max-w-[300px] relative">
                            <div className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-sm relative">
                              <NextImage
                                src="/images/META format complet vertical2@10x.png"
                                alt="Limites de caractères pour les wordings"
                                width={1440}
                                height={2560}
                                className="w-full h-full object-contain"
                              />
                              <TooltipProvider delayDuration={0}>
                                {/* Zone 1 : photo de profil + nom de page */}
                                <Tooltip open={tooltip1Open} onOpenChange={setTooltip1Open}>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className="absolute top-[8%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" 
                                      style={{ zIndex: 10 }}
                                      onClick={() => setTooltip1Open(!tooltip1Open)}
                                    >
                                      1
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent>
                                    <div className="text-sm">
                                      <strong>photo de profil + nom de page</strong>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                
                                {/* Zone 2 : texte principal */}
                                <Tooltip open={tooltip2Open} onOpenChange={setTooltip2Open}>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className="absolute top-[18%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" 
                                      style={{ zIndex: 10 }}
                                      onClick={() => setTooltip2Open(!tooltip2Open)}
                                    >
                                      2
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <div className="text-sm">
                                      <strong>texte principal :</strong>
                                      <ul className="list-disc ml-4 mt-1 space-y-1">
                                        <li>De 50 à 150 caractères maximum (Facebook)</li>
                                        <li>125 caractères maximum (Instagram)</li>
                                      </ul>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                                
                                {/* Zone 3 : titre, description, CTA */}
                                <Tooltip open={tooltip3Open} onOpenChange={setTooltip3Open}>
                                  <TooltipTrigger asChild>
                                    <div 
                                      className="absolute bottom-[8%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" 
                                      style={{ zIndex: 10 }}
                                      onClick={() => setTooltip3Open(!tooltip3Open)}
                                    >
                                      3
                                    </div>
                                  </TooltipTrigger>
                                  <TooltipContent className="max-w-xs">
                                    <div className="text-sm">
                                      <strong>titre :</strong>
                                      <ul className="list-disc ml-4 mt-1 space-y-1">
                                        <li>27 caractères maximum (Facebook)</li>
                                        <li>40 caractères maximum (Instagram)</li>
                                      </ul>
                                      <strong className="block mt-2">description :</strong>
                                      <ul className="list-disc ml-4 mt-1 space-y-1">
                                        <li>27 caractères maximum</li>
                                      </ul>
                                      <strong className="block mt-2">bloc CTA</strong>
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
                              </TooltipProvider>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Bloc 5: Marges de sécurité */}
                      <div>
                        <h2 className="text-xl font-bold text-orange-500 mb-4 md:mb-6 leading-tight">
                          Marges de sécurité pour les story et reels
                        </h2>
                        <div className="flex justify-center">
                          <div className="w-full max-w-[300px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-sm relative">
                            <NextImage
                              src="/images/META Marges de sécurité 2@10x.png"
                              alt="Marges de sécurité pour les story et reels"
                              width={1440}
                              height={2560}
                              className="w-full h-full object-contain"
                            />
                            <TooltipProvider delayDuration={0}>
                              {/* Zone 1 : haut de l'écran */}
                              <Tooltip
                                open={marginsTooltip1Open}
                                onOpenChange={setMarginsTooltip1Open}
                              >
                                <TooltipTrigger asChild>
                                  <div
                                    className="absolute top-[14%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                    style={{ zIndex: 10 }}
                                    onClick={() =>
                                      setMarginsTooltip1Open(!marginsTooltip1Open)
                                    }
                                  >
                                    1
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>Zone 1</strong>
                                    <ul className="ml-4 mt-1 space-y-1 list-disc">
                                      <li>bloc photo de profil + nom de page</li>
                                      <li>marge de 21 %</li>
                                      <li>400 pixels environ</li>
                                    </ul>
                                    <p className="mt-2 italic text-xs">
                                      Dans cette zone, il est recommandé de ne mettre
                                      aucun texte ou image important pour la
                                      compréhension du message.
                                    </p>
                                    <p className="mt-1 italic text-xs">
                                      La présence d&apos;éléments dans cette zone est
                                      considérée comme tolérable.
                                    </p>
                                  </div>
                                </TooltipContent>
                              </Tooltip>

                              {/* Zone 2 : bas de l'écran */}
                              <Tooltip
                                open={marginsTooltip2Open}
                                onOpenChange={setMarginsTooltip2Open}
                              >
                                <TooltipTrigger asChild>
                                  <div
                                    className="absolute bottom-[10%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                    style={{ zIndex: 10 }}
                                    onClick={() =>
                                      setMarginsTooltip2Open(!marginsTooltip2Open)
                                    }
                                  >
                                    2
                                  </div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>Zone 2</strong>
                                    <ul className="ml-4 mt-1 space-y-1 list-disc">
                                      <li>bloc CTA + interactions</li>
                                      <li>marge de 15 % (285 pixels environ)</li>
                                      <li>marge de 30 % (570 pixels environ)</li>
                                    </ul>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>

                      </div>
                    </div>

                    {/* Instruction unique pour les deux blocs */}
                    <p className="mt-4 text-xs text-center text-muted-foreground italic md:col-span-2">
                      Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.
                    </p>
                  </div>

                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  <MetaRecommendationsTabs />
                    </div>

                  {/* Section: Rappel des livrables attendus par META */}
                <div className="mt-6">
                    <h2 className="text-2xl font-bold text-orange-500 mb-6">Rappel des livrables attendus par META en fonction du type de publicité</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche: groupe publicitaire standard */}
                          <div>
                        <h3 className="font-semibold mb-4">groupe publicitaire standard</h3>
                        
                        {/* Bloc visuel explicatif */}
                        <div className="grid grid-cols-3 gap-4 mb-6">
                          {/* Encart 1: format carré */}
                          <div className="flex flex-col items-center">
                            <div className="w-full aspect-square flex items-center justify-center mb-3">
                              <NextImage src="/images/META format complet carré@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm font-medium text-center">format carré</p>
                            <p className="text-xs text-gray-500 text-center">1440 × 1440 px</p>
                            <p className="text-xs text-gray-500 text-center">ratio 1:1</p>
                          </div>

                          {/* Encart 2: format vertical */}
                          <div className="flex flex-col items-center">
                            <div className="w-full aspect-[9/16] flex items-center justify-center mb-3">
                              <NextImage src="/images/META format complet vertical@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm font-medium text-center">format vertical</p>
                            <p className="text-xs text-gray-500 text-center">1440 × 2560 px</p>
                            <p className="text-xs text-gray-500 text-center">ratio 9:16</p>
                          </div>

                          {/* Encart 3: format horizontal */}
                          <div className="flex flex-col items-center">
                            <div className="w-full aspect-square flex items-center justify-center mb-3">
                              <NextImage src="/images/META format complet horizontal@10x.png" alt="Format horizontal" width={1440} height={754} className="w-full h-full object-contain" />
                            </div>
                            <p className="text-sm font-medium text-center">format horizontal</p>
                            <p className="text-xs text-gray-500 text-center">1440 × 754 px</p>
                            <p className="text-xs text-gray-500 text-center">ratio 1.91:1</p>
                          </div>
                        </div>

                        {/* Pré-requis média minimum obligatoires */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2 text-sm">Pré-requis média minimum obligatoires :</h5>
                          <p className="text-sm">
                            1 visuel image et/ou vidéo, décliné aux 3 formats (carré, vertical et horizontal).
                          </p>
                          <p className="text-sm mt-1">
                            3 groupes publicitaires (standard et/ou carrousel) recommandés.
                          </p>
                        </div>

                        {/* Pré-requis wording minimum obligatoires */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2 text-sm">Pré-requis wording¹ minimum obligatoires :</h5>
                          <ul className="space-y-1 text-sm ml-4 list-disc">
                            <li>1 texte principal.</li>
                            <li>1 titre.</li>
                            <li>1 CTA².</li>
                            </ul>
                          </div>

                        {/* Mécanique de fonctionnement */}
                          <div>
                          <h5 className="font-semibold mb-2 text-sm">Mécanique de fonctionnement :</h5>
                          <p className="text-sm">
                            Sous forme d'images ou de vidéos simples, sans interaction particulière.
                          </p>
                  </div>
                </div>

                      {/* Colonne droite: groupe publicitaire carrousel */}
                      <div>
                        <h3 className="font-semibold mb-4">groupe publicitaire carrousel</h3>
                        
                        {/* Bloc visuel explicatif */}
                        <div className="mb-6">
                          <div className="w-full rounded-md overflow-hidden">
                            <NextImage src="/images/META format complet caroussel@10x.png" alt="Format complet carrousel" width={1920} height={1080} className="w-full h-auto object-contain" />
                          </div>
                </div>

                        {/* Pré-requis média minimum obligatoires */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2 text-sm">Pré-requis média minimum obligatoires :</h5>
                          <p className="text-sm">
                            2 visuels image et/ou vidéo, en format carré.
                          </p>
                          <p className="text-sm mt-1">
                            2 minimum et 10 maximum.
                          </p>
                          <p className="text-sm mt-1">
                            3 groupes publicitaires (standard et/ou carrousel) recommandés.
                          </p>
                </div>

                        {/* Pré-requis wording minimum obligatoires */}
                        <div className="mb-4">
                          <h5 className="font-semibold mb-2 text-sm">Pré-requis wording¹ minimum obligatoires :</h5>
                          <ul className="space-y-1 text-sm ml-4 list-disc">
                            <li>1 texte principal.</li>
                            <li>2 titres minimum (en fonction du nombre de vignettes).</li>
                            <li>1 CTA².</li>
                            </ul>
                          </div>

                        {/* Mécanique de fonctionnement */}
                        <div>
                          <h5 className="font-semibold mb-2 text-sm">Mécanique de fonctionnement :</h5>
                          <p className="text-sm">
                            Sous forme d'images ou de vidéos disposées sous forme de vignettes les unes à côté des autres qui peuvent être visionnées en naviguant vers la droite.
                          </p>
                        </div>
                  </div>
                </div>

                    {/* Bandeau de rappel final */}
                    <Alert className="bg-orange-500/10 border-orange-500/50">
                      <AlertDescription className="font-semibold">
                        6 groupes publicitaires (standard et/ou carrousel) maximum.
                      </AlertDescription>
                    </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google Display */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <h1>Publicités sur Google Display</h1>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                  <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* 2 colonnes : images et vidéos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : publicités images */}
                  <div>
                      <h3 className="font-semibold mb-4">publicités images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-start">
                        {/* Encart 1 : format carré */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[240px] mb-2">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
                            </div>
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1440 × 1440 px</p>
                            <p>ratio 1:1</p>
                          </div>
                        </div>

                        {/* Encart 2 : format vertical */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[135px] mb-2">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-auto object-contain" />
                            </div>
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format vertical</p>
                            <p>1440 × 2560 px</p>
                            <p>ratio 9:16</p>
                          </div>
                        </div>

                        {/* Encart 3 : format horizontal */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[240px] mb-2">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <NextImage src="/images/format%20horizontal_tv_instream@10x.png" alt="Format horizontal" width={1440} height={754} className="w-full h-auto object-contain" />
                            </div>
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format horizontal</p>
                            <p>1440 × 754 px</p>
                            <p>ratio 1.91:1</p>
                          </div>
                        </div>
                      </div>

                      {/* Résolutions alternatives */}
                      <Card className="mt-4">
                        <CardContent className="pt-4">
                          <p className="text-sm font-semibold mb-2">Résolutions alternatives acceptables</p>
                          <ul className="text-sm space-y-1">
                            <li>format carré : 1080 × 1080 px</li>
                            <li>format vertical : 1080 × 1920 px</li>
                            <li>format horizontal : 1200 × 628 px</li>
                        </ul>
                      </CardContent>
                    </Card>
                    </div>

                    {/* Colonne droite : publicités vidéos */}
                    <div>
                      <h3 className="font-semibold mb-4">publicités vidéos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        {/* Encart 1 : format carré */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[240px] mb-2">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
                            </div>
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1080 × 1080 px</p>
                            <p>ratio 1:1</p>
                          </div>
                        </div>

                        {/* Encart 2 : format vertical */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[135px] mb-2">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-auto object-contain" />
                            </div>
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format vertical</p>
                            <p>1080 × 1920 px</p>
                            <p>ratio 9:16</p>
                          </div>
                        </div>

                        {/* Encart 3 : format TV */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[240px] mb-2">
                            <div className="w-full rounded-lg border border-gray-200 bg-gray-50 p-2">
                              <NextImage src="/images/format%20horizontal_tv_instream@10x.png" alt="Format TV" width={1920} height={1080} className="w-full h-auto object-contain" />
                            </div>
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format TV</p>
                            <p>1920 × 1080 px</p>
                            <p>ratio 16:9</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* H2 : Logos obligatoires */}
                <div>
                  <h2 className="mb-4 md:mb-5 lg:mb-6">logos obligatoires</h2>
                  
                  {/* Partie 1 : Bloc visuel logos */}
                  <div className="flex gap-4 mb-5 md:mb-6 lg:mb-8">
                    {/* Encart 1 : format carré */}
                    <div className="flex-1 max-w-xs">
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1080} height={1080} className="w-full h-full object-contain" />
                          </div>
                      <div className="text-sm text-center">
                        <p className="font-medium">format carré</p>
                        <p>1080 × 1080 px</p>
                        <p>ratio 1:1</p>
                      </div>
                    </div>

                    {/* Encart 2 : format bannière */}
                    <div className="flex-1 max-w-xs">
                      <div className="aspect-[4/1] w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 mb-2">
                        <span className="text-xs text-muted-foreground">Encadré vide</span>
                      </div>
                      <div className="text-sm text-center">
                        <p className="font-medium">format bannière</p>
                        <p>800 × 200 px</p>
                        <p>ratio 4:1</p>
                      </div>
                    </div>
                  </div>

                  {/* Partie 2 : Fichiers acceptés */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch mb-7 md:mb-9 lg:mb-12">
                    <Alert className="h-full flex flex-col border-[#E94C16]">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités images et logos :</AlertTitle>
                      <AlertDescription className="flex-1">
                        .jpg, .png<br />
                        Taille maximale : 5120 ko<br />
                        Le format .gif est incompatible avec la pub responsive.
                      </AlertDescription>
                    </Alert>
                    <Alert className="h-full flex flex-col border-[#E94C16]">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités vidéos :</AlertTitle>
                      <AlertDescription className="flex-1">
                        Lien YouTube au format https://…<br />
                        Durée optimale : 14 secondes maximum<br />
                        Durée maximum : 30 secondes<br />
                        5 liens vidéos maximum<br /><br />
                        Pour être utilisées, les vidéos doivent être déjà hébergées sur votre chaîne YouTube.<br />
                        L'importation se fait uniquement grâce au lien YouTube correspondant aux vidéos.<br />
                        Les vidéos peuvent être en non référencées mais doivent être impérativement publiques.<br /><br />
                        La diffusion exclusive de vidéo n'est pas possible dans Google Display.<br />
                        Des visuels au format publicités images sont obligatoires pour configurer la campagne.
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* H2 : Limites de caractères pour les wordings et Rappel des livrables */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
                    {/* Colonne gauche : Limites de caractères */}
                    <div>
                      <h2 className="text-2xl font-bold text-orange-500 mb-4 md:mb-5 lg:mb-6">Limites de caractères pour les wordings</h2>
                    <Card>
                        <CardContent className="pt-4">
                          <ul className="text-sm space-y-2">
                            <li><strong>1 titre long (obligatoire)</strong><br />90 caractères maximum, espaces inclus</li>
                            <li><strong>5 titres courts (1 obligatoire)</strong><br />30 caractères maximum, espaces inclus</li>
                            <li><strong>5 descriptions (1 obligatoire)</strong><br />90 caractères maximum, espaces inclus</li>
                            <li><strong>Nom d'entreprise (obligatoire)</strong><br />25 caractères maximum, espaces inclus</li>
                        </ul>
                      </CardContent>
                    </Card>
                    </div>

                    {/* Colonne droite : Rappel des livrables */}
                    <div>
                      <h2 className="text-2xl font-bold text-orange-500 mb-4 md:mb-5 lg:mb-6">Rappel des livrables attendus par Google Display</h2>
                    <Card>
                        <CardContent className="pt-4">
                          <div className="space-y-4">
                            <div>
                              <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                              <ul className="text-sm space-y-1 ml-4 list-disc">
                                <li>1 visuel image décliné aux 3 formats (carré, vertical, horizontal).</li>
                                <li>5 maximum. (Même pour une vidéo)</li>
                                <li>2 visuels logo (format carré et bannière).</li>
                                <li>5 maximum.</li>
                        </ul>
                            </div>
                            <div>
                              <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                              <ul className="text-sm space-y-1 ml-4 list-disc">
                                <li>1 titre long.</li>
                                <li>1 titre court. 5 maximum.</li>
                                <li>1 description. 5 maximum.</li>
                                <li>Nom d'entreprise.</li>
                                <li>1 CTA².</li>
                              </ul>
                            </div>
                          </div>
                      </CardContent>
                    </Card>
                    </div>
                  </div>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-7 md:mt-9 lg:mt-12">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                  {/* 3 colonnes de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères empêche la création de campagnes sur Google.<br /><br />
                          Aucune tolérance n'est accordée.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas utiliser de caractères de ponctuation en fin de phrase.<br /><br />
                          Google n'autorise pas l'utilisation de ponctuation en fin de phrase pour le titre long et les descriptions.<br /><br />
                          Aucune tolérance n'est accordée.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Je veux diffuser que des vidéos<br /><br />
                          Cela est impossible sur Google Display.<br /><br />
                          Il est obligatoire de fournir des visuels dans les 3 formats correspondant aux publicités images pour pouvoir configurer la campagne.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet LinkedIn */}
          <TabsContent value="linkedin">
            <Card>
              <CardHeader>
                <h1>Publicités sur LinkedIn</h1>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                  <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* 2 colonnes : images et vidéos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : publicités images */}
                  <div>
                      <h3 className="font-semibold mb-4">publicités images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart 1 : format carré */}
                        <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1440 × 1440 px</p>
                            <p>ratio 1:1</p>
                  </div>
                  </div>

                        {/* Encart 2 : format vertical (déprécié) */}
                        <div className="relative">
                          <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-full object-contain" />
                          </div>
                          <Badge variant="destructive" className="absolute top-2 right-2">déprécié</Badge>
                          <div className="text-sm text-center">
                            <p className="font-medium">format vertical</p>
                            <p>1440 × 2560 px</p>
                            <p>ratio 9:16</p>
                  </div>
                </div>

                        {/* Encart 3 : format horizontal */}
                  <div>
                          <div className="aspect-[1.91/1] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20horizontal_tv_instream@10x.png" alt="Format horizontal" width={1440} height={754} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format horizontal</p>
                            <p>1440 × 754 px</p>
                            <p>ratio 1.91:1</p>
                          </div>
                  </div>
                </div>

                      {/* Résolutions alternatives */}
                      <Card className="mt-4">
                        <CardContent className="pt-4">
                          <p className="text-sm font-semibold mb-2">Résolutions alternatives acceptables</p>
                          <ul className="text-sm space-y-1">
                            <li>format carré : 1080 × 1080 px</li>
                            <li>format vertical : 1080 × 1920 px (déprécié)</li>
                            <li>format horizontal : 1200 × 628 px</li>
                          </ul>
                      </CardContent>
                    </Card>
                </div>

                    {/* Colonne droite : publicités vidéos */}
                          <div>
                      <h3 className="font-semibold mb-4">publicités vidéos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Encart 1 : format carré */}
                          <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1080 × 1080 px</p>
                            <p>ratio 1:1</p>
                  </div>
                </div>

                        {/* Encart 2 : format vertical (déprécié) */}
                        <div className="relative">
                          <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-full object-contain" />
                          </div>
                          <Badge variant="destructive" className="absolute top-2 right-2">déprécié</Badge>
                          <div className="text-sm text-center">
                            <p className="font-medium">format vertical</p>
                            <p>1080 × 1920 px</p>
                            <p>ratio 9:16</p>
                  </div>
                  </div>

                        {/* Encart 3 : format TV */}
                          <div>
                          <div className="aspect-video w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20horizontal_tv_instream@10x.png" alt="Format TV" width={1920} height={1080} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format TV</p>
                            <p>1920 × 1080 px</p>
                            <p>ratio 16:9</p>
                        </div>
                  </div>
                </div>
                  </div>
                </div>

                  {/* Bloc "Fichiers acceptés" */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Alert className="border-[#E94C16]">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités images :</AlertTitle>
                      <AlertDescription>
                        .jpg, .png
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-[#E94C16]">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités vidéos :</AlertTitle>
                      <AlertDescription>
                        .mp4<br />
                        Durée optimale : 14 secondes maximum<br />
                        Durée maximum : 30 secondes<br />
                        Fichier accepté de sous-titrage (si dialogue, voix-off…) :<br />
                        .srt
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* H2 : Limites de caractères pour les wordings */}
                  <div>
                  <h2 className="mb-4">Limites de caractères pour les wordings</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Encart visuel à gauche */}
                    <div className="aspect-[4/5] w-full rounded-md border border-dashed bg-muted/50 flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Ajouter votre image</span>
                  </div>
                    {/* Texte à droite */}
                    <div className="space-y-2 text-sm">
                      <p><strong>photo de profil + nom de page</strong></p>
                      <p><strong>texte principal :</strong><br />150 caractères maximum</p>
                      <p><strong>titre :</strong><br />70 caractères maximum<br />45 caractères pour un groupe publicitaire carrousel</p>
                      <p><strong>description :</strong><br />70 caractères maximum</p>
                      <p><strong>bloc CTA²</strong></p>
                    </div>
                  </div>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                  {/* 2 colonnes de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Il n'est pas essentiel de mettre votre logo ou votre nom de marque sur le visuel.<br /><br />
                          Votre logo et votre nom de marque sont déjà présents dans l'environnement LinkedIn sous deux formes :<br /><br />
                          • votre photo de profil<br />
                          • votre nom de page de diffusion
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères a pour conséquence de tronquer votre texte et d'empêcher sa lecture totale.<br /><br />
                          Un bouton « Voir plus » peut apparaître.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Encadré d'information final (dépréciation) */}
                    <Alert className="border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                      <AlertDescription>
                    <strong>En date du 01/09/23, le format vertical a été déprécié par LinkedIn.</strong><br />
                    En conséquence, nous ne réalisons plus ce format.
                      </AlertDescription>
                    </Alert>

                {/* H2 : Rappel des livrables attendus par LinkedIn en fonction du type de publicité */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-6">Rappel des livrables attendus par LinkedIn en fonction du type de publicité</h2>
                  
                  {/* 2 colonnes : standard et carrousel */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : groupe publicitaire standard */}
                          <div>
                      <h3 className="font-semibold mb-4">groupe publicitaire standard</h3>
                      
                      {/* Bloc visuel : plusieurs encarts avec un vertical déprécié */}
                      <div className="grid grid-cols-3 gap-2 mb-4">
                        {/* Encart carré */}
                        <div className="aspect-square w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10">
                          <span className="text-xs text-muted-foreground text-center">IMAGE 1<br />image ou vidéo</span>
                  </div>
                        {/* Encart vertical déprécié */}
                        <div className="aspect-[9/16] w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 relative">
                          <Badge variant="destructive" className="absolute top-1 right-1 text-xs">déprécié</Badge>
                          <span className="text-xs text-muted-foreground text-center">IMAGE 2<br />image ou vidéo</span>
                </div>
                        {/* Encart horizontal */}
                        <div className="aspect-[1.91/1] w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10">
                          <span className="text-xs text-muted-foreground text-center">IMAGE 3<br />image ou vidéo</span>
                        </div>
                      </div>

                      {/* Pré-requis média minimum obligatoires */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                        <p className="text-sm">
                          1 visuel image et/ou vidéo, décliné aux 2 formats (carré et horizontal).<br />
                          2 groupes publicitaires (standard ou carrousel) recommandés.
                        </p>
                      </div>

                      {/* Pré-requis wording minimum obligatoires */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>1 texte principal.</li>
                          <li>1 titre.</li>
                          <li>1 CTA².</li>
                        </ul>
                          </div>

                      {/* Mécanique de fonctionnement */}
                          <div>
                        <p className="text-sm font-semibold mb-2">Mécanique de fonctionnement :</p>
                        <p className="text-sm">
                          Sous forme d'images ou de vidéos simples, sans interaction particulière.
                        </p>
                          </div>
                        </div>

                    {/* Colonne droite : groupe publicitaire carrousel */}
                          <div>
                      <h3 className="font-semibold mb-4">groupe publicitaire carrousel</h3>
                      
                      {/* Bloc visuel : format complet carrousel */}
                      <div className="mb-4">
                        <div className="w-full rounded-md overflow-hidden">
                          <NextImage src="/images/META format complet caroussel@10x.png" alt="Format complet carrousel" width={1920} height={1080} className="w-full h-auto object-contain" />
                        </div>
                      </div>

                      {/* Pré-requis média minimum obligatoires */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                        <p className="text-sm">
                          2 visuels image, en format carré.<br />
                          2 minimum et 10 maximum.<br />
                          2 groupes publicitaires (standard ou carrousel) recommandés.
                        </p>
                      </div>

                      {/* Pré-requis wording minimum obligatoires */}
                      <div className="mb-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>1 texte principal.</li>
                          <li>2 titres minimum (en fonction du nombre de vignettes).</li>
                          <li>1 CTA².</li>
                        </ul>
                          </div>

                      {/* Mécanique de fonctionnement */}
                          <div>
                        <p className="text-sm font-semibold mb-2">Mécanique de fonctionnement :</p>
                        <p className="text-sm">
                          Sous forme d'images ou de vidéos disposées à travers des vignettes les unes à côté des autres qui peuvent être visionnées en naviguant vers la droite.
                        </p>
                          </div>
                  </div>
                </div>

                  {/* Encadré d'alerte (pleine largeur) */}
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                      <AlertDescription>
                      Il est impossible de mixer les différents groupes publicitaires sur LinkedIn pour une même campagne.
                      </AlertDescription>
                    </Alert>

                  {/* Bandeau de rappel final (pleine largeur, fond orange) */}
                    <Alert className="border-orange-500/50 bg-orange-500/10">
                      <AlertDescription>
                      <strong>2 groupes publicitaires (standard ou carrousel) maximum.</strong>
                      </AlertDescription>
                    </Alert>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Snapchat */}
          <TabsContent value="snap">
            <Card>
              <CardHeader>
                <h1>Publicités sur Snapchat</h1>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                  <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* 2 colonnes : images et vidéos */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : publicités images */}
                  <div>
                      <h3 className="font-semibold mb-4">publicités images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart 1: format carré - MANQUANT */}
                        <div>
                          {/* Espace vide - format carré non disponible */}
                        </div>
                        
                        {/* Encart 2: format vertical */}
                        <div>
                          <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format vertical</p>
                            <p>1440 × 2560 px</p>
                            <p>ratio 9:16</p>
                          </div>
                        </div>
                        
                        {/* Encart 3: format horizontal - MANQUANT */}
                        <div>
                          {/* Espace vide - format horizontal non disponible */}
                        </div>
                      </div>

                      {/* Résolution alternative acceptable */}
                      <Card className="mb-4">
                        <CardContent className="pt-4">
                          <p className="text-sm font-semibold mb-2">Résolution alternative acceptable</p>
                          <p className="text-sm">format vertical : 1080 × 1920 px</p>
                      </CardContent>
                    </Card>

                      {/* Encadré fichiers acceptés */}
                      <Alert className="border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités images :</AlertTitle>
                  <AlertDescription>
                          .jpg, .png<br />
                          Taille maximale : 5 Mo.
                  </AlertDescription>
                </Alert>
                    </div>

                    {/* Colonne droite : publicités vidéos */}
                    <div>
                      <h3 className="font-semibold mb-4">publicités vidéos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart 1: format carré - MANQUANT */}
                        <div>
                          {/* Espace vide - format carré non disponible */}
                        </div>
                        
                        {/* Encart 2: format vertical */}
                        <div>
                          <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format vertical</p>
                            <p>1080 × 1920 px</p>
                            <p>ratio 9:16</p>
                          </div>
                        </div>
                        
                        {/* Encart 3: format horizontal - MANQUANT */}
                        <div>
                          {/* Espace vide - format horizontal non disponible */}
                        </div>
                      </div>

                      {/* Encadré fichiers acceptés */}
                      <Alert className="border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités vidéos :</AlertTitle>
                  <AlertDescription>
                          .mov, .mp4 et H.264<br />
                          Durée optimale : 14 secondes maximum<br />
                          Durée maximum : 30 secondes
                  </AlertDescription>
                </Alert>
                    </div>
                  </div>
                </div>

                {/* H2 : Limites de caractères pour les wordings¹ Snapchat */}
                  <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹ Snapchat</h2>
                  
                  {/* 2 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Colonne gauche : Limites de caractères */}
                  <div>
                    <Card>
                        <CardContent className="pt-4">
                          <ul className="text-sm space-y-2">
                            <li><strong>nom de marque + mention « Publicité » :</strong><br />25 caractères maximum, espaces inclus</li>
                            <li><strong>titre :</strong><br />34 caractères maximum, espaces inclus</li>
                            <li>répétition du nom de marque + titre + lien</li>
                            <li>bloc CTA²</li>
                          </ul>
                      </CardContent>
                    </Card>
                  </div>

                    {/* Colonne droite : Marges de sécurité */}
                  <div>
                      <h3 className="text-lg font-semibold mb-4">Marges de sécurité pour les publicités verticales Snapchat</h3>
                      
                      {/* Bloc visuel : encart vertical vide */}
                      <div className="mb-4 max-w-xs">
                        <div className="aspect-[9/16] w-full mb-4 overflow-hidden">
                          <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1080} height={1920} className="w-full h-full object-contain" />
                        </div>

                        {/* Zones de sécurité */}
                    <Card>
                          <CardContent className="pt-4">
                            <p className="text-sm font-semibold mb-2">Zones de sécurité :</p>
                            <ul className="text-sm space-y-2">
                              <li><strong>bloc nom de marque + titre</strong><br />
                                marge de 9 % environ<br />
                                165 pixels environ<br />
                                Dans cette zone, il est recommandé de ne mettre aucun texte ou image important pour la compréhension du message.</li>
                              <li><strong>bloc nom de marque + titre + lien</strong><br />
                                marge de 18,5 % environ<br />
                                350 pixels environ</li>
                          </ul>
                      </CardContent>
                    </Card>
                      </div>
                    </div>
                  </div>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                  {/* 3 colonnes de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Il n'est pas essentiel de mettre votre nom de marque sur le visuel.<br /><br />
                          Votre nom de marque est déjà présent dans l'environnement Snapchat à deux endroits :<br /><br />
                          • en en-tête<br />
                          • en tête de titre
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères a pour conséquence d'empêcher la création de campagne.<br /><br />
                          Aucune tolérance n'est accordée par la plateforme.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Respecter les marges de sécurité pour les médias story.<br /><br />
                          Les formats story sont particulièrement sensibles aux marges de sécurité.<br /><br />
                          Il est important de ne pas disposer des éléments importants (texte ou image) en dehors des limites fixées.<br /><br />
                          Ils pourraient être illisibles ou tronqués.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* H2 : Rappel des livrables attendus par Snapchat */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Rappel des livrables attendus par Snapchat</h2>
                  
                    <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                          <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image et/ou vidéo décliné au format vertical.</li>
                            <li>2 maximum.</li>
                            </ul>
                          </div>
                          <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>Nom de marque.</li>
                            <li>1 titre.</li>
                            <li>1 CTA².</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet TikTok */}
          <TabsContent value="tiktok">
                    <Card>
              <CardHeader>
                <h1>Publicités sur TikTok</h1>
                      </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                          <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* Grille 3 colonnes : publicités vidéos */}
                  <div className="mb-6">
                    <h3 className="font-semibold mb-4">publicités vidéos</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      {/* Encart 1: format carré - MANQUANT */}
                      <div>
                        <div className="aspect-square w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 mb-2">
                          <span className="text-xs text-muted-foreground">Encadré vide</span>
                        </div>
                        <div className="text-sm text-center">
                          <p className="font-medium">format carré</p>
                          <p>—</p>
                          <p>—</p>
                        </div>
                      </div>
                      
                      {/* Encart 2: format vertical */}
                      <div>
                          <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1080} height={1920} className="w-full h-full object-contain" />
                        </div>
                        <div className="text-sm text-center">
                          <p className="font-medium">format vertical</p>
                          <p>1080 × 1920 px</p>
                          <p>ratio 9:16</p>
                        </div>
                      </div>
                      
                      {/* Encart 3: format horizontal - MANQUANT */}
                      <div>
                        <div className="aspect-[1.91/1] w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 mb-2">
                          <span className="text-xs text-muted-foreground">Encadré vide</span>
                        </div>
                        <div className="text-sm text-center">
                          <p className="font-medium">format horizontal</p>
                          <p>—</p>
                          <p>—</p>
                        </div>
                      </div>
                    </div>

                    {/* Résolution alternative acceptable */}
                    <Card className="mb-4 max-w-xs">
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Résolution alternative acceptable</p>
                        <p className="text-sm">format vertical : 1080 × 1920 px</p>
                      </CardContent>
                    </Card>

                    {/* Encadré fichiers acceptés */}
                    <Alert className="max-w-xs border-[#E94C16]">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités vidéos :</AlertTitle>
                      <AlertDescription>
                        .mov, .mp4<br />
                        Durée optimale : 14 secondes maximum<br />
                        Durée maximum : 30 secondes
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* H2 : Limites de caractères pour les wordings¹ TikTok */}
                  <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹ TikTok</h2>
                  
                  {/* 2 colonnes */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Colonne gauche : Limites de caractères */}
                  <div>
                    <Card>
                        <CardContent className="pt-4">
                          <ul className="text-sm space-y-2">
                            <li>photo de profil</li>
                            <li>nom de marque</li>
                            <li><strong>texte principal :</strong><br />100 caractères maximum, espaces inclus</li>
                            <li>bloc CTA²</li>
                            <li>bloc navigation application</li>
                          </ul>
                      </CardContent>
                    </Card>
                  </div>

                    {/* Colonne droite : Marges de sécurité */}
                  <div>
                      <h3 className="text-lg font-semibold mb-4">Marges de sécurité pour les publicités verticales TikTok</h3>
                      
                      {/* Bloc visuel : encart vertical vide */}
                      <div className="mb-4 max-w-xs">
                        <div className="aspect-[9/16] w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 mb-4 overflow-hidden">
                          <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1080} height={1920} className="w-full h-full object-contain" />
                </div>

                        {/* Zones de sécurité */}
                    <Card>
                          <CardContent className="pt-4">
                            <p className="text-sm font-semibold mb-2">Zones de sécurité :</p>
                            <ul className="text-sm space-y-2">
                              <li><strong>bloc following / for you</strong><br />
                                marge de 6 % environ<br />
                                126 pixels environ<br />
                                Dans cette zone, il est recommandé de ne mettre aucun élément important (texte ou image) essentiel à la compréhension du message publicitaire.</li>
                              <li><strong>bloc nom de marque + texte principal + interactions</strong><br />
                                marge de 20 % environ<br />
                                400 pixels environ</li>
                        </ul>
                      </CardContent>
                    </Card>
                      </div>
                    </div>
                  </div>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                  {/* 3 colonnes de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Il n'est pas essentiel de mettre votre nom de marque ou logo sur le visuel.<br /><br />
                          Votre nom de marque et votre logo sont déjà présents dans l'environnement TikTok à deux endroits :<br /><br />
                          • photo de profil en en-tête<br />
                          • nom de marque en en-tête du texte principal
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères a pour conséquence d'empêcher la création de campagne.<br /><br />
                          Aucune tolérance n'est accordée par la plateforme.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Respecter les marges de sécurité pour les médias story.<br /><br />
                          Les formats story sont particulièrement sensibles aux marges de sécurité.<br /><br />
                          Il est important de ne pas disposer des éléments importants (texte ou image) en dehors des limites fixées.<br /><br />
                          Ils pourraient être illisibles ou tronqués.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* H2 : Rappel des livrables attendus par TikTok */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Rappel des livrables attendus par TikTok</h2>
                  
                    <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                          <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 vidéo déclinée au format vertical.</li>
                            <li>2 maximum.</li>
                            <li>1 logo en format carré.</li>
                        </ul>
                          </div>
                          <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 texte principal.</li>
                            <li>1 CTA².</li>
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Spotify */}
          <TabsContent value="spotify">
                    <Card>
              <CardHeader>
                <h1>Publicités sur Spotify</h1>
                      </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                          <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* 2 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : publicités images et logos */}
                    <div>
                      <h3 className="font-semibold mb-4">publicités images (hors fichier audio)</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart 1: format carré */}
                        <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format Direct IO et Ad Studio" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format Direct IO et Ad Studio</p>
                            <p>1440 × 1440 px</p>
                            <p>ratio 1:1</p>
                          </div>
                        </div>
                      </div>

                      {/* Résolution alternative acceptable */}
                      <Card className="mb-4">
                        <CardContent className="pt-4">
                          <p className="text-sm font-semibold mb-2">Résolution alternative acceptable</p>
                          <p className="text-sm">format Direct IO et Ad Studio : 1080 × 1080 px</p>
                      </CardContent>
                    </Card>

                      {/* Sous-bloc : logos obligatoires */}
                      <div className="mb-4">
                        <h4 className="font-semibold mb-4">logos obligatoires</h4>
                        
                        {/* Encart visuel carré */}
                        <div className="mb-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="md:col-span-1">
                              <div className="aspect-square w-full mb-2 overflow-hidden">
                                <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                              </div>
                              <div className="text-sm text-center">
                                <p className="font-medium">format carré</p>
                                <p>1440 × 1440 px</p>
                                <p>ratio 1:1</p>
                              </div>
                            </div>
                          </div>
                  </div>
                </div>

                      {/* Encadré fichiers acceptés */}
                      <Alert className="border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités images et logos :</AlertTitle>
                      <AlertDescription>
                          .jpg, .png
                      </AlertDescription>
                    </Alert>
                    </div>

                    {/* Colonne droite : canvas et publicités audios */}
                    <div>
                      <h4 className="font-semibold mb-4">canvas associés à la publicité (hors fichier audio)</h4>
                      
                      {/* Encart visuel vertical */}
                      <div className="mb-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="md:col-span-1">
                            <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                              <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1440} height={2560} className="w-full h-full object-contain" />
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format vertical</p>
                              <p>1440 × 2560 px</p>
                              <p>ratio 9:16</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Encadré fichiers acceptés pour les canvas */}
                      <Alert className="mb-4 border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold">Fichiers acceptés pour les canvas :</AlertTitle>
                      <AlertDescription>
                          .jpg, .png, .mov, .mp4 sans audio<br />
                          Durée de la boucle : entre 3 à 8 secondes sans audio
                      </AlertDescription>
                    </Alert>

                      {/* Sous-bloc : publicités audios */}
                      <div>
                        <h3 className="font-semibold mb-4">publicités audios</h3>
                        
                        {/* Encadré fichiers acceptés pour les publicités audios */}
                        <Alert className="border-[#E94C16]">
                          <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                          <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités audios :</AlertTitle>
                      <AlertDescription>
                            .mp3, .ogg, .wav, jusqu'à 500 Mo<br />
                            <strong>caractéristiques audio requises :</strong><br />
                            stéréo<br />
                            échantillonnage à 44,1 kHz<br />
                            débit de 192 kbit/s<br />
                            niveau sonore global : -16 LUFS
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                  </div>
                  </div>

                {/* H2 : Limites de caractères pour les wordings¹ */}
                  <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹</h2>
                  
                  {/* 2 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <ul className="text-sm space-y-2">
                          <li><strong>nom de marque :</strong><br />25 caractères maximum, espaces inclus</li>
                          <li>photo de profil</li>
                          <li>mention « Publicité »</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <ul className="text-sm space-y-2">
                          <li><strong>accroche :</strong><br />40 caractères maximum, espaces inclus</li>
                          <li>bloc CTA²</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* H2 : Livrables attendus par Spotify */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Livrables attendus par Spotify</h2>
                  
                    <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image en format carré.</li>
                            <li>1 logo en format carré.</li>
                            <li>1 fichier audio (30 secondes maximum).</li>
                        </ul>
                  </div>
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>Nom de marque.</li>
                            <li>1 accroche.</li>
                            <li>1 CTA².</li>
                        </ul>
                        </div>
                      </div>
                      </CardContent>
                    </Card>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                    <Card>
                    <CardContent className="pt-4">
                      <p className="text-sm">
                        Ne pas dépasser les limites de caractères pour les wordings¹.<br />
                        Dépasser les limites de caractères a pour conséquence d'empêcher la création de campagne.<br />
                        Aucune tolérance n'est accordée.
                      </p>
                      </CardContent>
                    </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google Search */}
          <TabsContent value="googlesearch">
            <Card>
              <CardHeader>
                <h1>Publicités sur Google Search</h1>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                  <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* 2 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : publicités images */}
                    <div>
                      <h3 className="font-semibold mb-4">publicités images</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart 1: format carré */}
                        <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1440 × 1440 px</p>
                            <p>ratio 1:1</p>
                          </div>
                        </div>
                        
                        {/* Encart 2: format vertical - MANQUANT */}
                        <div>
                          {/* Espace vide - format vertical non disponible */}
                        </div>
                        
                        {/* Encart 3: format horizontal */}
                        <div>
                          <div className="aspect-[1.91/1] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20horizontal_tv_instream@10x.png" alt="Format horizontal" width={1440} height={754} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format horizontal</p>
                            <p>1440 × 754 px</p>
                            <p>ratio 1.91:1</p>
                          </div>
                        </div>
                      </div>

                      {/* Résolutions alternatives acceptables */}
                      <Card className="mt-4">
                        <CardContent className="pt-4">
                          <p className="text-sm font-semibold mb-2">Résolutions alternatives acceptables</p>
                          <ul className="text-sm space-y-1">
                            <li>format carré : 1080 × 1080 px</li>
                            <li>format horizontal : 1200 × 628 px</li>
                          </ul>
                      </CardContent>
                    </Card>
                  </div>

                    {/* Colonne droite : logo obligatoire */}
                    <div>
                      <h4 className="font-semibold mb-4">logo obligatoire</h4>
                      
                      {/* Grille 2 colonnes pour aligner avec la colonne gauche */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        {/* Encart visuel carré (même taille que l'image carrée de gauche) */}
                        <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carré_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1080 × 1080 px</p>
                            <p>ratio 1:1</p>
                          </div>
                        </div>
                        {/* Placeholder vide pour maintenir la structure de grille */}
                        <div></div>
                </div>

                      {/* Encadré fichiers acceptés (aligné avec "Résolutions alternatives acceptables") */}
                      <Alert className="mt-4 border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <div className="mb-2">
                          <p className="text-sm font-semibold"><strong>Fichiers acceptés pour les logos :</strong></p>
                        </div>
                        <AlertDescription>
                          .jpg, .png<br />
                          Taille maximale : 5120 ko
                        </AlertDescription>
                      </Alert>
                    </div>
                </div>
                </div>

                {/* H2 : Limites de caractères pour les wordings¹ */}
                <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹</h2>
                  
                  {/* 2 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Éléments visibles :</p>
                        <ul className="text-sm space-y-1">
                          <li>logo + nom de marque + site web</li>
                          <li>titres</li>
                          <li>descriptions</li>
                          <li>info-bulles</li>
                          <li>liens annexes</li>
                          <li>téléphone</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Titres (Obligatoires) :</p>
                        <ul className="text-sm space-y-1 mb-3">
                          <li>3 titres minimum (15 maximum)</li>
                          <li>30 caractères maximum, espaces inclus</li>
                          </ul>
                        <p className="text-sm font-semibold mb-2">Descriptions (Obligatoires) :</p>
                        <ul className="text-sm space-y-1 mb-3">
                          <li>2 descriptions minimum (4 maximum)</li>
                          <li>90 caractères maximum, espaces inclus</li>
                          </ul>
                        <p className="text-sm font-semibold mb-2">Nom d'entreprise (Obligatoire) :</p>
                        <ul className="text-sm space-y-1 mb-3">
                          <li>25 caractères maximum, espaces inclus</li>
                          </ul>
                        <p className="text-sm font-semibold mb-2">Info-bulles – phrases clés (Obligatoires) :</p>
                        <ul className="text-sm space-y-1 mb-3">
                          <li>20 maximum</li>
                          <li>25 caractères maximum, espaces inclus</li>
                          </ul>
                        <p className="text-sm font-semibold mb-2">Liens annexes – pages/rubriques du site (Obligatoires) :</p>
                        <ul className="text-sm space-y-1">
                          <li>4 maximum</li>
                          <li>1 titre : 25 caractères maximum, espaces inclus</li>
                          <li>1 description (2 max) : 35 caractères maximum, espaces inclus</li>
                          <li>1 URL</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                  {/* 3 colonnes de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères empêche la création de campagnes sur Google.<br /><br />
                          Aucune tolérance n'est accordée.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas utiliser de caractères de ponctuation en fin de phrase.<br /><br />
                          Google n'autorise pas la ponctuation en fin de phrase pour les titres et descriptions.<br /><br />
                          Aucune tolérance n'est accordée.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Éviter les répétitions entre les titres et les descriptions.<br /><br />
                          Des répétitions trop régulières peuvent générer des associations redondantes.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* H2 : Rappel des livrables attendus par Google Search */}
                <div className="mt-7 md:mt-9 lg:mt-12">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4 md:mb-5 lg:mb-6">Rappel des livrables attendus par Google Search</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>1 visuel image et/ou vidéo décliné aux 2 formats (carré et horizontal).</li>
                          <li>20 maximum.</li>
                          <li>1 logo en format carré.</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>3 titres minimum (15 maximum). Possibilité d'épingler 1 titre.</li>
                          <li>2 descriptions minimum (4 maximum).</li>
                          <li>Nom d'entreprise.</li>
                          <li>Numéro de téléphone.</li>
                          <li>Info-bulles : 20 maximum.</li>
                          <li>Liens annexes : 4 maximum.</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* Encadré d'alerte (pleine largeur) */}
                <Alert className="mt-6 flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                      <AlertDescription>
                    <strong>3 annonces différentes maximum.</strong>
                      </AlertDescription>
                    </Alert>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet YouTube */}
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <h1>Publicités sur YouTube</h1>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* H2 : Liste des formats */}
                  <div>
                  <h2 className="mb-6">Liste des formats</h2>
                  
                  {/* 2 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : publicités vidéos */}
                    <div>
                      <h3 className="font-semibold mb-4">publicités vidéos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart visuel carré */}
                        <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format carré_infeed@10x.png" alt="Format InFeed" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format InFeed</p>
                            <p>1440 × 1440 px</p>
                            <p>ratio 1:1</p>
                  </div>
                  </div>

                        {/* Encart visuel vertical */}
                  <div>
                          <div className="aspect-[9/16] w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format Shorts" width={1440} height={2560} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format Shorts</p>
                            <p>1440 × 2560 px</p>
                            <p>ratio 9:16</p>
                  </div>
                </div>

                        {/* Encart visuel horizontal */}
                        <div>
                          <div className="aspect-video w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format horizontal_tv_instream@10x.png" alt="Format InStream, Bumper" width={2560} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format InStream, Bumper</p>
                            <p>2560 × 1440 px</p>
                            <p>ratio 16:9</p>
                          </div>
                  </div>
                </div>

                      {/* Résolutions alternatives acceptables */}
                      <Card className="mb-4">
                        <CardContent className="pt-4">
                          <p className="text-sm font-semibold mb-2">Résolutions alternatives acceptables</p>
                          <ul className="text-sm space-y-1">
                            <li>format InFeed : 1080 × 1080 px</li>
                            <li>format Shorts : 1080 × 1920 px</li>
                            <li>format InStream, Bumper : 1200 × 628 px</li>
                          </ul>
                      </CardContent>
                    </Card>

                      {/* Encadré fichiers acceptés pour les publicités vidéos */}
                      <Alert className="border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités vidéos :</AlertTitle>
                      <AlertDescription>
                          Lien YouTube au format https://…<br />
                          Durée optimale : entre 6 et 14 secondes maximum<br />
                          Durée maximum : 30 secondes<br />
                          4 liens vidéos maximum<br />
                          Les vidéos doivent être déjà auto-hébergées sur votre compte YouTube<br />
                          L'importation se fait uniquement via le lien YouTube de la vidéo<br />
                          Les vidéos peuvent être non référencées mais doivent être impérativement publiques
                      </AlertDescription>
                    </Alert>
                    </div>

                    {/* Colonne droite : bannière associée à la publicité */}
                    <div>
                      <h4 className="font-semibold mb-4">bannière associée à la publicité</h4>
                      
                      {/* Encart visuel horizontal */}
                      <div className="mb-4">
                        <div className="aspect-[300/60] w-full rounded-md border-2 border-dashed border-muted-foreground/25 flex items-center justify-center bg-muted/10 mb-2">
                          <span className="text-xs text-muted-foreground">Encadré vide</span>
                        </div>
                        <div className="text-sm text-center">
                          <p className="font-medium">format bannière</p>
                          <p>300 × 60 px</p>
                  </div>
                </div>

                      {/* Encadré fichiers acceptés pour les bannières */}
                      <Alert className="border-[#E94C16]">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold">Fichiers acceptés pour les bannières :</AlertTitle>
                      <AlertDescription>
                          .jpg, .png, .gif<br />
                          Taille maximale : 150 ko
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>
                  </div>

                {/* H2 : Limites de caractères pour les wordings¹ */}
                  <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹</h2>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <ul className="text-sm space-y-2">
                        <li><strong>1 titre long (Obligatoire)</strong><br />90 caractères maximum, espaces inclus</li>
                        <li><strong>1 titre court (Obligatoire)</strong><br />30 caractères maximum, espaces inclus</li>
                        <li><strong>1 description (Obligatoire)</strong><br />70 caractères maximum, espaces inclus</li>
                          </ul>
                    </CardContent>
                  </Card>
                </div>

                {/* H2 : Recommandations et contraintes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  
                  {/* 2 colonnes de texte */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères a pour conséquence d'empêcher la création de campagne sur YouTube.<br /><br />
                          Aucune tolérance n'est accordée.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas utiliser de caractères de ponctuation en fin de phrase.<br /><br />
                          YouTube n'autorise pas l'utilisation de ponctuation en fin de phrase pour le titre long et les descriptions.<br /><br />
                          Aucune tolérance n'est accordée.
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                {/* H2 : Livrables attendus par YouTube */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Livrables attendus par YouTube</h2>
                  
                  <Card>
                    <CardContent className="pt-4">
                      <div className="space-y-4">
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 lien de vidéo YouTube au format InStream/Bumper obligatoire</li>
                            <li>Déclinaison recommandée dans les 3 formats :<br />
                              format InFeed<br />
                              format Shorts<br />
                              format InStream/Bumper</li>
                            <li>4 maximum</li>
                          </ul>
                  </div>
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 titre long</li>
                            <li>1 titre court</li>
                            <li>1 description</li>
                            <li>1 CTA²</li>
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
