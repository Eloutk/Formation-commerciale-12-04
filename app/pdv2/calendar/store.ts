import { create } from 'zustand'
import type { CalendarItem, StrategyCalendarData, CalendarViewMode, CalendarTimeGranularity, CalendarPlatformSource } from './types'
import {
  getDatesFromStart,
  autoDistribute,
  validateItems,
  itemsOverlap,
  clampItem,
} from '@/lib/utils/calendarEngine'

export interface CalendarState {
  startDate: string
  duration: number
  viewMode: CalendarViewMode
  timeGranularity: CalendarTimeGranularity
  allowOverlap: boolean
  syncAllPlatforms: boolean
  items: CalendarItem[]
  platformSources: CalendarPlatformSource[]
  validationError: string | null
  /** Plateforme sélectionnée pour définir la date de début (clic dans le calendrier) */
  selectedPlatform: string | null
}

export interface CalendarActions {
  setStartDate: (startDate: string) => void
  setDuration: (duration: number) => void
  setViewMode: (mode: CalendarViewMode) => void
  setTimeGranularity: (granularity: CalendarTimeGranularity) => void
  setAllowOverlap: (allow: boolean) => void
  setSyncAllPlatforms: (sync: boolean) => void
  setPlatformSources: (sources: CalendarPlatformSource[]) => void
  setItems: (items: CalendarItem[]) => void
  initFromStrategy: (sources: CalendarPlatformSource[], duration: number, existing?: StrategyCalendarData | null) => void
  moveItem: (platform: string, toStartDay: number) => void
  resizeItem: (platform: string, newLength: number) => void
  autoRepartition: () => void
  reset: () => void
  getCalendarData: () => StrategyCalendarData
  validate: () => boolean
  setSelectedPlatform: (platform: string | null) => void
}

const defaultState: CalendarState = {
  startDate: '',
  duration: 0,
  viewMode: 'timeline',
  timeGranularity: 'month',
  allowOverlap: true,
  syncAllPlatforms: false,
  items: [],
  platformSources: [],
  validationError: null,
  selectedPlatform: null,
}

export const useCalendarStore = create<CalendarState & CalendarActions>((set, get) => ({
  ...defaultState,

  setStartDate: (startDate) => set({ startDate }),

  setDuration: (duration) => set({ duration: Math.max(1, duration) }),

  setViewMode: (viewMode) => set({ viewMode }),

  setTimeGranularity: (timeGranularity) => set({ timeGranularity }),

  setAllowOverlap: (allowOverlap) => set({ allowOverlap }),

  setSyncAllPlatforms: (syncAllPlatforms) => set({ syncAllPlatforms }),

  setPlatformSources: (platformSources) => set({ platformSources }),

  setItems: (items) => set({ items, validationError: null }),

  initFromStrategy: (sources, duration, existing) => {
    const startDate = existing?.startDate ?? new Date().toISOString().slice(0, 10)
    const calDuration = existing?.duration ?? duration
    let items: CalendarItem[]
    if (existing?.items?.length) {
      items = existing.items.map((i) => ({
        ...i,
        startDay: Math.max(0, Math.min(i.startDay, calDuration - 1)),
        length: Math.max(1, Math.min(i.length, calDuration)),
      }))
    } else {
      items = autoDistribute(sources, duration)
    }
    set({
      platformSources: sources,
      duration: Math.max(1, calDuration),
      startDate,
      items,
      validationError: null,
    })
  },

  moveItem: (platform, toStartDay) => {
    const { items, duration, allowOverlap } = get()
    const idx = items.findIndex((i) => i.platform === platform)
    if (idx === -1) return
    const item = items[idx]!
    const newItem = clampItem({ ...item, startDay: toStartDay }, duration)
    if (!allowOverlap) {
      const others = items.filter((_, i) => i !== idx)
      const hasOverlap = others.some((o) => itemsOverlap(newItem, o))
      if (hasOverlap) {
        set({ validationError: 'Chevauchement non autorisé' })
        return
      }
    }
    const next = items.slice()
    next[idx] = newItem
    set({ items: next, validationError: null })
  },

  resizeItem: (platform, newLength) => {
    const { items, duration, allowOverlap } = get()
    const idx = items.findIndex((i) => i.platform === platform)
    if (idx === -1) return
    const item = items[idx]!
    const newItem = clampItem({ ...item, length: Math.max(1, newLength) }, duration)
    if (!allowOverlap) {
      const others = items.filter((_, i) => i !== idx)
      const hasOverlap = others.some((o) => itemsOverlap(newItem, o))
      if (hasOverlap) {
        set({ validationError: 'Chevauchement non autorisé' })
        return
      }
    }
    const next = items.slice()
    next[idx] = newItem
    set({ items: next, validationError: null })
  },

  autoRepartition: () => {
    const { platformSources, duration } = get()
    const items = autoDistribute(platformSources, duration)
    set({ items, validationError: null })
  },

  reset: () => {
    const { platformSources, duration } = get()
    const items = autoDistribute(platformSources, duration)
    set({ items, validationError: null })
  },

  getCalendarData: () => {
    const { startDate, duration, items } = get()
    return {
      startDate,
      duration,
      items: items.map(({ platform, startDay, length, budget, kpiLabel, objective }) => ({
        platform,
        startDay,
        length,
        budget,
        kpiLabel,
        objective,
      })),
    }
  },

  validate: () => {
    const { items, duration } = get()
    const result = validateItems(items, duration)
    set({ validationError: result.valid ? null : result.message ?? null })
    return result.valid
  },

  setSelectedPlatform: (selectedPlatform) => set({ selectedPlatform }),
}))

export function getCalendarDates(state: CalendarState): string[] {
  return getDatesFromStart(state.startDate, state.duration)
}
