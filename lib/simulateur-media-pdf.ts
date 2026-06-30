import { downloadSimulateurMediaPdf } from '@/components/vente/SimulateurMediaPdfDocument'
import { buildSimulateurMediaRecapText } from '@/lib/simulateur-media-recap'
import {
  getDefaultSimulateurMediaProjectName,
  simulateurMediaProjectNameToPdfFilename,
} from '@/lib/simulateur-media-saves'
import type { SimulateurCustomMode, SimulateurResult } from '@/lib/simulateur-media-link'
import { parseSimulateurDiffusionDays } from '@/lib/simulateur-media-link'

export { getDefaultSimulateurMediaProjectName, simulateurMediaProjectNameToPdfFilename }

export async function exportSimulateurMediaPdf(params: {
  projectName: string
  userName?: string
  diffusionDays: string
  result: SimulateurResult
  customResult?: SimulateurResult | null
  customMode?: SimulateurCustomMode
}): Promise<void> {
  const projectName = params.projectName.trim() || getDefaultSimulateurMediaProjectName()
  const body = buildSimulateurMediaRecapText({
    result: params.result,
    diffusionDays: parseSimulateurDiffusionDays(params.diffusionDays),
    customResult: params.customResult ?? undefined,
    customMode: params.customMode,
  })

  await downloadSimulateurMediaPdf({
    title: projectName,
    dateLabel: new Date().toLocaleString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }),
    userName: params.userName,
    body,
    filename: simulateurMediaProjectNameToPdfFilename(projectName),
  })
}
