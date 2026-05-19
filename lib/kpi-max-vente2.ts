/** KPIs max — calculateur Vente 2 — formules métier plates-formes multiples */

export type KpiMaxPlatformId = 'meta' | 'display' | 'youtube' | 'linkedin' | 'snapchat' | 'tiktok'

export const KPI_MAX_PLATFORM_ORDER: { id: KpiMaxPlatformId; label: string }[] = [
  { id: 'meta', label: 'META' },
  { id: 'display', label: 'Display' },
  { id: 'youtube', label: 'Youtube' },
  { id: 'linkedin', label: 'LinkedIn' },
  { id: 'snapchat', label: 'Snapchat' },
  { id: 'tiktok', label: 'Tiktok' },
]

/** Libellés du barème impressions (strat. idéale / max) — parenthèses sur la fréquence seulement, comme le tableau métier. */
export const KPI_MAX_IMPRESSION_FORMULAS: Record<KpiMaxPlatformId, { idealCaption: string; maxCaption: string }> = {
  meta: {
    idealCaption: 'Potentiel × 70 % × (1,5 / mois)',
    maxCaption: 'Potentiel × 80 % × (2 / mois)',
  },
  display: {
    idealCaption: 'Potentiel × (2 / mois)',
    maxCaption: 'Potentiel × (3 / mois)',
  },
  youtube: {
    idealCaption: 'Potentiel × 70 % × (1 / mois)',
    maxCaption: 'Potentiel × 80 % × (2 / mois)',
  },
  linkedin: {
    idealCaption: 'Potentiel × 70 % × (1,5 / mois)',
    maxCaption: 'Potentiel × 80 % × (2 / mois)',
  },
  snapchat: {
    idealCaption: 'Potentiel × 70 % × (1,5 / mois)',
    maxCaption: 'Potentiel × 80 % × (2 / mois)',
  },
  tiktok: {
    idealCaption: 'Potentiel × 70 % × (1,5 / mois)',
    maxCaption: 'Potentiel × 80 % × (2 / mois)',
  },
}

/** Lignes du tableau de référence (ordre d’affichage = {@link KPI_MAX_PLATFORM_ORDER}). */
export const KPI_MAX_IMPRESSIONS_BAREME_ROWS: ReadonlyArray<{
  label: string
  idealCaption: string
  maxCaption: string
}> = KPI_MAX_PLATFORM_ORDER.map(({ id, label }) => ({
  label,
  idealCaption: KPI_MAX_IMPRESSION_FORMULAS[id].idealCaption,
  maxCaption: KPI_MAX_IMPRESSION_FORMULAS[id].maxCaption,
}))

/** Libellés du barème clics (strat. idéale / max). */
export const KPI_MAX_CLICK_FORMULAS: Record<KpiMaxPlatformId, { idealCaption: string; maxCaption: string }> = {
  meta: {
    idealCaption: 'Potentiel × 70 % × (1 % / mois)',
    maxCaption: 'Potentiel × 80 % × (1,5 % / mois)',
  },
  display: {
    idealCaption: 'Potentiel × (1 % / mois)',
    maxCaption: 'Potentiel × (1,5 % / mois)',
  },
  youtube: {
    idealCaption: 'Potentiel × 70 % × (1 % / mois)',
    maxCaption: 'Potentiel × 80 % × (1,5 % / mois)',
  },
  linkedin: {
    idealCaption: 'Potentiel × 70 % × (1 % / mois)',
    maxCaption: 'Potentiel × 80 % × (1,5 % / mois)',
  },
  snapchat: {
    idealCaption: 'Potentiel × 70 % × (1 % / mois)',
    maxCaption: 'Potentiel × 80 % × (1,5 % / mois)',
  },
  tiktok: {
    idealCaption: 'Potentiel × 70 % × (1 % / mois)',
    maxCaption: 'Potentiel × 80 % × (1,5 % / mois)',
  },
}

