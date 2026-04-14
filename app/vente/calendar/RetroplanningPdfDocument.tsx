'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import type { CalendarItem, StrategyCalendarData } from './types'
import { getDatesFromStart, getDayIndex } from '@/lib/utils/calendarEngine'
import { getPhaseIndexByPlatformKey, getPlatformPhaseColor } from './colors'
import { calendarItemsForDisplayGrouped } from './calendarDisplayItems'

const WEEKDAYS_PDF = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

function isPlatformActiveOnDayPdf(item: CalendarItem, dayIndex: number, duration: number): boolean {
  return (
    dayIndex >= 0 &&
    dayIndex < duration &&
    dayIndex >= item.startDay &&
    dayIndex < item.startDay + item.length
  )
}

function eachCalendarMonthInRange(startIso: string, duration: number): { year: number; month: number }[] {
  const dates = getDatesFromStart(startIso, Math.max(1, duration))
  const lastIso = dates[dates.length - 1] ?? startIso
  const start = new Date(startIso + 'T12:00:00')
  const end = new Date(lastIso + 'T12:00:00')
  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return []
  let y = start.getFullYear()
  let m = start.getMonth() + 1
  const endY = end.getFullYear()
  const endM = end.getMonth() + 1
  const out: { year: number; month: number }[] = []
  while (y < endY || (y === endY && m <= endM)) {
    out.push({ year: y, month: m })
    m += 1
    if (m > 12) {
      m = 1
      y += 1
    }
  }
  return out
}

