export type StudioTarifsSectionId = 'video' | 'fixe' | 'graphisme'

export type StudioTarifsRowKind = 'priced' | 'on_demand'

export type StudioTarifsRow = {
  id: string
  sectionId: StudioTarifsSectionId
  label: string
  variant?: string
  defaultQuantity?: number
  explanation: string
  /** Tarif HT unitaire — absent pour les lignes « sur demande ». */
  rateHT?: number
  /** Texte affiché dans la colonne Tarif unitaire (HT) pour les lignes sur demande. */
  rateLabel?: string
  conditions?: string
  /** Texte affiché dans Prix de vente pour les lignes sur demande. */
  onDemandPriceNote?: string
  kind: StudioTarifsRowKind
  /** Exclu du sous-total I (SUM H7:H38) — Conception / Tournage / Montage. */
  excludeFromSubtotalI?: boolean
  /** Formule spéciale PSD : (tarif × qté) + 20 % du sous-total I. */
  psdSurcharge?: boolean
}

export const STUDIO_TARIFS_VALIDATION_NOTE =
  '3 A/R validation inclus systématiquement'

export const STUDIO_TARIFS_SECTIONS: { id: StudioTarifsSectionId; label: string }[] = [
  { id: 'video', label: 'Créa - Vidéo' },
  { id: 'graphisme', label: 'Graphisme' },
  { id: 'fixe', label: 'Créa - Fixe' },
]

