import { getCycleDay } from '@/lib/daily-question-cycle'
import { isWeekendLocal } from '@/lib/guess-platform'
import supabase from '@/utils/supabase/client'

export const HOME_PLAY_ATTENTION_EVENT = 'link:home-play-attention'

export type HomePlayAttention = {
  needsAttention: boolean
  pendingDaily: boolean
  pendingGuess: boolean
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
    pendingCount: 0,
  }

  try {
    const cycleDay = getCycleDay()
    let pendingDaily = false
    let pendingGuess = false

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

    if (!isWeekendLocal()) {
      const { data: guessPlay, error: guessError } = await supabase.rpc('get_guess_platform_play', {
        p_cycle_day: cycleDay,
      })
      if (!guessError && guessPlay && typeof guessPlay === 'object' && !('weekend' in guessPlay && guessPlay.weekend)) {
        const question = (guessPlay as { question?: { id?: string } | null }).question
        if (question?.id) {
          const { data: review } = await supabase.rpc('get_guess_platform_review', {
            p_question_id: question.id,
          })
          pendingGuess = !review
        }
      }
    }

    const pendingCount = Number(pendingDaily) + Number(pendingGuess)
    return {
      needsAttention: pendingCount > 0,
      pendingDaily,
      pendingGuess,
      pendingCount,
    }
  } catch {
    return empty
  }
}
