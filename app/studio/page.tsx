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
import SafeImage from "@/components/safe-image"

export default function StudioPage() {
  const [tooltip1Open, setTooltip1Open] = useState(false)
  const [tooltip2Open, setTooltip2Open] = useState(false)
  const [tooltip3Open, setTooltip3Open] = useState(false)
  const [marginsTooltip1Open, setMarginsTooltip1Open] = useState(false)
  const [marginsTooltip2Open, setMarginsTooltip2Open] = useState(false)
  const [searchLimites1Open, setSearchLimites1Open] = useState(false)
  const [searchLimites2Open, setSearchLimites2Open] = useState(false)
  const [searchLimites3Open, setSearchLimites3Open] = useState(false)
  const [searchLimites4Open, setSearchLimites4Open] = useState(false)
  const [searchLimites5Open, setSearchLimites5Open] = useState(false)
  const [searchLimites6Open, setSearchLimites6Open] = useState(false);
  const [linkedinLimites1Open, setLinkedinLimites1Open] = useState(false);
  const [linkedinLimites2Open, setLinkedinLimites2Open] = useState(false);
  const [linkedinLimites3Open, setLinkedinLimites3Open] = useState(false);
  const [linkedinLimites4Open, setLinkedinLimites4Open] = useState(false);
  const [linkedinLimites5Open, setLinkedinLimites5Open] = useState(false);
  const [linkedinLimites6Open, setLinkedinLimites6Open] = useState(false);
  const [tiktokLimites1Open, setTiktokLimites1Open] = useState(false);
  const [tiktokLimites2Open, setTiktokLimites2Open] = useState(false);
  const [tiktokLimites3Open, setTiktokLimites3Open] = useState(false);
  const [tiktokLimites4Open, setTiktokLimites4Open] = useState(false);
  const [tiktokLimites5Open, setTiktokLimites5Open] = useState(false);
  const [tiktokLimites6Open, setTiktokLimites6Open] = useState(false);
  const [tiktokMarges1Open, setTiktokMarges1Open] = useState(false);
  const [tiktokMarges2Open, setTiktokMarges2Open] = useState(false);
  const [tiktokMarges3Open, setTiktokMarges3Open] = useState(false);
  const [snapLimites1Open, setSnapLimites1Open] = useState(false);
  const [snapLimites2Open, setSnapLimites2Open] = useState(false);
  const [snapLimites3Open, setSnapLimites3Open] = useState(false);
  const [snapMarges1Open, setSnapMarges1Open] = useState(false);
  const [snapMarges2Open, setSnapMarges2Open] = useState(false);
  const [spotifyLimites1Open, setSpotifyLimites1Open] = useState(false);
  const [spotifyLimites2Open, setSpotifyLimites2Open] = useState(false);

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
              </CardHeader>
              <CardContent className="space-y-6">
                {/* En 1 clin d'œil - META (compact) */}
                <Alert id="meta-clin-doeil" className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En 1 clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-1">Groupe publicitaire standard</p>
                          <p className="mb-1">Média : 1 visuel image et/ou vidéo, décliné aux 3 formats (carré, vertical, horizontal). 3 groupes (standard et/ou carrousel) recommandés.</p>
                          <p>Wording¹ : 1 texte principal, 1 titre, 1 CTA². Images ou vidéos simples, sans interaction particulière.</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Groupe publicitaire carrousel</p>
                          <p className="mb-1">Média : 2 visuels image et/ou vidéo en format carré (2 à 10 vignettes). 3 groupes (standard et/ou carrousel) recommandés.</p>
                          <p>Wording¹ : 1 texte principal, 2 titres minimum, 1 CTA². Vignettes côte à côte, navigation vers la droite.</p>
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
                              <div className="w-full">
                                <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
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
                              <div className="w-full">
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
                              <div className="w-full">
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
                              <div className="w-full">
                                <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1080} height={1080} className="w-full h-auto object-contain" />
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
                              <div className="w-full">
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
                              <div className="w-full">
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
                        <div className="rounded-md border border-muted bg-white px-3 py-2">
                          <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Résolutions alternatives acceptables</h5>
                          <ul className="space-y-0.5 text-xs text-muted-foreground">
                            <li>format carré : 1080 × 1080 px</li>
                            <li>format vertical : 1080 × 1920 px</li>
                            <li>format horizontal : 1200 × 628 px</li>
                          </ul>
                        </div>
                        <Alert className="py-3 border-[#E94C16] bg-white">
                          <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4" />
                          <AlertDescription className="text-sm text-muted-foreground">
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
                          <AlertDescription className="text-muted-foreground">
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
                          <div className="w-full max-w-[135px] relative">
                            <div className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-sm relative">
                              <SafeImage
                                src="/images/META-format-complet-carre-10x.png"
                                alt="Limites de caractères pour les wordings"
                                width={1440}
                                height={1440}
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
                        <div className="flex justify-start">
                          <div className="w-full max-w-[135px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-sm relative">
                            <SafeImage
                              src="/images/META Marges de securite 2@10x.png"
                              extraSrcCandidates={[
                                // NFC variant (single-codepoint accents) often differs from NFD (combining accents)
                                "/images/META Marges de securite 2@10x.png",
                                "/images/META%20Marges%20de%20securite%202@10x.png",
                              ]}
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
                            <NextImage src="/images/META format carre.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
                          </div>

                          {/* Encart 2: format vertical */}
                          <div className="flex flex-col items-center">
                            <NextImage src="/images/META format vertical.png" alt="Format vertical" width={1440} height={2560} className="w-full h-auto object-contain" />
                          </div>

                          {/* Encart 3: format horizontal */}
                          <div className="flex flex-col items-center">
                            <NextImage src="/images/META format horizontal.png" alt="Format horizontal" width={1440} height={754} className="w-full h-auto object-contain" />
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
                    <div className="mt-4 border-t border-orange-500/50 pt-3 text-center">
                      <p className="text-sm font-semibold text-orange-500 inline-block">
                        6 groupes publicitaires (standard et/ou carrousel) maximum.
                      </p>
                    </div>
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

                {/* En un clin d'œil - Rappel des livrables */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d'œil</strong>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Colonne gauche : Pré-requis média */}
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image décliné aux 3 formats (carré, vertical, horizontal).</li>
                            <li>5 maximum. (Même pour une vidéo)</li>
                            <li>2 visuels logo (format carré et bannière).</li>
                            <li>5 maximum.</li>
                          </ul>
                        </div>
                        
                        {/* Colonne droite : Pré-requis wording */}
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
                    </div>
                  </AlertDescription>
                </Alert>

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
                            <div className="w-full">
                              <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
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
                            <div className="w-full">
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
                            <div className="w-full">
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

                      {/* (Résolutions alternatives acceptables déplacé plus bas, à côté des fichiers acceptés) */}
                    </div>

                    {/* Colonne droite : publicités vidéos */}
                    <div>
                      <h3 className="font-semibold mb-4">publicités vidéos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                        {/* Encart 1 : format carré */}
                        <div className="flex flex-col items-center">
                          <div className="w-full max-w-[240px] mb-2">
                            <div className="w-full">
                              <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
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
                            <div className="w-full">
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
                            <div className="w-full">
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
                  {/* Résolutions + fichiers acceptés, alignés sur 2 colonnes */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    {/* Colonne gauche : résolutions + fichiers images/logos */}
                    <div className="space-y-3">
                      <div className="rounded-md border border-muted bg-white px-3 py-2">
                        <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">
                          Résolutions alternatives acceptables
                        </h5>
                        <ul className="space-y-0.5 text-xs text-muted-foreground">
                          <li>format carré : 1080 × 1080 px</li>
                          <li>format vertical : 1080 × 1920 px</li>
                          <li>format horizontal : 1200 × 628 px</li>
                        </ul>
                      </div>
                      <Alert className="h-auto flex flex-col border-[#E94C16] bg-white">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold text-muted-foreground">
                          Fichiers acceptés pour les publicités images et logos :
                        </AlertTitle>
                        <AlertDescription className="flex-1 text-muted-foreground">
                          .jpg, .png<br />
                          Taille maximale : 5120 ko<br />
                          Le format .gif est incompatible avec la pub responsive.
                        </AlertDescription>
                      </Alert>
                    </div>

                    {/* Colonne droite : fichiers vidéos */}
                    <Alert className="h-auto flex flex-col border-[#E94C16] bg-white">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold text-muted-foreground">
                        Fichiers acceptés pour les publicités vidéos :
                      </AlertTitle>
                      <AlertDescription className="flex-1 text-muted-foreground">
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

                  <h2 className="mb-4 md:mb-5 lg:mb-6">logos obligatoires</h2>
                  
                  {/* Grille de logos seule (même logique 3 colonnes que la liste des formats) */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-7 md:mb-9 lg:mb-12">
                    {/* Logo format carré */}
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[240px] mb-2">
                        <div className="aspect-square w-full overflow-hidden">
                          <NextImage
                            src="/images/format%20carre_infeed@10x.png"
                            alt="Format carré"
                            width={1080}
                            height={1080}
                            className="w-full h-full object-contain"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-center">
                        <p className="font-medium">format carré</p>
                        <p>1080 × 1080 px</p>
                        <p>ratio 1:1</p>
                      </div>
                    </div>

                    {/* Logo format bannière */}
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[240px] mb-2">
                        <div className="w-full overflow-hidden">
                          <NextImage
                            src="/images/format%20horizontal_tv_instream@10x.png"
                            alt="Format bannière"
                            width={1440}
                            height={754}
                            className="w-full h-auto object-contain"
                          />
                        </div>
                      </div>
                      <div className="text-sm text-center">
                        <p className="font-medium">format bannière</p>
                        <p>800 × 200 px</p>
                        <p>ratio 4:1</p>
                      </div>
                    </div>

                    {/* Colonne vide (réserve pour un 3ᵉ format si besoin) */}
                    <div className="hidden md:block" />
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

                    {/* Colonne droite : Rappel des livrables (même DA que META) */}
                    <div>
                      <h2 className="text-2xl font-bold text-orange-500 mb-6">
                        Rappel des livrables attendus par Display
                      </h2>
                      <div className="space-y-4">
                        {/* Pré-requis média minimum obligatoires */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">
                            Pré-requis média minimum obligatoires :
                          </h5>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image décliné aux 3 formats (carré, vertical, horizontal).</li>
                            <li>5 visuels maximum (images et/ou vidéos confondues).</li>
                            <li>2 visuels logo (format carré et bannière).</li>
                            <li>5 logos maximum.</li>
                          </ul>
                        </div>

                        {/* Pré-requis wording minimum obligatoires */}
                        <div>
                          <h5 className="text-sm font-semibold mb-2">
                            Pré-requis wording¹ minimum obligatoires :
                          </h5>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 titre long.</li>
                            <li>1 titre court (jusqu&apos;à 5 maximum).</li>
                            <li>1 description (jusqu&apos;à 5 maximum).</li>
                            <li>Nom d&apos;entreprise.</li>
                            <li>1 CTA².</li>
                          </ul>
                        </div>
                      </div>
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

                {/* En 1 clin d'œil - Rappel des livrables LinkedIn (compact) */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En 1 clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="font-semibold mb-1">Groupe publicitaire standard</p>
                          <p className="mb-1">Média : 1 visuel (image/vidéo) décliné carré + horizontal. 2 groupes (standard ou carrousel) recommandés.</p>
                          <p>Wording : 1 texte principal, 1 titre, 1 CTA. Images ou vidéos simples.</p>
                        </div>
                        <div>
                          <p className="font-semibold mb-1">Groupe publicitaire carrousel</p>
                          <p className="mb-1">Média : 2 visuels image format carré min., 2 à 10 vignettes. 2 groupes (standard ou carrousel) recommandés.</p>
                          <p>Wording : 1 texte principal, 2 titres min., 1 CTA. Vignettes côte à côte, navigation à droite.</p>
                        </div>
                      </div>
                      <p className="text-sm font-semibold pt-1 border-t border-orange-500/30">2 groupes max. (standard ou carrousel). Pas de mix des groupes pour une même campagne.</p>
                    </div>
                  </AlertDescription>
                </Alert>

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
                            <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
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

                      {/* Résolutions alternatives acceptables */}
                      <div className="mt-4 rounded-md border border-muted bg-white px-3 py-2">
                        <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Résolutions alternatives acceptables</h5>
                        <ul className="space-y-0.5 text-xs text-muted-foreground">
                          <li>format carré : 1080 × 1080 px</li>
                          <li>format vertical : 1080 × 1920 px (déprécié)</li>
                          <li>format horizontal : 1200 × 628 px</li>
                        </ul>
                      </div>
                </div>

                    {/* Colonne droite : publicités vidéos */}
                          <div>
                      <h3 className="font-semibold mb-4">publicités vidéos</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Encart 1 : format carré */}
                          <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
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
                    <Alert className="border-[#E94C16] bg-white">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold text-muted-foreground">Fichiers acceptés pour les publicités images :</AlertTitle>
                      <AlertDescription className="text-muted-foreground">
                        .jpg, .png
                      </AlertDescription>
                    </Alert>
                    <Alert className="border-[#E94C16] bg-white">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold text-muted-foreground">Fichiers acceptés pour les publicités vidéos :</AlertTitle>
                      <AlertDescription className="text-muted-foreground">
                        .mp4<br />
                        Durée optimale : 14 secondes maximum<br />
                        Durée maximum : 30 secondes<br />
                        Fichier accepté de sous-titrage (si dialogue, voix-off…) :<br />
                        .srt
                      </AlertDescription>
                    </Alert>
                  </div>
                </div>

                {/* H2 : Limites de caractères pour les wordings - image + bulles numérotées (comme META/Search) */}
                  <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings</h2>
                  <p className="text-sm text-muted-foreground mb-4">Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.</p>
                  <div className="flex justify-center">
                    <div className="w-full max-w-[400px] relative">
                      <div className="aspect-square w-full overflow-hidden rounded-lg shadow-sm relative">
                        <SafeImage
                          src="/images/META-format-complet-carre-10x.png"
                          alt="Limites de caractères pour les wordings LinkedIn"
                          width={1440}
                          height={1440}
                          className="w-full h-full object-contain"
                        />
                        <TooltipProvider delayDuration={0}>
                          {/* 1 : photo de profil + nom de page */}
                          <Tooltip open={linkedinLimites1Open} onOpenChange={setLinkedinLimites1Open}>
                            <TooltipTrigger asChild>
                              <div className="absolute top-[8%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setLinkedinLimites1Open(!linkedinLimites1Open)}>1</div>
                            </TooltipTrigger>
                            <TooltipContent><div className="text-sm"><strong>photo de profil + nom de page</strong></div></TooltipContent>
                          </Tooltip>
                          {/* 2 : texte principal */}
                          <Tooltip open={linkedinLimites2Open} onOpenChange={setLinkedinLimites2Open}>
                            <TooltipTrigger asChild>
                              <div className="absolute top-[18%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setLinkedinLimites2Open(!linkedinLimites2Open)}>2</div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="text-sm"><strong>texte principal :</strong><br />150 caractères maximum, espaces inclus</div>
                            </TooltipContent>
                          </Tooltip>
                          {/* 3 : image ou vidéo */}
                          <Tooltip open={linkedinLimites3Open} onOpenChange={setLinkedinLimites3Open}>
                            <TooltipTrigger asChild>
                              <div className="absolute top-[50%] left-[50%] -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setLinkedinLimites3Open(!linkedinLimites3Open)}>3</div>
                            </TooltipTrigger>
                            <TooltipContent><div className="text-sm"><strong>image ou vidéo</strong></div></TooltipContent>
                          </Tooltip>
                          {/* 4 : titre */}
                          <Tooltip open={linkedinLimites4Open} onOpenChange={setLinkedinLimites4Open}>
                            <TooltipTrigger asChild>
                              <div className="absolute bottom-[22%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setLinkedinLimites4Open(!linkedinLimites4Open)}>4</div>
                            </TooltipTrigger>
                            <TooltipContent className="max-w-xs">
                              <div className="text-sm"><strong>titre :</strong><br />70 caractères maximum, espaces inclus<br /><span className="text-xs">(45 pour un groupe publicitaire carrousel)</span></div>
                            </TooltipContent>
                          </Tooltip>
                          {/* 5 : description */}
                          <Tooltip open={linkedinLimites5Open} onOpenChange={setLinkedinLimites5Open}>
                            <TooltipTrigger asChild>
                              <div className="absolute bottom-[12%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setLinkedinLimites5Open(!linkedinLimites5Open)}>5</div>
                            </TooltipTrigger>
                            <TooltipContent><div className="text-sm"><strong>description :</strong><br />70 caractères maximum, espaces inclus</div></TooltipContent>
                          </Tooltip>
                          {/* 6 : bloc CTA */}
                          <Tooltip open={linkedinLimites6Open} onOpenChange={setLinkedinLimites6Open}>
                            <TooltipTrigger asChild>
                              <div className="absolute bottom-[4%] right-[8%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setLinkedinLimites6Open(!linkedinLimites6Open)}>6</div>
                            </TooltipTrigger>
                            <TooltipContent><div className="text-sm"><strong>bloc CTA²</strong></div></TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
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
                          Il n&apos;est pas essentiel de mettre votre logo ou votre nom de marque sur le visuel.<br /><br />
                          Votre logo et votre nom de marque sont déjà présents dans l&apos;environnement LinkedIn sous deux formes :<br /><br />
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

                {/* Section: Rappel des livrables attendus par LinkedIn (même bloc que META, texte adapté) */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-6">Rappel des livrables attendus par LinkedIn en fonction du type de publicité</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Colonne gauche : groupe publicitaire standard */}
                    <div>
                      <h3 className="font-semibold mb-4">groupe publicitaire standard</h3>
                      {/* Bloc visuel : 3 formats (horizontal, vertical déprécié, carré) comme sur le screen */}
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        {/* Encart 1 : format horizontal (IMAGE 1) */}
                        <div className="flex flex-col items-center">
                          <NextImage src="/images/META format horizontal.png" alt="Format horizontal" width={1440} height={754} className="w-full h-auto object-contain" />
                          <span className="text-xs text-muted-foreground text-center mt-1">IMAGE 1<br />image ou vidéo</span>
                        </div>
                        {/* Encart 2 : format vertical déprécié (IMAGE 2) */}
                        <div className="flex flex-col items-center relative">
                          <div className="relative w-full">
                            <NextImage src="/images/META format vertical.png" alt="Format vertical" width={1440} height={2560} className="w-full h-auto object-contain" />
                            <Badge variant="destructive" className="absolute top-1 right-1 text-xs">déprécié</Badge>
                          </div>
                          <span className="text-xs text-muted-foreground text-center mt-1">IMAGE 2<br />image ou vidéo</span>
                        </div>
                        {/* Encart 3 : format carré (IMAGE 3) */}
                        <div className="flex flex-col items-center">
                          <NextImage src="/images/META format carre.png" alt="Format carré" width={1440} height={1440} className="w-full h-auto object-contain" />
                          <span className="text-xs text-muted-foreground text-center mt-1">IMAGE 3<br />image ou vidéo</span>
                        </div>
                      </div>
                      {/* Pré-requis média minimum obligatoires */}
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-sm">Pré-requis média minimum obligatoires :</h5>
                        <p className="text-sm">
                          1 visuel image et/ou vidéo, décliné aux 2 formats (carré et horizontal).
                        </p>
                        <p className="text-sm mt-1">
                          2 groupes publicitaires (standard ou carrousel) recommandés.
                        </p>
                      </div>
                      {/* Pré-requis wording¹ minimum obligatoires */}
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
                          Sous forme d&apos;images ou de vidéos simples, sans interaction particulière.
                        </p>
                      </div>
                    </div>
                    {/* Colonne droite : groupe publicitaire carrousel */}
                    <div>
                      <h3 className="font-semibold mb-4">groupe publicitaire carrousel</h3>
                      {/* Bloc visuel explicatif */}
                      <div className="mb-6">
                        <div className="w-full rounded-md overflow-hidden">
                          <NextImage src="/images/META format complet caroussel@10x.png" alt="Format complet carrousel LinkedIn" width={1920} height={1080} className="w-full h-auto object-contain" />
                        </div>
                      </div>
                      {/* Pré-requis média minimum obligatoires */}
                      <div className="mb-4">
                        <h5 className="font-semibold mb-2 text-sm">Pré-requis média minimum obligatoires :</h5>
                        <p className="text-sm">
                          2 visuels image, en format carré.
                        </p>
                        <p className="text-sm mt-1">
                          2 minimum et 10 maximum.
                        </p>
                        <p className="text-sm mt-1">
                          2 groupes publicitaires (standard ou carrousel) recommandés.
                        </p>
                      </div>
                      {/* Pré-requis wording¹ minimum obligatoires */}
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
                          Sous forme d&apos;images ou de vidéos disposées à travers de vignettes les unes à côté des autres qui peuvent être visionnées en naviguant vers la droite.
                        </p>
                      </div>
                    </div>
                  </div>
                  {/* Encadré d'alerte : mix des groupes impossible */}
                  <Alert className="mb-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription>
                      Il est impossible de mixer les différents groupes publicitaires sur LinkedIn pour une même campagne.
                    </AlertDescription>
                  </Alert>
                  {/* Bandeau de rappel final */}
                  <Alert className="border-orange-500/50 bg-orange-500/10">
                    <AlertDescription className="font-semibold">
                      2 groupes publicitaires (standard ou carrousel) maximum.
                    </AlertDescription>
                  </Alert>
                  {/* Notes de bas de page */}
                  <p className="text-xs text-muted-foreground mt-6 pt-4 border-t">
                    <sup>1</sup> wording = texte<br />
                    <sup>2</sup> bloc CTA = bloc Call To Action (Bouton d&apos;appel à l&apos;action)
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Snapchat */}
          <TabsContent value="snap" className="focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
            <Card className="border-0 shadow-none">
              <CardHeader>
                <h1>Publicités sur Snapchat</h1>
              </CardHeader>
              <CardContent className="space-y-6">

                {/* En un clin d'œil - Rappel des livrables attendus par Snapchat (compact, 2 colonnes) */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">Pré-requis média minimum obligatoires :</h3>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image et/ou vidéo décliné au format vertical.</li>
                            <li>2 maximum.</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">Pré-requis wording¹ minimum obligatoires :</h3>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>Nom de marque.</li>
                            <li>1 titre.</li>
                            <li>1 CTA².</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

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
                      <Alert className="border-[#E94C16] bg-white">
                        <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                        <AlertTitle className="font-semibold text-muted-foreground">Fichiers acceptés pour les publicités images :</AlertTitle>
                  <AlertDescription className="text-muted-foreground">
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
                      <Alert className="border-[#E94C16] bg-white">
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

                {/* Limites de caractères + Marges de sécurité Snapchat - 2 titres orange, images + pastilles numérotées */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <h2 className="text-2xl font-bold text-orange-500">Limites de caractères pour les wordings¹</h2>
                    <h2 className="text-2xl font-bold text-orange-500">Marges de sécurité pour les publicités verticales</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne gauche : Limites de caractères - image + 3 pastilles */}
                    <div>
                      <div className="flex justify-center">
                        <div className="studio-limites-marges-image w-full max-w-[135px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg border-0 shadow-none ring-0 outline-none relative [&_img]:border-0 [&_img]:outline-none [&_img]:ring-0">
                            <NextImage
                              src="/images/Snapchat_Limites_caracteres_10x.png"
                              alt="Limites de caractères pour les wordings Snapchat"
                              width={1080}
                              height={1920}
                              className="w-full h-full object-contain border-0 outline-none"
                            />
                            <TooltipProvider delayDuration={0}>
                              {/* 1 : nom de marque + Publicité + titre (en-tête) */}
                              <Tooltip open={snapLimites1Open} onOpenChange={setSnapLimites1Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[5%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSnapLimites1Open(!snapLimites1Open)}>1</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>nom de marque + mention « Publicité » :</strong> 25 caractères maximum, espaces inclus<br />
                                    <strong>titre :</strong> 34 caractères maximum, espaces inclus
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              {/* 2 : répétition du nom de marque + titre + lien */}
                              <Tooltip open={snapLimites2Open} onOpenChange={setSnapLimites2Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[22%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSnapLimites2Open(!snapLimites2Open)}>2</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm">répétition du nom de marque + titre + lien</div></TooltipContent>
                              </Tooltip>
                              {/* 3 : bloc CTA² */}
                              <Tooltip open={snapLimites3Open} onOpenChange={setSnapLimites3Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[8%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSnapLimites3Open(!snapLimites3Open)}>3</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm"><strong>bloc CTA²</strong></div></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite : Marges de sécurité - image + 2 pastilles */}
                    <div>
                      <div className="flex justify-center">
                        <div className="studio-limites-marges-image w-full max-w-[135px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg border-0 shadow-none ring-0 outline-none relative [&_img]:border-0 [&_img]:outline-none [&_img]:ring-0">
                            <NextImage
                              src="/images/Snapchat_Marges_securite_10x.png"
                              alt="Marges de sécurité publicités verticales Snapchat"
                              width={1080}
                              height={1920}
                              className="w-full h-full object-contain border-0 outline-none"
                            />
                            <TooltipProvider delayDuration={0}>
                              {/* 1 : bloc nom de marque + titre (haut) */}
                              <Tooltip open={snapMarges1Open} onOpenChange={setSnapMarges1Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[10%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSnapMarges1Open(!snapMarges1Open)}>1</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>bloc nom de marque + titre</strong><br />
                                    marge de 9 % environ · 165 pixels environ<br />
                                    <span className="italic text-xs">Dans cette zone, il est recommandé de ne mettre aucun texte ou image important pour la compréhension du message.</span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              {/* 2 : bloc nom de marque + titre + lien (bas) */}
                              <Tooltip open={snapMarges2Open} onOpenChange={setSnapMarges2Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[12%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSnapMarges2Open(!snapMarges2Open)}>2</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>bloc nom de marque + titre + lien</strong><br />
                                    marge de 18,5 % environ · 350 pixels environ
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-center text-muted-foreground italic">Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.</p>
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

                {/* Légende en bas de page Snapchat */}
                <p className="mt-6 pt-4 border-t border-muted text-sm text-muted-foreground">
                  <sup>1</sup> wording = texte &nbsp;&nbsp; <sup>2</sup> bloc CTA = bloc Call To Action (Bouton d&apos;appel à l&apos;action)
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet TikTok */}
          <TabsContent value="tiktok" className="focus-visible:ring-0 focus-visible:ring-offset-0 outline-none">
                    <Card className="border-0 shadow-none">
              <CardHeader>
                <h1>Publicités sur TikTok</h1>
                      </CardHeader>
              <CardContent className="space-y-6">

                {/* En un clin d'œil - Rappel des livrables attendus par TikTok (compact) */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">groupe publicitaire standard</h3>
                          <p className="text-sm font-semibold mb-1">Pré-requis média :</p>
                          <p className="text-sm mb-2">1 vidéo format vertical uniquement · 2 max · 1 logo carré.</p>
                          <p className="text-sm font-semibold mb-1">Pré-requis wording¹ :</p>
                          <p className="text-sm mb-2">1 texte principal · 1 CTA².</p>
                          <p className="text-sm font-semibold mb-1">Mécanique :</p>
                          <p className="text-sm">Vidéo verticale simple, sans interaction particulière.</p>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">groupe publicitaire carrousel</h3>
                          <p className="text-sm text-muted-foreground">Non disponible sur TikTok.</p>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

                {/* Liste des formats - mise en forme calquée sur META ; seule "publicités vidéos" est renseignée, le reste laissé vierge */}
                <div className="space-y-8">
                  <div>
                    <h2 className="mb-6">Liste des formats</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Colonne gauche : publicités images - vierge (absence sur TikTok) */}
                      <div>
                        <h3 className="font-semibold mb-4">publicités images</h3>
                      </div>

                      {/* Colonne droite : publicités vidéos - seul format présent, grille comme META */}
                      <div>
                        <h3 className="font-semibold mb-4">publicités vidéos</h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
                          {/* Encart 1 : format carré - vierge */}
                          <div className="flex flex-col items-center min-h-[140px]" />

                          {/* Encart 2 : format vertical - seul format disponible */}
                          <div className="flex flex-col items-center">
                            <div className="w-full max-w-[135px] mb-2">
                              <div className="w-full">
                                <NextImage src="/images/format%20vertical_shorts@10x.png" alt="Format vertical" width={1080} height={1920} className="w-full h-auto object-contain" />
                              </div>
                            </div>
                            <div className="text-sm text-center">
                              <p className="font-medium">format vertical</p>
                              <p>1080 × 1920 px</p>
                              <p>ratio 9:16</p>
                            </div>
                          </div>

                          {/* Encart 3 : format horizontal / TV - vierge */}
                          <div className="flex flex-col items-center min-h-[140px]" />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bloc Fichiers acceptés - même structure que META, colonne gauche vierge */}
                  <div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-4" />
                      <div>
                        <Alert className="border-[#E94C16] bg-white">
                          <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4" />
                          <AlertDescription>
                            <strong className="font-semibold">Fichiers acceptés pour les publicités vidéos :</strong>
                            <br />
                            .mov, .mp4
                            <br />
                            <br />
                            Durée optimale : 14 secondes maximum
                            <br />
                            Durée maximum : 30 secondes
                          </AlertDescription>
                        </Alert>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Limites de caractères + Marges de sécurité - 2 titres orange sur la même ligne */}
                <div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                    <h2 className="text-2xl font-bold text-orange-500">Limites de caractères pour les wordings¹</h2>
                    <h2 className="text-2xl font-bold text-orange-500">Marges de sécurité pour les publicités verticales</h2>
                  </div>
                  <p className="text-sm text-muted-foreground mb-4">Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.</p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Colonne gauche : Limites de caractères - image + 6 pastilles (ordre de l’image : nav haut, photo, marque, texte, CTA, nav bas) */}
                    <div>
                      <div className="flex justify-center">
                        <div className="studio-limites-marges-image w-full max-w-[135px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg border-0 shadow-none ring-0 outline-none relative [&_img]:border-0 [&_img]:outline-none [&_img]:ring-0">
                            <NextImage
                              src="/images/TikTok_Limites_caracteres_10x.png"
                              alt="Limites de caractères pour les wordings TikTok"
                              width={1080}
                              height={1920}
                              className="w-full h-full object-contain border-0 outline-none"
                            />
                            <TooltipProvider delayDuration={0}>
                              {/* 1 : bloc navigation application (haut) */}
                              <Tooltip open={tiktokLimites1Open} onOpenChange={setTiktokLimites1Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[3%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokLimites1Open(!tiktokLimites1Open)}>1</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm"><strong>bloc navigation application</strong></div></TooltipContent>
                              </Tooltip>
                              {/* 2 : photo de profil */}
                              <Tooltip open={tiktokLimites2Open} onOpenChange={setTiktokLimites2Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[12%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokLimites2Open(!tiktokLimites2Open)}>2</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm"><strong>photo de profil</strong></div></TooltipContent>
                              </Tooltip>
                              {/* 3 : nom de marque */}
                              <Tooltip open={tiktokLimites3Open} onOpenChange={setTiktokLimites3Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[18%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokLimites3Open(!tiktokLimites3Open)}>3</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm"><strong>nom de marque</strong></div></TooltipContent>
                              </Tooltip>
                              {/* 4 : texte principal */}
                              <Tooltip open={tiktokLimites4Open} onOpenChange={setTiktokLimites4Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[28%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokLimites4Open(!tiktokLimites4Open)}>4</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs"><div className="text-sm"><strong>texte principal :</strong><br />100 caractères maximum, espaces inclus</div></TooltipContent>
                              </Tooltip>
                              {/* 5 : bloc CTA² */}
                              <Tooltip open={tiktokLimites5Open} onOpenChange={setTiktokLimites5Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[20%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokLimites5Open(!tiktokLimites5Open)}>5</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm"><strong>bloc CTA²</strong></div></TooltipContent>
                              </Tooltip>
                              {/* 6 : bloc navigation application (bas) */}
                              <Tooltip open={tiktokLimites6Open} onOpenChange={setTiktokLimites6Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[3%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokLimites6Open(!tiktokLimites6Open)}>6</div>
                                </TooltipTrigger>
                                <TooltipContent><div className="text-sm"><strong>bloc navigation application</strong></div></TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Colonne droite : Marges de sécurité - image + pastilles */}
                    <div>
                      <div className="flex justify-center">
                        <div className="studio-limites-marges-image w-full max-w-[135px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg border-0 shadow-none ring-0 outline-none relative [&_img]:border-0 [&_img]:outline-none [&_img]:ring-0">
                            <NextImage
                              src="/images/TikTok_Marges_securite_10x.png"
                              alt="Marges de sécurité publicités verticales TikTok"
                              width={1080}
                              height={1920}
                              className="w-full h-full object-contain border-0 outline-none"
                            />
                            <TooltipProvider delayDuration={0}>
                              <Tooltip open={tiktokMarges1Open} onOpenChange={setTiktokMarges1Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[12%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokMarges1Open(!tiktokMarges1Open)}>1</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>bloc following / for you</strong><br />
                                    marge de 6 % environ · 126 pixels environ<br />
                                    <span className="italic text-xs">Dans cette zone, il est recommandé de ne mettre aucun élément important (texte ou image) essentiel à la compréhension du message publicitaire.</span>
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip open={tiktokMarges2Open} onOpenChange={setTiktokMarges2Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[50%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokMarges2Open(!tiktokMarges2Open)}>2</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    Dans les zones oranges, il est recommandé de ne mettre aucun élément important (texte ou image) essentiel à la compréhension du message publicitaire.
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              <Tooltip open={tiktokMarges3Open} onOpenChange={setTiktokMarges3Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[12%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setTiktokMarges3Open(!tiktokMarges3Open)}>3</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>bloc nom de marque + texte principal + interactions</strong><br />
                                    marge de 20 % environ · 400 pixels environ
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="mt-4 text-xs text-center text-muted-foreground italic">Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.</p>
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

                {/* Légende en bas de page TikTok */}
                <p className="mt-6 pt-4 border-t border-muted text-sm text-muted-foreground">
                  <sup>1</sup> wording = texte &nbsp;&nbsp; <sup>2</sup> bloc CTA = bloc Call To Action (Bouton d&apos;appel à l&apos;action)
                </p>
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

                {/* En un clin d'œil - Livrables attendus par Spotify (2 colonnes) */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">Pré-requis média minimum obligatoires :</h3>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image en format carré.</li>
                            <li>1 logo en format carré.</li>
                            <li>1 fichier audio (30 secondes maximum).</li>
                          </ul>
                        </div>
                        <div>
                          <h3 className="font-semibold mb-2 text-sm">Pré-requis wording¹ minimum obligatoires :</h3>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>Nom de marque.</li>
                            <li>1 accroche.</li>
                            <li>1 CTA².</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

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
                            <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format Direct IO et Ad Studio" width={1440} height={1440} className="w-full h-full object-contain" />
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
                                <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
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
                      <Alert className="mb-4 border-[#E94C16] bg-white">
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
                        <Alert className="border-[#E94C16] bg-white">
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

                {/* 1. Limites de caractères pour les wordings¹ */}
                <div>
              <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹</h2>
                  <div className="flex justify-start">
                    <div className="w-full max-w-[135px] relative">
                          <div className="aspect-[9/16] w-full overflow-hidden rounded-lg shadow-sm relative">
                            <SafeImage
                              src="/images/Spotify-Limites-caracteres-10x.png"
                              alt="Limites de caractères pour les wordings Spotify"
                              width={1080}
                              height={1920}
                              className="w-full h-full object-contain"
                            />
                            <TooltipProvider delayDuration={0}>
                              {/* 1 : nom de marque + photo de profil + mention Publicité */}
                              <Tooltip open={spotifyLimites1Open} onOpenChange={setSpotifyLimites1Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute top-[38%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSpotifyLimites1Open(!spotifyLimites1Open)}>1</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>nom de marque :</strong> 25 caractères maximum, espaces inclus<br />
                                    + photo de profil · + mention « Publicité »
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                              {/* 2 : accroche + bloc CTA² */}
                              <Tooltip open={spotifyLimites2Open} onOpenChange={setSpotifyLimites2Open}>
                                <TooltipTrigger asChild>
                                  <div className="absolute bottom-[18%] right-[6%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors" style={{ zIndex: 10 }} onClick={() => setSpotifyLimites2Open(!spotifyLimites2Open)}>2</div>
                                </TooltipTrigger>
                                <TooltipContent className="max-w-xs">
                                  <div className="text-sm">
                                    <strong>accroche :</strong> 40 caractères maximum, espaces inclus<br />
                                    + bloc CTA²
                                  </div>
                                </TooltipContent>
                              </Tooltip>
                            </TooltipProvider>
                          </div>
                        </div>
                  </div>
                  <p className="mt-4 text-xs text-center text-muted-foreground">
                    Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.
                  </p>
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

                {/* 2. Livrables attendus par Spotify (en dernier) */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Livrables attendus par Spotify</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="text-lg font-semibold text-orange-500 mb-2">Pré-requis média minimum obligatoires :</h3>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li>1 visuel image en format carré.</li>
                        <li>1 logo en format carré.</li>
                        <li>1 fichier audio (30 secondes maximum).</li>
                      </ul>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-orange-500 mb-2">Pré-requis wording¹ minimum obligatoires :</h3>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li>Nom de marque.</li>
                        <li>1 accroche.</li>
                        <li>1 CTA².</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Légende tout en bas de la section Spotify */}
                <p className="mt-6 pt-4 border-t border-muted text-sm text-muted-foreground">
                  <sup>1</sup> wording = texte &nbsp;&nbsp; <sup>2</sup> bloc CTA = bloc Call To Action (Bouton d&apos;appel à l&apos;action)
                </p>
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

                {/* En un clin d'œil - Rappel des livrables Google Search */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 visuel image et/ou vidéo décliné aux 2 formats (carré et horizontal).</li>
                            <li>20 maximum.</li>
                            <li>1 logo en format carré.</li>
                          </ul>
                        </div>
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>3 titres minimum (15 maximum). Possibilité d&apos;épingler 1 titre.</li>
                            <li>2 descriptions minimum (4 maximum).</li>
                            <li>Nom d&apos;entreprise.</li>
                            <li>Numéro de téléphone.</li>
                            <li>Info-bulles : 20 maximum.</li>
                            <li>Liens annexes : 4 maximum.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </AlertDescription>
                </Alert>

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
                            <NextImage src="/images/format%20carre_infeed@10x.png" alt="Format carré" width={1440} height={1440} className="w-full h-full object-contain" />
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
                      <div className="mt-4 rounded-md border border-muted bg-white px-3 py-2">
                        <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Résolutions alternatives acceptables</h5>
                        <ul className="space-y-0.5 text-xs text-muted-foreground">
                          <li>format carré : 1080 × 1080 px</li>
                          <li>format horizontal : 1200 × 628 px</li>
                        </ul>
                      </div>
                  </div>

                    {/* Colonne droite : logo obligatoire */}
                    <div>
                      <h4 className="font-semibold mb-4">logo obligatoire</h4>
                      
                      {/* Même grille 3 colonnes que "publicités images" pour aligner les dimensions */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Encart visuel carré : même largeur/hauteur que "format carré" de la colonne gauche */}
                        <div>
                          <div className="aspect-square w-full mb-2 overflow-hidden">
                            <NextImage src="/images/format%20carre_infeed@10x.png" alt="Logo format carré" width={1440} height={1440} className="w-full h-full object-contain" />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format carré</p>
                            <p>1080 × 1080 px</p>
                            <p>ratio 1:1</p>
                          </div>
                        </div>
                        <div></div>
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
                  <p className="text-sm text-muted-foreground mb-4">Survolez ou cliquez les pastilles orange numérotées pour afficher le détail.</p>

                  {/* Image agrandie + bulles numérotées (encadré de droite supprimé, infos dans les bulles) */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-[900px] relative">
                      <div className="w-full overflow-hidden rounded-lg shadow-sm relative">
                          <SafeImage
                            src="/images/Search Limites de caracteres10x.png"
                            extraSrcCandidates={[
                              "/images/Search%20Limites%20de%20caracteres10x.png",
                            ]}
                            alt="Limites de caractères pour les wordings Google Search"
                            width={1200}
                            height={800}
                            className="w-full h-auto object-contain"
                          />
                          <TooltipProvider delayDuration={0}>
                            {/* 1 : logo + nom de marque + site web */}
                            <Tooltip open={searchLimites1Open} onOpenChange={setSearchLimites1Open}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-[10%] left-[12%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                  style={{ zIndex: 10 }}
                                  onClick={() => setSearchLimites1Open(!searchLimites1Open)}
                                >
                                  1
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm">
                                  <strong>logo + nom de marque + site web</strong>
                                  <p className="mt-1">Nom d&apos;entreprise (obligatoire) : 25 caractères maximum, espaces inclus.</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            {/* 2 : titres */}
                            <Tooltip open={searchLimites2Open} onOpenChange={setSearchLimites2Open}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-[22%] left-[12%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                  style={{ zIndex: 10 }}
                                  onClick={() => setSearchLimites2Open(!searchLimites2Open)}
                                >
                                  2
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm">
                                  <strong>titres</strong>
                                  <ul className="list-disc ml-4 mt-1 space-y-1">
                                    <li>3 titres minimum (15 maximum)</li>
                                    <li>30 caractères maximum, espaces inclus</li>
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            {/* 3 : descriptions */}
                            <Tooltip open={searchLimites3Open} onOpenChange={setSearchLimites3Open}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-[38%] left-[12%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                  style={{ zIndex: 10 }}
                                  onClick={() => setSearchLimites3Open(!searchLimites3Open)}
                                >
                                  3
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm">
                                  <strong>descriptions</strong>
                                  <ul className="list-disc ml-4 mt-1 space-y-1">
                                    <li>2 descriptions minimum (4 maximum)</li>
                                    <li>90 caractères maximum, espaces inclus</li>
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            {/* 4 : info-bulles */}
                            <Tooltip open={searchLimites4Open} onOpenChange={setSearchLimites4Open}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-[48%] left-[12%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                  style={{ zIndex: 10 }}
                                  onClick={() => setSearchLimites4Open(!searchLimites4Open)}
                                >
                                  4
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm">
                                  <strong>info-bulles – phrases clés</strong>
                                  <ul className="list-disc ml-4 mt-1 space-y-1">
                                    <li>20 maximum</li>
                                    <li>25 caractères maximum, espaces inclus</li>
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            {/* 5 : liens annexes */}
                            <Tooltip open={searchLimites5Open} onOpenChange={setSearchLimites5Open}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute top-[62%] left-[12%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                  style={{ zIndex: 10 }}
                                  onClick={() => setSearchLimites5Open(!searchLimites5Open)}
                                >
                                  5
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm">
                                  <strong>liens annexes – pages/rubriques du site</strong>
                                  <ul className="list-disc ml-4 mt-1 space-y-1">
                                    <li>4 maximum</li>
                                    <li>1 titre : 25 car. max</li>
                                    <li>1 description (2 max) : 35 car. max</li>
                                    <li>1 URL</li>
                                  </ul>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                            {/* 6 : téléphone */}
                            <Tooltip open={searchLimites6Open} onOpenChange={setSearchLimites6Open}>
                              <TooltipTrigger asChild>
                                <div
                                  className="absolute bottom-[18%] left-[12%] w-8 h-8 rounded-full bg-[#E94C16] flex items-center justify-center text-white font-bold text-sm cursor-pointer hover:bg-[#E94C16]/80 transition-colors"
                                  style={{ zIndex: 10 }}
                                  onClick={() => setSearchLimites6Open(!searchLimites6Open)}
                                >
                                  6
                                </div>
                              </TooltipTrigger>
                              <TooltipContent className="max-w-xs">
                                <div className="text-sm">
                                  <strong>téléphone</strong>
                                  <p className="mt-1">Numéro de téléphone (obligatoire).</p>
                                </div>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </div>
                    </div>
                  </div>

                {/* H2 : Recommandations et contraintes - 3 colonnes bureau pour remplir la largeur */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Recommandations et contraintes</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas dépasser les limites de caractères pour les wordings¹.<br /><br />
                          Dépasser les limites de caractères empêche la création de campagnes sur Google.<br /><br />
                          Aucune tolérance n&apos;est accordée.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm">
                          Ne pas utiliser de caractères de ponctuation en fin de phrase.<br /><br />
                          Google n&apos;autorise pas la ponctuation en fin de phrase pour les titres et descriptions.<br /><br />
                          Aucune tolérance n&apos;est accordée.
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

                {/* En un clin d'œil - Livrables YouTube */}
                <Alert className="border-orange-500/50 bg-orange-500/10">
                  <AlertDescription>
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Eye className="h-4 w-4 text-orange-500" />
                        <strong className="text-xl">En un clin d&apos;œil</strong>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                          <ul className="text-sm space-y-1 ml-4 list-disc">
                            <li>1 lien de vidéo YouTube au format InStream/Bumper obligatoire</li>
                            <li>Déclinaison recommandée dans les 3 formats : InFeed, Shorts, InStream/Bumper</li>
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
                    </div>
                  </AlertDescription>
                </Alert>

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
                            <NextImage src="/images/format carre_infeed@10x.png" alt="Format InFeed" width={1440} height={1440} className="w-full h-full object-contain" />
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
                      <div className="mb-4 rounded-md border border-muted bg-white px-3 py-2">
                        <h5 className="text-xs font-medium mb-1.5 text-muted-foreground">Résolutions alternatives acceptables</h5>
                        <ul className="space-y-0.5 text-xs text-muted-foreground">
                          <li>format InFeed : 1080 × 1080 px</li>
                          <li>format Shorts : 1080 × 1920 px</li>
                          <li>format InStream, Bumper : 1200 × 628 px</li>
                        </ul>
                      </div>

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

                    {/* Colonne droite : bannière associée à la publicité (même largeur et hauteur que format InStream, Bumper) */}
                    <div>
                      <h4 className="font-semibold mb-4">bannière associée à la publicité</h4>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        {/* Même cellule 1/3 de largeur que InStream → même hauteur avec aspect-video, aligné à gauche */}
                        <div>
                          <div className="aspect-video w-full mb-2 overflow-hidden rounded-lg shadow-sm">
                            <SafeImage
                              src="/images/logo banniere10x.png"
                              extraSrcCandidates={[
                                "/images/logo%20banniere10x.png",
                              ]}
                              alt="Format bannière"
                              width={1200}
                              height={675}
                              className="w-full h-full object-contain"
                            />
                          </div>
                          <div className="text-sm text-center">
                            <p className="font-medium">format bannière</p>
                            <p>300 × 60 px</p>
                          </div>
                        </div>
                        <div></div>
                        <div></div>
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

                {/* H2 : Limites de caractères pour les wordings¹ - 3 colonnes */}
                  <div>
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Limites de caractères pour les wordings¹</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm"><strong>1 titre long (Obligatoire)</strong><br />90 caractères maximum, espaces inclus</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm"><strong>1 titre court (Obligatoire)</strong><br />30 caractères maximum, espaces inclus</p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm"><strong>1 description (Obligatoire)</strong><br />70 caractères maximum, espaces inclus</p>
                      </CardContent>
                    </Card>
                  </div>
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

                {/* H2 : Livrables attendus par YouTube - 2 colonnes */}
                <div className="mt-6">
                  <h2 className="text-2xl font-bold text-orange-500 mb-4">Livrables attendus par YouTube</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>1 lien de vidéo YouTube au format InStream/Bumper obligatoire</li>
                          <li>Déclinaison recommandée dans les 3 formats : InFeed, Shorts, InStream/Bumper</li>
                          <li>4 maximum</li>
                        </ul>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardContent className="pt-4">
                        <p className="text-sm font-semibold mb-2">Pré-requis wording¹ minimum obligatoires :</p>
                        <ul className="text-sm space-y-1 ml-4 list-disc">
                          <li>1 titre long</li>
                          <li>1 titre court</li>
                          <li>1 description</li>
                          <li>1 CTA²</li>
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Programmatique - Publicités programmatique / Mix IAB + Landing pages */}
          <TabsContent value="programmatic">
            <Card>
              <CardContent className="space-y-10 pt-6">
                {/* Section 1 : Publicités programmatique / Mix IAB */}
                <div>
                  <h1 className="text-2xl font-bold text-orange-500 mb-6">Publicités programmatique / Mix IAB</h1>
                  <h2 className="text-lg font-bold mb-4">Liste des formats</h2>
                  <h3 className="font-semibold mb-4 pb-2 border-b border-foreground">publicités images</h3>

                  {/* Ligne 1 : Mégabannière, Bannière */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[280px] aspect-[728/90] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">mégabannière</p>
                      <p className="text-sm text-muted-foreground">728 x 90 px</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[160px] aspect-[320/50] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">bannière</p>
                      <p className="text-sm text-muted-foreground">320 x 50 px</p>
                    </div>
                  </div>
                  {/* Ligne 2 : Skyscraper, Grand angle, Interstitiel, Pavé parallax */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[80px] aspect-[160/600] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">skyscraper</p>
                      <p className="text-sm text-muted-foreground">160 x 600 px</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[150px] aspect-[300/600] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">grand angle</p>
                      <p className="text-sm text-muted-foreground">300 x 600 px</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[160px] aspect-[320/480] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">interstitiel</p>
                      <p className="text-sm text-muted-foreground">320 x 480 px</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[150px] aspect-[300/250] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">pavé parallax</p>
                      <p className="text-sm text-muted-foreground">300 x 250 px</p>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row md:items-start gap-6">
                    {/* Encadré Fichiers acceptés */}
                    <Alert className="border-[#E94C16] bg-orange-500/5 max-w-md">
                      <NextImage src="/images/Avertissement 2025 noBG.png" alt="Avertissement" width={16} height={16} className="h-4 w-4 mb-2" />
                      <AlertTitle className="font-semibold">Fichiers acceptés pour les publicités images :</AlertTitle>
                      <AlertDescription>
                        .jpg, .png, .gif<br />
                        Taille maximale : <strong className="text-orange-500">150 ko.</strong>
                      </AlertDescription>
                    </Alert>

                    {/* Rappel des livrables */}
                    <div className="flex-1">
                      <h2 className="text-2xl font-bold text-orange-500 mb-4">Rappel des livrables attendus en programmatique</h2>
                      <p className="text-sm font-semibold mb-2">Pré-requis média minimum obligatoires :</p>
                      <ul className="text-sm space-y-1 ml-4 list-disc">
                        <li>6 visuels à tous les formats</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Section 2 : Landing pages */}
                <div className="pt-8 border-t border-muted">
                  <h1 className="text-2xl font-bold text-orange-500 mb-6">Landing pages</h1>
                  <h2 className="text-lg font-bold mb-4">Liste des formats</h2>
                  <h3 className="font-semibold mb-4 pb-2 border-b border-foreground">publicités images</h3>

                  {/* 2 formats : Mégabannière, Bannière */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl">
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[280px] aspect-[728/90] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">mégabannière</p>
                      <p className="text-sm text-muted-foreground">728 x 90 px</p>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-full max-w-[160px] aspect-[320/50] rounded-md border-2 border-dashed border-muted-foreground/40 bg-muted/20" />
                      <p className="text-sm font-medium mt-2">bannière</p>
                      <p className="text-sm text-muted-foreground">320 x 50 px</p>
                    </div>
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
