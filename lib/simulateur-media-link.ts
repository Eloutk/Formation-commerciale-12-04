/**
 * Simulateur Média Link — formules alignées sur Simulateur_Media_Link.xlsx
 * (onglets Simulateur + Paramètres).
 */

export type SimulateurPlatformId =
  | 'meta'
  | 'display'
  | 'youtube'
  | 'linkedin'
  | 'snapchat'
  | 'tiktok'

export type SimulateurCustomMode = 'impressions' | 'clics'

export type PressureLevel =
  | 'Pression faible'
  | 'Pression correcte'
  | 'Bonne pression'
  | 'Pression forte'
  | 'Surpression'
  | '—'

/** Échelle de pression publicitaire — ordre du plus faible au plus élevé. */
export const SIMULATEUR_PRESSURE_SCALE: ReadonlyArray<{
  level: Exclude<PressureLevel, '—'>
  segmentClass: string
  badgeClass: string
}> = [
  {
    level: 'Pression faible',
    segmentClass: 'bg-sky-400',
    badgeClass: 'bg-sky-400 text-white',
  },
  {
    level: 'Pression correcte',
    segmentClass: 'bg-yellow-500',
    badgeClass: 'bg-yellow-500 text-white',
  },
  {
    level: 'Bonne pression',
    segmentClass: 'bg-emerald-500',
    badgeClass: 'bg-emerald-500 text-white',
  },
  {
    level: 'Pression forte',
    segmentClass: 'bg-orange-500',
    badgeClass: 'bg-orange-500 text-white',
  },
  {
    level: 'Surpression',
    segmentClass: 'bg-red-600',
    badgeClass: 'bg-red-600 text-white',
  },
]

export function pressureLevelBadgeClass(level: PressureLevel): string {
  if (level === '—') return 'bg-muted text-muted-foreground'
  return SIMULATEUR_PRESSURE_SCALE.find((s) => s.level === level)?.badgeClass ?? 'bg-muted text-muted-foreground'
}

export type SimulateurPlatformParams = {
  penetrationCap: number
  coefFreq: number
  coefIncremental: number
  partIdeal: number
  freqIdeal: number
  partMax: number
  freqMax: number
  ctrIdeal: number
  ctrMax: number
}

export type SimulateurGlobalParams = {
  kConvergence: number
  globalRateCap: number
}

/** Paramètres globaux — Paramètres!B5:B6 */
export const SIMULATEUR_GLOBAL_PARAMS: SimulateurGlobalParams = {
  kConvergence: 0.395,
  globalRateCap: 0.92,
}

/** Paramètres par plateforme — Paramètres!C10:K15 */
export const SIMULATEUR_PLATFORM_PARAMS: Record<SimulateurPlatformId, SimulateurPlatformParams> = {
  meta: {
    penetrationCap: 0.85,
    coefFreq: 1,
    coefIncremental: 1,
    partIdeal: 0.7,
    freqIdeal: 1.5,
    partMax: 0.8,
    freqMax: 2,
    ctrIdeal: 0.012,
    ctrMax: 0.02,
  },
  display: {
    penetrationCap: 0.8,
    coefFreq: 1.3,
    coefIncremental: 0.55,
    partIdeal: 0.9,
    freqIdeal: 2,
    partMax: 1,
    freqMax: 2.8,
    ctrIdeal: 0.005,
    ctrMax: 0.01,
  },
  youtube: {
    penetrationCap: 0.8,
    coefFreq: 1.1,
    coefIncremental: 0.65,
    partIdeal: 0.7,
    freqIdeal: 1,
    partMax: 0.8,
    freqMax: 1.5,
    ctrIdeal: 0,
    ctrMax: 0,
  },
  linkedin: {
    penetrationCap: 0.7,
    coefFreq: 0.9,
    coefIncremental: 0.7,
    partIdeal: 0.7,
    freqIdeal: 1.1,
    partMax: 0.8,
    freqMax: 2,
    ctrIdeal: 0.005,
    ctrMax: 0.009,
  },
  snapchat: {
    penetrationCap: 0.8,
    coefFreq: 1.2,
    coefIncremental: 0.75,
    partIdeal: 0.7,
    freqIdeal: 1.5,
    partMax: 0.8,
    freqMax: 2,
    ctrIdeal: 0.015,
    ctrMax: 0.02,
  },
  tiktok: {
    penetrationCap: 0.82,
    coefFreq: 1.25,
    coefIncremental: 0.75,
    partIdeal: 0.7,
    freqIdeal: 1.5,
    partMax: 0.8,
    freqMax: 2,
    ctrIdeal: 0.012,
    ctrMax: 0.02,
  },
}

