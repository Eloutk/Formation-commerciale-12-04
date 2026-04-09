'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Plus, Trash2, Download, FileSpreadsheet, ChevronDown, Pencil, Calendar } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { UNIT_COSTS, calculatePriceForKPIs, calculatePriceForKPIsDirection, calculateKPIsForBudget, calculateKPIsForBudgetDirection } from '@/lib/pdv-calculations'
import * as XLSX from 'xlsx'
import { Document, Page, Text, View, StyleSheet, pdf, Image, Svg, Path, Circle } from '@react-pdf/renderer'
import supabase from '@/utils/supabase/client'
import NextImage from 'next/image'
import { cn } from '@/lib/utils'
import { StrategyCalendarBuilder } from '@/app/pdv2/calendar/StrategyCalendarBuilder'
import type { CalendarPlatformSource, StrategyCalendarData } from '@/app/pdv2/calendar/types'
import { useCalendarStore } from '@/app/pdv2/calendar/store'

// Liste des plateformes dans l'ordre souhaité
const PLATFORMS_ORDER = [
  'META',
  'Display',
  'Perf max',
  'Demand Gen',
  'Search',
  'Insta only',
  'Youtube',
  'LinkedIn',
  'Snapchat',
  'Tiktok',
  'Spotify',
] as const

const PLATFORM_LOGOS: Partial<Record<(typeof PLATFORMS_ORDER)[number], string>> = {
  META: '/images/Logo META.png',
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
  'conversion',
] as const

const INSTA_CUSTOM_OBJECTIVES = [
  'Impressions',
  'Clics',
  'Clics sur lien',
  'Intéractions',
  'Visites de profil',
] as const

const DEFAULT_CUSTOM_OBJECTIVES = ['Impressions', 'Clics'] as const

const LINKEDIN_CUSTOM_OBJECTIVES = ['Impressions', 'Clics', 'Leads', 'Likes'] as const

const CUSTOM_OBJECTIVES: Record<(typeof PLATFORMS_ORDER)[number], readonly string[]> = {
  META: META_CUSTOM_OBJECTIVES,
  Display: DEFAULT_CUSTOM_OBJECTIVES,
  'Perf max': DEFAULT_CUSTOM_OBJECTIVES,
  'Demand Gen': DEFAULT_CUSTOM_OBJECTIVES,
  Search: DEFAULT_CUSTOM_OBJECTIVES,
  'Insta only': INSTA_CUSTOM_OBJECTIVES,
  Youtube: ['Impressions'],
  LinkedIn: LINKEDIN_CUSTOM_OBJECTIVES,
  Snapchat: DEFAULT_CUSTOM_OBJECTIVES,
  Tiktok: DEFAULT_CUSTOM_OBJECTIVES,
  Spotify: ['Impressions'],
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
type PdvSection = 'social' | 'sms'
type SmsType = 'sms' | 'rcs'

interface SmsOptionsState {
  ciblage: boolean
  richSms: boolean
  agent: boolean
  creaByLink: boolean
  tarifIntermarche: boolean
  duplicateCampaign: boolean
}

const SMS_SALES_CONDITIONS = [
  'Offre disponible en France métropolitaine (dont Corse).',
  '160 caractères MAXIMUM (dont mentions légales).',
  'Si 2ème campagne dans les 2 semaines (retargeting), -30 % sur la base de données.',
  '4 jours de mise en place minimum.',
  'Statistiques et résultats de campagne sous 48h.',
  'Rich SMS = Jeux concours (= notoriété + ventes + leads) // Store locator.',
  'Pour jeux concours : cadeaux INTÉRESSANTS obligatoires.',
] as const

const RCS_SALES_CONDITIONS = [
  "Création et vérification d'agent OBLIGATOIRE si inexistant.",
  'Délai de création : 7 jours à partir de la réception du formulaire complété par le client.',
  'La créa visuelle est à fournir par le client ou par Link (1000x720px, peu de texte pour une bonne lisibilité sur mobile).',
  "Si besoin d’un agent « conversationnel », devis spécifique à prévoir : à privilégier le RCS classique pour éviter une hausse importante des coûts.",
  'Si le volume RCS est < 10 000 contacts, bascule possible sur une campagne SMS classique.',
  "ATTENTION : les frais de set up correspondent aux frais de paramétrage de la campagne (routage, agrégation, etc.) et ne doivent pas être confondus avec la créa, facturée en sus.",
] as const
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
  // Libellé KPI personnalisé éventuel (ex: Search clics)
  customKpiLabel?: string
  // Indique si les tarifs direction étaient appliqués
  tarifsDirection?: boolean
}

interface StrategyCalendar {
  startDate: string
  duration: number
  items: StrategyCalendarData['items']
}

function isStrategyCalendarData(
  cal: StrategyCalendar | StrategyCalendarData | null | undefined,
): cal is StrategyCalendarData {
  return !!cal && 'duration' in cal && 'items' in cal && Array.isArray((cal as StrategyCalendarData).items)
}