/** Grille extraite de « VALIDÉE Nouvelle grille PDV studio » (Numbers). */
export const STUDIO_TARIFS_ROWS: StudioTarifsRow[] = [
  {
    id: 'conception-redaction',
    sectionId: 'video',
    label: 'Conception-rédaction',
    explanation: '',
    rateLabel: 'Faire demande approche budgétaire (clic possible pour envoie)',
    conditions: 'Sur demande au studio',
    onDemandPriceNote: 'Faire demande approche budgétaire (clic possible pour envoie)',
    kind: 'on_demand',
    excludeFromSubtotalI: true,
  },
  {
    id: 'tournage',
    sectionId: 'video',
    label: 'Tournage',
    explanation: '',
    rateLabel: 'Faire demande approche budgétaire (clic possible pour envoie)',
    conditions: 'Sur demande au studio',
    onDemandPriceNote: 'Faire demande approche budgétaire (clic possible pour envoie)',
    kind: 'on_demand',
    excludeFromSubtotalI: true,
  },
  {
    id: 'montage',
    sectionId: 'video',
    label: 'Montage',
    explanation: '',
    rateLabel: 'Faire demande approche budgétaire (clic possible pour envoie)',
    conditions: 'Sur demande au studio',
    onDemandPriceNote: 'Faire demande approche budgétaire (clic possible pour envoie)',
    kind: 'on_demand',
    excludeFromSubtotalI: true,
  },
  {
    id: 'pack-motion-design',
    sectionId: 'video',
    label: 'Pack motion design',
    explanation: 'Court et simple - Réalisé en interne - Peut être utilisé en paid',
    rateHT: 4000,
    conditions: '30 sec max',
    kind: 'priced',
  },
  {
    id: 'tourne-monte-aftermovie',
    sectionId: 'video',
    label: 'Tourné monté / Aftermovie',
    variant: '(⚠️ Pas de paid)',
    explanation: 'Livré dans les 3 jours ouvrés',
    rateHT: 995,
    conditions: '1 min max - 1 format - ⚠ forfait déplacement en supp',
    kind: 'priced',
  },
  {
    id: 'tourne-monte-paid',
    sectionId: 'video',
    label: 'Tourné monté / Aftermovie',
    variant: 'Paid inclus',
    explanation: 'Livré dans les 3 jours ouvrés',
    rateHT: 1225,
    conditions: '30 sec max - 3 formats - ⚠ forfait déplacement en supp',
    kind: 'priced',
  },
  {
    id: 'smartphilm-unit',
    sectionId: 'video',
    label: 'Smartphilm (⚠️ Pas de paid)',
    variant: 'Unité',
    explanation: 'Vous tournez, nous montons pour votre CM (⚠️ Pas de paid)',
    rateHT: 379,
    conditions:
      '1 format web, 1 min max, brief détaillé avec time code du client, 3 min de dérush max',
    kind: 'priced',
  },
  {
    id: 'smartphilm-pack10-nopaid',
    sectionId: 'video',
    label: 'Smartphilm (⚠️ Pas de paid)',
    variant: 'Pack 10',
    explanation: 'À consommer sur 1 an MAX',
    rateHT: 2900,
    conditions:
      '1 format web, 1 min max, brief détaillé avec time code du client, 5 min de dérush max',
    kind: 'priced',
  },
  {
    id: 'smartphilm-paid-unit',
    sectionId: 'video',
    label: 'Smartphilm (PAID inclus)',
    variant: 'Unité',
    explanation: 'Vous tournez, nous montons',
    rateHT: 579,
    conditions:
      '3 formats web, 30 sec max, brief détaillé avec time code du client, 3 min de dérush max',
    kind: 'priced',
  },
  {
    id: 'smartphilm-paid-pack10',
    sectionId: 'video',
    label: 'Smartphilm (PAID inclus)',
    variant: 'Pack 10',
    explanation: 'À consommer sur 1 an MAX',
    rateHT: 3900,
    conditions:
      '3 formats web, 30 sec max, brief détaillé avec time code du client, 5 min de dérush max',
    kind: 'priced',
  },
  {
    id: 'animation-visuels',
    sectionId: 'video',
    label: 'Animation de visuels',
    defaultQuantity: 1,
    explanation:
      'Animation d’un visuel fixe/caroussel déjà validé (ne peut être vendu seul)',
    rateHT: 250,
    conditions: 'Vendue avec une mise au format ou création complète',
    kind: 'priced',
  },
  {
    id: 'remontage-teaser',
    sectionId: 'video',
    label: 'Remontage teaser',
    explanation: 'Teaser d’une vidéo longue tournée par Link',
    rateHT: 995,
    conditions: '30 sec max, 3 formats',
    kind: 'priced',
  },
  {
    id: 'audio-spot',
    sectionId: 'video',
    label: 'Audio',
    variant: 'Création spot audio',
    explanation: 'écriture + droits pour une campagne de diff',
    rateHT: 780,
    conditions: 'Voix off féminine imposée',
    kind: 'priced',
  },
  {
    id: 'audio-identite',
    sectionId: 'video',
    label: 'Audio',
    variant: 'Création identité sonore',
    explanation: 'composition musicale sur mesure',
    rateHT: 3000,
    conditions:
      'jingle, logo sonore, signature sonore, intro/outro d’un podcast, voix de marque…',
    kind: 'priced',
  },
  {
    id: 'mise-au-format',
    sectionId: 'fixe',
    label: 'Mise au format',
    defaultQuantity: 1,
    explanation: "Mise au format d'un visuel source (PSD / Ai / Affiche)",
    rateHT: 200,
    conditions: 'Média fourni par le client',
    kind: 'priced',
  },
  {
    id: 'creation-complete',
    sectionId: 'fixe',
    label: 'Création complète',
    defaultQuantity: 1,
    explanation:
      'Création originale avec juste des photos et/ou une charte graphique et/ou des typos',
    rateHT: 490,
    kind: 'priced',
  },
  {
    id: 'mix-iab-avec-crea',
    sectionId: 'fixe',
    label: 'Programmatique / mix IAB',
    variant: 'Avec créa client',
    explanation: '6 formats Mix IAB spécifiques sur média',
    rateHT: 600,
    conditions: 'Média fourni par le client',
    kind: 'priced',
  },
  {
    id: 'mix-iab-sans-crea',
    sectionId: 'fixe',
    label: 'Programmatique / mix IAB',
    variant: 'Sans créa client',
    explanation: '6 formats Mix IAB spécifiques sur média',
    rateHT: 800,
    kind: 'priced',
  },
  {
    id: 'achat-art-rs',
    sectionId: 'fixe',
    label: 'Achat d’art',
    explanation: 'Recherche sur banque d’image et achat du média',
    rateHT: 30,
    conditions: 'Pour les RS uniquement',
    kind: 'priced',
  },
  {
    id: 'identite-complete',
    sectionId: 'graphisme',
    label: 'Identité et territoire de marque',
    variant: 'Identité complète (Logo + Territoire de marque + Charte graphique)',
    explanation:
      "Logo (.ai) + Planche d'éléments + Charte graphique\nLogo : Fichier original inclus (.ai)\nTerritoire de marque : Planches d'éléments du territoire de marque (.ai) + Typographie\nCharte graphique : Fichier PDF de 3 pages minimum",
    rateLabel:
      'Faire demande approche budgétaire (clic possible pour envoie) à partir de 3 100 €',
    conditions: 'Sur demande au studio\nÀ partir de 4 680 €',
    onDemandPriceNote: 'Faire demande approche budgétaire (clic possible pour envoie)',
    kind: 'on_demand',
  },
  {
    id: 'logo-simple',
    sectionId: 'graphisme',
    label: 'Identité et territoire de marque',
    variant: 'Logo simple',
    explanation:
      'Un logo utilisable en impression et en digital\nFichier original inclus (.ai)',
    rateLabel: 'Faire demande approche budgétaire (clic possible pour envoie)',
    conditions: 'Sur demande au studio\nÀ partir de 1 560 €',
    onDemandPriceNote: 'Faire demande approche budgétaire (clic possible pour envoie)',
    kind: 'on_demand',
  },
  {
    id: 'territoire-simple',
    sectionId: 'graphisme',
    label: 'Identité et territoire de marque',
    variant:
      'Territoire de marque simple (Couleurs, Typographie, Identité de marque)',
    explanation:
      "Un choix de typographies, de couleurs et d'éléments identititaires.\nPlanches d'éléments du territoire de marque (.ai) + Typographies (droits non inclus)",
    conditions: 'Sur demande au studio\nÀ partir de 1 560 €',
    kind: 'on_demand',
  },
  {
    id: 'achat-art-print',
    sectionId: 'graphisme',
    label: 'achat d’art (print) et plus de 500 000 exp.',
    explanation:
      'Recherche sur banque d’image et achat du média pour des supports autre que digital',
    rateHT: 269,
    kind: 'priced',
  },
  {
    id: 'retouche-image',
    sectionId: 'graphisme',
    label: 'Retouche d’image après shooting',
    explanation: "Retouche d'une image issue d'un shooting photos",
    rateHT: 390,
    kind: 'priced',
  },
  {
    id: 'print-affiche',
    sectionId: 'graphisme',
    label: 'Print',
    variant: 'Affiche ou Flyer ou Roll-up (Flamme - Oriflamme)',
    explanation: "En version prête pour l'impression",
    rateHT: 780,
    kind: 'priced',
  },
  {
    id: 'print-depliant',
    sectionId: 'graphisme',
    label: 'Print',
    variant: 'dépliant (2/3 volets)',
    explanation: "Affiche ou un dépliant en version prête pour l'impression",
    rateHT: 1560,
    kind: 'priced',
  },
  {
    id: 'print-kit-papeterie',
    sectionId: 'graphisme',
    label: 'Print',
    variant: 'Kit papeterie entreprise',
    explanation: 'Carte de visite + Papier en-tête + tampons',
    rateHT: 1170,
    kind: 'priced',
  },
  {
    id: 'habillage-rs',
    sectionId: 'graphisme',
    label: 'Habillage',
    variant: 'RS',
    explanation: 'Photo de profil + Photo de couverture',
    rateHT: 150,
    kind: 'priced',
  },
  {
    id: 'habillage-youtube-bandeau',
    sectionId: 'graphisme',
    label: 'Habillage',
    variant: 'Youtube',
    explanation: 'Bandeau + Photo de profil',
    rateHT: 150,
    kind: 'priced',
  },
  {
    id: 'habillage-youtube-vignette',
    sectionId: 'graphisme',
    label: 'Habillage',
    variant: 'Youtube',
    explanation: 'Vignette vidéo',
    rateHT: 150,
    kind: 'priced',
  },
  {
    id: 'template-email',
    sectionId: 'graphisme',
    label: 'Template d’E-mail',
    explanation: 'Image à intégrer dans un e-mail',
    rateHT: 195,
    kind: 'priced',
  },
  {
    id: 'vente-psd',
    sectionId: 'graphisme',
    label: "Vente d'un fichier PSD complet",
    defaultQuantity: 3,
    explanation: 'Vente du PSD complet pour exploitation par le client',
    rateHT: 1000,
    kind: 'priced',
    psdSurcharge: true,
  },
]

