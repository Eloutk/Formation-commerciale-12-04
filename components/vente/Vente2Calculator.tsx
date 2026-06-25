'use client'

import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Plus, Minus, Trash2, Download, FileSpreadsheet, ChevronDown, Calendar, Pencil, CalendarRange, BarChart2, Info, Loader2, Save } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { UNIT_COSTS, calculatePriceForKPIs, calculatePriceForKPIsDirection, calculateKPIsForBudget, calculateKPIsForBudgetDirection } from '@/lib/pdv-calculations'
import * as XLSX from 'xlsx'
import JSZip from 'jszip'
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'
import supabase from '@/utils/supabase/client'
import NextImage from 'next/image'
import { StrategyCalendarBuilder } from '@/app/vente/calendar/StrategyCalendarBuilder'
import { RetroPlanningPanel } from '@/app/vente/calendar/RetroPlanningPanel'
import { useCalendarStore } from '@/app/vente/calendar/store'
import {
  desiredLengthFromRetroPhases,
  syncManualRetroItemLengthsFromPhases,
  syncManualRetroPlatformPhasesFromItems,
} from '@/app/vente/calendar/syncManualRetroFromStore'
import {
  downloadRetroplanningPdf,
  getRetroplanningPdfBlob,
  type RetroplanningPdfExportOptions,
} from '@/app/vente/calendar/RetroplanningPdfDocument'
import type { CalendarPlatformSource, RetroPlatformPhase, RetroPhase } from '@/app/vente/calendar/types'
import { getPlatformColor } from '@/app/vente/calendar/colors'
import { autoDistribute } from '@/lib/utils/calendarEngine'
import { cn } from '@/lib/utils'
import { VENTE2_SMS_HREF, VENTE2_SOCIAL_HREF } from '@/lib/nav-config'
import { buildSmsDevisContent, defaultSmsDevisSendWaves, type SmsDevisContent } from '@/lib/sms-devis'
import {
  createSmsDevis,
  getSmsDevisById,
  updateSmsDevis,
} from '@/lib/sms-devis-storage'
import type { Vente2StrategyContent } from '@/lib/vente2-strategies'
import {
  createVente2Strategy,
  getVente2StrategyById,
  updateVente2Strategy,
} from '@/lib/vente2-strategies-storage'
import {
  computeKpiMaxRowsForEnabledPlatforms,
  kpiMaxValidateInputs,
  KPI_MAX_PLATFORM_ORDER,
  kpiMaxSelectedToEnabled,
  type KpiMaxPlatformId,
  type KpiMaxCompteStrings,
  type KpiMaxComputedRow,
} from '@/lib/kpi-max-vente2'
import { SMS_SALES_CONDITIONS, RCS_SALES_CONDITIONS } from '@/app/vente/calendar/smsSalesConditions'
import { KpiMaxPanel } from '@/components/vente/KpiMaxPanel'
import { KpiMax2Panel } from '@/components/vente/KpiMax2Panel'
import {
  rebalanceRetroSocialSegments,
  retroStrategyLineKey,
  retroStrategySubPlatformKey,
} from '@/app/vente/calendar/retroSocialSplits'

// Liste des plateformes dans l'ordre souhaité
const PLATFORMS_ORDER = [
  'META',
  'Display',
  'Perf max',
  'Demand Gen',
  'Search',
  'Insta only',
  'Facebook only',
  'Youtube',
  'LinkedIn',
  'Snapchat',
  'Tiktok',
  'Spotify',
] as const

// Couleurs très contrastées par plateforme (calendrier, PDF)
const PLATFORM_CALENDAR_COLORS: Record<string, string> = {
  META: '#E85D04',
  'Facebook only': '#1877F2',
  Display: '#0077B6',
  'Perf max': '#6A0DAD',
  'Demand Gen': '#2D6A4F',
  Search: '#00B4D8',
  'Insta only': '#C71585',
  Youtube: '#B71C1C',
  LinkedIn: '#3D5AFE',
  Snapchat: '#FFB800',
  Tiktok: '#212529',
  Spotify: '#2DC653',
}
function getPlatformCalendarColor(platform: string): string {
  return PLATFORM_CALENDAR_COLORS[platform] ?? '#94a3b8'
}

// Afficher un libellé pour une entrée calendrier (platform ou platform::phaseName)
function getCalendarEntryLabel(entry: string): string {
  const i = entry.indexOf('::')
  if (i === -1) return entry
  return entry.slice(i + 2) || entry.slice(0, i) // phase name ou platform
}

function getCalendarEntryPlatform(entry: string): string {
  const i = entry.indexOf('::')
  if (i === -1) return entry
  return entry.slice(0, i)
}

function getDatesBetween(start: string, end: string): string[] {
  if (!start || !end) return []
  const s = new Date(start)
  const e = new Date(end)
  if (s.getTime() > e.getTime()) return []
  const out: string[] = []
  const d = new Date(s)
  while (d.getTime() <= e.getTime()) {
    out.push(d.toISOString().slice(0, 10))
    d.setDate(d.getDate() + 1)
  }
  return out
}

function addCalendarDays(isoDate: string, deltaDays: number): string {
  const d = new Date(isoDate + 'T12:00:00')
  d.setDate(d.getDate() + deltaDays)
  return d.toISOString().slice(0, 10)
}

// Grouper les dates par mois pour afficher le calendrier par mois (avec libellé)
function groupDatesByMonth(dates: string[]): { monthKey: string; label: string; dates: string[] }[] {
  if (dates.length === 0) return []
  const byMonth = new Map<string, string[]>()
  for (const d of dates) {
    const key = d.slice(0, 7) // YYYY-MM
    if (!byMonth.has(key)) byMonth.set(key, [])
    byMonth.get(key)!.push(d)
  }
  const sortedKeys = Array.from(byMonth.keys()).sort()
  return sortedKeys.map((monthKey) => {
    const [y, m] = monthKey.split('-').map(Number)
    const label = new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
    return { monthKey, label: label.charAt(0).toUpperCase() + label.slice(1), dates: byMonth.get(monthKey)! }
  })
}

// Vue Mois : frise chronologique avec glisser-déposer de phases
function CalendarMonthView({
  dates,
  ranges,
  setRanges,
  platformPhases,
  strategyPlatforms,
  getPlatformColor,
  getCalendarEntryLabel,
}: {
  dates: string[]
  ranges: CalendarRange[]
  setRanges: React.Dispatch<React.SetStateAction<CalendarRange[]>>
  platformPhases: Record<string, string[]>
  strategyPlatforms: string[]
  getPlatformColor: (p: string) => string
  getCalendarEntryLabel: (entry: string) => string
}) {
  const timelineRef = React.useRef<HTMLDivElement>(null)
  const [draggingRangeId, setDraggingRangeId] = React.useState<string | null>(null)
  const [resizingRangeId, setResizingRangeId] = React.useState<'left' | 'right' | null>(null)
  const dragLastXRef = React.useRef(0)
  const dragLastStartRef = React.useRef('')
  const dragLastEndRef = React.useRef('')

  const phaseItems: { platform: string; phaseName: string }[] = []
  strategyPlatforms.forEach((p) => {
    const phases = platformPhases[p]
    if (phases && phases.length > 0) phases.forEach((ph) => phaseItems.push({ platform: p, phaseName: ph }))
    else phaseItems.push({ platform: p, phaseName: p })
  })

  const totalDays = dates.length
  const dateToPercent = (d: string) => {
    const i = dates.indexOf(d)
    if (i === -1) return 0
    return (i / Math.max(1, totalDays)) * 100
  }
  const percentToDate = (pct: number) => {
    const i = Math.min(Math.floor((pct / 100) * totalDays), totalDays - 1)
    return dates[i] ?? dates[0]
  }

  const addRangeFromDrop = (clientX: number, platform: string, phaseName: string) => {
    const el = timelineRef.current
    if (!el || dates.length === 0) return
    const rect = el.getBoundingClientRect()
    const pct = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100))
    const startDate = percentToDate(pct)
    const startIdx = dates.indexOf(startDate)
    let endIdx = Math.min(startIdx + 7, dates.length - 1)
    const endDate = dates[endIdx] ?? startDate
    const id = `range-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setRanges((prev) => [...prev, { id, startDate, endDate, platform, phaseName }])
  }

  const handleTimelineDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const platform = e.dataTransfer.getData('platform')
    const phaseName = e.dataTransfer.getData('phaseName')
    if (platform && phaseName) addRangeFromDrop(e.clientX, platform, phaseName)
  }

  const handleRangeMouseDown = (rangeId: string, side: 'left' | 'right' | null, e: React.MouseEvent) => {
    e.stopPropagation()
    const r = ranges.find((x) => x.id === rangeId)
    if (!r) return
    setResizingRangeId(side)
    setDraggingRangeId(rangeId)
    dragLastXRef.current = e.clientX
    dragLastStartRef.current = r.startDate
    dragLastEndRef.current = r.endDate
  }

  React.useEffect(() => {
    if (!draggingRangeId) return
    const resizing = resizingRangeId
    const onMove = (ev: MouseEvent) => {
      const el = timelineRef.current
      if (!el || dates.length === 0) return
      const rect = el.getBoundingClientRect()
      const deltaPct = ((ev.clientX - dragLastXRef.current) / rect.width) * 100
      const deltaDays = Math.round((deltaPct / 100) * totalDays)
      const lastStart = dragLastStartRef.current
      const lastEnd = dragLastEndRef.current
      let newStartIdx: number
      let newEndIdx: number
      if (resizing === 'left') {
        newStartIdx = Math.max(0, dates.indexOf(lastStart) + deltaDays)
        newEndIdx = dates.indexOf(lastEnd)
        if (newStartIdx >= newEndIdx) return
      } else if (resizing === 'right') {
        newStartIdx = dates.indexOf(lastStart)
        newEndIdx = Math.min(dates.length - 1, dates.indexOf(lastEnd) + deltaDays)
        if (newStartIdx >= newEndIdx) return
      } else {
        newStartIdx = Math.max(0, dates.indexOf(lastStart) + deltaDays)
        newEndIdx = Math.max(0, dates.indexOf(lastEnd) + deltaDays)
        if (newStartIdx > newEndIdx) [newStartIdx, newEndIdx] = [newEndIdx, newStartIdx]
        newEndIdx = Math.min(dates.length - 1, newEndIdx)
        newStartIdx = Math.min(newStartIdx, newEndIdx)
      }
      const newStart = dates[newStartIdx]!
      const newEnd = dates[newEndIdx]!
      setRanges((prev) => prev.map((x) => (x.id === draggingRangeId ? { ...x, startDate: newStart, endDate: newEnd } : x)))
      dragLastXRef.current = ev.clientX
      dragLastStartRef.current = newStart
      dragLastEndRef.current = newEnd
    }
    const onUp = () => {
      setDraggingRangeId(null)
      setResizingRangeId(null)
    }
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp) }
  }, [draggingRangeId, resizingRangeId, dates, setRanges, totalDays])

  const removeRange = (id: string) => setRanges((prev) => prev.filter((r) => r.id !== id))

  // Assigner une "lane" (ligne) à chaque phase pour qu'elles ne se superposent pas visuellement
  const rangesWithLane = React.useMemo(() => {
    const sorted = [...ranges].sort((a, b) => a.startDate.localeCompare(b.startDate))
    const laneEnd: number[] = [] // pour chaque lane, l'index de la dernière date occupée
    return sorted.map((r) => {
      const startIdx = dates.indexOf(r.startDate)
      const endIdx = dates.indexOf(r.endDate)
      const end = endIdx >= 0 ? endIdx : startIdx
      let lane = 0
      while (lane < laneEnd.length && laneEnd[lane] >= startIdx) lane++
      laneEnd[lane] = end
      return { ...r, lane }
    })
  }, [ranges, dates])

  const numLanes = rangesWithLane.length > 0 ? Math.max(...rangesWithLane.map((r) => r.lane)) + 1 : 1
  const ROW_HEIGHT = 36
  const timelineHeight = Math.max(ROW_HEIGHT, numLanes * ROW_HEIGHT)

  // Mois pour l'en-tête horizontale (groupés à partir des dates)
  const monthsRow = React.useMemo(() => {
    if (dates.length === 0) return []
    const byMonth = new Map<string, { startIdx: number; endIdx: number }>()
    dates.forEach((d, i) => {
      const key = d.slice(0, 7)
      if (!byMonth.has(key)) byMonth.set(key, { startIdx: i, endIdx: i })
      else byMonth.get(key)!.endIdx = i
    })
    return Array.from(byMonth.entries()).sort((a, b) => a[1].startIdx - b[1].startIdx).map(([monthKey, { startIdx, endIdx }]) => {
      const [y, m] = monthKey.split('-').map(Number)
      const label = new Date(y, m - 1, 1).toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
      const left = (startIdx / Math.max(1, totalDays)) * 100
      const width = ((endIdx - startIdx + 1) / Math.max(1, totalDays)) * 100
      return { key: monthKey, label: label.charAt(0).toUpperCase() + label.slice(1), left, width }
    })
  }, [dates, totalDays])

  return (
    <div className="space-y-3 w-full">
      <Label>Frise chronologique (glissez une phase sur la frise pour l&apos;y poser, déplacez ou redimensionnez les blocs)</Label>
      <div className="flex gap-4 w-full">
        <div className="w-48 shrink-0 space-y-2">
          <p className="text-xs font-medium text-muted-foreground">Phases à déposer</p>
          {phaseItems.map(({ platform, phaseName }) => (
            <div
              key={`${platform}::${phaseName}`}
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('platform', platform)
                e.dataTransfer.setData('phaseName', phaseName)
                e.dataTransfer.effectAllowed = 'copy'
              }}
              className="cursor-grab active:cursor-grabbing rounded px-2 py-1.5 text-xs border border-gray-200 bg-background hover:bg-muted/50"
              style={{ borderLeftColor: getPlatformColor(platform), borderLeftWidth: 3 }}
            >
              {getCalendarEntryLabel(phaseName === platform ? platform : `${platform}::${phaseName}`)}
            </div>
          ))}
        </div>
        <div className="flex-1 min-w-0">
          <div className="border border-gray-200 rounded-lg p-2 bg-gray-50/50">
            {/* Ligne des mois en en-tête */}
            <div className="relative h-6 w-full mb-1">
              {monthsRow.map(({ key, label, left, width }) => (
                <div
                  key={key}
                  className="absolute top-0 bottom-0 flex items-center px-1 text-[10px] font-medium text-muted-foreground border-r border-gray-200 last:border-r-0"
                  style={{ left: `${left}%`, width: `${width}%` }}
                >
                  {label}
                </div>
              ))}
            </div>
            <div
              ref={timelineRef}
              className="relative w-full rounded bg-white border border-gray-200 overflow-hidden"
              style={{ height: timelineHeight }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleTimelineDrop}
            >
              {rangesWithLane.map((r) => {
                const left = dateToPercent(r.startDate)
                const endIdx = dates.indexOf(r.endDate)
                const startIdx = dates.indexOf(r.startDate)
                const spanDays = endIdx >= 0 && startIdx >= 0 ? endIdx - startIdx + 1 : 1
                const width = (spanDays / Math.max(1, totalDays)) * 100
                const top = r.lane * ROW_HEIGHT
                return (
                  <div
                    key={r.id}
                    className="absolute rounded flex items-center justify-center group cursor-move"
                    style={{
                      left: `${left}%`,
                      width: `${width}%`,
                      top: top + 2,
                      height: ROW_HEIGHT - 4,
                      backgroundColor: getPlatformColor(r.platform) + '40',
                      borderLeft: `3px solid ${getPlatformColor(r.platform)}`,
                    }}
                    onMouseDown={(e) => { if ((e.target as HTMLElement).closest('button') || (e.target as HTMLElement).classList.contains('cursor-ew-resize')) return; handleRangeMouseDown(r.id, null, e) }}
                  >
                    <span className="text-[10px] font-medium truncate px-1 pointer-events-none">{r.phaseName}</span>
                    <button type="button" className="absolute right-0.5 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 text-destructive text-[10px] cursor-pointer" onClick={(e) => { e.stopPropagation(); removeRange(r.id) }} title="Supprimer">×</button>
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-transparent hover:bg-primary/30 shrink-0" onMouseDown={(e) => handleRangeMouseDown(r.id, 'left', e)} title="Redimensionner" />
                    <div className="absolute right-0 top-0 bottom-0 w-1.5 cursor-ew-resize bg-transparent hover:bg-primary/30 shrink-0" onMouseDown={(e) => handleRangeMouseDown(r.id, 'right', e)} title="Redimensionner" />
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const PLATFORM_LOGOS: Partial<Record<(typeof PLATFORMS_ORDER)[number], string>> = {
  META: '/images/Logo META.png',
  'Facebook only': '/images/facebook-logo-facebook-icon-transparent-free-png.webp',
  Display: '/images/Logo Google.png',
  'Perf max': '/images/Logo Google.png',
  'Demand Gen': '/images/Logo Google.png',
  Search: '/images/Logo Google.png',
  Youtube: '/images/Logo YouTube.png',
  LinkedIn: '/images/Logo LinkedIn.png',
  Snapchat: '/images/Logo Snapchat.png',
  Tiktok: '/images/Logo TikTok.png',
  Spotify: '/images/Logo Spotify.png',
  'Insta only': '/images/Instagram_logo.svg',
}

const META_CUSTOM_OBJECTIVES = [
  'Impressions',
  'Clics',
  'Clics sur lien',
  'Intéractions',
  'Visites de profil',
  "J'aime la page",
  'Réponses évènement',
  'Leads',
] as const

const INSTA_CUSTOM_OBJECTIVES = [
  'Impressions',
  'Clics',
  'Clics sur lien',
  'Intéractions',
  'Visites de profil',
] as const

const DEFAULT_CUSTOM_OBJECTIVES = ['Impressions', 'Clics'] as const

const TIKTOK_CUSTOM_OBJECTIVES = ['Impressions', 'Clics', 'conversion'] as const

const LINKEDIN_CUSTOM_OBJECTIVES = ['Impressions', 'Clics', 'Leads', 'Likes'] as const

const MAKE_LEADS_OPTION_LABEL = 'Envoi automatique des leads au client via Make'
const MAKE_LEADS_OPTION_BUDGET = 150
const MAKE_LEADS_PINK_ROW_CLASS = 'bg-pink-50 text-pink-700 border-pink-200'
const COMPLEMENTARY_ROW_CLASS = 'bg-violet-50 text-violet-900 border-violet-200'

type AdditionalSaleId =
  | 'miseAuFormat'
  | 'leadsMeta'
  | 'leadsLinkedIn'
  | 'animationVisuel'
  | 'creationComplete'

const ADDITIONAL_SALE_PRICES: Record<AdditionalSaleId, number> = {
  miseAuFormat: 200,
  animationVisuel: 250,
  creationComplete: 490,
  leadsMeta: 150,
  leadsLinkedIn: 150,
}

const ADDITIONAL_SALE_OPTIONS: { id: AdditionalSaleId; label: string }[] = [
  { id: 'miseAuFormat', label: 'Mise au format' },
  { id: 'animationVisuel', label: 'Animation de visuel' },
  { id: 'leadsMeta', label: 'Envoi automatique de leads META' },
  { id: 'leadsLinkedIn', label: 'Envoi automatique de leads LinkedIn' },
  { id: 'creationComplete', label: 'Création complète' },
]

function supportsAdditionalSaleQuantity(saleId: AdditionalSaleId): boolean {
  return saleId !== 'leadsMeta' && saleId !== 'leadsLinkedIn'
}

function getAdditionalSaleCount(
  block: Pick<StrategyBlock, 'additionalSales'>,
  saleId: AdditionalSaleId,
): number {
  const raw = block.additionalSales?.[saleId] as number | boolean | undefined
  if (raw === true) return 1
  if (raw === false || raw === undefined || raw === null) return 0
  const n = Math.floor(Number(raw))
  return Number.isFinite(n) && n > 0 ? n : 0
}

function getMakeLeadsPlatformForSale(saleId: AdditionalSaleId): string | null {
  if (saleId === 'leadsMeta') return 'META'
  if (saleId === 'leadsLinkedIn') return 'LinkedIn'
  return null
}

function hasMakeLeadsAddonForAdditionalSale(
  block: Pick<StrategyBlock, 'items'>,
  saleId: AdditionalSaleId,
): boolean {
  if (saleId === 'leadsMeta') {
    return block.items.some(
      (it) =>
        it.isMakeLeadsAddon && (it.platform === 'META' || it.platform === 'Facebook only'),
    )
  }
  const platform = getMakeLeadsPlatformForSale(saleId)
  if (!platform) return false
  return block.items.some((it) => it.isMakeLeadsAddon && it.platform === platform)
}

function isAdditionalSaleChecked(
  block: Pick<StrategyBlock, 'items' | 'additionalSales'>,
  saleId: AdditionalSaleId,
): boolean {
  if (hasMakeLeadsAddonForAdditionalSale(block, saleId)) return true
  return getAdditionalSaleCount(block, saleId) > 0
}

function removeMakeLeadsAddonItems(items: StrategyItem[], platform: string): StrategyItem[] {
  return items.filter((it) => !(it.isMakeLeadsAddon && it.platform === platform))
}

function getAdditionalSaleUnitPrice(saleId: AdditionalSaleId): number {
  return ADDITIONAL_SALE_PRICES[saleId]
}

function getAdditionalSaleAmount(saleId: AdditionalSaleId, count: number): number {
  return Math.max(0, Math.floor(count)) * getAdditionalSaleUnitPrice(saleId)
}

function getAdditionalSalesTotal(block: Pick<StrategyBlock, 'additionalSales' | 'items'>): number {
  return ADDITIONAL_SALE_OPTIONS.reduce((sum, opt) => {
    if (hasMakeLeadsAddonForAdditionalSale(block, opt.id)) return sum
    return sum + getAdditionalSaleAmount(opt.id, getAdditionalSaleCount(block, opt.id))
  }, 0)
}

function isMakeLeadsTrigger(platform: string, objective: string): boolean {
  const normalizedPlatform = platform.trim()
  const normalizedObjective = objective.trim()
  return (
    (normalizedPlatform === 'META' ||
      normalizedPlatform === 'Facebook only' ||
      normalizedPlatform === 'LinkedIn') &&
    normalizedObjective === 'Leads'
  )
}

function isComplementaryStrategyItem(item: Pick<StrategyItem, 'isMakeLeadsAddon'>): boolean {
  return !!item.isMakeLeadsAddon
}

function isMediaStrategyItem(item: Pick<StrategyItem, 'isMakeLeadsAddon'>): boolean {
  return !item.isMakeLeadsAddon
}

function isCampaignMediaItem(item: { isMakeLeadsAddon?: boolean }): boolean {
  return !item.isMakeLeadsAddon
}

function getStrategyBlockBudgetTotal(block: Pick<StrategyBlock, 'items' | 'additionalSales'>): number {
  return block.items.reduce((sum, it) => sum + it.budget, 0) + getAdditionalSalesTotal(block)
}

const STRATEGY_VAT_MULTIPLIER = 1.2

function getStrategyBudgetTtc(ht: number): number {
  return ht * STRATEGY_VAT_MULTIPLIER
}

function getActiveAdditionalSales(block: Pick<StrategyBlock, 'additionalSales' | 'items'>): Array<{
  id: AdditionalSaleId
  label: string
  count: number
  unitPrice: number
  total: number
  viaMake?: boolean
}> {
  return ADDITIONAL_SALE_OPTIONS.flatMap((opt) => {
    const makeItem =
      opt.id === 'leadsMeta'
        ? block.items.find(
            (it) =>
              it.isMakeLeadsAddon && (it.platform === 'META' || it.platform === 'Facebook only'),
          )
        : (() => {
            const platform = getMakeLeadsPlatformForSale(opt.id)
            return platform != null
              ? block.items.find((it) => it.isMakeLeadsAddon && it.platform === platform)
              : undefined
          })()

    if (makeItem) {
      return [
        {
          id: opt.id,
          label: opt.label,
          count: 1,
          unitPrice: makeItem.budget,
          total: makeItem.budget,
          viaMake: true,
        },
      ]
    }

    const count = getAdditionalSaleCount(block, opt.id)
    if (count <= 0) return []
    return [
      {
        id: opt.id,
        label: opt.label,
        count,
        unitPrice: getAdditionalSaleUnitPrice(opt.id),
        total: getAdditionalSaleAmount(opt.id, count),
      },
    ]
  })
}

function getActiveAdditionalSaleLabels(block: Pick<StrategyBlock, 'additionalSales' | 'items'>): string[] {
  return getActiveAdditionalSales(block).map((sale) =>
    sale.count > 1 ? `${sale.label} (× ${sale.count})` : sale.label,
  )
}

const SEARCH_CUSTOM_OBJECTIVES = ['Clics', 'Conversion'] as const

const PERF_MAX_OBJECTIVES = ['Conversion'] as const

const CUSTOM_OBJECTIVES: Record<(typeof PLATFORMS_ORDER)[number], readonly string[]> = {
  META: META_CUSTOM_OBJECTIVES,
  'Facebook only': META_CUSTOM_OBJECTIVES,
  Display: DEFAULT_CUSTOM_OBJECTIVES,
  'Perf max': PERF_MAX_OBJECTIVES,
  'Demand Gen': DEFAULT_CUSTOM_OBJECTIVES,
  Search: SEARCH_CUSTOM_OBJECTIVES,
  'Insta only': INSTA_CUSTOM_OBJECTIVES,
  Youtube: ['Impressions'],
  LinkedIn: LINKEDIN_CUSTOM_OBJECTIVES,
  Snapchat: DEFAULT_CUSTOM_OBJECTIVES,
  Tiktok: TIKTOK_CUSTOM_OBJECTIVES,
  Spotify: ['Impressions'],
}

function usesMetaObjectives(platform: string): boolean {
  return platform === 'META' || platform === 'Facebook only'
}

function PlatformBadge({ platform, withDownload = false }: { platform: string; withDownload?: boolean }) {
  const src = PLATFORM_LOGOS[platform as keyof typeof PLATFORM_LOGOS]
  if (!src) return <span>{platform}</span>
  return (
    <span className="inline-flex items-center gap-2">
      <span className="relative h-5 w-5 overflow-hidden rounded-sm">
        <NextImage src={src} alt={platform} fill className="object-contain" />
      </span>
      <span>{platform}</span>
      {withDownload && (
        <a
          href={src}
          download
          className="inline-flex items-center text-xs text-muted-foreground hover:text-[#E94C16]"
          onClick={(e) => e.stopPropagation()}
        >
          <Download className="h-3 w-3" aria-hidden="true" />
          <span className="sr-only">Télécharger le logo {platform}</span>
        </a>
      )}
    </span>
  )
}

/** Encart stratégie : logo + « META - clics sur lien » sur une ligne */
function StrategyPlatformObjectiveLine({
  platform,
  objective,
}: {
  platform: string
  objective: string
}) {
  const src = PLATFORM_LOGOS[platform as keyof typeof PLATFORM_LOGOS]
  return (
    <span className="inline-flex items-center gap-1.5 text-sm font-semibold leading-snug min-w-0">
      {src ? (
        <span className="relative h-5 w-5 shrink-0 overflow-hidden rounded-sm">
          <NextImage src={src} alt={platform} fill className="object-contain" />
        </span>
      ) : null}
      <span className="min-w-0">
        {formatStrategyPlatformObjectiveLine(platform, objective)}
      </span>
    </span>
  )
}

/** Champ de saisie avec icône stylo pour indiquer qu'il est modifiable (sauf type="file") */
function EditableInput(props: React.ComponentProps<typeof Input>) {
  const { className, type, ...rest } = props
  if (type === 'file') return <Input {...props} />
  return (
    <div className="relative w-full">
      <Input type={type} {...rest} className={cn('pr-8', className)} />
      <Pencil className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" aria-hidden />
    </div>
  )
}

type CalculationMode = 'budget-to-kpis' | 'kpis-to-budget'
type PdvSection = 'social' | 'sms' | 'calendar' | 'kpiMax' | 'kpiMax2'
export type Vente2CalculatorView = 'social' | 'sms' | 'kpiMax' | 'calendar'
type SmsType = 'sms' | 'rcs'

interface SmsOptionsState {
  ciblage: boolean
  baseClients: boolean
  richSms: boolean
  agent: boolean
  creaByLink: boolean
  tarifIntermarche: boolean
  duplicateCampaign: boolean
}

type ChartView = 'platform' | 'objective'

interface TableRowData {
  platform: string
  objective: string
  budget: number
  estimatedKPIs: number
  dailyBudget: number
  // Valeur utilisée pour vérifier le minimum d'AE
  // (AE par jour pour la plupart des plateformes, AE total pour Spotify)
  aeCheckValue: number
  isAvailable: boolean
}

interface StrategyItem extends TableRowData {
  id: string
  // Nombre de jours de diffusion saisi au moment de l'ajout
  days: number
  // % AE utilisé au moment de l'ajout (ex: 40 pour 40 %)
  aePercentage: number
  // Libellé personnalisé pour les KPIs (ex: valeur saisie pour Search > Clics)
  customKpiLabel?: string
  // Tarifs direction appliqués pour cette ligne (au moment de l'ajout)
  tarifsDirection?: boolean
  /** Option Make (150 €) vendue avec Meta Leads ou LinkedIn Leads. */
  isMakeLeadsAddon?: boolean
}

// Phase posée sur la frise (vue mois)
export interface CalendarRange {
  id: string
  startDate: string
  endDate: string
  platform: string
  phaseName: string
}

// Jours par phase : platform -> phaseName -> nombre de jours (pour calendrier)
export type CalendarPhaseDaysMap = Record<string, Record<string, number>>

// Calendrier de diffusion (stocké en front, perdu au rechargement)
export interface StrategyCalendar {
  startDate: string // YYYY-MM-DD
  endDate: string
  days: Record<string, string[]> // date -> "platform" ou "platform::phaseName"
  platformPhases?: Record<string, string[]> // platform -> noms de phases
  phaseDays?: CalendarPhaseDaysMap
  ranges?: CalendarRange[] // vue mois : phases posées sur la frise
}

// Calendrier stratégique (module Kanban/Timeline)
export type StrategyCalendarData = import('@/app/vente/calendar/types').StrategyCalendarData

/** Plateforme SMS/RCS dans le rétroplanning (hors réseaux sociaux) */
function isSmsRetroPlatform(p: string): boolean {
  return p === 'SMS' || p === 'RCS' || p.startsWith('SMS::') || p.startsWith('RCS::')
}

/** Adapte le calendrier déjà enregistré au mode Social / SMS / les deux / partir de 0 */
function filterRetroCalendarDataForSourceChoice(
  data: StrategyCalendarData | null,
  choice: 'social' | 'sms' | 'both' | 'none',
): StrategyCalendarData | null {
  if (!data) return data
  if (choice === 'none') return null
  const raw = data.items ?? []
  if (choice === 'both') return data
  const items =
    choice === 'social'
      ? raw.filter((i) => !isSmsRetroPlatform(i.platform))
      : raw.filter((i) => isSmsRetroPlatform(i.platform))
  const extent = items.length
    ? Math.max(...items.map((i) => (i.startDay ?? 0) + (i.length ?? 0)))
    : 0
  const duration = items.length > 0 ? Math.max(data.duration, extent) : Math.max(1, data.duration)
  return { ...data, items, duration }
}

function filterDefineDatesForSourceChoice(
  prev: Record<string, string>,
  choice: 'social' | 'sms' | 'both' | 'none',
): Record<string, string> {
  if (choice === 'both') return prev
  if (choice === 'none') return {}
  const entries = Object.entries(prev).filter(([k]) =>
    choice === 'social' ? !isSmsRetroPlatform(k) : isSmsRetroPlatform(k),
  )
  return Object.fromEntries(entries)
}

/** Filtre les dates par stratégie (clé = id stratégie) selon le mode rétro. */
function filterDefineDatesPerStrategyMap(
  prev: Record<string, Record<string, string>>,
  choice: 'social' | 'sms' | 'both' | 'none',
): Record<string, Record<string, string>> {
  const out: Record<string, Record<string, string>> = {}
  for (const [sid, inner] of Object.entries(prev)) {
    out[sid] = filterDefineDatesForSourceChoice(inner, choice)
  }
  return out
}

/** Rétroplanning lié au Social : une entrée par stratégie (plusieurs stratégies Social media). */
interface RetroSocialState {
  startDate: string
  durationDays: number
  platformPhases: RetroPlatformPhase[]
  socialLineSplits: Record<string, { name: string; days: number }[]>
  calendarData: StrategyCalendarData | null
}

function defaultRetroSocialState(): RetroSocialState {
  return {
    startDate: new Date().toISOString().slice(0, 10),
    durationDays: 90,
    platformPhases: [],
    socialLineSplits: {},
    calendarData: null,
  }
}

function isStrategyCalendarData(cal: StrategyCalendar | StrategyCalendarData | null | undefined): cal is StrategyCalendarData {
  return !!cal && 'duration' in cal && 'items' in cal && Array.isArray((cal as StrategyCalendarData).items)
}

interface StrategyBlock {
  id: string
  name: string
  items: StrategyItem[]
  calendar?: StrategyCalendar | StrategyCalendarData | null
  /** Commentaire libre saisi dans l’onglet Social media (indépendant par stratégie). */
  comment?: string
  /** Options « Vente additionnelle » (tarifs HT par option ; quantité pour mise au format, animation & création). */
  additionalSales?: Partial<Record<AdditionalSaleId, number>>
}

/**
 * Recalcule budget / KPIs / AE quotidien quand la durée (calendrier) change.
 * — Budget → KPIs : budget média inchangé, KPIs ajustés ~proportionnellement à la durée.
 * — KPIs → Budget : KPIs ajustés pareil, prix (budget) recalculé via le barème.
 */
function applyStrategyItemDaysChange(
  it: StrategyItem,
  newDays: number,
  calculationMode: CalculationMode,
  useTarifsDirection: boolean,
): StrategyItem {
  const days = Math.max(1, Math.floor(newDays))
  const prevDays = Math.max(1, it.days)
  const ratio = days / prevDays
  const aeFactor = it.aePercentage / 100

  let budget = it.budget
  let estimatedKPIs = it.estimatedKPIs
  if (estimatedKPIs > 0) {
    estimatedKPIs = Math.max(1, Math.round(estimatedKPIs * ratio))
  }

  if (calculationMode === 'kpis-to-budget' && estimatedKPIs > 0) {
    try {
      const r = useTarifsDirection
        ? calculatePriceForKPIsDirection(it.platform, it.objective, it.aePercentage, estimatedKPIs)
        : calculatePriceForKPIs(it.platform, it.objective, it.aePercentage, estimatedKPIs)
      budget = Math.round(r.price || 0)
    } catch {
      budget = it.budget
    }
  }

  const dailyBudget = budget > 0 ? (budget * aeFactor) / days : 0
  const aeCheckValue =
    budget > 0
      ? it.platform === 'Spotify'
        ? budget * aeFactor
        : (budget * aeFactor) / days
      : 0

  return { ...it, days, budget, estimatedKPIs, dailyBudget, aeCheckValue }
}

function daysBetweenIso(a: string, b: string): number {
  return Math.round(
    (new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) /
      (24 * 60 * 60 * 1000),
  )
}

/** Items + sources calendrier stratégique (modale), alignés sur une date de début de frise — même logique que /vente. */
function computeVenteStrategyCalendarItems(
  block: StrategyBlock,
  defineDatesPerPlatform: Record<string, string>,
  diffusionDaysStr: string,
  timelineStart: string,
): {
  platformSources: CalendarPlatformSource[]
  items: StrategyCalendarData['items']
  contentSpan: number
  globalStart: string
  timelineStartResolved: string
} {
  const diffusionDuration = Math.max(1, Math.floor(parseFloat(diffusionDaysStr) || 14))
  const mediaItems = block.items.filter(isCampaignMediaItem)
  const platformSources: CalendarPlatformSource[] = mediaItems.map((item) => ({
    platform: `${item.platform}::${item.objective}`,
    budget: item.budget,
    kpiLabel: item.customKpiLabel
      ? item.customKpiLabel
      : item.estimatedKPIs > 0
        ? `${item.estimatedKPIs.toLocaleString('fr-FR')} ${getKpiUnitLabel(item.objective)}`
        : getMaxKpiLabel(item.objective),
    maxDays: Math.max(1, item.days ?? diffusionDuration),
  }))
  const savedCal =
    block.calendar && isStrategyCalendarData(block.calendar) && block.calendar.items.length > 0
      ? block.calendar
      : null
  const starts = mediaItems.map((it) => {
    const key = `${it.platform}::${it.objective}`
    return defineDatesPerPlatform[key] ?? new Date().toISOString().slice(0, 10)
  })
  const globalStart = starts.reduce((min, d) => (d < min ? d : min), starts[0]!)
  const tsCandidate = timelineStart.trim() || globalStart
  const ts = tsCandidate > globalStart ? globalStart : tsCandidate
  const computedItems = mediaItems.map((item, i) => {
    const key = `${item.platform}::${item.objective}`
    const composite = `${item.platform}::${item.objective}`
    const savedRow = savedCal?.items.find(
      (it) =>
        it.platform === composite ||
        (!String(it.platform).includes('::') &&
          it.platform === item.platform &&
          (it.objective ?? '') === item.objective),
    )
    const startDate = defineDatesPerPlatform[key] ?? globalStart
    const startDay = Math.max(0, daysBetweenIso(ts, startDate))
    const length = Math.max(1, item.days ?? savedRow?.length ?? diffusionDuration)
    return {
      platform: composite,
      startDay,
      length,
      budget: item.budget,
      kpiLabel: platformSources[i]!.kpiLabel,
      objective: item.objective,
    }
  })
  const contentSpan = computedItems.reduce((m, it) => Math.max(m, it.startDay + it.length), 1)
  return { platformSources, items: computedItems, contentSpan, globalStart, timelineStartResolved: ts }
}

interface CustomRowState {
  objective: string
  budget: string
}

const getMaxKpiLabel = (objective: string): string => {
  const trimmed = objective.trim()
  if (!trimmed) return ''
  const first = trimmed[0]?.toLowerCase()
  const vowels = 'aeiouyhâàäéèêëîïôöùüÿ'
  const useElision = first && vowels.includes(first)
  const prep = useElision ? "d'" : 'de '
  return `Max ${prep}${trimmed.toLowerCase()}`
}

/** Encart stratégie : « META - clics sur lien » */
function formatStrategyPlatformObjectiveLine(platform: string, objective: string): string {
  const obj = objective.trim()
  return obj ? `${platform} - ${obj.toLowerCase()}` : platform
}

// Libellé d'un KPI en fonction de l'objectif (pour l'affichage dans la stratégie)
const getKpiUnitLabel = (objective: string): string => {
  const o = objective.trim().toLowerCase()
  if (!o) return 'KPIs'
  if (o.includes('lead')) return 'leads'
  if (o.includes('conversion')) return 'conversions'
  // Reprendre l'objectif tel quel (ex. « clics sur lien », « intéractions », « visites de profil »)
  return o
}

/** Forme neutre singulier/pluriel pour les libellés PDF (ex. « option(s) »). */
function pdfPlural(word: string): string {
  const w = word.trim()
  if (!w || w.includes('(s)')) return w
  if (w.toLowerCase().endsWith('s') && w.length > 1) {
    return `${w.slice(0, -1)}(s)`
  }
  return `${w}(s)`
}

function getPdfKpiUnitLabel(objective: string): string {
  const unit = getKpiUnitLabel(objective)
  const spaceIdx = unit.indexOf(' ')
  if (spaceIdx === -1) return pdfPlural(unit)
  return `${pdfPlural(unit.slice(0, spaceIdx))}${unit.slice(spaceIdx)}`
}

function getPdfMaxKpiLabel(objective: string): string {
  const unit = getKpiUnitLabel(objective)
  const label = getMaxKpiLabel(objective)
  if (!unit) return label
  return label.replace(unit, getPdfKpiUnitLabel(objective))
}

// Fonction pour formater les nombres avec espaces classiques (pour PDF)
const formatNumber = (num: number, decimals: number = 0): string => {
  // Formater manuellement pour garantir des espaces classiques
  const parts = num.toFixed(decimals).split('.')
  const integerPart = parts[0]
  const decimalPart = decimals > 0 ? parts[1] : null
  
  // Ajouter des espaces tous les 3 chiffres de droite à gauche
  let formatted = ''
  for (let i = integerPart.length - 1, count = 0; i >= 0; i--, count++) {
    if (count > 0 && count % 3 === 0) {
      formatted = ' ' + formatted
    }
    formatted = integerPart[i] + formatted
  }
  
  return decimalPart ? `${formatted},${decimalPart}` : formatted
}

const formatEuro = (num: number, decimals = 2): string => `${formatNumber(num, decimals)} €`

const BASE_CLIENTS_UNIT_PRICE = 0.08
const CIBLAGE_UNIT_PRICE = 0.03

/** Affiche le PU Base clients (0,08 €). */
const formatBaseClientsUnitPriceEuro = (unitPrice: number = BASE_CLIENTS_UNIT_PRICE): string =>
  `${unitPrice.toFixed(2).replace('.', ',')} €`

const formatBaseClientsUnitPriceLabel = (unitLabel: 'SMS' | 'RCS'): string =>
  `${formatBaseClientsUnitPriceEuro()} / ${unitLabel}`

const formatBaseClientsTariffDescription = (unitLabel: 'SMS' | 'RCS'): string =>
  `Base clients — ${formatBaseClientsUnitPriceEuro()} / ${unitLabel} (hors barème)`

const formatCiblageOptionLabel = (unitLabel: 'SMS' | 'RCS'): string =>
  `+${CIBLAGE_UNIT_PRICE.toFixed(2).replace('.', ',')} € / ${unitLabel}`

const formatRcsUnitPriceEuro = (unitPrice: number, baseClients: boolean): string => {
  if (baseClients) return formatBaseClientsUnitPriceEuro(unitPrice)
  return `${unitPrice.toFixed(2).replace('.', ',')} €`
}

const formatSmsUnitPriceEuro = (unitPrice: number, baseClients: boolean): string => {
  if (baseClients) return formatBaseClientsUnitPriceEuro(unitPrice)
  return `${unitPrice.toFixed(4).replace('.', ',')} €`
}

const formatRcsUnitPriceLabel = (unitPrice: number, baseClients: boolean): string =>
  `${formatRcsUnitPriceEuro(unitPrice, baseClients)} / RCS`

const formatSmsUnitPriceLabel = (unitPrice: number, baseClients: boolean): string =>
  `${formatSmsUnitPriceEuro(unitPrice, baseClients)} / SMS`

interface SmsRcsSendWave {
  id: string
  date: string
  volume: string
}

interface SmsRcsSendWavePdf {
  date: string
  volume?: number
}

function formatSmsRcsSendDateForDisplay(isoDate: string): string {
  if (!isoDate.trim()) return ''
  const [y, m, d] = isoDate.split('-').map((part) => Number(part))
  if (!y || !m || !d) return isoDate
  return new Date(y, m - 1, d).toLocaleDateString('fr-FR')
}

function normalizeSmsRcsSendWavesForPdf(waves: SmsRcsSendWave[]): SmsRcsSendWavePdf[] {
  return waves
    .filter((wave) => wave.date.trim())
    .map((wave) => {
      const volume = Math.max(0, Math.floor(Number(wave.volume) || 0))
      return {
        date: wave.date.trim(),
        ...(volume > 0 ? { volume } : {}),
      }
    })
}

function appendSmsRcsSendWaveDevisLines(
  lines: SmsRcsMiniDevisLine[],
  waves: SmsRcsSendWavePdf[],
  unitLabel: 'SMS' | 'RCS',
) {
  if (waves.length === 0) return
  waves.forEach((wave, index) => {
    const label = waves.length > 1 ? `Date d'envoi ${index + 1}` : "Date d'envoi"
    const dateStr = formatSmsRcsSendDateForDisplay(wave.date)
    lines.push({
      label,
      value: wave.volume ? `${dateStr} — ${formatNumber(wave.volume, 0)} ${unitLabel}` : dateStr,
      muted: true,
    })
  })
}

