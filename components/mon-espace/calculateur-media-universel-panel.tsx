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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
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

function gapToneClass(value: number | null): string {
  if (value == null || value === 0) return 'text-muted-foreground'
  if (value > 0) return 'text-green-700 font-semibold'
  return 'text-red-700 font-semibold'
}

const inputCellClassName = 'min-w-[120px] bg-amber-50/80'

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
          Meilleur atterissage
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
        <CardContent>
          <div className="overflow-x-auto rounded-md border">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50 hover:bg-muted/50">
                  <TableHead className="min-w-[110px]">Type KPI</TableHead>
                  <TableHead className="min-w-[120px] bg-amber-50/80">Budget N-1 (€)</TableHead>
                  <TableHead className="min-w-[120px] bg-amber-50/80">Volume N-1</TableHead>
                  <TableHead className="min-w-[120px] bg-amber-50/80">Budget N (€)</TableHead>
                  <TableHead className="min-w-[110px] bg-amber-50/80">% amélioration</TableHead>
                  <TableHead className="min-w-[130px]">Coût unitaire N-1</TableHead>
                  <TableHead className="min-w-[130px]">Coût unitaire cible</TableHead>
                  <TableHead className="min-w-[120px]">Volume cible</TableHead>
                  <TableHead className="min-w-[120px]">Écart vs N-1</TableHead>
                  <TableHead className="w-12" />
                </TableRow>
              </TableHeader>
              <TableBody>
                {computedRows.map(({ row, result }) => (
                  <TableRow key={row.id}>
                    <TableCell>
                      <Select
                        value={row.kpiType}
                        onValueChange={(value) =>
                          updateRow(row.id, { kpiType: value as MediaKpiType })
                        }
                      >
                        <SelectTrigger className={inputCellClassName}>
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
                    </TableCell>
                    <TableCell>
                      <Input
                        inputMode="decimal"
                        value={row.budgetN1}
                        onChange={(event) => updateRow(row.id, { budgetN1: event.target.value })}
                        className={inputCellClassName}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        inputMode="decimal"
                        value={row.volumeN1}
                        onChange={(event) => updateRow(row.id, { volumeN1: event.target.value })}
                        className={inputCellClassName}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        inputMode="decimal"
                        value={row.budgetN}
                        onChange={(event) => updateRow(row.id, { budgetN: event.target.value })}
                        className={inputCellClassName}
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        inputMode="decimal"
                        value={row.improvementPercent}
                        onChange={(event) =>
                          updateRow(row.id, { improvementPercent: event.target.value })
                        }
                        className={inputCellClassName}
                      />
                    </TableCell>
                    <TableCell className="tabular-nums">{formatMediaUnitCost(result.unitCostN1)}</TableCell>
                    <TableCell className="tabular-nums">
                      {formatMediaUnitCost(result.targetUnitCost)}
                    </TableCell>
                    <TableCell className="tabular-nums">{formatMediaVolume(result.targetVolume)}</TableCell>
                    <TableCell className={cn('tabular-nums', gapToneClass(result.gapVsN1))}>
                      {formatMediaGap(result.gapVsN1)}
                    </TableCell>
                    <TableCell>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRow(row.id)}
                        disabled={rows.length <= 1}
                        aria-label="Supprimer la ligne"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
