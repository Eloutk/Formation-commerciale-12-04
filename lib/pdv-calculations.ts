export type UnitCost = {
  cost: number
  perThousand: boolean
}

export const UNIT_COSTS: Record<string, Record<string, UnitCost>> = {
  META: {
    Impressions: { cost: 2.25, perThousand: true },
    Clics: { cost: 0.52, perThousand: false },
    'Clics sur lien': { cost: 0.736, perThousand: false },
    Leads: { cost: 70.4, perThousand: false },
  },
  'Insta only': {
    Impressions: { cost: 2.94, perThousand: true },
    Clics: { cost: 1.127, perThousand: false },
    'Clics sur lien': { cost: 1.239, perThousand: false },
  },
  Display: {
    Impressions: { cost: 2.552, perThousand: true },
    Clics: { cost: 0.823, perThousand: false },
  },
  Youtube: {
    Impressions: { cost: 5.28, perThousand: true },
  },
  LinkedIn: {
    Impressions: { cost: 19.8, perThousand: true },
    Clics: { cost: 7.25, perThousand: false },
    Leads: { cost: 560, perThousand: false },
  },
  Snapchat: {
    Impressions: { cost: 1.44, perThousand: true },
    Clics: { cost: 0.693, perThousand: false },
  },
  Tiktok: {
    Impressions: { cost: 2.376, perThousand: true },
    Clics: { cost: 0.552, perThousand: false },
  },
  Spotify: {
    Impressions: { cost: 9.68, perThousand: true },
  },
}

export interface PDVCalculation {
  platform: string
  objective: string
  aePercentage: number
  kpis?: number
  budget?: number
  price?: number
  calculatedKpis?: number
}

function getUnitCost(platform: string, objective: string): UnitCost | null {
  const byPlatform = UNIT_COSTS[platform]
  if (!byPlatform) return null
  const unit = byPlatform[objective]
  return unit ?? null
}

export function validateInputs(
  platform: string,
  objective: string,
  aePercentage: number,
  kpis?: number,
  budget?: number
): string | null {
  if (!platform || !objective) return 'Plateforme et objectif sont requis'
  const unit = getUnitCost(platform, objective)
  if (!unit) return 'Combinaison plateforme/objectif non supportée'
  // %AE est saisi comme 40 pour 40 %
  if (Number.isNaN(aePercentage) || aePercentage <= 0 || aePercentage > 100)
    return "Le % AE doit être entre 0 et 100 (ex: 40 pour 40 %)"
  if (kpis !== undefined && (Number.isNaN(kpis) || kpis <= 0)) return 'Le nombre de KPIs doit être > 0'
  if (budget !== undefined && (Number.isNaN(budget) || budget <= 0)) return 'Le budget doit être > 0'
  return null
}

// KPI -> Budget (formules utilisateur 2026, KPIs ➡️ budget)
export function calculatePriceForKPIs(
  platform: string,
  objective: string,
  aePercentage: number,
  kpis: number
): PDVCalculation {
  const unit = getUnitCost(platform, objective)
  if (!unit) throw new Error('Combinaison plateforme/objectif non supportée')

  // %AE est saisi comme 40 pour 40 %
  const aeFactor = aePercentage / 100
  if (aeFactor <= 0) throw new Error('Le % AE doit être > 0')

  let price: number

  switch (platform) {
    case 'META':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 2,25) / %AE) x 1,3
          price = ((kpis / 1000 * 2.25) / aeFactor) * 1.3
          break
        case 'Clics':
          // ((KPIS souhaités x 0,520) / %AE) x 1,3
          price = ((kpis * 0.52) / aeFactor) * 1.3
          break
        case 'Clics sur lien':
          // ((KPIS souhaités x 0,736) / %AE) x 1,3
          price = ((kpis * 0.736) / aeFactor) * 1.3
          break
        case 'Leads':
          // ((KPIS souhaités x 70,4) / %AE) x 1,3
          price = ((kpis * 70.4) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour META')
      }
      break

    case 'Insta only':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 2,940) / %AE) x 1,3
          price = ((kpis / 1000 * 2.94) / aeFactor) * 1.3
          break
        case 'Clics':
          // ((KPIS souhaités x 1,127) / %AE) x 1,3
          price = ((kpis * 1.127) / aeFactor) * 1.3
          break
        case 'Clics sur lien':
          // ((KPIS souhaités x 1,239) / %AE) x 1,3
          price = ((kpis * 1.239) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour Insta only')
      }
      break

    case 'Display':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 2,552) / %AE) x 1,3
          price = ((kpis / 1000 * 2.552) / aeFactor) * 1.3
          break
        case 'Clics':
          // ((KPIS souhaités x 0,823) / %AE) x 1,3
          price = ((kpis * 0.823) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour Display')
      }
      break

    case 'Youtube':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 5,280) / %AE) x 1,3
          price = ((kpis / 1000 * 5.28) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour Youtube')
      }
      break

    case 'LinkedIn':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 19,8) / %AE) x 1,3
          price = ((kpis / 1000 * 19.8) / aeFactor) * 1.3
          break
        case 'Clics':
          // ((KPIS souhaités x 7,250) / %AE) x 1,3
          price = ((kpis * 7.25) / aeFactor) * 1.3
          break
        case 'Leads':
          // ((KPIS souhaités x 560) / %AE) x 1,3
          price = ((kpis * 560) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour LinkedIn')
      }
      break

    case 'Snapchat':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 1,440) / %AE) x 1,3
          price = ((kpis / 1000 * 1.44) / aeFactor) * 1.3
          break
        case 'Clics':
          // ((KPIS souhaités x 0,693) / %AE) x 1,3
          price = ((kpis * 0.693) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour Snapchat')
      }
      break

    case 'Tiktok':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 2,376) / %AE) x 1,3
          price = ((kpis / 1000 * 2.376) / aeFactor) * 1.3
          break
        case 'Clics':
          // ((KPIS souhaités x 0,552) / %AE) x 1,3
          price = ((kpis * 0.552) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour Tiktok')
      }
      break

    case 'Spotify':
      switch (objective) {
        case 'Impressions':
          // ((KPIS souhaités / 1000 x 9,680) / %AE) x 1,3
          price = ((kpis / 1000 * 9.68) / aeFactor) * 1.3
          break
        default:
          throw new Error('Objectif non supporté pour Spotify')
      }
      break

    default:
      throw new Error('Plateforme non supportée')
  }

  // On ne veut pas de décimales sur le budget
  const roundedPrice = Math.round(price)

  return { platform, objective, aePercentage, kpis, price: roundedPrice }
}

