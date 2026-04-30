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

/** Potentiels « À remplir » : META, LinkedIn, Snapchat, Tiktok — Display / Youtube = basés sur META */
export type KpiMaxPotentielField = Exclude<KpiMaxPlatformId, 'display' | 'youtube'>

export function kpiMaxPlatformNeedsPotentielBox(id: KpiMaxPlatformId): id is KpiMaxPotentielField {
  return id === 'meta' || id === 'linkedin' || id === 'snapchat' || id === 'tiktok'
}

/** Mois équivalent : durée campagne / 30 jours */
export function kpiMaxMonthsEquivalence(diffusionDays: number): number {
  return Math.max(0, diffusionDays) / 30
}

/** Display : impressions / mois (potentiel = base META saisie comme pour META). */
const DISPLAY_IMPRESSIONS_IDEAL_PER_MONTH = 2
const DISPLAY_IMPRESSIONS_MAX_PER_MONTH = 3

/** Youtube stratégie idéale : potentiel × 70 % × 1 / mois × mois équivalents campagne */
const YOUTUBE_IDEAL_IMPRESSIONS_PER_MONTH = 0.7 * 1
/** Youtube stratégie max : potentiel × 80 % × 2 / mois × mois équivalents campagne */
const YOUTUBE_MAX_IMPRESSIONS_PER_MONTH = 0.8 * 2

/** Stratégie idéale (META, LinkedIn, Snapchat, TikTok) : potentiel × 70 % × 1,5 / mois × mois équivalents campagne */
const META_IDEAL_IMPRESSIONS_PER_MONTH = 0.7 * 1.5
/** Stratégie max (META, LinkedIn, Snapchat, TikTok) : potentiel × 80 % × 2 / mois × mois équivalents campagne */
const META_MAX_IMPRESSIONS_PER_MONTH = 0.8 * 2

/** (Nombre d’impressions / 1,8) × 100 / potentiel, en % ; plafonné à 85 %. */
export function kpiMaxPenetrationPct(impressions: number, comptes: number): number {
  const denom = Math.max(1, Math.abs(Math.floor(comptes)) || 1)
  const im = Math.max(0, impressions)
  const raw = (im / 1.8) * (100 / denom)
  return Math.min(85, Math.max(0, raw))
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
    byId.meta = {
      id: 'meta',
      label: 'META',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(metaIdeal),
      maxImpressions: roundImpressions(metaMax),
      /** Dénominateur du taux : potentiel META saisi */
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: 'Potentiel × 70 % × 1,5 / mois',
      maxFormulaCaption: 'Potentiel × 80 % × 2 / mois',
    }
  }

  if (enabled.display) {
    byId.display = {
      id: 'display',
      label: 'Display',
      metaBasedWarning: true,
      idealImpressions: roundImpressions(M * DISPLAY_IMPRESSIONS_IDEAL_PER_MONTH * months),
      maxImpressions: roundImpressions(M * DISPLAY_IMPRESSIONS_MAX_PER_MONTH * months),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: 'Potentiel × 2 / mois',
      maxFormulaCaption: 'Potentiel × 3 / mois',
    }
  }

  if (enabled.youtube) {
    const idealY = M * YOUTUBE_IDEAL_IMPRESSIONS_PER_MONTH * months
    const maxY = M * YOUTUBE_MAX_IMPRESSIONS_PER_MONTH * months
    byId.youtube = {
      id: 'youtube',
      label: 'Youtube',
      metaBasedWarning: true,
      idealImpressions: roundImpressions(idealY),
      maxImpressions: roundImpressions(maxY),
      penetrationComptes: Math.max(M, 1),
      showMaxPenetration: true,
      idealFormulaCaption: 'Potentiel × 70 % × 1 / mois',
      maxFormulaCaption: 'Potentiel × 80 % × 2 / mois',
    }
  }

  if (enabled.linkedin) {
    const linkedinIdeal = Li * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const linkedinMax = Li * META_MAX_IMPRESSIONS_PER_MONTH * months
    byId.linkedin = {
      id: 'linkedin',
      label: 'LinkedIn',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(linkedinIdeal),
      maxImpressions: roundImpressions(linkedinMax),
      penetrationComptes: Math.max(Li, 1),
      showMaxPenetration: true,
      idealFormulaCaption: 'Potentiel × 70 % × 1,5 / mois',
      maxFormulaCaption: 'Potentiel × 80 % × 2 / mois',
    }
  }

  if (enabled.snapchat) {
    const snapIdeal = Sn * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const snapMax = Sn * META_MAX_IMPRESSIONS_PER_MONTH * months
    byId.snapchat = {
      id: 'snapchat',
      label: 'Snapchat',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(snapIdeal),
      maxImpressions: roundImpressions(snapMax),
      penetrationComptes: Math.max(Sn, 1),
      showMaxPenetration: true,
      idealFormulaCaption: 'Potentiel × 70 % × 1,5 / mois',
      maxFormulaCaption: 'Potentiel × 80 % × 2 / mois',
    }
  }

  if (enabled.tiktok) {
    const tiktokIdeal = Tt * META_IDEAL_IMPRESSIONS_PER_MONTH * months
    const tiktokMax = Tt * META_MAX_IMPRESSIONS_PER_MONTH * months
    byId.tiktok = {
      id: 'tiktok',
      label: 'Tiktok',
      metaBasedWarning: false,
      idealImpressions: roundImpressions(tiktokIdeal),
      maxImpressions: roundImpressions(tiktokMax),
      penetrationComptes: Math.max(Tt, 1),
      showMaxPenetration: true,
      idealFormulaCaption: 'Potentiel × 70 % × 1,5 / mois',
      maxFormulaCaption: 'Potentiel × 80 % × 2 / mois',
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
