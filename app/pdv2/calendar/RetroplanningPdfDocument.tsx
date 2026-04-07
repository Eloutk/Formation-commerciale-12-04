'use client'

import React from 'react'
import { Document, Page, Text, View, StyleSheet, pdf, Image } from '@react-pdf/renderer'
import type { CalendarItem, StrategyCalendarData } from './types'
import { getDatesFromStart } from '@/lib/utils/calendarEngine'
import { getPhaseIndexByPlatformKey, getPlatformPhaseColor } from './colors'
import { SMS_SALES_CONDITIONS, RCS_SALES_CONDITIONS } from './smsSalesConditions'

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
})

function formatDateShort(iso: string): string {
  if (!iso) return '–'
  const [y, m, day] = iso.split('-')
  return `${day}/${m}/${(y ?? '').slice(2)}`
}

function formatIntegerPdf(n: number): string {
  if (!Number.isFinite(n)) return ''
  const int = Math.round(Math.abs(n))
  const s = String(int)
  let out = ''
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) out += ' '
    out += s[i]!
  }
  return n < 0 ? `-${out}` : out
}

function formatDecimalPdf(num: number, decimals: number): string {
  if (!Number.isFinite(num)) return '–'
  const fixed = num.toFixed(decimals)
  const [intPart, decPart] = fixed.split('.')
  const n = parseInt(intPart ?? '0', 10)
  const sign = num < 0 ? '-' : ''
  const abs = Math.abs(n)
  const s = String(abs)
  let formatted = ''
  for (let i = 0; i < s.length; i++) {
    if (i > 0 && (s.length - i) % 3 === 0) formatted += ' '
    formatted += s[i]!
  }
  return decimals > 0 ? `${sign}${formatted},${decPart}` : `${sign}${formatted}`
}

function normalizePdfText(s: string): string {
  return s
    .replace(/\u202F/g, ' ')
    .replace(/\u00A0/g, ' ')
    .replace(/\u2007/g, ' ')
    .replace(/\u2009/g, ' ')
}

function formatMoney(n: number): string {
  if (!Number.isFinite(n)) return '–'
  return `${formatIntegerPdf(Math.round(n))} €`
}

function getMaxKpiLabel(objective: string): string {
  const trimmed = objective.trim()
  if (!trimmed) return ''
  const first = trimmed[0]?.toLowerCase()
  const vowels = 'aeiouyhâàäéèêëîïôöùüÿ'
  const useElision = first && vowels.includes(first)
  const prep = useElision ? "d'" : 'de '
  return `Max ${prep}${trimmed.toLowerCase()}`
}

function kpiUnit(objective: string): string {
  const o = objective.toLowerCase()
  if (o.includes('impression')) return 'impressions'
  if (o.includes('lead')) return 'leads'
  if (o.includes('conversion')) return 'conversions'
  if (o.includes('clic')) return 'clics'
  return 'KPIs'
}

function itemDisplayLabel(item: CalendarItem): string {
  if (item.platform.includes('::')) {
    const [p, ...rest] = item.platform.split('::')
    return `${p} – ${rest.join(' – ')}`
  }
  return item.objective ? `${item.platform} – ${item.objective}` : item.platform
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
  /** Commentaire optionnel affiché sous le titre principal */
  documentComment?: string
  /** Nom affiché dans le titre */
  personName: string
  linkSocial: boolean
  linkSms: boolean
  smsType: 'sms' | 'rcs'
  strategyLines?: RetroplanningStrategyLinePdf[]
  /** Si lien SMS/RCS : reprise du devis (prix, options, conditions) */
  smsQuoteDetail?: RetroplanningSmsQuotePdf
  calendarData: StrategyCalendarData
}