/** Lignes du tableau de référence clics. */
export const KPI_MAX_CLICKS_BAREME_ROWS: ReadonlyArray<{
  label: string
  idealCaption: string
  maxCaption: string
}> = KPI_MAX_PLATFORM_ORDER.map(({ id, label }) => ({
  label,
  idealCaption: KPI_MAX_CLICK_FORMULAS[id].idealCaption,
  maxCaption: KPI_MAX_CLICK_FORMULAS[id].maxCaption,
}))

/** Potentiels « À remplir » : META, LinkedIn, Snapchat, Tiktok — Display / Youtube = basés sur META */
export type KpiMaxPotentielField = Exclude<KpiMaxPlatformId, 'display' | 'youtube'>

export function kpiMaxPlatformNeedsPotentielBox(id: KpiMaxPlatformId): id is KpiMaxPotentielField {
  return id === 'meta' || id === 'linkedin' || id === 'snapchat' || id === 'tiktok'
}

/**
 * Mois utilisés dans les formules impressions : **tranches** de 30 jours complètes
 * (1–30 j → 1 mois, 31–60 j → 2 mois, etc.), pas une division proportionnelle.
 */
export function kpiMaxMonthsEquivalence(diffusionDays: number): number {
  const d = Math.max(0, diffusionDays)
  if (d === 0) return 0
  return Math.ceil(d / 30)
}

/** Display : potentiel × (2 ou 3 / mois) × nombre de mois (tranches de 30 j.) ; potentiel = base META. */
const DISPLAY_IMPRESSIONS_IDEAL_PER_MONTH = 2
const DISPLAY_IMPRESSIONS_MAX_PER_MONTH = 3

/** Youtube stratégie idéale : potentiel × 70 % × 1 / mois × nombre de mois (tranches de 30 j.) */
const YOUTUBE_IDEAL_IMPRESSIONS_PER_MONTH = 0.7 * 1
/** Youtube stratégie max : potentiel × 80 % × 2 / mois × nombre de mois (tranches de 30 j.) */
const YOUTUBE_MAX_IMPRESSIONS_PER_MONTH = 0.8 * 2

/** Stratégie idéale (META, LinkedIn, Snapchat, TikTok) : potentiel × 70 % × 1,5 / mois × nombre de mois (tranches de 30 j.) */
const META_IDEAL_IMPRESSIONS_PER_MONTH = 0.7 * 1.5
/** Stratégie max (META, LinkedIn, Snapchat, TikTok) : potentiel × 80 % × 2 / mois × nombre de mois (tranches de 30 j.) */
const META_MAX_IMPRESSIONS_PER_MONTH = 0.8 * 2

/** Clics META / LinkedIn / Snapchat / TikTok : potentiel × 70 % × 1 % / mois · max × 80 % × 1,5 % / mois. */
const META_IDEAL_CLICKS_PER_MONTH = 0.7 * 0.01
const META_MAX_CLICKS_PER_MONTH = 0.8 * 0.015

/** Display : potentiel × 1 % / mois · max × 1,5 % / mois (potentiel = base META). */
const DISPLAY_IDEAL_CLICKS_PER_MONTH = 0.01
const DISPLAY_MAX_CLICKS_PER_MONTH = 0.015

/** Youtube : potentiel × 70 % × 1 % / mois · max × 80 % × 1,5 % / mois. */
const YOUTUBE_IDEAL_CLICKS_PER_MONTH = 0.7 * 0.01
const YOUTUBE_MAX_CLICKS_PER_MONTH = 0.8 * 0.015

function roundKpiQuantity(v: number): number {
  return Math.round(Math.max(0, v))
}

