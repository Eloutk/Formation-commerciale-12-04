'use client'

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ChevronRight, Download } from "lucide-react"
import Image from "next/image"

export default function PlateformesPlacement() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-4">Plateformes et Placements</h1>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="google">Google Ads</TabsTrigger>
            <TabsTrigger value="sms">Campagnes SMS</TabsTrigger>
          </TabsList>

          {/* Onglet Réseaux Sociaux */}
          <TabsContent value="social">
            <Card>
              <CardHeader>
                <CardTitle>Réseaux Sociaux</CardTitle>
                <CardDescription>Formats publicitaires et spécificités par plateforme</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="meta">
                  <TabsList className="mb-4">
                    <TabsTrigger value="meta">META</TabsTrigger>
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="snapchat">Snapchat</TabsTrigger>
                    <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                    <TabsTrigger value="spotify">Spotify</TabsTrigger>
                  </TabsList>

                  <TabsContent value="linkedin">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo LinkedIn.png"
                          alt="Logo LinkedIn"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">LinkedIn</h3>
                      </div>
                      <div className="border rounded-md bg-white p-4">
                        <p className="mb-2">
                          LinkedIn est une plateforme idéale pour toucher les professionnels (B2B). Elle offre un ciblage précis basé sur les données professionnelles :
                        </p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Fonction (ex : marketing, RH, finance…)</li>
                          <li>Titre de poste (ex : CEO, Marketing Manager…)</li>
                          <li>Compétences (skills listées sur le profil)</li>
                          <li>Années d'expérience</li>
                          <li>Niveau hiérarchique (ex : employé, manager, directeur…)</li>
                          <li>Domaine d'études (ex : ingénierie, commerce, etc.)</li>
                        </ul>
                        <p className="mt-2">Ciblage entreprises :</p>
                        <ul className="list-disc list-inside ml-4 space-y-1">
                          <li>Nom de l'entreprise (ciblage précis de sociétés spécifiques)</li>
                          <li>Taille de l'entreprise (ex : 1–10 employés, 11–50, etc.)</li>
                          <li>Secteur d'activité (industrie, IT, finance, santé, etc.)</li>
                        </ul>
                      </div>
                      <div className="border rounded-md bg-white p-4 mt-4">
                        <h4 className="font-medium mb-2">Formats publicitaires</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Image fixe</li>
                          <li>Carrousel</li>
                          <li>Vidéo</li>
                          <li>Document (mise en avant de contenu PDF dans le but de faire télécharger la suite du document. Pour cela, l'internaute doit renseigner ses coordonnées)</li>
                        </ul>
                      </div>

                      <div className="mt-6 border rounded-md overflow-hidden flex justify-center">
                        <Image
                          src="/images/Nouveau visuel Linkedin.png"
                          alt="Exemple de publicité LinkedIn"
                          width={350}
                          height={525}
                          className="h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="snapchat">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo Snapchat.png"
                          alt="Logo Snapchat"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">Snapchat</h3>
                      </div>
                      <div className="border rounded-md bg-white p-4">
                        <ul className="list-disc list-inside space-y-1 ml-4">
                          <li>Idéal pour toucher une audience jeune avec un contenu dynamique</li>
                          <li>on Snapchat est très fortement utilisé par les jeunes : la tranche 18-24 ans représente autour de 37-38 % des utilisateurs globaux. 

La deuxième tranche importante est 25-34 ans (~ 24-25 %) ; ensuite ça chute pour les 35-49 ans (~ 14-15 %) et beaucoup plus pour les plus de 50 ans. 



Par genre, la répartition est assez équilibrée : légèrement plus d’utilisateurs masculins dans certains cas et équilibré dans d’autres. 


En France, Snapchat atteint environ 27-28 millions d’utilisateurs (premier semestre 2025), ce qui représente environ 41-42 % de la population (à partir de 13 ans) selon les chiffres d'audience publicitaire.</li>
                        </ul>
                      </div>
                      <div className="border rounded-md bg-white p-4 mt-4">
                        <h4 className="font-medium mb-2">Formats publicitaires</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Vidéo</li>
                          <li>Image fixe</li>
                          <li>Animation visuelle</li>
                        </ul>
                      </div>

                      <div className="mt-6 border rounded-md overflow-hidden flex justify-center">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Snap-G06q8JEp1zkxd9ZNS8gmYQ7Qb37Hi2.png"
                          alt="Exemple de publicité Snapchat"
                          width={280}
                          height={560}
                          className="h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="meta">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo META.png"
                          alt="Logo META"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">META (Facebook & Instagram)</h3>
                      </div>
                      <div className="border rounded-md bg-white p-4">
                        <p className="mb-2">META est la référence en terme de publicité sur les réseaux sociaux : nombreuses possibilités de ciblages, large audience sur la plateforme, possibilité de paramétrage et d'optimisation poussées…</p>
                        <p>META englobe plusieurs plateformes : Facebook, Instagram, WhatsApp, Messenger et depuis peu : Threads (publicité pas encore disponible pour le moment sur cette plateforme)</p>
                        <p>+3,9 milliards d'utilisateurs actifs mensuels sur l'écosystème Meta (2025).</p>
                      </div>
                      <div className="border rounded-md bg-white p-4 mt-4">
                        <h4 className="font-medium mb-2">Formats publicitaires</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li><span className="font-medium">Image :</span> Publicités statiques avec texte</li>
                          <li><span className="font-medium">Vidéo :</span> Annonces en mouvement dans le fil d'actualité</li>
                          <li><span className="font-medium">Carrousel :</span> Plusieurs images/vidéos défilantes</li>
                          <li><span className="font-medium">Stories :</span> Publicités plein écran entre les stories</li>
                          <li><span className="font-medium">Reels :</span> Format court vertical similaire à TikTok</li>
                        </ul>
                      </div>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Visuel fixe Facebook.png"
                            alt="Exemple de publicité Facebook Feed"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Feed Facebook</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Visuel story Facebook.png"
                            alt="Exemple de publicité Facebook Story"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Story Facebook</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Visuel carrousel Facebook.png"
                            alt="Exemple de publicité Facebook Carrousel"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Carrousel Facebook</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Visuel fixe Instagram.png"
                            alt="Exemple de publicité Instagram Feed"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Feed Instagram</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Visuel story Instagram.png"
                            alt="Exemple de publicité Instagram Story"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Story Instagram</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Visuel carrousel Instagram.png"
                            alt="Exemple de publicité Instagram Carrousel"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Carrousel Instagram</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tiktok">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo TikTok.png"
                          alt="Logo TikTok"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">TikTok</h3>
                      </div>
                      <div className="border rounded-md bg-white p-4">
                        <p>TikTok est la plateforme idéale pour un contenu créatif et authentique ciblant principalement les générations Z et Y.
                        1,7 milliard d’utilisateurs actifs dans le monde, dont ~21,5 millions en France (40 % des adultes).

25-34 ans = cœur de l’audience (≈29 % en France), suivis de près par les 18-24 ; les 35-44 ans progressent fortement.

Temps moyen élevé : ≈1h par jour par utilisateur, l’un des réseaux où l’engagement est le plus fort.

Contenus dominants : vidéos courtes, verticales, avec montée en puissance des tutoriels, de l’éducation et du business aux côtés du divertissement.

TikTok devient aussi un moteur de recherche alternatif (près de 40 % des 18-24 préfèrent chercher sur TikTok plutôt que Google).
⚖️ Répartition de genre équilibrée (légère majorité féminine en France : 52/48).
                        </p>
                      </div>
                      <div className="border rounded-md bg-white p-4 mt-4">
                        <h4 className="font-medium mb-2">Formats publicitaires</h4>
                        <ul className="list-disc list-inside space-y-2">
                          <li>Vidéo</li>
                          <li>Animation visuelle</li>
                        </ul>
                      </div>

                      <div className="mt-6 border rounded-md overflow-hidden flex justify-center">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Tiktok%20Feed-TrSfdwpSto6bcBnYCH0nDdy1uIW8qT.png"
                          alt="Exemple de publicité TikTok"
                          width={280}
                          height={560}
                          className="h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="spotify">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo Spotify.png"
                          alt="Logo Spotify"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">Spotify</h3>
                      </div>
                      <div className="border rounded-md bg-white p-4">
                        <p>Spotify est une plateforme audio qui permet d'atteindre une audience captive pendant l'écoute de musique.
                        Dans le monde, 696 millions d’utilisateurs actifs mensuels, dont ~276 millions abonnés Premium.

25-34 ans = tranche d’âge la plus représentée, suivie de près par les 18-24 ans ; les +55 ans progressent doucement.

Répartition par genre équilibrée avec légère majorité masculine (~56 % hommes vs 44 % femmes).

Contenus diversifiés : musique, podcasts, audiobooks ; usage quotidien. 

Modèle économique dominé par les abonnements Premium, mais la version gratuite avec publicité reste clé pour recruter.
                        </p>
                      </div>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>Audio Ads : annonces audio diffusées entre les chansons, d'une durée maximale de 30 secondes</li>
                      </ul>
                      <div className="mt-6 border rounded-md overflow-hidden flex justify-center">
                        <Image
                          src="/images/Visuel-Spotify.png"
                          alt="Exemple de publicité Spotify"
                          width={280}
                          height={560}
                          className="h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Google Ads</CardTitle>
                <CardDescription>Publicités Search, Display et YouTube</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-6 space-y-2">
                  <p>Google Ads (anciennement Google AdWords) est la plateforme publicitaire officielle de Google. Elle permet de créer et diffuser des annonces publicitaires sur :</p>
                  <ul className="list-disc list-inside ml-6">
                    <li>Le moteur de recherche Google (quand les gens tapent une requête)</li>
                    <li>YouTube (publicité vidéo)</li>
                    <li>Le réseau Display Google (sites partenaires affichant des bannières)</li>
                    <li>Gmail (annonces sponsorisées dans les mails)</li>
                    <li>Google Shopping (pour les produits e-commerce) <span className="italic">- non réalisé par Link</span></li>
                    <li>Applications mobiles via Google Play et AdMob <span className="italic">- non réalisé par Link</span></li>
                  </ul>
                </div>
                <Tabs defaultValue="search">
                  <TabsList className="mb-4">
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                  </TabsList>

                  <TabsContent value="search">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo Google.png"
                          alt="Logo Google"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">Le réseau de recherche Google Search</h3>
                      </div>
                      <p>
                        Les annonces Google Search apparaissent dans les résultats de recherche Google et ciblent les
                        utilisateurs avec une intention de recherche précise.
                      </p>
                      <h4 className="font-medium mt-6">Types d'annonces</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Annonces textuelles :</span> Format texte standard dans les résultats de recherche
                        </li>
                        <li>
                          <span className="font-medium">Annonces dynamiques :</span> Créées automatiquement à partir du contenu de votre site <span className="italic">—&gt; non réalisé par Link car le contenu est toujours validé par le client</span>
                        </li>
                        <li>
                          <span className="font-medium">Annonces Shopping :</span> Présentent des produits avec images et prix <span className="italic">—&gt; non réalisé par Link (gestion du stock, inventaire, accès à des bases de données…)</span>
                        </li>
                      </ul>
                      <div className="mt-6 border rounded-md overflow-hidden">
                        <Image
                          src="/images/search.png"
                          alt="Exemple de publicité Google Search"
                          width={800}
                          height={600}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="display">
                    <div className="space-y-4">
                      <div className="flex items-center gap-2">
                        <Image
                          src="/images/Logo Google.png"
                          alt="Logo Google"
                          width={32}
                          height={32}
                          className="rounded-sm"
                        />
                        <h3 className="text-lg font-medium">Google Display</h3>
                      </div>
                      <p>
                        Le réseau Display de Google permet d'afficher des annonces visuelles sur des millions de sites web et applications.
                      </p>
                      <ul className="list-disc list-inside space-y-1 mb-4 ml-4">
                        <li><span className="font-medium">Bannières adaptatives :</span> S'adaptent automatiquement aux espaces disponibles</li>
                        <li><span className="font-medium">Annonces illustrées :</span> Images fixes avec différentes tailles standard</li>
                        <li><span className="font-medium">Annonces vidéo :</span> Format vidéo dans l'environnement Display</li>
                      </ul>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Display 1.png"
                            alt="Exemple Display 1"
                            width={300}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Display 2.png"
                            alt="Exemple Display 2"
                            width={300}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/Display 3.png"
                            alt="Exemple Display 3"
                            width={300}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
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
                        <h3 className="text-lg font-medium">YouTube</h3>
                      </div>
                      <p>
                        C'est la référence en terme de contenu vidéo. Cette plateforme est devenue le 2ᵉ moteur de recherche mondial après Google.
                        Les annonces publicitaires sont diffusées avant (pré-roll), pendant (mid-roll) ou après les vidéos.
                      </p>
                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Annonces in-stream (instant) :</span> Les annonces InStream sont diffusées avant, pendant ou après d'autres vidéos. Les annonces bumper durent six secondes et ne peuvent pas être ignorées. Les annonces InStream désactivables durent au moins sept secondes et peuvent être ignorées au bout de cinq secondes.
                        </li>
                        <li>
                          <span className="font-medium">Annonces in-feed (carré) :</span> Les annonces In-Feed durent au moins sept secondes, et comprennent une miniature de vidéo et du texte. Les utilisateurs peuvent regarder l'annonce vidéo en lecture automatique ou cliquer sur la miniature pour visionner l'annonce sur une chaîne YouTube ou une page de lecture.
                        </li>
                        <li>
                          <span className="font-medium">Annonces shorts (story) :</span> Les annonces Shorts durent au moins six secondes et s'affichent entre les vidéos générées par les utilisateurs sur YouTube Shorts. Les utilisateurs peuvent ignorer l'annonce à tout moment. Pour augmenter le nombre de vues de vos annonces Shorts, utilisez une vidéo verticale.
                        </li>
                      </ul>
                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/YouTube 1.png"
                            alt="Exemple YouTube 1"
                            width={300}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/YouTube 2.png"
                            alt="Exemple YouTube 2"
                            width={300}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="/images/YouTube 3.png"
                            alt="Exemple YouTube 3"
                            width={300}
                            height={400}
                            className="w-full h-auto"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet SMS */}
          <TabsContent value="sms">
            <Card>
              <CardHeader>
                <CardTitle>Campagnes SMS</CardTitle>
                <CardDescription>Marketing par SMS via prestataires externes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <p>Les campagnes SMS ne sont pas gérées en interne mais elles sont confiées à nos partenaires.</p>
              </CardContent>
              {/* Quiz button removed */}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

