import type { SimulateurCustomMode, SimulateurPlatformId } from '@/lib/simulateur-media-link'

export type SimulateurMediaSaveContent = {
  version: 1
  form: {
    diffusionDays: string
    potentielMeta: string
    potentielLinkedin: string
    potentielSnapchat: string
    potentielTiktok: string
    enabled: Record<SimulateurPlatformId, boolean>
  }
  customPanelOpen: boolean
  customMode: SimulateurCustomMode
  customValues: Record<SimulateurPlatformId, string>
}

export type SimulateurMediaSaveRecord = {
  id: string
  user_id: string
  name: string
  summary_impressions: number
  content: SimulateurMediaSaveContent
  created_at: string
  updated_at: string
}

export function formatSimulateurMediaSaveDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatSimulateurMediaImpressions(n: number): string {
  return `${Math.round(n).toLocaleString('fr-FR')} impr.`
}

export function countEnabledPlatforms(content: SimulateurMediaSaveContent): number {
  return Object.values(content.form.enabled).filter(Boolean).length
}
