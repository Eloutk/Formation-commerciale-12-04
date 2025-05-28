"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search } from "lucide-react"

// Définition de l'interface pour les termes du glossaire
interface GlossaryTerm {
  id: string
  term: string
  definition: string
  category: string
}

// Données du glossaire
const glossaryTerms: GlossaryTerm[] = [
  {
    id: "ab-testing",
    term: "A/B Testing",
    definition:
      "Méthode de test consistant à présenter deux versions différentes d'une page web, d'une annonce ou d'un email à deux groupes d'utilisateurs pour déterminer quelle version génère les meilleurs résultats.",
    category: "A",
  },
  {
    id: "audience",
    term: "Audience",
    definition:
      "Ensemble des personnes qui peuvent être atteintes par une campagne publicitaire. L'audience peut être définie par des critères démographiques, géographiques, comportementaux ou d'intérêts.",
    category: "A",
  },
  {
    id: "api",
    term: "API",
    definition:
      "API  : L'API Conversion de Meta est une technologie avancée de suivi publicitaire qui complète (et renforce) le pixel classique. Contrairement au pixel qui repose uniquement sur le navigateur, l'API Conversion fonctionne côté serveur, ce qui permet de remonter des événements plus fiables et plus complets, même si l'utilisateur refuse les cookies ou utilise un bloqueur.\nCette API agit en parallèle du pixel, et ensemble, ils permettent :\nun meilleur suivi des conversions (clics, achats, inscriptions…)\nune mesure plus précise du comportement des internautes après le clic sur la publicité)\nune meilleure performance de l'algorithme Meta grâce à des données plus complètes.\n👉 Concrètement, dès qu'un internaute clique sur une publicité Meta, l'API Conversion permet d'envoyer directement à Meta les actions qu'il effectue sur le site (ex. : vue d'un produit, ajout au panier, achat), même si le pixel seul ne les capte pas.",
    category: "A",
  },
  {
    id: "clic",
    term: "Clic",
    definition:
      "Tout clic autour de la publicité (clics vers landing page, j'aime, commentaires, enregistrement de la pub, partages, etc...)",
    category: "C",
  },
  {
    id: "clic-sur-lien",
    term: "Clic sur lien",
    definition: "Uniquement les clics vers la landing page",
    category: "C",
  },
  {
    id: "cta-call-to-action",
    term: "CTA/call to action",
    definition:
      "Appel à l'action auprès de l'internaute, généralement un bouton situé aux abords de la publicité (acheter, s'inscrire, en savoir plus, etc...)",
    category: "C",
  },
  {
    id: "couverture",
    term: "Couverture",
    definition: "Nombre de personnes qui ont vu la publicité",
    category: "C",
  },
  {
    id: "cpc",
    term: "CPC (Coût Par Clic)",
    definition:
      "Modèle de tarification publicitaire où l'annonceur paie uniquement lorsqu'un utilisateur clique sur son annonce. Le CPC est calculé en divisant le coût total de la campagne par le nombre de clics.",
    category: "C",
  },
  {
    id: "ctr",
    term: "CTR (Click-Through Rate)",
    definition:
      "Taux de clics, exprimé en pourcentage, qui mesure le nombre de clics sur une annonce divisé par le nombre d'impressions. Un CTR élevé est généralement un signe de pertinence et d'efficacité de l'annonce.",
    category: "C",
  },
  {
    id: "ctr-sur-lien",
    term: "CTR sur lien",
    definition: "Le CTR sur lien mesure uniquement le pourcentage de personnes ayant cliqué sur le lien principal de la publicité (vers la landing page), par rapport au nombre d'impressions. Il se distingue du CTR global qui inclut tous les clics (j'aime, partages, etc.).",
    category: "C",
  },
  {
    id: "ctr-plusieurs",
    term: "CTR (plusieurs)",
    definition:
      "Click Through Rate - Taux de clics : il en existe plusieurs : CTR Total / CTR sur lien. C'est le taux de clic (X% du temps, un internaute qui voit la pub clique)...",
    category: "C",
  },
  {
    id: "conversion",
    term: "Conversion",
    definition:
      "Action spécifique effectuée par un utilisateur qui répond à l'objectif marketing défini, comme un achat, une inscription à une newsletter, ou le téléchargement d'un document.",
    category: "C",
  },
  {
    id: "cpa",
    term: "CPA (Coût Par Acquisition)",
    definition:
      "Métrique qui mesure le coût moyen pour acquérir un client ou générer une conversion. Calculé en divisant le coût total de la campagne par le nombre d'acquisitions ou de conversions.",
    category: "C",
  },
  {
    id: "cpm",
    term: "CPM (Coût Pour Mille)",
    definition:
      "Modèle de tarification publicitaire où l'annonceur paie pour mille impressions de son annonce, indépendamment des clics ou des conversions générés.",
    category: "C",
  },
  {
    id: "impression",
    term: "Impression",
    definition: "Nombre de fois où la pub s'est affichée à l'écran",
    category: "I",
  },
  {
    id: "interaction-publication",
    term: "Interaction publication",
    definition:
      "Les interactions reprennent tout ce qui se passe autour de nos publications (clics, enregistrements, partages, j'aimes, etc...)",
    category: "I",
  },
  {
    id: "kpi",
    term: "KPI (Key Performance Indicator)",
    definition:
      "Indicateur clé de performance utilisé pour mesurer l'efficacité d'une action marketing par rapport aux objectifs fixés. Les KPI courants incluent le taux de conversion, le coût par acquisition, et le retour sur investissement publicitaire.",
    category: "K",
  },
  {
    id: "landing-page",
    term: "Landing Page",
    definition:
      "URL de redirection des publicités. Page web spécifique sur laquelle un utilisateur arrive après avoir cliqué sur une annonce ou un lien. Elle est conçue pour encourager une action spécifique, comme un achat ou une inscription.",
    category: "L",
  },
  {
    id: "lead",
    term: "Lead",
    definition:
      "Client potentiel ayant un intérêt qu'il manifeste par le remplissage d'un formulaire sur site ou directement sur META.",
    category: "L",
  },
  {
    id: "pixel",
    term: "Pixel",
    definition:
      "Élément de tracking. Il permet de remonter les infos du comportement des utilisateurs du site web vers META. Il peut remonter différentes informations (inscription à la newsletter, envoi de formulaire de contact, ajout au panier, achat, etc...). Cela est très important pour comprendre comment les internautes se comportent une fois qu'ils ont cliqué sur nos publicités et arrivent sur le site web du client. Il est indispensable pour les campagnes de conversion. Il peut être déjà posé sur le site, auquel cas nous aurons besoin des accès. Il est également possible qu'il n'y en ait pas. Dans ce cas, nous créons et envoyons les instruction (de META) pour la pose de ce dernier.",
    category: "P",
  },
  {
    id: "repetition",
    term: "Répétition",
    definition: "Nombre de fois (moyen) où une seule personne a vu la publicité",
    category: "R",
  },
  {
    id: "reaction-publication",
    term: "Réactions",
    definition: "Ensemble des réactions possibles sur une publication (J'aime, J'adore, Haha, Wouah, Triste, Grr, etc.)",
    category: "R",
  },
  {
    id: "roi",
    term: "ROI (Return On Investment)",
    definition:
      "Retour sur investissement, mesure le bénéfice ou la perte générée par un investissement par rapport à son coût initial. En marketing digital, il aide à évaluer l'efficacité des campagnes et à optimiser les budgets.",
    category: "R",
  },
  {
    id: "remarketing",
    term: "Remarketing (retargeting)",
    definition:
      "Technique publicitaire (aussi appelée retargeting) qui permet de cibler les utilisateurs qui ont déjà interagi avec votre site web ou application. Le remarketing vise à reconvertir les visiteurs qui n'ont pas complété une action lors de leur première visite.",
    category: "R",
  },
  {
    id: "roas",
    term: "ROAS (Return On Ad Spend)",
    definition:
      "Métrique qui mesure le revenu généré pour chaque euro dépensé en publicité. Un ROAS de 5:1 signifie que vous gagnez 5€ pour chaque euro dépensé en publicité.",
    category: "R",
  },
  {
    id: "sea",
    term: "SEA (Search Engine Advertising)",
    definition:
      "Publicité sur les moteurs de recherche, méthode de marketing digital qui consiste à acheter des annonces payantes qui apparaissent dans les résultats des moteurs de recherche, généralement via des plateformes comme Google Ads.",
    category: "S",
  },
  {
    id: "seo",
    term: "SEO (Search Engine Optimization)",
    definition:
      "Optimisation pour les moteurs de recherche, ensemble de techniques visant à améliorer le positionnement d'un site web dans les résultats organiques (non payants) des moteurs de recherche.",
    category: "S",
  },
  {
    id: "score-qualite",
    term: "Score Qualité",
    definition:
      "Évaluation attribuée par les plateformes publicitaires (comme Google Ads) à vos annonces et mots-clés, basée sur leur pertinence, leur taux de clics attendu et l'expérience de la page de destination. Un score qualité élevé peut réduire le coût par clic et améliorer le positionnement des annonces.",
    category: "S",
  },
  {
    id: "vue-youtube",
    term: "Vue Youtube (2 possibilités)",
    definition:
      "Cas 1 : La vidéo dure -30 sec. Dans ce cas une vue est une personne qui a regardé la vidéo en entier. Cas 2 : La vidéo dure +30 sec. Dans ce cas une vue est une personne qui a regardé au moins les 30 premières secondes.",
    category: "V",
  },
  {
    id: "wording",
    term: "Wording",
    definition: "Textes insérés aux abords des visuels (description, titre, etc)",
    category: "W",
  },
  {
    id: "sem",
    term: "SEM (Search Engine Marketing)",
    definition: "Le SEM regroupe l'ensemble des techniques visant à améliorer la visibilité d'un site sur les moteurs de recherche, en combinant le SEO (référencement naturel), le SEA (publicité payante) et le SMO (optimisation sur les réseaux sociaux).",
    category: "S",
  },
  {
    id: "smo",
    term: "SMO (Social Media Optimization)",
    definition: "Le SMO consiste à optimiser la présence et la visibilité d'une marque sur les réseaux sociaux (Facebook, Instagram, LinkedIn, TikTok, etc.), de manière organique (non payante).",
    category: "S",
  },
]

