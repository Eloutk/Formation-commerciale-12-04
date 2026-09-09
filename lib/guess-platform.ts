import { isBusinessDayLocal } from '@/lib/french-holidays'

/** @deprecated Préférer isBusinessDayLocal (exclut aussi les fériés). */
export function isWeekendLocal(date = new Date()): boolean {
  return !isBusinessDayLocal(date)
}

/** Prochain lundi (ou aujourd'hui si déjà un jour ouvré — en pratique appelé le week-end). */
export function nextMondayLabel(from = new Date()): string {
  const d = new Date(from.getFullYear(), from.getMonth(), from.getDate())
  const day = d.getDay()
  const add = day === 0 ? 1 : day === 6 ? 2 : 0
  d.setDate(d.getDate() + add)
  return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })
}

export function formatNextPlayHint(nextBusinessDayIso: string | null | undefined, today = new Date()): string {
  if (!nextBusinessDayIso) return 'Reviens le prochain jour ouvré pour continuer ta série.'

  const tomorrow = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1)
  const tomorrowIso = [
    tomorrow.getFullYear(),
    String(tomorrow.getMonth() + 1).padStart(2, '0'),
    String(tomorrow.getDate()).padStart(2, '0'),
  ].join('-')

  if (nextBusinessDayIso === tomorrowIso) {
    return 'Reviens demain pour garder ta série (+1 pt de régularité).'
  }

  const [y, m, d] = nextBusinessDayIso.split('-').map(Number)
  const next = new Date(y, (m ?? 1) - 1, d ?? 1)
  const label = next.toLocaleDateString('fr-FR', { weekday: 'long' })
  return `Reviens ${label} pour garder ta série (+1 pt de régularité).`
}

export type GuessPlatformStats = {
  current_streak: number
  record_streak: number
  total_points: number
  daily_points?: number
  guess_points?: number
  motus_points?: number
  today?: string
  is_business_day?: boolean
  next_business_day?: string
}

export type GuessPlatformQuestion = {
  id: string
  title: string
  category: string
  difficulty: string
  answer_options: string[]
  clues: string[]
  clues_count: number
}

export type GuessPlatformResult = {
  already_answered: boolean
  selected_answer: string
  correct_answer: string
  is_correct: boolean
  hints_used: number
  puzzle_points: number
  streak_bonus: number
  points: number
  explanation: string
  clues: string[]
  answer_options: string[]
  stats?: GuessPlatformStats
  next_business_day?: string
  current_streak?: number
}

export function parseJsonStringArray(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String)
  return []
}