function StrategyDetailSection({ lines }: { lines: RetroplanningStrategyLinePdf[] }) {
  if (!lines.length) return null
  return (
    <View style={{ marginTop: 10 }} wrap={false}>
      <Text style={styles.sectionTitle}>Détail de la stratégie média (budgets & KPIs)</Text>
      <View style={styles.encart}>
        <View style={styles.tableHeader}>
          <Text style={[styles.th, styles.colPlat]}>Plateforme</Text>
          <Text style={[styles.th, styles.colObj]}>Objectif</Text>
          <Text style={[styles.th, styles.colBud]}>Budget</Text>
          <Text style={[styles.th, styles.colKpi]}>KPI / volume</Text>
          <Text style={[styles.th, styles.colDays]}>Jours</Text>
          <Text style={[styles.th, styles.colAe]}>% AE</Text>
          <Text style={[styles.th, styles.colDaily]}>Budget jour</Text>
        </View>
        {lines.map((row, i) => {
          const kpiRaw =
            row.customKpiLabel?.trim() ||
            (row.estimatedKPIs > 0
              ? `${formatIntegerPdf(row.estimatedKPIs)} ${kpiUnit(row.objective)}`
              : getMaxKpiLabel(row.objective))
          const kpiText = kpiRaw ? normalizePdfText(kpiRaw) : '—'
          return (
            <View key={i} style={styles.row} wrap={false}>
              <Text style={[styles.cell, styles.colPlat]}>{normalizePdfText(row.platform)}</Text>
              <Text style={[styles.cell, styles.colObj]}>{normalizePdfText(row.objective)}</Text>
              <Text style={[styles.cell, styles.colBud]}>{formatMoney(row.budget)}</Text>
              <Text style={[styles.cell, styles.colKpi]}>{kpiText}</Text>
              <Text style={[styles.cell, styles.colDays]}>{row.days}</Text>
              <Text style={[styles.cell, styles.colAe]}>{row.aePercentage}%</Text>
              <Text style={[styles.cell, styles.colDaily]}>{formatMoney(row.dailyBudget)}</Text>
            </View>
          )
        })}
      </View>
    </View>
  )
}

function SmsStrategyDetailSection({
  smsType,
  detail,
}: {
  smsType: 'sms' | 'rcs'
  detail: RetroplanningSmsQuotePdf
}) {
  const typeLabel = smsType === 'sms' ? 'SMS' : 'RCS'
  const setupFee = smsType === 'sms' ? 190 : 250
  const salesConditions = smsType === 'sms' ? SMS_SALES_CONDITIONS : RCS_SALES_CONDITIONS
  const {
    volume,
    unitPrice,
    totalPrice,
    options,
    campaignMonths,
    creaByLinkCount,
    comment,
    imageBase64,
  } = detail

  const puText =
    unitPrice > 0
      ? `${unitPrice.toFixed(smsType === 'sms' ? 4 : 2).replace('.', ',')} €`
      : '--'

  return (
    <View style={{ marginTop: 10 }}>
      <Text style={styles.sectionTitle}>Détail de la stratégie {typeLabel}</Text>
      <View style={styles.encart}>
        {comment ? (
          <Text style={{ fontSize: 9, fontStyle: 'italic', color: '#666666', marginBottom: 8 }}>{normalizePdfText(comment)}</Text>
        ) : null}
        <Text style={styles.smsSubheading}>Récapitulatif de la demande</Text>
        <View style={styles.smsRow}>
          <Text style={styles.smsLabel}>Type de campagne :</Text>
          <Text style={styles.smsValue}>{typeLabel}</Text>
        </View>
        <View style={styles.smsRow}>
          <Text style={styles.smsLabel}>Volume :</Text>
          <Text style={styles.smsValue}>
            {formatIntegerPdf(volume)} {typeLabel}
          </Text>
        </View>
        <View style={styles.smsRow}>
          <Text style={styles.smsLabel}>Prix unitaire HT :</Text>
          <Text style={styles.smsValue}>{puText}</Text>
        </View>

        <View style={[styles.smsRow, styles.smsSeparator]}>
          <Text style={[styles.smsLabel, { fontWeight: 'bold' }]}>Frais de mise en place :</Text>
          <Text style={styles.smsValue}>{setupFee} €</Text>
        </View>

        {smsType === 'sms' && options.ciblage && (
          <View style={styles.smsRow}>
            <Text style={styles.smsLabel}>dont Ciblage :</Text>
            <Text style={styles.smsValue}>+0,028 € / SMS</Text>
          </View>
        )}
        {smsType === 'sms' && options.richSms && (
          <View style={styles.smsRow}>
            <Text style={styles.smsLabel}>dont Rich SMS :</Text>
            <Text style={styles.smsValue}>+0,021 € / SMS</Text>
          </View>
        )}
        {smsType === 'rcs' && options.agent && (
          <View style={styles.smsRow}>
            <Text style={styles.smsLabel}>Création d&apos;agent :</Text>
            <Text style={styles.smsValue}>+550 €</Text>
          </View>
        )}
        {smsType === 'rcs' && options.creaByLink && (
          <View style={styles.smsRow}>
            <Text style={styles.smsLabel}>CREA BY LINK :</Text>
            <Text style={styles.smsValue}>
              +{100 * (creaByLinkCount || 1)} € {(creaByLinkCount || 1) > 1 ? `(${creaByLinkCount} × 100 €)` : ''}
            </Text>
          </View>
        )}
        {options.tarifIntermarche && (
          <View style={styles.smsRow}>
            <Text style={[styles.smsLabel, { color: '#E94C16', fontWeight: 'bold' }]}>Tarif Intermarché :</Text>
            <Text style={[styles.smsValue, { color: '#E94C16', fontWeight: 'bold' }]}>Activé</Text>
          </View>
        )}
        {options.duplicateCampaign && campaignMonths && campaignMonths > 1 && (
          <View style={styles.smsRow}>
            <Text style={[styles.smsLabel, { fontWeight: 'bold' }]}>Nombre de campagnes :</Text>
            <Text style={[styles.smsValue, { fontWeight: 'bold' }]}>× {campaignMonths}</Text>
          </View>
        )}

        <View style={[styles.smsRow, styles.smsSeparator]}>
          <Text style={[styles.smsLabel, { fontSize: 9, fontWeight: 'bold' }]}>Prix total HT :</Text>
          <Text style={[styles.smsValue, { fontSize: 10, fontWeight: 'bold', color: '#E94C16' }]}>
            {formatDecimalPdf(totalPrice, 2)} €
          </Text>
        </View>

        {imageBase64 ? (
          <View style={{ marginTop: 10 }}>
            <Text style={styles.smsSubheading}>Potentiels calculés</Text>
            <Image
              src={imageBase64}
              style={{
                maxWidth: '100%',
                maxHeight: 180,
                objectFit: 'contain',
              }}
            />
          </View>
        ) : null}

        <Text style={[styles.smsSubheading, { marginTop: 10 }]}>Conditions de vente {typeLabel}</Text>
        {salesConditions.map((condition, idx) => (
          <Text key={idx} style={styles.smsCondLine}>
            • {normalizePdfText(condition)}
          </Text>
        ))}
      </View>
    </View>
  )
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

function GanttLandscapePages({ data }: { data: StrategyCalendarData }) {
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
              <Text style={styles.ganttTitle}>Planning de diffusion</Text>
              <Text style={styles.ganttSubtitle}>
                Période : du {formatDay(0)} au {formatDay(maxDur - 1)} · {maxDur} jours
              </Text>
            </>
          ) : (
            <>
              <Text style={styles.ganttTitle}>Planning de diffusion (suite)</Text>
              <Text style={styles.ganttSubtitle}>
                Lignes {pageIdx * GANTT_ROWS_PER_PAGE + 1} à {Math.min((pageIdx + 1) * GANTT_ROWS_PER_PAGE, allItems.length)} sur {allItems.length}
              </Text>
            </>
          )}

          <View style={styles.ganttAxisRow}>
            <View style={styles.ganttLabelHeader}>
              <Text style={{ fontSize: 9, fontWeight: 'bold', color: '#334155' }}>Tâche / phase</Text>
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

