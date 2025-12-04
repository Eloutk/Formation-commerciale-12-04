"use client"

import Link from "next/link"
import NextImage from "next/image"
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
              <CardTitle>Guide des publicités et contraintes</CardTitle>
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
                      Publicités images
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
                      Publicités vidéo
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
                      Publicités desktop
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
                      Publicités mobile
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
                <CardTitle>Publicités META (Facebook & Instagram)</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Facebook et Instagram Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités images</h3>
                    <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center mb-4">
                      <NextImage
                        src="/images/Formats META + Display.png"
                        alt="Formats META + Display"
                        width={800}
                        height={533}
                        className="w-full max-w-md h-auto object-contain"
                      />
                    </div>
                    <Accordion type="single" collapsible className="w-full">
                      <AccordionItem value="resolutions">
                        <AccordionTrigger>Résolutions alternatives acceptables</AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2 text-sm">
                            <li>
                              <span className="font-medium">format carré :</span>{" "}
                              <span className="font-semibold">1080 x 1080 px</span>
                            </li>
                            <li>
                              <span className="font-medium">format vertical :</span>{" "}
                              <span className="font-semibold">1080 x 1920 px</span>
                            </li>
                            <li>
                              <span className="font-medium">format horizontal :</span>{" "}
                              <span className="font-semibold">1200 x 628 px</span>
                            </li>
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    </Accordion>
                    <div className="mt-4 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm">
                      <p className="font-semibold text-orange-700 mb-1">
                        Fichiers acceptés pour les publicités images :
                      </p>
                      <p className="text-orange-800">.jpg, .png</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités vidéo</h3>
                    <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center mb-4">
                      <NextImage
                        src="/images/Formats vidéo META + Display.png"
                        alt="Formats vidéo META + Display"
                        width={800}
                        height={533}
                        className="w-full max-w-md h-auto object-contain"
                      />
                    </div>
                    <div className="mt-4 rounded-md border border-orange-300 bg-orange-50 px-4 py-3 text-sm space-y-1">
                      <p className="font-semibold text-orange-700">
                        Fichiers acceptés pour les publicités vidéos :
                      </p>
                      <p className="text-orange-800">.mov, .mp4</p>
                      <p className="text-orange-800 font-semibold">
                        Durée optimale : <span className="text-red-600">Entre 6 et 14 secondes maximum.</span>
                      </p>
                      <p className="text-orange-800 font-semibold">
                        Durée maximum : <span className="text-red-600">30 secondes.</span>
                      </p>
                      <p className="text-orange-800 pt-1">
                        Fichier accepté de sous-titrage (si dialogue, voix-off...) : <strong>.srt</strong>
                      </p>
                      <p className="text-orange-800">
                        Nommage fichier srt : <strong>nomvidéo_fr_FR.srt</strong>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Limites de caractères pour les wordings</h3>
                      <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center">
                        <NextImage
                          src="/images/Limites de caractères pour les wordings.png"
                          alt="Limites de caractères pour les wordings"
                          width={600}
                          height={400}
                          className="w-full max-w-sm h-auto object-contain"
                        />
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-semibold mb-4">Marges de sécurité pour Stories et Reels</h3>
                      <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center">
                        <NextImage
                          src="/images/Marges de sécurité pour Stories et Reels.png"
                          alt="Marges de sécurité pour Stories et Reels"
                          width={600}
                          height={400}
                          className="w-full max-w-sm h-auto object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-semibold mb-4">Livrables attendus par META</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Groupe publicitaire standard</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center">
                          <NextImage
                            src="/images/Groupe publicitaire standard.png"
                            alt="Groupe publicitaire standard"
                            width={600}
                            height={400}
                            className="w-full max-w-sm h-auto object-contain"
                          />
                        </div>
                        <p className="text-sm whitespace-pre-line">
