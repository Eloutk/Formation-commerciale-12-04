'use client'

import React, { useMemo } from 'react'
import { BarChart2, ChevronDown, Info, Pencil } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import {
  KPI_MAX_CLICKS_BAREME_ROWS,
  KPI_MAX_IMPRESSIONS_BAREME_ROWS,
  KPI_MAX_PENETRATION_CAP_PCT,
  KPI_MAX_PLATFORM_ORDER,
  computeKpiMaxRowsForEnabledPlatforms,
  kpiMaxGlobalPotentiel,
  kpiMaxMonthsEquivalence,
  kpiMaxSelectedToEnabled,
  kpiMaxSoldPenetrationPct,
  kpiMaxSoldPenetrationRawPct,
  kpiMaxValidateInputs,
  type KpiMaxCompteStrings,
  type KpiMaxComputedRow,
  type KpiMaxPenetrationMetric,
  type KpiMaxPlatformId,
} from '@/lib/kpi-max-vente2'

function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function formatSoldPenetrationPct(
  kpisVendus: number,
  potentielGlobal: number,
  metric: KpiMaxPenetrationMetric,
): string {
  const raw = kpiMaxSoldPenetrationRawPct(kpisVendus, potentielGlobal, metric)
  const capped = kpiMaxSoldPenetrationPct(kpisVendus, potentielGlobal, metric)
  const base = `${formatNumber(capped, 2)} %`
  if (raw > KPI_MAX_PENETRATION_CAP_PCT + 1e-9) {
    return `${base} (plaf. ${KPI_MAX_PENETRATION_CAP_PCT} %)`
  }
  return base
}

function EditableInput(props: React.ComponentProps<typeof Input>) {
  const { className, type, ...rest } = props
  if (type === 'file') return <Input {...props} />
  return (
    <div className="relative w-full">
      <Input type={type} {...rest} className={cn('pr-8', className)} />
      <Pencil
        className="pointer-events-none absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground"
        aria-hidden
      />
    </div>
  )
}

type PotentielField = {
  label: string
  fieldId: string
  disabled: boolean
  placeholder: string
  value: string
  setValue: (v: string) => void
  hint?: string
}

function resolvePotentielField(
  platform: KpiMaxPlatformId | null,
  comptes: KpiMaxCompteStrings,
  setters: {
    setMeta: (v: string) => void
    setLinkedin: (v: string) => void
    setSnapchat: (v: string) => void
    setTiktok: (v: string) => void
  },
): PotentielField {
  if (platform === null) {
    return {
      label: 'Potentiel',
      fieldId: 'kpi-max-potentiel-inline',
      disabled: true,
      placeholder: '—',
      value: '',
      setValue: () => {},
      hint: 'Sélectionnez une plateforme pour activer la saisie.',
    }
  }
  if (platform === 'meta' || platform === 'display' || platform === 'youtube') {
    return {
      label: 'Potentiel',
      fieldId: 'kpi-max-potentiel-meta-input',
      disabled: false,
      placeholder: 'Ex. 150 000',
      value: comptes.meta,
      setValue: setters.setMeta,
      hint:
        platform === 'meta'
          ? 'Base utilisée pour META, Display et Youtube.'
          : 'Display et Youtube utilisent le potentiel META (saisi ici).',
    }
  }
  if (platform === 'linkedin') {
    return {
      label: 'Potentiel LinkedIn',
      fieldId: 'kpi-max-potentiel-linkedin',
      disabled: false,
      placeholder: 'Ex. 150 000',
      value: comptes.linkedin,
      setValue: setters.setLinkedin,
    }
  }
  if (platform === 'snapchat') {
    return {
      label: 'Potentiel Snapchat',
      fieldId: 'kpi-max-potentiel-snapchat',
      disabled: false,
      placeholder: 'Ex. 150 000',
      value: comptes.snapchat,
      setValue: setters.setSnapchat,
    }
  }
  return {
    label: 'Potentiel Tiktok',
    fieldId: 'kpi-max-potentiel-tiktok',
    disabled: false,
    placeholder: 'Ex. 150 000',
    value: comptes.tiktok,
    setValue: setters.setTiktok,
  }
}

