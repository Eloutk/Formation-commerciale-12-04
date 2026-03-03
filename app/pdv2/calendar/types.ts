export interface CalendarItem {
  platform: string
  startDay: number
  length: number
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

/** Granularité d'affichage du calendrier */
export type CalendarTimeGranularity = 'day' | 'week' | 'month'

export interface CalendarPlatformSource {
  platform: string
  budget: number
  kpiLabel: string
  /** Max days allowed for this platform (from strategy) */
  maxDays: number
}
