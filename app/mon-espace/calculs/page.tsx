'use client'

import { useMemo, useState } from 'react'
import { Calculator } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  computeBudgetHtFromTtc,
  computeBudgetTtcFromHt,
  computeCpmCpcRows,
  formatCalculatorCurrency,
  formatCalculatorInteger,
  formatCalculatorRatio,
  parseCalculatorNumber,
  type CpmCpcRowKey,
} from '@/lib/calcul-cpm-cpc'

type InputField = 'reel' | 'vente'

const INPUT_ROW_KEYS = new Set<CpmCpcRowKey>([
  'depenses',
  'impressions',
  'couverture',
  'clics',
  'clicsSurLien',
])

const INTEGER_ROW_KEYS = new Set<CpmCpcRowKey>([
  'impressions',
  'couverture',
  'clics',
  'clicsSurLien',
])

const CURRENCY_ROW_KEYS = new Set<CpmCpcRowKey>(['depenses', 'cpcClics', 'cpcClicsSurLien'])

const EURO_ROW_KEYS = new Set<CpmCpcRowKey>([
  'cpmImpressions',
  'cpmCouverture',
  'cpcClics',
  'cpcClicsSurLien',
])

const COST_ROW_KEYS = new Set<CpmCpcRowKey>([
  'cpmImpressions',
  'cpmCouverture',
  'cpcClics',
  'cpcClicsSurLien',
])

const ROW_GROUPS: { keys: CpmCpcRowKey[] }[] = [
  { keys: ['depenses'] },
  { keys: ['impressions', 'cpmImpressions'] },
  { keys: ['couverture', 'cpmCouverture'] },
  { keys: ['clics', 'cpcClics'] },
  { keys: ['clicsSurLien', 'cpcClicsSurLien'] },
]

const ENCART_BORDER = 'border-2 border-neutral-500 rounded-sm box-border'
const ROW_DIVIDER = 'border-t border-dashed border-neutral-400'
const TABLE_GRID = 'grid grid-cols-[180px_minmax(0,1fr)_minmax(0,1fr)_104px] gap-x-3'
const ROW_HEIGHT = 'min-h-[44px]'

function formatDeltaPercent(value: number | null): string {
  if (value == null) return '—'
  return `${(value * 100).toLocaleString('fr-FR', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })} %`
}

function deltaToneClass(
  delta: number | null,
  options: { isNeutralRow?: boolean; rowKey?: CpmCpcRowKey } = {},
): string {
  const { isNeutralRow = false, rowKey } = options
  if (isNeutralRow || delta == null) return 'bg-muted/70'

  const lowerIsBetter = rowKey != null && COST_ROW_KEYS.has(rowKey)
  if (lowerIsBetter) {
    if (delta < 1) return 'bg-green-100 text-green-900'
    if (delta > 1) return 'bg-red-100 text-red-900'
    return 'bg-muted/70'
  }

  if (delta > 1) return 'bg-green-100 text-green-900'
  if (delta < 1) return 'bg-red-100 text-red-900'
  return 'bg-muted/70'
}

function formatDisplayValue(key: CpmCpcRowKey, value: number | null): string {
  if (INTEGER_ROW_KEYS.has(key)) return formatCalculatorInteger(value)
  if (EURO_ROW_KEYS.has(key)) {
    if (value == null) return '—'
    return `${formatCalculatorCurrency(value)} €`
  }
  if (CURRENCY_ROW_KEYS.has(key)) return formatCalculatorCurrency(value)
  return formatCalculatorRatio(value)
}

function fieldKey(rowKey: CpmCpcRowKey, field: InputField): string {
  return `${rowKey}${field === 'reel' ? 'Reel' : 'Vente'}`
}

function renderValueCell(
  rowKey: CpmCpcRowKey,
  field: InputField,
  value: number | null,
  values: Record<string, string>,
  updateValue: (key: string, next: string) => void,
  shaded: boolean,
) {
  const cellClass = `flex ${ROW_HEIGHT} items-center px-3 py-2 ${shaded ? 'bg-muted/60' : 'bg-white'}`

  if (INPUT_ROW_KEYS.has(rowKey)) {
    return (
      <div className={cellClass}>
        <Input
          inputMode="decimal"
          value={values[fieldKey(rowKey, field)] ?? ''}
          onChange={(e) => updateValue(fieldKey(rowKey, field), e.target.value)}
          className="h-9 w-full border-neutral-300 bg-white"
        />
      </div>
    )
  }

  return (
    <div className={`${cellClass} justify-end tabular-nums font-medium`}>
      {formatDisplayValue(rowKey, value)}
    </div>
  )
}

