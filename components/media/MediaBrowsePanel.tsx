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
  filterMediaAssets,
  isMediaAccessDenied,
  MEDIA_MONTHS,
  MEDIA_PLATFORMS,
  MEDIA_SECTORS,
  MEDIA_YEARS,
  type MediaAsset,
  type MediaFilters,
} from '@/lib/media-config'
import { MediaAssetCard } from '@/components/media/MediaAssetCard'
import { MediaMultiSelect } from '@/components/media/MediaMultiSelect'
import { mediaFetch } from '@/lib/media-api-client'

const NONE = '__none__'

type MediaBrowsePanelProps = {
  enabled: boolean
  refreshKey?: number
}

export function MediaBrowsePanel({ enabled, refreshKey = 0 }: MediaBrowsePanelProps) {
  const [filters, setFilters] = React.useState<MediaFilters>({ sectors: [], platforms: [] })
  const [clientInput, setClientInput] = React.useState('')
  const [campaignInput, setCampaignInput] = React.useState('')
  const [allItems, setAllItems] = React.useState<MediaAsset[]>([])
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

  const loadAllItems = React.useCallback(async () => {
    if (!enabled) {
      setAllItems([])
      return
    }

    setLoading(true)
    setError(null)

    try {
      const res = await mediaFetch('/api/media')
      const json = await res.json().catch(() => ({}))

      if (!res.ok) {
        if (isMediaAccessDenied(res.status)) {
          setAllItems([])
          return
        }
        setError(json.error || 'Impossible de charger les médias')
        setAllItems([])
        return
      }

      setAllItems(json.items ?? [])
    } catch {
      setError('Erreur réseau')
      setAllItems([])
    } finally {
      setLoading(false)
    }
  }, [enabled])

  React.useEffect(() => {
    loadAllItems()
  }, [refreshKey, loadAllItems])

  const filteredItems = React.useMemo(
    () => filterMediaAssets(allItems, filters),
    [allItems, filters],
  )

  const hasActiveFilters =
    (filters.sectors?.length ?? 0) > 0 ||
    (filters.platforms?.length ?? 0) > 0 ||
    !!filters.month ||
    !!filters.year ||
    !!filters.client_name ||
    !!filters.campaign_name

  return (
    <Card className="overflow-hidden border-border/80 shadow-sm">
      <CardHeader className="border-b bg-muted/20 py-4">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Search className="h-5 w-5 text-[#E94C16]" aria-hidden />
          Consulter les médias
        </CardTitle>
        <CardDescription className="text-sm">
          Tous les médias sont affichés par défaut. Affinez la liste en cochant des filtres.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <section className="grid gap-3 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label htmlFor="filter-sectors">Secteurs d&apos;activité</Label>
            <MediaMultiSelect
              id="filter-sectors"
              options={MEDIA_SECTORS}
              value={filters.sectors ?? []}
              onChange={(sectors) => setFilters((prev) => ({ ...prev, sectors }))}
              placeholder="Tous les secteurs"
              selectedLabel={(count) => `${count} secteurs sélectionnés`}
              disabled={!enabled || loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-platforms">Plateformes</Label>
            <MediaMultiSelect
              id="filter-platforms"
              options={MEDIA_PLATFORMS}
              value={filters.platforms ?? []}
              onChange={(platforms) => setFilters((prev) => ({ ...prev, platforms }))}
              placeholder="Toutes les plateformes"
              selectedLabel={(count) => `${count} plateformes sélectionnées`}
              disabled={!enabled || loading}
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-client">Nom du client</Label>
            <Input
              id="filter-client"
              value={clientInput}
              onChange={(e) => setClientInput(e.target.value)}
              placeholder="Rechercher…"
              disabled={!enabled || loading}
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="filter-campaign">Nom de la campagne</Label>
            <Input
              id="filter-campaign"
              value={campaignInput}
              onChange={(e) => setCampaignInput(e.target.value)}
              placeholder="Rechercher…"
              disabled={!enabled || loading}
              className="h-9"
            />
          </div>

          <div className="space-y-1.5">
            <Label>Mois de diffusion</Label>
            <Select
              value={filters.month || NONE}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, month: v === NONE ? undefined : v }))
              }
              disabled={!enabled || loading}
            >
              <SelectTrigger className="h-9">
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

          <div className="space-y-1.5">
            <Label>Année de diffusion</Label>
            <Select
              value={filters.year || NONE}
              onValueChange={(v) =>
                setFilters((prev) => ({ ...prev, year: v === NONE ? undefined : v }))
              }
              disabled={!enabled || loading}
            >
              <SelectTrigger className="h-9">
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
        </section>

        {loading ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement…
          </div>
        ) : null}
        {error ? <p className="text-sm text-red-600">{error}</p> : null}

        {!loading && !error && allItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun média enregistré pour le moment.</p>
        ) : null}

        {!loading && !error && allItems.length > 0 && filteredItems.length === 0 ? (
          <p className="text-sm text-muted-foreground">Aucun média ne correspond à ces filtres.</p>
        ) : null}

        {!loading && filteredItems.length > 0 ? (
          <p className="text-xs text-muted-foreground">
            {filteredItems.length} média{filteredItems.length > 1 ? 's' : ''}
            {hasActiveFilters ? ` sur ${allItems.length}` : ''}
          </p>
        ) : null}

        <div className="space-y-3">
          {filteredItems.map((item) => (
            <MediaAssetCard
              key={item.id}
              item={item}
              canDelete={enabled}
              onDeleted={(id) => setAllItems((prev) => prev.filter((entry) => entry.id !== id))}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
