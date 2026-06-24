import {
  formatStudioEuro,
  formatStudioPrestationLabel,
  type StudioTarifsRow,
} from '@/lib/studio-tarifs-grid'

export type StudioTarifsPdfLine = {
  title: string
  explanation?: string
  conditions?: string
  unitPriceLabel?: string
  quantityLabel?: string
  lineTotalLabel: string
  notes?: string[]
}

export type StudioTarifsPdfSection = {
  label: string
  lines: StudioTarifsPdfLine[]
  subtotalLabel: string | null
}

export function formatStudioPdfQuantity(quantity: number): string | null {
  if (quantity <= 0) return null
  if (Number.isInteger(quantity)) {
    return quantity.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ')
  }
  const formatted = quantity.toLocaleString('fr-FR', { maximumFractionDigits: 2 })
  return formatted.replace(/[\u202f\u00a0]/g, ' ')
}

export function buildStudioTarifsPdfLine(params: {
  row: StudioTarifsRow
  quantity: number
  linePrice: number
  subtotalI: number
}): StudioTarifsPdfLine {
  const { row, quantity, linePrice, subtotalI } = params
  const title = formatStudioPrestationLabel(row)
  const explanation = row.explanation.trim() || undefined
  const conditions = row.conditions?.trim() || undefined
  const notes: string[] = []

  if (row.kind === 'on_demand') {
    return {
      title,
      explanation,
      conditions,
      unitPriceLabel: row.rateLabel?.trim() || 'Sur demande au studio',
      lineTotalLabel: 'Sur demande',
    }
  }

  const unitPriceLabel =
    row.rateHT !== undefined ? `${formatStudioEuro(row.rateHT)} HT / unité` : undefined
  const quantityLabel = formatStudioPdfQuantity(quantity) ?? '—'

  if (row.psdSurcharge && row.rateHT !== undefined && quantity > 0 && linePrice > 0) {
    const base = row.rateHT * quantity
    const surcharge = subtotalI * 0.2
    notes.push(`Calcul : ${formatStudioEuro(row.rateHT)} × ${quantityLabel} = ${formatStudioEuro(base)}`)
    notes.push(
      `Majoration PSD (+20 % du sous-total HT hors sur demande vidéo) : ${formatStudioEuro(surcharge)}`,
    )
  }

  return {
    title,
    explanation,
    conditions,
    unitPriceLabel,
    quantityLabel,
    lineTotalLabel: linePrice > 0 ? `${formatStudioEuro(linePrice)} HT` : '—',
    notes: notes.length > 0 ? notes : undefined,
  }
}
