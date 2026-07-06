import {
  parseCalculatorNumber,
} from '@/lib/calcul-cpm-cpc'

export type MediaKpiType = 'CPM' | 'CPC' | 'CPL' | 'CPA'

export const MEDIA_KPI_TYPES: MediaKpiType[] = ['CPM', 'CPC', 'CPL', 'CPA']

export type MediaCalculatorRow = {
  id: string
  kpiType: MediaKpiType
  budgetN1: string
  volumeN1: string
  budgetN: string
  improvementPercent: string
}

export type MediaCalculatorRowResult = {
  unitCostN1: number | null
  targetUnitCost: number | null
  targetVolume: number | null
  gapVsN1: number | null
}

export function getMediaKpiVolumeLabel(kpiType: MediaKpiType): string {
  switch (kpiType) {
    case 'CPM':
      return 'impressions'
    case 'CPC':
      return 'clics'
    case 'CPL':
      return 'leads'
    case 'CPA':
      return 'conversions'
  }
}

export function getMediaKpiDescription(kpiType: MediaKpiType): string {
  switch (kpiType) {
    case 'CPM':
      return "Utilise un budget et un volume d'impressions. Le calculateur déduit un objectif d'impressions."
    case 'CPC':
      return "Utilise un budget et un volume de clics. Le calculateur déduit un objectif de clics."
    case 'CPL':
      return "Utilise un budget et un volume de leads. Le calculateur déduit un objectif de leads."
    case 'CPA':
      return "Utilise un budget et un volume de conversions. Le calculateur déduit un objectif de conversions."
  }
}

export function computeUnitCostN1(
  kpiType: MediaKpiType,
  budget: number | null,
  volume: number | null,
): number | null {
  if (budget == null || volume == null || volume === 0) return null
  if (kpiType === 'CPM') {
    return (budget / volume) * 1000
  }
  return budget / volume
}

export function computeTargetUnitCost(
  unitCostN1: number | null,
  improvementPercent: number | null,
): number | null {
  if (unitCostN1 == null || improvementPercent == null) return null
  return unitCostN1 * (1 - improvementPercent / 100)
}

export function computeTargetVolume(
  kpiType: MediaKpiType,
  budgetN: number | null,
  targetUnitCost: number | null,
): number | null {
  if (budgetN == null || targetUnitCost == null || targetUnitCost === 0) return null
  if (kpiType === 'CPM') {
    return (budgetN * 1000) / targetUnitCost
  }
  return budgetN / targetUnitCost
}

export function computeGapVsN1(
  targetVolume: number | null,
  volumeN1: number | null,
): number | null {
  if (targetVolume == null || volumeN1 == null) return null
  return targetVolume - volumeN1
}

export function computeMediaCalculatorRow(
  row: Pick<MediaCalculatorRow, 'kpiType' | 'budgetN1' | 'volumeN1' | 'budgetN' | 'improvementPercent'>,
): MediaCalculatorRowResult {
  const budgetN1 = parseCalculatorNumber(row.budgetN1)
  const volumeN1 = parseCalculatorNumber(row.volumeN1)
  const budgetN = parseCalculatorNumber(row.budgetN)
  const improvementPercent = parseCalculatorNumber(row.improvementPercent)

  const unitCostN1 = computeUnitCostN1(row.kpiType, budgetN1, volumeN1)
  const targetUnitCost = computeTargetUnitCost(unitCostN1, improvementPercent)
  const targetVolume = computeTargetVolume(row.kpiType, budgetN, targetUnitCost)
  const gapVsN1 = computeGapVsN1(targetVolume, volumeN1)

  return { unitCostN1, targetUnitCost, targetVolume, gapVsN1 }
}

function formatMediaDecimal(value: number | null): string {
  if (value == null) return '—'
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  })
}

export function formatMediaUnitCost(value: number | null): string {
  if (value == null) return '—'
  return `${formatMediaDecimal(value)} €`
}

export function formatMediaVolume(value: number | null): string {
  return formatMediaDecimal(value)
}

export function formatMediaGap(value: number | null): string {
  if (value == null) return '—'
  const formatted = formatMediaDecimal(value)
  if (value > 0) return `+${formatted}`
  return formatted
}

export function formatMediaBudget(value: string): string {
  const parsed = parseCalculatorNumber(value)
  if (parsed == null) return '—'
  return `${formatMediaDecimal(parsed)} €`
}

export function createEmptyMediaCalculatorRow(): MediaCalculatorRow {
  return {
    id: crypto.randomUUID(),
    kpiType: 'CPM',
    budgetN1: '',
    volumeN1: '',
    budgetN: '',
    improvementPercent: '10',
  }
}
