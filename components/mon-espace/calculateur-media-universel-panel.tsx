'use client'

import { useMemo, useState } from 'react'
import { Calculator, Plus, Trash2 } from 'lucide-react'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  MEDIA_KPI_TYPES,
  computeMediaCalculatorRow,
  createEmptyMediaCalculatorRow,
  formatMediaGap,
  formatMediaUnitCost,
  formatMediaVolume,
  getMediaKpiDescription,
  type MediaCalculatorRow,
  type MediaKpiType,
} from '@/lib/calculateur-media-universel'
import { cn } from '@/lib/utils'

const COLUMNS = [
  { key: 'kpi', label: 'KPI', title: 'Type KPI' },
  { key: 'budgetN1', label: 'Bdg. N-1', title: 'Budget N-1 (€)' },
  { key: 'volumeN1', label: 'Vol. N-1', title: 'Volume N-1' },
  { key: 'budgetN', label: 'Bdg. N', title: 'Budget N (€)' },
  { key: 'improvement', label: '% amél.', title: '% amélioration' },
  { key: 'unitCostN1', label: 'Coût N-1', title: 'Coût unitaire N-1' },
  { key: 'targetUnitCost', label: 'Coût cible', title: 'Coût unitaire cible' },
  { key: 'targetVolume', label: 'Vol. cible', title: 'Volume cible' },
  { key: 'gap', label: 'Écart', title: 'Écart vs N-1' },
] as const

function gapToneClass(value: number | null): string {
  if (value == null || value === 0) return 'text-muted-foreground'
  if (value > 0) return 'text-green-700 font-semibold'
  return 'text-red-700 font-semibold'
}

const inputClassName = 'h-8 w-full min-w-0 bg-amber-50/80 px-2 text-xs'
const headClassName =
  'px-1.5 py-2 text-left align-middle text-[11px] font-medium leading-tight text-muted-foreground'
const cellClassName = 'px-1.5 py-1.5 align-middle'
const outputClassName = 'text-[11px] tabular-nums leading-tight'

