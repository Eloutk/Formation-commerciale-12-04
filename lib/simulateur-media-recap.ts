import type {
  PressureLevel,
  SimulateurCustomMode,
  SimulateurPlatformRow,
  SimulateurResult,
  SimulateurStrategyMetrics,
  SimulateurSynthesisColumn,
} from '@/lib/simulateur-media-link'

function formatInt(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return Math.round(n).toLocaleString('fr-FR')
}

function formatRate(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `${(n * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}

function formatStrategyBlock(
  label: string,
  metrics: {
    impressions: number | null
    rate: number | null
    saturation: string
    clicks: number | null
  },
): string[] {
  return [
    `  ${label} :`,
    `    • Impressions : ${formatInt(metrics.impressions)}`,
    `    • Taux de pénétration : ${formatRate(metrics.rate)}`,
    `    • Pression publicitaire : ${metrics.saturation}`,
    `    • Clics estimés : ${formatInt(metrics.clicks)}`,
  ]
}

function formatPlatformRecap(row: SimulateurPlatformRow, includeCustom: boolean): string[] {
  const lines = [
    `${row.label}`,
    `  Potentiel : ${formatInt(row.potentiel)}`,
    `  Durée : ${row.diffusionDays ?? '—'} jours`,
    ...formatStrategyBlock('Stratégie idéale', row.ideal),
    ...formatStrategyBlock('Stratégie MAX', row.max),
  ]

  if (includeCustom) {
    lines.push(...formatStrategyBlock('Stratégie personnalisée', row.custom))
  }

  return lines
}

function formatSynthesisColumn(
  title: string,
  column: SimulateurResult['synthesis']['ideal'],
): string[] {
  return [
    title,
    `  • Impressions totales : ${formatInt(column.totalImpressions)}`,
    `  • Clics totaux estimés : ${formatInt(column.totalClicks)}`,
    `  • Taux de pénétration global : ${formatRate(column.globalRate)}`,
    `  • Pression globale : ${column.pressureLevel}`,
  ]
}

export function buildSimulateurMediaRecapText(params: {
  result: SimulateurResult
  diffusionDays: number | null
  customResult?: SimulateurResult | null
  customMode?: SimulateurCustomMode
}): string {
  const { result, diffusionDays, customResult } = params
  const enabledRows = result.rows.filter((row) => row.enabled)
  const lines: string[] = [
    'Récapitulatif — Stratégie Social Media',
    '=====================================',
    '',
    `Durée de diffusion : ${diffusionDays ?? '—'} jours`,
    '',
  ]

  if (result.alerts.length > 0) {
    lines.push('Alertes :', ...result.alerts.map((alert) => `  • ${alert}`), '')
  }

  lines.push('Résultats par plateforme', '------------------------')
  for (const row of enabledRows) {
    lines.push(...formatPlatformRecap(row, false), '')
  }

  lines.push('Synthèse globale', '----------------')
  lines.push(...formatSynthesisColumn('Stratégie idéale', result.synthesis.ideal), '')
  lines.push(...formatSynthesisColumn('Stratégie MAX', result.synthesis.max), '')

  if (customResult) {
    const customRows = customResult.rows.filter((row) => row.enabled)
    lines.push('Stratégie personnalisée', '-----------------------')
    for (const row of customRows) {
      lines.push(...formatPlatformRecap(row, true), '')
    }
    lines.push(...formatSynthesisColumn('Synthèse personnalisée', customResult.synthesis.custom))
  }

  return lines.join('\n').trim()
}

function formatIntProse(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return Math.round(n).toLocaleString('fr-FR')
}

function formatRateProse(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return Math.round(n * 100).toLocaleString('fr-FR')
}

function idealPressurePhrase(level: PressureLevel): string {
  switch (level) {
    case 'Pression faible':
      return 'une pression publicitaire modérée'
    case 'Pression correcte':
      return 'une pression publicitaire correcte'
    case 'Bonne pression':
      return 'une pression publicitaire équilibrée, favorisant une bonne mémorisation du message sans surexposer les utilisateurs'
    case 'Pression forte':
      return 'une pression publicitaire soutenue, à surveiller pour éviter une surexposition progressive'
    case 'Surpression':
      return 'une pression publicitaire élevée, avec un risque de lassitude de l’audience'
    default:
      return 'une pression publicitaire à préciser selon vos objectifs'
  }
}

function maxPressurePhrase(level: PressureLevel): string {
  switch (level) {
    case 'Pression faible':
    case 'Pression correcte':
    case 'Bonne pression':
      return 'pression publicitaire plus marquée'
    case 'Pression forte':
      return 'pression publicitaire plus importante'
    case 'Surpression':
      return 'pression publicitaire nettement plus importante'
    default:
      return 'pression publicitaire à évaluer'
  }
}

function trafficClicksSentence(clicks: number | null, strategy: 'ideal' | 'max'): string {
  if (clicks === null || clicks <= 0) {
    if (strategy === 'max') {
      return 'avec un format principalement orienté notoriété, sans estimation de clics.'
    }
    return 'Pour une campagne orientée notoriété, les impressions constituent l’indicateur principal de performance.'
  }
  if (strategy === 'ideal') {
    return `Si votre objectif est une campagne orientée trafic, cela correspond à un potentiel estimé d’environ ${formatIntProse(clicks)} clics.`
  }
  return `soit un potentiel estimé d’environ ${formatIntProse(clicks)} clics pour une campagne orientée trafic.`
}

function buildNarrativeRecap(params: {
  scopeLabel: string
  ideal: SimulateurStrategyMetrics | SimulateurSynthesisColumn
  max: SimulateurStrategyMetrics | SimulateurSynthesisColumn
}): string | null {
  const { scopeLabel, ideal, max } = params

  const idealImpressions =
    'totalImpressions' in ideal ? ideal.totalImpressions : ideal.impressions
  const idealClicks = 'totalClicks' in ideal ? ideal.totalClicks : ideal.clicks
  const idealRate = 'globalRate' in ideal ? ideal.globalRate : ideal.rate
  const idealPressure =
    'pressureLevel' in ideal ? ideal.pressureLevel : ideal.saturation

  const maxImpressions = 'totalImpressions' in max ? max.totalImpressions : max.impressions
  const maxClicks = 'totalClicks' in max ? max.totalClicks : max.clicks
  const maxPressure = 'pressureLevel' in max ? max.pressureLevel : max.saturation

  if (
    idealImpressions === null ||
    maxImpressions === null ||
    idealRate === null
  ) {
    return null
  }

  const paragraphs = [
    `Selon les paramètres de ciblage renseignés${scopeLabel} et l’audience potentielle disponible, notre recommandation est de diffuser environ ${formatIntProse(idealImpressions)} impressions. ${trafficClicksSentence(idealClicks, 'ideal')}`,
    `Ce niveau de diffusion permettrait d’atteindre près de ${formatRateProse(idealRate)} % de votre audience cible, avec ${idealPressurePhrase(idealPressure)}.`,
    `Si votre objectif est de maximiser votre visibilité et vos performances, nous pouvons également mettre en place une stratégie allant jusqu’à ${formatIntProse(maxImpressions)} impressions, ${trafficClicksSentence(maxClicks, 'max')}`,
    `Cette approche génère davantage de visibilité et d’interactions, mais s’accompagne également d’une ${maxPressurePhrase(maxPressure)}. Au-delà de ce niveau, la répétition des annonces devient généralement excessive, ce qui peut entraîner une lassitude de l’audience, une diminution de l’attention portée au message et une baisse progressive de l’efficacité de la campagne.`,
    'Ces recommandations ont pour objectif de trouver le meilleur équilibre entre couverture de l’audience, répétition du message et performance publicitaire, afin d’optimiser votre investissement.',
  ]

  return paragraphs.join('\n\n')
}

/** Récapitulatif client par plateforme — stratégie idéale et MAX. */
export function buildSimulateurPlatformNarrativeRecap(row: SimulateurPlatformRow): string | null {
  if (!row.enabled) return null
  return buildNarrativeRecap({
    scopeLabel: ` sur ${row.label}`,
    ideal: row.ideal,
    max: row.max,
  })
}

/** Récapitulatif client global — synthèse multi-plateformes. */
export function buildSimulateurGlobalNarrativeRecap(result: SimulateurResult): string | null {
  const enabledRows = result.rows.filter((row) => row.enabled)
  if (enabledRows.length === 0) return null

  return buildNarrativeRecap({
    scopeLabel: '',
    ideal: result.synthesis.ideal,
    max: result.synthesis.max,
  })
}
