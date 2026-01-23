"use client"

import * as React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function MetaRecommendationsTabs(): JSX.Element {
  return (
    <Tabs defaultValue="rappels" className="w-full">
      <TabsList className="grid grid-cols-1 md:grid-cols-3 gap-2 md:gap-4">
        <TabsTrigger value="rappels">Principales recommandations</TabsTrigger>
        <TabsTrigger value="limitations">Limitations de la plateforme</TabsTrigger>
        <TabsTrigger value="restrictions">Restrictions de la plateforme</TabsTrigger>
      </TabsList>

      {/* Onglet 1: Rappels généraux META */}
      <TabsContent value="rappels">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-yellow-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Logo et nom de marque</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Il n’est pas essentiel de mettre votre logo ou votre nom de marque sur le visuel.
              Sur META, ils sont déjà affichés via :
              <ul className="list-disc ml-5 mt-2">
                <li>votre photo de profil</li>
                <li>votre nom de page de diffusion</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Limites de caractères</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ne pas dépasser les limites de caractères pour les wordings. Dépasser
              ces limites peut tronquer le texte et empêcher sa lecture totale.
              Un bouton « Voir plus » peut apparaître.
              <div className="mt-2 text-xs text-muted-foreground">* wording = texte</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Marges de sécurité (Stories/Reels)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Les formats story et reels sont sensibles aux marges de sécurité. Ne
              pas placer d’éléments importants (texte ou image) dans ces zones ; ils
              pourraient être illisibles ou tronqués.
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">20% maximum de texte</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Respecter la limite de 20% de texte sur les visuels. Au‑delà, la
              diffusion et le score qualité peuvent être affectés.
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Emojis</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Ne pas utiliser trop d’emojis dans les wordings. L’usage de plus de 3
              emojis par wording (texte principal, titre et description inclus) est
              déconseillé.
            </CardContent>
          </Card>

          <Card className="border-yellow-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Majuscules, symboles, hashtags</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Éviter l’abus de majuscules, de symboles et de caractères spéciaux.
              Inutile d’insérer des hashtags dans les wordings pour les publicités META.
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Onglet 2: Limitations META */}
      <TabsContent value="limitations">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-orange-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Gestion automatique du contenu</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Concernant les publicités responsives : il est impossible d’empêcher la
              création automatique de combinaisons. Ces publicités sont issues de 3
              formats natifs. Les groupes publicitaires carrousels sont
              particulièrement exposés à cette génération automatique.
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">À propos des descriptions</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Si aucune description n’est rédigée, une description peut être générée
              automatiquement par META à partir du titre de la page web ou du titre
              de la landing page. Nous n’avons aucun contrôle sur ce point.
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">À propos des typographies</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Il est impossible de changer la taille, la couleur, l’organisation et
              la graisse des caractères typographiques sur les wordings META.
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">À propos des césures</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Il est impossible de décider les endroits où la césure des paragraphes
              s’applique. Cette gestion est automatique côté META.
            </CardContent>
          </Card>

          <Card className="border-orange-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Nom de page et photo de profil</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Impossible de modifier le nom et le logo affichés sur les publicités :
              ils proviennent de votre page META. La dernière vignette des carrousels
              affiche aussi votre photo de profil.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-[16px]">Ponctuation et style</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Un style direct et concis est recommandé. Éviter l'abus de
              ponctuation, les majuscules excessives et les formulations ambiguës.
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Onglet 3: Restrictions générales de création */}
      <TabsContent value="restrictions">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-red-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">À propos des CTA</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Impossible de personnaliser le bouton CTA au‑delà des propositions
              fournies par META. Les CTA peuvent différer selon l’objectif de
              campagne.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Visuels nuisant à l’expérience</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Interdiction d’afficher un faux bouton CTA ou un faux pointeur/curseur
              de souris sur les visuels. Cela peut conduire à la suspension de la
              campagne.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Propriété intellectuelle META</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Interdiction d’utiliser les logos des marques propriétaires META
              (Facebook, Instagram, WhatsApp) ou des éléments de réactions
              propriétaires (Like, Cœur, Colère) sur les visuels. La violation peut
              entraîner la suspension de la campagne.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Mentions légales (France)</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Pour chaque publicité, fournir les mentions et conditions obligatoires.
              Conserver les preuves de conformité. Respecter les lois locales et les
              politiques de META.
            </CardContent>
          </Card>

          <Card className="border-red-500/50 bg-white">
            <CardHeader>
              <CardTitle className="text-[16px]">Catégories spéciales META</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-muted-foreground">
              Certaines catégories sont soumises à des règles renforcées :
              <ul className="list-disc ml-5 mt-2">
                <li>Produits et services financiers</li>
                <li>Emploi et opportunités</li>
                <li>Immobilier et crédit</li>
                <li>Politique et sujets sociaux</li>
                <li>Dénomination précise des genres (H/F…)</li>
              </ul>
            </CardContent>
          </Card>

          
        </div>
      </TabsContent>
    </Tabs>
  )
}


