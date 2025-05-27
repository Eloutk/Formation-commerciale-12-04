import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChevronRight, AlertTriangle, Info } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import Image from "next/image"

export default function Tracking() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Tracking</h1>

        <div className="mb-8">
          <Card>
            <CardHeader>
              <CardTitle>Introduction au tracking publicitaire</CardTitle>
              <CardDescription>
                Comprendre les mécanismes de suivi des performances de vos campagnes publicitaires
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p>
                Le tracking est un élément essentiel de toute stratégie publicitaire digitale. Il permet de suivre et
                d'analyser les performances de vos campagnes, d'identifier les sources de trafic et de mesurer les
                conversions. Chaque plateforme propose ses propres outils et méthodes de tracking, avec des spécificités
                qu'il est important de comprendre pour optimiser vos campagnes.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Pixel et API</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Outils de tracking qui collectent les données du site et permettent de suivre les actions des
                      utilisateurs, essentiels pour mesurer les conversions.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Balises Google</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Outils de tracking spécifiques à Google permettant de suivre les conversions et les actions des
                      utilisateurs sur votre site web.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="pixel" className="w-full">
          <TabsList className="grid grid-cols-1 md:grid-cols-5 mb-8">
            <TabsTrigger value="pixel">Pixel et API</TabsTrigger>
            <TabsTrigger value="balises">Balise Google</TabsTrigger>
            <TabsTrigger value="attribution">Délais d'attribution</TabsTrigger>
            <TabsTrigger value="stats">Statistiques de campagne</TabsTrigger>
            <TabsTrigger value="utm">Descriptif des UTM</TabsTrigger>
          </TabsList>

          {/* Onglet Pixel et API */}
          <TabsContent value="pixel">
            <Card>
              <CardHeader>
                <CardTitle>Pixel et API</CardTitle>
                <CardDescription>Comprendre le fonctionnement et les limitations du tracking par pixel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <AlertDescription className="text-red-500">
                    Rappel : sur une campagne de conversion, l'objectif n'est pas forcément un achat.
                  </AlertDescription>
                </Alert>
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fonctionnement du pixel</h3>
                  <Alert className="mb-4 border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-500">
                      Ajouter " 50 actions sur le pixel/API afin de pouvoir partir en conversion sur les 28 derniers jours glissants "
                    </AlertDescription>
                  </Alert>
                  <p className="mb-4">
                    Le pixel/API collectent les données du site, pas seulement liées à notre campagne. Il est donc plus
                    facile et rapide d'atteindre ce minimum de 50 actions.
                  </p>
                  <p className="mb-4">
                    META a besoin de collecter de la données, comprendre la cible, le besoin avant de générer des
                    conversions (achats, prospects...).
                  </p>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Limitations actuelles du tracking</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2 flex items-center">
                        <span className="bg-primary/10 text-primary rounded-full p-1 mr-2">
                          <Info className="h-4 w-4" />
                        </span>
                        Avant vs Maintenant
                      </h4>
                      <p className="mb-2">
                        Le pixel existe sur toutes les plateformes. Avant grâce au Pixel, il était assez " simple " de
                        tracker le comportement des internautes, de la publicité jusqu'au site internet.
                      </p>
                      <p>Mais 2 événements sont venus chambouler ce fonctionnement :</p>
                      <ul className="list-disc list-inside mt-2 space-y-1 ml-4">
                        <li>l'avancement de la RGPD</li>
                        <li>Apple qui a décidé de tout faire pour bloquer ses concurrents des GAFA</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Conditions nécessaires pour le tracking</h3>
                  <p className="mb-4">
                    Désormais, pour tracer un comportement sur un site (achat, ajout au panier, consultation de telle
                    page, etc...) avec un Pixel, il faut que :
                  </p>
                  <ul className="list-disc list-inside space-y-1 ml-4">
                    <li>L'utilisateur accepte tous les cookies</li>
                    <li>L'utilisateur n'ait pas de bloqueur de pub</li>
                    <li>L'utilisateur ne soit pas en navigation privée</li>
                    <li>L'utilisateur n'ait pas bloqué le tracking directement via Apple</li>
                  </ul>

                  <Alert className="mt-6 border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertTitle className="text-red-500">ÉNORME PERTE DE DONNÉE</AlertTitle>
                    <AlertDescription className="text-red-500">
                      Environ 70% de perte en Europe et jusqu'à 90% aux USA...
                    </AlertDescription>
                  </Alert>

                  <p className="mt-4">
                    Tous ces blocages donnent des différences entre nos stats de campagne et les données que voit le
                    client (sur son Google Analytics par exemple). Régulièrement une inquiétude pour nos clients.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Balises Google */}
          <TabsContent value="balises">
            <Card>
              <CardHeader>
                <CardTitle>Balises Google</CardTitle>
                <CardDescription>Comprendre le fonctionnement des balises de conversion Google</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p>
                    Les balises Google désignent l'outil de tracking utilisé dans le cadre des campagnes Google Ads. Elles permettent de mesurer les performances des annonces diffusées.<br />
                    Contrairement à d'autres systèmes de tracking comme le Pixel Meta ou l'API de conversion, les balises Google ne commencent à collecter des données qu'à partir du moment où la campagne est active. Elles enregistrent uniquement les interactions liées à la campagne Google Ads, et non l'ensemble des données de navigation du site ou de la landing page.
                  </p>
                  <p>
                    Ces balises sont des fragments de code à intégrer sur le site internet de l'annonceur. Leur mise en place peut être effectuée de différentes façons :
                  </p>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li>Par le client directement : nous fournissons les balises à son développeur.</li>
                    <li>Par notre prestataire technique (Aropixel) : nous transmettons également les balises, et cette prestation est facturée.</li>
                    <li>Par le biais de Google Tag Manager (GTM) ou via une intégration manuelle dans le code source du site.</li>
                  </ul>
                  <Alert className="my-6 border-red-500/50 bg-red-500/10">
                    <AlertTriangle className="h-4 w-4 text-red-500" />
                    <AlertDescription className="text-red-500">
                      ⚠️ Important :<br />
                      Si des balises sont déjà en place dans le compte publicitaire du client ou dans son GTM, elles ne peuvent pas être réutilisées. Chaque Business Manager doit disposer de ses propres balises dédiées.
                    </AlertDescription>
                  </Alert>
                  <div className="mt-8">
                    <h3 className="text-lg font-semibold text-primary mb-2">À mettre à part</h3>
                    <ul className="list-disc list-inside space-y-2 pl-4">
                      <li><strong>Google Analytics</strong> concerne l'analyse des données du site internet.</li>
                      <li><strong>Google Tag Manager</strong> est l'outil de pose des outils de tracking.</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Délais d'attribution */}
          <TabsContent value="attribution">
            <Card>
              <CardHeader>
                <CardTitle>Délais d'attribution</CardTitle>
                <CardDescription>
                  Comprendre comment les conversions sont attribuées aux campagnes publicitaires
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Qu'est-ce que les délais d'attribution ?</h3>
                  <p className="mb-4">
                    Les délais d'attribution sont mondiaux et les mêmes pour tous. Ils servent à cadrer les résultats
                    d'une campagne. Ils sont également soumis à de nombreux changements (plus restrictifs).
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Délais d'attribution actuels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Vue d'une publicité</h4>
                      <p>
                        <span className="font-bold">1 jour après une vue</span>
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Clic sur une publicité</h4>
                      <p>
                        <span className="font-bold">7 jours après un clic</span>
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Exemple concret d'attribution</h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Scénario 1 : Vue sans clic</h4>
                      <p>
                        Vue sans clic<br />
                        Un internaute qui voit notre pub (qui ne clique pas), qui se dit " ça m'intéresse je regarde ça ce soir " et qui achète le soir en rentrant : <span className="font-bold">C.A. attribué à notre campagne</span>
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Scénario 2 : clics avec conversion dans les 7 derniers jours</h4>
                      <p>
                        Un internaute qui voit notre pub, qui clique pour aller voir le site et qui se dit " ça
                        m'intéresse je regarde ça plus tard ". S'il achète dans les 7 jours alors le chiffre d'affaires
                        lié à cet achat est attribué à notre campagne (comme source de la vente). S'il achète au 8ème
                        jour, alors ce chiffre n'est pas comptabilisé sur notre campagne.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Statistiques de campagne */}
          <TabsContent value="stats">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de campagne</CardTitle>
                <CardDescription>Comprendre les données collectées par les plateformes publicitaires</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Collecte de données sur les plateformes sociales</h3>
                  <p className="mb-4">
                    A la création de leurs comptes, les utilisateurs des plateformes (Facebook, Insta, Snap, Tiktok...)
                    acceptent les CGU. Ce consentement permet aux plateformes de collecter des données.
                  </p>
                  <p className="mb-4">
                    C'est pour ça que, malgré la RGPD, nos stats de campagnes sur ces plateformes ne sont pas minorées.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Cas particulier de Google & YouTube</h3>
                  <Alert className="mb-4 border-amber-500/50 bg-amber-500/10">
                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                    <AlertDescription>
                      Pour Google & YouTube, c'est plus compliqué car beaucoup d'utilisateurs ne sont pas connectés à
                      leur compte lors de leur utilisation de ces plateformes. C'est pour cela qu'il y a, souvent, une
                      grande part " d'inconnus " sur nos rapports.
                    </AlertDescription>
                  </Alert>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Différences entre les statistiques</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Source</TableHead>
                        <TableHead>Caractéristiques</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">Plateformes publicitaires</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Données basées sur les interactions avec les publicités</li>
                            <li>Inclut les vues, clics, et conversions attribuées</li>
                            <li>Soumis aux délais d'attribution</li>
                          </ul>
                        </TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">Google Analytics</TableCell>
                        <TableCell>
                          <ul className="list-disc list-inside space-y-1">
                            <li>Données basées sur les visites réelles du site</li>
                            <li>Dépend de l'acceptation des cookies</li>
                            <li>Peut montrer des écarts avec les plateformes publicitaires</li>
                          </ul>
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Onglet Descriptif des UTM */}
          <TabsContent value="utm">
            <Card>
              <CardHeader>
                <CardTitle>Descriptif des UTM</CardTitle>
                <CardDescription>Comprendre l'intérêt et la structure des UTM dans le suivi des campagnes</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <section>
                  <h3 className="text-lg font-semibold text-primary mb-2">Qu'est-ce qu'un UTM ?</h3>
                  <p>
                    Un UTM est un morceau de code ajouté à la fin de l'URL d'une landing page pour suivre l'origine du trafic.<br />
                    Il est utilisé dans toutes nos campagnes pour permettre au client de retracer précisément les visiteurs générés par nos actions via ses outils de tracking (comme Google Analytics, Matomo, HubSpot, etc.).
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-primary mb-2">Structure type d'un UTM utilisé dans nos campagnes</h3>
                  <p>Voici un exemple d'UTM classique que nous intégrons :</p>
                  <pre className="bg-muted p-4 rounded text-sm overflow-x-auto">
                    <code>utm_source=META&amp;utm_medium=CPM&amp;utm_campaign=052025META&amp;utm_content=&#123;&#123;adset.name&#125;&#125;</code>
                  </pre>
                  <h4 className="font-medium mt-4 mb-2">Décryptage :</h4>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>utm_source=META</strong> → la plateforme de diffusion (ex : META, Google, LinkedIn)</li>
                    <li><strong>utm_medium=CPM</strong> → le mode d'achat ou type de campagne (CPM, CPC, etc.)</li>
                    <li><strong>utm_campaign=052025META</strong> → nom ou code de la campagne</li>
                    <li><strong>"utm_content=&#123;&#123;adset.name&#125;&#125;"</strong> → nom du groupe d'annonces ou variante, pour affiner l'analyse</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-primary mb-2">Deux cas possibles dans la gestion des UTM :</h3>
                  <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Cas standard :</strong> Si le client ne fait pas de demande particulière, nous utilisons notre structure UTM habituelle, pensée pour être cohérente et lisible.</li>
                    <li><strong>Cas client digitalement mature :</strong> Si le client suit déjà ses campagnes en détail, il nous fournit son propre format d'UTM. Dans ce cas, nous l'intégrons à la lettre dans la campagne, sans modification.</li>
                  </ul>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-primary mb-2">Comment reconnaître un lien tracké ?</h3>
                  <p>
                    Si vous cliquez sur une publicité, regardez l'URL de la page d'arrivée :<br />
                    Si elle contient un <code>?</code> suivi de <code>utm_...</code>, vous êtes sur un lien tracké.<br />
                    Ce "petit morceau de code" permet aux outils d'analyse de suivre ce que fait l'utilisateur après avoir cliqué sur l'annonce.
                  </p>
                </section>
                <section>
                  <h3 className="text-lg font-semibold text-primary mb-2">En résumé</h3>
                  <p>
                    Les UTM sont invisibles pour l'internaute, mais essentiels pour le client car ils permettent de mesurer l'impact réel de chaque campagne.
                  </p>
                </section>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 flex justify-end">
          <Link href="/formation/tracking/quiz">
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

