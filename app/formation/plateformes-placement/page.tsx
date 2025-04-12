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
        <h1 className="text-3xl font-bold mb-4">Plateformes et Placement</h1>

        <div className="flex justify-center mb-8">
          <Button 
            variant="outline" 
            onClick={() => {
              const link = document.createElement('a');
              link.href = '/Guide des formats visuels et des contraintes.pdf';
              link.download = 'Guide des formats visuels et des contraintes.pdf';
              link.onerror = () => {
                alert('Le document n\'est pas disponible pour le moment. Veuillez réessayer plus tard.');
              };
              document.body.appendChild(link);
              link.click();
              document.body.removeChild(link);
            }}
          >
            <Download className="mr-2 h-4 w-4" />
            Télécharger le guide des formats
          </Button>
        </div>

        <Tabs defaultValue="social" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="social">Réseaux Sociaux</TabsTrigger>
            <TabsTrigger value="google">Google</TabsTrigger>
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
                <Tabs defaultValue="linkedin">
                  <TabsList className="mb-4">
                    <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
                    <TabsTrigger value="snapchat">Snapchat</TabsTrigger>
                    <TabsTrigger value="meta">META</TabsTrigger>
                    <TabsTrigger value="tiktok">TikTok</TabsTrigger>
                  </TabsList>

                  <TabsContent value="linkedin">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">LinkedIn</h3>
                      <p>
                        LinkedIn est idéal pour le marketing B2B et le recrutement, offrant un ciblage précis basé sur
                        les compétences professionnelles.
                      </p>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Sponsored Content :</span> Publications sponsorisées dans le fil
                          d'actualité
                        </li>
                        <li>
                          <span className="font-medium">Message Ads :</span> Messages InMail sponsorisés
                        </li>
                        <li>
                          <span className="font-medium">Dynamic Ads :</span> Publicités personnalisées avec les données
                          du profil
                        </li>
                        <li>
                          <span className="font-medium">Text Ads :</span> Petites annonces textuelles dans la barre
                          latérale
                        </li>
                      </ul>

                      <div className="mt-6 border rounded-md overflow-hidden flex justify-center">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Linkedin-CaMjZhocax0R1dK3JQp8Arvo4ajKua.png"
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
                      <h3 className="text-lg font-medium">Snapchat</h3>
                      <p>Snapchat est idéal pour toucher une audience jeune avec un contenu éphémère et engageant.</p>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Snap Ads :</span> Publicités plein écran de 10 secondes
                        </li>
                        <li>
                          <span className="font-medium">Story Ads :</span> Collection de 3-20 Snaps
                        </li>
                        <li>
                          <span className="font-medium">Collection Ads :</span> Vitrine de produits cliquables
                        </li>
                        <li>
                          <span className="font-medium">Filters :</span> Superpositions créatives sur les Snaps
                        </li>
                        <li>
                          <span className="font-medium">Lenses :</span> Expériences AR interactives
                        </li>
                      </ul>

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
                      <h3 className="text-lg font-medium">META (Facebook & Instagram)</h3>
                      <p>
                        Les plateformes Meta offrent une large audience et des options de ciblage démographique et
                        comportemental avancées.
                      </p>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Image :</span> Publicités statiques avec texte
                        </li>
                        <li>
                          <span className="font-medium">Vidéo :</span> Annonces en mouvement dans le fil d'actualité
                        </li>
                        <li>
                          <span className="font-medium">Carrousel :</span> Plusieurs images/vidéos défilantes
                        </li>
                        <li>
                          <span className="font-medium">Collection :</span> Vitrine de produits combinée à une vidéo
                        </li>
                        <li>
                          <span className="font-medium">Stories :</span> Publicités plein écran entre les stories
                        </li>
                        <li>
                          <span className="font-medium">Reels :</span> Format court vertical similaire à TikTok
                        </li>
                      </ul>

                      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/META%20Video-SMZMVp5QnxLLitxMpNcEFOp7voXWTT.png"
                            alt="Exemple de publicité META Feed"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Feed</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/META%20Story-MwHiwYXPrU1UHo6Qehth2eXj2okDvf.png"
                            alt="Exemple de publicité META Story"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Story</p>
                        </div>
                        <div className="border rounded-md overflow-hidden">
                          <Image
                            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/META%20Carrousel-S9nKEIX6aoA4F077SMaUOKZheupATs.png"
                            alt="Exemple de publicité META Carrousel"
                            width={300}
                            height={600}
                            className="w-full h-auto"
                          />
                          <p className="text-center text-sm p-2">Format Carrousel</p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="tiktok">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">TikTok</h3>
                      <p>
                        TikTok est la plateforme idéale pour un contenu créatif et authentique ciblant principalement
                        les générations Z et Y.
                      </p>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">In-Feed Ads :</span> Vidéos natives dans le fil "Pour toi"
                        </li>
                        <li>
                          <span className="font-medium">TopView :</span> Première vidéo que les utilisateurs voient en
                          ouvrant l'app
                        </li>
                        <li>
                          <span className="font-medium">Branded Hashtag Challenge :</span> Défis sponsorisés incitant à
                          la création de contenu
                        </li>
                        <li>
                          <span className="font-medium">Branded Effects :</span> Filtres et effets AR personnalisés
                        </li>
                      </ul>

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
                </Tabs>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Google */}
          <TabsContent value="google">
            <Card>
              <CardHeader>
                <CardTitle>Google</CardTitle>
                <CardDescription>Publicités Search, Display et YouTube</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="search">
                  <TabsList className="mb-4">
                    <TabsTrigger value="search">Search</TabsTrigger>
                    <TabsTrigger value="display">Display</TabsTrigger>
                    <TabsTrigger value="youtube">YouTube</TabsTrigger>
                  </TabsList>

                  <TabsContent value="search">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Google Search</h3>
                      <p>
                        Les annonces Google Search apparaissent dans les résultats de recherche Google et ciblent les
                        utilisateurs avec une intention d'achat précise.
                      </p>

                      <h4 className="font-medium mt-6">Types d'annonces</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Annonces textuelles :</span> Format texte standard dans les
                          résultats de recherche
                        </li>
                        <li>
                          <span className="font-medium">Annonces dynamiques :</span> Créées automatiquement à partir du
                          contenu de votre site
                        </li>
                        <li>
                          <span className="font-medium">Annonces Shopping :</span> Présentent des produits avec images
                          et prix
                        </li>
                      </ul>

                      <div className="mt-6 border rounded-md overflow-hidden">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Search-kjmLDrUK6exHnqL9ypP8fVrgZ1g9gc.png"
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
                      <h3 className="text-lg font-medium">Google Display</h3>
                      <p>
                        Le réseau Display de Google permet d'afficher des annonces visuelles sur des millions de sites
                        web et applications.
                      </p>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">Bannières adaptatives :</span> S'adaptent automatiquement aux
                          espaces disponibles
                        </li>
                        <li>
                          <span className="font-medium">Annonces illustrées :</span> Images fixes avec différentes
                          tailles standard
                        </li>
                        <li>
                          <span className="font-medium">Annonces HTML5 :</span> Contenus interactifs et animés
                        </li>
                        <li>
                          <span className="font-medium">Annonces vidéo :</span> Format vidéo dans l'environnement
                          Display
                        </li>
                      </ul>

                      <div className="mt-6 border rounded-md overflow-hidden">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Display-lXomOjJCSh1ozTacWzgfVdPWzqFJE2.png"
                          alt="Exemple de publicité Google Display"
                          width={800}
                          height={400}
                          className="w-full h-auto"
                        />
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="youtube">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">YouTube</h3>
                      <p>
                        YouTube permet de diffuser des annonces vidéo à une audience massive avec différents formats
                        d'engagement.
                      </p>

                      <h4 className="font-medium mt-6">Formats publicitaires</h4>
                      <ul className="list-disc list-inside space-y-2">
                        <li>
                          <span className="font-medium">TrueView In-Stream :</span> Vidéos ignorables après 5 secondes
                        </li>
                        <li>
                          <span className="font-medium">Annonces non ignorables :</span> Vidéos de 15-20 secondes
                        </li>
                        <li>
                          <span className="font-medium">Annonces Bumper :</span> Vidéos courtes de 6 secondes maximum
                        </li>
                        <li>
                          <span className="font-medium">Annonces Masthead :</span> Format premium en haut de la page
                          d'accueil
                        </li>
                      </ul>

                      <div className="mt-6 border rounded-md overflow-hidden">
                        <Image
                          src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Youtube-9fgSsmHIgBqTngyfpa8CW4z2uLHM12.png"
                          alt="Exemple de publicité YouTube"
                          width={800}
                          height={500}
                          className="w-full h-auto"
                        />
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
                <p>
                  Les campagnes SMS sont un canal direct et personnel pour communiquer avec vos clients, avec un taux
                  d'ouverture moyen de 98%.
                </p>

                <h3 className="text-lg font-medium">Avantages du marketing par SMS</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Taux d'ouverture élevé</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        La plupart des SMS sont lus dans les 3 minutes suivant leur réception, offrant une visibilité
                        incomparable pour vos communications urgentes.
                      </p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Efficacité et ROI</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>
                        Le marketing par SMS offre un excellent retour sur investissement, avec des taux de conversion
                        souvent supérieurs aux autres canaux.
                      </p>
                    </CardContent>
                  </Card>
                </div>
              </CardContent>
              <CardFooter>
                <Link href="/formation/plateformes-placement/quiz">
                  <Button>
                    Passer au quiz
                    <ChevronRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardFooter>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