interface SmsRcsMiniDevisLine {
  label: string
  value: string
  emphasis?: boolean
  muted?: boolean
}

function SmsRcsMiniDevisPanel({
  title,
  lines,
  totalHt,
  emptyMessage,
}: {
  title: string
  lines: SmsRcsMiniDevisLine[]
  totalHt?: number | null
  emptyMessage: string
}) {
  const totalTtc = totalHt != null && totalHt > 0 ? getStrategyBudgetTtc(totalHt) : null

  return (
    <div className="rounded-xl border-2 border-[#E94C16]/25 bg-gradient-to-br from-orange-50/60 via-white to-white p-4 shadow-sm">
      <h4 className="text-sm font-semibold text-foreground tracking-tight">{title}</h4>
      {lines.length === 0 ? (
        <p className="text-sm text-muted-foreground mt-3">{emptyMessage}</p>
      ) : (
        <>
          <dl className="mt-3 space-y-2 text-sm">
            {lines.map((line) => (
              <div
                key={line.label}
                className={cn(
                  'flex justify-between items-baseline gap-4',
                  line.muted ? 'text-muted-foreground text-xs' : 'text-foreground',
                )}
              >
                <dt className={cn(line.emphasis && 'font-semibold')}>{line.label}</dt>
                <dd className={cn('tabular-nums text-right shrink-0', line.emphasis && 'font-semibold')}>
                  {line.value}
                </dd>
              </div>
            ))}
          </dl>
          {totalHt != null && totalHt > 0 ? (
            <div className="border-t border-[#E94C16]/20 pt-3 mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-xl border-2 border-[#E94C16] bg-white px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#E94C16]">Total HT</p>
                <p className="mt-1 text-lg font-extrabold leading-none text-[#E94C16] tabular-nums">
                  {formatEuro(totalHt)}
                </p>
                <p className="mt-1.5 text-[9px] font-medium text-[#E94C16]/80">Hors taxes</p>
              </div>
              <div className="rounded-xl border-2 border-[#E94C16] bg-white px-3 py-2.5 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">Total TTC</p>
                <p className="mt-1 text-lg font-extrabold leading-none text-slate-600 tabular-nums">
                  {formatEuro(totalTtc!)}
                </p>
                <p className="mt-1.5 text-[9px] font-medium text-slate-600/80">TVA 20 % incluse</p>
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

const VENTE_SOCIAL_PDF_LOGO_PATH = '/Logo Link Vertical (Orange).png'

/** Logo pour le PDF Stratégies Social media — même fichier pour téléchargement, pack ZIP et Validation TM. */
async function fetchVenteSocialPdfLogoDataUrl(timeoutMs = 2000): Promise<string | null> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
    const res = await fetch(VENTE_SOCIAL_PDF_LOGO_PATH, { signal: controller.signal })
    clearTimeout(timeoutId)
    if (!res.ok) return null
    const blob = await res.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(typeof reader.result === 'string' ? reader.result : null)
      reader.onerror = () => resolve(null)
      reader.readAsDataURL(blob)
    })
  } catch {
    return null
  }
}

/** Objectifs « max » performance (alignés sur le mode KPIs → budget du calculateur) */
function isMaxObjective(objective: string): boolean {
  const o = objective.trim().toLowerCase()
  return o === 'conversion' || o === 'leads' || o === 'likes'
}

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 22,
    marginBottom: 14,
    fontWeight: 'bold',
    color: '#1a1a1a',
    lineHeight: 1.35,
    width: '100%',
  },
  clientName: {
    fontSize: 18,
    marginTop: 0,
    marginBottom: 14,
    color: '#E94C16',
    fontWeight: 'bold',
    lineHeight: 1.3,
    width: '100%',
  },
  clientComment: {
    fontSize: 12,
    marginTop: 8,
    marginBottom: 12,
    color: '#666666',
    lineHeight: 1.45,
    width: '100%',
  },
  strategyCommentOnCover: {
    fontSize: 11,
    marginTop: 4,
    marginBottom: 4,
    color: '#666666',
    lineHeight: 1.45,
    width: '100%',
  },
  strategyCommentNameOnCover: {
    fontSize: 11,
    marginTop: 10,
    marginBottom: 2,
    color: '#374151',
    fontWeight: 'bold',
    lineHeight: 1.45,
    width: '100%',
  },
  /** Page de garde : tout en colonne (évite chevauchements flex row logo + titre dans Yoga/react-pdf). */
  pdfCoverRoot: {
    width: '100%',
    flexDirection: 'column',
  },
  pdfCoverLogo: {
    width: 40,
    height: 40,
    marginBottom: 12,
    objectFit: 'contain',
  },
  summary: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E94C16',
    width: '100%',
  },
  summaryText: {
    fontSize: 14,
    marginBottom: 5,
    color: '#666666',
  },
  summaryTotal: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#E94C16',
    marginTop: 5,
  },
  /** Lignes PDF : une balise <Text> par ligne (pas de \\n) — hauteur correcte + pagination. */
  pdfBlockText: {
    fontSize: 10,
    color: '#111827',
    lineHeight: 1.5,
    width: '100%',
  },
  pdfSummaryBlockText: {
    fontSize: 11,
    color: '#374151',
    lineHeight: 1.5,
    width: '100%',
  },
  pdfStrategyTitleLine: {
    fontSize: 11,
    color: '#374151',
    marginBottom: 6,
    lineHeight: 1.45,
    width: '100%',
  },
  pdfLegendLine: {
    fontSize: 10,
    color: '#111827',
    marginBottom: 5,
    lineHeight: 1.5,
    width: '100%',
  },
  pdfItemPlatform: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
    lineHeight: 1.35,
    width: '100%',
  },
  pdfItemObjective: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 10,
    lineHeight: 1.4,
    width: '100%',
  },
  pdfItemDetailLine: {
    fontSize: 10,
    color: '#111827',
    marginBottom: 4,
    lineHeight: 1.5,
    width: '100%',
  },
  itemCard: {
    marginBottom: 16,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    width: '100%',
    flexDirection: 'column',
    alignItems: 'flex-start',
  },
  /** Conservé pour le PDF SMS / RCS (devis) qui utilise encore des lignes label | valeur en row. */
  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 2,
  },
  itemLabel: {
    fontSize: 10,
    color: '#666666',
  },
  itemValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  pdfStrategySheetTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E94C16',
    marginBottom: 14,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  pdfCoverHint: {
    fontSize: 11,
    color: '#666666',
    marginTop: 8,
    lineHeight: 1.55,
    width: '100%',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  pdfSectionHeader: {
    marginTop: 12,
    marginBottom: 8,
    paddingBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#E94C16',
    width: '100%',
  },
  pdfSectionHeaderTitle: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#111827',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  pdfBudgetBreakdown: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fafafa',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  pdfBudgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
    width: '100%',
  },
  pdfBudgetRowLabel: {
    fontSize: 10,
    color: '#6b7280',
  },
  pdfBudgetRowValue: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
  },
  pdfBudgetTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#E94C16',
    width: '100%',
  },
  pdfBudgetTotalLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
  },
  pdfBudgetTotalValue: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#E94C16',
  },
  pdfCommentBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f9fafb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    width: '100%',
  },
  pdfTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    paddingVertical: 5,
    paddingHorizontal: 8,
    marginTop: 8,
    borderTopLeftRadius: 4,
    borderTopRightRadius: 4,
    width: '100%',
  },
  pdfTableRow: {
    flexDirection: 'row',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    width: '100%',
  },
  pdfTableCellPlatform: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#111827',
    width: '16%',
  },
  pdfTableCellObjective: {
    fontSize: 8,
    color: '#4b5563',
    width: '16%',
  },
  pdfTableCellBudget: {
    fontSize: 8,
    fontWeight: 'bold',
    color: '#111827',
    width: '14%',
    textAlign: 'right',
  },
  pdfTableCellDaily: {
    fontSize: 8,
    color: '#4b5563',
    width: '14%',
    textAlign: 'right',
  },
  pdfTableCellDiffusion: {
    fontSize: 7,
    color: '#4b5563',
    width: '22%',
    textAlign: 'center',
  },
  pdfTableCellKpi: {
    fontSize: 7,
    color: '#6b7280',
    width: '18%',
    textAlign: 'right',
  },
  pdfCoverTableTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  total: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'right',
    color: '#E94C16',
    paddingTop: 20,
    borderTopWidth: 2,
    borderTopColor: '#E94C16',
  },
  calendarSection: {
    marginTop: 16,
    padding: 10,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  calendarGridRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  calendarCell: {
    width: 22,
    height: 22,
    marginRight: 2,
    marginBottom: 2,
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  calendarDayNum: {
    fontSize: 8,
    color: '#374151',
  },
})

/** Nombre maximum d’encarts plateforme (lignes de campagne) par page de détail PDF. */
/** Une stratégie est exportable PDF si elle a des lignes OU un calendrier renseigné. */
function strategyBlockHasPdfContent(block: StrategyBlock): boolean {
  const hasItems = block.items.length > 0
  const hasAdditionalSales = getAdditionalSalesTotal(block) > 0 || getActiveAdditionalSales(block).length > 0
  const cal = block.calendar
  const hasCalendar = !!cal?.startDate && (
    isStrategyCalendarData(cal)
      ? cal.duration > 0 || cal.items.length > 0
      : !!(cal as StrategyCalendar).endDate
  )
  return hasItems || hasAdditionalSales || hasCalendar
}

function formatIsoToPdfDate(iso: string) {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return `${d ?? ''}/${m ?? ''}/${y ?? ''}`
}

/** Dates de diffusion par plateforme (PDF) — extrait pour pages séparées par campagne. */
function getPdfStrategyPlatformDates(
  block: StrategyBlock,
  platform: string,
): { start: string; end: string } | null {
  const c = block.calendar
  if (!c) return null
  if (isStrategyCalendarData(c)) {
    if (!c.startDate || !c.items?.length) return null
    const calItem = c.items.find((i) => i.platform === platform)
    if (!calItem) return null
    const base = new Date(c.startDate + 'T12:00:00')
    const start = new Date(base)
    start.setDate(start.getDate() + calItem.startDay)
    const end = new Date(base)
    end.setDate(end.getDate() + calItem.startDay + Math.max(1, calItem.length) - 1)
    return {
      start: formatIsoToPdfDate(start.toISOString().slice(0, 10)),
      end: formatIsoToPdfDate(end.toISOString().slice(0, 10)),
    }
  }
  const legacy = c as StrategyCalendar
  if ((legacy.ranges ?? []).length > 0) {
    const r = legacy.ranges!.find(
      (x) =>
        x.platform === platform ||
        (x.phaseName && `${x.platform} (${x.phaseName})` === platform),
    )
    if (r) return { start: formatIsoToPdfDate(r.startDate), end: formatIsoToPdfDate(r.endDate) }
    return null
  }
  if (!legacy.startDate || !legacy.endDate || !legacy.days) return null
  const entryKeys = Object.entries(legacy.days).filter(([, arr]) =>
    (arr ?? []).some((e) => e === platform || e.startsWith(platform + '::')),
  )
  if (entryKeys.length === 0) return null
  const dates = entryKeys.map(([d]) => d).sort()
  return { start: formatIsoToPdfDate(dates[0]!), end: formatIsoToPdfDate(dates[dates.length - 1]!) }
}

function getPdfStrategyItemDates(
  block: StrategyBlock,
  item: StrategyItem,
): { start: string; end: string } | null {
  const composite = `${item.platform}::${item.objective}`
  return (
    getPdfStrategyPlatformDates(block, composite) ??
    getPdfStrategyPlatformDates(block, item.platform)
  )
}

function StrategyPdfSectionHeader({ title }: { title: string }) {
  return (
    <View style={styles.pdfSectionHeader}>
      <Text style={styles.pdfSectionHeaderTitle} wrap>
        {title}
      </Text>
    </View>
  )
}

function StrategyPdfBudgetBreakdown({ block }: { block: StrategyBlock }) {
  const mediaTotal = block.items
    .filter(isMediaStrategyItem)
    .reduce((sum, item) => sum + item.budget, 0)
  const additionalSalesLines = getActiveAdditionalSales(block)
  const additionalTotal = additionalSalesLines.reduce((sum, line) => sum + line.total, 0)
  const total = getStrategyBlockBudgetTotal(block)

  return (
    <View style={styles.pdfBudgetBreakdown}>
      {mediaTotal > 0 && (
        <View style={styles.pdfBudgetRow}>
          <Text style={styles.pdfBudgetRowLabel} wrap>
            Budget média (plateforme(s))
          </Text>
          <Text style={styles.pdfBudgetRowValue} wrap>
            {formatNumber(mediaTotal, 0)} €
          </Text>
        </View>
      )}
      {additionalSalesLines.length > 0 && (
        <>
          <View style={styles.pdfBudgetRow}>
            <Text style={[styles.pdfBudgetRowLabel, { fontWeight: 'bold' }]} wrap>
              Vente(s) additionnelle(s)
            </Text>
            <Text style={styles.pdfBudgetRowValue} wrap>
              {formatNumber(additionalTotal, 0)} €
            </Text>
          </View>
          {additionalSalesLines.map((line) => (
            <View key={line.id} style={[styles.pdfBudgetRow, { paddingLeft: 8 }]}>
              <Text style={[styles.pdfBudgetRowLabel, { fontSize: 9 }]} wrap>
                {`• ${line.label}${line.count > 1 ? ` (× ${line.count})` : ''}`}
              </Text>
              <Text style={[styles.pdfBudgetRowValue, { fontSize: 9 }]} wrap>
                {formatNumber(line.total, 0)} €
              </Text>
            </View>
          ))}
        </>
      )}
      <View style={styles.pdfBudgetTotalRow}>
        <Text style={styles.pdfBudgetTotalLabel} wrap>
          Total stratégie HT
        </Text>
        <Text style={styles.pdfBudgetTotalValue} wrap>
          {formatNumber(total, 0)} €
        </Text>
      </View>
      <View
        style={[
          styles.pdfBudgetTotalRow,
          { marginTop: 0, paddingTop: 4, borderTopWidth: 0 },
        ]}
      >
        <Text style={styles.pdfBudgetTotalLabel} wrap>
          Total stratégie TTC
        </Text>
        <Text style={styles.pdfBudgetTotalValue} wrap>
          {formatNumber(getStrategyBudgetTtc(total), 0)} €
        </Text>
      </View>
    </View>
  )
}

function getStrategyItemKpiDisplay(item: StrategyItem): string {
  if (item.customKpiLabel) return item.customKpiLabel
  if (item.estimatedKPIs > 0) {
    return `${formatNumber(item.estimatedKPIs, 0)} ${getPdfKpiUnitLabel(item.objective)}${
      item.objective === 'Leads' ? ' (est.)' : ''
    }`
  }
  return `${getPdfMaxKpiLabel(item.objective)}${item.objective === 'Leads' ? ' (est.)' : ''}`
}

function getStrategyItemDiffusionDisplay(
  block: StrategyBlock,
  item: StrategyItem,
): string {
  const platformDates = getPdfStrategyItemDates(block, item)
  if (platformDates) {
    return `${platformDates.start} → ${platformDates.end}`
  }
  if (item.days > 0) {
    return `${item.days} jour(s)`
  }
  return '—'
}