function computeClicksForPlatform(
  platformId: KpiMaxPlatformId,
  potentiel: number,
  months: number,
): { idealClics: number; maxClics: number } {
  const p = Math.max(1, Math.floor(potentiel))
  const m = Math.max(0, months)

  if (platformId === 'display') {
    return {
      idealClics: roundKpiQuantity(p * DISPLAY_IDEAL_CLICKS_PER_MONTH * m),
      maxClics: roundKpiQuantity(p * DISPLAY_MAX_CLICKS_PER_MONTH * m),
    }
  }
  if (platformId === 'youtube') {
    return {
      idealClics: roundKpiQuantity(p * YOUTUBE_IDEAL_CLICKS_PER_MONTH * m),
      maxClics: roundKpiQuantity(p * YOUTUBE_MAX_CLICKS_PER_MONTH * m),
    }
  }
  return {
    idealClics: roundKpiQuantity(p * META_IDEAL_CLICKS_PER_MONTH * m),
    maxClics: roundKpiQuantity(p * META_MAX_CLICKS_PER_MONTH * m),
  }
}

/** Plafond du taux de pénétration KPIs max (en %). */
export const KPI_MAX_PENETRATION_CAP_PCT = 85

export type KpiMaxPenetrationMetric = 'impressions' | 'clicks'

/** Potentiel global utilisé comme dénominateur du taux de pénétration (vente). */
export function kpiMaxGlobalPotentiel(
  platformId: KpiMaxPlatformId,
  comptes: KpiMaxComptesParsed,
): number {
  if (platformId === 'meta' || platformId === 'display' || platformId === 'youtube') {
    return Math.max(1, Math.floor(comptes.meta))
  }
  if (platformId === 'linkedin') return Math.max(1, Math.floor(comptes.linkedin))
  if (platformId === 'snapchat') return Math.max(1, Math.floor(comptes.snapchat))
  return Math.max(1, Math.floor(comptes.tiktok))
}

/**
 * Taux brut de pénétration des KPIs vendus vs potentiel global.
 * Impressions : (vendus / 1,8) × 100 / potentiel · Clics : vendus × 100 / potentiel.
 */
export function kpiMaxSoldPenetrationRawPct(
  kpisVendus: number,
  potentielGlobal: number,
  metric: KpiMaxPenetrationMetric,
): number {
  const sold = Math.max(0, Math.floor(kpisVendus))
  const denom = Math.max(1, Math.abs(Math.floor(potentielGlobal)) || 1)
  if (metric === 'clicks') {
    return sold * (100 / denom)
  }
  return (sold / 1.8) * (100 / denom)
}

/** Même formule, plafonnée à {@link KPI_MAX_PENETRATION_CAP_PCT} % (plancher 0 %). */
export function kpiMaxSoldPenetrationPct(
  kpisVendus: number,
  potentielGlobal: number,
  metric: KpiMaxPenetrationMetric,
): number {
  const raw = kpiMaxSoldPenetrationRawPct(kpisVendus, potentielGlobal, metric)
  return Math.min(KPI_MAX_PENETRATION_CAP_PCT, Math.max(0, raw))
}

/** @deprecated Utiliser {@link kpiMaxSoldPenetrationRawPct} pour la vente. */
export function kpiMaxPenetrationRawPct(impressions: number, comptes: number): number {
  return kpiMaxSoldPenetrationRawPct(impressions, comptes, 'impressions')
}

/** @deprecated Utiliser {@link kpiMaxSoldPenetrationPct} pour la vente. */
export function kpiMaxPenetrationPct(impressions: number, comptes: number): number {
  return kpiMaxSoldPenetrationPct(impressions, comptes, 'impressions')
}

export type KpiMaxComptesParsed = {
  meta: number
  linkedin: number
  snapchat: number
  tiktok: number
}

export type KpiMaxComputedRow = {
  id: KpiMaxPlatformId
  label: string
  metaBasedWarning: boolean
  idealImpressions: number
  maxImpressions: number
  idealClics: number
  maxClics: number
  idealClickFormulaCaption: string
  maxClickFormulaCaption: string
  /** Potentiel pour le taux (I÷1,8)×100÷potentiel ; META saisi ou potentiel LP par plateforme */
  penetrationComptes: number
  showMaxPenetration: boolean
  idealFormulaCaption: string
  maxFormulaCaption: string
}

function roundImpressions(v: number): number {
  return Math.round(Math.max(0, v))
}

