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
                    <CardTitle className="text-base">Délais d'attribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Périodes pendant lesquelles une conversion peut être attribuée à une campagne publicitaire après
                      qu'un utilisateur a interagi avec une annonce.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-base">Statistiques de campagne</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm">
                      Données collectées par les plateformes publicitaires pour mesurer les performances des campagnes,
                      incluant impressions, clics, conversions, etc.
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
          <TabsList className="grid grid-cols-2 md:grid-cols-4 mb-8">
            <TabsTrigger value="pixel">Pixel et API</TabsTrigger>
            <TabsTrigger value="attribution">Délais d'attribution</TabsTrigger>
            <TabsTrigger value="stats">Statistiques de campagne</TabsTrigger>
            <TabsTrigger value="balises">Balises Google</TabsTrigger>
          </TabsList>

          {/* Onglet Pixel et API */}
          <TabsContent value="pixel">
            <Card>
              <CardHeader>
                <CardTitle>Pixel et API</CardTitle>
                <CardDescription>Comprendre le fonctionnement et les limitations du tracking par pixel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Fonctionnement du pixel</h3>
                  <Alert className="mb-4 border-primary/50 bg-primary/10">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Il faut minimum 50 actions sur le pixel/API afin de pouvoir partir en conversion.
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
                        Le pixel existe sur toutes les plateformes. Avant grâce au Pixel, il était assez « simple » de
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
                    Les délais d'attribution sont mondiales et les mêmes pour tous. Ils servent à cadrer les résultats
                    d'une campagne. Ils sont également soumis à de nombreux changements (plus restrictifs).
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Délais d'attribution actuels</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Vue d'une publicité</h4>
                      <p>
                        <span className="font-bold">Rien après une vue</span> (vs 7 jours après une vue avant)
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Clic sur une publicité</h4>
                      <p>
                        <span className="font-bold">7 jours après un clic</span> (vs 28 jours après un clic avant)
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
                        Un internaute qui voit notre pub (qui ne clique pas), qui se dit « ça m'intéresse je regarde ça
                        ce soir » et qui achète le soir en rentrant :{" "}
                        <span className="font-bold">Pas de C.A. sur notre campagne.</span>
                      </p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <h4 className="font-medium mb-2">Scénario 2 : Clic avec achat dans les 7 jours</h4>
                      <p>
                        Un internaute qui voit notre pub, qui clique pour aller voir le site et qui se dit « ça
                        m'intéresse je regarde ça plus tard ». S'il achète dans les 7 jours alors le chiffre d'affaires
                        lié à cet achat est attribué à notre campagne (comme source de la vente). S'il achète au 8ème
                        jour, alors ce chiffre n'est pas comptabilisé sur notre campagne.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Exemple de rapport d'attribution</h3>
                  <div className="border rounded-lg overflow-hidden mb-6">
                    <Image
                      src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/Capture%20d%E2%80%99e%CC%81cran%202025-03-29%20a%CC%80%2010.48.51-sNlurpXhaTNmsYOdEyCO2R4Hyn1aEF.png"
                      alt="Rapport d'attribution montrant les achats, clics et montants"
                      width={1200}
                      height={400}
                      className="w-full h-auto"
                    />
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Ce rapport montre les principales métriques d'attribution : 1194 achats, 1939 clics sur lien, et 18
                    973,93€ de montant d'achats, avec leurs évolutions sur la période.
                  </p>
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
                      grande part « d'inconnus » sur nos rapports.
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

          {/* Onglet Balises Google */}
          <TabsContent value="balises">
            <Card>
              <CardHeader>
                <CardTitle>Balises Google</CardTitle>
                <CardDescription>Comprendre le fonctionnement des balises de conversion Google</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Installation des balises Google</h3>
                  <p className="mb-4">Les balises Google peuvent être posées :</p>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>
                      <span className="font-medium">Par le Service TM</span> - si un GTM est en place sur le site du
                      client (Google Tag manager) - prévoir un délai de mise en place avant démarrage de la campagne.
                      <div className="ml-6 mt-1 text-sm text-muted-foreground">
                        Nous ne pouvons pas poser des balises sur un site e-commerce.
                      </div>
                    </li>
                    <li>
                      <span className="font-medium">Par le développeur</span> via le GTM ou directement sur le site (en
                      dur)
                    </li>
                  </ul>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Google Tag Manager (GTM)</h3>
                  <p className="mb-4">
                    Le GTM est un gestionnaire de tracking. Cela permet simplement de rassembler et/ou paramétrer tous
                    les trackings d'un site. Il n'est pas possible d'avoir une analyse ou des stats avec GTM. L'analyse
                    des stats du site se fait à l'aide de l'outil Google Analytics.
                  </p>
                </div>

                <div className="mt-6">
                  <h3 className="text-lg font-semibold mb-4">Placement et utilisation des balises</h3>
                  <ul className="list-disc list-inside space-y-2 ml-4">
                    <li>Les balises Google sont posées sur la Landing Page souhaitée pour la campagne.</li>
                    <li>
                      Si les clients ont déjà posé des balises sur leur gestionnaire de publicités ou si des balises
                      sont disponibles sur leur GTM, nous ne pourrons pas les utiliser. Chaque Business manager doit
                      avoir ses balises.
                    </li>
                    <li>
                      Le gestionnaire de publicités collectera des données dès lors que la campagne est en diffusion et
                      pas avant (grande différence avec le pixel/API). Ces balises collecteront les données de la
                      campagne seulement, et non tous les flux du site/LP du client.
                    </li>
                  </ul>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-semibold mb-4">Cas particulier : sites multiples</h3>
                  <Alert className="mb-4 border-primary/50 bg-primary/10">
                    <Info className="h-4 w-4" />
                    <AlertDescription>
                      Par exemple, si site vitrine et billetterie à part et qu'on veut tracker les achats : il faut nous
                      demander du tracking sur la billetterie et non sur le site vitrine du client. (Pixel/API/Balises
                      sont posés sur 1 seul site).
                    </AlertDescription>
                  </Alert>
                </div>
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