function buildMonthGridSlots(
  year: number,
  month: number,
  planningStart: string,
): { day: number | null; dateStr: string; dayIndex: number }[] {
  const firstDay = new Date(year, month - 1, 1)
  const lastDay = new Date(year, month, 0).getDate()
  const startOffset = (firstDay.getDay() + 6) % 7
  const slots: { day: number | null; dateStr: string; dayIndex: number }[] = []
  for (let i = 0; i < startOffset; i++) {
    slots.push({ day: null, dateStr: '', dayIndex: -1 })
  }
  for (let d = 1; d <= lastDay; d++) {
    const dateStr = `${year}-${String(month).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const dayIndex = getDayIndex(dateStr, planningStart)
    slots.push({ day: d, dateStr, dayIndex })
  }
  while (slots.length < 42) {
    slots.push({ day: null, dateStr: '', dayIndex: -1 })
  }
  return slots.slice(0, 42)
}

const styles = StyleSheet.create({
  page: {
    padding: 28,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
  },
  mainTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 14,
    lineHeight: 1.4,
  },
  documentComment: {
    fontSize: 10,
    color: '#4b5563',
    marginBottom: 12,
    lineHeight: 1.45,
    fontStyle: 'italic',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#E94C16',
    marginBottom: 8,
    marginTop: 4,
  },
  encart: {
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#E94C16',
    marginBottom: 14,
  },
  tableHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingBottom: 4,
    marginBottom: 4,
  },
  th: {
    fontSize: 7,
    fontWeight: 'bold',
    color: '#6b7280',
    textTransform: 'uppercase',
  },
  row: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
    paddingVertical: 5,
  },
  cell: {
    fontSize: 8,
    color: '#111827',
  },
  colPlat: { width: '14%' },
  colObj: { width: '18%' },
  colBud: { width: '14%' },
  colKpi: { width: '16%' },
  colDays: { width: '10%' },
  colAe: { width: '10%' },
  colDaily: { width: '18%' },
  /** Page Gantt paysage */
  ganttPage: {
    padding: 22,
    fontSize: 10,
    fontFamily: 'Helvetica',
    backgroundColor: '#f8fafc',
    color: '#1a1a1a',
  },
  ganttTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94C16',
    marginBottom: 4,
  },
  ganttSubtitle: {
    fontSize: 10,
    color: '#475569',
    marginBottom: 14,
  },
  ganttAxisRow: {
    flexDirection: 'row',
    marginBottom: 0,
  },
  ganttLabelHeader: {
    width: 148,
    paddingRight: 8,
    paddingBottom: 6,
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
  },
  ganttAxisHeader: {
    flex: 1,
    borderBottomWidth: 2,
    borderBottomColor: '#1e293b',
    paddingBottom: 6,
    position: 'relative',
  },
  ganttAxisTicks: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 2,
  },
  ganttAxisTick: {
    fontSize: 8,
    color: '#64748b',
    fontWeight: 'bold',
  },
  ganttGridBg: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  ganttGridLine: {
    width: 1,
    backgroundColor: '#e2e8f0',
    opacity: 0.9,
  },
  ganttRow: {
    flexDirection: 'row',
    alignItems: 'stretch',
    minHeight: 34,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  ganttRowAlt: {
    backgroundColor: '#f1f5f9',
  },
  ganttLabelCell: {
    width: 148,
    paddingRight: 8,
    paddingVertical: 8,
    justifyContent: 'center',
    borderRightWidth: 1,
    borderRightColor: '#cbd5e1',
  },
  ganttLabelMain: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  ganttLabelSub: {
    fontSize: 7,
    color: '#64748b',
    marginTop: 3,
  },
  ganttTrackCell: {
    flex: 1,
    paddingVertical: 6,
    paddingLeft: 4,
    justifyContent: 'center',
    position: 'relative',
  },
  ganttTrack: {
    height: 18,
    backgroundColor: '#e2e8f0',
    borderRadius: 4,
    position: 'relative',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  ganttBar: {
    position: 'absolute',
    top: 2,
    bottom: 2,
    borderRadius: 3,
  },
  footerNote: {
    marginTop: 16,
    fontSize: 8,
    color: '#9ca3af',
    lineHeight: 1.35,
  },
  smsSubheading: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#374151',
    marginBottom: 6,
    marginTop: 2,
  },
  smsRow: {
    flexDirection: 'row',
    marginBottom: 3,
    alignItems: 'flex-start',
  },
  smsLabel: {
    width: '48%',
    fontSize: 8,
    color: '#4b5563',
  },
  smsValue: {
    flex: 1,
    fontSize: 8,
    color: '#111827',
  },
  smsSeparator: {
    marginTop: 6,
    paddingTop: 6,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  smsCondLine: {
    fontSize: 7,
    color: '#374151',
    marginBottom: 2,
  },
  monthGridPage: {
    padding: 20,
    fontSize: 9,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
    color: '#1a1a1a',
  },
  monthPairRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  monthColumn: {
    width: '48%',
  },
  monthColCaption: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#334155',
    marginBottom: 5,
  },
  monthGridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#E94C16',
    marginBottom: 4,
  },
  monthGridSubtitle: {
    fontSize: 9,
    color: '#64748b',
    marginBottom: 12,
  },
  monthWeekHeaderRow: {
    flexDirection: 'row',
    marginBottom: 4,
    borderBottomWidth: 1,
    borderBottomColor: '#cbd5e1',
    paddingBottom: 4,
  },
  monthWeekHeaderCell: {
    width: '14.28%',
    textAlign: 'center',
    fontSize: 7,
    fontWeight: 'bold',
    color: '#64748b',
  },
  monthGridRow: {
    flexDirection: 'row',
  },
/** Cellule jour : ~1/7 de la largeur (demi-page en paysage = 1 mois) */
  monthDayCell: {
    width: '14.28%',
    minHeight: 34,
    borderWidth: 0.5,
    borderColor: '#e2e8f0',
    padding: 3,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  monthDayCellMuted: {
    backgroundColor: '#f8fafc',
  },
  monthDayCellInPlan: {
    backgroundColor: '#ffffff',
  },
  monthDayCellActive: {
    backgroundColor: '#f1f5f9',
  },
  monthDayNum: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  monthDayNumFaint: {
    fontSize: 8,
    color: '#94a3b8',
  },
  monthDotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: 4,
  },
  monthDot: {
    width: 5,
    height: 5,
    borderRadius: 2,
  },
  monthLegendBlock: {
    marginTop: 10,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  monthLegendTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    color: '#475569',
    marginBottom: 6,
  },
  monthLegendLine: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  monthLegendDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  monthLegendLabel: {
    fontSize: 7,
    color: '#334155',
    flex: 1,
  },
})

function formatDateShort(iso: string): string {
  if (!iso) return '–'
  const [y, m, day] = iso.split('-')
  return `${day}/${m}/${(y ?? '').slice(2)}`
}

function normalizePdfText(s: string): string {
  return s
    .replace(/\u202F/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2007/g, ' ')
    .replace(/\u2009/g, ' ')
}

function itemDisplayLabel(item: CalendarItem): string {
  if (item.platform.includes('::')) {
    const [p, ...rest] = item.platform.split('::')
    return `${p} – ${rest.join(' – ')}`
  }
  return item.objective ? `${item.platform} – ${item.objective}` : item.platform
}

function capitalizeFrMonthLabel(label: string): string {
  const t = label.trim()
  if (!t) return t
  return t.charAt(0).toUpperCase() + t.slice(1)
}

/** Un mois : entête jours + grille 6×7 (pour PDF vue mois, 2 colonnes par page paysage). */
function MonthCalendarBlockPdf({
  ym,
  data,
  duration,
  displayItems,
  phaseIndexMap,
}: {
  ym: { year: number; month: number }
  data: StrategyCalendarData
  duration: number
  displayItems: CalendarItem[]
  phaseIndexMap: Map<string, number>
}) {
  const slots = buildMonthGridSlots(ym.year, ym.month, data.startDate)
  const monthTitleLong = capitalizeFrMonthLabel(
    new Date(ym.year, ym.month - 1, 1).toLocaleDateString('fr-FR', {
      month: 'long',
      year: 'numeric',
    }),
  )

  return (
    <View style={styles.monthColumn}>
      <Text style={styles.monthColCaption}>{normalizePdfText(monthTitleLong)}</Text>
      <View style={styles.monthWeekHeaderRow}>
        {WEEKDAYS_PDF.map((wd) => (
          <View key={wd} style={{ width: '14.28%', alignItems: 'center' }}>
            <Text style={styles.monthWeekHeaderCell}>{wd}</Text>
          </View>
        ))}
      </View>
      {Array.from({ length: 6 }, (_, row) => (
        <View key={row} style={styles.monthGridRow} wrap={false}>
          {slots.slice(row * 7, row * 7 + 7).map((slot, ci) => {
            if (slot.day == null) {
              return <View key={ci} style={[styles.monthDayCell, styles.monthDayCellMuted]} wrap={false} />
            }
            const activePlatforms = displayItems.filter((item) =>
              isPlatformActiveOnDayPdf(item, slot.dayIndex, duration),
            )
            const inPlanningRange = slot.dayIndex >= 0 && slot.dayIndex < duration
            const cellStyles = [
              styles.monthDayCell,
              inPlanningRange ? styles.monthDayCellInPlan : styles.monthDayCellMuted,
              ...(activePlatforms.length > 0 ? [styles.monthDayCellActive] : []),
            ]
            return (
              <View key={ci} style={cellStyles} wrap={false}>
                <Text style={inPlanningRange ? styles.monthDayNum : styles.monthDayNumFaint}>{slot.day}</Text>
                {activePlatforms.length > 0 ? (
                  <View style={styles.monthDotsRow}>
                    {activePlatforms.map((item) => {
                      const phaseIndex = phaseIndexMap.get(item.platform) ?? 0
                      const color = getPlatformPhaseColor(item.platform, phaseIndex)
                      return (
                        <View
                          key={item.platform}
                          style={[styles.monthDot, { backgroundColor: color, marginHorizontal: 1 }]}
                        />
                      )
                    })}
                  </View>
                ) : null}
              </View>
            )
          })}
        </View>
      ))}
    </View>
  )
}

export interface RetroplanningStrategyLinePdf {
  platform: string
  objective: string
  budget: number
  estimatedKPIs: number
  days: number
  aePercentage: number
  customKpiLabel?: string
  dailyBudget: number
}

/** Même contenu que le PDF devis SMS / RCS (onglet SMS) */
export interface RetroplanningSmsQuotePdf {
  volume: number
  unitPrice: number
  totalPrice: number
  options: {
    ciblage?: boolean
    richSms?: boolean
    agent?: boolean
    creaByLink?: boolean
    tarifIntermarche?: boolean
    duplicateCampaign?: boolean
  }
  campaignMonths?: number
  creaByLinkCount?: number
  comment?: string
  imageBase64?: string | null
}

export interface RetroplanningPdfPayload {
  filename: string
  /** Commentaire optionnel affiché en tête de la première page exportée */
  documentComment?: string
  /** Nom affiché dans l’entête du PDF */
  personName: string
  /** Nom client (pop-up export) : affiché dans le titre « Planning de diffusion » du Gantt */
  clientName?: string
  linkSocial: boolean
  linkSms: boolean
  smsType: 'sms' | 'rcs'
  strategyLines?: RetroplanningStrategyLinePdf[]
  /** Si lien SMS/RCS : reprise du devis (prix, options, conditions) */
  smsQuoteDetail?: RetroplanningSmsQuotePdf
  calendarData: StrategyCalendarData
  /** Inclure la frise (vue semaines). défaut : true */
  includeWeekTimeline?: boolean
  /** Inclure le calendrier par mois. défaut : true */
  includeMonthGrids?: boolean
}

const GANTT_ROWS_PER_PAGE = 12

function GanttVerticalGuides() {
  return (
    <>
      <View style={{ position: 'absolute', left: '25%', top: 0, bottom: 0, width: 1, backgroundColor: '#cbd5e1' }} />
      <View style={{ position: 'absolute', left: '50%', top: 0, bottom: 0, width: 1, backgroundColor: '#cbd5e1' }} />
      <View style={{ position: 'absolute', left: '75%', top: 0, bottom: 0, width: 1, backgroundColor: '#cbd5e1' }} />
    </>
  )
}

export type RetroplanningPdfMetaHeader = {
  personName: string
  documentComment?: string
}

function GanttLandscapePages({
  data,
  clientLabel,
  metaHeader,
}: {
  data: StrategyCalendarData
  /** Nom client affiché après « Planning de diffusion » */
  clientLabel?: string
  /** Entête (nom + commentaire) uniquement sur la première page du PDF */
  metaHeader?: RetroplanningPdfMetaHeader | null
}) {
  const planningTitleBase =
    clientLabel?.trim() !== ''
      ? `Planning de diffusion ${normalizePdfText(clientLabel!.trim())}`
      : 'Planning de diffusion'
  const dates = getDatesFromStart(data.startDate, data.duration)
  const formatDay = (idx: number) => {
    const d = dates[idx]
    return d ? formatDateShort(d) : '–'
  }
  const maxDur = Math.max(1, data.duration)
  const phaseIndexMap = getPhaseIndexByPlatformKey(data.items)
  const allItems = data.items

  const tickIndices = [
    0,
    Math.floor(maxDur * 0.25),
    Math.floor(maxDur * 0.5),
    Math.floor(maxDur * 0.75),
    maxDur - 1,
  ]
  const uniqueTicks = [...new Set(tickIndices)].sort((a, b) => a - b)

  const chunks: (typeof allItems)[] = []
  for (let i = 0; i < allItems.length; i += GANTT_ROWS_PER_PAGE) {
    chunks.push(allItems.slice(i, i + GANTT_ROWS_PER_PAGE))
  }

  return (
    <>
      {chunks.map((chunk, pageIdx) => (
        <Page key={`gantt-${pageIdx}`} size="A4" orientation="landscape" style={styles.ganttPage}>
          {pageIdx === 0 ? (
            <>
              {metaHeader ? (
                <>
                  <Text style={{ fontSize: 10, color: '#334155', marginBottom: 4 }}>
                    Rétroplanning — {normalizePdfText(metaHeader.personName.trim() || 'Non renseigné')}
                  </Text>
                  {metaHeader.documentComment?.trim() ? (
                    <Text
                      style={{
                        fontSize: 9,
                        fontStyle: 'italic',
                        color: '#64748b',
                        marginBottom: 10,
                        lineHeight: 1.35,
                      }}
                    >
                      {normalizePdfText(metaHeader.documentComment.trim())}
                    </Text>
                  ) : null}
                </>
              ) : null}
              <Text style={{ fontSize: 11, fontWeight: 'bold', color: '#94a3b8', marginBottom: 6 }}>
                Vue semaines (frise)
              </Text>
              <Text style={styles.ganttTitle}>{planningTitleBase}</Text>
              <Text style={styles.ganttSubtitle}>
                Période : du {formatDay(0)} au {formatDay(maxDur - 1)} · {maxDur} jours
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.ganttTitle}>{planningTitleBase} (suite)</Text>
              <Text style={styles.ganttSubtitle}>
                Lignes {pageIdx * GANTT_ROWS_PER_PAGE + 1} à {Math.min((pageIdx + 1) * GANTT_ROWS_PER_PAGE, allItems.length)} sur {allItems.length}
              </Text>
            </>
          )}

          <View style={styles.ganttAxisRow}>
            <View style={styles.ganttLabelHeader}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155' }}>Phase</Text>
            </View>
            <View style={styles.ganttAxisHeader}>
              <View style={styles.ganttAxisTicks}>
                {uniqueTicks.map((idx) => (
                  <Text key={idx} style={styles.ganttAxisTick}>
                    {formatDay(idx)}
                  </Text>
                ))}
              </View>
            </View>
          </View>

          {chunk.map((item, rowIdx) => {
            const globalIndex = pageIdx * GANTT_ROWS_PER_PAGE + rowIdx
            const phaseIndex = phaseIndexMap.get(item.platform) ?? 0
            const color = getPlatformPhaseColor(item.platform, phaseIndex)
            const label = itemDisplayLabel(item)
            const pLeft = (item.startDay / maxDur) * 100
            const pWidth = Math.max((item.length / maxDur) * 100, 0.35)
            const alt = globalIndex % 2 === 1

            return (
              <View
                key={`${item.platform}-${globalIndex}`}
                style={[styles.ganttRow, alt ? styles.ganttRowAlt : {}]}
                wrap={false}
              >
                <View style={styles.ganttLabelCell}>
                  <Text style={styles.ganttLabelMain}>{label}</Text>
                  <Text style={styles.ganttLabelSub}>
                    {formatDay(item.startDay)} → {formatDay(item.startDay + item.length - 1)} · {item.length} j
                  </Text>
                </View>
                <View style={styles.ganttTrackCell}>
                  <View style={styles.ganttTrack}>
                    <GanttVerticalGuides />
                    <View
                      style={[
                        styles.ganttBar,
                        {
                          left: `${pLeft}%`,
                          width: `${pWidth}%`,
                          backgroundColor: color,
                        },
                      ]}
                    />
                  </View>
                </View>
              </View>
            )
          })}

          <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 10, lineHeight: 1.35 }}>
            Repères verticaux à 25 %, 50 % et 75 % de la durée totale. Les barres reproduisent le calendrier du
            rétroplanning (position et durée).
          </Text>
        </Page>
      ))}
    </>
  )
}

function MonthGridPdfPages({
  data,
  clientLabel,
  metaHeader,
  withMetaHeader,
}: {
  data: StrategyCalendarData
  clientLabel?: string
  metaHeader?: RetroplanningPdfMetaHeader | null
  withMetaHeader: boolean
}) {
  const duration = Math.max(1, data.duration)
  const displayItems = calendarItemsForDisplayGrouped(data.items)
  const phaseIndexMap = getPhaseIndexByPlatformKey(displayItems)
  const endDateStr =
    getDatesFromStart(data.startDate, duration)[Math.max(0, duration - 1)] ?? data.startDate
  const months = eachCalendarMonthInRange(data.startDate, duration)

  const monthPairs: { year: number; month: number }[][] = []
  for (let i = 0; i < months.length; i += 2) {
    monthPairs.push(months.slice(i, i + 2))
  }

  return (
    <>
      {monthPairs.map((pair, pageIdx) => {
        const showMeta = withMetaHeader && pageIdx === 0
        const clientBit = clientLabel?.trim() ? `${normalizePdfText(clientLabel.trim())} · ` : ''
        const pairTitles = pair
          .map((ym) =>
            capitalizeFrMonthLabel(
              new Date(ym.year, ym.month - 1, 1).toLocaleDateString('fr-FR', {
                month: 'long',
                year: 'numeric',
              }),
            ),
          )
          .join(' — ')

        return (
          <Page
            key={`month-pair-${pair[0]!.year}-${pair[0]!.month}-${pair[1] ? `${pair[1]!.year}-${pair[1]!.month}` : 'one'}`}
            size="A4"
            orientation="landscape"
            style={styles.monthGridPage}
          >
            {showMeta && metaHeader ? (
              <>
                <Text style={{ fontSize: 10, color: '#334155', marginBottom: 4 }}>
                  Rétroplanning — {normalizePdfText(metaHeader.personName.trim() || 'Non renseigné')}
                </Text>
                {metaHeader.documentComment?.trim() ? (
                  <Text
                    style={{
                      fontSize: 9,
                      fontStyle: 'italic',
                      color: '#64748b',
                      marginBottom: 8,
                      lineHeight: 1.35,
                    }}
                  >
                    {normalizePdfText(metaHeader.documentComment.trim())}
                  </Text>
                ) : null}
              </>
            ) : null}

            <Text style={styles.monthGridTitle}>
              {pageIdx === 0 ? 'Vue mois (calendrier)' : 'Vue mois (suite)'}
            </Text>
            <Text style={styles.monthGridSubtitle}>
              {clientBit}
              {normalizePdfText(pairTitles)} — planning : du {formatDateShort(data.startDate)} au{' '}
              {formatDateShort(endDateStr)} ({duration} j.)
            </Text>

            <View style={styles.monthPairRow}>
              <MonthCalendarBlockPdf
                ym={pair[0]!}
                data={data}
                duration={duration}
                displayItems={displayItems}
                phaseIndexMap={phaseIndexMap}
              />
              {pair[1] ? (
                <MonthCalendarBlockPdf
                  ym={pair[1]!}
                  data={data}
                  duration={duration}
                  displayItems={displayItems}
                  phaseIndexMap={phaseIndexMap}
                />
              ) : (
                <View style={styles.monthColumn} />
              )}
            </View>

            {displayItems.length > 0 ? (
              <View style={styles.monthLegendBlock}>
                <Text style={styles.monthLegendTitle}>Légende des phases</Text>
                {displayItems.map((item, i) => {
                  const phaseIndex = phaseIndexMap.get(item.platform) ?? 0
                  const color = getPlatformPhaseColor(item.platform, phaseIndex)
                  return (
                    <View key={`leg-${pageIdx}-${i}-${item.platform}`} style={styles.monthLegendLine} wrap={false}>
                      <View style={[styles.monthLegendDot, { backgroundColor: color }]} />
                      <Text style={styles.monthLegendLabel}>{itemDisplayLabel(item)}</Text>
                    </View>
                  )
                })}
              </View>
            ) : null}

            <Text style={{ fontSize: 7, color: '#94a3b8', marginTop: 8, lineHeight: 1.35 }}>
              Les pastilles colorées indiquent les phases actives ce jour dans le rétroplanning.
            </Text>
          </Page>
        )
      })}
    </>
  )
}

export type RetroplanningPdfExportOptions = {
  includeWeekTimeline: boolean
  includeMonthGrids: boolean
}

export function RetroplanningPdfDocument(payload: RetroplanningPdfPayload) {
  const {
    documentComment,
    personName,
    clientName,
    calendarData,
    includeWeekTimeline = true,
    includeMonthGrids = true,
  } = payload

  const ganttClientLabel = clientName?.trim() ? clientName : undefined
  const hasItems = calendarData.items.length > 0
  const showWeek = includeWeekTimeline !== false && hasItems
  const showMonth = includeMonthGrids !== false && hasItems

  const metaHeader: RetroplanningPdfMetaHeader = {
    personName: personName.trim() || 'Non renseigné',
    documentComment: documentComment?.trim() || undefined,
  }

  if (!showWeek && !showMonth) {
    return (
      <Document>
        <Page size="A4" orientation="landscape" style={styles.page}>
          <Text style={styles.mainTitle}>Export rétroplanning</Text>
          <Text style={styles.subtitle}>Aucune vue calendrier sélectionnée ou calendrier vide.</Text>
        </Page>
      </Document>
    )
  }

  return (
    <Document>
      {showWeek ? (
        <GanttLandscapePages data={calendarData} clientLabel={ganttClientLabel} metaHeader={metaHeader} />
      ) : null}
      {showMonth ? (
        <MonthGridPdfPages
          data={calendarData}
          clientLabel={ganttClientLabel}
          metaHeader={metaHeader}
          withMetaHeader={!showWeek}
        />
      ) : null}
    </Document>
  )
}

export async function getRetroplanningPdfBlob(payload: RetroplanningPdfPayload): Promise<Blob> {
  return pdf(<RetroplanningPdfDocument {...payload} />).toBlob()
}

export async function downloadRetroplanningPdf(payload: RetroplanningPdfPayload): Promise<void> {
  const blob = await getRetroplanningPdfBlob(payload)
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename
  link.click()
  URL.revokeObjectURL(url)
}