export default function GlossairePage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeFilter, setActiveFilter] = useState("Tous")

  // Filtrer les termes en fonction de la recherche et du filtre actif
  const filteredTerms = glossaryTerms.filter((term) => {
    const matchesSearch =
      term.term.toLowerCase().includes(searchTerm.toLowerCase()) ||
      term.definition.toLowerCase().includes(searchTerm.toLowerCase())

    if (activeFilter === "Tous") {
      return matchesSearch
    } else {
      return (
        matchesSearch &&
        ((activeFilter === "A-E" && "ABCDE".includes(term.category)) ||
          (activeFilter === "F-M" && "FGHIJKLM".includes(term.category)) ||
          (activeFilter === "N-Z" && "NOPQRSTUVWXYZ".includes(term.category)))
      )
    }
  })

  // Regrouper les termes par catégorie
  const groupedTerms = filteredTerms.reduce(
    (acc, term) => {
      if (!acc[term.category]) {
        acc[term.category] = []
      }
      acc[term.category].push(term)
      return acc
    },
    {} as Record<string, GlossaryTerm[]>,
  )

  // Trier les catégories alphabétiquement
  const sortedCategories = Object.keys(groupedTerms).sort()

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Glossaire</h1>
        <p className="text-muted-foreground mb-8">Lexique des termes utilisés en marketing digital</p>

        <div className="relative mb-8">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Rechercher un terme..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          {["Tous", "A-E", "F-M", "N-Z"].map((filter) => (
            <Badge
              key={filter}
              variant={activeFilter === filter ? "default" : "outline"}
              className="flex justify-center items-center py-2 cursor-pointer hover:bg-muted"
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </Badge>
          ))}
        </div>

        {filteredTerms.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">Aucun terme ne correspond à votre recherche.</div>
        ) : (
          <div className="space-y-8">
            {sortedCategories.map((category) => (
              <section key={category}>
                <h2 className="text-2xl font-bold mb-4">{category}</h2>
                {groupedTerms[category].map((term) => (
                  <Card key={term.id} className="mb-4">
                    <CardHeader>
                      <CardTitle>{term.term}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p>{term.definition}</p>
                    </CardContent>
                  </Card>
                ))}
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

