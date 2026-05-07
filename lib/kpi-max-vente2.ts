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

/** Plafond du taux de pénétration KPIs max (en %). */
export const KPI_MAX_PENETRATION_CAP_PCT = 85

/** Taux brut (I / 1,8) × 100 / potentiel, sans plafond. */
export function kpiMaxPenetrationRawPct(impressions: number, comptes: number): number {
  const denom = Math.max(1, Math.abs(Math.floor(comptes)) || 1)
  const im = Math.max(0, impressions)
  return (im / 1.8) * (100 / denom)
}

/** Même formule, plafonnée à {@link KPI_MAX_PENETRATION_CAP_PCT} % (plancher 0 %). */
export function kpiMaxPenetrationPct(impressions: number, comptes: number): number {
  const raw = kpiMaxPenetrationRawPct(impressions, comptes)
  return Math.min(KPI_MAX_PENETRATION_CAP_PCT, Math.max(0, raw))
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

  if (enabled.meta) {
    const metaIdeal = M * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const metaMax = M * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.meta
    byId.meta = {
      id: 'meta',
      label: 'META',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(metaIdeal),
      maxImpressions: roundImpressions(metaMax),
      /** Dénominateur du taux : potentiel META saisi */
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }
  }

  if (enabled.display) {
    const cap = KPI_MAX_IMPRESSION_FORMULAS.display
    byId.display = {
      id: 'display',
      label: 'Display',
      metaBasedWarning: true,
      idealImpressions: roundImpressions(M * DISPLAY_IMPRESSIONS_IDEAL_PER_MONTH * months),
      maxImpressions: roundImpressions(M * DISPLAY_IMPRESSIONS_MAX_PER_MONTH * months),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }
  }

  if (enabled.youtube) {
    const idealY = M * YOUTUBE_IDEAL_IMPRESSIONS_PER_MONTH * months
    const maxY = M * YOUTUBE_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.youtube
    byId.youtube = {
      id: 'youtube',
      label: 'Youtube',
      metaBasedWarning: true,
      idealImpressions: roundImpressions(idealY),
      maxImpressions: roundImpressions(maxY),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }
  }

  if (enabled.linkedin) {
    const linkedinIdeal = Li * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const linkedinMax = Li * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.linkedin
    byId.linkedin = {
      id: 'linkedin',
      label: 'LinkedIn',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(linkedinIdeal),
      maxImpressions: roundImpressions(linkedinMax),
      penetrationComptes: Math.max(Li, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }
  }

  if (enabled.snapchat) {
    const snapIdeal = Sn * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const snapMax = Sn * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.snapchat
    byId.snapchat = {
      id: 'snapchat',
      label: 'Snapchat',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(snapIdeal),
      maxImpressions: roundImpressions(snapMax),
      penetrationComptes: Math.max(Sn, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }
  }

  if (enabled.tiktok) {
    const tiktokIdeal = Tt * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const tiktokMax = Tt * META_MAX_IMPRESSIONS_PER_MONTH * months
    const cap = KPI_MAX_IMPRESSION_FORMULAS.tiktok
    byId.tiktok = {
      id: 'tiktok',
      label: 'Tiktok',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(tiktokIdeal),
      maxImpressions: roundImpressions(tiktokMax),
      penetrationComptes: Math.max(Tt, 1),
      showMaxPenetration: true,
      idealFormulaCaption: cap.idealCaption,
      maxFormulaCaption: cap.maxCaption,
    }
  }

  return KPI_MAX_PLATFORM_ORDER.map(({ id }) => byId[id]).filter((row): row is KpiMaxComputedRow => Boolean(row))
}

export type KpiMaxInputsValidity = {
  ok: boolean
  diffusionDays?: number
  comptes?: KpiMaxComptesParsed
  /** Message utilisateur si !ok */
  reason?: string
}

export type KpiMaxCompteStrings = {
  meta: string
  linkedin: string
  snapchat: string
  tiktok: string
}

/** Valide entrées lorsque tout est obligatoirement rempli selon plates-formes cochées */
export function kpiMaxValidateInputs(
  enabled: Record<KpiMaxPlatformId, boolean>,
  diffusionDaysStr: string,
  compteStrings: KpiMaxCompteStrings,
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

  return {
    ok: true,
    diffusionDays,
    comptes: {
      meta: meta ?? 0,
      linkedin: linkedin ?? 0,
      snapchat: snapchat ?? 0,
      tiktok: tiktok ?? 0,
    },
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