function StrategyPdfMediaTable({
  block,
  items,
}: {
  block: StrategyBlock
  items: StrategyItem[]
}) {
  if (items.length === 0) return null
  return (
    <View style={{ width: '100%' }}>
      <View style={styles.pdfTableHeader}>
        <Text style={styles.pdfTableCellPlatform} wrap>
          Plateforme(s)
        </Text>
        <Text style={styles.pdfTableCellObjective} wrap>
          Objectif
        </Text>
        <Text style={styles.pdfTableCellBudget} wrap>
          Budget
        </Text>
        <Text style={styles.pdfTableCellDaily} wrap>
          Budget quotidien
        </Text>
        <Text style={styles.pdfTableCellDiffusion} wrap>
          Diffusion
        </Text>
        <Text style={styles.pdfTableCellKpi} wrap>
          KPIs
        </Text>
      </View>
      {items.map((item) => (
        <View key={item.id} style={styles.pdfTableRow}>
          <Text style={styles.pdfTableCellPlatform} wrap>
            {item.platform}
          </Text>
          <Text style={styles.pdfTableCellObjective} wrap>
            {item.objective}
          </Text>
          <Text style={styles.pdfTableCellBudget} wrap>
            {formatNumber(item.budget, 0)} €
          </Text>
          <Text style={styles.pdfTableCellDaily} wrap>
            {item.dailyBudget > 0 ? `${formatNumber(item.dailyBudget, 1)} €` : '—'}
          </Text>
          <Text style={styles.pdfTableCellDiffusion} wrap>
            {getStrategyItemDiffusionDisplay(block, item)}
          </Text>
          <Text style={styles.pdfTableCellKpi} wrap>
            {getStrategyItemKpiDisplay(item)}
          </Text>
        </View>
      ))}
    </View>
  )
}

function StrategyPdfAdditionalSalesTable({
  sales,
}: {
  sales: ReturnType<typeof getActiveAdditionalSales>
}) {
  if (sales.length === 0) return null
  return (
    <View style={{ width: '100%' }}>
      <View style={styles.pdfTableHeader}>
        <Text style={[styles.pdfTableCellPlatform, { width: '38%' }]} wrap>
          Option(s)
        </Text>
        <Text style={[styles.pdfTableCellObjective, { width: '14%', textAlign: 'center' }]} wrap>
          Qté
        </Text>
        <Text style={[styles.pdfTableCellBudget, { width: '24%' }]} wrap>
          P.U. HT
        </Text>
        <Text style={[styles.pdfTableCellKpi, { width: '24%', textAlign: 'right' }]} wrap>
          Total HT
        </Text>
      </View>
      {sales.map((sale) => (
        <View key={sale.id} style={styles.pdfTableRow}>
          <Text style={[styles.pdfTableCellPlatform, { width: '38%' }]} wrap>
            {sale.label}
          </Text>
          <Text style={[styles.pdfTableCellObjective, { width: '14%', textAlign: 'center' }]} wrap>
            {String(sale.count)}
          </Text>
          <Text style={[styles.pdfTableCellBudget, { width: '24%' }]} wrap>
            {formatNumber(sale.unitPrice, 0)} €
          </Text>
          <Text style={[styles.pdfTableCellKpi, { width: '24%', textAlign: 'right', fontWeight: 'bold' }]} wrap>
            {formatNumber(sale.total, 0)} €
          </Text>
        </View>
      ))}
      <View style={[styles.pdfTableRow, { backgroundColor: '#fafafa', borderBottomWidth: 0 }]}>
        <Text style={[styles.pdfTableCellPlatform, { width: '38%', fontWeight: 'bold' }]} wrap>
          Sous-total vente(s) additionnelle(s)
        </Text>
        <Text style={[styles.pdfTableCellObjective, { width: '14%' }]} wrap>
          {' '}
        </Text>
        <Text style={[styles.pdfTableCellBudget, { width: '24%' }]} wrap>
          {' '}
        </Text>
        <Text
          style={[
            styles.pdfTableCellKpi,
            { width: '24%', textAlign: 'right', fontWeight: 'bold', color: '#5b21b6' },
          ]}
          wrap
        >
          {formatNumber(
            sales.reduce((sum, s) => sum + s.total, 0),
            0,
          )}{' '}
          €
        </Text>
      </View>
    </View>
  )
}

/**
 * Résumé stratégie avec tableau plateformes & campagnes (budget quotidien et diffusion inclus).
 */
function StrategyPdfStrategyOverview({
  block,
  strategyIdx,
  showAe,
}: {
  block: StrategyBlock
  strategyIdx: number
  showAe: boolean
}) {
  const hasItems = block.items.length > 0
  const cal = block.calendar
  const hasCalendar = !!cal?.startDate && (
    isStrategyCalendarData(cal)
      ? cal.duration > 0 || cal.items.length > 0
      : !!(cal as StrategyCalendar).endDate
  )
  const additionalSales = getActiveAdditionalSales(block)
  const hasAdditionalSales = additionalSales.length > 0
  if (!hasItems && !hasCalendar && !hasAdditionalSales) return null

  const mediaItems = block.items.filter(isMediaStrategyItem)
  const complementaryItems = block.items.filter(isComplementaryStrategyItem)
  const strategyAe = block.items.length > 0 ? block.items[0].aePercentage : 0

  return (
    <View style={{ width: '100%', flexDirection: 'column' }}>
      <View style={[styles.summary, { marginTop: 0 }]}>
        <Text style={styles.pdfStrategyTitleLine} wrap>
          Stratégie {strategyIdx + 1} : {block.name}
        </Text>
        {hasItems && (
          <>
            {showAe && (
              <Text style={[styles.pdfSummaryBlockText, { marginTop: 8 }]} wrap>
                AE : {strategyAe > 0 ? `${formatNumber(strategyAe, 0)} %` : '—'}
              </Text>
            )}
            {block.items.some((it) => it.tarifsDirection) && (
              <Text
                style={[
                  styles.pdfSummaryBlockText,
                  { marginTop: 6, fontStyle: 'italic', color: '#1d4ed8' },
                ]}
                wrap
              >
                Tarifs direction appliqués sur certaine(s) plateforme(s)
              </Text>
            )}
          </>
        )}
        {!hasItems && hasCalendar && (
          <Text style={[styles.pdfSummaryBlockText, { marginTop: 8 }]} wrap>
            Calendrier de diffusion
          </Text>
        )}
      </View>

      {(hasItems || hasAdditionalSales) && <StrategyPdfBudgetBreakdown block={block} />}

      {!!block.comment?.trim() && (
        <View style={styles.pdfCommentBox}>
          <Text style={[styles.pdfSummaryBlockText, { fontWeight: 'bold', marginBottom: 4 }]} wrap>
            Commentaire
          </Text>
          <Text style={[styles.clientComment, { marginTop: 0, marginBottom: 0, fontSize: 10 }]} wrap>
            {block.comment.trim()}
          </Text>
        </View>
      )}

      {mediaItems.length > 0 && (
        <View style={{ width: '100%' }}>
          <StrategyPdfSectionHeader title="Plateforme(s) & campagne(s)" />
          <StrategyPdfMediaTable block={block} items={mediaItems} />
        </View>
      )}

      {hasAdditionalSales && (
        <View style={{ width: '100%' }}>
          <StrategyPdfSectionHeader title="Vente(s) additionnelle(s)" />
          <StrategyPdfAdditionalSalesTable sales={additionalSales} />
        </View>
      )}

      {complementaryItems.length > 0 &&
        complementaryItems.some(
          (item) =>
            !(
              (item.platform === 'META' &&
                additionalSales.some((s) => s.id === 'leadsMeta' && s.viaMake)) ||
              (item.platform === 'Facebook only' &&
                additionalSales.some((s) => s.id === 'leadsMeta' && s.viaMake)) ||
              (item.platform === 'LinkedIn' &&
                additionalSales.some((s) => s.id === 'leadsLinkedIn' && s.viaMake))
            ),
        ) && (
          <View style={{ width: '100%' }}>
            <StrategyPdfSectionHeader title="Prestation(s) Make" />
            {complementaryItems
              .filter(
                (item) =>
                  !(
                    (item.platform === 'META' &&
                      additionalSales.some((s) => s.id === 'leadsMeta' && s.viaMake)) ||
                    (item.platform === 'LinkedIn' &&
                      additionalSales.some((s) => s.id === 'leadsLinkedIn' && s.viaMake))
                  ),
              )
              .map((item) => (
                <Text key={item.id} style={[styles.pdfLegendLine, { color: '#6d28d9', marginBottom: 3 }]} wrap>
                  {`• ${MAKE_LEADS_OPTION_LABEL.replace('leads', 'lead(s)')} — ${formatNumber(item.budget, 0)} € HT`}
                </Text>
              ))}
          </View>
        )}

    </View>
  )
}

// Composant PDF multi-stratégies — une page récapitulative par stratégie
const PDFDocument = ({
  strategies,
  clientName: _clientName,
  userName: _userName,
  aePercentage: _aePercentage,
  comment: _comment,
  logoDataUrl: _logoDataUrl,
  includeAeInPdf,
}: {
  strategies: StrategyBlock[]
  clientName: string
  userName: string
  aePercentage: number
  comment?: string
  logoDataUrl?: string | null
  includeAeInPdf: boolean
}) => {
  const strategyPages = strategies
    .map((block, strategyIdx) => ({ block, strategyIdx }))
    .filter(({ block }) => strategyBlockHasPdfContent(block))

  return (
    <Document>
      {strategyPages.length === 0 ? (
        <Page size="A4" style={styles.page} wrap>
          <Text style={styles.pdfCoverHint} wrap>
            Aucune stratégie avec ligne(s) de campagne(s) ou calendrier de diffusion à inclure dans l&apos;export.
          </Text>
        </Page>
      ) : (
      strategyPages.map(({ block, strategyIdx }) => (
        <Page key={block.id} size="A4" style={styles.page} wrap>
          <Text style={styles.pdfStrategySheetTitle} wrap>
            Stratégie {strategyIdx + 1} · {block.name}
          </Text>
          <StrategyPdfStrategyOverview
            block={block}
            strategyIdx={strategyIdx}
            showAe={includeAeInPdf}
          />
        </Page>
      ))
      )}
    </Document>
  )
}

// Composant PDF pour SMS/RCS
const SMSRCSPDFDocument = ({
  type,
  volume,
  unitPrice,
  totalPrice,
  options,
  salesConditions,
  fileName,
  tarifIntermarche,
  campaignMonths,
  creaByLinkCount,
  comment,
  sendWaves,
  imageBase64,
}: {
  type: 'sms' | 'rcs'
  volume: number
  unitPrice: number
  totalPrice: number
  options: {
    ciblage?: boolean
    baseClients?: boolean
    richSms?: boolean
    agent?: boolean
    creaByLink?: boolean
    tarifIntermarche?: boolean
    duplicateCampaign?: boolean
  }
  salesConditions: readonly string[]
  fileName: string
  tarifIntermarche?: boolean
  campaignMonths?: number
  creaByLinkCount?: number
  comment?: string
  sendWaves?: SmsRcsSendWavePdf[]
  imageBase64?: string | null
}) => {
  const typeLabel = type === 'sms' ? 'SMS' : 'RCS'
  const documentTitle = fileName.trim() || `Devis ${typeLabel}`

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <Text style={styles.title}>
          Devis {typeLabel} - {documentTitle}
        </Text>
        <Text style={[styles.summaryText, { marginBottom: 6, fontSize: 12 }]}>
          {new Date().toLocaleDateString('fr-FR')}
        </Text>
        {comment && (
          <Text style={[styles.summaryText, { marginBottom: 12, fontStyle: 'italic', color: '#666', fontSize: 11 }]}>
            {comment}
          </Text>
        )}

        {/* Récapitulatif avec options intégrées */}
        <View style={styles.summary}>
          <Text style={[styles.chartTitle, { marginBottom: 8, fontSize: 12 }]}>
            Récapitulatif de la demande
          </Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Type de campagne(s) :</Text>
            <Text style={styles.itemValue}>{typeLabel}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Volume :</Text>
            <Text style={styles.itemValue}>{formatNumber(volume, 0)} {typeLabel}</Text>
          </View>
          {sendWaves?.map((wave, index) => (
            <View key={`${wave.date}-${index}`} style={styles.itemRow}>
              <Text style={styles.itemLabel}>
                {(sendWaves?.length ?? 0) > 1 ? `Date d'envoi ${index + 1}` : "Date d'envoi"} :
              </Text>
              <Text style={styles.itemValue}>
                {formatSmsRcsSendDateForDisplay(wave.date)}
                {wave.volume ? ` — ${formatNumber(wave.volume, 0)} ${typeLabel}` : ''}
              </Text>
            </View>
          ))}

          {options.tarifIntermarche && (
            <View style={styles.itemRow}>
              <Text style={[styles.itemLabel, { color: '#E94C16', fontWeight: 'bold' }]}>
                Tarif Intermarché :
              </Text>
              <Text style={[styles.itemValue, { color: '#E94C16', fontWeight: 'bold' }]}>Activé</Text>
            </View>
          )}
          {options.duplicateCampaign && campaignMonths && campaignMonths > 1 && (
            <View style={styles.itemRow}>
              <Text style={[styles.itemLabel, { fontWeight: 'bold' }]}>Nombre de campagne(s) :</Text>
              <Text style={[styles.itemValue, { fontWeight: 'bold' }]}>× {campaignMonths}</Text>
            </View>
          )}

          {/* Prix total */}
          <View style={[styles.itemRow, { marginTop: 6, paddingTop: 6, borderTop: '1 solid #e5e5e5' }]}>
            <Text style={[styles.itemLabel, { fontSize: 11, fontWeight: 'bold' }]}>Prix total HT :</Text>
            <Text style={[styles.itemValue, { fontSize: 13, fontWeight: 'bold', color: '#E94C16' }]}>
              {formatNumber(totalPrice, 2)} €
            </Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={[styles.itemLabel, { fontSize: 11, fontWeight: 'bold' }]}>Prix total TTC :</Text>
            <Text style={[styles.itemValue, { fontSize: 13, fontWeight: 'bold', color: '#475569' }]}>
              {formatNumber(getStrategyBudgetTtc(totalPrice), 2)} €
            </Text>
          </View>
        </View>

        {/* Image jointe (potentiels calculés) */}
        {imageBase64 && (
          <View style={{ marginTop: 12, marginBottom: 12 }}>
            <Text style={[styles.chartTitle, { marginBottom: 8, fontSize: 12 }]}>
              Potentiel(s) calculé(s)
            </Text>
            <Image
              src={imageBase64}
              style={{
                maxWidth: '100%',
                maxHeight: 180,
                objectFit: 'contain',
              }}
            />
          </View>
        )}

        {/* Conditions de vente */}
        <View style={{ marginTop: 'auto' }}>
          <Text style={[styles.chartTitle, { marginBottom: 6, fontSize: 12 }]}>
            Condition(s) de vente {typeLabel}
          </Text>
          <View style={[styles.itemCard, { backgroundColor: '#f9f9f9', padding: 8, marginBottom: 0 }]}>
            {salesConditions.map((condition, idx) => (
              <Text key={idx} style={[styles.itemLabel, { fontSize: 7, marginBottom: 2 }]}>
                • {condition}
              </Text>
            ))}
          </View>
        </View>
      </Page>
    </Document>
  )
}

/** PDF export onglet KPIs max (synthèse). */
const KpiMaxPdfDocument = ({
  clientName,
  userName,
  diffusionDaysStr,
  platformsEnabled,
  compteStrings,
}: {
  clientName: string
  userName: string
  diffusionDaysStr: string
  platformsEnabled: Record<KpiMaxPlatformId, boolean>
  compteStrings: KpiMaxCompteStrings
}) => {
  const valid = kpiMaxValidateInputs(platformsEnabled, diffusionDaysStr, compteStrings)
  const rows: KpiMaxComputedRow[] =
    valid.ok && valid.diffusionDays && valid.comptes
      ? computeKpiMaxRowsForEnabledPlatforms(platformsEnabled, valid.comptes, valid.diffusionDays)
      : []

  const selectedLabels =
    KPI_MAX_PLATFORM_ORDER.filter(({ id }) => platformsEnabled[id])
      .map(({ label }) => label)
      .join(', ') || '—'

  const rowPdfBlock = (scenario: 'ideal' | 'max', row: KpiMaxComputedRow) => {
    const impressions = scenario === 'ideal' ? row.idealImpressions : row.maxImpressions
    const clics = scenario === 'ideal' ? row.idealClics : row.maxClics

    return (
      <View wrap={false}>
        <Text style={{ marginBottom: 3, fontSize: 10, lineHeight: 1.45 }} wrap>
          • {row.label}
        </Text>
        <Text style={{ marginBottom: 8, marginLeft: 12, fontSize: 10, lineHeight: 1.45 }} wrap>
          {formatNumber(impressions, 0)} impression(s) · {formatNumber(clics, 0)} clic(s)
        </Text>
      </View>
    )
  }

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>KPIs max</Text>
        <Text style={[styles.summaryText, { marginBottom: 6, fontSize: 12 }]}>
          {userName ? `Commercial : ${userName}` : 'Export KPIs max'}
        </Text>
        {clientName.trim() ? (
          <Text style={[styles.clientName, { fontSize: 14, marginBottom: 10 }]}>Client : {clientName.trim()}</Text>
        ) : null}
        <Text style={[styles.summaryText, { marginBottom: 12 }]}>{new Date().toLocaleDateString('fr-FR')}</Text>

        <View style={styles.summary}>
          <Text style={[styles.chartTitle, { marginBottom: 8 }]}>Saisie</Text>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Plateforme(s)</Text>
            <Text style={styles.itemValue}>{selectedLabels}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Durée (jour(s))</Text>
            <Text style={styles.itemValue}>{diffusionDaysStr.trim() || '—'}</Text>
          </View>
          {(platformsEnabled.meta || platformsEnabled.display || platformsEnabled.youtube) ? (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Nombre de compte(s) (META)</Text>
              <Text style={styles.itemValue}>{compteStrings.meta.trim() || '—'}</Text>
            </View>
          ) : null}
          {platformsEnabled.linkedin ? (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Nombre de compte(s) LinkedIn</Text>
              <Text style={styles.itemValue}>{compteStrings.linkedin.trim() || '—'}</Text>
            </View>
          ) : null}
          {platformsEnabled.snapchat ? (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Nombre de compte(s) Snapchat</Text>
              <Text style={styles.itemValue}>{compteStrings.snapchat.trim() || '—'}</Text>
            </View>
          ) : null}
          {platformsEnabled.tiktok ? (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Nombre de compte(s) Tiktok</Text>
              <Text style={styles.itemValue}>{compteStrings.tiktok.trim() || '—'}</Text>
            </View>
          ) : null}
        </View>

        {!valid.ok ? (
          <Text style={{ marginTop: 8, fontSize: 11, color: '#b45309' }} wrap>
            {valid.reason ?? "Complétez les champs requis dans l'outil."}
          </Text>
        ) : rows.length === 0 ? (
          <Text style={{ marginTop: 8 }} wrap>
            Aucune ligne à afficher.
          </Text>
        ) : (
          <>
            <Text style={[styles.chartTitle, { marginTop: 10, marginBottom: 8 }]}>Stratégie idéale</Text>
            {rows.map((r) => (
              <View key={`ideal-${r.id}`}>{rowPdfBlock('ideal', r)}</View>
            ))}
            <Text style={[styles.chartTitle, { marginTop: 14, marginBottom: 8 }]}>Stratégie max</Text>
            {rows.map((r) => (
              <View key={`max-${r.id}`}>{rowPdfBlock('max', r)}</View>
            ))}
          </>
        )}
      </Page>
    </Document>
  )
}