export type StudioTarifsSelectionState = Record<
  string,
  { selected: boolean; quantity: string }
>

export function createInitialStudioTarifsState(): StudioTarifsSelectionState {
  const state: StudioTarifsSelectionState = {}
  for (const row of STUDIO_TARIFS_ROWS) {
    state[row.id] = {
      selected: false,
      quantity:
        row.defaultQuantity !== undefined ? String(row.defaultQuantity) : '',
    }
  }
  return state
}

export function parseStudioQuantity(raw: string): number {
  const normalized = raw.trim().replace(/\s/g, '').replace(',', '.')
  if (!normalized) return 0
  const value = Number.parseFloat(normalized)
  if (!Number.isFinite(value) || value < 0) return 0
  return value
}

/** Ligne tarifée standard : cochée × (tarif HT × quantité). */
export function computeStandardLinePrice(
  selected: boolean,
  rateHT: number,
  quantity: number,
): number {
  if (!selected || quantity <= 0) return 0
  return rateHT * quantity
}

/** Sous-total I — équivalent SUM(H7:H38), hors Conception/Tournage/Montage et hors PSD. */
export function computeSubtotalI(
  rows: StudioTarifsRow[],
  state: StudioTarifsSelectionState,
): number {
  let total = 0
  for (const row of rows) {
    if (row.kind !== 'priced' || row.excludeFromSubtotalI || row.psdSurcharge) continue
    const entry = state[row.id]
    if (!entry?.selected || row.rateHT === undefined) continue
    total += computeStandardLinePrice(
      true,
      row.rateHT,
      parseStudioQuantity(entry.quantity),
    )
  }
  return total
}

