'use client'

import * as React from 'react'
import { Loader2, Search } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  buildMediaFilterQuery,
  MEDIA_MONTHS,
  MEDIA_YEARS,
  type MediaAsset,
  type MediaFilters,
} from '@/lib/media-config'
import { MediaAssetCard } from '@/components/media/MediaAssetCard'
import { MediaSectorPicker } from '@/components/media/MediaSectorPicker'
import { MediaPlatformPicker } from '@/components/media/MediaPlatformPicker'

const NONE = '__none__'

type MediaBrowsePanelProps = {
  configured: boolean
  refreshKey?: number
}

export function MediaBrowsePanel({ configured, refreshKey = 0 }: MediaBrowsePanelProps) {
  const [filters, setFilters] = React.useState<MediaFilters>({ sectors: [], platforms: [] })
  const [clientInput, setClientInput] = React.useState('')
  const [campaignInput, setCampaignInput] = React.useState('')
  const [items, setItems] = React.useState<MediaAsset[]>([])
  const [loading, setLoading] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        client_name: clientInput.trim() || undefined,
      }))
    }, 300)
    return () => clearTimeout(timer)
  }, [clientInput])

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setFilters((prev) => ({
        ...prev,
        campaign_name: campaignInput.trim() || undefined,
      }))
    }, 300)
    return () => clearTimeout(timer)
  }, [campaignInput])

  const loadItems = React.useCallback(async (activeFilters: MediaFilters) => {
    if (!configured) {
      setItems([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await fetch(`/api/media${buildMediaFilterQuery(activeFilters)}`)
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        setError(json.error || 'Impossible de charger les médias')
        setItems([])
        return
      }

      setItems(json.items ?? [])
    } catch {
      setError('Erreur réseau')
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [configured])

  React.useEffect(() => {
    loadItems(filters)
  }, [filters, refreshKey, loadItems])

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <CardHeader className="border-b bg-muted/20">
        <CardTitle className="flex items-center gap-2">
          <Search className="h-5 w-5 text-[#E94C16]" aria-hidden />
          Consulter les médias
        </CardTitle>
        <CardDescription>
          Filtrez par secteur, plateforme ou critères métier. Les résultats se mettent à jour automatiquement.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        <div className="rounded-xl border border-border/70 bg-muted/15 p-4 space-y-5">
          <div className="space-y-3">
            <Label>Secteurs d&apos;activité</Label>
            <MediaSectorPicker
              compact
              value={filters.sectors ?? []}
              onChange={(sectors) => setFilters((prev) => ({ ...prev, sectors }))}
              disabled={!configured}
            />
          </div>

          <div className="space-y-3">
            <Label>Plateformes</Label>
            <MediaPlatformPicker
              compact
              value={filters.platforms ?? []}
              onChange={(platforms) => setFilters((prev) => ({ ...prev, platforms }))}
              disabled={!configured}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="space-y-2">
              <Label>Mois</Label>
              <Select
                value={filters.month || NONE}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, month: v === NONE ? undefined : v }))
                }
                disabled={!configured}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Tous" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Tous</SelectItem>
                  {MEDIA_MONTHS.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Année</Label>
              <Select
                value={filters.year || NONE}
                onValueChange={(v) =>
                  setFilters((prev) => ({ ...prev, year: v === NONE ? undefined : v }))
                }
                disabled={!configured}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Toutes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={NONE}>Toutes</SelectItem>
                  {MEDIA_YEARS.map((item) => (
                    <SelectItem key={item} value={item}>
                      {item}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="filter-client">Nom du client</Label>
              <Input
                id="filter-client"
                value={clientInput}
                onChange={(e) => setClientInput(e.target.value)}
                placeholder="Rechercher…"
                disabled={!configured}
              />
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-4">
              <Label htmlFor="filter-campaign">Nom de la campagne</Label>
              <Input
                id="filter-campaign"
                value={campaignInput}
                onChange={(e) => setCampaignInput(e.target.value)}
                placeholder="Rechercher…"
                disabled={!configured}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement…
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!loading && !error && items.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun média trouvé pour ces critères.</p>
        ) : null}

        {!loading && items.length > 0 ? (
          <p className="text-xs text-muted-foreground">{items.length} média{items.length > 1 ? 's' : ''}</p>
        ) : null}

        <div className="space-y-3">
          {items.map((item) => (
            <MediaAssetCard key={item.id} item={item} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