// Budget -> KPI (formules utilisateur 2026, Budget ➡️ KPIS)
export function calculateKPIsForBudget(
  platform: string,
  objective: string,
  aePercentage: number,
  budget: number
): PDVCalculation {
  const unit = getUnitCost(platform, objective)
  if (!unit) throw new Error('Combinaison plateforme/objectif non supportée')

  // %AE est saisi comme 40 pour 40 %
  const aeFactor = aePercentage / 100
  if (aeFactor <= 0) throw new Error('Le % AE doit être > 0')

  let calculatedKpis: number

  switch (platform) {
    case 'META':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 2,25 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 2.25 * 1000
          break
        case 'Clics':
          // ((Prix souhaité / 1,3) x %AE) / 0,520
          calculatedKpis = ((budget / 1.3) * aeFactor) / 0.52
          break
        case 'Clics sur lien':
          // ((Prix souhaité / 1,3) x %AE) / 0,736
          calculatedKpis = ((budget / 1.3) * aeFactor) / 0.736
          break
        case 'Leads':
          // ((Prix souhaité / 1,3) x %AE) / 70,4
          calculatedKpis = ((budget / 1.3) * aeFactor) / 70.4
          break
        default:
          throw new Error('Objectif non supporté pour META')
      }
      break

    case 'Insta only':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 2,940 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 2.94 * 1000
          break
        case 'Clics':
          // ((Prix souhaité / 1,3) x %AE) / 1,127
          calculatedKpis = ((budget / 1.3) * aeFactor) / 1.127
          break
        case 'Clics sur lien':
          // ((Prix souhaité / 1,3) x %AE) / 1,239
          calculatedKpis = ((budget / 1.3) * aeFactor) / 1.239
          break
        default:
          throw new Error('Objectif non supporté pour Insta only')
      }
      break

    case 'Display':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 2,552 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 2.552 * 1000
          break
        case 'Clics':
          // ((Prix souhaité / 1,3) x %AE) / 0,823
          calculatedKpis = ((budget / 1.3) * aeFactor) / 0.823
          break
        default:
          throw new Error('Objectif non supporté pour Display')
      }
      break

    case 'Youtube':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 5,280 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 5.28 * 1000
          break
        default:
          throw new Error('Objectif non supporté pour Youtube')
      }
      break

    case 'LinkedIn':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 19,8 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 19.8 * 1000
          break
        case 'Clics':
          // ((Prix souhaité / 1,3) x %AE) / 7,250
          calculatedKpis = ((budget / 1.3) * aeFactor) / 7.25
          break
        case 'Leads':
          // ((Prix souhaité / 1,3) x %AE) / 560
          calculatedKpis = ((budget / 1.3) * aeFactor) / 560
          break
        default:
          throw new Error('Objectif non supporté pour LinkedIn')
      }
      break

    case 'Snapchat':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 1,440 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 1.44 * 1000
          break
        case 'Clics':
          // ((Prix souhaité / 1,3) x %AE) / 0,693
          calculatedKpis = ((budget / 1.3) * aeFactor) / 0.693
          break
        default:
          throw new Error('Objectif non supporté pour Snapchat')
      }
      break

    case 'Tiktok':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 2,376 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 2.376 * 1000
          break
        case 'Clics':
          // ((Prix souhaité / 1,3) x %AE) / 0,552
          calculatedKpis = ((budget / 1.3) * aeFactor) / 0.552
          break
        default:
          throw new Error('Objectif non supporté pour Tiktok')
      }
      break

    case 'Spotify':
      switch (objective) {
        case 'Impressions':
          // ((Prix souhaité / 1,3) x %AE) / 9,680 x 1000
          calculatedKpis = ((budget / 1.3) * aeFactor) / 9.68 * 1000
          break
        default:
          throw new Error('Objectif non supporté pour Spotify')
      }
      break

    default:
      throw new Error('Plateforme non supportée')
  }

  return { platform, objective, aePercentage, budget, calculatedKpis }
}

export function listObjectivesForPlatform(platform: string): string[] {
  const byPlatform = UNIT_COSTS[platform]
  return byPlatform ? Object.keys(byPlatform) : []
}