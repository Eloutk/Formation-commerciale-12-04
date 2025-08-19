export type UnitCost = {
  cost: number
  perThousand: boolean
}

export const UNIT_COSTS: Record<string, Record<string, UnitCost>> = {
  META: {
    Impressions: { cost: 2.25, perThousand: true },
    'Clics sur lien': { cost: 0.64, perThousand: false },
    Clics: { cost: 0.52, perThousand: false },
    Leads: { cost: 64, perThousand: false },
  },
  'Insta only': {
    Impressions: { cost: 2.8, perThousand: true },
    'Clics sur lien': { cost: 1.18, perThousand: false },
    Clics: { cost: 0.98, perThousand: false },
  },
  Display: {
    Impressions: { cost: 2.32, perThousand: true },
    Clics: { cost: 0.748, perThousand: false },
  },
  Youtube: {
    Impressions: { cost: 4.8, perThousand: true },
  },
  LinkedIn: {
    Impressions: { cost: 18, perThousand: true },
    Clics: { cost: 5.8, perThousand: false },
    Leads: { cost: 560, perThousand: true },
  },
  Snapchat: {
    Impressions: { cost: 1.44, perThousand: true },
    Clics: { cost: 0.63, perThousand: false },
  },
  Tiktok: {
    Impressions: { cost: 1.98, perThousand: true },
    Clics: { cost: 0.48, perThousand: false },
  },
  Spotify: {
    Impressions: { cost: 8.8, perThousand: true },
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
  if (Number.isNaN(aePercentage) || aePercentage <= 0 || aePercentage > 100) return 'Le % AE doit être entre 0 et 100 (ex: 40)'
  if (kpis !== undefined && (Number.isNaN(kpis) || kpis <= 0)) return 'Le nombre de KPIs doit être > 0'
  if (budget !== undefined && (Number.isNaN(budget) || budget <= 0)) return 'Le budget doit être > 0'
  return null
}

// KPI -> Price (formules utilisateur)
export function calculatePriceForKPIs(
  platform: string,
  objective: string,
  aePercentage: number,
  kpis: number
): PDVCalculation {
  const unit = getUnitCost(platform, objective)
  if (!unit) throw new Error('Combinaison plateforme/objectif non supportée')

  const base = unit.perThousand ? (kpis * unit.cost) / 1000 : kpis * unit.cost
  // Majoration 1 = base / (AE%) avec AE% saisi comme 40 => diviser par 40/100
  const maj1 = base / (aePercentage / 100)
  const maj2 = maj1 * 1.15
  const price = maj2 * 1.15

  return { platform, objective, aePercentage, kpis, price }
}

// Price -> KPI (inverse exact)
export function calculateKPIsForBudget(
  platform: string,
  objective: string,
  aePercentage: number,
  budget: number
): PDVCalculation {
  const unit = getUnitCost(platform, objective)
  if (!unit) throw new Error('Combinaison plateforme/objectif non supportée')

  const maj2 = budget / 1.15
  const maj1 = maj2 / 1.15
  const base = maj1 * (aePercentage / 100)

  const calculatedKpis = unit.perThousand ? (base / unit.cost) * 1000 : base / unit.cost

  return { platform, objective, aePercentage, budget, calculatedKpis }
}

export function listObjectivesForPlatform(platform: string): string[] {
  const byPlatform = UNIT_COSTS[platform]
  return byPlatform ? Object.keys(byPlatform) : []
}