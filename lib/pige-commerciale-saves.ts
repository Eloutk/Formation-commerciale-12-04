export type PigeCommercialeSaveRecord = {
  id: string
  user_id: string
  project_id: string
  name: string
  comment: string | null
  image_path: string
  original_filename: string
  mime_type: string | null
  file_size: number | null
  created_at: string
  updated_at: string
}

export type PigeCommercialeProject = {
  project_id: string
  name: string
  comment: string | null
  file_count: number
  created_at: string
  updated_at: string
  captures: PigeCommercialeSaveRecord[]
}

export function formatPigeCommercialeSaveDate(iso: string): string {
  return new Date(iso).toLocaleString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function getDefaultPigeCommercialeName(filename: string): string {
  const base = filename.replace(/\.[^.]+$/, '').trim()
  if (base) return `Pige — ${base}`
  return `Pige — ${new Date().toLocaleDateString('fr-FR')}`
}

export function getDefaultPigeCommercialeProjectName(): string {
  return `Pige — ${new Date().toLocaleDateString('fr-FR')}`
}

export function groupPigeCommercialeSavesByProject(
  saves: PigeCommercialeSaveRecord[],
): PigeCommercialeProject[] {
  const byProject = new Map<string, PigeCommercialeSaveRecord[]>()

  for (const save of saves) {
    const key = save.project_id || save.id
    const list = byProject.get(key) ?? []
    list.push(save)
    byProject.set(key, list)
  }

  return Array.from(byProject.entries())
    .map(([project_id, captures]) => {
      const sorted = [...captures].sort(
        (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime(),
      )
      const latest = sorted.reduce(
        (acc, capture) =>
          new Date(capture.updated_at) > new Date(acc.updated_at) ? capture : acc,
        sorted[0],
      )
      return {
        project_id,
        name: sorted[0].name,
        comment: sorted[0].comment,
        file_count: sorted.length,
        created_at: sorted[0].created_at,
        updated_at: latest.updated_at,
        captures: sorted,
      }
    })
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
}