export default function CalculCpmCpcPage() {
  const [values, setValues] = useState<Record<string, string>>({})

  const rows = useMemo(() => {
    const prixDeVente = parseCalculatorNumber(values.prixDeVente ?? '')
    return computeCpmCpcRows({
      depensesReel: prixDeVente,
      depensesVente: prixDeVente,
      impressionsReel: parseCalculatorNumber(values.impressionsReel ?? ''),
      impressionsVente: parseCalculatorNumber(values.impressionsVente ?? ''),
      couvertureReel: parseCalculatorNumber(values.couvertureReel ?? ''),
      couvertureVente: parseCalculatorNumber(values.couvertureVente ?? ''),
      clicsReel: parseCalculatorNumber(values.clicsReel ?? ''),
      clicsVente: parseCalculatorNumber(values.clicsVente ?? ''),
      clicsSurLienReel: parseCalculatorNumber(values.clicsSurLienReel ?? ''),
      clicsSurLienVente: parseCalculatorNumber(values.clicsSurLienVente ?? ''),
    })
  }, [values])

  const budgetTtcFromHt = useMemo(
    () => computeBudgetTtcFromHt(parseCalculatorNumber(values.budgetHt ?? '')),
    [values.budgetHt],
  )

  const budgetHtFromTtc = useMemo(
    () => computeBudgetHtFromTtc(parseCalculatorNumber(values.budgetTtc ?? '')),
    [values.budgetTtc],
  )

  const updateValue = (key: string, next: string) => {
    setValues((prev) => ({ ...prev, [key]: next }))
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="mb-2 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
              <Calculator className="h-6 w-6" aria-hidden />
            </span>
            Calcul des coûts
          </h1>
          <p className="text-muted-foreground">
            Comparez les KPIs atteints et l&apos;objectif vendu, puis convertissez un budget HT / TTC.
          </p>
        </div>

        <Accordion type="single" collapsible className="rounded-lg border border-[#E94C16]/20 bg-orange-50/30 px-4">
          <AccordionItem value="guide" className="border-0">
            <AccordionTrigger className="text-base font-semibold hover:no-underline">
              Comment utiliser ce tableau
            </AccordionTrigger>
            <AccordionContent className="space-y-4 text-sm text-muted-foreground leading-relaxed">
              <div>
                <p className="font-medium text-foreground">1. Renseignez le prix de vente</p>
                <p>
                  Indiquez le budget vendu au client. Il servira à calculer automatiquement les coûts
                  unitaires : CPM et CPC.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">📊 2. Comparez le réalisé à l&apos;objectif</p>
                <p>
                  Remplissez les volumes réellement atteints dans la colonne « KPIs atteints », puis les
                  objectifs prévus dans la colonne « Objectif vendu ».
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">⚙️ 3. Le tableau calcule automatiquement</p>
                <p>Les indicateurs de coût sont générés automatiquement :</p>
                <p>
                  CPM pour les impressions et la couverture, CPC pour les clics et les clics sur lien.
                </p>
              </div>
              <div>
                <p className="font-medium text-foreground">🟢🔴 4. Analysez le Delta</p>
                <p>
                  La colonne Delta indique l&apos;écart entre ce qui a été réalisé et ce qui avait été vendu.
                </p>
                <ul className="mt-2 space-y-2 list-none pl-0">
                  <li>
                    <span className="font-medium text-foreground">Sur les volumes</span> — impressions,
                    couverture, clics :
                    <ul className="mt-1 space-y-1 pl-4">
                      <li>🟢 au-dessus de 100 % = objectif dépassé</li>
                      <li>🔴 en dessous de 100 % = objectif non atteint</li>
                    </ul>
                  </li>
                  <li>
                    <span className="font-medium text-foreground">Sur les coûts</span> — CPM / CPC :
                    <ul className="mt-1 space-y-1 pl-4">
                      <li>
                        🟢 en dessous de 100 % = coût plus bas que prévu, donc performance meilleure
                      </li>
                      <li>🔴 au-dessus de 100 % = coût plus élevé que prévu</li>
                    </ul>
                  </li>
                </ul>
              </div>
              <p>
                ✅ <strong className="text-foreground">En résumé :</strong> ce tableau permet de voir
                rapidement si la campagne a livré plus ou moins que prévu, et si les coûts d&apos;achat
                média sont meilleurs ou moins bons que l&apos;objectif vendu.
              </p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calculator className="h-5 w-5 text-[#E94C16]" aria-hidden />
              Comparatif KPIs atteints / Objectif vendu
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className={`${TABLE_GRID} items-stretch`}>
                <div aria-hidden />
                <div className={`col-span-2 ${ENCART_BORDER} grid grid-cols-2 overflow-hidden bg-muted/70`}>
                  <div className={`${ROW_HEIGHT} flex items-center justify-center px-3 text-center text-sm font-semibold`}>
                    KPIs atteints
                  </div>
                  <div className={`${ROW_HEIGHT} flex items-center justify-center px-3 text-center text-sm font-semibold border-l border-neutral-400`}>
                    Objectif vendu
                  </div>
                </div>
                <div aria-hidden />
              </div>

              {ROW_GROUPS.map((group) => {
                const groupRows = rows.filter((row) => group.keys.includes(row.key))
                const isPair = groupRows.length > 1
                const isPrixDeVente = group.keys.length === 1 && group.keys[0] === 'depenses'

                return (
                  <div
                    key={group.keys.join('-')}
                    className={`${TABLE_GRID} items-stretch`}
                  >
                    <div className={`${ENCART_BORDER} flex flex-col overflow-hidden bg-white`}>
                      {groupRows.map((row, index) => (
                        <div
                          key={row.key}
                          className={`flex ${ROW_HEIGHT} items-center px-3 text-sm font-medium ${
                            index > 0 ? `${ROW_DIVIDER} bg-muted/60` : ''
                          }`}
                        >
                          {row.label}
                        </div>
                      ))}
                    </div>

                    <div className={`col-span-2 ${ENCART_BORDER} overflow-hidden bg-white`}>
                      {isPrixDeVente ? (
                        <div className="grid grid-cols-2 divide-x divide-neutral-400">
                          <div className={`col-span-2 flex ${ROW_HEIGHT} items-center px-3 py-2 bg-white`}>
                            <div className="relative w-full">
                              <Input
                                inputMode="decimal"
                                value={values.prixDeVente ?? ''}
                                onChange={(e) => updateValue('prixDeVente', e.target.value)}
                                className={`h-9 w-full border-neutral-300 bg-white ${
                                  (values.prixDeVente ?? '').trim() ? 'pr-8' : ''
                                }`}
                                aria-label="Prix de vente"
                              />
                              {(values.prixDeVente ?? '').trim() ? (
                                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-sm font-medium text-muted-foreground">
                                  €
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </div>
                      ) : (
                        groupRows.map((row, index) => (
                          <div
                            key={row.key}
                            className={`grid grid-cols-2 divide-x divide-neutral-400 ${index > 0 ? ROW_DIVIDER : ''}`}
                          >
                            {renderValueCell(
                              row.key,
                              'reel',
                              row.reel,
                              values,
                              updateValue,
                              isPair && index > 0,
                            )}
                            {renderValueCell(
                              row.key,
                              'vente',
                              row.vente,
                              values,
                              updateValue,
                              isPair && index > 0,
                            )}
                          </div>
                        ))
                      )}
                    </div>

                    <div className={`${ENCART_BORDER} flex flex-col overflow-hidden ${deltaToneClass(null, { isNeutralRow: true })}`}>
                      {group.keys[0] === 'depenses' ? (
                        <div className={`flex ${ROW_HEIGHT} items-center justify-center px-2 text-sm font-semibold text-muted-foreground`}>
                          Delta
                        </div>
                      ) : (
                        groupRows.map((row, index) => (
                          <div
                            key={row.key}
                            className={`flex ${ROW_HEIGHT} items-center justify-center px-2 tabular-nums text-sm font-semibold ${
                              index > 0 ? ROW_DIVIDER : ''
                            } ${deltaToneClass(row.delta, { rowKey: row.key })}`}
                          >
                            {formatDeltaPercent(row.delta)}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Budget HT → TTC</CardTitle>
              <CardDescription>TTC = Budget HT × 1,2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget-ht">Budget HT</Label>
                <Input
                  id="budget-ht"
                  inputMode="decimal"
                  value={values.budgetHt ?? ''}
                  onChange={(e) => updateValue('budgetHt', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget TTC</Label>
                <p className="rounded-md border bg-muted/40 px-3 py-2 tabular-nums">
                  {formatCalculatorCurrency(budgetTtcFromHt)}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Budget TTC → HT</CardTitle>
              <CardDescription>HT = Budget TTC / 1,2</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="budget-ttc">Budget TTC</Label>
                <Input
                  id="budget-ttc"
                  inputMode="decimal"
                  value={values.budgetTtc ?? ''}
                  onChange={(e) => updateValue('budgetTtc', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Budget HT</Label>
                <p className="rounded-md border bg-muted/40 px-3 py-2 tabular-nums">
                  {formatCalculatorCurrency(budgetHtFromTtc)}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
