export type FaqItem = {
  question: string
  answer: string
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question:
      'Mon annonce Google Search ne remonte pas dans les premiers résultats de recherche, pourquoi ?',
    answer:
      "Le budget de la campagne n'est pas suffisant pour couvrir toutes les recherches dans la zone ciblée. Même avec des optimisations, il est impossible d'apparaître à chaque recherche pertinente sans un budget bien plus élevé.",
  },
  {
    question: 'Les stats GA4 ne sont pas les mêmes que les rapports des campagnes ? Pourquoi ?',
    answer:
      "Les différences viennent des méthodes de collecte :\n\nGA4 mesure les visites réelles sur le site, mais dépend de l'acceptation des cookies. Il peut donc manquer des données, surtout sur Google/YouTube où de nombreux utilisateurs ne sont pas connectés.\n\nLes plateformes publicitaires (Google Ads, Meta...) mesurent les interactions avec les pubs (clics, vues, conversions) et appliquent leurs propres modèles d'attribution, souvent plus complets mais moins transparents.\n\n👉 Résultat : GA4 peut afficher des stats plus faibles ou différentes, ce qui est normal.",
  },
  {
    question:
      "Est-il possible d'avoir un listing des principaux sites sur lesquels la publicité sera diffusée sur une campagne Display ?",
    answer:
      'Non, car les campagnes Display utilisent différents types de ciblage automatisé :\n\nAudience mots clés & sites web (ex. : mot clé "don de sang", site visité "20minutes.fr")\n\nAudience centres d\'intérêts (ex. : centre d\'intérêt "bien-être")\n\nPlacement par thème (ex. : thème "bénévolat")\n\nPlacement par mot clé (ex. : mot clé "voiture haut de gamme")\n\nPlacement site web (ex. : site spécifique comme "leboncoin.fr")\n\nLes publicités apparaissent selon les enchères gagnées, les centres d\'intérêts ou les habitudes de navigation de la cible.',
  },
  {
    question: 'Pourquoi le nom de ma marque génère-t-il autant de clics et non d\'autres mots clés ?',
    answer:
      "C'est une stratégie de SEA orientée branding.\n\nEnchérir sur sa propre marque permet de protéger sa visibilité contre les concurrents.\n\nCela renforce la notoriété et maîtrise le message visible sur son propre nom.\n\nCela peut dynamiser la campagne même si cela semble redondant.",
  },
]
