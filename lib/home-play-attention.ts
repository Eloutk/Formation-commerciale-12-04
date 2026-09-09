import { isBusinessDayLocal } from '@/lib/french-holidays'
import { getCycleDay } from '@/lib/daily-question-cycle'
import supabase from '@/utils/supabase/client'

export const HOME_PLAY_ATTENTION_EVENT = 'link:home-play-attention'

export type HomePlayAttention = {
  needsAttention: boolean
  pendingDaily: boolean
  pendingGuess: boolean
  pendingMotus: boolean
  pendingCount: number
}

export function notifyHomePlayAttentionChanged() {
  if (typeof window === 'undefined') return
  window.dispatchEvent(new Event(HOME_PLAY_ATTENTION_EVENT))
}

/** True si au moins un jeu Home du jour reste à faire. */
export async function fetchHomePlayAttention(): Promise<HomePlayAttention> {
  const empty: HomePlayAttention = {
    needsAttention: false,
    pendingDaily: false,
    pendingGuess: false,
    pendingMotus: false,
    pendingCount: 0,
  }

  try {
    const cycleDay = getCycleDay()
    let pendingDaily = false
    let pendingGuess = false
    let pendingMotus = false

    const { data: dailyPlay, error: dailyError } = await supabase.rpc('get_daily_question_play', {
      p_cycle_day: cycleDay,
    })
    const dailyRow = Array.isArray(dailyPlay) ? dailyPlay[0] : dailyPlay
    if (!dailyError && dailyRow?.id) {
      const { data: review } = await supabase.rpc('get_daily_answer_review', {
        p_question_id: dailyRow.id,
      })
      pendingDaily = !review
    }

    if (isBusinessDayLocal()) {
      const { data: guessPlay, error: guessError } = await supabase.rpc('get_guess_platform_play', {
        p_cycle_day: cycleDay,
      })
      if (
        !guessError &&
        guessPlay &&
        typeof guessPlay === 'object' &&
        !('weekend' in guessPlay && guessPlay.weekend)
      ) {
        const question = (guessPlay as { question?: { id?: string } | null }).question
        if (question?.id) {
          const { data: review } = await supabase.rpc('get_guess_platform_review', {
            p_question_id: question.id,
          })
          pendingGuess = !review
        }
      }
    }

    const { data: motusPlay, error: motusError } = await supabase.rpc('get_motus_play', {
      p_cycle_day: cycleDay,
    })
    if (!motusError && motusPlay && typeof motusPlay === 'object') {
      const question = (motusPlay as { question?: { id?: string } | null }).question
      const progress = (motusPlay as { progress?: { finished?: boolean } | null }).progress
      if (question?.id) {
        pendingMotus = !progress?.finished
      }
    }

    const pendingCount = Number(pendingDaily) + Number(pendingGuess) + Number(pendingMotus)
    return {
      needsAttention: pendingCount > 0,
      pendingDaily,
      pendingGuess,
      pendingMotus,
      pendingCount,
    }
  } catch {
    return empty
  }
}
