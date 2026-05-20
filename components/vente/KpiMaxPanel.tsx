'use client'

import React, { useMemo, useState } from 'react'
import { BarChart2, Info, Pencil } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { cn } from '@/lib/utils'
import {
  KPI_MAX_PENETRATION_CAP_PCT,
  KPI_MAX_PLATFORM_ORDER,
  computeKpiMaxRowsForEnabledPlatforms,
  kpiMaxMonthsEquivalence,
  kpiMaxPenetrationPct,
  kpiMaxSelectedToEnabled,
  kpiMaxValidateInputs,
  type KpiMaxCompteStrings,
  type KpiMaxComputedRow,
  type KpiMaxPlatformId,
} from '@/lib/kpi-max-vente2'

/** Encarts étapes : fond blanc, bordure qui se renforce au fil des étapes franchies (couleur #E94C16). */
const KPI_MAX_ENCART_BASE =
  'rounded-xl border-2 bg-white p-4 shadow-sm dark:bg-card sm:p-6'

function formatNumber(num: number, decimals = 0): string {
  return num.toLocaleString('fr-FR', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  })
}

function parseOptionalVolumeNonNegative(s: string): number | null {
  const t = s.trim().replace(/\s/g, '').replace(',', '.')
  if (t === '') return null
  const n = parseFloat(t)
  if (!Number.isFinite(n) || n < 0) return null
  return Math.floor(n)
}

function formatImpressionPenetrationDisplay(impressions: number, comptes: number): string {
  return `${formatNumber(kpiMaxPenetrationPct(impressions, comptes), 2)} %*`
}

const KPI_MAX_PENETRATION_FOOTNOTE = `* Les taux affichés sont plafonnés à ${KPI_MAX_PENETRATION_CAP_PCT} %. Nous considérons qu’il n’est pas réaliste de s’engager à toucher plus de ${KPI_MAX_PENETRATION_CAP_PCT} % de la cible.`

type PenetrationMetricPanelProps = {
  title: string
  explainer: string
  idealLabel: string
  maxLabel: string
  idealPct: string
  maxPct: string
  simulationTitle: string
  inputId: string
  inputPlaceholder: string
  formatPct: (volume: number, comptes: number) => string
  penetrationComptes: number
  customStr: string
  onCustomStrChange: (v: string) => void
  parsed: ParsedCustomVolume
}

/** value: parsed number, invalid string, or empty */
type ParsedCustomVolume =
  | { kind: 'empty' }
  | { kind: 'invalid' }
  | { kind: 'ok'; n: number }

function parseCustomVolumeState(s: string): ParsedCustomVolume {
  if (s.trim() === '') return { kind: 'empty' }
  const n = parseOptionalVolumeNonNegative(s)
  if (n === null) return { kind: 'invalid' }
  return { kind: 'ok', n }
}

