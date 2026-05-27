'use client'

import React, { useMemo, useState } from 'react'
import { BarChart2 } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
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
  KPI_MAX_PENETRATION_CAP_PCT,
  KPI_MAX_PLATFORM_ORDER,
  computeKpiMaxRowsForEnabledPlatforms,
  kpiMaxDefaultPlatformsEnabled,
  kpiMaxPenetrationPct,
  type KpiMaxComptesParsed,
  type KpiMaxComputedRow,
  type KpiMaxPlatformId,
} from '@/lib/kpi-max-vente2'

const PLATFORM_FIXED_COMMENT: Partial<Record<KpiMaxPlatformId, string>> = {
  display: 'Basé sur META',
  youtube: 'Basé sur META',
}

const PENETRATION_FOOTNOTE = `* Taux plafonné à ${KPI_MAX_PENETRATION_CAP_PCT} %.`

function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function formatPenetration(impressions: number, comptes: number): string {
  return `${formatNumber(kpiMaxPenetrationPct(impressions, comptes), 2)} %*`
}

function parsePositiveInt(s: string): number | null {
  const t = s.trim().replace(/\s/g, '').replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 1) return null
  return Math.floor(n)
}

function parseNonNegativeInt(s: string): number | null {
  const t = s.trim().replace(/\s/g, '').replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.floor(n)
}

function parseDiffusionDays(s: string): number | null {
  const t = s.trim().replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 1) return null
  return Math.floor(n)
}

function comptesUsesMetaBase(id: KpiMaxPlatformId): boolean {
  return id === 'meta' || id === 'display' || id === 'youtube'
}

function computeSinglePlatformRow(
  platformId: KpiMaxPlatformId,
  comptes: KpiMaxComptesParsed,
  diffusionDays: number,
): KpiMaxComputedRow | null {
  const enabled = kpiMaxDefaultPlatformsEnabled()
  enabled[platformId] = true
  const rows = computeKpiMaxRowsForEnabledPlatforms(enabled, comptes, diffusionDays)
  return rows.find((r) => r.id === platformId) ?? null
}

function parseComptesParsed(
  compteMeta: string,
  compteLinkedin: string,
  compteSnapchat: string,
  compteTiktok: string,
): KpiMaxComptesParsed {
  return {
    meta: parsePositiveInt(compteMeta) ?? 0,
    linkedin: parsePositiveInt(compteLinkedin) ?? 0,
    snapchat: parsePositiveInt(compteSnapchat) ?? 0,
    tiktok: parsePositiveInt(compteTiktok) ?? 0,
  }
}

function rowComptesValid(id: KpiMaxPlatformId, comptes: KpiMaxComptesParsed): boolean {
  if (comptesUsesMetaBase(id)) return comptes.meta >= 1
  if (id === 'linkedin') return comptes.linkedin >= 1
  if (id === 'snapchat') return comptes.snapchat >= 1
  return comptes.tiktok >= 1
}

type RowResult = {
  computed: KpiMaxComputedRow | null
  customImpressions: number | null
}

function buildRowResult(
  id: KpiMaxPlatformId,
  comptes: KpiMaxComptesParsed,
  diffusionDaysStr: string,
  desiredImpressionsStr: string,
): RowResult {
  const days = parseDiffusionDays(diffusionDaysStr)
  const computed =
    days !== null && rowComptesValid(id, comptes)
      ? computeSinglePlatformRow(id, comptes, days)
      : null
  const customImpressions = parseNonNegativeInt(desiredImpressionsStr)
  return { computed, customImpressions }
}

function defaultEnabledAll(): Record<KpiMaxPlatformId, boolean> {
  return {
    meta: true,
    display: true,
    youtube: true,
    linkedin: true,
    snapchat: true,
    tiktok: true,
  }
}

function defaultDaysPerPlatform(): Record<KpiMaxPlatformId, string> {
  return KPI_MAX_PLATFORM_ORDER.reduce(
    (acc, { id }) => {
      acc[id] = '14'
      return acc
    },
    {} as Record<KpiMaxPlatformId, string>,
  )
}

function defaultDesiredImpressions(): Record<KpiMaxPlatformId, string> {
  return KPI_MAX_PLATFORM_ORDER.reduce(
    (acc, { id }) => {
      acc[id] = ''
      return acc
    },
    {} as Record<KpiMaxPlatformId, string>,
  )
}

const cellInputClass = 'h-9 min-w-[7rem] bg-background text-sm tabular-nums'