/** Prépare une ligne uniquement si la plateforme est cochée. */
export function computeKpiMaxRowsForEnabledPlatforms(
  enabled: Record<KpiMaxPlatformId, boolean>,
  c: KpiMaxComptesParsed,
  diffusionDays: number,
): KpiMaxComputedRow[] {
  const months = kpiMaxMonthsEquivalence(diffusionDays)
  const M = Math.max(0, Math.floor(c.meta))
  const Li = Math.max(0, Math.floor(c.linkedin))
  const Sn = Math.max(0, Math.floor(c.snapchat))
  const Tt = Math.max(0, Math.floor(c.tiktok))

  const byId: Partial<Record<KpiMaxPlatformId, KpiMaxComputedRow>> = {}

  const mergeClicks = (
    platformId: KpiMaxPlatformId,
    row: Omit<
      KpiMaxComputedRow,
      'idealClics' | 'maxClics' | 'idealClickFormulaCaption' | 'maxClickFormulaCaption'
    >,
    potentiel: number,
  ): KpiMaxComputedRow => {
    const clicks = computeClicksForPlatform(platformId, potentiel, months)
    const clickCap = KPI_MAX_CLICK_FORMULAS[platformId]
    return {
      ...row,
      idealClics: clicks.idealClics,
      maxClics: clicks.maxClics,
      idealClickFormulaCaption: clickCap.idealCaption,
      maxClickFormulaCaption: clickCap.maxCaption,
    }
  }

  if (enabled.meta) {
    const metaIdeal = M * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const metaMax = M * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.meta
    byId.meta = mergeClicks('meta', {
      id: 'meta',
      label: 'META',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(metaIdeal),
      maxImpressions: roundImpressions(metaMax),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }, M)
  }

  if (enabled.display) {
    const cap = KPI_MAX_IMPRESSION_FORMULAS.display
    byId.display = mergeClicks('display', {
      id: 'display',
      label: 'Display',
      metaBasedWarning: true,
      idealImpressions: roundImpressions(M * DISPLAY_IMPRESSIONS_IDEAL_PER_MONTH * months),
      maxImpressions: roundImpressions(M * DISPLAY_IMPRESSIONS_MAX_PER_MONTH * months),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }, M)
  }

  if (enabled.youtube) {
    const idealY = M * YOUTUBE_IDEAL_IMPRESSIONS_PER_MONTH * months
    const maxY = M * YOUTUBE_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.youtube
    byId.youtube = mergeClicks('youtube', {
      id: 'youtube',
      label: 'Youtube',
      metaBasedWarning: true,
      idealImpressions: roundImpressions(idealY),
      maxImpressions: roundImpressions(maxY),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }, M)
  }

  if (enabled.linkedin) {
    const linkedinIdeal = Li * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const linkedinMax = Li * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.linkedin
    byId.linkedin = mergeClicks('linkedin', {
      id: 'linkedin',
      label: 'LinkedIn',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(linkedinIdeal),
      maxImpressions: roundImpressions(linkedinMax),
      penetrationComptes: Math.max(Li, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }, Li)
  }

  if (enabled.snapchat) {
    const snapIdeal = Sn * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const snapMax = Sn * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.snapchat
    byId.snapchat = mergeClicks('snapchat', {
      id: 'snapchat',
      label: 'Snapchat',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(snapIdeal),
      maxImpressions: roundImpressions(snapMax),
      penetrationComptes: Math.max(Sn, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }, Sn)
  }

  if (enabled.tiktok) {
    const tiktokIdeal = Tt * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const tiktokMax = Tt * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.tiktok
    byId.tiktok = mergeClicks('tiktok', {
      id: 'tiktok',
      label: 'Tiktok',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(tiktokIdeal),
      maxImpressions: roundImpressions(tiktokMax),
      penetrationComptes: Math.max(Tt, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }, Tt)
  }

  return KPI_MAX_PLATFORM_ORDER.map(({ id }) => byId[id]).filter((row): row is KpiMaxComputedRow => Boolean(row))
}

export type KpiMaxInputsValidity = {
  ok: boolean
  diffusionDays?: number
  comptes?: KpiMaxComptesParsed
  /** KPIs que le commercial souhaite vendre (impressions ou clics). */
  kpisVendus?: number
  /** Message utilisateur si !ok */
  reason?: string
}

export type KpiMaxCompteStrings = {
  meta: string
  linkedin: string
  snapchat: string
  tiktok: string
}

function parseKpisVendus(s: string): number | null {
  const t = s.trim().replace(/\s/g, '').replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.floor(n)
}

/** Valide entrées lorsque tout est obligatoirement rempli selon plates-formes cochées */
export function kpiMaxValidateInputs(
  enabled: Record<KpiMaxPlatformId, boolean>,
  diffusionDaysStr: string,
  compteStrings: KpiMaxCompteStrings,
  kpisVendusStr?: string,
): KpiMaxInputsValidity {
  const anyPlatform = KPI_MAX_PLATFORM_ORDER.some(({ id }) => enabled[id])
  if (!anyPlatform) {
    return { ok: false, reason: 'Sélectionnez une plateforme.' }
  }

  const jRaw = diffusionDaysStr.trim().replace(',', '.')
  const jNum = parseFloat(jRaw)
  if (jRaw === '' || Number.isNaN(jNum) || jNum < 1) {
    return { ok: false, reason: 'Indiquez une durée de diffusion d’au moins 1 jour.' }
  }
  const diffusionDays = Math.max(1, Math.floor(jNum))

  function parsePotentiel(s: string): number | null {
    const t = s.trim().replace(/\s/g, '').replace(',', '.')
    if (t === '') return null
    const n = parseFloat(t)
    if (!Number.isFinite(n) || n < 1) return null
    return Math.floor(n)
  }

  const meta = parsePotentiel(compteStrings.meta)
  const linkedin = parsePotentiel(compteStrings.linkedin)
  const snapchat = parsePotentiel(compteStrings.snapchat)
  const tiktok = parsePotentiel(compteStrings.tiktok)

  const needMeta = enabled.meta || enabled.display || enabled.youtube
  if (needMeta && meta === null) {
    return { ok: false, reason: 'Renseignez le potentiel.' }
  }

  if (enabled.linkedin && linkedin === null) {
    return { ok: false, reason: 'Renseignez le potentiel.' }
  }
  if (enabled.snapchat && snapchat === null) {
    return { ok: false, reason: 'Renseignez le potentiel.' }
  }
  if (enabled.tiktok && tiktok === null) {
    return { ok: false, reason: 'Renseignez le potentiel.' }
  }

  let kpisVendus: number | undefined
  if (kpisVendusStr !== undefined) {
    const parsed = parseKpisVendus(kpisVendusStr)
    if (parsed === null) {
      return { ok: false, reason: 'Renseignez les KPIs que vous voulez vendre (nombre ≥ 0).' }
    }
    kpisVendus = parsed
  }

  return {
    ok: true,
    diffusionDays,
    comptes: {
      meta: meta ?? 0,
      linkedin: linkedin ?? 0,
      snapchat: snapchat ?? 0,
      tiktok: tiktok ?? 0,
    },
    kpisVendus,
  }
}

/** État défaut plates-formes décochées */
export function kpiMaxDefaultPlatformsEnabled(): Record<KpiMaxPlatformId, boolean> {
  return {
    meta: false,
    display: false,
    youtube: false,
    linkedin: false,
    snapchat: false,
    tiktok: false,
  }
}

/** Valeur du sélecteur lorsqu’aucune plateforme n’est choisie. */
export const KPI_MAX_RADIO_NONE = '__none__'

/** Sélection exclusive : une seule plateforme active. */
export function kpiMaxSelectedToEnabled(selected: KpiMaxPlatformId | null): Record<KpiMaxPlatformId, boolean> {
  const base = kpiMaxDefaultPlatformsEnabled()
  if (selected) base[selected] = true
  return base
}
