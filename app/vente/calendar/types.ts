export interface CalendarItem {
  platform: string
  startDay: number
  length: number
  /** Objectif lisible (ex: Clics, Impressions, Conversion) */
  objective?: string
  /** Optional: budget for this placement (from strategy) */
  budget?: number
  /** Optional: main KPI label (from strategy) */
  kpiLabel?: string
}

export interface StrategyCalendarData {
  startDate: string
  duration: number
  items: CalendarItem[]
}

export type CalendarViewMode = 'kanban' | 'timeline'

/** Granularité d'affichage du calendrier (frise = une ligne synthétique des périodes) */
export type CalendarTimeGranularity = 'day' | 'week' | 'month' | 'frise'

export interface CalendarPlatformSource {
  platform: string
  budget: number
  kpiLabel: string
  /** Max days allowed for this platform (from strategy) */
  maxDays: number
}

/** Une phase nommée pour le rétroplanning (ex. "META::Lancement") */
export interface RetroPhase {
  name: string
  defaultDays?: number
}

/** Config rétroplanning : plateforme + phases personnalisées */
export interface RetroPlatformPhase {
  platform: string
  phases: RetroPhase[]
  /**
   * Si aucune phase nommée : durée (j) de la barre unique sur la frise,
   * synchronisée avec l’étirement (mode « partir de 0 »).
   */
  singleLineDays?: number
}