export function KpiMax2Panel() {
  const [enabled, setEnabled] = useState<Record<KpiMaxPlatformId, boolean>>(defaultEnabledAll)
  const [compteMeta, setCompteMeta] = useState('')
  const [compteLinkedin, setCompteLinkedin] = useState('')
  const [compteSnapchat, setCompteSnapchat] = useState('')
  const [compteTiktok, setCompteTiktok] = useState('')
  const [diffusionDays, setDiffusionDays] = useState<Record<KpiMaxPlatformId, string>>(
    defaultDaysPerPlatform,
  )
  const [desiredImpressions, setDesiredImpressions] = useState<Record<KpiMaxPlatformId, string>>(
    defaultDesiredImpressions,
  )

  const enabledRows = useMemo(
    () => KPI_MAX_PLATFORM_ORDER.filter(({ id }) => enabled[id]),
    [enabled],
  )

  const comptesParsed = useMemo(
    () => parseComptesParsed(compteMeta, compteLinkedin, compteSnapchat, compteTiktok),
    [compteMeta, compteLinkedin, compteSnapchat, compteTiktok],
  )

  const resultsByPlatform = useMemo(() => {
    const out: Partial<Record<KpiMaxPlatformId, RowResult>> = {}
    for (const { id } of enabledRows) {
      out[id] = buildRowResult(id, comptesParsed, diffusionDays[id], desiredImpressions[id])
    }
    return out
  }, [enabledRows, comptesParsed, diffusionDays, desiredImpressions])

  const setComptesForPlatform = (id: KpiMaxPlatformId, value: string) => {
    if (comptesUsesMetaBase(id)) setCompteMeta(value)
    else if (id === 'linkedin') setCompteLinkedin(value)
    else if (id === 'snapchat') setCompteSnapchat(value)
    else setCompteTiktok(value)
  }

  const comptesValueForPlatform = (id: KpiMaxPlatformId): string => {
    if (comptesUsesMetaBase(id)) return compteMeta
    if (id === 'linkedin') return compteLinkedin
    if (id === 'snapchat') return compteSnapchat
    return compteTiktok
  }

  const togglePlatform = (id: KpiMaxPlatformId, checked: boolean) => {
    setEnabled((prev) => ({ ...prev, [id]: checked }))
  }

  return (
    <div className="mt-6 mx-auto max-w-[min(100%,1400px)] px-0">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="space-y-2 border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent pb-5">
          <CardTitle className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E94C16]/10 text-[#E94C16]">
              <BarChart2 className="h-5 w-5" aria-hidden />
            </span>
            KPIs max 2
          </CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-relaxed">
            Présentation tableau — mêmes calculs que KPIs max (V1), avec saisie multi-plateformes et durée
            de diffusion par ligne.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10 pt-6">
          {/* Étape 1 */}
          <section aria-labelledby="kpi-max2-step1-heading">
            <h2
              id="kpi-max2-step1-heading"
              className="mb-4 text-base font-semibold text-foreground"
            >
              Étape 1
            </h2>
            <div className="overflow-x-auto rounded-xl border border-border/70 bg-card shadow-sm">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="w-10 px-2" aria-label="Activer la plateforme" />
                    <TableHead className="min-w-[6rem] font-semibold">Plateforme</TableHead>
                    <TableHead className="min-w-[9rem]">Nombre de comptes</TableHead>
                    <TableHead className="min-w-[8rem]">Commentaires</TableHead>
                    <TableHead className="min-w-[8rem]">Nombre de jours de diff.</TableHead>
                    <TableHead className="min-w-[10rem]">Nombre d&apos;impressions souhaités</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {KPI_MAX_PLATFORM_ORDER.map(({ id, label }) => (
                    <TableRow key={id}>
                      <TableCell className="px-2">
                        <Checkbox
                          checked={enabled[id]}
                          onCheckedChange={(c) => togglePlatform(id, c === true)}
                          aria-label={`Inclure ${label}`}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          className={cellInputClass}
                          placeholder="Ex. 150 000"
                          value={comptesValueForPlatform(id)}
                          onChange={(e) => setComptesForPlatform(id, e.target.value)}
                          disabled={!enabled[id]}
                        />
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {PLATFORM_FIXED_COMMENT[id] ?? '—'}
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={1}
                          className={cellInputClass}
                          placeholder="ex. 14"
                          value={diffusionDays[id]}
                          onChange={(e) =>
                            setDiffusionDays((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                          disabled={!enabled[id]}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          className={cellInputClass}
                          placeholder="Optionnel"
                          value={desiredImpressions[id]}
                          onChange={(e) =>
                            setDesiredImpressions((prev) => ({ ...prev, [id]: e.target.value }))
                          }
                          disabled={!enabled[id]}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Étape 2 */}
          <section aria-labelledby="kpi-max2-step2-heading">
            <h2
              id="kpi-max2-step2-heading"
              className="mb-4 text-base font-semibold text-foreground"
            >
              Étape 2
            </h2>

            {enabledRows.length === 0 ? (
              <p className="rounded-xl border border-dashed border-border px-4 py-8 text-center text-sm text-muted-foreground">
                Cochez au moins une plateforme à l&apos;étape 1 pour afficher les résultats.
              </p>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/70 bg-card shadow-sm">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead
                        rowSpan={2}
                        className="min-w-[6rem] align-bottom font-semibold"
                      >
                        Plateforme
                      </TableHead>
                      <TableHead
                        colSpan={3}
                        className="border-l border-border/60 text-center text-emerald-800 dark:text-emerald-300"
                      >
                        Strat idéale
                      </TableHead>
                      <TableHead
                        colSpan={3}
                        className="border-l border-border/60 text-center text-[#C43D11] dark:text-orange-400"
                      >
                        Strat MAX
                      </TableHead>
                      <TableHead
                        colSpan={2}
                        className="border-l border-border/60 text-center"
                      >
                        Strat personnalisée
                      </TableHead>
                    </TableRow>
                    <TableRow className="bg-muted/20 hover:bg-muted/20">
                      {(['ideal', 'max', 'custom'] as const).map((group) => {
                        const cols =
                          group === 'custom'
                            ? (['Impressions', 'Taux pénétration'] as const)
                            : (['Impressions', 'Taux pénétration', 'Clics'] as const)
                        return cols.map((col) => (
                          <TableHead
                            key={`${group}-${col}`}
                            className={cn(
                              'border-l border-border/50 text-right text-xs font-medium',
                              group === 'ideal' && 'text-emerald-800/90 dark:text-emerald-300/90',
                              group === 'max' && 'text-[#C43D11]/90',
                              group === 'custom' && 'text-muted-foreground',
                            )}
                          >
                            {col}
                          </TableHead>
                        ))
                      })}
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {enabledRows.map(({ id, label }) => {
                      const result = resultsByPlatform[id]
                      const row = result?.computed ?? null
                      const customImp = result?.customImpressions ?? null
                      const dash = '—'

                      return (
                        <TableRow key={id}>
                          <TableCell className="font-medium">{label}</TableCell>

                          {/* Strat idéale */}
                          <TableCell className="border-l border-border/40 text-right tabular-nums">
                            {row ? formatNumber(row.idealImpressions, 0) : dash}
                          </TableCell>
                          <TableCell className="border-l border-border/40 text-right tabular-nums text-sm">
                            {row
                              ? formatPenetration(row.idealImpressions, row.penetrationComptes)
                              : dash}
                          </TableCell>
                          <TableCell className="border-l border-border/40 text-right tabular-nums font-medium text-emerald-800 dark:text-emerald-300">
                            {row ? formatNumber(row.idealClics, 0) : dash}
                          </TableCell>

                          {/* Strat MAX */}
                          <TableCell className="border-l border-border/40 text-right tabular-nums">
                            {row ? formatNumber(row.maxImpressions, 0) : dash}
                          </TableCell>
                          <TableCell className="border-l border-border/40 text-right tabular-nums text-sm">
                            {row
                              ? formatPenetration(row.maxImpressions, row.penetrationComptes)
                              : dash}
                          </TableCell>
                          <TableCell className="border-l border-border/40 text-right tabular-nums font-medium text-[#E94C16]">
                            {row ? formatNumber(row.maxClics, 0) : dash}
                          </TableCell>

                          {/* Strat personnalisée — sans clics */}
                          <TableCell className="border-l border-border/40 text-right tabular-nums">
                            {customImp !== null ? formatNumber(customImp, 0) : dash}
                          </TableCell>
                          <TableCell className="border-l border-border/40 text-right tabular-nums text-sm">
                            {customImp !== null && row
                              ? formatPenetration(customImp, row.penetrationComptes)
                              : dash}
                          </TableCell>
                        </TableRow>
                      )
                    })}
                    <TableRow className="bg-muted/10 hover:bg-muted/10">
                      <TableCell
                        colSpan={9}
                        className="py-2 text-xs italic text-muted-foreground"
                      >
                        Strat personnalisée : remplir uniquement si « nombre d&apos;impressions
                        souhaités » est renseigné à l&apos;étape 1. {PENETRATION_FOOTNOTE}
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </div>
            )}
          </section>
        </CardContent>
      </Card>
    </div>
  )
}
