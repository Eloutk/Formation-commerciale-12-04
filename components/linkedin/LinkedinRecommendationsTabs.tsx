"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

function ImagePlaceholder({ label = "Ajouter votre image" }: { label?: string }) {
  return (
    <div className="aspect-video w-full rounded-md border border-dashed text-center grid place-items-center text-xs text-muted-foreground">
      {label}
    </div>
  )
}

export default function LinkedinRecommendationsTabs(): JSX.Element {
  const cardHeaderClass = "space-y-0 pb-0"
  const cardTitleClass = "text-sm md:text-sm font-bold leading-normal tracking-normal"

  return (
    <Tabs defaultValue="rappels" className="w-full">
      <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        <TabsTrigger value="rappels">Principales recommandations</TabsTrigger>
        <TabsTrigger value="limitations">Limitations de la plateforme</TabsTrigger>
        <TabsTrigger value="restrictions">Restrictions de la plateforme</TabsTrigger>
      </TabsList>

      {/* Onglet 1: Rappels généraux LinkedIn */}
      <TabsContent value="rappels">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-yellow-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Logo et nom de page</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Il n’est pas essentiel d’ajouter votre logo/nom de marque sur le visuel.
              Sur LinkedIn, ils apparaissent via la photo de profil et le nom de la
              page de diffusion.
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Limites de caractères (wordings)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ne pas dépasser les limites, sinon le texte est tronqué et la lecture
              est altérée. Un bouton « Voir plus » peut apparaître.
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Marges de sécurité (Stories/Reels)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Les formats verticaux et stories sont sensibles aux marges. Éviter les
              éléments importants (texte/image) dans ces zones pour garantir la
              lisibilité.
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Schéma: Limites de caractères</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ImagePlaceholder />
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Formats: images & vidéos</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ImagePlaceholder />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Onglet 2: Limitations LinkedIn */}
      <TabsContent value="limitations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Groupes publicitaires</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Impossible de mixer les différents groupes publicitaires dans une même
              campagne. Maximum 2 groupes (standard ou carrousel) par campagne.
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Format vertical (déprécié)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Le format vertical est déprécié sur LinkedIn (date indiquée sur le
              document de référence). Nous ne réalisons plus ce format.
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Limites de caractères</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Exemples (à titre indicatif, selon placements):
              <ul className="list-disc ml-5 mt-2">
                <li>Texte principal: 150 caractères max</li>
                <li>Titre: 70 caractères max (45 pour carrousel)</li>
                <li>Description: 70 caractères max + bloc CTA</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Livrables — groupe standard</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong className="text-sm">Média minimum obligatoires</strong>
                <ul className="list-disc ml-5 mt-1">
                  <li>1 visuel image et/ou vidéo décliné en 2 formats (carré, horizontal)</li>
                  <li>2 groupes recommandés (standard ou carrousel)</li>
                </ul>
              </div>
              <div>
                <strong className="text-sm">Wording minimum obligatoires</strong>
                <ul className="list-disc ml-5 mt-1">
                  <li>1 texte principal</li>
                  <li>1 titre</li>
                  <li>1 CTA</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Livrables — carrousel</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground space-y-2">
              <div>
                <strong className="text-sm">Média minimum obligatoires</strong>
                <ul className="list-disc ml-5 mt-1">
                  <li>2 visuels image et/ou vidéo au format carré</li>
                  <li>De 2 à 10 vignettes (recommandé: 2 groupes)</li>
                </ul>
              </div>
              <div>
                <strong className="text-sm">Wording minimum obligatoires</strong>
                <ul className="list-disc ml-5 mt-1">
                  <li>1 texte principal</li>
                  <li>2+ titres (selon le nombre de vignettes)</li>
                  <li>1 CTA</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Encart visuel — groupements</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ImagePlaceholder label="Ajouter votre image (schéma groupes publicitaires)" />
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Onglet 3: Restrictions et conformité */}
      <TabsContent value="restrictions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-red-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Mentions & conformité (FR)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Fournir les mentions légales/conditions lorsque requis. Respecter les
              lois locales et les politiques publicitaires LinkedIn.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Qualité des visuels</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Éviter les visuels trompeurs, éléments d’interface factices (faux CTA,
              faux pointeur), contenus choquants ou promesses irréalistes.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Propriété intellectuelle</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Utiliser uniquement des contenus dont vous détenez les droits/licences.
              Ne pas utiliser des marques/logos tiers sans autorisation.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader className={cardHeaderClass}>
              <CardTitle className={cardTitleClass}>Encart visuel — formats LinkedIn</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <ImagePlaceholder label="Ajouter votre image (exemples formats LI)" />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </Tabs>
  )
}


