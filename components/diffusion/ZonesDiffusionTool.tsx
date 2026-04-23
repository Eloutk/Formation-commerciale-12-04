'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  GeoJSON,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import html2canvas from 'html2canvas'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Download, Loader2, MapPin, X } from 'lucide-react'
import 'leaflet/dist/leaflet.css'

type ZoneMode = 'city' | 'dept' | 'region'

type DeptRow = { nom: string; code: string }
type RegionRow = { nom: string; code: string }

type ZoneCircle = {
  id: string
  kind: 'circle'
  center: [number, number]
  radiusM: number
  label: string
}

type ZonePolygon = {
  id: string
  kind: 'polygon'
  geometry: GeoJSON.Geometry
  label: string
}

type ZoneLayer = ZoneCircle | ZonePolygon

function newZoneId() {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return `z-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

function FitBounds({ bounds }: { bounds: L.LatLngBounds | null }) {
  const map = useMap()
  useEffect(() => {
    if (!bounds || !bounds.isValid()) return
    try {
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 11 })
    } catch {
      /* carte pas prête */
    }
  }, [bounds, map])
  return null
}

function frFormatDate(d: Date) {
  return d.toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })
}

function extendBounds(acc: L.LatLngBounds | null, next: L.LatLngBounds | null): L.LatLngBounds | null {
  if (!next || !next.isValid()) return acc
  if (!acc || !acc.isValid()) return L.latLngBounds(next.getSouthWest(), next.getNorthEast())
  return acc.extend(next)
}

/** Bounds d'un cercle géodésique (rayon en m) sans attacher la couche à une carte — évite l'erreur Leaflet getBounds() / layerPointToLatLng. */
function latLngBoundsForCircleMeters(center: [number, number], radiusM: number): L.LatLngBounds {
  const [lat, lng] = center
  const metersPerDegLat = 111_320
  const cosLat = Math.cos((lat * Math.PI) / 180)
  const metersPerDegLng = Math.max(1e-6, 111_320 * cosLat)
  const dLat = radiusM / metersPerDegLat
  const dLng = radiusM / metersPerDegLng
  return L.latLngBounds(L.latLng(lat - dLat, lng - dLng), L.latLng(lat + dLat, lng + dLng))
}

export function ZonesDiffusionTool() {
  /** Zone Leaflet seule : capture pour PDF (évite décalages html2canvas sur le bloc titre+carte). */
  const mapOnlyCaptureRef = useRef<HTMLDivElement>(null)
  const [mapMounted, setMapMounted] = useState(false)
  const [mode, setMode] = useState<ZoneMode>('city')

  const [cityName, setCityName] = useState('Bordeaux')
  const [radiusKm, setRadiusKm] = useState('80')

  const [departments, setDepartments] = useState<DeptRow[]>([])
  const [regions, setRegions] = useState<RegionRow[]>([])
  const [deptCode, setDeptCode] = useState<string>('')
  const [regionCode, setRegionCode] = useState<string>('')

  const [zones, setZones] = useState<ZoneLayer[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)

  const bounds = useMemo(() => {
    let b: L.LatLngBounds | null = null
    for (const z of zones) {
      if (z.kind === 'circle') {
        b = extendBounds(b, latLngBoundsForCircleMeters(z.center, z.radiusM))
      } else {
        try {
          const layer = L.geoJSON(z.geometry as GeoJSON.GeoJsonObject)
          const nb = layer.getBounds()
          b = extendBounds(b, nb)
        } catch {
          /* ignore */
        }
      }
    }
    return b
  }, [zones])

  const summaryLabel = useMemo(
    () => (zones.length ? zones.map((z) => z.label).join(' · ') : ''),
    [zones],
  )

  useEffect(() => {
    setMapMounted(true)
  }, [])

  useEffect(() => {
    let cancelled = false
    const loadLists = async () => {
      try {
        const [dRes, rRes] = await Promise.all([
          fetch('https://geo.api.gouv.fr/departements?fields=nom,code'),
          fetch('https://geo.api.gouv.fr/regions?fields=nom,code'),
        ])
        if (!dRes.ok || !rRes.ok) throw new Error('Liste administrative indisponible')
        const dJson = (await dRes.json()) as DeptRow[]
        const rJson = (await rRes.json()) as RegionRow[]
        if (cancelled) return
        if (!Array.isArray(dJson) || !Array.isArray(rJson)) throw new Error('Réponse API invalide')
        setDepartments(dJson.sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
        setRegions(rJson.sort((a, b) => a.nom.localeCompare(b.nom, 'fr')))
      } catch {
        if (!cancelled) setError('Impossible de charger départements / régions. Réessayez plus tard.')
      }
    }
    loadLists()
    return () => {
      cancelled = true
    }
  }, [])

  const deptFcCache = useRef<GeoJSON.FeatureCollection | null>(null)
  const regionFcCache = useRef<GeoJSON.FeatureCollection | null>(null)

  const loadDeptFc = useCallback(async () => {
    if (deptFcCache.current) return deptFcCache.current
    const res = await fetch('/geo/departements-simplifies.geojson')
    if (!res.ok) throw new Error('Impossible de charger les contours des départements.')
    const fc = (await res.json()) as GeoJSON.FeatureCollection
    deptFcCache.current = fc
    return fc
  }, [])

  const loadRegionFc = useCallback(async () => {
    if (regionFcCache.current) return regionFcCache.current
    const res = await fetch('/geo/regions-simplifies.geojson')
    if (!res.ok) throw new Error('Impossible de charger les contours des régions.')
    const fc = (await res.json()) as GeoJSON.FeatureCollection
    regionFcCache.current = fc
    return fc
  }, [])

  const addCityRadius = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const q = cityName.trim()
      if (!q) throw new Error('Indiquez un nom de commune ou de ville.')
      const km = Math.max(1, Math.min(500, parseFloat(radiusKm.replace(',', '.')) || 0))
      if (!km) throw new Error('Rayon invalide (1 à 500 km).')

      const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(q)}&boost=population&fields=nom,code,centre&limit=8`
      const res = await fetch(url)
      if (!res.ok) throw new Error('Recherche commune échouée.')
      const rows = (await res.json()) as {
        nom: string
        code: string
        centre?: { type: string; coordinates: [number, number] }
      }[]
      if (!Array.isArray(rows)) throw new Error('Réponse géocodage invalide.')
      const hit = rows.find((r) => r.centre?.coordinates)
      if (!hit?.centre?.coordinates) throw new Error(`Aucune commune trouvée pour « ${q} ».`)

      const [lon, lat] = hit.centre.coordinates
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) throw new Error('Coordonnées invalides.')

      const layer: ZoneCircle = {
        id: newZoneId(),
        kind: 'circle',
        center: [lat, lon],
        radiusM: km * 1000,
        label: `${hit.nom} — ${km} km`,
      }
      setZones((prev) => [...prev, layer])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue.')
    } finally {
      setLoading(false)
    }
  }, [cityName, radiusKm])

  const addDepartment = useCallback(
    async (code: string) => {
      if (!code) return
      setError(null)
      setLoading(true)
      try {
        const fc = await loadDeptFc()
        const hit = fc.features.find(
          (f) => f.properties && String((f.properties as { code?: string }).code) === String(code),
        )
        if (!hit?.geometry) throw new Error('Département introuvable dans le jeu de contours local.')
        const nom =
          (hit.properties as { nom?: string })?.nom ??
          departments.find((d) => d.code === code)?.nom ??
          code
        const layer: ZonePolygon = {
          id: newZoneId(),
          kind: 'polygon',
          geometry: hit.geometry,
          label: `Dépt. ${nom} (${code})`,
        }
        setZones((prev) => [...prev, layer])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur inconnue.')
      } finally {
        setLoading(false)
      }
    },
    [loadDeptFc, departments],
  )

  const addRegion = useCallback(
    async (code: string) => {
      if (!code) return
      setError(null)
      setLoading(true)
      try {
        const fc = await loadRegionFc()
        const hit = fc.features.find(
          (f) => f.properties && String((f.properties as { code?: string }).code) === String(code),
        )
        if (!hit?.geometry) throw new Error('Région introuvable dans le jeu de contours local.')
        const nom =
          (hit.properties as { nom?: string })?.nom ??
          regions.find((r) => r.code === code)?.nom ??
          code
        const layer: ZonePolygon = {
          id: newZoneId(),
          kind: 'polygon',
          geometry: hit.geometry,
          label: `Région ${nom}`,
        }
        setZones((prev) => [...prev, layer])
      } catch (e) {
        setError(e instanceof Error ? e.message : 'Erreur inconnue.')
      } finally {
        setLoading(false)
      }
    },
    [loadRegionFc, regions],
  )

  const removeZone = useCallback((id: string) => {
    setZones((prev) => prev.filter((z) => z.id !== id))
  }, [])

  const clearAllZones = useCallback(() => {
    setZones([])
    setError(null)
  }, [])

  const defaultCenter: [number, number] = [46.5, 2.5]
  const fallbackBoundsCenter = bounds?.isValid() ? bounds.getCenter() : null
  const mapCenter: [number, number] = fallbackBoundsCenter
    ? [fallbackBoundsCenter.lat, fallbackBoundsCenter.lng]
    : defaultCenter
  const mapZoom = zones.length ? 6 : 5.5

  const handleExportPdf = async () => {
    if (!mapOnlyCaptureRef.current || !zones.length) return
    setExporting(true)
    setError(null)
    try {
      await new Promise((r) => setTimeout(r, 400))
      await new Promise<void>((resolve) => {
        requestAnimationFrame(() => requestAnimationFrame(() => resolve()))
      })

      const el = mapOnlyCaptureRef.current
      const canvas = await html2canvas(el, {
        useCORS: true,
        allowTaint: true,
        scale: 2,
        logging: false,
        backgroundColor: '#ffffff',
        scrollX: 0,
        scrollY: -window.scrollY,
      })
      const mapImageDataUrl = canvas.toDataURL('image/png')
      const mapPixelWidth = canvas.width
      const mapPixelHeight = canvas.height
      const zoneLabels = zones.map((z) => z.label)
      const exportedAtLabel = `${frFormatDate(new Date())} — ${new Date().toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`

      const [{ pdf }, { ZonesDiffusionPdfDocument }] = await Promise.all([
        import('@react-pdf/renderer'),
        import('@/components/diffusion/ZonesDiffusionPdfDocument'),
      ])

      const doc = (
        <ZonesDiffusionPdfDocument
          mapImageDataUrl={mapImageDataUrl}
          mapPixelWidth={mapPixelWidth}
          mapPixelHeight={mapPixelHeight}
          zoneLabels={zoneLabels}
          exportedAtLabel={exportedAtLabel}
          screenSummaryLine={summaryLabel}
        />
      )
      const blob = await pdf(doc).toBlob()
      const raw = summaryLabel || 'carte-zones'
      const safe = raw.replace(/[^\w\d]+/g, '-').slice(0, 80) || 'carte-zones'
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = `${safe}-${frFormatDate(new Date()).replace(/\//g, '-')}.pdf`
      link.click()
      URL.revokeObjectURL(url)
    } catch {
      setError(
        "Export PDF impossible (souvent dû au chargement des tuiles de la carte). Réessayez après quelques secondes, ou utilisez une capture d'écran.",
      )
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-[#E94C16]" />
            Définir les zones
          </CardTitle>
          <CardDescription>
            Ajoutez plusieurs zones sur la même carte (régions, départements, cercles autour d&apos;une ville). Communes
            :{' '}
            <a
              href="https://geo.api.gouv.fr"
              className="underline text-foreground/80"
              target="_blank"
              rel="noreferrer"
            >
              geo.api.gouv.fr
            </a>
            . Contours : jeu simplifié{' '}
            <a
              href="https://github.com/gregoiredavid/france-geojson"
              className="underline text-foreground/80"
              target="_blank"
              rel="noreferrer"
            >
              france-geojson
            </a>{' '}
            (ODbL). Fond ©{' '}
            <a href="https://www.openstreetmap.org/copyright" className="underline" target="_blank" rel="noreferrer">
              OpenStreetMap
            </a>
            .
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as ZoneMode)
              setError(null)
            }}
          >
            <TabsList className="grid w-full grid-cols-3 max-w-lg">
              <TabsTrigger value="city">Ville + rayon</TabsTrigger>
              <TabsTrigger value="dept">Département</TabsTrigger>
              <TabsTrigger value="region">Région</TabsTrigger>
            </TabsList>

            <TabsContent value="city" className="space-y-3 pt-4">
              <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
                <div className="space-y-1.5">
                  <Label htmlFor="zone-city">Commune ou ville</Label>
                  <Input
                    id="zone-city"
                    value={cityName}
                    onChange={(e) => setCityName(e.target.value)}
                    placeholder="Ex. Bordeaux"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="zone-radius">Rayon (km)</Label>
                  <Input
                    id="zone-radius"
                    type="number"
                    min={1}
                    max={500}
                    value={radiusKm}
                    onChange={(e) => setRadiusKm(e.target.value)}
                  />
                </div>
              </div>
              <Button
                type="button"
                className="bg-[#E94C16] hover:bg-[#d43f12] text-white"
                onClick={() => void addCityRadius()}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter à la carte'}
              </Button>
            </TabsContent>

            <TabsContent value="dept" className="space-y-3 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end max-w-2xl">
                <div className="space-y-1.5 flex-1 max-w-md">
                  <Label>Département</Label>
                  <Select
                    value={deptCode || undefined}
                    onValueChange={(v) => {
                      setDeptCode(v)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir un département" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {departments.map((d) => (
                        <SelectItem key={d.code} value={d.code}>
                          {d.nom} ({d.code})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  className="bg-[#E94C16] hover:bg-[#d43f12] text-white sm:mb-0"
                  onClick={() => void addDepartment(deptCode)}
                  disabled={loading || !deptCode}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter à la carte'}
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="region" className="space-y-3 pt-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-end max-w-2xl">
                <div className="space-y-1.5 flex-1 max-w-md">
                  <Label>Région</Label>
                  <Select
                    value={regionCode || undefined}
                    onValueChange={(v) => {
                      setRegionCode(v)
                    }}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choisir une région" />
                    </SelectTrigger>
                    <SelectContent className="max-h-72">
                      {regions.map((r) => (
                        <SelectItem key={r.code} value={r.code}>
                          {r.nom}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="button"
                  className="bg-[#E94C16] hover:bg-[#d43f12] text-white sm:mb-0"
                  onClick={() => void addRegion(regionCode)}
                  disabled={loading || !regionCode}
                >
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter à la carte'}
                </Button>
              </div>
            </TabsContent>
          </Tabs>

          {zones.length > 0 ? (
            <div className="rounded-lg border border-border/80 bg-muted/20 p-3 space-y-2">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">Zones affichées</p>
                <Button type="button" variant="ghost" size="sm" className="h-7 text-xs" onClick={clearAllZones}>
                  Tout effacer
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {zones.map((z) => (
                  <Badge
                    key={z.id}
                    variant="secondary"
                    className="pl-2 pr-1 py-1 gap-1 max-w-full font-normal text-xs"
                  >
                    <span className="truncate">{z.label}</span>
                    <button
                      type="button"
                      className="rounded-sm p-0.5 hover:bg-background/80 shrink-0"
                      onClick={() => removeZone(z.id)}
                      aria-label={`Retirer ${z.label}`}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  </Badge>
                ))}
              </div>
            </div>
          ) : null}

          {error ? (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          ) : null}
        </CardContent>
      </Card>

      <div className="rounded-xl border border-border bg-card overflow-hidden shadow-sm">
        <div className="overflow-hidden">
          <div className="px-4 py-3 border-b border-border/60 bg-muted/30">
            <p className="text-sm font-medium text-foreground">
              {summaryLabel || 'Aucune zone — ajoutez-en une ou plusieurs ci-dessus.'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Les zones se cumulent sur la carte. Représentation indicative — vérifiez le ciblage réel sur les
              plateformes.
            </p>
          </div>
          <div ref={mapOnlyCaptureRef} className="relative h-[min(420px,55vh)] w-full z-0 bg-white">
            {mapMounted ? (
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="h-full w-full z-0"
                scrollWheelZoom
                attributionControl
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds bounds={bounds} />
                {zones.map((z) =>
                  z.kind === 'circle' ? (
                    <Circle
                      key={z.id}
                      center={z.center}
                      radius={z.radiusM}
                      pathOptions={{
                        color: '#E94C16',
                        fillColor: '#E94C16',
                        fillOpacity: 0.18,
                        weight: 2,
                      }}
                    />
                  ) : (
                    <GeoJSON
                      key={z.id}
                      data={z.geometry as GeoJSON.GeoJsonObject}
                      style={{
                        color: '#E94C16',
                        weight: 2,
                        fillColor: '#E94C16',
                        fillOpacity: 0.15,
                      }}
                    />
                  ),
                )}
              </MapContainer>
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-muted/40 text-sm text-muted-foreground">
                Préparation de la carte…
              </div>
            )}
          </div>
        </div>
        <div className="flex flex-wrap gap-2 px-4 py-3 border-t border-border/60 bg-muted/10">
          <Button type="button" variant="outline" onClick={() => void handleExportPdf()} disabled={exporting || !zones.length}>
            {exporting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Export…
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" />
                Télécharger le PDF
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}
