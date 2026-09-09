export type MotusTileStatus = 'correct' | 'present' | 'absent' | 'empty' | 'tbd'

export type MotusTile = {
  letter: string
  status: MotusTileStatus
}

export type MotusGuessRow = {
  guess: string
  tiles: MotusTile[]
}

export type MotusQuestion = {
  id: string
  length: number
  first_letter: string
  max_attempts: number
}

export type MotusProgress = {
  guesses: MotusGuessRow[]
  solved: boolean
  attempts: number
  finished: boolean
  points: number
  word?: string | null
}

export type MotusPlayPayload = {
  question: MotusQuestion | null
  progress: MotusProgress | null
}

export type MotusSubmitResult = {
  already_finished?: boolean
  tiles: MotusTile[]
  guesses: MotusGuessRow[]
  solved: boolean
  attempts: number
  finished: boolean
  points: number
  word?: string | null
}

export function normalizeMotusGuesses(raw: unknown): MotusGuessRow[] {
  if (!Array.isArray(raw)) return []
  return raw.map((row) => {
    const guess = String((row as { guess?: string })?.guess || '')
    const tilesRaw = (row as { tiles?: unknown })?.tiles
    const tiles: MotusTile[] = Array.isArray(tilesRaw)
      ? tilesRaw.map((t) => ({
          letter: String((t as { letter?: string })?.letter || ''),
          status: ((t as { status?: string })?.status as MotusTileStatus) || 'absent',
        }))
      : []
    return { guess, tiles }
  })
}

export function stripAccentsUpper(value: string): string {
  return value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase()
    .replace(/[^A-Z]/g, '')
}

export function buildEmptyMotusRows(
  length: number,
  firstLetter: string,
  maxAttempts: number,
  guesses: MotusGuessRow[],
  draft = ''
): MotusTile[][] {
  const rows: MotusTile[][] = []
  const currentIndex = guesses.length
  const normalized = stripAccentsUpper(draft)
  const draftLetters = (
    normalized.startsWith(firstLetter) ? normalized : firstLetter + normalized
  )
    .padEnd(length, ' ')
    .slice(0, length)

  for (let i = 0; i < maxAttempts; i++) {
    if (guesses[i]) {
      rows.push(guesses[i].tiles)
      continue
    }
    const row: MotusTile[] = []
    for (let c = 0; c < length; c++) {
      if (i === currentIndex) {
        const raw = draftLetters[c]
        const letter = c === 0 ? firstLetter : raw === ' ' ? '' : raw
        row.push({ letter, status: letter ? 'tbd' : 'empty' })
      } else {
        row.push({ letter: '', status: 'empty' })
      }
    }
    rows.push(row)
  }
  return rows
}
