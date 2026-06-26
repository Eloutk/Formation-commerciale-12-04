export type GlossaryTerm = {
  id: string
  term: string
  definition: string
  category: string
}

export const GLOSSARY_TERMS: GlossaryTerm[] = [
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
    id: "conversion",
    term: "Conversion",
    definition:
      "Action souhaitée effectuée par un utilisateur après avoir cliqué sur une publicité (achat, inscription, téléchargement, etc.). Le taux de conversion mesure le pourcentage de visiteurs qui effectuent cette action.",
    category: "C",
  },
  {
    id: "cpc",
    term: "CPC (Coût Par Clic)",
    definition:
      "Métrique publicitaire indiquant le coût moyen payé pour chaque clic sur une annonce. Le CPC est calculé en divisant le coût total de la campagne par le nombre de clics générés.",
    category: "C",
  },
  {
    id: "cpm",
    term: "CPM (Coût Par Mille)",
    definition:
      "Métrique publicitaire indiquant le coût payé pour 1000 impressions (affichages) d'une annonce. Le CPM est utilisé pour comparer l'efficacité de différentes campagnes en termes de visibilité.",
    category: "C",
  },
  {
    id: "ctr",
    term: "CTR (Click-Through Rate)",
    definition:
      "Taux de clics exprimé en pourcentage, calculé en divisant le nombre de clics par le nombre d'impressions. Un CTR élevé indique que l'annonce est pertinente et attrayante pour l'audience ciblée.",
    category: "C",
  },
  {
    id: "display",
    term: "Display",
    definition:
      "Format publicitaire visuel (bannières, images, vidéos) diffusé sur des sites web partenaires. Le display permet de toucher une large audience et de renforcer la notoriété de marque.",
    category: "D",
  },
  {
    id: "funnel",
    term: "Funnel (Entonnoir)",
    definition:
      "Modèle marketing représentant le parcours client depuis la prise de conscience jusqu'à l'achat. Chaque étape de l'entonnoir correspond à un niveau d'engagement croissant avec la marque.",
    category: "F",
  },
  {
    id: "impression",
    term: "Impression",
    definition: "Nombre de fois où la pub s'est affichée à l'écran",
    category: "I",
  },
  {
    id: "infos-bulles",
    term: "Infos bulles",
    definition:
      "Les infos bulles sont des accroches. Elles permettent d'afficher du texte supplémentaire sur certains aspects populaires ou uniques de votre entreprise dans votre annonce. Vous pouvez ainsi mettre en avant des offres promotionnelles comme \"livraison gratuite\" ou \"service client 24h/24, 7j/7\".",
    category: "I",
  },
  {
    id: "images-search",
    term: "Images Search",
    definition:
      "Format publicitaire spécifique aux moteurs de recherche (Google, Bing) qui affiche des images dans les résultats de recherche. Ces annonces apparaissent dans l'onglet 'Images' et permettent d'attirer l'attention visuellement tout en ciblant des requêtes spécifiques.",
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
      "Page web spécialement conçue pour recevoir le trafic provenant d'une campagne publicitaire. Elle est optimisée pour convertir les visiteurs en prospects ou clients en présentant une offre claire et un appel à l'action visible.",
    category: "L",
  },
  {
    id: "liens-annexes",
    term: "Liens annexes",
    definition:
      "Les liens annexes ajoutent à votre annonce des liens hypertextes supplémentaires qui redirigent les utilisateurs vers des pages spécifiques de votre site Web. Ces liens sont situés en dessous des descriptions et infos bulles. Les liens annexes doivent s'accompagner d'une description. Il s'agit d'informations supplémentaires positionnées sous les liens annexes. Cela permet aux internautes de savoir à quoi s'attendre s'ils cliquent dessus. Les liens annexes correspondent à des rubriques de votre site.",
    category: "L",
  },
  {
    id: "lookalike",
    term: "Lookalike",
    definition:
      "Technique de ciblage publicitaire qui consiste à créer une audience similaire à une audience source (clients existants, visiteurs du site). Les plateformes utilisent des algorithmes pour identifier des utilisateurs ayant des caractéristiques similaires.",
    category: "L",
  },
  {
    id: "pixel",
    term: "Pixel",
    definition:
      "Petit code JavaScript placé sur un site web pour suivre les actions des visiteurs et mesurer l'efficacité des campagnes publicitaires. Le pixel permet de créer des audiences personnalisées et d'optimiser les campagnes.",
    category: "P",
  },
  {
    id: "remarketing",
    term: "Remarketing",
    definition:
      "Technique publicitaire consistant à cibler à nouveau les utilisateurs qui ont déjà visité un site web ou interagi avec une marque, mais n'ont pas effectué l'action souhaitée (achat, inscription, etc.).",
    category: "R",
  },
  {
    id: "roas",
    term: "ROAS (Return on Ad Spend)",
    definition:
      "Métrique mesurant le retour sur investissement publicitaire, calculée en divisant le chiffre d'affaires généré par le coût des publicités. Un ROAS de 4:1 signifie que chaque euro investi en publicité génère 4 euros de revenus.",
    category: "R",
  },
  {
    id: "seo",
    term: "SEO (Search Engine Optimization)",
    definition:
      "Ensemble de techniques visant à améliorer la visibilité d'un site web dans les résultats de recherche organiques (non payants) des moteurs de recherche comme Google.",
    category: "S",
  },
  {
    id: "sea",
    term: "SEA (Search Engine Advertising)",
    definition:
      "Publicité payante sur les moteurs de recherche (Google Ads, Bing Ads). Contrairement au SEO, le SEA permet d'obtenir une visibilité immédiate en achetant des mots-clés pertinents.",
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
  {
    id: "titres-descriptions",
    term: "Titres et descriptions",
    definition:
      "Les titres et les descriptions sont affichés de manière aléatoire en fonction de la requête du client. Il est possible d'épingler 1 titre et 1 description pour rester affiché en première position.",
    category: "T",
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
]
