import { addDaysLocal, todayIsoLocal } from '@/lib/date-local'
import { toLocalIsoDate } from '@/lib/daily-question-cycle'

export type AnswerStatRow = {
  is_correct: boolean
  answered_at: string
}

export type PersonalQuestionStats = {
  answered: number
  correct: number
  percent: number
  currentStreak: number
  recordStreak: number
}

function uniqueSortedDays(rows: AnswerStatRow[]): string[] {
  const days = new Set(rows.map((row) => toLocalIsoDate(row.answered_at)))
  return [...days].sort()
}

function longestConsecutiveRun(days: string[]): number {
  if (days.length === 0) return 0
  let best = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const prev = days[i - 1]
    const expected = addDaysLocal(prev, 1)
    if (days[i] === expected) {
      run += 1
      best = Math.max(best, run)
    } else {
      run = 1
    }
  }
  return best
}

function streakEndingOn(days: Set<string>, endIso: string): number {
  let count = 0
  let cursor = endIso
  while (days.has(cursor)) {
    count += 1
    cursor = addDaysLocal(cursor, -1)
  }
  return count
}

/** Série vivante : aujourd'hui, ou hier si pas encore répondu aujourd'hui. */
export function computeCurrentStreak(days: string[], today = todayIsoLocal()): number {
  const set = new Set(days)
  if (set.has(today)) return streakEndingOn(set, today)
  const yesterday = addDaysLocal(today, -1)
  if (set.has(yesterday)) return streakEndingOn(set, yesterday)
  return 0
}

export function computePersonalQuestionStats(
  rows: AnswerStatRow[],
  today = todayIsoLocal()
): PersonalQuestionStats {
  const answered = rows.length
  const correct = rows.filter((row) => row.is_correct).length
  const percent = answered === 0 ? 0 : Math.round((correct / answered) * 100)
  const days = uniqueSortedDays(rows)
  return {
    answered,
    correct,
    percent,
    currentStreak: computeCurrentStreak(days, today),
    recordStreak: longestConsecutiveRun(days),
  }
}
