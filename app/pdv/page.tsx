'use client'

import { useState, useMemo, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calculator, TrendingUp, Plus, Trash2, Download, FileSpreadsheet, ChevronDown } from "lucide-react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts'
import { UNIT_COSTS, calculatePriceForKPIs, calculateKPIsForBudget } from '@/lib/pdv-calculations'
import * as XLSX from 'xlsx'
import { Document, Page, Text, View, StyleSheet, pdf } from '@react-pdf/renderer'
import supabase from '@/utils/supabase/client'
import Image from 'next/image'

// Liste des plateformes dans l'ordre souhaité
const PLATFORMS_ORDER = ['META', 'Display', 'Insta only', 'Youtube', 'LinkedIn', 'Snapchat', 'Tiktok', 'Spotify']

const PLATFORM_LOGOS: Partial<Record<(typeof PLATFORMS_ORDER)[number], string>> = {
  META: '/images/Logo META.png',
  Display: '/images/Logo Google.png',
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

const LINKEDIN_CUSTOM_OBJECTIVES = ['Impressions', 'Clics', 'Leads'] as const

const CUSTOM_OBJECTIVES: Record<(typeof PLATFORMS_ORDER)[number], readonly string[]> = {
  META: META_CUSTOM_OBJECTIVES,
  Display: DEFAULT_CUSTOM_OBJECTIVES,
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
        <Image src={src} alt={platform} fill className="object-contain" />
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

type CalculationMode = 'budget-to-kpis' | 'kpis-to-budget'
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
}

interface StrategyBlock {
  id: string
  name: string
  items: StrategyItem[]
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
    padding: 40,
    fontSize: 12,
    fontFamily: 'Helvetica',
    backgroundColor: '#fafafa',
  },
  title: {
    fontSize: 28,
    marginBottom: 10,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  clientName: {
    fontSize: 18,
    marginBottom: 30,
    color: '#E94C16',
    fontWeight: 'bold',
  },
  summary: {
    marginBottom: 30,
    padding: 15,
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
    fontSize: 11,
    color: '#666666',
  },
  itemValue: {
    fontSize: 11,
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
    borderRadius: 45,
    borderWidth: 8,
    borderColor: '#f3f4f6',
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

// Composant PDF multi-stratégies
const PDFDocument = ({
  strategies,
  clientName,
  userName,
  aePercentage,
}: {
  strategies: StrategyBlock[]
  clientName: string
  userName: string
  aePercentage: number
}) => {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>
          {userName ? `Stratégies de ${userName}` : 'Mes stratégies'}
        </Text>
        <Text style={styles.clientName}>Client : {clientName}</Text>

        {strategies.map((block, index) => {
          if (!block.items.length) return null

          const total = block.items.reduce((sum, item) => sum + item.budget, 0)
          const kpisTotal = block.items.reduce((sum, item) => sum + item.estimatedKPIs, 0)

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
                      <Text style={styles.summaryText}>
                        {block.items.length} élément
                        {block.items.length > 1 ? 's' : ''} sélectionné
                        {block.items.length > 1 ? 's' : ''}
                      </Text>
                      <Text style={styles.summaryTotal}>
                        Total : {formatNumber(total, 0)} €
                      </Text>
                      <Text style={styles.summaryText}>
                        KPIs totaux : {formatNumber(kpisTotal, 0)}
                      </Text>
                      <Text style={styles.summaryText}>
                        AE :{' '}
                        {strategyAe > 0
                          ? `${formatNumber(strategyAe, 0)} %`
                          : '-'}
                      </Text>
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
                        <Text style={styles.pieCenterText}>100%</Text>
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
                        <Text style={styles.pieCenterText}>100%</Text>
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
                        {item.estimatedKPIs > 0
                          ? `${formatNumber(item.estimatedKPIs, 0)} ${getKpiUnitLabel(item.objective)}${
                              item.objective === 'Leads' ? ' (estimation)' : ''
                            }`
                          : `${getMaxKpiLabel(item.objective)}${
                              item.objective === 'Leads' ? ' (estimation)' : ''
                            }`}
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

export default function PDVPage() {
  // État du formulaire
  const [calculationMode, setCalculationMode] = useState<CalculationMode>('budget-to-kpis')
  const [mainValue, setMainValue] = useState<string>('') // Budget ou KPIs selon le mode
  const [aePercentage, setAePercentage] = useState<string>('40')
  const [diffusionDays, setDiffusionDays] = useState<string>('15')
  
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
  
  // État pour la modale Validation TM
  const [validationTMDialogOpen, setValidationTMDialogOpen] = useState(false)
  const [validationMessage, setValidationMessage] = useState('')
  const [sendingToSlack, setSendingToSlack] = useState(false)
  const [userPseudo, setUserPseudo] = useState<string>('')
  
  // État pour le sélecteur de graphique
  const [chartView, setChartView] = useState<ChartView>('platform')
  
  // État pour le nom de l'utilisateur connecté
  const [userName, setUserName] = useState<string>('')

  // Récupérer le nom de l'utilisateur connecté
  useEffect(() => {
    const getUserName = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          // Essayer de récupérer depuis le profil
          const { data: profile } = await supabase
            .from('profiles')
            .select('full_name')
            .eq('id', session.user.id)
            .maybeSingle()
          
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
    const daysNum = parseFloat(diffusionDays) || 15

    if (!mainValueNum || !daysNum) return rows

    PLATFORMS_ORDER.forEach((platform) => {
      const platformData = UNIT_COSTS[platform]
      if (!platformData) return

      Object.keys(platformData).forEach((objective) => {
        try {
          let budget = 0
          let estimatedKPIs = 0

              if (calculationMode === 'budget-to-kpis') {
                // Budget global → répartition par plateforme/objectif
                budget = mainValueNum // Budget total à répartir
                const result = calculateKPIsForBudget(platform, objective, aeNum, budget)
                estimatedKPIs = Math.ceil(result.calculatedKpis || 0)
              } else {
                // KPIs → Budget nécessaire
                estimatedKPIs = mainValueNum
                const result = calculatePriceForKPIs(platform, objective, aeNum, mainValueNum)
                // Budget total arrondi (pas de décimales)
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
  const addToStrategy = (row: TableRowData) => {
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
        s.id === targetId ? { ...s, items: [...s.items, newItem] } : s,
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

    if (platform === 'Snapchat') {
      // Snapchat : AE / jours (seuils spécifiques 10 / 15)
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
    
    const doc = (
      <PDFDocument
        strategies={strategies}
        clientName={clientName}
        userName={userName}
        aePercentage={parseFloat(aePercentage) || 0}
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
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData.error || 'Erreur lors de la sauvegarde de la validation')
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

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="max-w-[1600px] mx-auto">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-3">Calculateur PDV</h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Calculez vos prix de vente selon la plateforme, l'objectif et votre budget. Unifiez vos simulations en un seul endroit.
          </p>
        </div>

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
                    <TabsList className="grid w-full grid-cols-2">
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
                    <Input
                      type="number"
                      placeholder={calculationMode === 'budget-to-kpis' ? 'Ex: 5000' : 'Ex: 10000'}
                      value={mainValue}
                      onChange={(e) => setMainValue(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>% AE</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 40 pour 40 %"
                      value={aePercentage}
                      onChange={(e) => setAePercentage(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Jours de diffusion</Label>
                    <Input
                      type="number"
                      placeholder="Ex: 15"
                      value={diffusionDays}
                      onChange={(e) => setDiffusionDays(e.target.value)}
                    />
                  </div>
                </div>
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
                {PLATFORMS_ORDER.map((platform) => {
                  const platformRows = groupedByPlatform[platform] || []
                  if (platformRows.length === 0) return null

                  const custom = customRows[platform] ?? { objective: '', budget: '' }
                  const referenceRowForObjective = platformRows.find(
                    (r) => r.objective === custom.objective,
                  )
                  const referenceRow = referenceRowForObjective ?? platformRows[0]
                  const customBudgetNum = referenceRow?.budget ?? 0
                  const customDailyBudget = referenceRow?.dailyBudget ?? 0
                  const customAeCheckValue = referenceRow?.aeCheckValue ?? 0
                  const customRowColor = getAeColorClass(platform, customAeCheckValue)
                  const objectivesForPlatform = CUSTOM_OBJECTIVES[platform] ?? DEFAULT_CUSTOM_OBJECTIVES
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
                              {platformRows.map((row, index) => {
                                const colorClass = getAeColorClass(row.platform, row.aeCheckValue)
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

                              {/* Ligne personnalisable */}
                              <TableRow className={customRowColor}>
                                <TableCell>
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
                                          // Pour les objectifs \"max\" (non présents dans les lignes standard),
                                          // on ne stocke pas de KPIs chiffrés : on met 0 pour afficher \"-\".
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
                                const colorClass = getAeColorClass(item.platform, item.aeCheckValue)
                                return (
                                  <div
                                    key={item.id}
                                    className={`p-3 rounded-lg border ${colorClass} flex items-start justify-between gap-2`}
                                  >
                                    <div className="flex-1 min-w-0">
                                      <div className="font-medium text-sm">
                                        <PlatformBadge platform={item.platform} />
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
                                        {item.estimatedKPIs > 0 ? (
                                          <>
                                            {`${item.estimatedKPIs.toLocaleString(
                                              'fr-FR',
                                            )} ${getKpiUnitLabel(item.objective)}${
                                              item.objective === 'Leads' ? ' (estimation)' : ''
                                            }`}
                                          </>
                                        ) : (
                                          `${getMaxKpiLabel(item.objective)}${
                                            item.objective === 'Leads' ? ' (estimation)' : ''
                                          }`
                                        )}
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
                                  <TabsList className="grid w-full grid-cols-2">
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
      </div>

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
    </div>
  )
}
