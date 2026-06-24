'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { cn } from '@/lib/utils'
import {
  STUDIO_TARIFS_ROWS,
  STUDIO_TARIFS_SECTIONS,
  STUDIO_TARIFS_VALIDATION_NOTE,
  computeStudioTarifsGrid,
  createInitialStudioTarifsState,
  formatStudioEuro,
  type StudioTarifsRow,
  type StudioTarifsSectionId,
  type StudioTarifsSelectionState,
} from '@/lib/studio-tarifs-grid'
import { ExternalLink, Mail, Palette, RotateCcw } from 'lucide-react'

const STUDIO_BUDGET_MAILTO =
  'mailto:?subject=Demande%20approche%20budg%C3%A9taire%20studio%20Link%20Academy'

function MultilineText({ text }: { text: string }) {
  const parts = text.split('\n').filter(Boolean)
  if (parts.length <= 1) return <span>{text}</span>
  return (
    <span className="block space-y-1">
      {parts.map((line, index) => (
        <span key={index} className="block">
          {line}
        </span>
      ))}
    </span>
  )
}

function PrestationCell({ row }: { row: StudioTarifsRow }) {
  return (
    <div className="space-y-0.5">
      <span className="font-medium text-foreground">{row.label}</span>
      {row.variant ? (
        <span className="block text-sm text-muted-foreground">{row.variant}</span>
      ) : null}
    </div>
  )
}

function TarifCell({ row }: { row: StudioTarifsRow }) {
  if (row.kind === 'on_demand') {
    return (
      <Button asChild variant="link" size="sm" className="h-auto px-0 text-left whitespace-normal">
        <a href={STUDIO_BUDGET_MAILTO}>
          {row.rateLabel ?? row.onDemandPriceNote}
        </a>
      </Button>
    )
  }
  if (row.rateHT !== undefined) {
    return <span className="font-semibold tabular-nums">{formatStudioEuro(row.rateHT)}</span>
  }
  return <span className="text-muted-foreground">—</span>
}

function LinePriceCell({
  row,
  linePrice,
  selected,
}: {
  row: StudioTarifsRow
  linePrice: number
  selected: boolean
}) {
  if (row.kind === 'on_demand') {
    return (
      <span className="text-xs text-muted-foreground">
        {row.onDemandPriceNote ? (
          <Button asChild variant="link" size="sm" className="h-auto px-0 text-left whitespace-normal">
            <a href={STUDIO_BUDGET_MAILTO}>{row.onDemandPriceNote}</a>
          </Button>
        ) : (
          '—'
        )}
      </span>
    )
  }
  if (!selected || linePrice <= 0) {
    return <span className="text-muted-foreground">—</span>
  }
  return (
    <span className="font-semibold tabular-nums text-[#E94C16]">
      {formatStudioEuro(linePrice)}
    </span>
  )
}

type StudioTarifsTableProps = {
  sectionId: StudioTarifsSectionId
  lines: ReturnType<typeof computeStudioTarifsGrid>['lines']
  state: StudioTarifsSelectionState
  onToggle: (id: string, checked: boolean) => void
  onQuantityChange: (id: string, value: string) => void
}