groupe publicitaire standard{"\n"}
Pré-requis média minimum obligatoires :{"\n"}
1 visuel image et/ou vidéo, décliné aux 3 formats (carré, vertical{"\n"}
et horizontal). 3 groupes publicitaires (standard et/ou caroussel){"\n"}
recommandés.{"\n"}
Pré-requis wording1 minimum obligatoires :{"\n"}
- 1 texte principal.{"\n"}
- 1 titre.{"\n"}
- 1 CTA2{"\n"}
.{"\n"}
Mécanique de fonctionnement :{"\n"}
Sous forme d’images ou de vidéos simples, sans interaction{"\n"}
particulière.
                        </p>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base">Groupe publicitaire carrousel</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center">
                          <NextImage
                            src="/images/Groupe publicitaire carrousel.png"
                            alt="Groupe publicitaire carrousel"
                            width={600}
                            height={400}
                            className="w-full max-w-sm h-auto object-contain"
                          />
                        </div>
                        <p className="text-sm whitespace-pre-line">
Groupe publicitaire carrousel{"\n"}
Pré-requis média minimum obligatoires :{"\n"}
2 visuels image et/ou vidéo, en format carré.{"\n"}
2 minimum et 10 maximum. 3 groupes publicitaires (standard et/{"\n"}
ou caroussel) recommandés.{"\n"}
Pré-requis wording1 minimum obligatoires :{"\n"}
- 1 texte principal.{"\n"}
- 2 titres minimum (en fonction du nombre de vignettes).{"\n"}
- 1 CTA2{"\n"}
.{"\n"}
Mécanique de fonctionnement :{"\n"}
Sous forme d’images ou de vidéos disposées sous forme de{"\n"}
vignettes les unes à côté des au
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="rounded-md bg-red-600/10 border border-red-500 px-4 py-3 text-sm font-semibold text-red-700 text-center">
                    6 groupes publicitaires (standard et/ou carrousel) maximum.
                  </div>

                  <h3 className="text-lg font-semibold mb-4">Recommandations et contraintes</h3>
                  <div className="space-y-4 text-sm leading-relaxed rounded-lg border bg-muted/30 p-4 md:p-6">
                    <p className="font-semibold">
                      Il n’est pas essentiel de mettre votre logo ou votre nom de marque sur le visuel
                    </p>
                    <p>
                      Votre logo et votre nom de marque sont déjà présents dans l’environnement META sous deux formes :
                    </p>
                    <ul className="list-disc list-inside">
                      <li>votre photo de profil</li>
                      <li>votre nom de page de diffusion</li>
                    </ul>

                    <p className="font-semibold">
                      Ne pas dépasser les limites de caractères pour les wordings¹
                    </p>
                    <p>
                      Dépasser les limites de caractères a pour conséquence de tronquer votre texte et d’empêcher sa lecture totale.
                      Un bouton « Voir plus » peut apparaître.
                    </p>

                    <p className="font-semibold">
                      Respecter les marges de sécurité pour les médias story et reels
                    </p>
                    <p>
                      Les formats story et reels sont particulièrement sensibles aux marges de sécurité. Il est important de ne pas disposer d’éléments importants (texte ou image) en dehors de limites fixées par les marges de sécurité.
                      Ils pourraient être illisibles ou tronqués.
                    </p>

                    <p className="font-semibold">
                      Respecter la limite de 20% de texte sur les visuels
                    </p>
                    <p>
                      La publicité sera moins diffusée par META et le score qualité sera affecté.
                    </p>

                    <p className="font-semibold">
                      Ne pas utiliser trop d’emojis lors de la rédaction de vos wordings¹
                    </p>
                    <p>
                      L’utilisation de plus de 3 emojis pour un wording¹ (texte principal, titre et description inclus) est déconseillée afin de ne pas perturber l’optimisation réalisée par les algorithmes de META.
                    </p>

                    <p>
                      Ne pas abuser de majuscules, de symboles et de caractères spéciaux sur vos wordings¹ pour des publicités META.
                    </p>

                    <p>
                      Inutile d’insérer des hashtags sur vos wordings¹ pour des publicités META.
                    </p>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Limitations sur META</h3>
                  <div className="space-y-4 text-sm leading-relaxed rounded-lg border bg-muted/30 p-4 md:p-6">
                    <p className="font-semibold">Concernant la gestion automatique du contenu</p>

                  <p className="font-semibold">À propos des publicités responsives</p>
                  <p>
                    Il est impossible d’empêcher la création automatique de publicités responsives sur META.
                    Ces publicités sont issues des 3 formats natifs.
                    Les groupes publicitaires carrousels sont particulièrement exposés à cette génération automatique.
                  </p>

                  <p className="font-semibold">À propos des descriptions</p>
                  <p>
                    Si aucune description n’est rédigée, cette dernière peut être automatiquement générée par le biais du titre de la page web de votre landing page.
                    Nous n’avons aucun contrôle sur ce point.
                  </p>

                  <p className="font-semibold">À propos des typographies</p>
                  <p>
                    Il est impossible de changer la taille, la couleur, l’organisation et la graisse des caractères typographiques sur les wordings¹ META.
                  </p>

                  <p className="font-semibold">À propos des césures dans les paragraphes des wordings¹</p>
                  <p>
                    Il est impossible de modifier les endroits où la césure des paragraphes s’applique.
                    Celle-ci est gérée automatiquement par META.
                  </p>

                  <p className="font-semibold">À propos du nom de votre page et de votre photo de profil</p>
                  <p>
                    Il est impossible de modifier le nom et le logo affichés sur vos publicités.
                    Ils sont générés depuis votre page META.
                    La dernière vignette des groupes publicitaires carrousels affiche également votre photo de profil.
                  </p>

                  <p className="font-semibold">Concernant les restrictions sur la création de publicité</p>

                  <p className="font-semibold">À propos des CTA²</p>
                  <p>
                    Il est impossible de personnaliser le bouton CTA² en dehors des propositions déjà fournies par META.
                    Les CTA² peuvent également différer en fonction de l’objectif de campagne.
                  </p>

                  <p className="font-semibold">À propos de visuels pouvant perturber l’expérience utilisateur</p>
                  <p>
                    Il est interdit de mettre un CTA² ou le symbole d’un curseur (pointeur flèche ou curseur de souris) sur des visuels d’une campagne publicitaire.
                    La violation de cette interdiction peut conduire à la suspension de la campagne publicitaire pour expérience trompeuse.
                  </p>

                  <p className="font-semibold">À propos de la propriété intellectuelle de META</p>
                  <p>
                    Il est interdit de mettre les logos des marques propriétaires de META (Facebook, Instagram, WhatsApp), ni d’éléments de réactions propriétaires (Réaction Like, Coeur, Colère) sur des visuels d’une campagne publicitaire.
                    La violation de cette interdiction peut conduire à la suspension de la campagne publicitaire pour violation de la propriété intellectuelle.
                  </p>

                  <p className="font-semibold">À propos des mentions légales obligatoires en France</p>
                  <p>
                    Pour chaque publicité, il est obligatoire de nous fournir les conditions générales de ventes de chaque offre promotionnelle et de respecter les obligations légales, comme les recommandations sur les comportements alimentaires ou sur l’éco-conduite.
                  </p>

                  <p className="font-semibold">
                    Liste des catégories spéciales dont les sujets ont une incidence sur la diffusion (Sujet et wording)
                  </p>
                  <p>Ces sujets méritent une attention particulière lors de la rédaction.</p>
                  <ul className="list-disc list-inside">
                    <li>Immobilier et prix dans l’immobilier.</li>
                    <li>Offre de financement, crédit.</li>
                    <li>Emploi et offre de recrutement.</li>
                    <li>Politique et sujets électoraux.</li>
                    <li>Dénomination précise des genres (H/F/...).</li>
                  </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Publicités Google Display</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Google Display Ads
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités images</h3>
                    <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center">
                      <NextImage
                        src="/images/Formats META + Display.png"
                        alt="Formats META + Display"
                        width={800}
                        height={533}
                        className="w-full max-w-md h-auto object-contain"
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités vidéo</h3>
                    <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center">
                      <NextImage
                        src="/images/Formats vidéo META + Display.png"
                        alt="Formats vidéo META + Display"
                        width={800}
                        height={533}
                        className="w-full max-w-md h-auto object-contain"
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <Card>
                    <CardHeader className="pb-4">
                      <CardTitle className="text-lg font-semibold">Logos obligatoires</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="grid gap-6 md:grid-cols-2 items-start">
                          <div className="relative overflow-hidden rounded-md border bg-muted flex justify-center px-4 py-3">
                            <NextImage
                              src="/images/logos obligatoires.png"
                              alt="Logos obligatoires"
                              width={520}
                              height={320}
                              className="w-full max-w-md h-auto object-contain"
                            />
                          </div>

                          <div className="text-sm leading-relaxed rounded-md border bg-blue-50/60 px-4 py-3 space-y-1">
                            <h4 className="font-semibold mb-1">Fichiers acceptés pour les publicités images et logos :</h4>
                            <p>.jpg, .png</p>
                            <p>Taille maximale : 5120ko.</p>
                            <p>Le format .gif est incompatible avec la pub responsive.</p>
                          </div>
                        </div>

                        <div className="text-sm leading-relaxed rounded-md border bg-purple-50/60 px-4 py-3 space-y-1">
                          <h4 className="font-semibold mb-1">Fichiers acceptés pour les publicités vidéos :</h4>
                          <p>Lien youtube au format «https://…»</p>
                          <p>Durée optimale : 14 secondes maximum.</p>
                          <p>Durée maximum : 30 secondes.</p>
                          <p>5 liens vidéos maximum.</p>
                          <p>
                            Pour être utilisées, les vidéos doivent être déjà hébergées sur votre chaîne YouTube. L'importation se fait uniquement grâce au
                            lien YouTube correspondant aux vidéos.
                          </p>
                          <p>Les vidéos peuvent être en non répertoriées mais doivent être impérativement publiques.</p>
                          <p>La diffusion exclusive de vidéos n'est pas possible dans Google Display.</p>
                          <p>Des visuels au format publicités images sont obligatoire pour configurer la campagne.</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
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

                <div className="mt-6 space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2 text-sm leading-relaxed rounded-lg border bg-muted/30 p-4 md:p-5">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-orange-600 tracking-wide">
                        Limites de caractères pour les wordings¹
                      </h3>
                      <p className="font-semibold">1 titre long (Obligatoire) :</p>
                      <p>90 caractères maximum, espaces inclus</p>
                      <p className="font-semibold mt-2">5 titres courts (1 obligatoire) :</p>
                      <p>30 caractères maximum, espaces inclus</p>
                      <p className="font-semibold mt-2">5 descriptions (1 obligatoire) :</p>
                      <p>90 caractères maximum, espaces inclus</p>
                      <p className="font-semibold mt-2">Nom d’entreprise (Obligatoire) :</p>
                      <p>25 caractères maximum, espaces inclus</p>
                    </div>

                    <div className="space-y-2 text-sm leading-relaxed rounded-lg border bg-muted/30 p-4 md:p-5">
                      <h3 className="text-lg md:text-xl font-semibold mb-2 text-orange-600 tracking-wide">
                        Rappel des livrables attendus par Google Display
                      </h3>
                      <p className="font-semibold">Pré-requis média minimum obligatoires :</p>
                      <p>1 visuel image décliné aux 3 formats (carré, vertical, horizontal). 5 maximum. (Même pour une vidéo)</p>
                      <p>2 visuels logo (format carré et bannière). 5 maximum.</p>
                      <p className="font-semibold mt-2">Pré-requis wording¹ minimum obligatoires :</p>
                      <p>1 titre long.</p>
                      <p>1 titre court. 5 maximum.</p>
                      <p>1 description. 5 maximum.</p>
                      <p>Nom d’entreprise.</p>
                      <p>1 CTA².</p>
                    </div>
                  </div>

                  <h3 className="text-lg font-semibold mb-2">Recommandations et contraintes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rappel des principales recommandations et contraintes
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm leading-relaxed rounded-md border bg-muted/30 px-4 py-3 space-y-2">
                      <h4 className="font-semibold">
                        Ne pas dépasser les limites de caractères pour les wordings¹
                      </h4>
                      <p>
                        Dépasser les limites de caractères a pour conséquence d'empêcher la création de campagnes sur Google.
                      </p>
                      <p>Aucune tolérance n'est accordée.</p>
                    </div>

                    <div className="text-sm leading-relaxed rounded-md border bg-muted/30 px-4 py-3 space-y-2">
                      <h4 className="font-semibold">
                        Ne pas utiliser de caractères de ponctuation en fin de phrase
                      </h4>
                      <p>
                        Google n'autorise pas l'utilisation de ponctuation en fin de phrase pour le titre long et les descriptions.
                      </p>
                      <p>Aucune tolérance n'est accordée.</p>
                    </div>

                    <div className="text-sm leading-relaxed rounded-md border bg-muted/30 px-4 py-3 space-y-2">
                      <h4 className="font-semibold">
                        Je veux diffuser que des vidéos
                      </h4>
                      <p>
                        Cela est impossible sur Google Display. Il est obligatoire de nous fournir des visuels dans les 3 formats correspondant aux publicités images pour pouvoir configurer la campagne.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet YouTube */}
          <TabsContent value="youtube">
            <Card>
              <CardHeader>
                <CardTitle>Publicités YouTube Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour YouTube Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités vidéo</h3>
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
                <CardTitle>Publicités LinkedIn Ads</CardTitle>
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
                    <h3 className="text-lg font-semibold mb-4">Publicités images</h3>
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
                    <h3 className="text-lg font-semibold mb-4">Publicités vidéo</h3>
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
                <CardTitle>Publicités TikTok Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour TikTok Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités vidéo</h3>
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
                    <div className="relative w-full overflow-hidden rounded-md border bg-muted flex justify-center mb-4">
                      <NextImage
                        src="/images/logos obligatoires.png"
                        alt="Logos obligatoires"
                        width={520}
                        height={320}
                        className="w-full max-w-md h-auto object-contain"
                      />
                    </div>
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
                <CardTitle>Publicités Snapchat Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Snapchat Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités images</h3>
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
                    <h3 className="text-lg font-semibold mb-4">Publicités vidéo</h3>
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
                <CardTitle>Publicités Spotify Ads</CardTitle>
                <CardDescription>
                  Formats et contraintes pour Spotify Advertising
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-semibold mb-4">Publicités images</h3>
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
                  <h3 className="text-lg font-semibold mb-2">Recommandations et contraintes</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Rappel des principales recommandations et contraintes
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-sm leading-relaxed rounded-md border bg-muted/30 px-4 py-3 space-y-2">
                      <h4 className="font-semibold">
                        Ne pas dépasser les limites de caractères pour les wordings¹
                      </h4>
                      <p>
                        Dépasser les limites de caractères a pour conséquence d’empêcher la création de campagnes sur Google.
                      </p>
                      <p>Aucune tolérance n’est accordée.</p>
                    </div>

                    <div className="text-sm leading-relaxed rounded-md border bg-muted/30 px-4 py-3 space-y-2">
                      <h4 className="font-semibold">
                        Ne pas utiliser de caractères de ponctuation en fin de phrase
                      </h4>
                      <p>
                        Google n’autorise pas l’utilisation de ponctuation en fin de phrase pour le titre long et les descriptions.
                      </p>
                      <p>Aucune tolérance n’est accordée.</p>
                    </div>

                    <div className="text-sm leading-relaxed rounded-md border bg-muted/30 px-4 py-3 space-y-2">
                      <h4 className="font-semibold">Je veux diffuser que des vidéos</h4>
                      <p>
                        Cela est impossible sur Google Display. Il est obligatoire de nous fournir des visuels dans les 3 formats correspondant aux
                        publicités images pour pouvoir configurer la campagne.
                      </p>
                    </div>
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

        <div className="mt-12 border-t pt-6 text-xs text-muted-foreground space-y-1">
          <p className="font-semibold">Notes</p>
          <p>1. wording = texte</p>
          <p>2. bloc CTA = bloc Call To Action (Bouton d’appel à l’action)</p>
        </div>
      </div>
    </div>
  )
}
