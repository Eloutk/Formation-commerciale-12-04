'use client'

import React, { useMemo, useState } from 'react'
import { BarChart3, Info } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { useAuthAccess } from '@/components/auth-context'
import {
  SIMULATEUR_DEFAULT_INPUTS,
  SIMULATEUR_PLATFORM_ORDER,
  SIMULATEUR_GLOBAL_PARAMS,
  SIMULATEUR_PLATFORM_PARAMS,
  computeSimulateurMediaLink,
  parseSimulateurDiffusionDays,
  parseSimulateurNumber,
  parseSimulateurPositiveInt,
  type PressureLevel,
  type SimulateurCustomMode,
  type SimulateurInputs,
  type SimulateurPlatformId,
  type SimulateurPlatformRow,
} from '@/lib/simulateur-media-link'

type SimulateurResult = ReturnType<typeof computeSimulateurMediaLink>

const cellInputClass = 'h-9 bg-background text-sm tabular-nums'

function formatInt(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return Math.round(n).toLocaleString('fr-FR')
}

function formatRate(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return `${(n * 100).toLocaleString('fr-FR', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} %`
}

function formatSaturationScore(n: number | null | undefined): string {
  if (n === null || n === undefined) return '—'
  return n.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

function pressureBadgeClass(level: PressureLevel): string {
  switch (level) {
    case 'Pression faible':
      return 'bg-sky-100 text-sky-800 border-sky-200'
    case 'Pression correcte':
      return 'bg-emerald-100 text-emerald-800 border-emerald-200'
    case 'Bonne couverture':
      return 'bg-amber-100 text-amber-900 border-amber-200'
    case 'Pression forte':
      return 'bg-orange-100 text-orange-900 border-orange-200'
    case '⚠ Surpression':
      return 'bg-red-100 text-red-800 border-red-200'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

function PressureBadge({ level }: { level: PressureLevel }) {
  if (level === '—') return <span className="text-muted-foreground">—</span>
  return (
    <Badge variant="outline" className={cn('font-normal whitespace-nowrap', pressureBadgeClass(level))}>
      {level}
    </Badge>
  )
}

function StrategyCell({
  impressions,
  rate,
  saturation,
  clicks,
}: {
  impressions: number | null
  rate: number | null
  saturation: PressureLevel
  clicks: number | null
}) {
  return (
    <div className="space-y-1 text-xs sm:text-sm">
      <div>
        <span className="text-muted-foreground">Impr. </span>
        <span className="font-medium tabular-nums">{formatInt(impressions)}</span>
      </div>
      <div>
        <span className="text-muted-foreground">Taux </span>
        <span className="font-medium tabular-nums">{formatRate(rate)}</span>
      </div>
      <div className="flex flex-wrap items-center gap-1">
        <span className="text-muted-foreground">Sat. </span>
        <PressureBadge level={saturation} />
      </div>
      <div>
        <span className="text-muted-foreground">Clics </span>
        <span className="font-medium tabular-nums">{clicks !== null ? formatInt(clicks) : '—'}</span>
      </div>
    </div>
  )
}

function PlatformResultRow({ row }: { row: SimulateurPlatformRow }) {
  if (!row.enabled) {
    return (
      <TableRow className="opacity-50">
        <TableCell className="font-medium">{row.label}</TableCell>
        <TableCell colSpan={5} className="text-muted-foreground text-sm">
          Plateforme désactivée
        </TableCell>
      </TableRow>
    )
  }

  return (
    <TableRow>
      <TableCell className="font-medium">{row.label}</TableCell>
      <TableCell className="tabular-nums">{formatInt(row.potentiel)}</TableCell>
      <TableCell className="tabular-nums">{row.diffusionDays ?? '—'}</TableCell>
      <TableCell>
        <StrategyCell {...row.ideal} />
      </TableCell>
      <TableCell>
        <StrategyCell {...row.max} />
      </TableCell>
      <TableCell>
        <div className="space-y-1 text-xs sm:text-sm">
          <div>
            <span className="text-muted-foreground">Valeur </span>
            <span className="font-medium tabular-nums">
              {row.custom.customValue !== null ? formatInt(row.custom.customValue) : '—'}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Taux </span>
            <span className="font-medium tabular-nums">{formatRate(row.custom.rate)}</span>
          </div>
          <div className="flex flex-wrap items-center gap-1">
            <span className="text-muted-foreground">Sat. </span>
            <PressureBadge level={row.custom.saturation} />
          </div>
        </div>
      </TableCell>
    </TableRow>
  )
}

function SynthesisTable({ synthesis }: { synthesis: SimulateurResult['synthesis'] }) {
  const rows: { label: string; ideal: string; max: string; custom: string }[] = [
    {
      label: 'Impressions totales',
      ideal: formatInt(synthesis.ideal.totalImpressions),
      max: formatInt(synthesis.max.totalImpressions),
      custom: formatInt(synthesis.custom.totalImpressions),
    },
    {
      label: 'Clics totaux estimés',
      ideal: formatInt(synthesis.ideal.totalClicks),
      max: formatInt(synthesis.max.totalClicks),
      custom: formatInt(synthesis.custom.totalClicks),
    },
    {
      label: 'Taux global estimé (multi-plateformes)',
      ideal: formatRate(synthesis.ideal.globalRate),
      max: formatRate(synthesis.max.globalRate),
      custom: formatRate(synthesis.custom.globalRate),
    },
    {
      label: 'Saturation globale (pression mensuelle)',
      ideal: formatSaturationScore(synthesis.ideal.globalSaturation),
      max: formatSaturationScore(synthesis.max.globalSaturation),
      custom: formatSaturationScore(synthesis.custom.globalSaturation),
    },
    {
      label: 'Niveau de pression global',
      ideal: synthesis.ideal.pressureLevel,
      max: synthesis.max.pressureLevel,
      custom: synthesis.custom.pressureLevel,
    },
  ]

  return (
    <div className="overflow-x-auto rounded-xl border border-border/70">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/30 hover:bg-muted/30">
            <TableHead className="min-w-[12rem] font-semibold">Indicateur</TableHead>
            <TableHead className="min-w-[8rem] font-semibold text-center">Stratégie idéale</TableHead>
            <TableHead className="min-w-[8rem] font-semibold text-center">Stratégie MAX</TableHead>
            <TableHead className="min-w-[8rem] font-semibold text-center">Strat. personnalisée</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => (
            <TableRow key={row.label}>
              <TableCell className="font-medium">{row.label}</TableCell>
              <TableCell className="text-center tabular-nums">
                {row.label === 'Niveau de pression global' ? (
                  <PressureBadge level={row.ideal as PressureLevel} />
                ) : (
                  row.ideal
                )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.label === 'Niveau de pression global' ? (
                  <PressureBadge level={row.max as PressureLevel} />
                ) : (
                  row.max
                )}
              </TableCell>
              <TableCell className="text-center tabular-nums">
                {row.label === 'Niveau de pression global' ? (
                  <PressureBadge level={row.custom as PressureLevel} />
                ) : (
                  row.custom
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
}

function buildInputsFromState(state: FormState): SimulateurInputs | null {
  const diffusionDays = parseSimulateurDiffusionDays(state.diffusionDays)
  if (diffusionDays === null) return null

  const platforms = {} as SimulateurInputs['platforms']
  for (const { id } of SIMULATEUR_PLATFORM_ORDER) {
    platforms[id] = {
      enabled: state.enabled[id],
      customValue: parseSimulateurNumber(state.customValues[id]),
    }
  }

  return {
    diffusionDays,
    customMode: state.customMode,
    potentiels: {
      meta: parseSimulateurPositiveInt(state.potentielMeta),
      linkedin: parseSimulateurPositiveInt(state.potentielLinkedin),
      snapchat: parseSimulateurPositiveInt(state.potentielSnapchat),
      tiktok: parseSimulateurPositiveInt(state.potentielTiktok),
    },
    platforms,
  }
}

type FormState = {
  diffusionDays: string
  potentielMeta: string
  potentielLinkedin: string
  potentielSnapchat: string
  potentielTiktok: string
  customMode: SimulateurCustomMode
  enabled: Record<SimulateurPlatformId, boolean>
  customValues: Record<SimulateurPlatformId, string>
}

function defaultFormState(): FormState {
  const enabled = {} as Record<SimulateurPlatformId, boolean>
  const customValues = {} as Record<SimulateurPlatformId, string>
  for (const { id } of SIMULATEUR_PLATFORM_ORDER) {
    enabled[id] = SIMULATEUR_DEFAULT_INPUTS.platforms[id].enabled
    const cv = SIMULATEUR_DEFAULT_INPUTS.platforms[id].customValue
    customValues[id] = cv !== null ? String(cv) : ''
  }
  return {
    diffusionDays: String(SIMULATEUR_DEFAULT_INPUTS.diffusionDays),
    potentielMeta: String(SIMULATEUR_DEFAULT_INPUTS.potentiels.meta ?? ''),
    potentielLinkedin: String(SIMULATEUR_DEFAULT_INPUTS.potentiels.linkedin ?? ''),
    potentielSnapchat: String(SIMULATEUR_DEFAULT_INPUTS.potentiels.snapchat ?? ''),
    potentielTiktok: String(SIMULATEUR_DEFAULT_INPUTS.potentiels.tiktok ?? ''),
    customMode: SIMULATEUR_DEFAULT_INPUTS.customMode,
    enabled,
    customValues,
  }
}

export function SimulateurMediaLinkPanel() {
  const [form, setForm] = useState<FormState>(defaultFormState)
  const { isAdmin, authReady } = useAuthAccess()
  const showAdminSections = authReady && isAdmin

  const result = useMemo(() => {
    const inputs = buildInputsFromState(form)
    if (!inputs) return null
    return computeSimulateurMediaLink(inputs)
  }, [form])

  const customValueLabel =
    form.customMode === 'impressions'
      ? 'Valeur personnalisée (impressions)'
      : 'Valeur personnalisée (clics)'

  return (
    <div className="space-y-8">
      <Card className="overflow-hidden border-border/80 shadow-sm">
        <CardHeader className="space-y-2 border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent pb-5">
          <CardTitle className="flex items-center gap-2.5 text-xl font-semibold tracking-tight">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E94C16]/10 text-[#E94C16]">
              <BarChart3 className="h-5 w-5" aria-hidden />
            </span>
            Simulateur Média — Link
          </CardTitle>
          <CardDescription className="max-w-3xl text-sm leading-relaxed">
            Estimez impressions, taux de pénétration, saturation et clics par plateforme — stratégies
            idéale, MAX et personnalisée. Formules alignées sur le fichier Excel de référence.
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-10 pt-6">
          {/* Zone à remplir */}
          <section aria-labelledby="sim-inputs-heading">
            <h2 id="sim-inputs-heading" className="mb-4 text-base font-semibold">
              Paramètres de la campagne
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="sim-diffusion-days">Durée de diffusion (jours)</Label>
                <Input
                  id="sim-diffusion-days"
                  type="number"
                  min={1}
                  className={cellInputClass}
                  value={form.diffusionDays}
                  onChange={(e) => setForm((f) => ({ ...f, diffusionDays: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-potentiel-meta">Potentiel Meta</Label>
                <Input
                  id="sim-potentiel-meta"
                  type="number"
                  min={1}
                  className={cellInputClass}
                  placeholder="Taille audience Meta Ads"
                  value={form.potentielMeta}
                  onChange={(e) => setForm((f) => ({ ...f, potentielMeta: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-potentiel-linkedin">Potentiel LinkedIn</Label>
                <Input
                  id="sim-potentiel-linkedin"
                  type="number"
                  min={1}
                  className={cellInputClass}
                  placeholder="Taille audience LinkedIn Ads"
                  value={form.potentielLinkedin}
                  onChange={(e) => setForm((f) => ({ ...f, potentielLinkedin: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-potentiel-snapchat">Potentiel Snapchat</Label>
                <Input
                  id="sim-potentiel-snapchat"
                  type="number"
                  min={1}
                  className={cellInputClass}
                  placeholder="Taille audience Snapchat Ads"
                  value={form.potentielSnapchat}
                  onChange={(e) => setForm((f) => ({ ...f, potentielSnapchat: e.target.value }))}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sim-potentiel-tiktok">Potentiel TikTok</Label>
                <Input
                  id="sim-potentiel-tiktok"
                  type="number"
                  min={1}
                  className={cellInputClass}
                  placeholder="Taille audience TikTok Ads"
                  value={form.potentielTiktok}
                  onChange={(e) => setForm((f) => ({ ...f, potentielTiktok: e.target.value }))}
                />
              </div>
            </div>
          </section>

          {/* Activation plateformes */}
          <section aria-labelledby="sim-platforms-heading">
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <h2 id="sim-platforms-heading" className="text-base font-semibold">
                Activation des plateformes &amp; saisie personnalisée
              </h2>
              <div className="flex items-center gap-2">
                <Label htmlFor="sim-custom-mode" className="text-sm text-muted-foreground shrink-0">
                  Mode strat. personnalisée
                </Label>
                <Select
                  value={form.customMode}
                  onValueChange={(v) =>
                    setForm((f) => ({ ...f, customMode: v as SimulateurCustomMode }))
                  }
                >
                  <SelectTrigger id="sim-custom-mode" className="w-[10rem]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="impressions">Impressions</SelectItem>
                    <SelectItem value="clics">Clics</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="overflow-x-auto rounded-xl border border-border/70">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/30 hover:bg-muted/30">
                    <TableHead className="font-semibold">Plateforme</TableHead>
                    <TableHead className="w-24 text-center font-semibold">Activée</TableHead>
                    <TableHead className="min-w-[10rem] font-semibold">{customValueLabel}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SIMULATEUR_PLATFORM_ORDER.map(({ id, label }) => (
                    <TableRow key={id}>
                      <TableCell className="font-medium">{label}</TableCell>
                      <TableCell className="text-center">
                        <Switch
                          checked={form.enabled[id]}
                          onCheckedChange={(checked) =>
                            setForm((f) => ({
                              ...f,
                              enabled: { ...f.enabled, [id]: checked },
                            }))
                          }
                          aria-label={`Activer ${label}`}
                        />
                      </TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          min={0}
                          className={cellInputClass}
                          disabled={!form.enabled[id]}
                          value={form.customValues[id]}
                          onChange={(e) =>
                            setForm((f) => ({
                              ...f,
                              customValues: { ...f.customValues, [id]: e.target.value },
                            }))
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </section>

          {/* Alertes */}
          {result && result.alerts.length > 0 && (
            <section aria-labelledby="sim-alerts-heading">
              <h2 id="sim-alerts-heading" className="mb-3 text-base font-semibold">
                Alertes
              </h2>
              <div className="space-y-2">
                {result.alerts.map((alert) => (
                  <Alert key={alert} variant="destructive" className="border-amber-300 bg-amber-50 text-amber-900">
                    <Info className="h-4 w-4" />
                    <AlertDescription>{alert}</AlertDescription>
                  </Alert>
                ))}
              </div>
            </section>
          )}

          {/* Résultats */}
          {result && (
            <>
              <section aria-labelledby="sim-results-heading">
                <h2 id="sim-results-heading" className="mb-4 text-base font-semibold">
                  Résultats par plateforme
                </h2>
                <div className="overflow-x-auto rounded-xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">Plateforme</TableHead>
                        <TableHead className="font-semibold">Potentiel</TableHead>
                        <TableHead className="font-semibold">Durée</TableHead>
                        <TableHead className="min-w-[9rem] font-semibold">Stratégie idéale</TableHead>
                        <TableHead className="min-w-[9rem] font-semibold">Stratégie MAX</TableHead>
                        <TableHead className="min-w-[9rem] font-semibold">Strat. personnalisée</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {result.rows.map((row) => (
                        <PlatformResultRow key={row.id} row={row} />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </section>

              <section aria-labelledby="sim-synthesis-heading">
                <h2 id="sim-synthesis-heading" className="mb-4 text-base font-semibold">
                  Synthèse globale
                </h2>
                <SynthesisTable synthesis={result.synthesis} />
              </section>
            </>
          )}
        </CardContent>
      </Card>

      {/* Documentation & paramètres — réservé aux administrateurs */}
      {showAdminSections && (
      <Accordion type="multiple" className="rounded-xl border border-border/70 px-4">
        <AccordionItem value="doc">
          <AccordionTrigger className="text-sm font-semibold">Documentation — formules</AccordionTrigger>
          <AccordionContent className="space-y-4 text-sm text-muted-foreground pb-4">
            <div>
              <p className="font-medium text-foreground mb-1">Impressions</p>
              <p>
                Impressions = Potentiel × Part audience × Fréquence mensuelle × (Durée / 30).
                Proratisation linéaire — 365 j génère 12× les impressions d&apos;un mois.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Clics</p>
              <p>
                Clics = Impressions × CTR plateforme. YouTube : aucun clic (format notoriété, CTR = 0).
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Saturation (pression mensuelle)</p>
              <p>
                Saturation = (Part audience × Fréquence mensuelle) / Coef fréquence — indépendant de la
                durée. &lt; 0,5 faible · 0,5–1 correcte · 1–1,5 bonne couverture · 1,5–2,2 forte ·
                &gt; 2,2 surpression.
              </p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">Taux global multi-plateformes</p>
              <p>
                META est la plateforme de référence. Taux = MIN(Plafond ; 1 − (1 − Taux_META) ×
                e^(−k × Σ(Taux_i × Coef_incr_i))). k = {SIMULATEUR_GLOBAL_PARAMS.kConvergence} · Plafond
                = {(SIMULATEUR_GLOBAL_PARAMS.globalRateCap * 100).toFixed(0)} %.
              </p>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="params">
          <AccordionTrigger className="text-sm font-semibold">
            Paramètres par plateforme (référence Excel)
          </AccordionTrigger>
          <AccordionContent className="pb-4">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Plateforme</TableHead>
                    <TableHead>Plafond</TableHead>
                    <TableHead>Coef fréq.</TableHead>
                    <TableHead>Coef incr.</TableHead>
                    <TableHead>Part idéale</TableHead>
                    <TableHead>Fréq idéale</TableHead>
                    <TableHead>Part MAX</TableHead>
                    <TableHead>Fréq MAX</TableHead>
                    <TableHead>CTR idéal</TableHead>
                    <TableHead>CTR MAX</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {SIMULATEUR_PLATFORM_ORDER.map(({ id, label }) => {
                    const p = SIMULATEUR_PLATFORM_PARAMS[id]
                    return (
                      <TableRow key={id}>
                        <TableCell className="font-medium">{label}</TableCell>
                        <TableCell>{p.penetrationCap}</TableCell>
                        <TableCell>{p.coefFreq}</TableCell>
                        <TableCell>{p.coefIncremental}</TableCell>
                        <TableCell>{p.partIdeal}</TableCell>
                        <TableCell>{p.freqIdeal}</TableCell>
                        <TableCell>{p.partMax}</TableCell>
                        <TableCell>{p.freqMax}</TableCell>
                        <TableCell>{p.ctrIdeal}</TableCell>
                        <TableCell>{p.ctrMax}</TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      )}
    </div>
  )
}