export function Vente2Calculator({
  view,
  pageTitle = 'Calculateur Vente 2',
  pageDescription = 'Outil à titre informatif : estimez prix, volumes et planning pour la lecture d’une brief — sans valeur contractuelle.',
}: {
  view: Vente2CalculatorView
  pageTitle?: string
  pageDescription?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const devisIdFromUrl = searchParams.get('devis')
  const strategyIdFromUrl = searchParams.get('strategy')
  const [kpiSubSection, setKpiSubSection] = useState<'kpiMax' | 'kpiMax2'>('kpiMax')
  const pdvSection: PdvSection =
    view === 'kpiMax' ? kpiSubSection : view === 'calendar' ? 'calendar' : view === 'sms' ? 'sms' : 'social'

  // État du formulaire
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('budget-to-kpis')
  const [mainValue, setMainValue] = useState<string>('') // Budget ou KPIs selon le mode
  const [aePercentage, setAePercentage] = useState<string>('40')
  const [diffusionDays, setDiffusionDays] = useState<string>('14')
  /** KPIs max : une plateforme + nombre de comptes + durée */
  const [kpiMaxPlatformSelected, setKpiMaxPlatformSelected] = useState<KpiMaxPlatformId | null>(null)
  const kpiMaxPlatformsEnabled = useMemo(
    () => kpiMaxSelectedToEnabled(kpiMaxPlatformSelected),
    [kpiMaxPlatformSelected],
  )
  const [kpiMaxCompteMeta, setKpiMaxCompteMeta] = useState<string>('')
  const [kpiMaxCompteLinkedin, setKpiMaxCompteLinkedin] = useState<string>('')
  const [kpiMaxCompteSnapchat, setKpiMaxCompteSnapchat] = useState<string>('')
  const [kpiMaxCompteTiktok, setKpiMaxCompteTiktok] = useState<string>('')
  /** KPIs max : champ durée (jours). */
  const [kpiMaxDiffusionDays, setKpiMaxDiffusionDays] = useState<string>('14')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => [])
  const [smsVolume, setSmsVolume] = useState<string>('') // nombre de SMS pour le module SMS
  const [smsType, setSmsType] = useState<SmsType>('sms')
  const [smsOptions, setSmsOptions] = useState<SmsOptionsState>({
    ciblage: false,
    baseClients: false,
    richSms: false,
    agent: false,
    creaByLink: false,
    tarifIntermarche: false,
    duplicateCampaign: false,
  })
  const [campaignMonths, setCampaignMonths] = useState<string>('1') // nombre de mois pour duplication campagne RCS
  const [creaByLinkCount, setCreaByLinkCount] = useState<string>('1') // nombre de CREA BY LINK
  const [searchClicsStudyValue, setSearchClicsStudyValue] = useState<string>('') // Search > Clics : valeur selon étude TM
  
  // État des stratégies (jusqu'à 3)
  const [strategies, setStrategies] = useState<StrategyBlock[]>(() => [
    { id: 'strategy-1', name: 'Stratégie 1', items: [] },
  ])
  const [activeStrategyId, setActiveStrategyId] = useState<string>('strategy-1')
  const [expandedStrategies, setExpandedStrategies] = useState<Record<string, boolean>>({
    'strategy-1': true,
  })
  const [isAddingStrategy, setIsAddingStrategy] = useState(false)
  const [newStrategyName, setNewStrategyName] = useState('')
  const [renamingStrategyId, setRenamingStrategyId] = useState<string | null>(null)
  const [renamingStrategyName, setRenamingStrategyName] = useState('')
  // Rétroplanning : calendrier « partir de 0 » / SMS (global) ; Social = une entrée par stratégie Social media
  const [retroCalendarData, setRetroCalendarData] = useState<StrategyCalendarData | null>(null)
  const [retroStartDate, setRetroStartDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [retroDurationDays, setRetroDurationDays] = useState(90)
  const [retroPlatformPhases, setRetroPlatformPhases] = useState<RetroPlatformPhase[]>([])
  const [retroSmsPhases, setRetroSmsPhases] = useState<RetroPhase[]>([])
  const [retroLinkSocial, setRetroLinkSocial] = useState(false)
  const [retroLinkSms, setRetroLinkSms] = useState(false)
  /** Rétro Social lié à chaque stratégie (phases, dates, découpe lignes, calendrier manuel résiduel). */
  const [retroSocialByStrategy, setRetroSocialByStrategy] = useState<Record<string, RetroSocialState>>({})
  /** Dates de début par ligne (clé platform::objectif), indexées par id de stratégie (évite les collisions entre stratégies). */
  const [defineDatesPerStrategy, setDefineDatesPerStrategy] = useState<
    Record<string, Record<string, string>>
  >({})

  useEffect(() => {
    setRetroSocialByStrategy((prev) => {
      const next = { ...prev }
      let changed = false
      for (const s of strategies) {
        if (!next[s.id]) {
          next[s.id] = defaultRetroSocialState()
          changed = true
        }
      }
      for (const id of Object.keys(next)) {
        if (!strategies.some((s) => s.id === id)) {
          delete next[id]
          changed = true
        }
      }
      return changed ? next : prev
    })
  }, [strategies])

  const patchRetroSocial = useCallback((strategyId: string, patch: Partial<RetroSocialState>) => {
    setRetroSocialByStrategy((prev) => ({
      ...prev,
      [strategyId]: { ...(prev[strategyId] ?? defaultRetroSocialState()), ...patch },
    }))
  }, [])

  useEffect(() => {
    if (!retroLinkSocial) return
    setRetroSocialByStrategy((prev) => {
      let anyChanged = false
      const next = { ...prev }
      for (const s of strategies) {
        const bundle = next[s.id] ?? defaultRetroSocialState()
        const valid = new Set(s.items.map((it) => retroStrategyLineKey(it.platform, it.objective)))
        const splits = { ...bundle.socialLineSplits }
        let spChanged = false
        for (const k of Object.keys(splits)) {
          if (!valid.has(k)) {
            delete splits[k]
            spChanged = true
          }
        }
        if (spChanged) {
          next[s.id] = { ...bundle, socialLineSplits: splits }
          anyChanged = true
        }
      }
      return anyChanged ? next : prev
    })
  }, [retroLinkSocial, strategies])
  // Calendrier de diffusion : stratégie en cours d'édition
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [calendarStrategyId, setCalendarStrategyId] = useState<string | null>(null)
  const [calendarView, setCalendarView] = useState<'day' | 'month'>('day')
  const [calendarPeriodStart, setCalendarPeriodStart] = useState('')
  const [calendarPeriodEnd, setCalendarPeriodEnd] = useState('')
  const [calendarDays, setCalendarDays] = useState<Record<string, string[]>>({})
  const [calendarPlatformPhases, setCalendarPlatformPhases] = useState<Record<string, string[]>>({})
  const [calendarPhaseDays, setCalendarPhaseDays] = useState<CalendarPhaseDaysMap>({})
  const [calendarRanges, setCalendarRanges] = useState<CalendarRange[]>([])
  const [calendarSelectedEntry, setCalendarSelectedEntry] = useState<string | null>(null) // "platform" ou "platform::phaseName"
  const [calendarPhasesMenuPlatform, setCalendarPhasesMenuPlatform] = useState<string | null>(null)
  const [calendarDragging, setCalendarDragging] = useState(false)
  const [calendarNewPhaseName, setCalendarNewPhaseName] = useState('')
  /** Plage d’affichage du calendrier stratégique (modale Social) — aligné sur /vente */
  const [calendarDisplayStart, setCalendarDisplayStart] = useState('')
  const [calendarDisplayDuration, setCalendarDisplayDuration] = useState(90)
  const strategyCalendarModalInitRef = useRef(false)

  // Ligne personnalisable par plateforme
  const [customRows, setCustomRows] = useState<Record<string, CustomRowState>>(() => {
    const initial: Record<string, CustomRowState> = {}
    PLATFORMS_ORDER.forEach((platform) => {
      const objectives = CUSTOM_OBJECTIVES[platform] ?? DEFAULT_CUSTOM_OBJECTIVES
      initial[platform] = {
        objective:
          platform === 'Perf max' ? 'Conversion' : (objectives[0] ?? 'Impressions'),
        budget: '',
      }
    })
    return initial
  })
  
  // État pour la modale PDF
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [makeLeadsModalOpen, setMakeLeadsModalOpen] = useState(false)
  const [pendingLeadsRow, setPendingLeadsRow] = useState<
    (TableRowData & { customKpiLabel?: string }) | null
  >(null)
  const pendingLeadsRowRef = useRef<(TableRowData & { customKpiLabel?: string }) | null>(null)
  const [clientName, setClientName] = useState('')
  /** Inclure les % AE dans l’export PDF (récap stratégie). */
  const [pdfIncludeAe, setPdfIncludeAe] = useState(true)
  
  // État pour la modale PDF SMS/RCS
  const [smsPdfDialogOpen, setSmsPdfDialogOpen] = useState(false)
  const [smsPdfFileName, setSmsPdfFileName] = useState('')
  const [smsPdfComment, setSmsPdfComment] = useState('')
  const [smsRcsSendWaves, setSmsRcsSendWaves] = useState<SmsRcsSendWave[]>(() => [
    { id: 'send-1', date: '', volume: '' },
  ])
  const [smsPdfImage, setSmsPdfImage] = useState<string | null>(null)
  const [retroPdfDialogOpen, setRetroPdfDialogOpen] = useState(false)
  const [retroPdfFileName, setRetroPdfFileName] = useState('')
  const [retroPdfClientName, setRetroPdfClientName] = useState('')
  const [retroPdfComment, setRetroPdfComment] = useState('')
  const [retroPdfIncludeWeekView, setRetroPdfIncludeWeekView] = useState(true)
  const [retroPdfIncludeMonthView, setRetroPdfIncludeMonthView] = useState(true)
  const retroPdfExportRef = useRef<
    | ((
        filename: string,
        documentComment: string,
        clientName: string,
        options: RetroplanningPdfExportOptions,
      ) => Promise<void>)
    | null
  >(null)
  const [currentSmsType, setCurrentSmsType] = useState<'sms' | 'rcs'>('sms')
  const [savedDevisId, setSavedDevisId] = useState<string | null>(null)
  const [savedDevisName, setSavedDevisName] = useState('')
  const [saveDevisDialogOpen, setSaveDevisDialogOpen] = useState(false)
  const [saveDevisNameInput, setSaveDevisNameInput] = useState('')
  const [savingDevis, setSavingDevis] = useState(false)
  const [loadingDevis, setLoadingDevis] = useState(false)
  const [savedStrategyId, setSavedStrategyId] = useState<string | null>(null)
  const [savedStrategyName, setSavedStrategyName] = useState('')
  const [saveStrategyDialogOpen, setSaveStrategyDialogOpen] = useState(false)
  const [saveStrategyNameInput, setSaveStrategyNameInput] = useState('')
  const [savingStrategy, setSavingStrategy] = useState(false)
  const [loadingStrategy, setLoadingStrategy] = useState(false)
  
  // État pour la modale Validation TM
  const [validationTMDialogOpen, setValidationTMDialogOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [sendingToSlack, setSendingToSlack] = useState(false)
  const [globalPackDialogOpen, setGlobalPackDialogOpen] = useState(false)
  const [globalPackClientName, setGlobalPackClientName] = useState('')
  const [globalPackComment, setGlobalPackComment] = useState('')
  const [globalPackExporting, setGlobalPackExporting] = useState(false)
  const [userPseudo, setUserPseudo] = useState<string>('')
  
  // État pour le sélecteur de graphique
  const [chartView, setChartView] = useState<ChartView>('platform')
  const [strategyChartsOpen, setStrategyChartsOpen] = useState<Record<string, boolean>>({})
  
  // État pour le nom de l'utilisateur connecté
  const [userName, setUserName] = useState<string>('')
  const [userRole, setUserRole] = useState<string | null>(null)
  const [tarifsDirection, setTarifsDirection] = useState(false)

  // --- Logique de calcul SMS (indépendante du Social Media) ---
  // Volume saisi = volume par campagne
  const smsVolumeNumber = Math.max(0, Math.floor(Number(smsVolume) || 0))

  const campaignMonthsNumber = useMemo(() => {
    const parsed = parseInt(campaignMonths, 10)
    return isNaN(parsed) || parsed < 1 ? 1 : parsed
  }, [campaignMonths])

  const totalUnitsNumber = useMemo(() => {
    const perCampaign = smsVolumeNumber
    if (perCampaign <= 0) return 0
    const multiplier = smsOptions.duplicateCampaign ? campaignMonthsNumber : 1
    return perCampaign * multiplier
  }, [smsVolumeNumber, smsOptions.duplicateCampaign, campaignMonthsNumber])

  const smsBasePU = useMemo(() => {
    const n = totalUnitsNumber
    if (n <= 0) return 0
    if (n <= 10_000) return 0.1764
    if (n <= 25_000) return 0.1666
    if (n <= 50_000) return 0.1568
    if (n <= 100_000) return 0.147
    if (n <= 500_000) return 0.131
    // Hors barème : on garde la dernière tranche, mais on pourrait aussi bloquer
    return 0.131
  }, [totalUnitsNumber])

  const smsOptionPU = useMemo(() => {
    if (smsType !== 'sms' || smsOptions.baseClients) return 0
    let opt = 0
    if (smsOptions.ciblage) opt += CIBLAGE_UNIT_PRICE
    if (smsOptions.richSms) opt += 0.021
    return opt
  }, [smsType, smsOptions.baseClients, smsOptions.ciblage, smsOptions.richSms])

  const smsUnitPrice = useMemo(() => {
    if (smsType !== 'sms') return 0
    if (smsOptions.baseClients) return BASE_CLIENTS_UNIT_PRICE
    if (smsOptions.tarifIntermarche) return 0.13
    return smsBasePU + smsOptionPU
  }, [smsType, smsOptions.baseClients, smsOptions.tarifIntermarche, smsBasePU, smsOptionPU])

  const smsTotalPrice = useMemo(() => {
    if (smsType !== 'sms' || smsVolumeNumber <= 0 || smsUnitPrice <= 0) return 0
    const setupFee = 190 // frais fixes de setup, comptés une seule fois
    const variablePerCampaign = smsUnitPrice * smsVolumeNumber
    if (!smsOptions.duplicateCampaign || campaignMonthsNumber <= 1) {
      return setupFee + variablePerCampaign
    }
    // En cas de duplication, on multiplie uniquement la partie variable
    return setupFee + variablePerCampaign * campaignMonthsNumber
  }, [smsType, smsVolumeNumber, smsBasePU, smsUnitPrice, smsOptions.duplicateCampaign, campaignMonthsNumber])

  // --- Logique de calcul RCS (indépendante du SMS) ---

  const rcsBasePU = useMemo(() => {
    const n = smsVolumeNumber
    if (n <= 0) return 0
    if (n < 10_000) return -1 // Interdit (on retourne -1 pour gérer l'affichage)
    if (n <= 50_000) return 0.19
    return 0.15 // 50_001+
  }, [smsVolumeNumber])

  const creaByLinkCountNumber = useMemo(() => {
    const parsed = parseInt(creaByLinkCount, 10)
    return isNaN(parsed) || parsed < 1 ? 1 : parsed
  }, [creaByLinkCount])

  /** PU RCS : Base clients = tarif forfaitaire 0,08 € (hors barème volume) ; sinon barème + ciblage éventuel. */
  const rcsUnitPrice = useMemo(() => {
    const n = smsVolumeNumber
    if (smsType !== 'rcs' || n <= 0) return 0
    if (n < 10_000) return -1
    if (smsOptions.baseClients) return BASE_CLIENTS_UNIT_PRICE
    if (rcsBasePU < 0) return -1
    return rcsBasePU + (smsOptions.ciblage ? CIBLAGE_UNIT_PRICE : 0)
  }, [smsType, smsVolumeNumber, smsOptions.baseClients, smsOptions.ciblage, rcsBasePU])

  const rcsOptionFee = useMemo(() => {
    if (smsType !== 'rcs') return 0
    let fee = 0
    if (smsOptions.agent) fee += 550 // Création d'agent (si nécessaire)
    if (smsOptions.creaByLink) fee += 100 * creaByLinkCountNumber // CREA BY LINK
    return fee
  }, [smsType, smsOptions.agent, smsOptions.creaByLink, creaByLinkCountNumber])

  const rcsTotalPrice = useMemo(() => {
    if (smsType !== 'rcs' || smsVolumeNumber <= 0 || rcsUnitPrice < 0) return 0
    const setupFee = 250 // frais fixes obligatoires comptés une seule fois
    const variablePerCampaign = rcsUnitPrice * smsVolumeNumber + rcsOptionFee
    if (!smsOptions.duplicateCampaign || campaignMonthsNumber <= 1) {
      return setupFee + variablePerCampaign
    }
    return setupFee + variablePerCampaign * campaignMonthsNumber
  }, [smsType, smsVolumeNumber, rcsUnitPrice, rcsOptionFee, smsOptions.duplicateCampaign, campaignMonthsNumber])

  const smsCampaignCount =
    smsOptions.duplicateCampaign && campaignMonthsNumber > 1 ? campaignMonthsNumber : 1

  const smsRcsPdfSendWaves = useMemo(
    () => normalizeSmsRcsSendWavesForPdf(smsRcsSendWaves),
    [smsRcsSendWaves],
  )

  const smsRcsSendWavesVolumeSum = useMemo(
    () => smsRcsPdfSendWaves.reduce((sum, wave) => sum + (wave.volume ?? 0), 0),
    [smsRcsPdfSendWaves],
  )

  const smsRcsSendWavesVolumeMismatch =
    smsRcsPdfSendWaves.some((wave) => wave.volume != null) &&
    smsVolumeNumber > 0 &&
    smsRcsSendWavesVolumeSum > 0 &&
    smsRcsSendWavesVolumeSum !== smsVolumeNumber

  const smsMiniDevis = useMemo(() => {
    if (smsType !== 'sms' || smsVolumeNumber <= 0) {
      return { lines: [] as SmsRcsMiniDevisLine[], totalHt: null as number | null }
    }
    const lines: SmsRcsMiniDevisLine[] = [
      {
        label: smsCampaignCount > 1 ? 'Volume par campagne' : 'Volume',
        value: `${formatNumber(smsVolumeNumber, 0)} SMS`,
      },
    ]
    if (smsCampaignCount > 1) {
      lines.push({ label: 'Nombre de campagnes', value: String(smsCampaignCount), muted: true })
      lines.push({
        label: 'Volume total',
        value: `${formatNumber(totalUnitsNumber, 0)} SMS`,
        muted: true,
      })
    }
    appendSmsRcsSendWaveDevisLines(lines, smsRcsPdfSendWaves, 'SMS')
    if (smsUnitPrice <= 0) return { lines, totalHt: null }
    return {
      lines,
      totalHt: smsTotalPrice > 0 ? smsTotalPrice : null,
    }
  }, [
    smsType,
    smsVolumeNumber,
    smsUnitPrice,
    smsTotalPrice,
    smsCampaignCount,
    totalUnitsNumber,
    smsRcsPdfSendWaves,
  ])

  const rcsMiniDevis = useMemo(() => {
    if (smsType !== 'rcs' || smsVolumeNumber <= 0) {
      return { lines: [] as SmsRcsMiniDevisLine[], totalHt: null as number | null, forbidden: false }
    }
    if (smsVolumeNumber < 10_000) {
      return {
        lines: [] as SmsRcsMiniDevisLine[],
        totalHt: null as number | null,
        forbidden: true,
      }
    }
    const lines: SmsRcsMiniDevisLine[] = [
      {
        label: smsCampaignCount > 1 ? 'Volume par campagne' : 'Volume',
        value: `${formatNumber(smsVolumeNumber, 0)} RCS`,
      },
    ]
    if (smsCampaignCount > 1) {
      lines.push({ label: 'Nombre de campagnes', value: String(smsCampaignCount), muted: true })
      lines.push({
        label: 'Volume total',
        value: `${formatNumber(totalUnitsNumber, 0)} RCS`,
        muted: true,
      })
    }
    appendSmsRcsSendWaveDevisLines(lines, smsRcsPdfSendWaves, 'RCS')
    if (rcsUnitPrice <= 0) return { lines, totalHt: null, forbidden: false }
    return {
      lines,
      totalHt: rcsTotalPrice > 0 ? rcsTotalPrice : null,
      forbidden: false,
    }
  }, [
    smsType,
    smsVolumeNumber,
    rcsUnitPrice,
    rcsTotalPrice,
    smsCampaignCount,
    totalUnitsNumber,
    smsRcsPdfSendWaves,
  ])

  /**
   * Mêmes critères que les boutons « Télécharger le devis SMS / RCS en PDF »
   * (handleOpenSMSPDFDialog / handleOpenRCSPDFDialog).
   */
  const smsDevisPdfEligible =
    smsVolumeNumber > 0 && smsUnitPrice > 0 && smsTotalPrice > 0
  const rcsDevisPdfEligible =
    smsVolumeNumber >= 10_000 && rcsUnitPrice > 0 && rcsTotalPrice > 0
  const smsDevisSaveEligible =
    smsType === 'sms' ? smsDevisPdfEligible : rcsDevisPdfEligible

  const applySmsDevisContent = useCallback((content: SmsDevisContent) => {
    setSmsType(content.smsType)
    setSmsVolume(content.smsVolume)
    setSmsOptions({ ...content.smsOptions })
    setCampaignMonths(content.campaignMonths)
    setCreaByLinkCount(content.creaByLinkCount)
    setSmsPdfComment(content.smsPdfComment)
    setSmsRcsSendWaves(
      content.smsRcsSendWaves.length > 0
        ? content.smsRcsSendWaves.map((w) => ({ ...w }))
        : defaultSmsDevisSendWaves(),
    )
    setSmsPdfImage(content.smsPdfImage)
  }, [])

  useEffect(() => {
    if (view !== 'sms' || !devisIdFromUrl) return
    let cancelled = false
    setLoadingDevis(true)
    void getSmsDevisById(devisIdFromUrl)
      .then((record) => {
        if (cancelled) return
        if (!record) {
          alert('Devis introuvable ou accès non autorisé.')
          return
        }
        applySmsDevisContent(record.content)
        setSavedDevisId(record.id)
        setSavedDevisName(record.name)
      })
      .catch((e) => {
        if (!cancelled) {
          alert(e instanceof Error ? e.message : 'Impossible de charger le devis.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingDevis(false)
      })
    return () => {
      cancelled = true
    }
  }, [view, devisIdFromUrl, applySmsDevisContent])

  const applySocialStrategyContent = useCallback((content: Vente2StrategyContent) => {
    setCalculationMode(content.calculationMode)
    setMainValue(content.mainValue)
    setAePercentage(content.aePercentage)
    setDiffusionDays(content.diffusionDays)
    setTarifsDirection(content.tarifsDirection)
    setSelectedPlatforms([...content.selectedPlatforms])
    setSearchClicsStudyValue(content.searchClicsStudyValue)
    setCustomRows({ ...content.customRows })
    setStrategies(content.strategies as unknown as StrategyBlock[])
    setActiveStrategyId(content.activeStrategyId)
    setExpandedStrategies({ ...content.expandedStrategies })
    setRetroSocialByStrategy(
      content.retroSocialByStrategy as Record<string, RetroSocialState>,
    )
    setDefineDatesPerStrategy(
      Object.fromEntries(
        Object.entries(content.defineDatesPerStrategy).map(([k, v]) => [k, { ...v }]),
      ),
    )
  }, [])

  useEffect(() => {
    if (view !== 'social' || !strategyIdFromUrl) return
    let cancelled = false
    setLoadingStrategy(true)
    void getVente2StrategyById(strategyIdFromUrl)
      .then((record) => {
        if (cancelled) return
        if (!record) {
          alert('Stratégie introuvable ou accès non autorisé.')
          return
        }
        applySocialStrategyContent(record.content)
        setSavedStrategyId(record.id)
        setSavedStrategyName(record.name)
      })
      .catch((e) => {
        if (!cancelled) {
          alert(e instanceof Error ? e.message : 'Impossible de charger la stratégie.')
        }
      })
      .finally(() => {
        if (!cancelled) setLoadingStrategy(false)
      })
    return () => {
      cancelled = true
    }
  }, [view, strategyIdFromUrl, applySocialStrategyContent])

  // Récupérer le nom de l'utilisateur connecté
  useEffect(() => {
    const getUserName = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Essayer de récupérer depuis le profil
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name, role')
            .eq('id', session.user.id)
            .maybeSingle()
          
          const role = (profile as { role?: string } | null)?.role ?? null
          setUserRole(role)
          const profileName = profile?.full_name as string | undefined
          const metaName = (session.user.user_metadata as any)?.full_name as string | undefined
          const name = (profileName || metaName || '').trim()
          
          if (name) {
            setUserName(name)
            setUserPseudo(name)
          } else if (session.user.email) {
            // Utiliser l'email si pas de nom
            const fallback = session.user.email.split('@')[0]
            setUserName(fallback)
            setUserPseudo(fallback)
          }
        }
      } catch (error) {
        console.error('Erreur lors de la récupération du nom utilisateur:', error)
      }
    }
    getUserName()
  }, [])

  // Générer toutes les combinaisons plateforme/objectif
  const generateTableData = (): TableRowData[] => {
    const rows: TableRowData[] = []
    const mainValueNum = parseFloat(mainValue) || 0
    const aeNum = parseFloat(aePercentage) || 40
    const daysNum = parseFloat(diffusionDays) || 14

    if (!mainValueNum || !daysNum) return rows

    PLATFORMS_ORDER.forEach((platform) => {
      const platformData = UNIT_COSTS[platform]
      if (!platformData) return

      Object.keys(platformData).forEach((objective) => {
        if (calculationMode === 'kpis-to-budget' && isMaxObjective(objective)) return
        try {
          let budget = 0
          let estimatedKPIs = 0

              if (calculationMode === 'budget-to-kpis') {
                // Budget global → répartition par plateforme/objectif (tarifs classiques ou tarifs direction)
                budget = mainValueNum // Budget total à répartir
                const result = tarifsDirection
                  ? calculateKPIsForBudgetDirection(platform, objective, aeNum, budget)
                  : calculateKPIsForBudget(platform, objective, aeNum, budget)
                estimatedKPIs = Math.ceil(result.calculatedKpis || 0)
              } else {
                // KPIs → Budget nécessaire (tarifs classiques ou tarifs direction)
                estimatedKPIs = mainValueNum
                const result = tarifsDirection
                  ? calculatePriceForKPIsDirection(platform, objective, aeNum, mainValueNum)
                  : calculatePriceForKPIs(platform, objective, aeNum, mainValueNum)
                budget = Math.round(result.price || 0)
              }

              // Calcul de l'AE à partir du budget total
              let aeCheckValue = 0
              if (budget > 0) {
                const aeFactor = aeNum / 100
                // Pour Spotify : seuils sur AE total (budget AE)
                if (platform === 'Spotify') {
                  aeCheckValue = budget * aeFactor
                } else {
                  // Pour les autres plateformes : AE par jour (même base que la colonne "Budget quotidien (€)")
                  aeCheckValue = (budget * aeFactor) / daysNum
                }
              }

              // Budget quotidien AE : (Budget total × %AE) / nombre de jours
              const dailyBudget =
                budget > 0
                  ? (budget * (aeNum / 100)) / daysNum
                  : 0

              rows.push({
                platform,
                objective,
                budget,
                estimatedKPIs,
                dailyBudget,
                aeCheckValue,
                isAvailable: true
              })
        } catch (error) {
          rows.push({
            platform,
            objective,
            budget: 0,
            estimatedKPIs: 0,
              dailyBudget: 0,
              aeCheckValue: 0,
            isAvailable: false
          })
        }
      })
    })

    return rows
  }

  const tableData = generateTableData()

  // Grouper les données par plateforme
  const groupedByPlatform = useMemo(() => {
    return tableData.reduce((acc, row) => {
      if (!acc[row.platform]) {
        acc[row.platform] = []
      }
      acc[row.platform].push(row)
      return acc
    }, {} as Record<string, TableRowData[]>)
  }, [tableData])

  // Fonction pour ajouter à la stratégie active
  const canAddToActiveStrategy = useCallback((): boolean => {
    const aeNum = parseFloat(aePercentage) || 0
    const targetId = activeStrategyId || strategies[0]?.id
    const targetStrategy = strategies.find((s) => s.id === targetId)
    if (targetStrategy && targetStrategy.items.length > 0) {
      const existingAe = targetStrategy.items[0].aePercentage
      if (existingAe !== aeNum) {
        alert(
          `Le % AE de cette stratégie est ${existingAe} %. Pour ajouter une ligne, utilisez le même % AE ou créez une nouvelle stratégie.`,
        )
        return false
      }
    }
    return true
  }, [activeStrategyId, strategies, aePercentage])

  const addToStrategy = (
    row: TableRowData & { customKpiLabel?: string },
    options?: { includeMakeLeadsAddon?: boolean },
  ): boolean => {
    const daysNum = parseFloat(diffusionDays) || 0
    const aeNum = parseFloat(aePercentage) || 0

    if (!canAddToActiveStrategy()) {
      return false
    }

    const targetId = activeStrategyId || strategies[0]?.id

    const newItem: StrategyItem = {
      ...row,
      id: `${row.platform}-${row.objective}-${Date.now()}`,
      days: daysNum,
      aePercentage: aeNum,
    }

    const makeLeadsAddon: StrategyItem[] =
      options?.includeMakeLeadsAddon && isMakeLeadsTrigger(row.platform, row.objective)
        ? [
            {
              id: `make-leads-${row.platform}-${Date.now()}`,
              platform: row.platform,
              objective: MAKE_LEADS_OPTION_LABEL,
              budget: MAKE_LEADS_OPTION_BUDGET,
              estimatedKPIs: 0,
              dailyBudget: 0,
              aeCheckValue: 0,
              isAvailable: true,
              days: daysNum,
              aePercentage: aeNum,
              isMakeLeadsAddon: true,
              customKpiLabel: MAKE_LEADS_OPTION_LABEL,
            },
          ]
        : []

    setStrategies((prev) => {
      return prev.map((s) =>
        s.id === targetId
          ? {
              ...s,
              items: [
                ...s.items,
                { ...newItem, tarifsDirection },
                ...makeLeadsAddon,
              ],
            }
          : s,
      )
    })
    return true
  }

  const requestAddToStrategy = (row: TableRowData & { customKpiLabel?: string }) => {
    if (!canAddToActiveStrategy()) return

    if (isMakeLeadsTrigger(row.platform, row.objective)) {
      pendingLeadsRowRef.current = row
      setPendingLeadsRow(row)
      setMakeLeadsModalOpen(true)
      return
    }
    addToStrategy(row)
  }

  const handleMakeLeadsChoice = (acceptMakeOption: boolean) => {
    const row = pendingLeadsRowRef.current ?? pendingLeadsRow
    if (!row) return

    const added = addToStrategy(
      row,
      acceptMakeOption ? { includeMakeLeadsAddon: true } : undefined,
    )
    if (!added) return

    pendingLeadsRowRef.current = null
    setPendingLeadsRow(null)
    setMakeLeadsModalOpen(false)
  }

  // Fonction pour supprimer de la stratégie (par bloc)
  const removeFromStrategy = (strategyId: string, id: string) => {
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === strategyId ? { ...s, items: s.items.filter((item) => item.id !== id) } : s,
      ),
    )
  }

  const setStrategyAdditionalSaleCount = (
    strategyId: string,
    saleId: AdditionalSaleId,
    count: number,
  ) => {
    setStrategies((prev) =>
      prev.map((s) => {
        if (s.id !== strategyId) return s
        const platform = getMakeLeadsPlatformForSale(saleId)
        const normalized = Math.max(0, Math.floor(count))
        const next = { ...(s.additionalSales ?? {}) }

        if (normalized <= 0) {
          delete next[saleId]
        } else if (platform && hasMakeLeadsAddonForAdditionalSale(s, saleId)) {
          return s
        } else {
          next[saleId] = normalized
        }

        const items =
          platform && normalized <= 0
            ? removeMakeLeadsAddonItems(s.items, platform)
            : s.items

        return { ...s, additionalSales: next, items }
      }),
    )
  }

  const toggleStrategyAdditionalSale = (
    strategyId: string,
    saleId: AdditionalSaleId,
    checked: boolean,
  ) => {
    setStrategyAdditionalSaleCount(strategyId, saleId, checked ? 1 : 0)
  }

  // Stratégie active (pour les interactions / +)
  const activeStrategy = strategies.find((s) => s.id === activeStrategyId) ?? strategies[0]
  const activeRetroSocial = retroSocialByStrategy[activeStrategyId] ?? defaultRetroSocialState()
  const strategy = activeStrategy?.items ?? []

  // Calculer le total de la stratégie active (mise à jour automatique)
  const strategyTotal = useMemo(() => {
    if (!activeStrategy) return 0
    return getStrategyBlockBudgetTotal(activeStrategy)
  }, [activeStrategy])

  // Calculer le total des KPIs dans la stratégie active
  const strategyKPIsTotal = useMemo(() => {
    return strategy.filter(isMediaStrategyItem).reduce((total, item) => total + item.estimatedKPIs, 0)
  }, [strategy])

  // Préparer les données pour le graphique (par plateforme) pour la stratégie active
  const chartData = useMemo(() => {
    const platformTotals: Record<string, number> = {}

    strategy.filter(isMediaStrategyItem).forEach((item) => {
      if (!platformTotals[item.platform]) {
        platformTotals[item.platform] = 0
      }
      platformTotals[item.platform] += item.budget
    })

    return Object.entries(platformTotals).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
  }, [strategy])

  // Préparer les données pour le graphique (par objectif) pour la stratégie active
  const chartDataByObjective = useMemo(() => {
    const objectiveTotals: Record<string, number> = {}

    strategy.filter(isMediaStrategyItem).forEach((item) => {
      if (!objectiveTotals[item.objective]) {
        objectiveTotals[item.objective] = 0
      }
      objectiveTotals[item.objective] += item.budget
    })

    return Object.entries(objectiveTotals).map(([name, value]) => ({
      name,
      value: Math.round(value),
    }))
  }, [strategy])

  // Couleurs pour le graphique
  const COLORS = ['#E94C16', '#FF6B35', '#FF8C42', '#FFA07A', '#FFB347', '#FFD700', '#FFA500', '#FF8C00']

  // Règle durée de campagne : par défaut < 5 jours → rouge, 5 à 10 jours → orange (prioritaire sur l'AE)
  const getDaysOverrideClass = (days: number): string | null => {
    if (days < 5) return 'bg-red-50 text-red-700'
    if (days < 10) return 'bg-orange-50 text-orange-700'
    return null
  }

  // Couleur ligne : d'abord la règle durée, sinon couleur selon AE
  const getRowColorClass = (platform: string, aeCheckValue: number, days: number): string => {
    // Cas spécifique Search : durée minimale recommandée 3 mois (90 jours)
    // - < 40 jours  → rouge
    // - 40 à 89 jours → orange
    // - ≥ 90 jours :
    //     - budget (AE/jour) < 8 € → orange
    //     - budget (AE/jour) ≥ 8 € → vert
    if (platform === 'Search') {
      if (days > 0 && days < 40) return 'bg-red-50 text-red-700'
      if (days >= 40 && days < 90) return 'bg-orange-50 text-orange-700'
      if (days >= 90) {
        // Pour Search, aeCheckValue correspond à l'AE par jour (même base que le budget quotidien)
        if (aeCheckValue >= 8) return 'bg-green-50 text-green-700'
        return 'bg-orange-50 text-orange-700'
      }
      return getAeColorClass(platform, aeCheckValue)
    }
    if (platform === 'Perf max') {
      return 'bg-orange-50 text-orange-700'
    }
    const daysClass = getDaysOverrideClass(days)
    if (daysClass) return daysClass
    return getAeColorClass(platform, aeCheckValue)
  }

  useEffect(() => {
    if (!calendarDialogOpen) {
      strategyCalendarModalInitRef.current = false
      return
    }
    if (!calendarStrategyId || strategyCalendarModalInitRef.current) return
    const block = strategies.find((s) => s.id === calendarStrategyId)
    if (!block?.items.length) {
      strategyCalendarModalInitRef.current = true
      return
    }
    strategyCalendarModalInitRef.current = true
    const datesMap = defineDatesPerStrategy[calendarStrategyId] ?? {}
    const savedCal =
      block.calendar && isStrategyCalendarData(block.calendar) && block.calendar.items.length > 0
        ? block.calendar
        : null
    const starts = block.items.map((it) => {
      const key = `${it.platform}::${it.objective}`
      return datesMap[key] ?? new Date().toISOString().slice(0, 10)
    })
    const globalStart = starts.reduce((min, d) => (d < min ? d : min), starts[0]!)
    const rawStart = savedCal?.startDate ?? globalStart
    const safeStart = rawStart > globalStart ? globalStart : rawStart
    const { contentSpan } = computeVenteStrategyCalendarItems(
      block,
      datesMap,
      diffusionDays,
      safeStart,
    )
    const diffusionDuration = Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))
    const initialDur = Math.max(savedCal?.duration ?? 0, contentSpan, diffusionDuration)
    setCalendarDisplayStart(safeStart)
    setCalendarDisplayDuration(initialDur)
  }, [calendarDialogOpen, calendarStrategyId, strategies, defineDatesPerStrategy, diffusionDays])

  // Messages d'avertissement pour le calendrier (règles durée / budget quotidien)
  const getCalendarWarningsForBlock = (b: StrategyBlock): string[] => {
    const warnings: string[] = []
    b.items.forEach((item) => {
      const days = item.days || 0
      if (item.platform === 'Search' && days > 0 && days < 90) {
        warnings.push(`Search : durée ${days} jour(s) (minimum 3 mois / 90 jours requis).`)
      }
      if (days > 0 && days < 5) {
        warnings.push(`${item.platform} : durée ${days} jour(s) (minimum 5 jours recommandé).`)
      }
      if (days >= 5 && days < 10) {
        warnings.push(`${item.platform} : durée ${days} jours (à valider par le TM).`)
      }
      const aeVal = item.aeCheckValue ?? 0
      if (aeVal <= 0) return
      if (item.platform === 'Perf max') {
        warnings.push(`${item.platform} : à valider par le TM.`)
        return
      }
      if (item.platform === 'Spotify') {
        if (aeVal < 250) warnings.push(`${item.platform} : budget AE total ${Math.round(aeVal)} € (sous le minimum 250 €).`)
        else if (aeVal <= 350) warnings.push(`${item.platform} : budget AE total ${Math.round(aeVal)} € (à valider, objectif 350 €+).`)
      } else {
        const dailyBudget = item.dailyBudget ?? 0
        const isMetaLike = ['META', 'Facebook only', 'Insta only', 'Display', 'Youtube'].includes(item.platform)
        const isLinkedInTiktok = ['LinkedIn', 'Tiktok'].includes(item.platform)
        const isSnapEtc = ['Snapchat', 'Demand Gen', 'Search'].includes(item.platform)
        if (isMetaLike && dailyBudget < 5) {
          warnings.push(`${item.platform} : budget quotidien ${dailyBudget.toFixed(1)} €/j (minimum 5 €/j).`)
        } else if (isMetaLike && dailyBudget <= 10) {
          warnings.push(`${item.platform} : budget quotidien ${dailyBudget.toFixed(1)} €/j (à valider, objectif 10 €/j+).`)
        } else if (isLinkedInTiktok && dailyBudget < 10) {
          warnings.push(`${item.platform} : budget quotidien ${dailyBudget.toFixed(1)} €/j (minimum 10 €/j).`)
        } else if (isLinkedInTiktok && dailyBudget <= 20) {
          warnings.push(`${item.platform} : budget quotidien ${dailyBudget.toFixed(1)} €/j (à valider, objectif 20 €/j+).`)
        } else if (isSnapEtc && dailyBudget < 10) {
          warnings.push(`${item.platform} : budget quotidien ${dailyBudget.toFixed(1)} €/j (minimum 10 €/j).`)
        } else if (isSnapEtc && dailyBudget <= 15) {
          warnings.push(`${item.platform} : budget quotidien ${dailyBudget.toFixed(1)} €/j (à valider, objectif 15 €/j+).`)
        }
      }
    })
    return warnings
  }

  // Fonction pour déterminer la couleur selon le niveau d'AE (par jour ou total Spotify)
  const getAeColorClass = (platform: string, aeCheckValue: number): string => {
    if (platform === 'Perf max') {
      return aeCheckValue === 0 ? 'bg-gray-100 text-gray-400' : 'bg-orange-50 text-orange-700'
    }
    if (aeCheckValue === 0) return 'bg-gray-100 text-gray-400'

    const isMetaLike =
      platform === 'META' ||
      platform === 'Facebook only' ||
      platform === 'Insta only' ||
      platform === 'Display' ||
      platform === 'Youtube'

    if (platform === 'Spotify') {
      // Spotify : seuils sur AE total
      if (aeCheckValue < 250) return 'bg-red-50 text-red-700'
      if (aeCheckValue <= 350) return 'bg-orange-50 text-orange-700'
      return 'bg-green-50 text-green-700'
    }

    if (isMetaLike) {
      // META / Insta only / Display / Youtube : AE / jours
      if (aeCheckValue < 5) return 'bg-red-50 text-red-700'
      if (aeCheckValue <= 10) return 'bg-orange-50 text-orange-700'
      return 'bg-green-50 text-green-700'
    }

    if (platform === 'LinkedIn' || platform === 'Tiktok') {
      // LinkedIn / Tiktok : AE / jours
      if (aeCheckValue < 10) return 'bg-red-50 text-red-700'
      if (aeCheckValue <= 20) return 'bg-orange-50 text-orange-700'
      return 'bg-green-50 text-green-700'
    }

    if (platform === 'Snapchat' || platform === 'Demand Gen' || platform === 'Search') {
      // Snapchat, Demand Gen, Search : AE / jours (seuils spécifiques 10 / 15)
      if (aeCheckValue < 10) return 'bg-red-50 text-red-700'
      if (aeCheckValue <= 15) return 'bg-orange-50 text-orange-700'
      return 'bg-green-50 text-green-700'
    }

    // Par défaut, neutre
    return 'bg-gray-50 text-gray-700'
  }

  const handleCustomRowChange = (
    platform: string,
    field: keyof CustomRowState,
    value: string,
  ) => {
    setCustomRows((prev) => ({
      ...prev,
      [platform]: {
        ...(prev[platform] ?? { objective: '', budget: '' }),
        [field]: value,
      },
    }))
  }

  // Fonction pour exporter en Excel (stratégie active uniquement)
  const exportToExcel = () => {
    const worksheetData = [
      ['Stratégie', 'Plateforme', 'Objectif', 'Budget (€)', 'KPIs estimés', 'Budget quotidien (€)'],
      ...(activeStrategy?.items ?? []).map(item => [
        activeStrategy?.name ?? '',
        item.platform,
        item.objective,
        item.budget,
        item.estimatedKPIs,
        item.dailyBudget
      ]),
      ['', '', 'TOTAL', '', '', strategyTotal]
    ]

    const ws = XLSX.utils.aoa_to_sheet(worksheetData)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Stratégies PDV')
    XLSX.writeFile(wb, `strategie-pdv-${new Date().toISOString().split('T')[0]}.xlsx`)
  }

  // Fonction pour générer et télécharger le PDF (toutes les stratégies)
  const handleExportPDF = async () => {
    if (!clientName.trim()) return

    const logoDataUrl = await fetchVenteSocialPdfLogoDataUrl()

    const doc = (
      <PDFDocument
        strategies={strategies}
        clientName={clientName}
        userName={userName}
        aePercentage={parseFloat(aePercentage) || 0}
        comment={undefined}
        logoDataUrl={logoDataUrl}
        includeAeInPdf={pdfIncludeAe}
      />
    )
    const blob = await pdf(doc).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `strategie-pdv-${clientName}-${new Date().toISOString().split('T')[0]}.pdf`
    link.click()
    URL.revokeObjectURL(url)
    setPdfDialogOpen(false)
    setClientName('')
  }

  // Fonction pour envoyer le PDF sur Slack (Validation TM)
  const handleValidationTM = async () => {
    if (!validationMessage.trim()) return
    
    setSendingToSlack(true)
    try {
      // 1) Même PDF Social que « Télécharger le PDF » (logo + commentaire optionnel)
      const logoDataUrl = await fetchVenteSocialPdfLogoDataUrl()
      const doc = (
        <PDFDocument
          strategies={strategies}
          clientName={clientName || 'Client'}
          userName={userName}
          aePercentage={parseFloat(aePercentage) || 0}
          comment={undefined}
          logoDataUrl={logoDataUrl}
          includeAeInPdf={pdfIncludeAe}
        />
      )
      const blob = await pdf(doc).toBlob()

      // 2) Convertir le blob en base64
      const arrayBuffer = await blob.arrayBuffer()
      let base64: string
      if (typeof window !== 'undefined') {
        const bytes = new Uint8Array(arrayBuffer)
        let binary = ''
        for (let i = 0; i < bytes.byteLength; i++) {
          binary += String.fromCharCode(bytes[i])
        }
        base64 = window.btoa(binary)
      } else {
        // Sécurité côté serveur si jamais appelé là (normalement non)
        base64 = Buffer.from(arrayBuffer).toString('base64')
      }

      const fileName = `strategie-pdv-${clientName || 'client'}-${new Date().toISOString().split('T')[0]}.pdf`

      // 3) Récupérer l'utilisateur
      const { data: { session } = {} } = await supabase.auth.getSession()
      const userId = session?.user?.id || null

      // 4) Appeler l'API pour stocker dans Supabase (Storage + table)
      // Ajouter un timeout de 30 secondes pour éviter de rester bloqué indéfiniment
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 30000) // 30 secondes

      try {
        const response = await fetch('/api/slack', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            pdfBase64: base64,
            fileName,
            firstName: userPseudo || userName,
            message: validationMessage.trim(),
            clientName: clientName || 'Client',
            userName,
            userId,
          }),
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}))
          throw new Error(errorData.error || 'Erreur lors de la sauvegarde de la validation')
        }
      } catch (fetchError: any) {
        clearTimeout(timeoutId)
        if (fetchError.name === 'AbortError') {
          throw new Error('La requête a expiré après 30 secondes. Veuillez réessayer.')
        }
        throw fetchError
      }

      // Succès
      setValidationTMDialogOpen(false)
      setValidationMessage('')
      alert('Validation TM enregistrée avec succès !')
    } catch (error: any) {
      console.error('Error handling Validation TM:', error)
      alert('Erreur lors de la validation TM: ' + (error.message || 'Erreur inconnue'))
    } finally {
      setSendingToSlack(false)
    }
  }

  // Fonction pour ouvrir la modal SMS
  const handleOpenSMSPDFDialog = () => {
    if (smsVolumeNumber <= 0 || smsUnitPrice <= 0 || smsTotalPrice <= 0) {
      alert('Veuillez configurer une campagne SMS valide avant de télécharger le PDF.')
      return
    }
    setCurrentSmsType('sms')
    setSmsPdfDialogOpen(true)
  }

  // Fonction pour ouvrir la modal RCS
  const handleOpenRCSPDFDialog = () => {
    if (smsVolumeNumber <= 0 || rcsUnitPrice <= 0 || rcsTotalPrice <= 0) {
      alert('Veuillez configurer une campagne RCS valide avant de télécharger le PDF.')
      return
    }

    if (smsVolumeNumber < 10_000) {
      alert('Volume minimum requis : 10 000 RCS')
      return
    }
    setCurrentSmsType('rcs')
    setSmsPdfDialogOpen(true)
  }

  // Fonction pour gérer l'upload d'image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onloadend = () => {
      setSmsPdfImage(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  // Fonction pour générer et télécharger le PDF SMS/RCS
  const handleConfirmSMSRCSPDF = async () => {
    if (!smsPdfFileName.trim()) {
      alert('Veuillez renseigner un nom de fichier.')
      return
    }

    const doc = (
      <SMSRCSPDFDocument
        type={currentSmsType}
        volume={smsVolumeNumber}
        unitPrice={currentSmsType === 'sms' ? smsUnitPrice : rcsUnitPrice}
        totalPrice={currentSmsType === 'sms' ? smsTotalPrice : rcsTotalPrice}
        options={currentSmsType === 'sms' 
          ? {
              ciblage: smsOptions.ciblage,
              baseClients: smsOptions.baseClients,
              richSms: smsOptions.richSms,
              tarifIntermarche: smsOptions.tarifIntermarche,
              duplicateCampaign: smsOptions.duplicateCampaign,
            }
          : {
              ciblage: smsOptions.ciblage,
              baseClients: smsOptions.baseClients,
              agent: smsOptions.agent,
              creaByLink: smsOptions.creaByLink,
              tarifIntermarche: smsOptions.tarifIntermarche,
              duplicateCampaign: smsOptions.duplicateCampaign,
            }
        }
        salesConditions={currentSmsType === 'sms' ? SMS_SALES_CONDITIONS : RCS_SALES_CONDITIONS}
        fileName={smsPdfFileName.trim()}
        tarifIntermarche={smsOptions.tarifIntermarche}
        campaignMonths={smsOptions.duplicateCampaign ? campaignMonthsNumber : undefined}
        creaByLinkCount={currentSmsType === 'rcs' ? creaByLinkCountNumber : undefined}
        comment={smsPdfComment || undefined}
        sendWaves={smsRcsPdfSendWaves.length > 0 ? smsRcsPdfSendWaves : undefined}
        imageBase64={smsPdfImage}
      />
    )
    const blob = await pdf(doc).toBlob()
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `${smsPdfFileName}.pdf`
    link.click()
    URL.revokeObjectURL(url)
    
    // Reset et fermer
    setSmsPdfDialogOpen(false)
    setSmsPdfFileName('')
    setSmsPdfImage(null)
  }

  const buildCurrentSmsDevisPayload = () => {
    const unitPrice = smsType === 'sms' ? smsUnitPrice : rcsUnitPrice
    const totalPrice = smsType === 'sms' ? smsTotalPrice : rcsTotalPrice
    return {
      smsType,
      totalAmount: totalPrice,
      content: buildSmsDevisContent({
        smsType,
        smsVolume,
        smsOptions,
        campaignMonths,
        creaByLinkCount,
        smsPdfComment,
        smsRcsSendWaves,
        smsPdfImage,
        unitPrice,
        totalPrice,
      }),
    }
  }

  const handleOpenSaveDevisDialog = () => {
    if (!smsDevisSaveEligible) {
      alert(
        smsType === 'sms'
          ? 'Veuillez configurer une campagne SMS valide avant d\'enregistrer.'
          : 'Veuillez configurer une campagne RCS valide avant d\'enregistrer.',
      )
      return
    }
    setSaveDevisNameInput(
      savedDevisName || smsPdfFileName || `Devis ${smsType.toUpperCase()}`,
    )
    setSaveDevisDialogOpen(true)
  }

  const handleConfirmSaveDevis = async () => {
    const name = saveDevisNameInput.trim()
    if (!name) {
      alert('Veuillez renseigner un nom pour le devis.')
      return
    }

    const existingId = savedDevisId
    setSavingDevis(true)
    try {
      const payload = buildCurrentSmsDevisPayload()
      const record = existingId
        ? await updateSmsDevis({
            id: existingId,
            name,
            smsType: payload.smsType,
            totalAmount: payload.totalAmount,
            content: payload.content,
          })
        : await createSmsDevis({
            name,
            smsType: payload.smsType,
            totalAmount: payload.totalAmount,
            content: payload.content,
          })
      setSavedDevisId(record.id)
      setSavedDevisName(record.name)
      setSaveDevisDialogOpen(false)
      router.replace(`${VENTE2_SMS_HREF}?devis=${record.id}`)
      alert(
        existingId
          ? 'Devis mis à jour dans votre espace personnel.'
          : 'Devis enregistré dans votre espace personnel.',
      )
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement.')
    } finally {
      setSavingDevis(false)
    }
  }

  const buildCurrentSocialStrategyPayload = () => {
    const content: Vente2StrategyContent = {
      version: 1,
      calculationMode,
      mainValue,
      aePercentage,
      diffusionDays,
      tarifsDirection,
      selectedPlatforms: [...selectedPlatforms],
      searchClicsStudyValue,
      customRows: JSON.parse(JSON.stringify(customRows)) as Vente2StrategyContent['customRows'],
      strategies: strategies.map((block) => ({
        id: block.id,
        name: block.name,
        items: block.items.map((item) => ({ ...item })),
        calendar: block.calendar ?? null,
        comment: block.comment,
        additionalSales: block.additionalSales ? { ...block.additionalSales } : undefined,
      })),
      activeStrategyId,
      expandedStrategies: { ...expandedStrategies },
      retroSocialByStrategy: JSON.parse(
        JSON.stringify(retroSocialByStrategy),
      ) as Vente2StrategyContent['retroSocialByStrategy'],
      defineDatesPerStrategy: JSON.parse(
        JSON.stringify(defineDatesPerStrategy),
      ) as Vente2StrategyContent['defineDatesPerStrategy'],
    }
    const totalAmount = strategies.reduce(
      (sum, block) => sum + getStrategyBlockBudgetTotal(block),
      0,
    )
    return { content, totalAmount }
  }

  const handleOpenSaveStrategyDialog = () => {
    const activeBlock = strategies.find((s) => s.id === activeStrategyId)
    const activeHasSummary =
      !!activeBlock &&
      (activeBlock.items.length > 0 || getAdditionalSalesTotal(activeBlock) > 0)
    if (!activeHasSummary) {
      alert('Ajoutez au moins une ligne ou une vente additionnelle avant d\'enregistrer.')
      return
    }
    setSaveStrategyNameInput(
      savedStrategyName || activeBlock?.name || clientName || 'Stratégie Social media',
    )
    setSaveStrategyDialogOpen(true)
  }

  const handleConfirmSaveStrategy = async () => {
    const name = saveStrategyNameInput.trim()
    if (!name) {
      alert('Veuillez renseigner un nom pour la stratégie.')
      return
    }

    const existingId = savedStrategyId
    setSavingStrategy(true)
    try {
      const payload = buildCurrentSocialStrategyPayload()
      const record = existingId
        ? await updateVente2Strategy({
            id: existingId,
            name,
            totalAmount: payload.totalAmount,
            content: payload.content,
          })
        : await createVente2Strategy({
            name,
            totalAmount: payload.totalAmount,
            content: payload.content,
          })
      setSavedStrategyId(record.id)
      setSavedStrategyName(record.name)
      setSaveStrategyDialogOpen(false)
      router.replace(`${VENTE2_SOCIAL_HREF}?strategy=${record.id}`)
      alert(
        existingId
          ? 'Stratégie mise à jour dans votre espace personnel.'
          : 'Stratégie enregistrée dans votre espace personnel.',
      )
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l\'enregistrement.')
    } finally {
      setSavingStrategy(false)
    }
  }

  const handleConfirmRetroPdf = async () => {
    const raw = retroPdfFileName.trim()
    if (!raw) {
      alert('Veuillez renseigner un nom de fichier.')
      return
    }
    if (!retroPdfClientName.trim()) {
      alert('Veuillez renseigner le nom du client.')
      return
    }
    const filename = raw.toLowerCase().endsWith('.pdf') ? raw : `${raw}.pdf`
    try {
      await retroPdfExportRef.current?.(filename, retroPdfComment, retroPdfClientName.trim(), {
        includeWeekTimeline: retroPdfIncludeWeekView,
        includeMonthGrids: retroPdfIncludeMonthView,
      })
    } finally {
      setRetroPdfDialogOpen(false)
      setRetroPdfFileName('')
      setRetroPdfClientName('')
      setRetroPdfComment('')
      setRetroPdfIncludeWeekView(true)
      setRetroPdfIncludeMonthView(true)
      retroPdfExportRef.current = null
    }
  }

  const handleGlobalPackExport = async () => {
    const clientLabel = globalPackClientName.trim()
    if (!clientLabel) {
      alert('Veuillez renseigner le nom du client.')
      return
    }

    setGlobalPackExporting(true)
    try {
      const zip = new JSZip()
      const readmeLines: string[] = [
        'Pack export — Calculateur Vente 2',
        `Client : ${clientLabel}`,
        `Date : ${new Date().toLocaleString('fr-FR')}`,
        '',
        'Fichiers :',
        '',
      ]

      const logoDataUrl = await fetchVenteSocialPdfLogoDataUrl()
      const socialBlob = await pdf(
        <PDFDocument
          strategies={strategies}
          clientName={clientLabel}
          userName={userName}
          aePercentage={parseFloat(aePercentage) || 0}
          comment={globalPackComment}
          logoDataUrl={logoDataUrl}
          includeAeInPdf={pdfIncludeAe}
        />,
      ).toBlob()
      zip.file('01-strategies-social-media.pdf', socialBlob)
      readmeLines.push('• 01-strategies-social-media.pdf — Stratégies Social media')

      /** Aligné sur handleConfirmSMSRCSPDF (mêmes props que la modale devis). */
      if (smsDevisPdfEligible) {
        const smsBlob = await pdf(
          <SMSRCSPDFDocument
            type="sms"
            volume={smsVolumeNumber}
            unitPrice={smsUnitPrice}
            totalPrice={smsTotalPrice}
            options={{
              ciblage: smsOptions.ciblage,
              baseClients: smsOptions.baseClients,
              richSms: smsOptions.richSms,
              tarifIntermarche: smsOptions.tarifIntermarche,
              duplicateCampaign: smsOptions.duplicateCampaign,
            }}
            salesConditions={SMS_SALES_CONDITIONS}
            fileName="Devis SMS"
            tarifIntermarche={smsOptions.tarifIntermarche}
            campaignMonths={smsOptions.duplicateCampaign ? campaignMonthsNumber : undefined}
            comment={smsPdfComment || undefined}
            sendWaves={smsRcsPdfSendWaves.length > 0 ? smsRcsPdfSendWaves : undefined}
            imageBase64={smsPdfImage}
          />,
        ).toBlob()
        zip.file('02-devis-sms.pdf', smsBlob)
        readmeLines.push('• 02-devis-sms.pdf — Devis SMS')
      } else {
        readmeLines.push(
          '— Devis SMS : non inclus (mêmes prérequis que l’export seul — « Veuillez configurer une campagne SMS valide avant de télécharger le PDF. »).',
        )
      }

      if (rcsDevisPdfEligible) {
        const rcsBlob = await pdf(
          <SMSRCSPDFDocument
            type="rcs"
            volume={smsVolumeNumber}
            unitPrice={rcsUnitPrice}
            totalPrice={rcsTotalPrice}
            options={{
              ciblage: smsOptions.ciblage,
              baseClients: smsOptions.baseClients,
              agent: smsOptions.agent,
              creaByLink: smsOptions.creaByLink,
              tarifIntermarche: smsOptions.tarifIntermarche,
              duplicateCampaign: smsOptions.duplicateCampaign,
            }}
            salesConditions={RCS_SALES_CONDITIONS}
            fileName="Devis RCS"
            tarifIntermarche={smsOptions.tarifIntermarche}
            campaignMonths={smsOptions.duplicateCampaign ? campaignMonthsNumber : undefined}
            creaByLinkCount={creaByLinkCountNumber}
            comment={smsPdfComment || undefined}
            sendWaves={smsRcsPdfSendWaves.length > 0 ? smsRcsPdfSendWaves : undefined}
            imageBase64={smsPdfImage}
          />,
        ).toBlob()
        zip.file('03-devis-rcs.pdf', rcsBlob)
        readmeLines.push('• 03-devis-rcs.pdf — Devis RCS')
      } else {
        readmeLines.push(
          '— Devis RCS : non inclus (mêmes prérequis que l’export seul — campagne RCS valide et volume minimum 10 000).',
        )
      }

      const retroHeaderComment =
        retroPdfComment.trim() || globalPackComment.trim() || undefined
      const retroClientLabel = retroPdfClientName.trim() || clientLabel

      const cal2 = useCalendarStore.getState().getCalendarData()
      const retroViewsOk = retroPdfIncludeWeekView || retroPdfIncludeMonthView
      if (cal2.items.length > 0 && retroViewsOk) {
        const block = strategies.find((s) => s.id === activeStrategyId)
        const retroBlob = await getRetroplanningPdfBlob({
          filename: 'retroplanning.pdf',
          documentComment: retroHeaderComment,
          personName: userName.trim() || userPseudo.trim() || '',
          clientName: retroClientLabel,
          linkSocial: retroLinkSocial,
          linkSms: retroLinkSms,
          smsType,
          includeWeekTimeline: retroPdfIncludeWeekView,
          includeMonthGrids: retroPdfIncludeMonthView,
          strategyLines:
            retroLinkSocial && block?.items?.length
              ? block.items.map((it) => ({
                  platform: it.platform,
                  objective: it.objective,
                  budget: it.budget,
                  estimatedKPIs: it.estimatedKPIs,
                  days: it.days,
                  aePercentage: it.aePercentage,
                  customKpiLabel: it.customKpiLabel,
                  dailyBudget: it.dailyBudget,
                }))
              : undefined,
          smsQuoteDetail: retroLinkSms
            ? {
                volume: smsVolumeNumber,
                unitPrice: smsType === 'sms' ? smsUnitPrice : rcsUnitPrice,
                totalPrice: smsType === 'sms' ? smsTotalPrice : rcsTotalPrice,
                options:
                  smsType === 'sms'
                    ? {
                        ciblage: smsOptions.ciblage,
                        baseClients: smsOptions.baseClients,
                        richSms: smsOptions.richSms,
                        tarifIntermarche: smsOptions.tarifIntermarche,
                        duplicateCampaign: smsOptions.duplicateCampaign,
                      }
                    : {
                        ciblage: smsOptions.ciblage,
                        baseClients: smsOptions.baseClients,
                        agent: smsOptions.agent,
                        creaByLink: smsOptions.creaByLink,
                        tarifIntermarche: smsOptions.tarifIntermarche,
                        duplicateCampaign: smsOptions.duplicateCampaign,
                      },
                campaignMonths: smsOptions.duplicateCampaign ? campaignMonthsNumber : undefined,
                creaByLinkCount: smsType === 'rcs' ? creaByLinkCountNumber : undefined,
                comment: smsPdfComment.trim() || undefined,
                sendWaves: smsRcsPdfSendWaves.length > 0 ? smsRcsPdfSendWaves : undefined,
                imageBase64: smsPdfImage ?? undefined,
              }
            : undefined,
          calendarData: cal2,
        })
        zip.file('04-retroplanning.pdf', retroBlob)
        readmeLines.push('• 04-retroplanning.pdf — Rétroplanning (vues comme dans la modale d’export rétro)')
      } else {
        readmeLines.push(
          cal2.items.length === 0
            ? '— Rétroplanning : non inclus (aucune ligne dans le calendrier — même règle que l’export depuis l’onglet).'
            : '— Rétroplanning : non inclus (aucune vue PDF cochée — cochez au moins frise et/ou mois dans la modale rétro).',
        )
      }

      const kpiBlob = await pdf(
        <KpiMaxPdfDocument
          clientName={clientLabel}
          userName={userPseudo || userName}
          diffusionDaysStr={kpiMaxDiffusionDays}
          platformsEnabled={kpiMaxPlatformsEnabled}
          compteStrings={{
            meta: kpiMaxCompteMeta,
            linkedin: kpiMaxCompteLinkedin,
            snapchat: kpiMaxCompteSnapchat,
            tiktok: kpiMaxCompteTiktok,
          }}
        />,
      ).toBlob()
      zip.file('05-kpis-max.pdf', kpiBlob)
      readmeLines.push('• 05-kpis-max.pdf — KPIs max (plateformes, impressions et clics strat. idéale / max)')

      readmeLines.push(
        '',
        'Les exclusions suivent les mêmes règles que les boutons d’export PDF de chaque onglet (voir les libellés ci-dessus).',
      )
      zip.file('LISEZMOI.txt', readmeLines.join('\n'))

      const safe = clientLabel.replace(/[^\w\-]+/g, '_').replace(/_+/g, '_').slice(0, 80)
      const zipBlob = await zip.generateAsync({ type: 'blob' })
      const url = URL.createObjectURL(zipBlob)
      const link = document.createElement('a')
      link.href = url
      link.download = `pack-vente-${safe}-${new Date().toISOString().split('T')[0]}.zip`
      link.click()
      URL.revokeObjectURL(url)
      setGlobalPackDialogOpen(false)
      setGlobalPackClientName('')
      setGlobalPackComment('')
    } catch (e) {
      console.error(e)
      alert('Erreur lors de la génération du pack. Réessayez ou vérifiez la console.')
    } finally {
      setGlobalPackExporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-[1600px] mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">{pageTitle}</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">{pageDescription}</p>
        </div>
        {/* Pack global (Vente 2) + sous-onglets KPIs (Stratégie Social Media) */}
        <div className="mb-6 space-y-4">
          {(view === 'social' || view === 'sms') && (
            <div className="flex justify-center px-2">
              <Button
                type="button"
                onClick={() => {
                  setGlobalPackClientName(clientName)
                  setGlobalPackDialogOpen(true)
                }}
                disabled={globalPackExporting}
                className="bg-[#E94C16] hover:bg-[#d43f12] text-white shadow-sm"
              >
                {globalPackExporting ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Génération du pack…
                  </>
                ) : (
                  <>
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger le pack complet (ZIP)
                  </>
                )}
              </Button>
            </div>
          )}
          {view === 'kpiMax' && (
            <Tabs
              value={kpiSubSection}
              onValueChange={(value) => setKpiSubSection(value as 'kpiMax' | 'kpiMax2')}
              className="w-full"
            >
              <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 border-2 border-gray-300 gap-1">
                <TabsTrigger
                  value="kpiMax"
                  className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                >
                  KPIs max
                </TabsTrigger>
                <TabsTrigger
                  value="kpiMax2"
                  className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                >
                  KPIs max 2
                </TabsTrigger>
              </TabsList>
            </Tabs>
          )}
        </div>

        {pdvSection === 'social' && (
        <>
        {/* Layout 2 colonnes sur desktop */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_500px] gap-6">
          {/* Colonne gauche - Contenu principal */}
          <div className="space-y-6">
            {/* Formulaire de saisie */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Paramètres de calcul
                </CardTitle>
                <CardDescription>
                  Configurez vos paramètres pour générer le tableau comparatif
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Appliquer les tarifs direction (visible uniquement pour direction / admin) */}
                {(userRole === 'direction' || userRole === 'admin' || userRole === 'super_admin') && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tarifs-direction-vente"
                      checked={tarifsDirection}
                      onCheckedChange={(checked) => setTarifsDirection(checked === true)}
                    />
                    <label
                      htmlFor="tarifs-direction-vente"
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                    >
                      Appliquer les tarifs direction
                    </label>
                  </div>
                )}

                {/* Mode de calcul */}
                <div className="space-y-2">
                  <Label>Mode de calcul</Label>
                  <Tabs
                    value={calculationMode}
                    onValueChange={(value) => {
                      setCalculationMode(value as CalculationMode)
                      setMainValue('')
                    }}
                    className="w-full"
                  >
                    <TabsList className="grid w-full grid-cols-2 border-2 border-gray-300">
                      <TabsTrigger value="budget-to-kpis" className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white">Budget → KPIs</TabsTrigger>
                      <TabsTrigger value="kpis-to-budget" className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white">KPIs → Budget</TabsTrigger>
                    </TabsList>
                  </Tabs>
                </div>

                {/* Valeur principale */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>
                      {calculationMode === 'budget-to-kpis' ? 'Budget (€)' : 'KPIs souhaités'}
                    </Label>
                    <EditableInput
                      type="number"
                      placeholder={calculationMode === 'budget-to-kpis' ? 'Ex: 5000' : 'Ex: 10000'}
                      value={mainValue}
                      onChange={(e) => setMainValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>% AE</Label>
                    <EditableInput
                      type="number"
                      placeholder="Ex: 40 pour 40 %"
                      value={aePercentage}
                      onChange={(e) => setAePercentage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jours de diffusion</Label>
                    <EditableInput
                      type="number"
                      placeholder="Ex: 14"
                      value={diffusionDays}
                      onChange={(e) => setDiffusionDays(e.target.value)}
                    />
                  </div>
                </div>

                {/* Plateformes à afficher */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Label>Plateformes à afficher</Label>
                    <div className="flex items-center gap-2 text-xs">
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedPlatforms([...PLATFORMS_ORDER])}
                      >
                        Tout cocher
                      </Button>
                      <span className="text-muted-foreground">|</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-muted-foreground hover:text-foreground"
                        onClick={() => setSelectedPlatforms([])}
                      >
                        Tout décocher
                      </Button>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-4">
                    {PLATFORMS_ORDER.map((platform) => (
                      <label
                        key={platform}
                        className="flex items-center gap-2 cursor-pointer text-sm"
                      >
                        <Checkbox
                          checked={selectedPlatforms.includes(platform)}
                          onCheckedChange={(checked) => {
                            setSelectedPlatforms((prev) => {
                              const next = checked
                                ? [...prev, platform].sort((a, b) => PLATFORMS_ORDER.indexOf(a as (typeof PLATFORMS_ORDER)[number]) - PLATFORMS_ORDER.indexOf(b as (typeof PLATFORMS_ORDER)[number]))
                                : prev.filter((p) => p !== platform)
                              return next
                            })
                          }}
                        />
                        <span>{platform}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Alerte durée (sous la ligne de paramètres, sans modifier la grille) */}
                {(() => {
                  const daysNum = parseFloat(diffusionDays) || 0
                  if (daysNum >= 10 || daysNum <= 0) return null
                  if (daysNum < 5) {
                    return (
                      <Alert variant="destructive" className="mt-4">
                        <AlertTitle>Durée trop courte</AlertTitle>
                        <AlertDescription>
                          Une durée inférieure à 5 jours de campagne n&apos;est pas possible. Toutes les lignes passent en rouge. Veuillez choisir au moins 5 jours.
                        </AlertDescription>
                      </Alert>
                    )
                  }
                  return (
                    <Alert className="mt-4 border-orange-500 bg-orange-50 text-orange-800 [&>svg]:text-orange-600">
                      <AlertTitle>Durée à valider</AlertTitle>
                      <AlertDescription>
                        Une durée entre 5 et 10 jours doit être validée par le TM. Les lignes sont en orange.
                      </AlertDescription>
                    </Alert>
                  )
                })()}
              </CardContent>
            </Card>

            {/* Légende des couleurs */}
            <div className="mt-3 rounded-lg border bg-white p-3 text-xs text-muted-foreground">
              <div className="font-medium text-foreground mb-2">Légende</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-red-500" />
                  <span>Rouge : Pas possible</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                  <span>Orange : À valider par TM</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-green-600" />
                  <span>Vert : OK</span>
                </div>
              </div>
            </div>

            {/* Plateformes segmentées */}
            {tableData.length > 0 && (
              <div className="space-y-4">
                {selectedPlatforms.map((platform) => {
                  const platformRows = groupedByPlatform[platform] || []
                  const onlyCustomRow = platform === 'Perf max' || platform === 'Demand Gen' || platform === 'Search'
                  if (!onlyCustomRow && platformRows.length === 0) return null

                  const customRaw = customRows[platform] ?? { objective: '', budget: '' }
                  const custom =
                    platform === 'Perf max'
                      ? { ...customRaw, objective: 'Conversion' }
                      : customRaw
                  const daysNum = parseFloat(diffusionDays) || 14
                  const mainValueNum = parseFloat(mainValue) || 0
                  const aeNum = parseFloat(aePercentage) || 40

                  const referenceRowForObjective = platformRows.find(
                    (r) => r.objective === custom.objective,
                  )
                  const referenceRow = referenceRowForObjective ?? platformRows[0]
                  const customBudgetNum = onlyCustomRow
                    ? mainValueNum
                    : (referenceRow?.budget ?? 0)
                  const customDailyBudget = onlyCustomRow
                    ? (mainValueNum * (aeNum / 100)) / daysNum
                    : (referenceRow?.dailyBudget ?? 0)
                  const customAeCheckValue = onlyCustomRow
                    ? customDailyBudget
                    : (referenceRow?.aeCheckValue ?? 0)
                  const customRowColor = getRowColorClass(platform, customAeCheckValue, daysNum)
                  const objectivesForPlatform = usesMetaObjectives(platform)
                      ? [...META_CUSTOM_OBJECTIVES, 'conversion']
                      : CUSTOM_OBJECTIVES[platform as (typeof PLATFORMS_ORDER)[number]] ?? DEFAULT_CUSTOM_OBJECTIVES
                  const isCustomInStrategy = strategy.some(
                    (item) => item.platform === platform && item.objective === custom.objective,
                  )

                  return (
                    <Card key={platform}>
                      <CardHeader>
                        <CardTitle className="text-lg">
                          <PlatformBadge platform={platform} withDownload />
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="overflow-x-auto">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Objectif</TableHead>
                                <TableHead className="text-right">Budget (€)</TableHead>
                                <TableHead className="text-right">KPIs estimés</TableHead>
                                <TableHead className="text-right">Budget quotidien (€)</TableHead>
                                <TableHead className="w-12"></TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {!onlyCustomRow && platformRows.map((row, index) => {
                                if (usesMetaObjectives(platform) && row.objective === 'conversion') {
                                  return null
                                }
                                const colorClass = getRowColorClass(row.platform, row.aeCheckValue, daysNum)
                                const isInStrategy = strategy.some(
                                  item => item.platform === row.platform && item.objective === row.objective
                                )
                                return (
                                  <TableRow
                                    key={`${row.platform}-${row.objective}-${index}`}
                                    className={colorClass}
                                  >
                                    <TableCell>{row.objective}</TableCell>
                                    <TableCell className="text-right font-semibold">
                                      {row.budget > 0 ? `${row.budget.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €` : '-'}
                                    </TableCell>
                                    <TableCell className="text-right">
                                      {row.estimatedKPIs > 0
                                        ? `${row.estimatedKPIs.toLocaleString('fr-FR')}${
                                            row.objective === 'Leads' ? ' (estimation)' : ''
                                          }`
                                        : '-'}
                                    </TableCell>
                                    <TableCell className="text-right font-bold">
                                      {row.dailyBudget > 0
                                        ? `${row.dailyBudget.toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} €`
                                        : '-'}
                                    </TableCell>
                                    <TableCell>
                                      {!isInStrategy && (
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          onClick={() => requestAddToStrategy(row)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}

                              {/* Search : 2 lignes distinctes (Clics, Conversion) */}
                              {platform === 'Search' && (() => {
                                const searchObjectives = ['Clics', 'Conversion'] as const
                                return searchObjectives.map((obj) => {
                                  const isInStrategy = strategy.some(
                                    (item) => item.platform === platform && item.objective === obj,
                                  )
                                  return (
                                    <TableRow key={`search-${obj}`} className={customRowColor}>
                                      <TableCell>{obj}</TableCell>
                                      <TableCell className="text-right font-semibold text-xs">
                                        {customBudgetNum > 0
                                          ? `${customBudgetNum.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €`
                                          : '—'}
                                      </TableCell>
                                      <TableCell className="text-right text-xs">
                                        {obj === 'Conversion' && <>Max de conversion</>}
                                        {obj === 'Clics' && (
                                          <div className="space-y-1">
                                            <EditableInput
                                              value={searchClicsStudyValue}
                                              onChange={(e) => setSearchClicsStudyValue(e.target.value)}
                                              placeholder="Valeur selon étude TM"
                                              className="h-7 w-full max-w-[120px] ml-auto text-[11px] rounded-sm border-gray-300"
                                            />
                                            <p className="text-[10px] text-muted-foreground italic">
                                              selon étude menée par les TM
                                            </p>
                                          </div>
                                        )}
                                      </TableCell>
                                      <TableCell className="text-right font-bold text-xs">
                                        {customDailyBudget > 0
                                          ? `${customDailyBudget.toLocaleString('fr-FR', {
                                              minimumFractionDigits: 1,
                                              maximumFractionDigits: 1,
                                            })} €`
                                          : '—'}
                                      </TableCell>
                                      <TableCell>
                                        {!isInStrategy && customBudgetNum > 0 && (
                                          <Button
                                            size="sm"
                                            variant="ghost"
                                            onClick={() =>
                                              requestAddToStrategy({
                                                platform,
                                                objective: obj,
                                                budget: customBudgetNum,
                                                estimatedKPIs: 0,
                                                dailyBudget: customDailyBudget,
                                                aeCheckValue: customAeCheckValue,
                                                isAvailable: true,
                                                customKpiLabel:
                                                  obj === 'Clics'
                                                    ? (searchClicsStudyValue || 'Max de clics')
                                                    : getMaxKpiLabel(obj),
                                              })
                                            }
                                            className="h-8 w-8 p-0"
                                          >
                                            <Plus className="h-4 w-4" />
                                          </Button>
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  )
                                })
                              })()}

                              {/* Ligne personnalisable (Perf max, Demand Gen et autres plateformes) — masquée pour Search */}
                              {platform !== 'Search' && (
                              <TableRow className={customRowColor}>
                                <TableCell>
                                  {platform === 'Perf max' ? (
                                    <span className="text-[11px] font-medium">Conversion</span>
                                  ) : platform === 'Demand Gen' ? (
                                    <EditableInput
                                      value={custom.objective}
                                      onChange={(e) =>
                                        handleCustomRowChange(platform, 'objective', e.target.value)
                                      }
                                      placeholder="Objectif (ex : conversions e-commerce)"
                                      className="h-7 w-full px-2 text-[11px] rounded-sm border-gray-300 bg-white shadow-none focus:ring-0 focus:ring-offset-0"
                                    />
                                  ) : (
                                    <Select
                                      value={custom.objective}
                                      onValueChange={(value: string) =>
                                        handleCustomRowChange(platform, 'objective', value)
                                      }
                                    >
                                      <SelectTrigger className="h-7 w-full px-2 text-[11px] rounded-sm border-gray-300 bg-white shadow-none focus:ring-0 focus:ring-offset-0">
                                        <SelectValue placeholder="Objectif" />
                                      </SelectTrigger>
                                      <SelectContent>
                                        {objectivesForPlatform.map((obj) => (
                                          <SelectItem
                                            key={obj}
                                            value={obj}
                                            className="text-[11px] py-1"
                                          >
                                            {obj}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-semibold text-xs">
                                  {customBudgetNum > 0
                                    ? `${customBudgetNum.toLocaleString('fr-FR', {
                                        maximumFractionDigits: 0,
                                      })} €`
                                    : '—'}
                                </TableCell>
                                <TableCell className="text-right text-xs">
                                  {platform === 'Perf max' ? (
                                    <>Max de conversion</>
                                  ) : custom.objective ? (
                                    `${getMaxKpiLabel(custom.objective)}${
                                      custom.objective === 'Leads' ? ' (estimation)' : ''
                                    }`
                                  ) : (
                                    '—'
                                  )}
                                </TableCell>
                                <TableCell className="text-right font-bold text-xs">
                                  {customDailyBudget > 0
                                    ? `${customDailyBudget.toLocaleString('fr-FR', {
                                        minimumFractionDigits: 1,
                                        maximumFractionDigits: 1,
                                      })} €`
                                    : '—'}
                                </TableCell>
                                <TableCell>
                                  {!isCustomInStrategy && customBudgetNum > 0 && custom.objective && (
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        requestAddToStrategy({
                                          platform,
                                          objective: custom.objective,
                                          budget: customBudgetNum,
                                          estimatedKPIs:
                                            referenceRowForObjective?.estimatedKPIs ?? 0,
                                          dailyBudget: customDailyBudget,
                                          aeCheckValue: customAeCheckValue,
                                          isAvailable: true,
                                          customKpiLabel:
                                            platform === 'Perf max'
                                              ? 'Max de conversion'
                                              : undefined,
                                        })
                                      }
                                      className="h-8 w-8 p-0"
                                    >
                                      <Plus className="h-4 w-4" />
                                    </Button>
                                  )}
                                </TableCell>
                              </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </div>
                      </CardContent>
                    </Card>
                  )
                })}
              </div>
            )}
          </div>

          {/* Colonne droite - Stratégies (sticky, accordéon) */}
          <div className="lg:sticky lg:top-24 lg:h-[calc(100vh-6rem)] lg:overflow-y-auto space-y-3">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-semibold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-[#E94C16]" />
                Mes stratégies (max 3)
              </div>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setIsAddingStrategy(true)}
                disabled={strategies.length >= 3}
              >
                <Plus className="h-3 w-3 mr-1" />
                Nouvelle stratégie
              </Button>
            </div>

            {isAddingStrategy && (
              <div className="flex gap-2 mb-2">
                <EditableInput
                  placeholder={`Nom de la stratégie (ex: Strat agressive)`}
                  value={newStrategyName}
                  onChange={(e) => setNewStrategyName(e.target.value)}
                  className="h-8 text-xs"
                />
                <Button
                  size="sm"
                  className="h-8 bg-[#E94C16] hover:bg-[#d43f12] text-white"
                  onClick={() => {
                    if (strategies.length >= 3) return
                    const name = newStrategyName.trim() || `Stratégie ${strategies.length + 1}`
                    const id = `strategy-${Date.now()}`
                    setStrategies((prev) => [...prev, { id, name, items: [] }])
                    setActiveStrategyId(id)
                    setExpandedStrategies((prev) => ({ ...prev, [id]: true }))
                    setNewStrategyName('')
                    setIsAddingStrategy(false)
                  }}
                >
                  Créer
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  className="h-8"
                  onClick={() => {
                    setIsAddingStrategy(false)
                    setNewStrategyName('')
                  }}
                >
                  Annuler
                </Button>
              </div>
            )}

            {strategies.map((block, index) => {
              const isActive = block.id === activeStrategyId
              const isExpanded = expandedStrategies[block.id] ?? index === 0
              const items = block.items
              const mediaItems = items.filter(isMediaStrategyItem)
              const blockAe = items.length > 0 ? items[0].aePercentage : 0
              const blockTotal = getStrategyBlockBudgetTotal(block)
              const hasSummary = items.length > 0 || getAdditionalSalesTotal(block) > 0
              const budgetLabel = blockTotal.toLocaleString('fr-FR', { maximumFractionDigits: 0 })
              const budgetTtcLabel = getStrategyBudgetTtc(blockTotal).toLocaleString('fr-FR', {
                maximumFractionDigits: 0,
              })

              const renderStrategyItemRow = (
                item: StrategyItem,
                variant: 'media' | 'complementary',
              ) => {
                const colorClass =
                  variant === 'complementary'
                    ? item.isMakeLeadsAddon
                      ? MAKE_LEADS_PINK_ROW_CLASS
                      : COMPLEMENTARY_ROW_CLASS
                    : getRowColorClass(item.platform, item.aeCheckValue, item.days || 0)
                return (
                  <div
                    key={item.id}
                    className={`p-2.5 rounded-lg border ${colorClass} flex items-start justify-between gap-2`}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                        {item.isMakeLeadsAddon ? (
                          <span className="text-sm font-semibold">{MAKE_LEADS_OPTION_LABEL}</span>
                        ) : (
                          <StrategyPlatformObjectiveLine
                            platform={item.platform}
                            objective={item.objective}
                          />
                        )}
                        {item.tarifsDirection && (
                          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                            Tarifs direction
                          </span>
                        )}
                      </div>
                      <div className="text-xs font-semibold mt-1">
                        {item.budget.toLocaleString('fr-FR', { maximumFractionDigits: 0 })} €
                      </div>
                      {!item.isMakeLeadsAddon && (
                        <>
                          <div className="text-xs text-muted-foreground mt-1">
                            {item.customKpiLabel
                              ? item.customKpiLabel
                              : item.estimatedKPIs > 0
                                ? `${item.estimatedKPIs.toLocaleString('fr-FR')} ${getKpiUnitLabel(item.objective)}${
                                    item.objective === 'Leads' ? ' (estimation)' : ''
                                  }`
                                : `${getMaxKpiLabel(item.objective)}${
                                    item.objective === 'Leads' ? ' (estimation)' : ''
                                  }`}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {item.days > 0 &&
                              `Diffusion : ${item.days} jour${item.days > 1 ? 's' : ''}`}
                          </div>
                        </>
                      )}
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => removeFromStrategy(block.id, item.id)}
                      className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 flex-shrink-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                )
              }

              return (
                <Card
                  key={block.id}
                  className={`border-2 flex flex-col mb-2 ${
                    isActive ? 'border-[#E94C16]' : 'border-muted'
                  }`}
                >
                  <CardHeader
                    className="flex-shrink-0 cursor-pointer overflow-visible"
                    onClick={() =>
                      setExpandedStrategies((prev) => ({
                        ...prev,
                        [block.id]: !isExpanded,
                      }))
                    }
                  >
                    <div className="flex items-center justify-between gap-2 min-w-0">
                      <div className="flex items-start gap-2 min-w-0 flex-1">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                        <div className="flex flex-col gap-0.5 min-w-0 flex-1">
                          <CardTitle className="flex items-center flex-wrap gap-2 text-sm">
                            {renamingStrategyId === block.id ? (
                              <div className="flex items-center gap-2">
                                <EditableInput
                                  autoFocus
                                  className="h-7 text-xs px-2 py-1"
                                  value={renamingStrategyName}
                                  onClick={(e) => e.stopPropagation()}
                                  onChange={(e) => setRenamingStrategyName(e.target.value)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const name =
                                        renamingStrategyName.trim() || `Stratégie ${index + 1}`
                                      setStrategies((prev) =>
                                        prev.map((s) =>
                                          s.id === block.id ? { ...s, name } : s,
                                        ),
                                      )
                                      setRenamingStrategyId(null)
                                      setRenamingStrategyName('')
                                    }
                                    if (e.key === 'Escape') {
                                      setRenamingStrategyId(null)
                                      setRenamingStrategyName('')
                                    }
                                  }}
                                />
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    const name =
                                      renamingStrategyName.trim() || `Stratégie ${index + 1}`
                                    setStrategies((prev) =>
                                      prev.map((s) =>
                                        s.id === block.id ? { ...s, name } : s,
                                      ),
                                    )
                                    setRenamingStrategyId(null)
                                    setRenamingStrategyName('')
                                  }}
                                >
                                  OK
                                </Button>
                              </div>
                            ) : (
                              <>
                                <span>{block.name}</span>
                                {isActive && (
                                  <span className="text-[10px] uppercase tracking-wide px-2 py-0.5 rounded-full bg-[#E94C16]/10 text-[#E94C16]">
                                    Active
                                  </span>
                                )}
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setRenamingStrategyId(block.id)
                                    setRenamingStrategyName(block.name)
                                  }}
                                >
                                  Renommer
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  className="h-7 px-2 text-[11px]"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    setCalendarStrategyId(block.id)
                                    const daysNum = Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))
                                    const today = new Date().toISOString().slice(0, 10)
                                    const cal = block.calendar
                                    if (cal) {
                                      setCalendarPeriodStart(cal.startDate)
                                      if (isStrategyCalendarData(cal)) {
                                        const end = new Date(cal.startDate + 'T12:00:00')
                                        end.setDate(end.getDate() + cal.duration - 1)
                                        const endStr = end.toISOString().slice(0, 10)
                                        const periodDates = getDatesBetween(cal.startDate, endStr)
                                        const clampedEnd = periodDates.length > daysNum ? periodDates[daysNum - 1]! : endStr
                                        setCalendarPeriodEnd(clampedEnd)
                                        setCalendarDays({})
                                        setCalendarPlatformPhases({})
                                        setCalendarPhaseDays({})
                                        setCalendarRanges([])
                                      } else {
                                        const legacy = cal as StrategyCalendar
                                        const periodDates = getDatesBetween(legacy.startDate, legacy.endDate)
                                        const clampedEnd = periodDates.length > daysNum ? periodDates[daysNum - 1]! : legacy.endDate
                                        setCalendarPeriodEnd(clampedEnd)
                                        setCalendarDays(legacy.days ? { ...legacy.days } : {})
                                        setCalendarPlatformPhases(legacy.platformPhases ? { ...legacy.platformPhases } : {})
                                        setCalendarPhaseDays(legacy.phaseDays ? JSON.parse(JSON.stringify(legacy.phaseDays)) : {})
                                        setCalendarRanges((legacy.ranges ?? []).map((r, i) => ({ ...r, id: (r as CalendarRange & { id?: string }).id || `range-${i}-${Date.now()}` })))
                                      }
                                    } else {
                                      setCalendarPeriodStart(today)
                                      const d = new Date(today + 'T12:00:00')
                                      d.setDate(d.getDate() + daysNum - 1)
                                      setCalendarPeriodEnd(d.toISOString().slice(0, 10))
                                      setCalendarDays({})
                                      setCalendarPlatformPhases({})
                                      setCalendarPhaseDays({})
                                      setCalendarRanges([])
                                    }
                                    setCalendarSelectedEntry(null)
                                    setCalendarPhasesMenuPlatform(null)
                                    setCalendarView('day')
                                    const perPlatform: Record<string, string> = {}
                                    if (cal && isStrategyCalendarData(cal)) {
                                      cal.items.forEach((it) => {
                                        const d = new Date(cal.startDate + 'T12:00:00')
                                        d.setDate(d.getDate() + it.startDay)
                                        const key = `${it.platform}::${it.objective ?? ''}`
                                        perPlatform[key] = d.toISOString().slice(0, 10)
                                      })
                                    }
                                    block.items.forEach((item, i) => {
                                      const key = `${item.platform}::${item.objective}`
                                      if (perPlatform[key]) return
                                      if (i === 0) {
                                        perPlatform[key] = today
                                        return
                                      }
                                      const prev = block.items[i - 1]!
                                      const prevKey = `${prev.platform}::${prev.objective}`
                                      const prevStart = perPlatform[prevKey] ?? today
                                      const prevLen = Math.max(1, prev.days ?? daysNum)
                                      const d = new Date(prevStart + 'T12:00:00')
                                      d.setDate(d.getDate() + prevLen)
                                      perPlatform[key] = d.toISOString().slice(0, 10)
                                    })
                                    setDefineDatesPerStrategy((prev) => ({
                                      ...prev,
                                      [block.id]: perPlatform,
                                    }))
                                    setCalendarDialogOpen(true)
                                  }}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Calendrier
                                </Button>
                              </>
                            )}
                          </CardTitle>

                          {hasSummary && !isExpanded && (
                            <div className="flex flex-wrap items-center gap-1.5 mt-1">
                              {blockAe > 0 && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-bold text-[#E94C16]">
                                  AE {blockAe} %
                                </span>
                              )}
                              <span className="inline-flex items-center rounded-md border-2 border-[#E94C16] bg-white px-2 py-0.5 text-[10px] font-bold text-[#E94C16]">
                                HT{' '}
                                <span className="ml-1 text-xs font-extrabold tabular-nums">
                                  {budgetLabel} €
                                </span>
                              </span>
                              <span className="inline-flex items-center rounded-md border-2 border-[#E94C16] bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                                TTC{' '}
                                <span className="ml-1 text-xs font-extrabold tabular-nums">
                                  {budgetTtcLabel} €
                                </span>
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {!isActive && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-7 text-[11px]"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveStrategyId(block.id)
                            }}
                          >
                            Activer
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardHeader>

                  {isExpanded && (
                    <CardContent className="flex-1 flex flex-col overflow-hidden pt-0">
                      {items.length > 0 ? (
                        <>
                          {/* Graphiques (affichage sur demande) */}
                          {isActive && (chartData.length > 0 || chartDataByObjective.length > 0) && (
                            <div className="mb-3 mt-2">
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                className="h-7 w-full text-[11px] gap-1.5"
                                onClick={() =>
                                  setStrategyChartsOpen((prev) => ({
                                    ...prev,
                                    [block.id]: !prev[block.id],
                                  }))
                                }
                              >
                                <BarChart2 className="h-3.5 w-3.5" />
                                {strategyChartsOpen[block.id]
                                  ? 'Masquer les graphiques'
                                  : 'Afficher les graphiques'}
                              </Button>

                              {strategyChartsOpen[block.id] && (
                                <div className="mt-2">
                                  <div className="mb-2">
                                    <Tabs
                                      value={chartView}
                                      onValueChange={(value) => setChartView(value as ChartView)}
                                      className="w-full"
                                    >
                                      <TabsList className="grid h-8 w-full grid-cols-2 border border-gray-300">
                                        <TabsTrigger
                                          value="platform"
                                          className="h-7 text-[11px] data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                                          disabled={chartData.length === 0}
                                        >
                                          Par plateforme
                                        </TabsTrigger>
                                        <TabsTrigger
                                          value="objective"
                                          className="h-7 text-[11px] data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                                          disabled={chartDataByObjective.length === 0}
                                        >
                                          Par objectif
                                        </TabsTrigger>
                                      </TabsList>
                                    </Tabs>
                                  </div>

                                  {chartView === 'platform' && chartData.length > 0 && (
                                    <div>
                                      <h3 className="text-xs font-semibold mb-1.5">
                                        Répartition par plateforme
                                      </h3>
                                      <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                          <Pie
                                            data={chartData}
                                            cx="50%"
                                            cy="45%"
                                            labelLine={false}
                                            outerRadius={42}
                                            fill="#8884d8"
                                            dataKey="value"
                                          >
                                            {chartData.map((entry, idx) => (
                                              <Cell
                                                key={`cell-${idx}`}
                                                fill={COLORS[idx % COLORS.length]}
                                              />
                                            ))}
                                          </Pie>
                                          <Tooltip
                                            formatter={(value: number | undefined) =>
                                              value != null
                                                ? `${value.toLocaleString('fr-FR')} €`
                                                : '-'
                                            }
                                          />
                                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </div>
                                  )}

                                  {chartView === 'objective' && chartDataByObjective.length > 0 && (
                                    <div>
                                      <h3 className="text-xs font-semibold mb-1.5">
                                        Répartition par objectif
                                      </h3>
                                      <ResponsiveContainer width="100%" height={160}>
                                        <PieChart>
                                          <Pie
                                            data={chartDataByObjective}
                                            cx="50%"
                                            cy="45%"
                                            labelLine={false}
                                            outerRadius={42}
                                            fill="#8884d8"
                                            dataKey="value"
                                          >
                                            {chartDataByObjective.map((entry, idx) => (
                                              <Cell
                                                key={`cell-objective-${idx}`}
                                                fill={COLORS[idx % COLORS.length]}
                                              />
                                            ))}
                                          </Pie>
                                          <Tooltip
                                            formatter={(value: number | undefined) =>
                                              value != null
                                                ? `${value.toLocaleString('fr-FR')} €`
                                                : '-'
                                            }
                                          />
                                          <Legend wrapperStyle={{ fontSize: '11px' }} />
                                        </PieChart>
                                      </ResponsiveContainer>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          )}

                          {/* Lignes plateformes */}
                          <div className="flex-1 overflow-y-auto mb-3 max-h-[280px]">
                            {mediaItems.length > 0 && (
                              <div className="space-y-2">
                                <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
                                  Plateformes
                                </p>
                                {mediaItems.map((item) => renderStrategyItemRow(item, 'media'))}
                              </div>
                            )}
                          </div>

                          {/* Commentaire libre (indépendant par stratégie) */}
                          {isActive && (
                            <div className="mb-3 flex-shrink-0 rounded-lg border bg-muted/30 p-2.5">
                              <Label
                                htmlFor={`strategy-comment-${block.id}`}
                                className="text-sm mb-1.5 block"
                              >
                                Commentaire
                              </Label>
                              <Textarea
                                id={`strategy-comment-${block.id}`}
                                placeholder="Commentaire visible sur le PDF"
                                rows={2}
                                value={block.comment ?? ''}
                                onChange={(e) => {
                                  const value = e.target.value
                                  setStrategies((prev) =>
                                    prev.map((s) =>
                                      s.id === block.id ? { ...s, comment: value } : s,
                                    ),
                                  )
                                }}
                                className="min-h-0 text-xs resize-none bg-background py-1.5"
                              />
                            </div>
                          )}

                          {/* Vente additionnelle */}
                          {isActive && (
                            <div className="mb-3 flex-shrink-0 rounded-lg border border-violet-200 bg-violet-50/40 p-2.5">
                              <Label className="text-violet-900 text-sm mb-2 block">Vente additionnelle</Label>
                              <div className="grid grid-cols-2 gap-1.5">
                                {ADDITIONAL_SALE_OPTIONS.map((opt) => {
                                  const count = getAdditionalSaleCount(block, opt.id)
                                  const checked = isAdditionalSaleChecked(block, opt.id)
                                  const hasQuantity = supportsAdditionalSaleQuantity(opt.id)
                                  const quantityValue = Math.max(1, count)
                                  const unitPrice = getAdditionalSaleUnitPrice(opt.id)
                                  const lineTotal = getAdditionalSaleAmount(opt.id, quantityValue)

                                  return (
                                    <div
                                      key={opt.id}
                                      className="flex flex-col gap-1 rounded-md border border-violet-100 bg-white/70 px-2 py-1.5 min-h-[36px]"
                                    >
                                      <label className="flex items-start gap-1.5 text-xs leading-tight min-w-0 cursor-pointer">
                                        <Checkbox
                                          className="mt-0.5 shrink-0"
                                          checked={checked}
                                          onCheckedChange={(c) =>
                                            toggleStrategyAdditionalSale(
                                              block.id,
                                              opt.id,
                                              c === true,
                                            )
                                          }
                                        />
                                        <span className="min-w-0">{opt.label}</span>
                                      </label>
                                      {hasQuantity && checked && (
                                        <div className="flex flex-col gap-0.5 pl-5">
                                          <div className="flex items-center gap-1 flex-wrap">
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                              Nombre :
                                            </span>
                                            <div className="flex items-center shrink-0 rounded-md border border-input overflow-hidden">
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-6 shrink-0 rounded-none border-r border-input hover:bg-violet-100"
                                                disabled={quantityValue <= 1}
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setStrategyAdditionalSaleCount(
                                                    block.id,
                                                    opt.id,
                                                    Math.max(1, quantityValue - 1),
                                                  )
                                                }}
                                              >
                                                <Minus className="h-3 w-3" />
                                              </Button>
                                              <Input
                                                type="number"
                                                min={1}
                                                value={quantityValue}
                                                onChange={(e) => {
                                                  const parsed = parseInt(e.target.value, 10)
                                                  setStrategyAdditionalSaleCount(
                                                    block.id,
                                                    opt.id,
                                                    Number.isFinite(parsed) && parsed > 0 ? parsed : 1,
                                                  )
                                                }}
                                                onClick={(e) => e.stopPropagation()}
                                                className="h-7 w-9 shrink-0 border-0 px-0 text-center text-sm font-semibold text-foreground tabular-nums shadow-none focus-visible:ring-0 [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                                              />
                                              <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="h-7 w-6 shrink-0 rounded-none border-l border-input hover:bg-violet-100"
                                                onClick={(e) => {
                                                  e.stopPropagation()
                                                  setStrategyAdditionalSaleCount(
                                                    block.id,
                                                    opt.id,
                                                    quantityValue + 1,
                                                  )
                                                }}
                                              >
                                                <Plus className="h-3 w-3" />
                                              </Button>
                                            </div>
                                            <span className="text-[10px] text-muted-foreground whitespace-nowrap">
                                              × {unitPrice.toLocaleString('fr-FR')} €
                                            </span>
                                          </div>
                                          <span className="text-[10px] font-semibold text-violet-800">
                                            = {lineTotal.toLocaleString('fr-FR')} € HT
                                          </span>
                                        </div>
                                      )}
                                    </div>
                                  )
                                })}
                              </div>
                            </div>
                          )}

                          {/* Prix total — au-dessus des boutons d'export */}
                          {isActive && hasSummary && (
                            <div className="mb-2 flex-shrink-0 space-y-2">
                              {blockAe > 0 && (
                                <div className="flex justify-center">
                                  <span className="inline-flex items-center gap-2">
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-[#E94C16]">
                                      AE
                                    </span>
                                    <span className="text-base font-extrabold leading-none text-[#E94C16] tabular-nums">
                                      {blockAe} %
                                    </span>
                                  </span>
                                </div>
                              )}
                              <div className="grid grid-cols-2 gap-2">
                                <div className="rounded-xl border-2 border-[#E94C16] bg-white px-4 py-3 shadow-sm">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-[#E94C16]">
                                    Total HT
                                  </p>
                                  <p className="mt-1.5 text-2xl font-extrabold leading-none text-[#E94C16] tabular-nums">
                                    {budgetLabel}
                                    <span className="ml-1 text-lg font-bold text-[#E94C16]/80">€</span>
                                  </p>
                                  <p className="mt-2 text-[10px] font-medium text-[#E94C16]/80">Hors taxes</p>
                                </div>
                                <div className="rounded-xl border-2 border-[#E94C16] bg-white px-4 py-3 shadow-sm">
                                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-600">
                                    Total TTC
                                  </p>
                                  <p className="mt-1.5 text-2xl font-extrabold leading-none text-slate-600 tabular-nums">
                                    {budgetTtcLabel}
                                    <span className="ml-1 text-lg font-bold text-slate-600/80">€</span>
                                  </p>
                                  <p className="mt-2 text-[10px] font-medium text-slate-600/80">TVA 20 % incluse</p>
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Boutons d'export pour la stratégie active */}
                          {isActive && (
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setValidationTMDialogOpen(true)}
                                className="w-full"
                                disabled={!hasSummary}
                              >
                                Validation TM
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPdfDialogOpen(true)}
                                className="w-full"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={handleOpenSaveStrategyDialog}
                                className="w-full"
                                disabled={!hasSummary || savingStrategy || loadingStrategy}
                              >
                                {savingStrategy ? (
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                ) : (
                                  <Save className="h-4 w-4 mr-2" />
                                )}
                                Sauvegarder
                              </Button>
                            </div>
                          )}
                          {isActive && loadingStrategy && (
                            <p className="text-center text-xs text-muted-foreground flex items-center justify-center gap-1">
                              <Loader2 className="h-3 w-3 animate-spin" />
                              Chargement de la stratégie…
                            </p>
                          )}
                          {isActive && !loadingStrategy && savedStrategyId && (
                            <p className="text-center text-xs text-muted-foreground">
                              Stratégie chargée :{' '}
                              <span className="font-medium text-foreground">{savedStrategyName}</span>
                              {' '}— modifiez puis réenregistrez pour mettre à jour.
                            </p>
                          )}
                        </>
                      ) : (
                        <div className="flex-1 flex items-center justify-center text-center text-muted-foreground py-4">
                          <div>
                            <TrendingUp className="h-10 w-10 mx-auto mb-2 opacity-50" />
                            <p className="text-sm">Aucun élément dans cette stratégie</p>
                            <p className="text-xs mt-1">
                              Sélectionnez cette stratégie puis utilisez le bouton + du tableau
                            </p>
                          </div>
                        </div>
                      )}
                    </CardContent>
                  )}
                </Card>
              )
            })}
          </div>
        </div>
        </>
        )}

        {pdvSection === 'sms' && (
          <div className="mt-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)] gap-6">
            {/* Bloc unique : configuration & simulation SMS */}
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Paramètres SMS
                </CardTitle>
                <CardDescription>
                  Configurez vos campagnes SMS ou RCS. Ce module est totalement indépendant du calculateur Social media.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-x-6 gap-y-4">
                  <Label className="lg:col-start-1">Type de campagne & volume</Label>

                  <div className="lg:col-start-1 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                      <Tabs
                        value={smsType}
                        onValueChange={(value) => {
                          const next = value as SmsType
                          setSmsType(next)
                          setSmsOptions(
                            next === 'sms'
                              ? {
                                  ciblage: false,
                                  baseClients: false,
                                  richSms: false,
                                  agent: false,
                                  creaByLink: false,
                                  tarifIntermarche: false,
                                  duplicateCampaign: false,
                                }
                              : {
                                  ciblage: false,
                                  baseClients: false,
                                  richSms: false,
                                  agent: false,
                                  creaByLink: false,
                                  tarifIntermarche: false,
                                  duplicateCampaign: false,
                                },
                          )
                          setCampaignMonths('1')
                          setCreaByLinkCount('1')
                        }}
                        className="w-full sm:w-auto shrink-0"
                      >
                        <TabsList className="grid w-full sm:w-[11rem] grid-cols-2 border-2 border-gray-300">
                          <TabsTrigger
                            value="sms"
                            className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                          >
                            SMS
                          </TabsTrigger>
                          <TabsTrigger
                            value="rcs"
                            className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                          >
                            RCS
                          </TabsTrigger>
                        </TabsList>
                      </Tabs>

                      <div className="flex-1 min-w-[10rem] space-y-1">
                        <Label htmlFor="sms-rcs-volume" className="text-xs text-muted-foreground sm:sr-only">
                          Nombre de {smsType === 'sms' ? 'SMS' : 'RCS'}
                          {smsOptions.duplicateCampaign && smsCampaignCount > 1 ? ' par campagne' : ''}
                        </Label>
                        <EditableInput
                          id="sms-rcs-volume"
                          type="number"
                          min={0}
                          placeholder={`Ex: ${smsType === 'sms' ? '20 000' : '15 000'}`}
                          value={smsVolume}
                          onChange={(e) => setSmsVolume(e.target.value)}
                          className="h-10"
                        />
                      </div>
                    </div>
                    {smsType === 'sms' && (
                      <p className="text-xs text-muted-foreground">
                        Le tarif unitaire dépend uniquement du volume total de SMS envoyé (tranche unique, non
                        cumulative).
                      </p>
                    )}
                    {smsType === 'rcs' && totalUnitsNumber > 0 && totalUnitsNumber < 10_000 && (
                      <p className="text-xs text-red-600 font-medium">Volume minimum requis : 10 000 RCS</p>
                    )}
                    {smsOptions.duplicateCampaign && smsCampaignCount > 1 && smsVolumeNumber > 0 && (
                      <p className="text-xs text-muted-foreground">
                        Nombre total de {smsType === 'sms' ? 'SMS' : 'RCS'} :{' '}
                        {totalUnitsNumber.toLocaleString('fr-FR')}
                      </p>
                    )}
                  </div>

                  {/* Devis — aligné sur la ligne de saisie du volume (lg: row 2) */}
                  <div className="space-y-4 lg:col-start-2 lg:row-start-2 lg:row-span-3 lg:sticky lg:top-4 self-start">
                    {smsType === 'sms' ? (
                      <SmsRcsMiniDevisPanel
                        title="Devis SMS"
                        lines={smsMiniDevis.lines}
                        totalHt={smsMiniDevis.totalHt}
                        emptyMessage="Saisissez un volume de SMS pour afficher le devis."
                      />
                    ) : rcsMiniDevis.forbidden ? (
                      <SmsRcsMiniDevisPanel
                        title="Devis RCS"
                        lines={[]}
                        emptyMessage="Volume minimum requis : 10 000 RCS pour établir un devis."
                      />
                    ) : (
                      <SmsRcsMiniDevisPanel
                        title="Devis RCS"
                        lines={rcsMiniDevis.lines}
                        totalHt={rcsMiniDevis.totalHt}
                        emptyMessage="Saisissez un volume de RCS pour afficher le devis."
                      />
                    )}

                    {smsType === 'rcs' && smsOptions.tarifIntermarche && rcsMiniDevis.lines.length > 0 && (
                      <div className="rounded-lg border border-[#E94C16]/30 bg-orange-50/40 px-3 py-2 text-xs text-[#E94C16] space-y-0.5">
                        <p className="font-semibold">Tarif Intermarché — points de négo possibles :</p>
                        <p>Offre des frais de set up si besoin.</p>
                        <p>Négo créa agent possible.</p>
                      </div>
                    )}

                    <div className="rounded-lg border bg-muted/30 p-2.5">
                      <Label htmlFor="sms-rcs-comment" className="text-sm mb-1.5 block">
                        Commentaire
                      </Label>
                      <Textarea
                        id="sms-rcs-comment"
                        placeholder="Commentaire visible sur le PDF"
                        rows={2}
                        value={smsPdfComment}
                        onChange={(e) => setSmsPdfComment(e.target.value)}
                        className="min-h-0 text-xs resize-none bg-background py-1.5"
                      />
                    </div>
                  </div>

                  {/* Options — colonne gauche, sous le volume */}
                  <div className="lg:col-start-1 space-y-3">
                      <Label>Options disponibles</Label>
                      {smsType === 'sms' && (
                        <div className="space-y-2 text-sm">
                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.baseClients
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.ciblage}
                              disabled={smsOptions.baseClients}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  ciblage: e.target.checked,
                                  baseClients: e.target.checked ? false : prev.baseClients,
                                }))
                              }
                            />
                            <span>Ciblage</span>
                          </label>

                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.ciblage ||
                                smsOptions.richSms ||
                                smsOptions.tarifIntermarche
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.baseClients}
                              disabled={
                                smsOptions.ciblage ||
                                smsOptions.richSms ||
                                smsOptions.tarifIntermarche
                              }
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  baseClients: e.target.checked,
                                  ciblage: e.target.checked ? false : prev.ciblage,
                                  richSms: e.target.checked ? false : prev.richSms,
                                  tarifIntermarche: e.target.checked ? false : prev.tarifIntermarche,
                                }))
                              }
                            />
                            <span>Base clients</span>
                          </label>

                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.baseClients
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.richSms}
                              disabled={smsOptions.baseClients}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  richSms: e.target.checked,
                                  baseClients: e.target.checked ? false : prev.baseClients,
                                }))
                              }
                            />
                            <span>Rich SMS</span>
                          </label>

                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.baseClients
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.tarifIntermarche}
                              disabled={smsOptions.baseClients}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  tarifIntermarche: e.target.checked,
                                  baseClients: e.target.checked ? false : prev.baseClients,
                                }))
                              }
                            />
                            <span>Tarif Intermarché</span>
                          </label>

                          <label className="flex items-center justify-between gap-3 rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                                checked={smsOptions.duplicateCampaign}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, duplicateCampaign: e.target.checked }))
                                }
                              />
                              <span className="cursor-pointer">Dupliquer la campagne</span>
                            </div>
                            
                            {smsOptions.duplicateCampaign && (
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">Nombre de campagnes :</span>
                                <EditableInput
                                  type="number"
                                  min="1"
                                  value={campaignMonths}
                                  onChange={(e) => setCampaignMonths(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-8 w-20 text-center"
                                  placeholder="1"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      )}

                      {smsType === 'rcs' && (
                        <div className="space-y-2 text-sm">
                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.baseClients
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.ciblage}
                              disabled={smsOptions.baseClients}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  ciblage: e.target.checked,
                                  baseClients: e.target.checked ? false : prev.baseClients,
                                }))
                              }
                            />
                            <span>Ciblage</span>
                          </label>

                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.ciblage || smsOptions.tarifIntermarche
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.baseClients}
                              disabled={smsOptions.ciblage || smsOptions.tarifIntermarche}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  baseClients: e.target.checked,
                                  ciblage: e.target.checked ? false : prev.ciblage,
                                  tarifIntermarche: e.target.checked ? false : prev.tarifIntermarche,
                                }))
                              }
                            />
                            <span>Base clients</span>
                          </label>

                          <label className="flex items-center gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.agent}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({ ...prev, agent: e.target.checked }))
                              }
                            />
                            <span>Création d&apos;agent (si nécessaire)</span>
                          </label>

                          <label className="flex items-center justify-between gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={smsOptions.creaByLink}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, creaByLink: e.target.checked }))
                                }
                              />
                              <span className="cursor-pointer">CREA BY LINK</span>
                            </div>

                            {smsOptions.creaByLink && (
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">Nombre :</span>
                                <EditableInput
                                  type="number"
                                  min="1"
                                  value={creaByLinkCount}
                                  onChange={(e) => setCreaByLinkCount(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-8 w-16 text-center"
                                  placeholder="1"
                                />
                              </div>
                            )}
                          </label>

                          <label
                            className={cn(
                              'flex items-center gap-2 rounded-md border bg-white px-3 py-2',
                              smsOptions.baseClients
                                ? 'cursor-not-allowed opacity-50'
                                : 'cursor-pointer',
                            )}
                          >
                            <input
                              type="checkbox"
                              className="h-4 w-4 rounded border-gray-300"
                              checked={smsOptions.tarifIntermarche}
                              disabled={smsOptions.baseClients}
                              onChange={(e) =>
                                setSmsOptions((prev) => ({
                                  ...prev,
                                  tarifIntermarche: e.target.checked,
                                  baseClients: e.target.checked ? false : prev.baseClients,
                                }))
                              }
                            />
                            <span>Tarif Intermarché</span>
                          </label>

                          <label className="flex items-center justify-between gap-3 rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300 cursor-pointer"
                                checked={smsOptions.duplicateCampaign}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, duplicateCampaign: e.target.checked }))
                                }
                              />
                              <span className="cursor-pointer">Dupliquer la campagne</span>
                            </div>
                            
                            {smsOptions.duplicateCampaign && (
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs text-muted-foreground whitespace-nowrap">Nombre de campagnes :</span>
                                <EditableInput
                                  type="number"
                                  min="1"
                                  value={campaignMonths}
                                  onChange={(e) => setCampaignMonths(e.target.value)}
                                  onClick={(e) => e.stopPropagation()}
                                  className="h-8 w-20 text-center"
                                  placeholder="1"
                                />
                              </div>
                            )}
                          </label>
                        </div>
                      )}

                    <div className="rounded-lg border bg-muted/30 p-2.5 space-y-3">
                      <div className="flex items-center justify-between gap-2">
                        <Label className="text-sm">Dates d&apos;envoi</Label>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="h-8 text-xs"
                          onClick={() =>
                            setSmsRcsSendWaves((prev) => [
                              ...prev,
                              { id: `send-${Date.now()}`, date: '', volume: '' },
                            ])
                          }
                        >
                          <Plus className="h-3.5 w-3.5 mr-1" />
                          Ajouter
                        </Button>
                      </div>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">
                        Planifiez une ou plusieurs dates pour répartir les envois. Le volume par date est
                        optionnel.
                      </p>
                      <div className="space-y-2">
                        {smsRcsSendWaves.map((wave, index) => (
                          <div key={wave.id} className="flex flex-col sm:flex-row gap-2 sm:items-end">
                            <div className="flex-1 min-w-0 space-y-1">
                              <Label
                                htmlFor={`sms-rcs-send-date-${wave.id}`}
                                className="text-xs text-muted-foreground"
                              >
                                {smsRcsSendWaves.length > 1 ? `Envoi ${index + 1}` : 'Date'}
                              </Label>
                              <Input
                                id={`sms-rcs-send-date-${wave.id}`}
                                type="date"
                                value={wave.date}
                                onChange={(e) =>
                                  setSmsRcsSendWaves((prev) =>
                                    prev.map((item) =>
                                      item.id === wave.id ? { ...item, date: e.target.value } : item,
                                    ),
                                  )
                                }
                                className="h-9 text-sm bg-background"
                              />
                            </div>
                            <div className="w-full sm:w-28 space-y-1">
                              <Label
                                htmlFor={`sms-rcs-send-volume-${wave.id}`}
                                className="text-xs text-muted-foreground"
                              >
                                Volume
                              </Label>
                              <EditableInput
                                id={`sms-rcs-send-volume-${wave.id}`}
                                type="number"
                                min={0}
                                placeholder="—"
                                value={wave.volume}
                                onChange={(e) =>
                                  setSmsRcsSendWaves((prev) =>
                                    prev.map((item) =>
                                      item.id === wave.id ? { ...item, volume: e.target.value } : item,
                                    ),
                                  )
                                }
                                className="h-9 text-sm text-center"
                              />
                            </div>
                            {smsRcsSendWaves.length > 1 ? (
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-9 w-9 shrink-0 text-muted-foreground hover:text-destructive"
                                onClick={() =>
                                  setSmsRcsSendWaves((prev) =>
                                    prev.length > 1 ? prev.filter((item) => item.id !== wave.id) : prev,
                                  )
                                }
                                aria-label={`Supprimer l'envoi ${index + 1}`}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            ) : null}
                          </div>
                        ))}
                      </div>
                      {smsRcsSendWavesVolumeMismatch ? (
                        <p className="text-xs text-amber-700 leading-relaxed">
                          La somme des volumes par date ({formatNumber(smsRcsSendWavesVolumeSum, 0)}) ne
                          correspond pas au volume saisi ({formatNumber(smsVolumeNumber, 0)}).
                        </p>
                      ) : null}
                    </div>
                    </div>
                </div>

                {/* Conditions de vente selon le type de campagne */}
                <div className="rounded-lg border bg-muted/30 px-4 py-3 text-xs text-muted-foreground space-y-1">
                  <p className="font-semibold text-[11px] tracking-wide uppercase text-[#E94C16]">
                    Conditions ventes {smsType === 'sms' ? 'SMS' : 'RCS'}
                  </p>
                  {smsType === 'sms' ? (
                    <ul className="list-disc pl-4 space-y-0.5">
                      {SMS_SALES_CONDITIONS.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  ) : (
                    <ul className="list-disc pl-4 space-y-0.5">
                      {RCS_SALES_CONDITIONS.map((line) => (
                        <li key={line}>{line}</li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* Boutons enregistrement & PDF */}
                <div className="mt-6 flex flex-col sm:flex-row justify-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleOpenSaveDevisDialog}
                    disabled={!smsDevisSaveEligible || savingDevis || loadingDevis}
                  >
                    {savingDevis ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    Sauvegarder
                  </Button>
                  {smsType === 'sms' ? (
                    <Button
                      onClick={handleOpenSMSPDFDialog}
                      disabled={smsVolumeNumber <= 0 || smsUnitPrice <= 0 || smsTotalPrice <= 0}
                      className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le devis SMS en PDF
                    </Button>
                  ) : (
                    <Button
                      onClick={handleOpenRCSPDFDialog}
                      disabled={smsVolumeNumber < 10_000 || rcsUnitPrice <= 0 || rcsTotalPrice <= 0}
                      className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le devis RCS en PDF
                    </Button>
                  )}
                </div>
                {loadingDevis ? (
                  <p className="text-center text-xs text-muted-foreground mt-2 flex items-center justify-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Chargement du devis…
                  </p>
                ) : savedDevisId ? (
                  <p className="text-center text-xs text-muted-foreground mt-2">
                    Devis chargé : <span className="font-medium text-foreground">{savedDevisName}</span>
                    {' '}— modifiez puis réenregistrez pour mettre à jour.
                  </p>
                ) : null}
              </CardContent>
            </Card>
          </div>
        )}

        {pdvSection === 'calendar' && (
          <div className="mt-6 space-y-6">
            <div className="space-y-6">
                    <RetroPlanningPanel
              availablePlatforms={PLATFORMS_ORDER}
              startDate={retroLinkSocial ? activeRetroSocial.startDate : retroStartDate}
              onStartDateChange={(d) => {
                if (retroLinkSocial) patchRetroSocial(activeStrategyId, { startDate: d })
                else setRetroStartDate(d)
              }}
              durationDays={retroLinkSocial ? activeRetroSocial.durationDays : retroDurationDays}
              onDurationDaysChange={(d) => {
                if (retroLinkSocial) patchRetroSocial(activeStrategyId, { durationDays: d })
                else setRetroDurationDays(d)
              }}
              platformPhases={retroLinkSocial ? activeRetroSocial.platformPhases : retroPlatformPhases}
              onPlatformPhasesChange={(ph) => {
                if (retroLinkSocial) patchRetroSocial(activeStrategyId, { platformPhases: ph })
                else setRetroPlatformPhases(ph)
              }}
              fromScratchRetro={true}
              linkSocial={retroLinkSocial}
              strategyItems={
                retroLinkSocial
                  ? (strategies.find((s) => s.id === activeStrategyId)?.items ?? []).map((it) => ({
                      platform: it.platform,
                      objective: it.objective,
                      days: it.days,
                    }))
                  : []
              }
              linkSms={retroLinkSms}
              smsType={smsType}
              smsPhases={retroSmsPhases}
              onSmsPhasesChange={setRetroSmsPhases}
              linkedSocialLineSplits={retroLinkSocial ? activeRetroSocial.socialLineSplits : {}}
              onLinkedSocialLineSplitsChange={(lineKey, segments) => {
                if (!retroLinkSocial) return
                setRetroSocialByStrategy((prev) => {
                  const bundle = prev[activeStrategyId] ?? defaultRetroSocialState()
                  return {
                    ...prev,
                    [activeStrategyId]: {
                      ...bundle,
                      socialLineSplits: { ...bundle.socialLineSplits, [lineKey]: segments },
                    },
                  }
                })
              }}
              strategyDaysFallback={Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))}
              smsCampaignTotalDays={
                retroLinkSms ? Math.max(30, campaignMonthsNumber * 30) : undefined
              }
              onApplyDistribution={() => {
                const duration = Math.max(
                  1,
                  retroLinkSocial ? activeRetroSocial.durationDays : retroDurationDays,
                )
                const phases = retroLinkSocial ? activeRetroSocial.platformPhases : retroPlatformPhases
                const start = retroLinkSocial ? activeRetroSocial.startDate : retroStartDate
                const sources: CalendarPlatformSource[] = phases.flatMap(({ platform, phases: phs }) => {
                  if (phs.length === 0) {
                    return [{ platform, budget: 0, kpiLabel: '', maxDays: duration }]
                  }
                  return phs.map((ph) => ({
                    platform: ph.name === platform ? platform : `${platform}::${ph.name}`,
                    budget: 0,
                    kpiLabel: '',
                    maxDays: Math.max(1, ph.defaultDays ?? duration),
                  }))
                })
                if (sources.length === 0) return
                const items = autoDistribute(sources, duration)
                const nextCal: StrategyCalendarData = {
                  startDate: start,
                  duration,
                  items: items.map((i) => ({
                    ...i,
                    objective: i.platform.includes('::') ? i.platform.split('::')[1] : undefined,
                  })),
                }
                if (retroLinkSocial) patchRetroSocial(activeStrategyId, { calendarData: nextCal })
                else setRetroCalendarData(nextCal)
              }}
            />
            {(() => {
              const scratchCal = retroLinkSocial ? activeRetroSocial.calendarData : retroCalendarData
              const scratchPhases = retroLinkSocial ? activeRetroSocial.platformPhases : retroPlatformPhases
              const baseDuration = Math.max(
                1,
                retroLinkSocial ? activeRetroSocial.durationDays : retroDurationDays,
              )
              const defaultStart =
                (retroLinkSocial ? activeRetroSocial.startDate : retroStartDate) ||
                new Date().toISOString().slice(0, 10)
              const daysBetween = (a: string, b: string) =>
                Math.round(
                  (new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) /
                    (24 * 60 * 60 * 1000),
                )

              let items: StrategyCalendarData['items'] = scratchCal?.items ?? []
              if (!scratchCal?.items?.length && scratchPhases.length > 0) {
                items = []
              } else if (scratchCal?.items?.length) {
                items = [...scratchCal.items]
              }

              const durationFromItems =
                items.length > 0
                  ? items.reduce((max, it) => Math.max(max, (it.startDay ?? 0) + (it.length ?? 0)), 0)
                  : 0
              const duration = Math.max(baseDuration, durationFromItems || baseDuration)

              let platformSources: CalendarPlatformSource[] =
                scratchPhases.length > 0
                  ? scratchPhases.flatMap(({ platform, phases, singleLineDays }) => {
                      if (phases.length === 0) {
                        return [
                          {
                            platform,
                            budget: 0,
                            kpiLabel: '',
                            maxDays: Math.max(1, singleLineDays ?? duration),
                          },
                        ]
                      }
                      return phases.map((ph) => ({
                        platform: ph.name === platform ? platform : `${platform}::${ph.name}`,
                        budget: 0,
                        kpiLabel: '',
                        maxDays: Math.max(1, ph.defaultDays ?? duration),
                      }))
                    })
                  : items.length
                    ? items.map((item) => ({
                        platform: item.objective ? `${item.platform}::${item.objective}` : item.platform,
                        budget: item.budget ?? 0,
                        kpiLabel: item.kpiLabel ?? '',
                        maxDays: Math.max(1, item.length || duration),
                      }))
                    : []

              const strategyPlatformKeys = new Set<string>()
              const datesForActiveStrategy = defineDatesPerStrategy[activeStrategyId] ?? {}

              if (retroLinkSocial) {
                const block = strategies.find((s) => s.id === activeStrategyId)
                if (block?.items?.length) {
                  const stratDuration = Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))
                  const stratStart = block.items
                    .map((it) => {
                      const lk = retroStrategyLineKey(it.platform, it.objective)
                      return datesForActiveStrategy[lk] ?? defaultStart
                    })
                    .reduce((min, d) => (d < min ? d : min), defaultStart)

                  const stratSources: CalendarPlatformSource[] = []
                  const stratItemsMerged: StrategyCalendarData['items'] = []

                  for (const item of block.items) {
                    const lineKey = retroStrategyLineKey(item.platform, item.objective)
                    const totalDays = Math.max(1, item.days ?? stratDuration)
                    const rawSegs =
                      activeRetroSocial.socialLineSplits[lineKey] &&
                      activeRetroSocial.socialLineSplits[lineKey]!.length > 0
                        ? activeRetroSocial.socialLineSplits[lineKey]!
                        : [{ name: item.objective, days: totalDays }]
                    const segments = rebalanceRetroSocialSegments(rawSegs, totalDays)
                    const startDateLine = datesForActiveStrategy[lineKey] ?? stratStart
                    let cursorDay = Math.max(0, daysBetween(defaultStart, startDateLine))
                    const budget = item.budget ?? 0
                    const nSeg = segments.length

                    segments.forEach((seg, idx) => {
                      const subKey = retroStrategySubPlatformKey(lineKey, idx)
                      strategyPlatformKeys.add(subKey)
                      const len = seg.days
                      const share = nSeg > 0 ? budget / nSeg : budget
                      stratSources.push({
                        platform: subKey,
                        budget: share,
                        kpiLabel: item.customKpiLabel ?? '',
                        maxDays: Math.max(1, len),
                      })
                      stratItemsMerged.push({
                        platform: subKey,
                        startDay: cursorDay,
                        length: len,
                        budget: share,
                        kpiLabel: item.customKpiLabel,
                        objective: seg.name,
                      })
                      cursorDay += len
                    })
                  }

                  platformSources = [...platformSources, ...stratSources]
                  items = [...items, ...stratItemsMerged]
                } else if (block?.calendar && isStrategyCalendarData(block.calendar)) {
                  const cal = block.calendar
                  const offset = daysBetween(defaultStart, cal.startDate)
                  const calItems = cal.items.map((item) => {
                    const key = item.objective ? `${item.platform}::${item.objective}` : item.platform
                    strategyPlatformKeys.add(key)
                    return {
                      ...item,
                      platform: key,
                      startDay: Math.max(0, offset + item.startDay),
                      length: item.length,
                    }
                  })
                  items = [...items, ...calItems]
                  platformSources = [
                    ...platformSources,
                    ...cal.items.map((item) => ({
                      platform: item.objective ? `${item.platform}::${item.objective}` : item.platform,
                      budget: item.budget ?? 0,
                      kpiLabel: item.kpiLabel ?? '',
                      maxDays: Math.max(1, item.length ?? duration),
                    })),
                  ]
                }
              }

              if (retroLinkSms) {
                const smsPlatform = smsType === 'sms' ? 'SMS' : 'RCS'
                const smsLength = Math.max(30, campaignMonthsNumber * 30)

                if (retroSmsPhases.length > 0) {
                  retroSmsPhases.forEach((phase, idx) => {
                    const phaseName = phase.name?.trim() || `Phase ${idx + 1}`
                    const key = `${smsPlatform}::${phaseName}`
                    const phaseLength =
                      Math.max(1, phase.defaultDays ?? Math.floor(smsLength / retroSmsPhases.length))

                    strategyPlatformKeys.add(key)
                    platformSources = [
                      ...platformSources,
                      {
                        platform: key,
                        budget: 0,
                        kpiLabel: '',
                        maxDays: Math.max(1, phaseLength),
                      },
                    ]
                    items = [
                      ...items,
                      {
                        platform: key,
                        startDay: 0,
                        length: Math.min(phaseLength, duration),
                        budget: 0,
                        kpiLabel: '',
                      },
                    ]
                  })
                } else {
                  strategyPlatformKeys.add(smsPlatform)
                  platformSources = [
                    ...platformSources,
                    { platform: smsPlatform, budget: 0, kpiLabel: '', maxDays: smsLength },
                  ]
                  items = [
                    ...items,
                    {
                      platform: smsPlatform,
                      startDay: 0,
                      length: Math.min(smsLength, duration),
                      budget: 0,
                      kpiLabel: '',
                    },
                  ]
                }
              }

              if (
                scratchPhases.length > 0 &&
                items.length > 0
              ) {
                const fallback = Math.max(
                  baseDuration,
                  retroLinkSocial ? activeRetroSocial.durationDays : retroDurationDays,
                  duration,
                )
                const horizonForSync = Math.max(
                  fallback,
                  ...items.map((it) => {
                    const w = desiredLengthFromRetroPhases(
                      it.platform,
                      scratchPhases,
                      fallback,
                    )
                    return it.startDay + (w ?? it.length)
                  }),
                )
                items = syncManualRetroItemLengthsFromPhases(
                  items,
                  scratchPhases,
                  horizonForSync,
                )
              }

              const mergedDuration = Math.max(
                retroLinkSocial ? activeRetroSocial.durationDays : retroDurationDays,
                duration,
                ...items.map((i) => i.startDay + i.length),
              )
              const existingFromForm: StrategyCalendarData = {
                startDate: defaultStart,
                duration: mergedDuration,
                items,
              }

              const hasItems = items.length > 0

              const handleSave = (data: StrategyCalendarData) => {
                const isSmsPlatform = (p: string) =>
                  p === 'SMS' ||
                  p === 'RCS' ||
                  p.startsWith('SMS::') ||
                  p.startsWith('RCS::')

                const retroItems = data.items.filter(
                  (i) => !strategyPlatformKeys.has(i.platform) && !isSmsPlatform(i.platform),
                )
                const saved: StrategyCalendarData = { ...data, items: retroItems, duration: data.duration }
                if (retroLinkSocial) {
                  patchRetroSocial(activeStrategyId, { calendarData: saved })
                } else {
                  setRetroCalendarData(saved)
                }
                if (retroItems.length > 0) {
                  if (retroLinkSocial) {
                    setRetroSocialByStrategy((prev) => {
                      const bundle = prev[activeStrategyId] ?? defaultRetroSocialState()
                      return {
                        ...prev,
                        [activeStrategyId]: {
                          ...bundle,
                          platformPhases: syncManualRetroPlatformPhasesFromItems(
                            bundle.platformPhases,
                            retroItems,
                          ),
                        },
                      }
                    })
                  } else {
                    setRetroPlatformPhases((prev) =>
                      syncManualRetroPlatformPhasesFromItems(prev, retroItems),
                    )
                  }
                }
              }

              return (
                  <StrategyCalendarBuilder
                    key={`retro-${existingFromForm.startDate}-${existingFromForm.duration}-${retroLinkSocial}-${retroLinkSms}-${retroLinkSocial ? activeStrategyId : 'na'}`}
                    platformSources={platformSources}
                    duration={existingFromForm.duration}
                    existing={existingFromForm}
                    fullWidth
                    twoMonths={mergedDuration <= 120}
                    forceTimeGranularity={mergedDuration > 120 ? 'week' : undefined}
                    headerTitle="Calendrier du rétroplanning"
                    headerDescription={
                      hasItems
                        ? 'Mois : légende + clic sur un jour. Semaines : barres à faire glisser ; vue jour : poignée droite pour la durée. Frise : une ligne de temps avec traits début/fin par plateforme. Tout s’enregistre automatiquement.'
                        : 'Configurez le paramétrage ci-dessus puis cliquez sur « Répartir sur le calendrier ». Vous pourrez ensuite ajuster les phases comme indiqué.'
                    }
                    exportPdf={{
                      filename: `Retroplanning_${defaultStart}_${mergedDuration}j.pdf`,
                      onExport: async () => {
                        const cal = useCalendarStore.getState().getCalendarData()
                        if (!cal.items.length) return
                        const block = strategies.find((s) => s.id === activeStrategyId)
                        retroPdfExportRef.current = async (
                          filename,
                          documentComment,
                          clientName,
                          options,
                        ) => {
                          const cal2 = useCalendarStore.getState().getCalendarData()
                          if (!cal2.items.length) return
                          await downloadRetroplanningPdf({
                            filename,
                            documentComment: documentComment.trim() || undefined,
                            personName: userName.trim() || userPseudo.trim() || '',
                            clientName: clientName.trim() || undefined,
                            linkSocial: retroLinkSocial,
                            linkSms: retroLinkSms,
                            smsType,
                            includeWeekTimeline: options.includeWeekTimeline,
                            includeMonthGrids: options.includeMonthGrids,
                            strategyLines:
                              retroLinkSocial && block?.items?.length
                                ? block.items.map((it) => ({
                                    platform: it.platform,
                                    objective: it.objective,
                                    budget: it.budget,
                                    estimatedKPIs: it.estimatedKPIs,
                                    days: it.days,
                                    aePercentage: it.aePercentage,
                                    customKpiLabel: it.customKpiLabel,
                                    dailyBudget: it.dailyBudget,
                                  }))
                                : undefined,
                            smsQuoteDetail: retroLinkSms
                              ? {
                                  volume: smsVolumeNumber,
                                  unitPrice: smsType === 'sms' ? smsUnitPrice : rcsUnitPrice,
                                  totalPrice: smsType === 'sms' ? smsTotalPrice : rcsTotalPrice,
                                  options:
                                    smsType === 'sms'
                                      ? {
                                          ciblage: smsOptions.ciblage,
                                          richSms: smsOptions.richSms,
                                          tarifIntermarche: smsOptions.tarifIntermarche,
                                          duplicateCampaign: smsOptions.duplicateCampaign,
                                        }
                                      : {
                                          ciblage: smsOptions.ciblage,
                                          baseClients: smsOptions.baseClients,
                                          agent: smsOptions.agent,
                                          creaByLink: smsOptions.creaByLink,
                                          tarifIntermarche: smsOptions.tarifIntermarche,
                                          duplicateCampaign: smsOptions.duplicateCampaign,
                                        },
                                  campaignMonths: smsOptions.duplicateCampaign ? campaignMonthsNumber : undefined,
                                  creaByLinkCount: smsType === 'rcs' ? creaByLinkCountNumber : undefined,
                                  comment: smsPdfComment.trim() || undefined,
                                  sendWaves: smsRcsPdfSendWaves.length > 0 ? smsRcsPdfSendWaves : undefined,
                                  imageBase64: smsPdfImage ?? undefined,
                                }
                              : undefined,
                            calendarData: cal2,
                          })
                        }
                        setRetroPdfFileName(`Retroplanning_${defaultStart}_${mergedDuration}j`)
                        setRetroPdfClientName('')
                        setRetroPdfComment('')
                        setRetroPdfIncludeWeekView(true)
                        setRetroPdfIncludeMonthView(true)
                        setRetroPdfDialogOpen(true)
                      },
                    }}
                    onSave={handleSave}
                    autoPersist
                    onPlatformStartDateChange={(entryKey, startDate) => {
                      const patchStrategyDates = (lineKey: string, date: string) => {
                        setDefineDatesPerStrategy((prev) => ({
                          ...prev,
                          [activeStrategyId]: {
                            ...(prev[activeStrategyId] ?? {}),
                            [lineKey]: date,
                          },
                        }))
                      }
                      const sub = entryKey.match(/^(.*)::p(\d+)$/)
                      if (sub && strategyPlatformKeys.has(entryKey)) {
                        const parentLine = sub[1]!
                        const idx = parseInt(sub[2]!, 10)
                        const block = strategies.find((s) => s.id === activeStrategyId)
                        const row = block?.items.find(
                          (it) => retroStrategyLineKey(it.platform, it.objective) === parentLine,
                        )
                        const stratDur = Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))
                        const totalDays = Math.max(1, row?.days ?? stratDur)
                        const splits = activeRetroSocial.socialLineSplits
                        const raw =
                          splits[parentLine] && splits[parentLine]!.length > 0
                            ? splits[parentLine]!
                            : [{ name: row?.objective ?? 'Phase', days: totalDays }]
                        const segs = rebalanceRetroSocialSegments(raw, totalDays)
                        let offset = 0
                        for (let i = 0; i < idx && i < segs.length; i++) offset += segs[i]!.days
                        const parentDate = addCalendarDays(startDate, -offset)
                        patchStrategyDates(parentLine, parentDate)
                        return
                      }
                      if (strategyPlatformKeys.has(entryKey)) {
                        patchStrategyDates(entryKey, startDate)
                      }
                    }}
                    onPlatformDaysChange={
                      retroLinkSocial && activeStrategyId
                        ? (entryKey, days) => {
                            const sub = entryKey.match(/^(.*)::p(\d+)$/)
                            if (sub && strategyPlatformKeys.has(entryKey)) {
                              const parentLine = sub[1]!
                              const idx = parseInt(sub[2]!, 10)
                              setRetroSocialByStrategy((prev) => {
                                const bundle = prev[activeStrategyId] ?? defaultRetroSocialState()
                                const block = strategies.find((s) => s.id === activeStrategyId)
                                const row = block?.items.find(
                                  (it) => retroStrategyLineKey(it.platform, it.objective) === parentLine,
                                )
                                if (!row) return prev
                                const stratDur = Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))
                                const totalDays = Math.max(1, row.days ?? stratDur)
                                const prevSplits = bundle.socialLineSplits
                                const raw =
                                  prevSplits[parentLine] && prevSplits[parentLine]!.length > 0
                                    ? prevSplits[parentLine]!
                                    : [{ name: row.objective, days: totalDays }]
                                const segs = [...rebalanceRetroSocialSegments(raw, totalDays)]
                                if (idx < 0 || idx >= segs.length) return prev
                                segs[idx] = { ...segs[idx]!, days: Math.max(1, days) }
                                return {
                                  ...prev,
                                  [activeStrategyId]: {
                                    ...bundle,
                                    socialLineSplits: {
                                      ...bundle.socialLineSplits,
                                      [parentLine]: rebalanceRetroSocialSegments(segs, totalDays),
                                    },
                                  },
                                }
                              })
                              return
                            }
                            if (!strategyPlatformKeys.has(entryKey)) return
                            setStrategies((prev) =>
                              prev.map((s) =>
                                s.id !== activeStrategyId
                                  ? s
                                  : {
                                      ...s,
                                      items: s.items.map((it) =>
                                        `${it.platform}::${it.objective}` !== entryKey
                                          ? it
                                          : {
                                              ...it,
                                              days,
                                              dailyBudget: (it.budget * (it.aePercentage / 100)) / days,
                                              aeCheckValue:
                                                it.platform === 'Spotify'
                                                  ? it.budget * (it.aePercentage / 100)
                                                  : (it.budget * (it.aePercentage / 100)) / days,
                                            },
                                      ),
                                    },
                              ),
                            )
                          }
                        : undefined
                    }
                  />
              )
            })()}
            </div>
          </div>
        )}

        {pdvSection === 'kpiMax' && (
          <KpiMaxPanel
            platformSelected={kpiMaxPlatformSelected}
            onPlatformSelected={setKpiMaxPlatformSelected}
            compteMeta={kpiMaxCompteMeta}
            onCompteMetaChange={setKpiMaxCompteMeta}
            compteLinkedin={kpiMaxCompteLinkedin}
            onCompteLinkedinChange={setKpiMaxCompteLinkedin}
            compteSnapchat={kpiMaxCompteSnapchat}
            onCompteSnapchatChange={setKpiMaxCompteSnapchat}
            compteTiktok={kpiMaxCompteTiktok}
            onCompteTiktokChange={setKpiMaxCompteTiktok}
            diffusionDays={kpiMaxDiffusionDays}
            onDiffusionDaysChange={setKpiMaxDiffusionDays}
          />
        )}

        {pdvSection === 'kpiMax2' && <KpiMax2Panel />}
      </div>

      {/* Modale Calendrier de diffusion — même UX que /vente (plage affichée, granularité, recalcul budget/KPIs) */}
      <Dialog
        open={calendarDialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            const sid = calendarStrategyId
            if (sid) {
              const st = useCalendarStore.getState()
              if (st.validate()) {
                const data = st.getCalendarData()
                setStrategies((prev) =>
                  prev.map((s) => (s.id === sid ? { ...s, calendar: data } : s)),
                )
              }
            }
            setCalendarStrategyId(null)
            setCalendarPhasesMenuPlatform(null)
            setCalendarDisplayStart('')
            setCalendarDisplayDuration(90)
          }
          setCalendarDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Calendrier stratégique</DialogTitle>
            <DialogDescription>
              Définissez d’abord la <strong>plage du calendrier</strong> (date de début + nombre de jours), puis la vue
              Mois ou Semaines. Dans la légende, le champ « Jours » ou la poignée sur la frise met à jour la stratégie,
              le budget et les KPIs.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {calendarStrategyId && (() => {
              const block = strategies.find((s) => s.id === calendarStrategyId)
              if (!block) return null
              if (block.items.length === 0) {
                return (
                  <p className="text-sm text-muted-foreground">
                    Ajoutez au moins une ligne à cette stratégie pour afficher le calendrier.
                  </p>
                )
              }
              const datesMap = defineDatesPerStrategy[calendarStrategyId] ?? {}
              const { platformSources, items, contentSpan, globalStart, timelineStartResolved } =
                computeVenteStrategyCalendarItems(
                  block,
                  datesMap,
                  diffusionDays,
                  calendarDisplayStart,
                )
              const effectiveDuration = Math.max(
                Math.max(1, Math.floor(Number(calendarDisplayDuration)) || 1),
                contentSpan,
              )
              const existingFromForm: StrategyCalendarData = {
                startDate: timelineStartResolved,
                duration: effectiveDuration,
                items,
              }
              const firstDiffusionLabel = new Date(globalStart + 'T12:00:00').toLocaleDateString('fr-FR')
              const displayEndIso = addCalendarDays(timelineStartResolved, effectiveDuration - 1)
              const displayEndLabel = new Date(displayEndIso + 'T12:00:00').toLocaleDateString('fr-FR')
              const sid = calendarStrategyId
              return (
                <>
                  <p className="text-sm text-muted-foreground">
                    Première diffusion de la stratégie :{' '}
                    <span className="font-medium text-foreground">{firstDiffusionLabel}</span>. La date de début de
                    plage ne peut pas être après cette date ; vous pouvez la <strong>reculer</strong> (date plus tôt)
                    pour afficher des jours avant le début des diffusions.
                  </p>
                  <StrategyCalendarBuilder
                    key={`${calendarStrategyId}-${timelineStartResolved}-${effectiveDuration}`}
                    showGranularitySelector
                    platformSources={platformSources}
                    duration={existingFromForm.duration}
                    existing={existingFromForm}
                    children={
                      <div className="rounded-xl border-2 border-[#E94C16]/25 bg-[#E94C16]/5 px-3 py-3 space-y-3">
                        <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-foreground">
                          <CalendarRange className="h-3.5 w-3.5 text-[#E94C16]" aria-hidden />
                          Plage affichée sur le calendrier
                        </div>
                        <p className="text-[11px] text-muted-foreground leading-relaxed">
                          Période visible (grille mois + frise) :{' '}
                          <span className="font-medium text-foreground tabular-nums">
                            {new Date(timelineStartResolved + 'T12:00:00').toLocaleDateString('fr-FR')} →{' '}
                            {displayEndLabel}
                          </span>{' '}
                          — <span className="tabular-nums">{effectiveDuration} j</span>
                        </p>
                        <div className="flex flex-wrap items-end gap-3">
                          <div className="space-y-1.5 min-w-[11rem]">
                            <Label htmlFor="strategy-cal-start-v2" className="text-xs">
                              Date de début d’affichage
                            </Label>
                            <Input
                              id="strategy-cal-start-v2"
                              type="date"
                              value={timelineStartResolved}
                              onChange={(e) => {
                                const v = e.target.value
                                if (!v) return
                                setCalendarDisplayStart(v > globalStart ? globalStart : v)
                              }}
                              className="h-10 text-sm"
                            />
                          </div>
                          <div className="space-y-1.5 w-[9.5rem]">
                            <Label htmlFor="strategy-cal-dur-v2" className="text-xs">
                              Nombre de jours affichés
                            </Label>
                            <Input
                              id="strategy-cal-dur-v2"
                              type="number"
                              min={1}
                              max={730}
                              value={calendarDisplayDuration}
                              onChange={(e) => {
                                const n = Math.max(1, Math.min(730, Math.floor(Number(e.target.value) || 1)))
                                setCalendarDisplayDuration(n)
                              }}
                              className="h-10 text-sm tabular-nums text-center"
                            />
                          </div>
                        </div>
                        {calendarDisplayDuration < contentSpan ? (
                          <p className="text-[11px] text-amber-800 dark:text-amber-100/90">
                            Durée minimale pour couvrir toutes les phases : {contentSpan} jour(s) (la frise utilise au
                            moins cette valeur).
                          </p>
                        ) : null}
                      </div>
                    }
                    onPlatformStartDateChange={(entryKey, startDate) =>
                      setDefineDatesPerStrategy((prev) => ({
                        ...prev,
                        [sid]: {
                          ...(prev[sid] ?? {}),
                          [entryKey]: startDate,
                        },
                      }))
                    }
                    onPlatformDaysChange={(entryKey, days) => {
                      setStrategies((prev) =>
                        prev.map((s) => {
                          if (s.id !== sid) return s
                          const td = tarifsDirection
                          const nextItems = s.items.map((it) =>
                            `${it.platform}::${it.objective}` !== entryKey
                              ? it
                              : applyStrategyItemDaysChange(it, days, calculationMode, it.tarifsDirection ?? td),
                          )
                          const updatedLine = nextItems.find(
                            (it) => `${it.platform}::${it.objective}` === entryKey,
                          )
                          const cal = s.calendar
                          const nextCalendar =
                            cal && isStrategyCalendarData(cal) && updatedLine
                              ? {
                                  ...cal,
                                  items: cal.items.map((calIt) => {
                                    const calKey = String(calIt.platform).includes('::')
                                      ? calIt.platform
                                      : `${calIt.platform}::${(calIt.objective ?? '').trim()}`
                                    if (calKey !== entryKey) return calIt
                                    const kpiLabel = updatedLine.customKpiLabel
                                      ? updatedLine.customKpiLabel
                                      : updatedLine.estimatedKPIs > 0
                                        ? `${updatedLine.estimatedKPIs.toLocaleString('fr-FR')} ${getKpiUnitLabel(updatedLine.objective)}`
                                        : getMaxKpiLabel(updatedLine.objective)
                                    return {
                                      ...calIt,
                                      length: days,
                                      budget: updatedLine.budget,
                                      kpiLabel,
                                    }
                                  }),
                                }
                              : cal
                          return { ...s, items: nextItems, calendar: nextCalendar }
                        }),
                      )
                    }}
                    calendarWarnings={getCalendarWarningsForBlock(block)}
                  />
                </>
              )
            })()}
          </div>
          {/* La fermeture de la modale enregistre le calendrier dans la stratégie si la validation passe. */}
        </DialogContent>
      </Dialog>

      {/* Modale option Make — Meta Leads / LinkedIn Leads (obligatoire avant ajout) */}
      <AlertDialog
        open={makeLeadsModalOpen}
        onOpenChange={(open) => {
          if (open) setMakeLeadsModalOpen(true)
        }}
      >
        <AlertDialogContent className="z-[100]">
          <AlertDialogHeader>
            <AlertDialogTitle>Envoi automatique des leads via Make</AlertDialogTitle>
            <AlertDialogDescription>
              Souhaitez-vous proposer au client l&apos;option d&apos;envoi automatique des leads via Make
              ({MAKE_LEADS_OPTION_BUDGET.toLocaleString('fr-FR')} € HT) ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="gap-2 sm:gap-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleMakeLeadsChoice(false)}
              className="flex-1 sm:flex-none"
            >
              Non
            </Button>
            <Button
              type="button"
              onClick={() => handleMakeLeadsChoice(true)}
              className="flex-1 sm:flex-none bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              Oui
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Modale pour export PDF */}
      <Dialog open={pdfDialogOpen} onOpenChange={setPdfDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le PDF</DialogTitle>
            <DialogDescription>
              Veuillez renseigner le nom du client pour générer le document PDF.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="client-name">Nom du client *</Label>
              <EditableInput
                id="client-name"
                placeholder="Ex: Entreprise ABC"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && clientName.trim()) {
                    handleExportPDF()
                  }
                }}
              />
            </div>
            <div className="flex items-start space-x-2 pt-1">
              <Checkbox
                id="pdf-include-ae"
                checked={pdfIncludeAe}
                onCheckedChange={(checked) => setPdfIncludeAe(checked === true)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor="pdf-include-ae"
                  className="text-sm font-medium text-foreground cursor-pointer"
                >
                  Afficher l&apos;AE dans le PDF
                </label>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  % AE de la stratégie dans le récapitulatif. Décochez pour masquer cet élément.
                </p>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPdfDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={handleExportPDF}
              disabled={!clientName.trim()}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale pack ZIP global (Social + SMS/RCS + Rétro + KPIs max) */}
      <Dialog
        open={globalPackDialogOpen}
        onOpenChange={(open) => {
          setGlobalPackDialogOpen(open)
          if (!open && !globalPackExporting) {
            setGlobalPackClientName('')
            setGlobalPackComment('')
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le pack complet (ZIP)</DialogTitle>
            <DialogDescription>
              Chaque PDF suit les mêmes règles que les exports unitaires : stratégies Social (nom et commentaire comme
              pour « Télécharger le PDF »), devis SMS/RCS seulement si les conditions des boutons de l’onglet SMS sont
              remplies, rétroplanning avec les vues et libellés de la modale d’export rétro (nom client rétro prioritaire
              s’il est renseigné), KPIs max. Les exclusions sont détaillées dans LISEZMOI.txt.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="global-pack-client">Nom du client *</Label>
              <EditableInput
                id="global-pack-client"
                placeholder="Ex: Entreprise ABC"
                value={globalPackClientName}
                onChange={(e) => setGlobalPackClientName(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && globalPackClientName.trim() && !globalPackExporting) {
                    void handleGlobalPackExport()
                  }
                }}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="global-pack-comment">Commentaire (optionnel)</Label>
              <EditableInput
                id="global-pack-comment"
                placeholder="Ex: Brief Q1 2026"
                value={globalPackComment}
                onChange={(e) => setGlobalPackComment(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setGlobalPackDialogOpen(false)}
              disabled={globalPackExporting}
            >
              Annuler
            </Button>
            <Button
              onClick={() => void handleGlobalPackExport()}
              disabled={!globalPackClientName.trim() || globalPackExporting}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              {globalPackExporting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Génération…
                </>
              ) : (
                <>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger le ZIP
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale pour Validation TM */}
      <Dialog open={validationTMDialogOpen} onOpenChange={setValidationTMDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Validation TM</DialogTitle>
            <DialogDescription>
              Envoyez la stratégie sur Slack pour validation. Le PDF sera généré et partagé.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="validation-message">Message *</Label>
              <EditableInput
                id="validation-message"
                placeholder="Votre message pour la validation..."
                value={validationMessage}
                onChange={(e) => setValidationMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-name-tm">Nom du client (optionnel)</Label>
              <EditableInput
                id="client-name-tm"
                placeholder="Ex: Entreprise ABC"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setValidationTMDialogOpen(false)} disabled={sendingToSlack}>
              Annuler
            </Button>
            <Button
              onClick={handleValidationTM}
              disabled={!validationMessage.trim() || sendingToSlack}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              {sendingToSlack ? 'Envoi...' : 'Envoyer sur Slack'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale export PDF rétroplanning */}
      <Dialog
        open={retroPdfDialogOpen}
        onOpenChange={(open) => {
          setRetroPdfDialogOpen(open)
          if (!open) {
            setRetroPdfFileName('')
            setRetroPdfClientName('')
            setRetroPdfComment('')
            setRetroPdfIncludeWeekView(true)
            setRetroPdfIncludeMonthView(true)
            retroPdfExportRef.current = null
          }
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le rétroplanning en PDF</DialogTitle>
            <DialogDescription>
              Choisissez les vues à inclure (frise en semaines et / ou calendrier par mois), puis renseignez le client,
              le fichier et un commentaire optionnel pour l’en-tête. Le document est entièrement en paysage ; la vue
              mois affiche deux mois côte à côte par page.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-3 rounded-md border bg-muted/30 p-3">
              <p className="text-sm font-medium">Contenu du PDF</p>
              <p className="text-xs text-muted-foreground">
                Cochez une ou les deux vues. Au moins une option doit rester cochée.
              </p>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="retro-pdf-view-week"
                  checked={retroPdfIncludeWeekView}
                  onCheckedChange={(c) => {
                    const next = c === true
                    if (!next && !retroPdfIncludeMonthView) return
                    setRetroPdfIncludeWeekView(next)
                  }}
                />
                <Label htmlFor="retro-pdf-view-week" className="text-sm font-normal cursor-pointer">
                  Vue semaines (frise type Gantt)
                </Label>
              </div>
              <div className="flex items-center gap-2">
                <Checkbox
                  id="retro-pdf-view-month"
                  checked={retroPdfIncludeMonthView}
                  onCheckedChange={(c) => {
                    const next = c === true
                    if (!next && !retroPdfIncludeWeekView) return
                    setRetroPdfIncludeMonthView(next)
                  }}
                />
                <Label htmlFor="retro-pdf-view-month" className="text-sm font-normal cursor-pointer">
                  Vue mois (2 mois par page, pastilles par phase)
                </Label>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retro-pdf-client">Nom du client *</Label>
              <EditableInput
                id="retro-pdf-client"
                placeholder="Ex : Entreprise ABC"
                value={retroPdfClientName}
                onChange={(e) => setRetroPdfClientName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Sera affiché dans le titre « Planning de diffusion » du diagramme.
              </p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="retro-pdf-filename">Nom du fichier *</Label>
              <EditableInput
                id="retro-pdf-filename"
                placeholder="Ex: Retroplanning-client"
                value={retroPdfFileName}
                onChange={(e) => setRetroPdfFileName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="retro-pdf-comment">Commentaire (optionnel)</Label>
              <EditableInput
                id="retro-pdf-comment"
                placeholder="Ex: Campagne Q1 2026"
                value={retroPdfComment}
                onChange={(e) => setRetroPdfComment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Affiché sous le nom en tête de la première page exportée (frise ou calendrier).
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setRetroPdfDialogOpen(false)
                setRetroPdfFileName('')
                setRetroPdfClientName('')
                setRetroPdfComment('')
                setRetroPdfIncludeWeekView(true)
                setRetroPdfIncludeMonthView(true)
                retroPdfExportRef.current = null
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmRetroPdf}
              disabled={
                !retroPdfFileName.trim() ||
                !retroPdfClientName.trim() ||
                (!retroPdfIncludeWeekView && !retroPdfIncludeMonthView)
              }
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale pour export PDF SMS/RCS */}
      <Dialog open={smsPdfDialogOpen} onOpenChange={setSmsPdfDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le devis {currentSmsType === 'sms' ? 'SMS' : 'RCS'}</DialogTitle>
            <DialogDescription>
              Choisissez le nom du fichier et, si besoin, joignez une image. Le commentaire se saisit sous le devis.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Nom du fichier */}
            <div className="space-y-2">
              <Label htmlFor="pdf-filename">Nom du fichier *</Label>
              <EditableInput
                id="pdf-filename"
                placeholder={`Ex: devis-${currentSmsType}-client`}
                value={smsPdfFileName}
                onChange={(e) => setSmsPdfFileName(e.target.value)}
              />
            </div>

            {/* Upload image */}
            <div className="space-y-2">
              <Label htmlFor="pdf-image">Joindre une image (optionnel)</Label>
              <Input
                id="pdf-image"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
              />
              <p className="text-xs text-muted-foreground">
                Joignez les potentiels calculés dans vos outils (capture d'écran, graphique, etc.)
              </p>
              {smsPdfImage && (
                <div className="mt-2">
                  <p className="text-xs text-green-600 font-medium">✓ Image chargée</p>
                </div>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setSmsPdfDialogOpen(false)
                setSmsPdfFileName('')
                setSmsPdfImage(null)
              }}
            >
              Annuler
            </Button>
            <Button
              onClick={handleConfirmSMSRCSPDF}
              disabled={!smsPdfFileName.trim()}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              <Download className="h-4 w-4 mr-2" />
              Télécharger le PDF
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale enregistrement devis dans l'espace personnel */}
      <Dialog open={saveDevisDialogOpen} onOpenChange={setSaveDevisDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {savedDevisId ? 'Mettre à jour le devis' : 'Enregistrer le devis'}
            </DialogTitle>
            <DialogDescription>
              Le devis sera sauvegardé dans votre espace personnel. Seul vous pourrez y accéder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-devis-name">Nom du devis *</Label>
              <EditableInput
                id="save-devis-name"
                placeholder="Ex. Devis SMS Client X"
                value={saveDevisNameInput}
                onChange={(e) => setSaveDevisNameInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveDevisDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => void handleConfirmSaveDevis()}
              disabled={!saveDevisNameInput.trim() || savingDevis}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              {savingDevis ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {savedDevisId ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modale enregistrement stratégie Social media dans l'espace personnel */}
      <Dialog open={saveStrategyDialogOpen} onOpenChange={setSaveStrategyDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {savedStrategyId ? 'Mettre à jour la stratégie' : 'Enregistrer la stratégie'}
            </DialogTitle>
            <DialogDescription>
              La stratégie sera sauvegardée dans votre espace personnel. Seul vous pourrez y accéder.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="save-strategy-name">Nom de la stratégie *</Label>
              <EditableInput
                id="save-strategy-name"
                placeholder="Ex. Stratégie Client X"
                value={saveStrategyNameInput}
                onChange={(e) => setSaveStrategyNameInput(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setSaveStrategyDialogOpen(false)}>
              Annuler
            </Button>
            <Button
              onClick={() => void handleConfirmSaveStrategy()}
              disabled={!saveStrategyNameInput.trim() || savingStrategy}
              className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
            >
              {savingStrategy ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {savedStrategyId ? 'Mettre à jour' : 'Enregistrer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