function StudioTarifsTable({
  sectionId,
  lines,
  state,
  onToggle,
  onQuantityChange,
}: StudioTarifsTableProps) {
  const sectionLines = lines.filter((line) => line.row.sectionId === sectionId)
  if (sectionLines.length === 0) return null

  return (
    <>
      <div className="hidden lg:block overflow-x-auto rounded-lg border border-border/70">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50 hover:bg-muted/50">
              <TableHead className="w-[52px]">Besoin</TableHead>
              <TableHead className="min-w-[180px]">Prestation</TableHead>
              <TableHead className="w-[88px]">Nombre</TableHead>
              <TableHead className="min-w-[220px]">Explication</TableHead>
              <TableHead className="min-w-[120px] bg-amber-50/80 dark:bg-amber-950/20">
                Tarif (HT)
              </TableHead>
              <TableHead className="min-w-[160px]">Conditions</TableHead>
              <TableHead className="min-w-[120px] bg-amber-50/80 dark:bg-amber-950/20 text-right">
                Prix de vente
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sectionLines.map(({ row, selected, linePrice }) => {
              const entry = state[row.id]!
              const isPriced = row.kind === 'priced'
              return (
                <TableRow
                  key={row.id}
                  className={cn(selected && 'bg-[#E94C16]/5 hover:bg-[#E94C16]/8')}
                >
                  <TableCell>
                    <Checkbox
                      checked={selected}
                      onCheckedChange={(checked) => onToggle(row.id, checked === true)}
                      aria-label={`Sélectionner ${row.label}`}
                    />
                  </TableCell>
                  <TableCell>
                    <PrestationCell row={row} />
                  </TableCell>
                  <TableCell>
                    {isPriced ? (
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={entry.quantity}
                        onChange={(event) => onQuantityChange(row.id, event.target.value)}
                        disabled={!selected}
                        className="h-9 w-20 tabular-nums"
                        aria-label={`Quantité pour ${row.label}`}
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    <MultilineText text={row.explanation} />
                  </TableCell>
                  <TableCell className="bg-amber-50/50 dark:bg-amber-950/10 text-sm">
                    <TarifCell row={row} />
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {row.conditions ? <MultilineText text={row.conditions} /> : '—'}
                  </TableCell>
                  <TableCell className="bg-amber-50/50 dark:bg-amber-950/10 text-right">
                    <LinePriceCell row={row} linePrice={linePrice} selected={selected} />
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      <div className="space-y-3 lg:hidden">
        {sectionLines.map(({ row, selected, linePrice }) => {
          const entry = state[row.id]!
          const isPriced = row.kind === 'priced'
          return (
            <Card
              key={row.id}
              className={cn(
                'border-border/70',
                selected && 'border-[#E94C16]/40 bg-[#E94C16]/5',
              )}
            >
              <CardContent className="space-y-3 p-4">
                <div className="flex items-start gap-3">
                  <Checkbox
                    checked={selected}
                    onCheckedChange={(checked) => onToggle(row.id, checked === true)}
                    aria-label={`Sélectionner ${row.label}`}
                    className="mt-1"
                  />
                  <div className="min-w-0 flex-1 space-y-2">
                    <PrestationCell row={row} />
                    {row.explanation ? (
                      <p className="text-sm text-muted-foreground">
                        <MultilineText text={row.explanation} />
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Nombre
                    </p>
                    {isPriced ? (
                      <Input
                        type="text"
                        inputMode="decimal"
                        value={entry.quantity}
                        onChange={(event) => onQuantityChange(row.id, event.target.value)}
                        disabled={!selected}
                        className="h-9 tabular-nums"
                      />
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Tarif (HT)
                    </p>
                    <TarifCell row={row} />
                  </div>
                  {row.conditions ? (
                    <div className="col-span-2">
                      <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                        Conditions
                      </p>
                      <p className="text-muted-foreground">
                        <MultilineText text={row.conditions} />
                      </p>
                    </div>
                  ) : null}
                  <div className="col-span-2 rounded-md bg-amber-50/80 px-3 py-2 dark:bg-amber-950/20">
                    <p className="mb-1 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                      Prix de vente
                    </p>
                    <LinePriceCell row={row} linePrice={linePrice} selected={selected} />
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </>
  )
}

export function StudioTarifsPanel() {
  const [state, setState] = useState<StudioTarifsSelectionState>(() =>
    createInitialStudioTarifsState(),
  )

  const computed = useMemo(() => computeStudioTarifsGrid(state), [state])

  const onToggle = (id: string, checked: boolean) => {
    setState((current) => ({
      ...current,
      [id]: { ...current[id]!, selected: checked },
    }))
  }

  const onQuantityChange = (id: string, value: string) => {
    setState((current) => ({
      ...current,
      [id]: { ...current[id]!, quantity: value },
    }))
  }

  const resetSelection = () => setState(createInitialStudioTarifsState())

  return (
    <div className="container mx-auto px-4 py-6 md:py-12">
      <div className="mx-auto max-w-[1400px]">
        <div className="mb-8 text-center">
          <div className="mb-3 flex items-center justify-center gap-2">
            <Palette className="h-8 w-8 text-[#E94C16]" aria-hidden />
            <Badge variant="secondary" className="text-xs">
              Admin
            </Badge>
          </div>
          <h1 className="mb-3 text-4xl font-bold">Calculateur Vente 2 — Tarifs studio</h1>
          <p className="mx-auto max-w-3xl text-lg text-muted-foreground">
            Grille PDV studio Link Academy — cochez les prestations, saisissez les quantités et
            obtenez un total HT/TTC conforme à la grille de référence.
          </p>
        </div>

        <div className="mb-6 flex flex-col gap-4 lg:sticky lg:top-4 lg:z-10 lg:flex-row lg:items-stretch">
          <Card className="flex-1 border-[#E94C16]/30 bg-[#E94C16]/5">
            <CardContent className="flex h-full items-center p-4 text-sm font-medium">
              {STUDIO_TARIFS_VALIDATION_NOTE}
            </CardContent>
          </Card>

          <Card className="w-full lg:w-[320px] border-border/80 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Synthèse devis</CardTitle>
              <CardDescription>
                {computed.selectedCount > 0
                  ? `${computed.selectedCount} prestation${computed.selectedCount > 1 ? 's' : ''} sélectionnée${computed.selectedCount > 1 ? 's' : ''}`
                  : 'Aucune prestation sélectionnée'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Total HT (hors sur demande vidéo)</span>
                <span className="font-semibold tabular-nums">{formatStudioEuro(computed.subtotalI)}</span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">Total HT</span>
                <span className="font-semibold tabular-nums">{formatStudioEuro(computed.subtotalJ)}</span>
              </div>
              <div className="flex items-center justify-between gap-3 border-t pt-2">
                <span className="font-medium">Total TTC (20 %)</span>
                <span className="text-lg font-bold tabular-nums text-[#E94C16]">
                  {formatStudioEuro(computed.ttc)}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="mt-2 w-full"
                onClick={resetSelection}
                disabled={computed.selectedCount === 0}
              >
                <RotateCcw className="mr-2 h-4 w-4" aria-hidden />
                Réinitialiser
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mb-6 flex flex-wrap gap-2">
          <Button asChild variant="outline" size="sm">
            <a href={STUDIO_BUDGET_MAILTO}>
              <Mail className="mr-2 h-4 w-4" aria-hidden />
              Demander une approche budgétaire
            </a>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/studio">
              Guide des formats studio
              <ExternalLink className="ml-2 h-4 w-4" aria-hidden />
            </Link>
          </Button>
          <Button asChild variant="outline" size="sm">
            <Link href="/documents">Documents de référence</Link>
          </Button>
        </div>

        <div className="space-y-8">
          {STUDIO_TARIFS_SECTIONS.map((section) => (
            <section key={section.id} aria-labelledby={`studio-section-${section.id}`}>
              <div className="mb-4 flex items-center gap-3">
                <div className="h-8 w-1.5 rounded-full bg-[#E94C16]" aria-hidden />
                <h2
                  id={`studio-section-${section.id}`}
                  className="text-xl font-semibold tracking-tight"
                >
                  {section.label}
                </h2>
                <Badge variant="outline" className="text-xs">
                  {STUDIO_TARIFS_ROWS.filter((row) => row.sectionId === section.id).length} lignes
                </Badge>
              </div>
              <StudioTarifsTable
                sectionId={section.id}
                lines={computed.lines}
                state={state}
                onToggle={onToggle}
                onQuantityChange={onQuantityChange}
              />
            </section>
          ))}
        </div>

        <p className="mt-8 text-center text-xs text-muted-foreground">
          Formules alignées sur la grille Numbers « Nouvelle grille PDV studio » — ligne tarifée :
          cochée × (tarif HT × quantité) ; PSD : base + 20 % du sous-total HT hors sur demande vidéo.
        </p>
      </div>
    </div>
  )
}
