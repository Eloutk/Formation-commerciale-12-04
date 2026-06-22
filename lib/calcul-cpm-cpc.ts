export type CpmCpcRowKey =
  | 'depenses'
  | 'impressions'
  | 'cpmImpressions'
  | 'couverture'
  | 'cpmCouverture'
  | 'clics'
  | 'cpcClics'
  | 'clicsSurLien'
  | 'cpcClicsSurLien'

export type CpmCpcRowInputs = {
  depensesReel: number | null
  depensesVente: number | null
  impressionsReel: number | null
  impressionsVente: number | null
  couvertureReel: number | null
  couvertureVente: number | null
  clicsReel: number | null
  clicsVente: number | null
  clicsSurLienReel: number | null
  clicsSurLienVente: number | null
}

export type CpmCpcRowResult = {
  key: CpmCpcRowKey
  label: string
  reel: number | null
  vente: number | null
  delta: number | null
  isComputed: boolean
}

const TVA_RATE = 1.2

export function roundCalculatorAmount(value: number): number {
  return Math.round(value * 100) / 100
}

export function parseCalculatorNumber(value: string): number | null {
  const normalized = value.trim().replace(/\s/g, '').replace(',', '.')
  if (normalized === '') return null
  const n = Number(normalized)
  if (!Number.isFinite(n)) return null
  return n
}

export function computeDelta(reel: number | null, vente: number | null): number | null {
  if (reel == null || vente == null || vente === 0) return null
  return reel / vente
}

export function computeCpm(depenses: number | null, volume: number | null): number | null {
  if (depenses == null || volume == null || volume === 0) return null
  return roundCalculatorAmount((depenses / volume) * 1000)
}

export function computeCpc(depenses: number | null, clics: number | null): number | null {
  if (depenses == null || clics == null || clics === 0) return null
  return roundCalculatorAmount(depenses / clics)
}

export function computeCpmCpcRows(inputs: CpmCpcRowInputs): CpmCpcRowResult[] {
  const cpmImpressionsReel = computeCpm(inputs.depensesReel, inputs.impressionsReel)
  const cpmImpressionsVente = computeCpm(inputs.depensesVente, inputs.impressionsVente)
  const cpmCouvertureReel = computeCpm(inputs.depensesReel, inputs.couvertureReel)
  const cpmCouvertureVente = computeCpm(inputs.depensesVente, inputs.couvertureVente)
  const cpcClicsReel = computeCpc(inputs.depensesReel, inputs.clicsReel)
  const cpcClicsVente = computeCpc(inputs.depensesVente, inputs.clicsVente)
  const cpcClicsSurLienReel = computeCpc(inputs.depensesReel, inputs.clicsSurLienReel)
  const cpcClicsSurLienVente = computeCpc(inputs.depensesVente, inputs.clicsSurLienVente)

  return [
    {
      key: 'depenses',
      label: 'Prix de vente',
      reel: inputs.depensesReel,
      vente: inputs.depensesVente,
      delta: null,
      isComputed: false,
    },
    {
      key: 'impressions',
      label: 'Impressions',
      reel: inputs.impressionsReel,
      vente: inputs.impressionsVente,
      delta: computeDelta(inputs.impressionsReel, inputs.impressionsVente),
      isComputed: false,
    },
    {
      key: 'cpmImpressions',
      label: 'CPM',
      reel: cpmImpressionsReel,
      vente: cpmImpressionsVente,
      delta: computeDelta(cpmImpressionsReel, cpmImpressionsVente),
      isComputed: true,
    },
    {
      key: 'couverture',
      label: 'Couverture',
      reel: inputs.couvertureReel,
      vente: inputs.couvertureVente,
      delta: computeDelta(inputs.couvertureReel, inputs.couvertureVente),
      isComputed: false,
    },
    {
      key: 'cpmCouverture',
      label: 'CPM',
      reel: cpmCouvertureReel,
      vente: cpmCouvertureVente,
      delta: computeDelta(cpmCouvertureReel, cpmCouvertureVente),
      isComputed: true,
    },
    {
      key: 'clics',
      label: 'Clics',
      reel: inputs.clicsReel,
      vente: inputs.clicsVente,
      delta: computeDelta(inputs.clicsReel, inputs.clicsVente),
      isComputed: false,
    },
    {
      key: 'cpcClics',
      label: 'CPC',
      reel: cpcClicsReel,
      vente: cpcClicsVente,
      delta: computeDelta(cpcClicsReel, cpcClicsVente),
      isComputed: true,
    },
    {
      key: 'clicsSurLien',
      label: 'Clics sur lien',
      reel: inputs.clicsSurLienReel,
      vente: inputs.clicsSurLienVente,
      delta: computeDelta(inputs.clicsSurLienReel, inputs.clicsSurLienVente),
      isComputed: false,
    },
    {
      key: 'cpcClicsSurLien',
      label: 'CPC',
      reel: cpcClicsSurLienReel,
      vente: cpcClicsSurLienVente,
      delta: computeDelta(cpcClicsSurLienReel, cpcClicsSurLienVente),
      isComputed: true,
    },
  ]
}

export function computeBudgetTtcFromHt(budgetHt: number | null): number | null {
  if (budgetHt == null) return null
  return budgetHt * TVA_RATE
}

export function computeBudgetHtFromTtc(budgetTtc: number | null): number | null {
  if (budgetTtc == null) return null
  return budgetTtc / TVA_RATE
}

export function formatCalculatorInteger(value: number | null): string {
  if (value == null) return '—'
  return value.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
}

export function formatCalculatorCurrency(value: number | null): string {
  if (value == null) return '—'
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

export function formatCalculatorRatio(value: number | null): string {
  if (value == null) return '—'
  return value.toLocaleString('fr-FR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  })
}