function PenetrationMetricPanel(props: PenetrationMetricPanelProps) {
  const {
    title,
    explainer,
    idealLabel,
    maxLabel,
    idealPct,
    maxPct,
    simulationTitle,
    inputId,
    inputPlaceholder,
    formatPct,
    penetrationComptes,
    customStr,
    onCustomStrChange,
    parsed,
  } = props

  return (
    <div className="rounded-xl border border-border/70 bg-card/80 p-4 shadow-sm sm:p-5">
      <div className="mb-4 border-b border-border/50 pb-3">
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{explainer}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg bg-emerald-500/[0.07] px-4 py-3 dark:bg-emerald-500/10">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-900/80 dark:text-emerald-200/90">
            {idealLabel}
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums text-emerald-800 dark:text-emerald-300">
            {idealPct}
          </p>
        </div>
        <div className="rounded-lg bg-[#E94C16]/[0.08] px-4 py-3 dark:bg-orange-950/20">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-orange-900/90 dark:text-orange-200/85">
            {maxLabel}
          </p>
          <p className="mt-2 text-xl font-bold tabular-nums text-[#C43D11] dark:text-orange-400">
            {maxPct}
          </p>
        </div>
        <div className="rounded-lg border border-dashed border-border bg-muted/25 px-4 py-3 sm:col-span-1">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">
            {simulationTitle}
          </p>
          <Label htmlFor={inputId} className="mt-2 block text-xs font-medium text-foreground">
            Volume que vous pouvez vendre
          </Label>
          <Input
            id={inputId}
            type="number"
            min={0}
            className="mt-1.5 h-10 bg-background"
            placeholder={inputPlaceholder}
            value={customStr}
            onChange={(e) => onCustomStrChange(e.target.value)}
          />
          <div className="mt-3 min-h-[2.75rem] rounded-md bg-background/80 px-2.5 py-2">
            {parsed.kind === 'ok' ? (
              <p className="text-xs text-muted-foreground">
                <span className="font-medium text-foreground">Taux estimé : </span>
                <span className="text-sm font-bold tabular-nums text-foreground">
                  {formatPct(parsed.n, penetrationComptes)}
                </span>
              </p>
            ) : parsed.kind === 'invalid' ? (
              <p className="text-xs text-amber-800 dark:text-amber-200/90">Saisissez un nombre positif ou zéro.</p>
            ) : (
              <p className="text-xs text-muted-foreground">Indiquez un volume pour voir le taux.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
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

type NombreComptesField = {
  label: string
  fieldId: string
  disabled: boolean
  placeholder: string
  value: string
  setValue: (v: string) => void
  hint?: string
}

function resolveNombreComptesField(
  platform: KpiMaxPlatformId | null,
  comptes: KpiMaxCompteStrings,
  setters: {
    setMeta: (v: string) => void
    setLinkedin: (v: string) => void
    setSnapchat: (v: string) => void
    setTiktok: (v: string) => void
  },
): NombreComptesField {
  if (platform === null) {
    return {
      label: 'Nombre de comptes',
      fieldId: 'kpi-max-nombre-comptes-inline',
      disabled: true,
      placeholder: '—',
      value: '',
      setValue: () => {},
      hint: 'Sélectionnez une plateforme pour activer la saisie.',
    }
  }
  if (platform === 'meta' || platform === 'display' || platform === 'youtube') {
    return {
      label: 'Nombre de comptes',
      fieldId: 'kpi-max-nombre-comptes-meta',
      disabled: false,
      placeholder: 'Ex. 150 000',
      value: comptes.meta,
      setValue: setters.setMeta,
      hint:
        platform === 'meta'
          ? 'Base utilisée pour META, Display et Youtube.'
          : 'Display et Youtube utilisent le nombre de comptes META (saisi ici).',
    }
  }
  if (platform === 'linkedin') {
    return {
      label: 'Nombre de comptes LinkedIn',
      fieldId: 'kpi-max-nombre-comptes-linkedin',
      disabled: false,
      placeholder: 'Ex. 150 000',
      value: comptes.linkedin,
      setValue: setters.setLinkedin,
    }
  }
  if (platform === 'snapchat') {
    return {
      label: 'Nombre de comptes Snapchat',
      fieldId: 'kpi-max-nombre-comptes-snapchat',
      disabled: false,
      placeholder: 'Ex. 150 000',
      value: comptes.snapchat,
      setValue: setters.setSnapchat,
    }
  }
  return {
    label: 'Nombre de comptes Tiktok',
    fieldId: 'kpi-max-nombre-comptes-tiktok',
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
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function buildResultRows(row: KpiMaxComputedRow) {
  const impressionRows = [
    {
      key: 'impressions',
      label: 'Impressions',
      ideal: row.idealImpressions,
      max: row.maxImpressions,
    },
  ]

  const clickRows = [
    {
      key: 'clics',
      label: 'Clics / clics sur lien',
      ideal: row.idealClics,
      max: row.maxClics,
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
}: KpiMaxPanelProps) {
  const [step3Enabled, setStep3Enabled] = useState(false)
  const [customImpressionsStr, setCustomImpressionsStr] = useState('')

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
    () => kpiMaxValidateInputs(platformsEnabled, diffusionDays, compteStrings),
    [platformsEnabled, diffusionDays, compteStrings],
  )

  const rows = useMemo(() => {
    if (!valid.ok || !valid.diffusionDays || !valid.comptes) return []
    return computeKpiMaxRowsForEnabledPlatforms(platformsEnabled, valid.comptes, valid.diffusionDays)
  }, [valid, platformsEnabled])

  const resultRow = rows[0] ?? null
  const resultTables = resultRow && valid.ok ? buildResultRows(resultRow) : null

  const champNombreComptes = resolveNombreComptesField(platformSelected, compteStrings, {
    setMeta: onCompteMetaChange,
    setLinkedin: onCompteLinkedinChange,
    setSnapchat: onCompteSnapchatChange,
    setTiktok: onCompteTiktokChange,
  })

  const monthsEquiv =
    valid.ok && valid.diffusionDays ? kpiMaxMonthsEquivalence(valid.diffusionDays) : null

  const customImpressionsParsed = useMemo(
    () => parseCustomVolumeState(customImpressionsStr),
    [customImpressionsStr],
  )

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
            Renseignez la plateforme, le nombre de comptes et la durée de diffusion pour afficher les volumes
            impressions et clics (stratégies idéale et max). L’étape 3 optionnelle estime le taux de
            pénétration des impressions pour un volume que vous saisissez.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-8 pt-6">
          <section
            className={cn(
              KPI_MAX_ENCART_BASE,
              valid.ok
                ? 'border-[#E94C16]'
                : platformSelected
                  ? 'border-[#E94C16]/45'
                  : 'border-border',
            )}
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

              <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={champNombreComptes.fieldId}>{champNombreComptes.label}</Label>
                  <EditableInput
                    id={champNombreComptes.fieldId}
                    type="number"
                    min={1}
                    disabled={champNombreComptes.disabled}
                    placeholder={champNombreComptes.placeholder}
                    value={champNombreComptes.value}
                    onChange={(e) => champNombreComptes.setValue(e.target.value)}
                    className="bg-background"
                  />
                  {champNombreComptes.hint ? (
                    <p className="text-xs leading-relaxed text-muted-foreground">{champNombreComptes.hint}</p>
                  ) : null}
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

          <section
            className={cn(
              KPI_MAX_ENCART_BASE,
              resultRow && resultTables
                ? 'border-[#E94C16]'
                : valid.ok
                  ? 'border-[#E94C16]/45'
                  : 'border-border',
            )}
            aria-labelledby="kpi-max-results-heading"
            aria-live="polite"
          >
            <div className="mb-5 flex flex-wrap items-center gap-2">
              <Badge className="bg-[#E94C16] text-white hover:bg-[#E94C16]">Étape 2</Badge>
              <h2 id="kpi-max-results-heading" className="text-base font-semibold text-foreground">
                {resultRow && resultTables ? `Résultats — ${resultRow.label}` : 'Résultats'}
              </h2>
              {resultRow?.metaBasedWarning ? (
                <Badge
                  variant="outline"
                  className="border-[#E94C16]/30 bg-[#E94C16]/5 text-[10px] font-medium text-[#E94C16]"
                >
                  Base META
                </Badge>
              ) : null}
            </div>

            {!valid.ok ? (
              <Alert className="border-amber-200/90 bg-amber-50/60 dark:border-amber-900/50 dark:bg-amber-950/25 [&_svg]:text-amber-700">
                <Info className="h-4 w-4 shrink-0" aria-hidden />
                <AlertTitle className="text-sm font-medium text-foreground">
                  Complétez le paramétrage
                </AlertTitle>
                <AlertDescription className="text-sm text-muted-foreground">{valid.reason}</AlertDescription>
              </Alert>
            ) : resultRow && resultTables ? (
              <div className="space-y-5">
                <MetricTable
                  title="Impressions"
                  description="Volumes stratégie idéale / max selon le barème impressions (nombre de comptes) de la plateforme."
                  rows={resultTables.impressionRows}
                />

                <MetricTable
                  title="Clics / Clics sur lien"
                  description={`${resultRow.idealClickFormulaCaption} · ${resultRow.maxClickFormulaCaption}`}
                  rows={resultTables.clickRows}
                />
              </div>
            ) : null}
          </section>

          {valid.ok && resultRow && resultTables ? (
            <section
              className={cn(
                KPI_MAX_ENCART_BASE,
                step3Enabled ? 'border-[#E94C16]' : 'border-[#E94C16]/45',
              )}
              aria-labelledby="kpi-max-step3-heading"
            >
              <div className="flex flex-col gap-4 border-b border-border/40 pb-5 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="bg-[#E94C16] text-white hover:bg-[#E94C16]">Étape 3</Badge>
                    <h2 id="kpi-max-step3-heading" className="text-base font-semibold text-foreground">
                      Taux de pénétration (impressions)
                    </h2>
                    <span className="rounded-full bg-black px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-white">
                      Optionnel
                    </span>
                  </div>
                  <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
                    Les taux des stratégies idéale et max sont calculés pour{' '}
                    <span className="whitespace-nowrap font-medium text-foreground tabular-nums">
                      {formatNumber(resultRow.penetrationComptes, 0)} comptes
                    </span>{' '}
                    (valeur saisie à l’étape 1). À droite, saisissez un volume d&apos;impressions que vous pensez
                    pouvoir vendre : le taux estimé s&apos;affiche aussitôt.
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-3 self-start rounded-xl border border-border/70 bg-background px-4 py-3 shadow-sm">
                  <Switch
                    id="kpi-max-step3-toggle"
                    checked={step3Enabled}
                    onCheckedChange={(c) => setStep3Enabled(c === true)}
                    className="data-[state=checked]:bg-[#E94C16]"
                  />
                  <Label
                    htmlFor="kpi-max-step3-toggle"
                    className="cursor-pointer text-sm font-medium leading-snug text-foreground"
                  >
                    Afficher
                  </Label>
                </div>
              </div>

              {step3Enabled ? (
                resultRow.showMaxPenetration ? (
                <div className="mt-6">
                  <PenetrationMetricPanel
                    title="Impressions"
                    explainer="Taux issus des volumes d’impressions des stratégies idéale et max du barème."
                    idealLabel="Stratégie idéale"
                    maxLabel="Stratégie max"
                    idealPct={formatImpressionPenetrationDisplay(
                      resultRow.idealImpressions,
                      resultRow.penetrationComptes,
                    )}
                    maxPct={formatImpressionPenetrationDisplay(
                      resultRow.maxImpressions,
                      resultRow.penetrationComptes,
                    )}
                    simulationTitle="Simulation"
                    inputId="kpi-max-custom-imp"
                    inputPlaceholder="Nombre d’impressions"
                    formatPct={formatImpressionPenetrationDisplay}
                    penetrationComptes={resultRow.penetrationComptes}
                    customStr={customImpressionsStr}
                    onCustomStrChange={setCustomImpressionsStr}
                    parsed={customImpressionsParsed}
                  />
                  <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
                    {KPI_MAX_PENETRATION_FOOTNOTE}
                  </p>
                </div>
              ) : (
                <p className="mt-6 text-sm text-muted-foreground">
                  Aucun affichage de pénétration pour cette ligne.
                </p>
              )
              ) : null}
            </section>
          ) : null}
        </CardContent>
      </Card>
    </div>
  )
}
