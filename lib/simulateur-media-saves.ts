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
  attachment_path: string | null
  attachment_filename: string | null
  attachment_mime_type: string | null
  attachment_file_size: number | null
  created_at: string
  updated_at: string
}

export type SimulateurMediaSaveAttachment = {
  attachment_path: string
  attachment_filename: string
  attachment_mime_type: string | null
  attachment_file_size: number | null
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

export function getDefaultSimulateurMediaProjectName(): string {
  return `Plan média — ${new Date().toLocaleDateString('fr-FR')}`
}

export function simulateurMediaProjectNameToPdfFilename(name: string): string {
  const base = name.trim().replace(/\s+/g, '_').replace(/[^\w.-]+/g, '')
  return `${base || 'plan_media'}.pdf`
}