interface StrategyBlock {
  id: string
  name: string
  items: StrategyItem[]
  calendar?: StrategyCalendarData | StrategyCalendar | null
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

// Libellé d'un KPI en fonction de l'objectif (pour l'affichage dans la stratégie)
const getKpiUnitLabel = (objective: string): string => {
  const o = objective.toLowerCase()
  if (o.includes('impression')) return 'impressions'
  if (o.includes('lead')) return 'leads'
  if (o.includes('conversion')) return 'conversions'
  if (o.includes('clic')) return 'clics'
  return 'KPIs'
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

// Styles pour le PDF
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexGrow: 1,
    flexShrink: 1,
  },
  logo: {
    width: 34,
    height: 34,
    objectFit: 'contain',
  },
  title: {
    fontSize: 22,
    marginBottom: 8,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  clientName: {
    fontSize: 18,
    marginTop: 4,
    marginBottom: 18,
    color: '#E94C16',
    fontWeight: 'bold',
  },
  clientComment: {
    fontSize: 12,
    marginTop: 2,
    marginBottom: 20,
    color: '#666666',
  },
  summary: {
    marginBottom: 15,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E94C16',
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
  itemCard: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  itemPlatform: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#1a1a1a',
  },
  itemObjective: {
    fontSize: 11,
    marginBottom: 6,
    color: '#666666',
  },
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
  chartsRow: {
    marginTop: 10,
    marginBottom: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
  },
  chartBox: {
    flex: 1,
    padding: 12,
    backgroundColor: '#ffffff',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  chartTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#1a1a1a',
  },
  pieCircle: {
    width: 90,
    height: 90,
    alignSelf: 'center',
    marginBottom: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  pieCenterText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  legend: {
    marginTop: 4,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  legendColor: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  legendLabel: {
    fontSize: 10,
    color: '#374151',
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
})

// Couleurs pour le graphique PDF (mêmes que dans l'interface)
const PDF_COLORS = ['#E94C16', '#FF6B35', '#FF8C42', '#FFA07A', '#FFB347', '#FFD700', '#FFA500', '#FF8C00']

type PdfChartDatum = {
  name: string
  value: number
  percentage: number
  color: string
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, v))

const toRadians = (deg: number) => (deg * Math.PI) / 180

const polarToCartesian = (cx: number, cy: number, r: number, angleDeg: number) => {
  const a = toRadians(angleDeg)
  return { x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
}

const donutSlicePath = (
  cx: number,
  cy: number,
  rOuter: number,
  rInner: number,
  startAngle: number,
  endAngle: number,
) => {
  // SVG arc flags
  const sweep = 1
  const delta = ((endAngle - startAngle) % 360 + 360) % 360
  const largeArc = delta > 180 ? 1 : 0

  const p1 = polarToCartesian(cx, cy, rOuter, startAngle)
  const p2 = polarToCartesian(cx, cy, rOuter, endAngle)
  const p3 = polarToCartesian(cx, cy, rInner, endAngle)
  const p4 = polarToCartesian(cx, cy, rInner, startAngle)

  return [
    `M ${p1.x} ${p1.y}`,
    `A ${rOuter} ${rOuter} 0 ${largeArc} ${sweep} ${p2.x} ${p2.y}`,
    `L ${p3.x} ${p3.y}`,
    `A ${rInner} ${rInner} 0 ${largeArc} ${sweep ? 0 : 1} ${p4.x} ${p4.y}`,
    'Z',
  ].join(' ')
}

function PdfDonutChart({
  data,
  size = 90,
}: {
  data: Array<Pick<PdfChartDatum, 'value' | 'color'>>
  size?: number
}) {
  const total = data.reduce((s, d) => s + (Number.isFinite(d.value) ? d.value : 0), 0)
  const safeTotal = total > 0 ? total : 1
  const slices = data
    .map((d) => ({ value: Math.max(0, d.value || 0), color: d.color }))
    .filter((d) => d.value > 0)

  const rOuter = size / 2
  const rInner = rOuter - 8
  const cx = rOuter
  const cy = rOuter

  // Starting at top
  let angle = -90

  // Special cases: no data or single slice => draw a clean ring
  if (slices.length === 0) {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={cx} cy={cy} r={rInner + 4} stroke="#f3f4f6" strokeWidth={8} fill="none" />
      </Svg>
    )
  }

  if (slices.length === 1) {
    return (
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <Circle cx={cx} cy={cy} r={rInner + 4} stroke={slices[0].color} strokeWidth={8} fill="none" />
      </Svg>
    )
  }

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {/* background ring */}
      <Circle cx={cx} cy={cy} r={rInner + 4} stroke="#f3f4f6" strokeWidth={8} fill="none" />
      {slices.map((s, idx) => {
        const frac = clamp01(s.value / safeTotal)
        const start = angle
        const end = angle + frac * 360
        angle = end
        const d = donutSlicePath(cx, cy, rOuter - 4, rInner, start, end)
        return <Path key={idx} d={d} fill={s.color} />
      })}
    </Svg>
  )
}

// Composant PDF multi-stratégies
const PDFDocument = ({
  strategies,
  clientName,
  userName,
  aePercentage,
  comment,
  logoDataUrl,
  showAe,
}: {
  strategies: StrategyBlock[]
  clientName: string
  userName: string
  aePercentage: number
  comment?: string
  logoDataUrl?: string | null
  showAe?: boolean
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            {!!logoDataUrl && <Image src={logoDataUrl} style={styles.logo} />}
            <Text style={styles.title}>
              {userName ? `Stratégies de ${userName}` : 'Mes stratégies'}
            </Text>
          </View>
        </View>
        <Text style={styles.clientName}>Client : {clientName}</Text>
        {!!comment?.trim() && (
          <Text style={styles.clientComment}>{comment.trim()}</Text>
        )}

        {strategies.map((block, index) => {
          if (!block.items.length) return null

          const total = block.items.reduce((sum, item) => sum + item.budget, 0)

          const platformTotals: Record<string, number> = {}
          block.items.forEach((item) => {
            if (!platformTotals[item.platform]) {
              platformTotals[item.platform] = 0
            }
            platformTotals[item.platform] += item.budget
          })

          const chartDataPlatform = Object.entries(platformTotals).map(([name, value], idx) => ({
            name,
            value: Math.round(value),
            percentage: total > 0 ? (value / total * 100) : 0,
            color: PDF_COLORS[idx % PDF_COLORS.length],
          }))

          const objectiveTotals: Record<string, number> = {}
          block.items.forEach((item) => {
            if (!objectiveTotals[item.objective]) {
              objectiveTotals[item.objective] = 0
            }
            objectiveTotals[item.objective] += item.budget
          })

          const chartDataObjective = Object.entries(objectiveTotals).map(([name, value], idx) => ({
            name,
            value: Math.round(value),
            percentage: total > 0 ? (value / total * 100) : 0,
            color: PDF_COLORS[idx % PDF_COLORS.length],
          }))

          return (
            <View key={block.id} wrap={false}>
              {/* Résumé par stratégie */}
              <View style={[styles.summary, { marginTop: index === 0 ? 10 : 20 }]}>
                {(() => {
                  const strategyAe =
                    block.items.length > 0 ? block.items[0].aePercentage : 0
                  return (
                    <>
                      <Text style={styles.summaryText}>
                        Stratégie {index + 1} : {block.name}
                      </Text>
                      <Text style={styles.summaryTotal}>
                        Total : {formatNumber(total, 0)} €
                      </Text>
                      {showAe && (
                        <Text style={[styles.summaryText, { marginTop: 4 }]}>
                          AE :{' '}
                          {strategyAe > 0
                            ? `${formatNumber(strategyAe, 0)} %`
                            : '-'}
                        </Text>
                      )}
                    </>
                  )
                })()}
              </View>

              {/* Diagrammes circulaires (2 colonnes) */}
              {(chartDataPlatform.length > 0 || chartDataObjective.length > 0) && (
                <View style={styles.chartsRow}>
                  {/* Par plateforme */}
                  {chartDataPlatform.length > 0 && (
                    <View style={styles.chartBox}>
                      <Text style={styles.chartTitle}>Répartition par plateforme</Text>
                      <View style={styles.pieCircle}>
                        <PdfDonutChart data={chartDataPlatform} />
                      </View>
                      <View style={styles.legend}>
                        {chartDataPlatform.map((item, idx) => (
                          <View key={idx} style={styles.legendItem}>
                            <View
                              style={[
                                styles.legendColor,
                                { backgroundColor: item.color },
                              ]}
                            />
                            <Text style={styles.legendLabel}>
                              {item.name} — {item.percentage.toFixed(1)}% ({formatNumber(item.value, 0)} €)
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Par objectif */}
                  {chartDataObjective.length > 0 && (
                    <View style={styles.chartBox}>
                      <Text style={styles.chartTitle}>Répartition par objectif</Text>
                      <View style={styles.pieCircle}>
                        <PdfDonutChart data={chartDataObjective} />
                      </View>
                      <View style={styles.legend}>
                        {chartDataObjective.map((item, idx) => (
                          <View key={idx} style={styles.legendItem}>
                            <View
                              style={[
                                styles.legendColor,
                                { backgroundColor: item.color },
                              ]}
                            />
                            <Text style={styles.legendLabel}>
                              {item.name} — {item.percentage.toFixed(1)}% ({formatNumber(item.value, 0)} €)
                            </Text>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </View>
              )}

              {/* Détail de la stratégie */}
              <View>
                <Text style={[styles.chartTitle, { marginTop: 20, marginBottom: 10 }]}>
                  Détail de la stratégie {index + 1}
                </Text>
                {block.items.map((item) => (
                  <View key={item.id} style={styles.itemCard}>
                    <Text style={styles.itemPlatform}>{item.platform}</Text>
                    <Text style={styles.itemObjective}>{item.objective}</Text>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>Budget :</Text>
                      <Text style={styles.itemValue}>{formatNumber(item.budget, 0)} €</Text>
                    </View>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>KPIs estimés :</Text>
                      <Text style={styles.itemValue}>
                        {(() => {
                          const customLabel = (item as any).customKpiLabel as string | undefined
                          if (customLabel && customLabel.trim().length > 0) {
                            return customLabel.trim()
                          }
                          if (item.estimatedKPIs > 0) {
                            return `${formatNumber(item.estimatedKPIs, 0)} ${getKpiUnitLabel(item.objective)}${
                              item.objective === 'Leads' ? ' (estimation)' : ''
                            }`
                          }
                          return `${getMaxKpiLabel(item.objective)}${
                            item.objective === 'Leads' ? ' (estimation)' : ''
                          }`
                        })()}
                      </Text>
                    </View>
                    <View style={styles.itemRow}>
                      <Text style={styles.itemLabel}>Budget quotidien :</Text>
                      <Text style={styles.itemValue}>{formatNumber(item.dailyBudget, 1)} €</Text>
                    </View>
                    {item.days > 0 && (
                      <View style={styles.itemRow}>
                        <Text style={styles.itemLabel}>Diffusion :</Text>
                        <Text style={styles.itemValue}>
                          {item.days} jour{item.days > 1 ? 's' : ''}
                        </Text>
                      </View>
                    )}
                  </View>
                ))}
              </View>
            </View>
          )
        })}
      </Page>
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
  userName,
  tarifIntermarche,
  campaignMonths,
  creaByLinkCount,
  comment,
  imageBase64,
}: {
  type: 'sms' | 'rcs'
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
  salesConditions: readonly string[]
  userName: string
  tarifIntermarche?: boolean
  campaignMonths?: number
  creaByLinkCount?: number
  comment?: string
  imageBase64?: string | null
}) => {
  const typeLabel = type === 'sms' ? 'SMS' : 'RCS'
  const setupFee = type === 'sms' ? 190 : 250
  
  // Calculer le prix de base avant duplication
  const basePriceBeforeDuplication = options.duplicateCampaign && campaignMonths && campaignMonths > 1
    ? totalPrice / campaignMonths
    : totalPrice

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* En-tête */}
        <Text style={styles.title}>
          Devis {typeLabel} - {userName}
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
            <Text style={styles.itemLabel}>Type de campagne :</Text>
            <Text style={styles.itemValue}>{typeLabel}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Volume :</Text>
            <Text style={styles.itemValue}>{formatNumber(volume, 0)} {typeLabel}</Text>
          </View>
          <View style={styles.itemRow}>
            <Text style={styles.itemLabel}>Prix unitaire HT :</Text>
            <Text style={styles.itemValue}>
              {unitPrice > 0 ? `${unitPrice.toFixed(type === 'sms' ? 4 : 2).replace('.', ',')} €` : '--'}
            </Text>
          </View>

          {/* Séparateur pour les options */}
          <View style={[styles.itemRow, { marginTop: 6, paddingTop: 6, borderTop: '1 solid #e5e5e5' }]}>
            <Text style={[styles.itemLabel, { fontSize: 10, fontWeight: 'bold' }]}>
              Frais de mise en place :
            </Text>
            <Text style={styles.itemValue}>{setupFee} €</Text>
          </View>

          {/* Options - affichées seulement si cochées (dont = déjà inclus dans le total) */}
          {type === 'sms' && options.ciblage && (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>dont Ciblage :</Text>
              <Text style={styles.itemValue}>+0,028 € / SMS</Text>
            </View>
          )}
          {type === 'sms' && options.richSms && (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>dont Rich SMS :</Text>
              <Text style={styles.itemValue}>+0,021 € / SMS</Text>
            </View>
          )}
          {type === 'rcs' && options.agent && (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>Création d'agent :</Text>
              <Text style={styles.itemValue}>+550 €</Text>
            </View>
          )}
          {type === 'rcs' && options.creaByLink && (
            <View style={styles.itemRow}>
              <Text style={styles.itemLabel}>CREA BY LINK :</Text>
              <Text style={styles.itemValue}>+{100 * (creaByLinkCount || 1)} € {(creaByLinkCount || 1) > 1 ? `(${creaByLinkCount} × 100 €)` : ''}</Text>
            </View>
          )}
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
              <Text style={[styles.itemLabel, { fontWeight: 'bold' }]}>Nombre de campagnes :</Text>
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
        </View>

        {/* Image jointe (potentiels calculés) */}
        {imageBase64 && (
          <View style={{ marginTop: 12, marginBottom: 12 }}>
            <Text style={[styles.chartTitle, { marginBottom: 8, fontSize: 12 }]}>
              Potentiels calculés
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
            Conditions de vente {typeLabel}
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

export default function PDVPage() {
  // État du formulaire
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('budget-to-kpis')
  const [mainValue, setMainValue] = useState<string>('') // Budget ou KPIs selon le mode
  const [aePercentage, setAePercentage] = useState<string>('40')
  const [diffusionDays, setDiffusionDays] = useState<string>('14')
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>(() => [])
  const [pdvSection, setPdvSection] = useState<PdvSection>('social')
  const [smsVolume, setSmsVolume] = useState<string>('') // nombre de SMS pour le module SMS
  const [smsType, setSmsType] = useState<SmsType>('sms')
  const [smsOptions, setSmsOptions] = useState<SmsOptionsState>({
    ciblage: false,
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
  const [calendarDialogOpen, setCalendarDialogOpen] = useState(false)
  const [calendarStrategyId, setCalendarStrategyId] = useState<string | null>(null)
  const [defineDatesPerPlatform, setDefineDatesPerPlatform] = useState<Record<string, string>>({})

  // Ligne personnalisable par plateforme
  const [customRows, setCustomRows] = useState<Record<string, CustomRowState>>(() => {
    const initial: Record<string, CustomRowState> = {}
    PLATFORMS_ORDER.forEach((platform) => {
      const objectives = CUSTOM_OBJECTIVES[platform] ?? DEFAULT_CUSTOM_OBJECTIVES
      initial[platform] = {
        objective: objectives[0] ?? 'Impressions',
        budget: '',
      }
    })
    return initial
  })
  
  // État pour la modale PDF
  const [pdfDialogOpen, setPdfDialogOpen] = useState(false)
  const [clientName, setClientName] = useState('')
  const [pdfClientComment, setPdfClientComment] = useState('')
  const [showAeInPdf, setShowAeInPdf] = useState(true)
  
  // État pour la modale PDF SMS/RCS
  const [smsPdfDialogOpen, setSmsPdfDialogOpen] = useState(false)
  const [smsPdfFileName, setSmsPdfFileName] = useState('')
  const [smsPdfComment, setSmsPdfComment] = useState('')
  const [smsPdfImage, setSmsPdfImage] = useState<string | null>(null)
  const [currentSmsType, setCurrentSmsType] = useState<'sms' | 'rcs'>('sms')
  
  // État pour la modale Validation TM
  const [validationTMDialogOpen, setValidationTMDialogOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [sendingToSlack, setSendingToSlack] = useState(false)
  const [userPseudo, setUserPseudo] = useState<string>('')
  
  // État pour le sélecteur de graphique
  const [chartView, setChartView] = useState<ChartView>('platform')
  
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
    if (smsType !== 'sms') return 0
    let opt = 0
    if (smsOptions.ciblage) opt += 0.028
    if (smsOptions.richSms) opt += 0.021
    return opt
  }, [smsType, smsOptions.ciblage, smsOptions.richSms])

  // Si Tarif Intermarché est coché, le PU est figé à 0,12 € quel que soit le volume.
  const smsUnitPrice = smsOptions.tarifIntermarche ? 0.12 : smsBasePU + smsOptionPU
  const smsTotalPrice = useMemo(() => {
    if (smsType !== 'sms' || smsVolumeNumber <= 0 || smsBasePU <= 0) return 0
    const setupFee = 190
    const variablePerCampaign = smsUnitPrice * smsVolumeNumber
    if (!smsOptions.duplicateCampaign || campaignMonthsNumber <= 1) {
      return setupFee + variablePerCampaign
    }
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

  const rcsOptionFee = useMemo(() => {
    if (smsType !== 'rcs') return 0
    let fee = 0
    if (smsOptions.agent) fee += 550 // Création d'agent (si nécessaire)
    if (smsOptions.creaByLink) fee += 100 * creaByLinkCountNumber // CREA BY LINK
    return fee
  }, [smsType, smsOptions.agent, smsOptions.creaByLink, creaByLinkCountNumber])

  const rcsTotalPrice = useMemo(() => {
    if (smsType !== 'rcs' || smsVolumeNumber <= 0 || rcsBasePU < 0) return 0
    const setupFee = 250
    const variablePerCampaign = rcsBasePU * smsVolumeNumber + rcsOptionFee
    if (!smsOptions.duplicateCampaign || campaignMonthsNumber <= 1) {
      return setupFee + variablePerCampaign
    }
    return setupFee + variablePerCampaign * campaignMonthsNumber
  }, [smsType, smsVolumeNumber, rcsBasePU, rcsOptionFee, smsOptions.duplicateCampaign, campaignMonthsNumber])

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

  const isMaxObjective = (objective: string): boolean => {
    const o = objective.toLowerCase()
    return o === 'conversion' || o === 'leads' || o === 'likes'
  }

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
                budget = mainValueNum
                const result = tarifsDirection
                  ? calculateKPIsForBudgetDirection(platform, objective, aeNum, budget)
                  : calculateKPIsForBudget(platform, objective, aeNum, budget)
                estimatedKPIs = Math.ceil(result.calculatedKpis || 0)
              } else {
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
  const addToStrategy = (row: TableRowData & { customKpiLabel?: string }) => {
    const daysNum = parseFloat(diffusionDays) || 0
    const aeNum = parseFloat(aePercentage) || 0

    // Vérifier cohérence du % AE dans la stratégie cible
    const targetId = activeStrategyId || strategies[0]?.id
    const targetStrategy = strategies.find((s) => s.id === targetId)
    if (targetStrategy && targetStrategy.items.length > 0) {
      const existingAe = targetStrategy.items[0].aePercentage
      if (existingAe !== aeNum) {
        alert(
          `Le % AE de cette stratégie est ${existingAe} %. Pour ajouter une ligne, utilisez le même % AE ou créez une nouvelle stratégie.`,
        )
        return
      }
    }

    const newItem: StrategyItem = {
      ...row,
      id: `${row.platform}-${row.objective}-${Date.now()}`,
      days: daysNum,
      aePercentage: aeNum,
    }
    setStrategies((prev) => {
      return prev.map((s) =>
        s.id === targetId ? { ...s, items: [...s.items, { ...newItem, tarifsDirection }] } : s,
      )
    })
  }

  // Fonction pour supprimer de la stratégie (par bloc)
  const removeFromStrategy = (strategyId: string, id: string) => {
    setStrategies((prev) =>
      prev.map((s) =>
        s.id === strategyId ? { ...s, items: s.items.filter((item) => item.id !== id) } : s,
      ),
    )
  }

  // Stratégie active (pour les interactions / +)
  const activeStrategy = strategies.find((s) => s.id === activeStrategyId) ?? strategies[0]
  const strategy = activeStrategy?.items ?? []

  // Calculer le total de la stratégie active (mise à jour automatique)
  const strategyTotal = useMemo(() => {
    return strategy.reduce((total, item) => total + item.budget, 0)
  }, [strategy])

  // Calculer le total des KPIs dans la stratégie active
  const strategyKPIsTotal = useMemo(() => {
    return strategy.reduce((total, item) => total + item.estimatedKPIs, 0)
  }, [strategy])

  // Préparer les données pour le graphique (par plateforme) pour la stratégie active
  const chartData = useMemo(() => {
    const platformTotals: Record<string, number> = {}
    
    strategy.forEach((item) => {
      if (!platformTotals[item.platform]) {
        platformTotals[item.platform] = 0
      }
      platformTotals[item.platform] += item.budget
    })
  
    return Object.entries(platformTotals).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }))
  }, [strategy])

  // Préparer les données pour le graphique (par objectif) pour la stratégie active
  const chartDataByObjective = useMemo(() => {
    const objectiveTotals: Record<string, number> = {}
    
    strategy.forEach((item) => {
      if (!objectiveTotals[item.objective]) {
        objectiveTotals[item.objective] = 0
      }
      objectiveTotals[item.objective] += item.budget
    })
  
    return Object.entries(objectiveTotals).map(([name, value]) => ({
      name,
      value: Math.round(value)
    }))
  }, [strategy])

  // Couleurs pour le graphique
  const COLORS = ['#E94C16', '#FF6B35', '#FF8C42', '#FFA07A', '#FFB347', '#FFD700', '#FFA500', '#FF8C00']

  const getDaysOverrideClass = (days: number): string | null => {
    if (days < 5) return 'bg-red-50 text-red-700'
    if (days < 10) return 'bg-orange-50 text-orange-700'
    return null
  }

  const getRowColorClass = (platform: string, aeCheckValue: number, days: number): string => {
    if (platform === 'Search') {
      if (days > 0 && days < 40) return 'bg-red-50 text-red-700'
      if (days >= 40 && days < 90) return 'bg-orange-50 text-orange-700'
      if (days >= 90) {
        if (aeCheckValue >= 8) return 'bg-green-50 text-green-700'
        return 'bg-orange-50 text-orange-700'
      }
      return getAeColorClass(platform, aeCheckValue)
    }
    const daysClass = getDaysOverrideClass(days)
    if (daysClass) return daysClass
    return getAeColorClass(platform, aeCheckValue)
  }

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
      if (item.platform === 'Spotify') {
        if (aeVal < 250) warnings.push(`${item.platform} : budget AE total ${Math.round(aeVal)} € (sous le minimum 250 €).`)
        else if (aeVal <= 350) warnings.push(`${item.platform} : budget AE total ${Math.round(aeVal)} € (à valider, objectif 350 €+).`)
      } else {
        const dailyBudget = item.dailyBudget ?? 0
        const isMetaLike = ['META', 'Insta only', 'Display', 'Youtube'].includes(item.platform)
        const isLinkedInTiktok = ['LinkedIn', 'Tiktok'].includes(item.platform)
        const isSnapEtc = ['Snapchat', 'Perf max', 'Demand Gen', 'Search'].includes(item.platform)
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
    if (aeCheckValue === 0) return 'bg-gray-100 text-gray-400'

    const isMetaLike =
      platform === 'META' ||
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

    if (platform === 'Snapchat' || platform === 'Perf max' || platform === 'Demand Gen' || platform === 'Search') {
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

    const fetchAsDataUrl = async (url: string, timeoutMs: number): Promise<string | null> => {
      try {
        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), timeoutMs)
        const res = await fetch(url, { signal: controller.signal })
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

    const logoDataUrl = await fetchAsDataUrl('/Logo Link Vertical (Orange).png', 2000)

    const doc = (
      <PDFDocument
        strategies={strategies}
        clientName={clientName}
        userName={userName}
        aePercentage={parseFloat(aePercentage) || 0}
        comment={pdfClientComment}
        logoDataUrl={logoDataUrl}
        showAe={showAeInPdf}
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
    setPdfClientComment('')
  }

  // Fonction pour envoyer le PDF sur Slack (Validation TM)
  const handleValidationTM = async () => {
    if (!validationMessage.trim()) return
    
    setSendingToSlack(true)
    try {
      // 1) Générer le PDF (toutes les stratégies)
      const doc = (
        <PDFDocument
          strategies={strategies}
          clientName={clientName || 'Client'}
          userName={userName}
          aePercentage={parseFloat(aePercentage) || 0}
        />
      )
      const blob = await pdf(doc).toBlob()

      // 2) Convertir le blob en base64 (sans FileReader imbriqué)
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
    if (smsVolumeNumber <= 0 || rcsBasePU <= 0 || rcsTotalPrice <= 0) {
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
        unitPrice={currentSmsType === 'sms' ? smsUnitPrice : rcsBasePU}
        totalPrice={currentSmsType === 'sms' ? smsTotalPrice : rcsTotalPrice}
        options={currentSmsType === 'sms' 
          ? {
              ciblage: smsOptions.ciblage,
              richSms: smsOptions.richSms,
              tarifIntermarche: smsOptions.tarifIntermarche,
              duplicateCampaign: smsOptions.duplicateCampaign,
            }
          : {
              agent: smsOptions.agent,
              creaByLink: smsOptions.creaByLink,
              tarifIntermarche: smsOptions.tarifIntermarche,
              duplicateCampaign: smsOptions.duplicateCampaign,
            }
        }
        salesConditions={currentSmsType === 'sms' ? SMS_SALES_CONDITIONS : RCS_SALES_CONDITIONS}
        userName={userPseudo || userName}
        tarifIntermarche={smsOptions.tarifIntermarche}
        campaignMonths={smsOptions.duplicateCampaign ? campaignMonthsNumber : undefined}
        creaByLinkCount={currentSmsType === 'rcs' ? creaByLinkCountNumber : undefined}
        comment={smsPdfComment || undefined}
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
    setSmsPdfComment('')
    setSmsPdfImage(null)
  }

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-[1600px] mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Calculateur Vente</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Calculez vos prix de vente selon la plateforme, l'objectif et votre budget. Unifiez vos simulations en un seul endroit.
          </p>
        </div>
        {/* Sous-onglets PDV */}
        <div className="mb-6">
          <Tabs
            value={pdvSection}
            onValueChange={(value) => setPdvSection(value as PdvSection)}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-sm mx-auto grid-cols-2 border-2 border-gray-300">
              <TabsTrigger
                value="social"
                className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
              >
                Social media
              </TabsTrigger>
              <TabsTrigger
                value="sms"
                className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
              >
                SMS
              </TabsTrigger>
            </TabsList>
          </Tabs>
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
                {(userRole === 'direction' || userRole === 'admin' || userRole === 'super_admin') && (
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="tarifs-direction-pdv"
                      checked={tarifsDirection}
                      onCheckedChange={(checked) => setTarifsDirection(checked === true)}
                    />
                    <label
                      htmlFor="tarifs-direction-pdv"
                      className="text-sm font-medium leading-none cursor-pointer"
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
                      <label key={platform} className="flex items-center gap-2 cursor-pointer text-sm">
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

                  const custom = customRows[platform] ?? { objective: '', budget: '' }
                  const daysNum = parseFloat(diffusionDays) || 14
                  const mainValueNum = parseFloat(mainValue) || 0
                  const aeNum = parseFloat(aePercentage) || 40
                  const referenceRowForObjective = platformRows.find((r) => r.objective === custom.objective)
                  const referenceRow = referenceRowForObjective ?? platformRows[0]
                  const customBudgetNum = onlyCustomRow ? mainValueNum : (referenceRow?.budget ?? 0)
                  const customDailyBudget = onlyCustomRow
                    ? (mainValueNum * (aeNum / 100)) / daysNum
                    : (referenceRow?.dailyBudget ?? 0)
                  const customAeCheckValue = onlyCustomRow
                    ? customDailyBudget
                    : (referenceRow?.aeCheckValue ?? 0)
                  const customRowColor = getRowColorClass(platform, customAeCheckValue, daysNum)
                  const objectivesForPlatform =
                    platform === 'META'
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
                                if (platform === 'META' && row.objective === 'conversion') {
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
                                          onClick={() => addToStrategy(row)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Plus className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </TableCell>
                                  </TableRow>
                                )
                              })}

                              {platform === 'Search' && (['Clics', 'Conversion'] as const).map((obj) => {
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
                                            addToStrategy({
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
                              })}

                              {platform !== 'Search' && (
                              <TableRow className={customRowColor}>
                                <TableCell>
                                  {platform === 'Perf max' || platform === 'Demand Gen' ? (
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
                                  {custom.objective
                                    ? `${getMaxKpiLabel(custom.objective)}${
                                        custom.objective === 'Leads' ? ' (estimation)' : ''
                                      }`
                                    : '—'}
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
                                        addToStrategy({
                                          platform,
                                          objective: custom.objective,
                                          budget: customBudgetNum,
                                          estimatedKPIs:
                                            referenceRowForObjective?.estimatedKPIs ?? 0,
                                          dailyBudget: customDailyBudget,
                                          aeCheckValue: customAeCheckValue,
                                          isAvailable: true,
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
                <Input
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
              const blockAe = items.length > 0 ? items[0].aePercentage : 0
              const total = items.reduce((sum, it) => sum + it.budget, 0)
              const hasSummary = items.length > 0
              const budgetLabel = total.toLocaleString('fr-FR', { maximumFractionDigits: 0 })

              return (
                <Card
                  key={block.id}
                  className={`border-2 flex flex-col mb-2 ${
                    isActive ? 'border-[#E94C16]' : 'border-muted'
                  }`}
                >
                  <CardHeader
                    className="flex-shrink-0 cursor-pointer"
                    onClick={() =>
                      setExpandedStrategies((prev) => ({
                        ...prev,
                        [block.id]: !isExpanded,
                      }))
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-start gap-2">
                        <ChevronDown
                          className={`h-4 w-4 transition-transform ${
                            isExpanded ? 'rotate-180' : ''
                          }`}
                        />
                        <div className="flex flex-col gap-0.5">
                          <CardTitle className="flex items-center gap-2 text-sm">
                            {renamingStrategyId === block.id ? (
                              <div className="flex items-center gap-2">
                                <Input
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
                                    const perPlatform: Record<string, string> = {}
                                    const cal = block.calendar
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
                                    setDefineDatesPerPlatform(perPlatform)
                                    setCalendarDialogOpen(true)
                                  }}
                                >
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Calendrier
                                </Button>
                              </>
                            )}
                          </CardTitle>

                          {hasSummary && (
                            <div className="text-[11px] text-muted-foreground">
                              {isExpanded ? (
                                <div className="flex flex-col">
                                  <span>
                                    Budget total :{' '}
                                    <span className="font-semibold text-[#E94C16]">
                                      {budgetLabel} €
                                    </span>
                                  </span>
                                  <span>AE : {blockAe > 0 ? `${blockAe} %` : '-'}</span>
                                </div>
                              ) : (
                                <>
                                  Budget total :{' '}
                                  <span className="font-semibold text-[#E94C16]">
                                    {budgetLabel} €
                                  </span>{' '}
                                  - AE : {blockAe > 0 ? `${blockAe} %` : '-'}
                                </>
                              )}
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
                          {/* Liste des éléments */}
                          <div className="flex-1 overflow-y-auto mb-4 mt-2">
                            <div className="space-y-2">
                              {items.map((item) => {
                                const colorClass = getRowColorClass(item.platform, item.aeCheckValue, item.days || 0)
                                return (
                                  <div
                                    key={item.id}
                                    className={`p-3 rounded-lg border ${colorClass} flex items-start justify-between gap-2`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm flex items-center gap-2 flex-wrap">
                                        <PlatformBadge platform={item.platform} />
                                        {item.tarifsDirection && (
                                          <span className="text-[10px] uppercase tracking-wide px-1.5 py-0.5 rounded bg-blue-100 text-blue-700">
                                            Tarifs direction
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {item.objective}
                                      </div>
                                      <div className="text-xs font-semibold mt-1">
                                        {item.budget.toLocaleString('fr-FR', {
                                          maximumFractionDigits: 0,
                                        })}{' '}
                                        €
                                      </div>
                                      <div className="text-xs text-muted-foreground mt-1">
                                        {item.customKpiLabel
                                          ? item.customKpiLabel
                                          : item.estimatedKPIs > 0
                                            ? `${item.estimatedKPIs.toLocaleString(
                                                'fr-FR',
                                              )} ${getKpiUnitLabel(item.objective)}${
                                                item.objective === 'Leads' ? ' (estimation)' : ''
                                              }`
                                            : `${getMaxKpiLabel(item.objective)}${
                                                item.objective === 'Leads' ? ' (estimation)' : ''
                                              }`}
                                      </div>
                                      <div className="text-xs text-muted-foreground">
                                        {item.days > 0 &&
                                          `Diffusion : ${item.days} jour${
                                            item.days > 1 ? 's' : ''
                                          }`}
                                      </div>
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
                              })}
                            </div>
                          </div>

                          {/* Graphiques et exports uniquement pour la stratégie active */}
                          {isActive && (chartData.length > 0 || chartDataByObjective.length > 0) && (
                            <div className="mb-6">
                              {/* Sélecteur de graphique */}
                              <div className="mb-4">
                                <Tabs
                                  value={chartView}
                                  onValueChange={(value) => setChartView(value as ChartView)}
                                  className="w-full"
                                >
                                  <TabsList className="grid w-full grid-cols-2 border-2 border-gray-300">
                                    <TabsTrigger
                                      value="platform"
                                      className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                                      disabled={chartData.length === 0}
                                    >
                                      Par plateforme
                                    </TabsTrigger>
                                    <TabsTrigger
                                      value="objective"
                                      className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
                                      disabled={chartDataByObjective.length === 0}
                                    >
                                      Par objectif
                                    </TabsTrigger>
                                  </TabsList>
                                </Tabs>
                              </div>

                              {/* Graphique par plateforme */}
                              {chartView === 'platform' && chartData.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-semibold mb-3">
                                    Répartition par plateforme
                                  </h3>
                                  <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                      <Pie
                                        data={chartData}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent = 0 }) =>
                                          `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
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
                                          value != null ? `${value.toLocaleString('fr-FR')} €` : '-'
                                        }
                                      />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              )}

                              {/* Graphique par objectif */}
                              {chartView === 'objective' && chartDataByObjective.length > 0 && (
                                <div>
                                  <h3 className="text-sm font-semibold mb-3">
                                    Répartition par objectif
                                  </h3>
                                  <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                      <Pie
                                        data={chartDataByObjective}
                                        cx="50%"
                                        cy="50%"
                                        labelLine={false}
                                        label={({ name, percent = 0 }) =>
                                          `${name}: ${(percent * 100).toFixed(0)}%`
                                        }
                                        outerRadius={80}
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
                                          value != null ? `${value.toLocaleString('fr-FR')} €` : '-'
                                        }
                                      />
                                      <Legend />
                                    </PieChart>
                                  </ResponsiveContainer>
                                </div>
                              )}
                            </div>
                          )}

                          {/* Boutons d'export pour la stratégie active */}
                          {isActive && (
                            <div className="flex gap-2 flex-shrink-0">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setValidationTMDialogOpen(true)}
                                className="flex-1"
                                disabled={strategy.length === 0}
                              >
                                Validation TM
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setPdfDialogOpen(true)}
                                className="flex-1"
                              >
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                              </Button>
                            </div>
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
                {/* Bloc configuration (gauche) + simulation (droite), même esprit que Social media */}
                <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-6">
                  {/* Colonne gauche : configuration de la campagne */}
                  <div className="space-y-5">
                    {/* Type de campagne SMS / RCS */}
                    <div className="space-y-2">
                      <Label>Type de campagne</Label>
                      <Tabs
                        value={smsType}
                        onValueChange={(value) => {
                          const next = value as SmsType
                          setSmsType(next)
                          // Réinitialiser les options à chaque changement de type pour éviter tout héritage implicite
                          setSmsOptions(
                            next === 'sms'
                              ? {
                                  ciblage: false,
                                  richSms: false,
                                  agent: false,
                                  creaByLink: false,
                                  tarifIntermarche: false,
                                  duplicateCampaign: false,
                                }
                              : {
                                  ciblage: false,
                                  richSms: false,
                                  agent: false,
                                  creaByLink: false,
                                  tarifIntermarche: false,
                                  duplicateCampaign: false,
                                },
                          )
                          setCampaignMonths('1') // Reset nombre de mois
                          setCreaByLinkCount('1') // Reset nombre de CREA BY LINK
                        }}
                        className="w-full max-w-xs"
                      >
                        <TabsList className="grid w-full grid-cols-2 border-2 border-gray-300">
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
                      {smsType === 'sms' && (
                        <p className="text-xs text-muted-foreground">
                          Le tarif unitaire dépend uniquement du volume total de SMS envoyé
                          (tranche unique, non cumulative).
                        </p>
                      )}
                    </div>

                    {/* Options selon le type */}
                    <div className="space-y-3">
                      <Label>Options disponibles</Label>
                      {smsType === 'sms' && (
                        <div className="space-y-2 text-sm">
                          <label className="flex items-center justify-between gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={smsOptions.ciblage}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, ciblage: e.target.checked }))
                                }
                              />
                              <span>Ciblage</span>
                            </div>
                            <span className="text-xs text-muted-foreground">+ 0,028 € / SMS</span>
                          </label>

                          <label className="flex items-center justify-between gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={smsOptions.richSms}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, richSms: e.target.checked }))
                                }
                              />
                              <span>Rich SMS</span>
                            </div>
                            <span className="text-xs text-muted-foreground">+ 0,021 € / SMS</span>
                          </label>

                          <label className="flex items-center justify-between gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={smsOptions.tarifIntermarche}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, tarifIntermarche: e.target.checked }))
                                }
                              />
                              <span>Tarif Intermarché</span>
                            </div>
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
                              <div className="flex items-center gap-2">
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
                          <label className="flex items-center justify-between gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={smsOptions.agent}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, agent: e.target.checked }))
                                }
                              />
                              <span>Création d&apos;agent (si nécessaire)</span>
                            </div>
                            <span className="text-xs text-muted-foreground">+ 550 €</span>
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
                                  className="h-8 w-20 text-center"
                                  placeholder="1"
                                />
                                <span className="text-xs text-muted-foreground">× 100 €</span>
                              </div>
                            )}
                          </label>

                          <label className="flex items-center justify-between gap-2 cursor-pointer rounded-md border bg-white px-3 py-2">
                            <div className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="h-4 w-4 rounded border-gray-300"
                                checked={smsOptions.tarifIntermarche}
                                onChange={(e) =>
                                  setSmsOptions((prev) => ({ ...prev, tarifIntermarche: e.target.checked }))
                                }
                              />
                              <span>Tarif Intermarché</span>
                            </div>
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
                              <div className="flex items-center gap-2">
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
                    </div>
                  </div>

                  {/* Colonne droite : volume & prix */}
                  {(smsType === 'sms' || smsType === 'rcs') && (
                    <div className="space-y-3 rounded-lg border border-black bg-white p-3">
                      <div className="space-y-2">
                        <Label>Nombre de {smsType === 'sms' ? 'SMS' : 'RCS'}</Label>
                        <EditableInput
                          type="number"
                          min={0}
                          placeholder={`Ex: ${smsType === 'sms' ? '20000' : '15000'}`}
                          value={smsVolume}
                          onChange={(e) => setSmsVolume(e.target.value)}
                        />
                        {smsOptions.duplicateCampaign && campaignMonthsNumber > 1 && (
                          <p className="text-xs text-muted-foreground">
                            Nombre total de {smsType === 'sms' ? 'SMS' : 'RCS'} :{' '}
                            <span className="font-medium">
                              {totalUnitsNumber.toLocaleString('fr-FR')}
                            </span>{' '}
                            ({smsVolumeNumber.toLocaleString('fr-FR')} par campagne x {campaignMonthsNumber} mois)
                          </p>
                        )}
                        {smsType === 'rcs' && smsVolumeNumber > 0 && smsVolumeNumber < 10_000 && (
                          <p className="text-xs text-red-600 font-medium">
                            Volume minimum requis : 10 000 RCS
                          </p>
                        )}
                      </div>

                      {smsType === 'sms' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                              Prix unitaire HT
                            </div>
                            <div className="text-lg font-semibold">
                              {smsVolumeNumber > 0 && smsUnitPrice > 0
                                ? `${smsUnitPrice.toFixed(4).replace('.', ',')} €`
                                : '--'}
                            </div>
                            <div className="text-xs text-muted-foreground leading-snug">
                              {smsOptions.tarifIntermarche ? (
                                <>Tarif Intermarché : 0,12 € / SMS (PU fixe, quel que soit le volume).</>
                              ) : (
                                <>
                                  Base :{' '}
                                  {smsBasePU > 0
                                    ? `${smsBasePU.toFixed(4).replace('.', ',')} €`
                                    : '--'}{' '}
                                  {smsOptionPU > 0 && (
                                    <>
                                      <br />
                                      Options : +{smsOptionPU.toFixed(3).replace('.', ',')} € / SMS
                                    </>
                                  )}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                              Prix total HT
                            </div>
                            <div className="text-lg font-semibold text-[#E94C16]">
                              {smsTotalPrice > 0
                                ? `${smsTotalPrice
                                    .toFixed(2)
                                    .toString()
                                    .replace('.', ',')
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`
                                : '--'}
                            </div>
                            <div className="text-xs text-muted-foreground leading-snug">
                              Inclut les frais fixes de mise en place : 190 €.
                              {smsOptions.duplicateCampaign && campaignMonthsNumber > 1 ? ' Une seule fois.' : ''}
                            </div>
                          </div>
                        </div>
                      )}

                      {smsType === 'rcs' && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                              Prix unitaire HT
                            </div>
                            <div className="text-lg font-semibold">
                              {smsVolumeNumber >= 10_000 && rcsBasePU > 0
                                ? `${rcsBasePU.toFixed(2).replace('.', ',')} €`
                                : smsVolumeNumber > 0 && smsVolumeNumber < 10_000
                                  ? 'Interdit'
                                  : '--'}
                            </div>
                            <div className="text-xs text-muted-foreground leading-snug">
                              {smsVolumeNumber >= 10_000 && (
                                <>
                                  {smsVolumeNumber <= 50_000
                                    ? 'Tranche : 10 000 - 50 000 RCS'
                                    : 'Tranche : 50 001+ RCS'}
                                </>
                              )}
                            </div>
                          </div>

                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground uppercase tracking-wide">
                              Prix total HT
                            </div>
                            <div className="text-lg font-semibold text-[#E94C16]">
                              {rcsTotalPrice > 0
                                ? `${rcsTotalPrice
                                    .toFixed(2)
                                    .toString()
                                    .replace('.', ',')
                                    .replace(/\B(?=(\d{3})+(?!\d))/g, ' ')} €`
                                : smsVolumeNumber > 0 && smsVolumeNumber < 10_000
                                  ? 'Interdit'
                                  : '--'}
                            </div>
                            <div className="text-xs text-muted-foreground leading-snug space-y-1">
                              <p>
                                Frais fixes (set up obligatoire) : 250 €
                                {smsOptions.agent && (
                                  <>
                                    <br />
                                    Création d&apos;agent : +550 €
                                  </>
                                )}
                                {smsOptions.creaByLink && (
                                  <>
                                    <br />
                                    CREA BY LINK : +{100 * creaByLinkCountNumber} € {creaByLinkCountNumber > 1 && `(${creaByLinkCountNumber} × 100 €)`}
                                  </>
                                )}
                              </p>

                              {smsOptions.tarifIntermarche && (
                                <div className="mt-1 space-y-0.5 text-xs">
                                  <p className="font-semibold text-[#E94C16]">
                                    POSSIBILITÉ D&apos;OFFRIR LES FRAIS DE SET UP SI BESOIN.
                                  </p>
                                  <p className="font-semibold text-[#E94C16]">
                                    NÉGO CRÉA AGENT POSSIBLE.
                                  </p>
                                </div>
                              )}

                              {smsOptions.duplicateCampaign && campaignMonthsNumber > 1 && (
                                <p className="mt-2 font-semibold text-[#E94C16]">
                                  × {campaignMonthsNumber} mois
                                </p>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
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

                {/* Bouton de téléchargement PDF */}
                <div className="mt-6 flex justify-center">
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
                      disabled={smsVolumeNumber < 10_000 || rcsBasePU <= 0 || rcsTotalPrice <= 0}
                      className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Télécharger le devis RCS en PDF
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

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
          }
          setCalendarDialogOpen(open)
        }}
      >
        <DialogContent className="max-w-5xl w-full">
          <DialogHeader>
            <DialogTitle>Calendrier stratégique</DialogTitle>
            <DialogDescription>
              Cliquez sur une plateforme dans la légende puis sur un jour du calendrier pour définir sa date de début. Les pastilles affichent les jours de diffusion.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {calendarStrategyId && (() => {
              const block = strategies.find((s) => s.id === calendarStrategyId)
              if (!block) return null
              const duration = Math.max(1, Math.floor(parseFloat(diffusionDays) || 14))
              const daysBetween = (a: string, b: string) =>
                Math.round((new Date(b + 'T12:00:00').getTime() - new Date(a + 'T12:00:00').getTime()) / (24 * 60 * 60 * 1000))
              const platformSources: CalendarPlatformSource[] = block.items.map((item) => ({
                platform: `${item.platform}::${item.objective}`,
                budget: item.budget,
                kpiLabel: item.customKpiLabel
                  ? item.customKpiLabel
                  : item.estimatedKPIs > 0
                    ? `${item.estimatedKPIs.toLocaleString('fr-FR')} ${getKpiUnitLabel(item.objective)}`
                    : getMaxKpiLabel(item.objective),
                maxDays: Math.max(1, item.days ?? duration),
              }))
              const starts = block.items.map((it) => {
                const key = `${it.platform}::${it.objective}`
                return defineDatesPerPlatform[key] ?? new Date().toISOString().slice(0, 10)
              })
              const globalStart = starts.reduce((min, d) => (d < min ? d : min), starts[0]!)
              let globalEndDay = 0
              const computedItems = block.items.map((item, i) => {
                const key = `${item.platform}::${item.objective}`
                const startDate = defineDatesPerPlatform[key] ?? globalStart
                const startDay = Math.max(0, daysBetween(globalStart, startDate))
                const length = Math.max(1, item.days ?? duration)
                globalEndDay = Math.max(globalEndDay, startDay + length)
                return {
                  platform: item.platform,
                  startDay,
                  length,
                  budget: item.budget,
                  kpiLabel: platformSources[i]!.kpiLabel,
                  objective: item.objective,
                }
              })
              const existingFromForm: StrategyCalendarData = {
                startDate: globalStart,
                duration: globalEndDay,
                items: computedItems,
              }
              return (
                block.items.length === 0 ? (
                  <p className="text-sm text-muted-foreground">Ajoutez au moins une ligne à cette stratégie pour afficher le calendrier.</p>
                ) : (
                  <>
                    <p className="text-sm text-muted-foreground mb-2">
                      Cliquez sur une plateforme dans la légende pour la sélectionner : vous pouvez définir sa date de
                      début en cliquant sur un jour, et modifier le nombre de jours de diffusion dans le champ « Jours ».
                      Les pastilles et la couleur dans la stratégie se mettent à jour (rouge / orange si les règles ne
                      sont pas respectées).
                    </p>
                    <StrategyCalendarBuilder
                      key={`${calendarStrategyId}-${globalStart}-${globalEndDay}`}
                      platformSources={platformSources}
                      duration={existingFromForm.duration}
                      existing={existingFromForm}
                      onPlatformStartDateChange={(entryKey, startDate) =>
                        setDefineDatesPerPlatform((prev) => ({ ...prev, [entryKey]: startDate }))
                      }
                      onPlatformDaysChange={(entryKey, days) => {
                        setStrategies((prev) =>
                          prev.map((s) =>
                            s.id !== calendarStrategyId
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
                                        }
                                  ),
                                }
                          )
                        )
                      }}
                      calendarWarnings={getCalendarWarningsForBlock(block)}
                    />
                  </>
                )
              )
            })()}
          </div>
        </DialogContent>
      </Dialog>

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
              <Input
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
            <div className="space-y-2">
              <Label htmlFor="client-comment">Commentaire (optionnel)</Label>
              <Input
                id="client-comment"
                placeholder="Ex: Campagne janvier 2026"
                value={pdfClientComment}
                onChange={(e) => setPdfClientComment(e.target.value)}
              />
            </div>
            <div className="flex items-center space-x-2 pt-1">
              <Checkbox
                id="show-ae-pdf"
                checked={showAeInPdf}
                onCheckedChange={(checked) => setShowAeInPdf(!!checked)}
              />
              <Label htmlFor="show-ae-pdf" className="text-sm font-normal">
                Afficher le % d&apos;AE dans le PDF
              </Label>
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
              <Input
                id="validation-message"
                placeholder="Votre message pour la validation..."
                value={validationMessage}
                onChange={(e) => setValidationMessage(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="client-name-tm">Nom du client (optionnel)</Label>
              <Input
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

      {/* Modale pour export PDF SMS/RCS */}
      <Dialog open={smsPdfDialogOpen} onOpenChange={setSmsPdfDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Télécharger le devis {currentSmsType === 'sms' ? 'SMS' : 'RCS'}</DialogTitle>
            <DialogDescription>
              Personnalisez votre devis avant de le télécharger.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            {/* Nom du fichier */}
            <div className="space-y-2">
              <Label htmlFor="pdf-filename">Nom du fichier *</Label>
              <Input
                id="pdf-filename"
                placeholder={`Ex: devis-${currentSmsType}-client`}
                value={smsPdfFileName}
                onChange={(e) => setSmsPdfFileName(e.target.value)}
              />
            </div>

            {/* Commentaire */}
            <div className="space-y-2">
              <Label htmlFor="pdf-comment">Commentaire (optionnel)</Label>
              <Input
                id="pdf-comment"
                placeholder="Ex: Campagne janvier 2026"
                value={smsPdfComment}
                onChange={(e) => setSmsPdfComment(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Ce commentaire apparaîtra en sous-titre du document
              </p>
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
                setSmsPdfComment('')
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
    </div>
  )
}