function MetricTable({
  title,
  description,
  rows,
}: {
  title: string
  description?: string
  rows: Array<{
    key: string
    label: string
    ideal: number
    max: number
    idealDisplay?: string
    maxDisplay?: string
    /** Ligne unique (taux de pénétration vendu) : valeur sur toute la largeur. */
    fullWidth?: boolean
  }>
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-border/70 bg-card shadow-sm">
      <div className="border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-5">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {description ? (
          <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{description}</p>
        ) : null}
      </div>
      <div className="overflow-x-auto">
        <table className="w-full min-w-[320px] border-collapse text-sm">
          <caption className="sr-only">
            {title} — stratégie idéale et stratégie max
          </caption>
          <thead>
            <tr className="border-b border-border/60 bg-muted/20">
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground"
              >
                Indicateur
              </th>
              <th
                scope="col"
                className="border-l border-border/50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-emerald-800 dark:text-emerald-300"
              >
                Stratégie idéale
              </th>
              <th
                scope="col"
                className="border-l border-border/50 px-4 py-3 text-right text-xs font-semibold uppercase tracking-wide text-[#C43D11] dark:text-orange-400"
              >
                Stratégie max
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.key} className="border-b border-border/40 last:border-b-0">
                <th scope="row" className="px-4 py-3.5 text-left font-medium text-foreground">
                  {row.label}
                </th>
                {row.fullWidth ? (
                  <td
                    colSpan={2}
                    className="border-l border-border/50 px-4 py-3.5 text-right tabular-nums"
                  >
                    <span className="text-base font-bold text-foreground">
                      {row.idealDisplay ?? formatNumber(row.ideal, 2)}
                    </span>
                  </td>
                ) : (
                  <>
                    <td className="border-l border-border/50 px-4 py-3.5 text-right tabular-nums">
                      <span className="text-base font-bold text-emerald-800 dark:text-emerald-300">
                        {row.idealDisplay ?? formatNumber(row.ideal, 0)}
                      </span>
                    </td>
                    <td className="border-l border-border/50 px-4 py-3.5 text-right tabular-nums">
                      <span className="text-base font-bold text-[#E94C16]">
                        {row.maxDisplay ?? formatNumber(row.max, 0)}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function buildResultRows(
  row: KpiMaxComputedRow,
  kpisVendus: number,
  potentielGlobal: number,
) {
  const impressionPen = kpiMaxSoldPenetrationPct(kpisVendus, potentielGlobal, 'impressions')
  const clickPen = kpiMaxSoldPenetrationPct(kpisVendus, potentielGlobal, 'clicks')

  const impressionRows = [
    {
      key: 'impressions',
      label: 'Impressions',
      ideal: row.idealImpressions,
      max: row.maxImpressions,
    },
    {
      key: 'penetration-impressions',
      label: 'Taux de pénétration (impressions vendues)',
      ideal: impressionPen,
      max: impressionPen,
      idealDisplay: formatSoldPenetrationPct(kpisVendus, potentielGlobal, 'impressions'),
      fullWidth: true,
    },
  ]

  const clickRows = [
    {
      key: 'clics',
      label: 'Clics / clics sur lien',
      ideal: row.idealClics,
      max: row.maxClics,
    },
    {
      key: 'penetration-clics',
      label: 'Taux de pénétration (clics vendus)',
      ideal: clickPen,
      max: clickPen,
      idealDisplay: formatSoldPenetrationPct(kpisVendus, potentielGlobal, 'clicks'),
      fullWidth: true,
    },
  ]

  return { impressionRows, clickRows }
}

export type KpiMaxPanelProps = {
  platformSelected: KpiMaxPlatformId | null
  onPlatformSelected: (id: KpiMaxPlatformId | null) => void
  compteMeta: string
  onCompteMetaChange: (v: string) => void
  compteLinkedin: string
  onCompteLinkedinChange: (v: string) => void
  compteSnapchat: string
  onCompteSnapchatChange: (v: string) => void
  compteTiktok: string
  onCompteTiktokChange: (v: string) => void
  diffusionDays: string
  onDiffusionDaysChange: (v: string) => void
  kpisQueJeVeuxVendre: string
  onKpisQueJeVeuxVendreChange: (v: string) => void
}

export function KpiMaxPanel({
  platformSelected,
  onPlatformSelected,
  compteMeta,
  onCompteMetaChange,
  compteLinkedin,
  onCompteLinkedinChange,
  compteSnapchat,
  onCompteSnapchatChange,
  compteTiktok,
  onCompteTiktokChange,
  diffusionDays,
  onDiffusionDaysChange,
  kpisQueJeVeuxVendre,
  onKpisQueJeVeuxVendreChange,
}: KpiMaxPanelProps) {
  const platformsEnabled = useMemo(
    () => kpiMaxSelectedToEnabled(platformSelected),
    [platformSelected],
  )

  const compteStrings: KpiMaxCompteStrings = useMemo(
    () => ({
      meta: compteMeta,
      linkedin: compteLinkedin,
      snapchat: compteSnapchat,
      tiktok: compteTiktok,
    }),
    [compteMeta, compteLinkedin, compteSnapchat, compteTiktok],
  )

  const valid = useMemo(
    () => kpiMaxValidateInputs(platformsEnabled, diffusionDays, compteStrings, kpisQueJeVeuxVendre),
    [platformsEnabled, diffusionDays, compteStrings, kpisQueJeVeuxVendre],
  )

  const rows = useMemo(() => {
    if (!valid.ok || !valid.diffusionDays || !valid.comptes) return []
    return computeKpiMaxRowsForEnabledPlatforms(platformsEnabled, valid.comptes, valid.diffusionDays)
  }, [valid, platformsEnabled])

  const resultRow = rows[0] ?? null
  const potentielGlobal =
    valid.ok && valid.comptes && platformSelected
      ? kpiMaxGlobalPotentiel(platformSelected, valid.comptes)
      : 0
  const kpisVendus = valid.ok && valid.kpisVendus != null ? valid.kpisVendus : 0
  const resultTables =
    resultRow && valid.ok && valid.kpisVendus != null
      ? buildResultRows(resultRow, kpisVendus, potentielGlobal)
      : null

  const potentiel = resolvePotentielField(platformSelected, compteStrings, {
    setMeta: onCompteMetaChange,
    setLinkedin: onCompteLinkedinChange,
    setSnapchat: onCompteSnapchatChange,
    setTiktok: onCompteTiktokChange,
  })

  const monthsEquiv =
    valid.ok && valid.diffusionDays ? kpiMaxMonthsEquivalence(valid.diffusionDays) : null

  return (
    <div className="mt-6 mx-auto max-w-5xl px-0">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="space-y-2 border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent pb-5">
          <CardTitle className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E94C16]/10 text-[#E94C16]">
              <BarChart2 className="h-5 w-5" aria-hidden />
            </span>
            KPIs max
          </CardTitle>
          <CardDescription className="max-w-2xl text-sm leading-relaxed">
            Renseignez la plateforme, le potentiel, les KPIs à vendre et la durée de diffusion pour
            afficher les volumes (stratégies idéale et max) et les taux de pénétration.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          <section
            className="rounded-xl border-2 border-[#E94C16]/20 bg-gradient-to-br from-[#E94C16]/[0.05] to-background p-4 sm:p-6"
            aria-labelledby="kpi-max-setup-heading"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="bg-[#E94C16] text-white hover:bg-[#E94C16]">Étape 1</Badge>
              <h2 id="kpi-max-setup-heading" className="text-base font-semibold text-foreground">
                Paramétrage initial
              </h2>
            </div>

            <div className="space-y-5">
              <div>
                <Label className="mb-2 block text-sm font-medium">Plateforme</Label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                  {KPI_MAX_PLATFORM_ORDER.map(({ id, label }) => {
                    const active = platformSelected === id
                    return (
                      <button
                        key={id}
                        type="button"
                        aria-pressed={active}
                        onClick={() => onPlatformSelected(active ? null : id)}
                        className={cn(
                          'rounded-xl border px-3 py-3 text-center text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#E94C16] focus-visible:ring-offset-2',
                          active
                            ? 'border-[#E94C16] bg-[#E94C16] text-white shadow-md shadow-[#E94C16]/25'
                            : 'border-border/70 bg-background text-foreground hover:border-[#E94C16]/50 hover:bg-[#E94C16]/[0.06]',
                        )}
                      >
                        {label}
                      </button>
                    )
                  })}
                </div>
              </div>

              <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor={potentiel.fieldId}>{potentiel.label}</Label>
                  <EditableInput
                    id={potentiel.fieldId}
                    type="number"
                    min={1}
                    disabled={potentiel.disabled}
                    placeholder={potentiel.placeholder}
                    value={potentiel.value}
                    onChange={(e) => potentiel.setValue(e.target.value)}
                    className="bg-background"
                  />
                  {potentiel.hint ? (
                    <p className="text-xs leading-relaxed text-muted-foreground">{potentiel.hint}</p>
                  ) : null}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpi-max-kpis-vendre">KPIs que je veux vendre</Label>
                  <EditableInput
                    id="kpi-max-kpis-vendre"
                    type="number"
                    min={0}
                    disabled={platformSelected === null}
                    placeholder="Ex. 50 000"
                    value={kpisQueJeVeuxVendre}
                    onChange={(e) => onKpisQueJeVeuxVendreChange(e.target.value)}
                    className="bg-background"
                  />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    Volume d&apos;impressions ou de clics vendus — taux de pénétration vs potentiel global.
                  </p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="kpi-max-jours-diffusion">Nombre de jours de diffusion</Label>
                  <EditableInput
                    id="kpi-max-jours-diffusion"
                    type="number"
                    min={1}
                    placeholder="ex. 14"
                    value={diffusionDays}
                    onChange={(e) => onDiffusionDaysChange(e.target.value)}
                    className="bg-background"
                  />
                  <p className="text-xs leading-relaxed text-muted-foreground">
                    {monthsEquiv != null ? (
                      <>
                        <span className="font-medium text-foreground">{monthsEquiv}</span> mois équivalent
                        {monthsEquiv > 1 ? 's' : ''} (tranches de 30 jours complètes : j. 1–30 = 1 mois, 31–60 = 2
                        mois, etc.).
                      </>
                    ) : (
                      'Indiquez la durée pour appliquer les formules « / mois » du barème.'
                    )}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <section className="space-y-5" aria-live="polite">
            {!valid.ok ? (
              <Alert className="border-amber-200/90 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/25 [&_svg]:text-amber-700">
                <Info className="h-4 w-4 shrink-0" aria-hidden />
                <AlertTitle className="text-sm font-medium text-foreground">
                  Complétez le paramétrage
                </AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">{valid.reason}</AlertDescription>
              </Alert>
            ) : resultRow && resultTables ? (
              <>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="outline" className="border-emerald-600/30 text-emerald-800 dark:text-emerald-300">
                    Étape 2
                  </Badge>
                  <h2 className="text-base font-semibold text-foreground">Résultats — {resultRow.label}</h2>
                  {resultRow.metaBasedWarning ? (
                    <Badge
                      variant="outline"
                      className="border-[#E94C16]/30 bg-[#E94C16]/5 text-[10px] font-medium text-[#E94C16]"
                    >
                      Base META
                    </Badge>
                  ) : null}
                </div>

                <MetricTable
                  title="Impressions"
                  description="Volumes stratégie idéale / max selon le barème. Pénétration : (KPIs vendus ÷ 1,8) × 100 ÷ potentiel global (plafond 85 %)."
                  rows={resultTables.impressionRows}
                />

                <MetricTable
                  title="Clics / Clics sur lien"
                  description={`${resultRow.idealClickFormulaCaption} · ${resultRow.maxClickFormulaCaption}. Pénétration : KPIs vendus × 100 ÷ potentiel global (plafond 85 %).`}
                  rows={resultTables.clickRows}
                />
              </>
            ) : null}
          </section>

          <details className="group rounded-lg border border-border/60 bg-muted/10 open:bg-muted/15">
            <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-medium text-foreground [&::-webkit-details-marker]:hidden">
              <span className="text-xs font-semibold uppercase tracking-wide text-[#E94C16]">
                Barèmes de référence (impressions & clics)
              </span>
              <ChevronDown
                className="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-open:rotate-180"
                aria-hidden
              />
            </summary>
            <div className="space-y-6 border-t border-border/50 px-4 pb-4 pt-4">
              <div>
                <p className="mb-2 text-xs font-semibold text-foreground">Impressions</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-left text-xs sm:text-sm">
                  <caption className="sr-only">
                    Formules impressions stratégie idéale et stratégie max par plateforme
                  </caption>
                  <thead>
                    <tr className="border-b border-border/60">
                      <th scope="col" className="py-2 pr-3 font-semibold text-foreground">
                        Plateforme
                      </th>
                      <th scope="col" className="py-2 pr-3 font-semibold text-foreground">
                        Stratégie idéale
                      </th>
                      <th scope="col" className="py-2 font-semibold text-foreground">
                        Stratégie max
                      </th>
                    </tr>
                  </thead>
                  <tbody className="text-muted-foreground">
                    {KPI_MAX_IMPRESSIONS_BAREME_ROWS.map((row) => (
                      <tr key={row.label} className="border-b border-border/40 last:border-b-0">
                        <td className="py-2 pr-3 font-medium text-foreground">{row.label}</td>
                        <td className="py-2 pr-3">{row.idealCaption}</td>
                        <td className="py-2">{row.maxCaption}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              </div>
              <div>
                <p className="mb-2 text-xs font-semibold text-foreground">Clics / clics sur lien</p>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[480px] border-collapse text-left text-xs sm:text-sm">
                    <caption className="sr-only">
                      Formules clics stratégie idéale et stratégie max par plateforme
                    </caption>
                    <thead>
                      <tr className="border-b border-border/60">
                        <th scope="col" className="py-2 pr-3 font-semibold text-foreground">
                          Plateforme
                        </th>
                        <th scope="col" className="py-2 pr-3 font-semibold text-foreground">
                          Stratégie idéale
                        </th>
                        <th scope="col" className="py-2 font-semibold text-foreground">
                          Stratégie max
                        </th>
                      </tr>
                    </thead>
                    <tbody className="text-muted-foreground">
                      {KPI_MAX_CLICKS_BAREME_ROWS.map((row) => (
                        <tr key={row.label} className="border-b border-border/40 last:border-b-0">
                          <td className="py-2 pr-3 font-medium text-foreground">{row.label}</td>
                          <td className="py-2 pr-3">{row.idealCaption}</td>
                          <td className="py-2">{row.maxCaption}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </details>
        </CardContent>
      </Card>
    </div>
  )
}