export function RetroplanningPdfDocument(payload: RetroplanningPdfPayload) {
  const {
    documentComment,
    personName,
    linkSocial,
    linkSms,
    smsType,
    strategyLines,
    smsQuoteDetail,
    calendarData,
  } = payload

  const displayName = personName.trim() || 'Non renseigné'
  const stratRows = linkSocial && strategyLines?.length ? strategyLines : []
  const smsQuote = linkSms && smsQuoteDetail ? smsQuoteDetail : null

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.mainTitle}>Rétroplanning {displayName}</Text>
        {documentComment?.trim() ? (
          <Text style={styles.documentComment}>{normalizePdfText(documentComment.trim())}</Text>
        ) : null}
        <Text style={styles.subtitle}>
          Période du {formatDateShort(calendarData.startDate)} au{' '}
          {formatDateShort(
            getDatesFromStart(calendarData.startDate, Math.max(1, calendarData.duration))[
              Math.max(0, calendarData.duration - 1)
            ] ?? calendarData.startDate,
          )}{' '}
          ({calendarData.duration} jours)
        </Text>

        {stratRows.length > 0 ? <StrategyDetailSection lines={stratRows} /> : null}

        {smsQuote ? <SmsStrategyDetailSection smsType={smsType} detail={smsQuote} /> : null}

        <Text style={styles.footerNote}>
          Document généré depuis le calculateur PDV — les dates et durées sur la frise reflètent le dernier état du
          calendrier au moment de l’export.
        </Text>
      </Page>

      {calendarData.items.length > 0 ? <GanttLandscapePages data={calendarData} /> : null}
    </Document>
  )
}

export async function downloadRetroplanningPdf(payload: RetroplanningPdfPayload): Promise<void> {
  const blob = await pdf(<RetroplanningPdfDocument {...payload} />).toBlob()
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = payload.filename
  link.click()
  URL.revokeObjectURL(url)
}
