/**
 * Stratégies Calculateur de vente (Social media) — types et helpers.
 */

export type Vente2CalculationMode = 'budget-to-kpis' | 'kpis-to-budget'

export type Vente2CustomRowState = {
  objective: string
  budget: string
}

export type Vente2StrategyItemSnapshot = {
  id: string
  platform: string
  objective: string
  budget: number
  estimatedKPIs: number
  dailyBudget: number
  aeCheckValue: number
  isAvailable: boolean
  days: number
  aePercentage: number
  customKpiLabel?: string
  tarifsDirection?: boolean
  isMakeLeadsAddon?: boolean
}

export type Vente2StrategyBlockSnapshot = {
  id: string
  name: string
  items: Vente2StrategyItemSnapshot[]
  calendar?: unknown
  comment?: string
  additionalSales?: Record<string, number>
}

export type Vente2RetroSocialSnapshot = {
  startDate: string
  durationDays: number
  platformPhases: unknown[]
  socialLineSplits: Record<string, { name: string; days: number }[]>
  calendarData: unknown
}

export type Vente2PdfBriefSnapshot = {
  briefType: 'cp' | 'client'
  clientName: string
  campaignDescription: string
  diffusionZone: string
  targeting: string
  campaignDates: string
  clientType: 'existing' | 'new'
  existingClientMode: 'usual' | 'different'
  contactFirstName: string
  contactLastName: string
  contactEmail: string
  contactPhone: string
  billingEntity: string
  billingAddress: string
  siret: string
  vatNumber: string
  /** Nouveau client : modalités de paiement (texte libre). */
  paymentTerms: string
  signerFirstName: string
  signerLastName: string
  signerEmail: string
  newClientTechnicalContactDifferent: boolean
  /** Nouveau client : commentaire libre après le contact technique. */
  freeComment: string
}

export type Vente2StrategyContent = {
  version: 1
  calculationMode: Vente2CalculationMode
  mainValue: string
  aePercentage: string
  diffusionDays: string
  tarifsDirection: boolean
  selectedPlatforms: string[]
  searchClicsStudyValue: string
  customRows: Record<string, Vente2CustomRowState>
  strategies: Vente2StrategyBlockSnapshot[]
  activeStrategyId: string
  expandedStrategies: Record<string, boolean>
  retroSocialByStrategy: Record<string, Vente2RetroSocialSnapshot>
  defineDatesPerStrategy: Record<string, Record<string, string>>
  /** Brief du popup « Télécharger le PDF » (commun CP / client). */
  pdfBrief?: Vente2PdfBriefSnapshot
}

export type Vente2StrategyRecord = {
  id: string
  user_id: string
  name: string
  total_amount: number
  content: Vente2StrategyContent
  created_at: string
  updated_at: string
  /** true si l'utilisateur courant est le propriétaire (absent = traité comme propriétaire). */
  is_owner?: boolean
  shared_by_user_id?: string | null
  shared_by_name?: string | null
}

export type ColleagueSearchResult = {
  id: string
  full_name: string | null
  email?: string | null
}

export type Vente2StrategyShareRecord = {
  id: string
  strategy_id: string
  shared_with_user_id: string
  shared_by_user_id: string
  created_at: string
  shared_with_name?: string | null
}

export function colleagueDisplayName(colleague: {
  full_name?: string | null
  email?: string | null
}): string {
  return (
    (colleague.full_name || '').trim() ||
    (colleague.email || '').trim() ||
    'Utilisateur'
  )
}

const ADDITIONAL_SALE_UNIT_PRICES: Record<string, number> = {
  miseAuFormat: 200,
  animationVisuel: 250,
  leadsMeta: 150,
  leadsLinkedIn: 150,
  creationComplete: 490,
}

function additionalSalesTotal(block: Vente2StrategyBlockSnapshot): number {
  if (!block.additionalSales) return 0
  return Object.entries(block.additionalSales).reduce((sum, [id, count]) => {
    const qty = typeof count === 'number' ? count : count === true ? 1 : 0
    const unit = ADDITIONAL_SALE_UNIT_PRICES[id] ?? 0
    return sum + qty * unit
  }, 0)
}

export function computeVente2StrategyTotalHt(content: Vente2StrategyContent): number {
  return content.strategies.reduce((sum, block) => {
    const itemsTotal = block.items.reduce((s, it) => s + (it.budget ?? 0), 0)
    return sum + itemsTotal + additionalSalesTotal(block)
  }, 0)
}

export function formatVente2StrategyAmount(amount: number): string {
  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € HT`
}

export function formatVente2StrategyDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function countVente2StrategyPlatforms(content: Vente2StrategyContent): number {
  const platforms = new Set<string>()
  for (const block of content.strategies) {
    for (const item of block.items) {
      if (!item.isMakeLeadsAddon) platforms.add(item.platform)
    }
  }
  return platforms.size
}