export function CalculateurMediaUniverselPanel() {
  const [rows, setRows] = useState<MediaCalculatorRow[]>([createEmptyMediaCalculatorRow()])

  const computedRows = useMemo(
    () => rows.map((row) => ({ row, result: computeMediaCalculatorRow(row) })),
    [rows],
  )

  const updateRow = (id: string, patch: Partial<MediaCalculatorRow>) => {
    setRows((current) => current.map((row) => (row.id === id ? { ...row, ...patch } : row)))
  }

  const addRow = () => {
    setRows((current) => [...current, createEmptyMediaCalculatorRow()])
  }

  const removeRow = (id: string) => {
    setRows((current) => (current.length <= 1 ? current : current.filter((row) => row.id !== id)))
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="mb-2 flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight sm:text-3xl">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E94C16]/10 text-[#E94C16]">
            <Calculator className="h-6 w-6" aria-hidden />
          </span>
          Atterrissage
        </h1>
        <p className="text-muted-foreground">
          Calculateur média universel CPM, CPC, CPL et CPA — objectifs de volume à partir d&apos;un
          budget et d&apos;une amélioration de coût unitaire.
        </p>
      </div>

      <Accordion type="single" collapsible className="rounded-lg border border-[#E94C16]/20 bg-orange-50/30 px-4">
        <AccordionItem value="guide" className="border-0">
          <AccordionTrigger className="text-base font-semibold hover:no-underline">
            Mode d&apos;emploi
          </AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
            <p>
              Renseignez les colonnes en jaune pour chaque ligne : type de KPI, budgets N-1 et N,
              volume N-1 et pourcentage d&apos;amélioration du coût unitaire.
            </p>
            <div className="space-y-2">
              {MEDIA_KPI_TYPES.map((kpiType) => (
                <p key={kpiType}>
                  <strong className="text-foreground">{kpiType}</strong> — {getMediaKpiDescription(kpiType)}
                </p>
              ))}
            </div>
            <p>
              <strong className="text-foreground">% amélioration :</strong> 10 signifie un coût unitaire
              10&nbsp;% plus bas. 0 signifie le même coût. -5 signifie un coût 5&nbsp;% plus élevé.
            </p>
            <p>
              Le calculateur déduit le coût unitaire N-1, le coût unitaire cible, le volume cible et
              l&apos;écart par rapport au volume N-1.
            </p>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Card>
        <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <CardTitle>Calculateur média universel</CardTitle>
            <CardDescription>CPM · CPC · CPL · CPA</CardDescription>
          </div>
          <Button type="button" variant="outline" onClick={addRow} className="shrink-0">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter une ligne
          </Button>
        </CardHeader>
        <CardContent className="p-3 sm:p-6">
          <div className="space-y-4 lg:hidden">
            {computedRows.map(({ row, result }) => (
              <div key={row.id} className="space-y-3 rounded-md border p-3">
                <div className="flex items-center justify-between gap-2">
                  <Select
                    value={row.kpiType}
                    onValueChange={(value) =>
                      updateRow(row.id, { kpiType: value as MediaKpiType })
                    }
                  >
                    <SelectTrigger className={cn(inputClassName, 'w-[110px]')}>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {MEDIA_KPI_TYPES.map((kpiType) => (
                        <SelectItem key={kpiType} value={kpiType}>
                          {kpiType}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 shrink-0"
                    onClick={() => removeRow(row.id)}
                    disabled={rows.length <= 1}
                    aria-label="Supprimer la ligne"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground">Budget N-1 (€)</span>
                    <Input
                      inputMode="decimal"
                      value={row.budgetN1}
                      onChange={(event) => updateRow(row.id, { budgetN1: event.target.value })}
                      className={inputClassName}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground">Volume N-1</span>
                    <Input
                      inputMode="decimal"
                      value={row.volumeN1}
                      onChange={(event) => updateRow(row.id, { volumeN1: event.target.value })}
                      className={inputClassName}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground">Budget N (€)</span>
                    <Input
                      inputMode="decimal"
                      value={row.budgetN}
                      onChange={(event) => updateRow(row.id, { budgetN: event.target.value })}
                      className={inputClassName}
                    />
                  </label>
                  <label className="space-y-1">
                    <span className="text-[11px] font-medium text-muted-foreground">% amélioration</span>
                    <Input
                      inputMode="decimal"
                      value={row.improvementPercent}
                      onChange={(event) =>
                        updateRow(row.id, { improvementPercent: event.target.value })
                      }
                      className={inputClassName}
                    />
                  </label>
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px] tabular-nums">
                  <div>
                    <span className="text-muted-foreground">Coût N-1</span>
                    <p>{formatMediaUnitCost(result.unitCostN1)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Coût cible</span>
                    <p>{formatMediaUnitCost(result.targetUnitCost)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Vol. cible</span>
                    <p>{formatMediaVolume(result.targetVolume)}</p>
                  </div>
                  <div>
                    <span className="text-muted-foreground">Écart</span>
                    <p className={gapToneClass(result.gapVsN1)}>{formatMediaGap(result.gapVsN1)}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="hidden w-full overflow-hidden rounded-md border lg:block">
            <table className="w-full table-fixed border-collapse text-sm">
              <colgroup>
                <col className="w-[7%]" />
                <col className="w-[10%]" />
                <col className="w-[11%]" />
                <col className="w-[10%]" />
                <col className="w-[8%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[12%]" />
                <col className="w-[6%]" />
              </colgroup>
              <thead>
                <tr className="border-b bg-muted/50">
                  {COLUMNS.map((column) => (
                    <th
                      key={column.key}
                      className={cn(
                        headClassName,
                        ['budgetN1', 'volumeN1', 'budgetN', 'improvement'].includes(column.key) &&
                          'bg-amber-50/80',
                      )}
                      title={column.title}
                    >
                      {column.label}
                    </th>
                  ))}
                  <th className={cn(headClassName, 'text-center')} aria-label="Actions" />
                </tr>
              </thead>
              <tbody>
                {computedRows.map(({ row, result }) => (
                  <tr key={row.id} className="border-b last:border-b-0">
                    <td className={cellClassName}>
                      <Select
                        value={row.kpiType}
                        onValueChange={(value) =>
                          updateRow(row.id, { kpiType: value as MediaKpiType })
                        }
                      >
                        <SelectTrigger className={inputClassName}>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {MEDIA_KPI_TYPES.map((kpiType) => (
                            <SelectItem key={kpiType} value={kpiType}>
                              {kpiType}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className={cellClassName}>
                      <Input
                        inputMode="decimal"
                        value={row.budgetN1}
                        onChange={(event) => updateRow(row.id, { budgetN1: event.target.value })}
                        className={inputClassName}
                      />
                    </td>
                    <td className={cellClassName}>
                      <Input
                        inputMode="decimal"
                        value={row.volumeN1}
                        onChange={(event) => updateRow(row.id, { volumeN1: event.target.value })}
                        className={inputClassName}
                      />
                    </td>
                    <td className={cellClassName}>
                      <Input
                        inputMode="decimal"
                        value={row.budgetN}
                        onChange={(event) => updateRow(row.id, { budgetN: event.target.value })}
                        className={inputClassName}
                      />
                    </td>
                    <td className={cellClassName}>
                      <Input
                        inputMode="decimal"
                        value={row.improvementPercent}
                        onChange={(event) =>
                          updateRow(row.id, { improvementPercent: event.target.value })
                        }
                        className={inputClassName}
                      />
                    </td>
                    <td className={cn(cellClassName, outputClassName)}>
                      {formatMediaUnitCost(result.unitCostN1)}
                    </td>
                    <td className={cn(cellClassName, outputClassName)}>
                      {formatMediaUnitCost(result.targetUnitCost)}
                    </td>
                    <td className={cn(cellClassName, outputClassName)}>
                      {formatMediaVolume(result.targetVolume)}
                    </td>
                    <td className={cn(cellClassName, outputClassName, gapToneClass(result.gapVsN1))}>
                      {formatMediaGap(result.gapVsN1)}
                    </td>
                    <td className={cn(cellClassName, 'text-center')}>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        aria-label="Supprimer la ligne"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
