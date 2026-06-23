export type IaActionId =
  | 'personae_pdf'
  | 'post_campaign_pdf'
  | 'mail_prospection'
  | 'social_analysis_url'
  | 'website_analysis_url'

export type IaInputKind = 'none' | 'pdf' | 'url' | 'pdf_and_image'

export type IaActionStatus = 'available' | 'coming_soon'

export type IaActionDefinition = {
  id: IaActionId
  label: string
  description: string
  inputKind: IaInputKind
  status: IaActionStatus
}

export const IA_ACTIONS: IaActionDefinition[] = [
  {
    id: 'personae_pdf',
    label: 'Personae',
    description: 'Construire des personae marketing à partir d’un PDF (brief, étude, rapport).',
    inputKind: 'pdf',
    status: 'available',
  },
  {
    id: 'post_campaign_pdf',
    label: 'Analyse & reco post-campagne',
    description: 'Analyser un rapport de campagne PDF et proposer des recommandations.',
    inputKind: 'pdf',
    status: 'available',
  },
  {
    id: 'mail_prospection',
    label: 'Mail de prospection avec photo client',
    description: 'Rédiger un email de prospection personnalisé à partir d’un PDF et d’une photo.',
    inputKind: 'pdf_and_image',
    status: 'available',
  },
  {
    id: 'social_analysis_url',
    label: 'Analyse réseaux sociaux (client & concurrents)',
    description: 'Analyser la présence social media à partir d’URLs (pages publiques).',
    inputKind: 'url',
    status: 'available',
  },
  {
    id: 'website_analysis_url',
    label: 'Analyse site web client',
    description: 'Auditer un site web client à partir de son URL.',
    inputKind: 'url',
    status: 'available',
  },
]

export function getIaAction(id: IaActionId): IaActionDefinition | undefined {
  return IA_ACTIONS.find((action) => action.id === id)
}

export function isIaActionId(value: string): value is IaActionId {
  return IA_ACTIONS.some((action) => action.id === value)
}

export function getIaActionLabel(id: IaActionId): string {
  return getIaAction(id)?.label ?? id
}
