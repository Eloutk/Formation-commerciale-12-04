import {
  MOCKUP_HREF,
  MON_ESPACE_HREF,
  HOME_PAGE_2_HREF,
  STRATEGIE_SOCIAL_HREF,
  VENTE2_SMS_HREF,
  VENTE2_SOCIAL_HREF,
  VENTE2_STUDIO_TARIFS_HREF,
} from '@/lib/nav-config'

export type HomePage2Card = {
  id: string
  label: string
  description: string
  href: string
  /** Montrable au client (noir) vs usage interne (orange Link). */
  clientVisible: boolean
}

export type HomePage2Section = {
  id: string
  label: string
  cards: HomePage2Card[]
}

export { HOME_PAGE_2_HREF }

export const HOME_PAGE_2_SECTIONS: HomePage2Section[] = [
  {
    id: 'strategie',
    label: 'Stratégie',
    cards: [
      {
        id: 'plan-media',
        label: 'Plan Média',
        description: 'Préparer une stratégie de diffusion pour un besoin client',
        href: STRATEGIE_SOCIAL_HREF,
        clientVisible: true,
      },
      {
        id: 'cartographie',
        label: 'Cartographie',
        description:
          'Carte avec rayon, ville, département, région ou codes postaux et nombre d’habitants dans la zone',
        href: '/cartographie',
        clientVisible: true,
      },
      {
        id: 'retroplanning',
        label: 'Rétroplanning',
        description: 'Avoir un rétroplanning visuel et clair',
        href: '/strategie/retroplanning',
        clientVisible: true,
      },
    ],
  },
  {
    id: 'guides',
    label: 'Guides',
    cards: [
      {
        id: 'guides-studio',
        label: 'Studio',
        description: 'Guide des formats et contraintes contenu publicitaire',
        href: '/studio',
        clientVisible: true,
      },
      {
        id: 'guides-media',
        label: 'Média',
        description:
          'Dépôt des médias utilisés pour les pubs et bibliothèque médias',
        href: '/media',
        clientVisible: false,
      },
      {
        id: 'lexique',
        label: 'Lexique',
        description: 'Définitions utiles',
        href: '/glossaire',
        clientVisible: true,
      },
      {
        id: 'faq',
        label: 'FAQ',
        description: 'Questions souvent posées avec réponses',
        href: '/faq',
        clientVisible: true,
      },
      {
        id: 'documents',
        label: 'Documents',
        description: 'Tous les docs utiles',
        href: '/documents',
        clientVisible: false,
      },
      {
        id: 'tutos',
        label: 'Tutos',
        description: 'Tutoriels pour guider les actions clients',
        href: '/tuto',
        clientVisible: true,
      },
    ],
  },
  {
    id: 'academy',
    label: 'Academy',
    cards: [
      {
        id: 'diffusion',
        label: 'Diffusion',
        description: 'Module de formation / bibliothèque de connaissance métier',
        href: '/diffusion',
        clientVisible: true,
      },
      {
        id: 'chefferie',
        label: 'Chefferie de projet',
        description:
          'En cours de construction — formation dédiée aux chefs de projets',
        href: '/chefferie',
        clientVisible: false,
      },
    ],
  },
  {
    id: 'mon-espace',
    label: 'Mon espace',
    cards: [
      {
        id: 'espace-social',
        label: 'Social Média',
        description: 'Tarifs de vente des campagnes de pub',
        href: VENTE2_SOCIAL_HREF,
        clientVisible: false,
      },
      {
        id: 'espace-sms',
        label: 'SMS & RCS',
        description: 'Tarifs de vente des campagnes SMS / RCS',
        href: VENTE2_SMS_HREF,
        clientVisible: false,
      },
      {
        id: 'espace-studio',
        label: 'Studio',
        description: 'Tarif de vente du Studio',
        href: VENTE2_STUDIO_TARIFS_HREF,
        clientVisible: false,
      },
      {
        id: 'mockup',
        label: 'Mock-Up',
        description: 'Création de visuels dans l’univers des plateformes',
        href: MOCKUP_HREF,
        clientVisible: false,
      },
      {
        id: 'mes-projets',
        label: 'Mes projets',
        description: 'Stratégies et devis enregistrés',
        href: MON_ESPACE_HREF,
        clientVisible: false,
      },
    ],
  },
]