export const SIMULATEUR_PLATFORM_ORDER: { id: SimulateurPlatformId; label: string }[] = [
  { id: 'meta', label: 'META' },
  { id: 'display', label: 'Display' },
  { id: 'youtube', label: 'YouTube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'tiktok', label: 'TikTok' },
]

/** Seuil en dessous duquel Link ne s'engage pas sur les KPIs. */
export const SIMULATEUR_POTENTIEL_KPI_MIN = 50_000

export type SimulateurPotentiels = {
  meta: number | null
  linkedin: number | null
  snapchat: number | null
  tiktok: number | null
}

export type SimulateurPlatformInput = {
  enabled: boolean
  customValue: number | null
}

export type SimulateurInputs = {
  diffusionDays: number
  potentiels: SimulateurPotentiels
  customMode: SimulateurCustomMode
  platforms: Record<SimulateurPlatformId, SimulateurPlatformInput>
}

export type SimulateurStrategyMetrics = {
  impressions: number | null
  rate: number | null
  saturation: PressureLevel
  clicks: number | null
}

export type SimulateurPlatformRow = {
  id: SimulateurPlatformId
  label: string
  enabled: boolean
  potentiel: number | null
  diffusionDays: number | null
  coefFreq: number | null
  ideal: SimulateurStrategyMetrics
  max: SimulateurStrategyMetrics
  custom: SimulateurStrategyMetrics & { customValue: number | null }
}

export type SimulateurSynthesisColumn = {
  totalImpressions: number
  totalClicks: number
  globalRate: number | null
  globalSaturation: number | null
  pressureLevel: PressureLevel
}

export type SimulateurResult = {
  alerts: string[]
  rows: SimulateurPlatformRow[]
  synthesis: {
    ideal: SimulateurSynthesisColumn
    max: SimulateurSynthesisColumn
    custom: SimulateurSynthesisColumn
  }
}

function usesMetaPotentiel(id: SimulateurPlatformId): boolean {
  return id === 'meta' || id === 'display' || id === 'youtube'
}

function usesLinkedinPotentiel(id: SimulateurPlatformId): boolean {
  return id === 'linkedin'
}

function usesSnapchatPotentiel(id: SimulateurPlatformId): boolean {
  return id === 'snapchat'
}

/** Potentiel utilisé par plateforme (Simulateur colonnes F). */
export function simulateurPotentielForPlatform(
  id: SimulateurPlatformId,
  potentiels: SimulateurPotentiels,
): number | null {
  if (usesMetaPotentiel(id)) return potentiels.meta
  if (usesLinkedinPotentiel(id)) return potentiels.linkedin
  if (usesSnapchatPotentiel(id)) return potentiels.snapchat
  return potentiels.tiktok
}

/** Impressions = Potentiel × Part × Fréq × (Durée/30) */
export function simulateurImpressions(
  potentiel: number,
  part: number,
  freq: number,
  diffusionDays: number,
): number {
  return potentiel * part * freq * (diffusionDays / 30)
}

/** Taux = Plafond × (1 − e^(−(Part×Fréq)/Coef_fréquence)) */
export function simulateurPenetrationRate(
  penetrationCap: number,
  part: number,
  freq: number,
  coefFreq: number,
): number {
  return penetrationCap * (1 - Math.exp(-(part * freq) / coefFreq))
}

/** Taux depuis impressions : Plafond × (1 − e^(−(Impr/Potentiel/(Durée/30))/Coef_fréquence)) */
export function simulateurPenetrationRateFromImpressions(
  penetrationCap: number,
  impressions: number,
  potentiel: number,
  diffusionDays: number,
  coefFreq: number,
): number {
  const monthlyFactor = diffusionDays / 30
  if (potentiel <= 0 || monthlyFactor <= 0) return 0
  return penetrationCap * (1 - Math.exp(-(impressions / potentiel / monthlyFactor) / coefFreq))
}

/** Score saturation = (Part×Fréq)/Coef_fréquence ou depuis impressions. */
export function simulateurSaturationScore(part: number, freq: number, coefFreq: number): number {
  return (part * freq) / coefFreq
}

export function simulateurSaturationScoreFromImpressions(
  impressions: number,
  potentiel: number,
  diffusionDays: number,
  coefFreq: number,
): number {
  const monthlyFactor = diffusionDays / 30
  if (potentiel <= 0 || monthlyFactor <= 0) return 0
  return (impressions / potentiel / monthlyFactor) / coefFreq
}

/** Grille Paramètres!A21:A25 */
export function simulateurPressureLevel(score: number): PressureLevel {
  if (score < 0.5) return 'Pression faible'
  if (score <= 1) return 'Pression correcte'
  if (score <= 1.5) return 'Bonne pression'
  if (score <= 2.2) return 'Pression forte'
  return 'Surpression'
}

/** Impressions équivalentes pour stratégie personnalisée. */
export function simulateurCustomEquivImpressions(
  mode: SimulateurCustomMode,
  customValue: number,
  ctrIdeal: number,
): number {
  if (mode === 'impressions') return customValue
  if (ctrIdeal > 0) return customValue / ctrIdeal
  return customValue
}

function computeStrategyMetrics(
  enabled: boolean,
  potentiel: number | null,
  diffusionDays: number,
  params: SimulateurPlatformParams,
  part: number,
  freq: number,
  ctr: number,
): SimulateurStrategyMetrics {
  if (!enabled || potentiel === null || potentiel <= 0) {
    return { impressions: null, rate: null, saturation: '—', clicks: null }
  }

  const impressions = simulateurImpressions(potentiel, part, freq, diffusionDays)
  const rate = simulateurPenetrationRate(params.penetrationCap, part, freq, params.coefFreq)
  const saturation = simulateurPressureLevel(
    simulateurSaturationScore(part, freq, params.coefFreq),
  )
  const clicks = ctr > 0 ? impressions * ctr : null

  return { impressions, rate, saturation, clicks }
}

function computeCustomMetrics(
  enabled: boolean,
  customValue: number | null,
  mode: SimulateurCustomMode,
  potentiel: number | null,
  diffusionDays: number,
  params: SimulateurPlatformParams,
): SimulateurStrategyMetrics & { customValue: number | null } {
  if (!enabled || customValue === null || potentiel === null || potentiel <= 0) {
    return { impressions: null, rate: null, saturation: '—', clicks: null, customValue }
  }

  const equivImpressions = simulateurCustomEquivImpressions(mode, customValue, params.ctrIdeal)
  const rate = simulateurPenetrationRateFromImpressions(
    params.penetrationCap,
    equivImpressions,
    potentiel,
    diffusionDays,
    params.coefFreq,
  )
  const saturation = simulateurPressureLevel(
    simulateurSaturationScoreFromImpressions(
      equivImpressions,
      potentiel,
      diffusionDays,
      params.coefFreq,
    ),
  )

  return {
    customValue,
    impressions: equivImpressions,
    rate,
    saturation,
    clicks: null,
  }
}

type RateContribution = {
  enabled: boolean
  rate: number | null
  coefIncremental: number
}

/**
 * Taux global multi-plateformes — Simulateur!I42 / M42 / Q42.
 * Si META activée : MIN(Plafond ; 1 − (1 − Taux_META) × e^(−k × Σ(Taux_i × Coef_incr_i))).
 * Sinon : MIN(Plafond ; 1 − Π(1 − Taux_i × Coef_incr_i)).
 */
export function simulateurGlobalRate(
  contributions: RateContribution[],
  metaEnabled: boolean,
  globalParams: SimulateurGlobalParams = SIMULATEUR_GLOBAL_PARAMS,
): number | null {
  const active = contributions.filter((c) => c.enabled && c.rate !== null)
  if (active.length === 0) return null

  const { kConvergence, globalRateCap } = globalParams

  if (metaEnabled) {
    const meta = contributions[0]
    const metaRate = meta?.enabled && meta.rate !== null ? meta.rate : 0
    const sumOthers = contributions
      .slice(1)
      .filter((c) => c.enabled && c.rate !== null)
      .reduce((s, c) => s + (c.rate as number) * c.coefIncremental, 0)
    return Math.min(globalRateCap, 1 - (1 - metaRate) * Math.exp(-kConvergence * sumOthers))
  }

  let product = 1
  for (const c of contributions) {
    if (c.enabled && c.rate !== null) {
      product *= 1 - c.rate * c.coefIncremental
    }
  }
  return Math.min(globalRateCap, 1 - product)
}

type SaturationContribution = {
  enabled: boolean
  monthlyImpressions: number
  potentiel: number
  coefFreq: number
}

/**
 * Saturation globale — Simulateur!I43 / M43 / Q43.
 * Σ(Imp_mensuelles)² / (Σ Potentiel × Σ(Imp_mensuelles × Coef_fréquence))
 */
export function simulateurGlobalSaturation(contributions: SaturationContribution[]): number | null {
  const active = contributions.filter((c) => c.enabled && c.monthlyImpressions > 0)
  const sumMonthly = active.reduce((s, c) => s + c.monthlyImpressions, 0)
  if (sumMonthly === 0) return null

  const sumPotentiel = active.reduce((s, c) => s + c.potentiel, 0)
  const weightedCoef = active.reduce((s, c) => s + c.monthlyImpressions * c.coefFreq, 0)
  if (sumPotentiel <= 0 || weightedCoef <= 0) return null

  return (sumMonthly ** 2) / (sumPotentiel * weightedCoef)
}

function buildAlerts(inputs: SimulateurInputs): string[] {
  const alerts: string[] = []
  const { platforms, potentiels } = inputs

  if (
    (platforms.meta.enabled || platforms.display.enabled || platforms.youtube.enabled) &&
    potentiels.meta === null
  ) {
    alerts.push('⚠ Potentiel Meta manquant — requis si Meta, Display ou YouTube est activé')
  }
  if (platforms.linkedin.enabled && potentiels.linkedin === null) {
    alerts.push('⚠ Potentiel LinkedIn manquant — requis si LinkedIn activé')
  }
  if (platforms.snapchat.enabled && potentiels.snapchat === null) {
    alerts.push('⚠ Potentiel Snapchat manquant — requis si Snapchat activé')
  }
  if (platforms.tiktok.enabled && potentiels.tiktok === null) {
    alerts.push('⚠ Potentiel TikTok manquant — requis si TikTok activé')
  }

  const metaPlatforms = SIMULATEUR_PLATFORM_ORDER.filter(
    ({ id }) => usesMetaPotentiel(id) && platforms[id].enabled,
  )
  if (
    metaPlatforms.length > 0 &&
    potentiels.meta !== null &&
    potentiels.meta < SIMULATEUR_POTENTIEL_KPI_MIN
  ) {
    alerts.push(
      `⚠ Potentiel inférieur à 50 000 (${metaPlatforms.map((p) => p.label).join(', ')}) — nous ne nous engageons pas sur les KPIs`,
    )
  }

  const potentielChecks: { enabled: boolean; value: number | null; label: string }[] = [
    { enabled: platforms.linkedin.enabled, value: potentiels.linkedin, label: 'LinkedIn' },
    { enabled: platforms.snapchat.enabled, value: potentiels.snapchat, label: 'Snapchat' },
    { enabled: platforms.tiktok.enabled, value: potentiels.tiktok, label: 'TikTok' },
  ]
  for (const { enabled, value, label } of potentielChecks) {
    if (enabled && value !== null && value < SIMULATEUR_POTENTIEL_KPI_MIN) {
      alerts.push(
        `⚠ Potentiel ${label} inférieur à 50 000 — nous ne nous engageons pas sur les KPIs`,
      )
    }
  }

  return alerts
}

function buildSynthesisColumn(
  rows: SimulateurPlatformRow[],
  strategy: 'ideal' | 'max' | 'custom',
  inputs: SimulateurInputs,
  globalParams: SimulateurGlobalParams,
): SimulateurSynthesisColumn {
  const { diffusionDays, customMode, platforms } = inputs
  const monthlyFactor = diffusionDays / 30

  let totalImpressions = 0
  let totalClicks = 0

  const rateContributions: RateContribution[] = []
  const saturationContributions: SaturationContribution[] = []

  for (const row of rows) {
    const params = SIMULATEUR_PLATFORM_PARAMS[row.id]
    const metrics = row[strategy]
    const potentiel = row.potentiel

    if (!row.enabled || metrics.impressions === null || potentiel === null) {
      rateContributions.push({
        enabled: row.enabled,
        rate: null,
        coefIncremental: params.coefIncremental,
      })
      continue
    }

    totalImpressions += metrics.impressions

    if (strategy === 'ideal') {
      if (params.ctrIdeal > 0) {
        totalClicks += metrics.impressions * params.ctrIdeal
      }
    } else if (strategy === 'max') {
      if (params.ctrMax > 0) {
        totalClicks += metrics.impressions * params.ctrMax
      }
    } else {
      const customVal = platforms[row.id].customValue
      if (customVal !== null) {
        if (customMode === 'impressions') {
          if (params.ctrIdeal > 0) totalClicks += customVal * params.ctrIdeal
        } else {
          totalClicks += customVal
        }
      }
    }

    rateContributions.push({
      enabled: true,
      rate: metrics.rate,
      coefIncremental: params.coefIncremental,
    })

    saturationContributions.push({
      enabled: true,
      monthlyImpressions: metrics.impressions / monthlyFactor,
      potentiel,
      coefFreq: params.coefFreq,
    })
  }

  const metaEnabled = platforms.meta.enabled
  const globalRate = simulateurGlobalRate(rateContributions, metaEnabled, globalParams)
  const globalSaturation = simulateurGlobalSaturation(saturationContributions)

  return {
    totalImpressions,
    totalClicks: Math.round(totalClicks),
    globalRate,
    globalSaturation,
    pressureLevel:
      globalSaturation === null ? '—' : simulateurPressureLevel(globalSaturation),
  }
}

/** Calcule l’ensemble du simulateur à partir des entrées utilisateur. */
export function computeSimulateurMediaLink(
  inputs: SimulateurInputs,
  globalParams: SimulateurGlobalParams = SIMULATEUR_GLOBAL_PARAMS,
): SimulateurResult {
  const { diffusionDays, platforms, customMode } = inputs
  const rows: SimulateurPlatformRow[] = []

  for (const { id, label } of SIMULATEUR_PLATFORM_ORDER) {
    const platformInput = platforms[id]
    const params = SIMULATEUR_PLATFORM_PARAMS[id]
    const potentiel = platformInput.enabled
      ? simulateurPotentielForPlatform(id, inputs.potentiels)
      : null

    const ideal = computeStrategyMetrics(
      platformInput.enabled,
      potentiel,
      diffusionDays,
      params,
      params.partIdeal,
      params.freqIdeal,
      params.ctrIdeal,
    )

    const max = computeStrategyMetrics(
      platformInput.enabled,
      potentiel,
      diffusionDays,
      params,
      params.partMax,
      params.freqMax,
      params.ctrMax,
    )

    const custom = computeCustomMetrics(
      platformInput.enabled,
      platformInput.customValue,
      customMode,
      potentiel,
      diffusionDays,
      params,
    )

    rows.push({
      id,
      label,
      enabled: platformInput.enabled,
      potentiel,
      diffusionDays: platformInput.enabled ? diffusionDays : null,
      coefFreq: platformInput.enabled ? params.coefFreq : null,
      ideal,
      max,
      custom,
    })
  }

  return {
    alerts: buildAlerts(inputs),
    rows,
    synthesis: {
      ideal: buildSynthesisColumn(rows, 'ideal', inputs, globalParams),
      max: buildSynthesisColumn(rows, 'max', inputs, globalParams),
      custom: buildSynthesisColumn(rows, 'custom', inputs, globalParams),
    },
  }
}

/** État initial vide — l'utilisateur saisit tous les chiffres. */
export const SIMULATEUR_DEFAULT_INPUTS: SimulateurInputs = {
  diffusionDays: 1,
  potentiels: {
    meta: null,
    linkedin: null,
    snapchat: null,
    tiktok: null,
  },
  customMode: 'impressions',
  platforms: {
    meta: { enabled: false, customValue: null },
    display: { enabled: false, customValue: null },
    youtube: { enabled: false, customValue: null },
    linkedin: { enabled: false, customValue: null },
    snapchat: { enabled: false, customValue: null },
    tiktok: { enabled: false, customValue: null },
  },
}

export function parseSimulateurNumber(s: string): number | null {
  const t = s.trim().replace(/\s/g, '').replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 0) return null
  return n
}

export function parseSimulateurPositiveInt(s: string): number | null {
  const n = parseSimulateurNumber(s)
  if (n === null || n < 1) return null
  return Math.floor(n)
}

export function parseSimulateurDiffusionDays(s: string): number | null {
  const n = parseSimulateurNumber(s)
  if (n === null || n < 1) return null
  return Math.floor(n)
}