export type StudioTarifsComputedLine = {
  row: StudioTarifsRow
  selected: boolean
  quantity: number
  linePrice: number
}

export function computeStudioTarifsGrid(
  state: StudioTarifsSelectionState,
): {
  lines: StudioTarifsComputedLine[]
  subtotalI: number
  subtotalJ: number
  ttc: number
  selectedCount: number
} {
  const subtotalI = computeSubtotalI(STUDIO_TARIFS_ROWS, state)
  const lines: StudioTarifsComputedLine[] = []
  let subtotalJ = 0
  let selectedCount = 0

  for (const row of STUDIO_TARIFS_ROWS) {
    const entry = state[row.id] ?? { selected: false, quantity: '' }
    const selected = entry.selected
    const quantity = parseStudioQuantity(entry.quantity)

    if (selected) selectedCount++

    let linePrice = 0
    if (row.kind === 'priced' && row.rateHT !== undefined) {
      if (row.psdSurcharge) {
        // Formule Numbers : $A39 × ((F39 × $D39) + (I4 × 0.2))
        const base = computeStandardLinePrice(selected, row.rateHT, quantity)
        linePrice = selected ? base + subtotalI * 0.2 : 0
      } else {
        linePrice = computeStandardLinePrice(selected, row.rateHT, quantity)
      }
      subtotalJ += linePrice
    }

    lines.push({ row, selected, quantity, linePrice })
  }

  return {
    lines,
    subtotalI,
    subtotalJ,
    ttc: subtotalJ * 1.2,
    selectedCount,
  }
}

export function formatStudioEuro(value: number): string {
  return `${value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} €`
}

export function formatStudioPrestationLabel(row: StudioTarifsRow): string {
  if (row.variant) return `${row.label} — ${row.variant}`
  return row.label
}
