'use client'

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import {
  MapContainer,
  TileLayer,
  Circle,
  CircleMarker,
  GeoJSON,
  useMap,
} from 'react-leaflet'
import L from 'leaflet'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { AlertTriangle, Download, Loader2, MapPin, Sparkles, Users, X } from 'lucide-react'
import {
  MAX_POSTAL_CODES_BULK,
  circleBoundingBox,
  communesFromPostalCodesList,
  enrichCommunesWithContours,
  geometryBoundingBox,
  parsePostalCodesFromText,
  populationCircleApprox,
  populationDepartement,
  populationRegion,
  totalPopulationCommunes,
} from '@/lib/diffusion/zone-population'
import 'leaflet/dist/leaflet.css'

type ZoneMode = 'city' | 'postal_bulk' | 'dept' | 'region'

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
  adminType: 'dept' | 'region'
  adminCode: string
}

type ZonePostalGroup = {
  id: string
  kind: 'postal_group'
  postalCodes: string[]
  communes: Array<{
    code: string
    nom: string
    population: number
    center: [number, number]
    /** Contour communal (geo.api.gouv.fr) ; sinon petit marqueur au centre */
    geometry?: GeoJSON.Geometry
  }>
  label: string
}

type ZoneLayer = ZoneCircle | ZonePolygon | ZonePostalGroup

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

function extendBounds(acc: L.LatLngBounds | null, next: L.LatLngBounds | null): L.LatLngBounds | null {
  if (!next || !next.isValid()) return acc
  if (!acc || !acc.isValid()) return L.latLngBounds(next.getSouthWest(), next.getNorthEast())
  return acc.extend(next)
}

/** Cercle → bounds Leaflet (évite d’importer Leaflet dans lib/ pour le SSR). */
function circleToLatLngBounds(center: [number, number], radiusM: number): L.LatLngBounds {
  const b = circleBoundingBox(center, radiusM)
  return L.latLngBounds(L.latLng(b.south, b.west), L.latLng(b.north, b.east))
}

type PopLine = { label: string; population: number; method: string }

type CommuneGeoRow = {
  nom: string
  code: string
  codesPostaux?: string[]
  centre?: { type?: string; coordinates?: [number, number] }
}

type PopEstimateState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; lines: PopLine[]; total: number }
  | { status: 'error'; message: string }

export function ZonesDiffusionTool() {
  const [mapMounted, setMapMounted] = useState(false)
  const [mode, setMode] = useState<ZoneMode>('city')

  const [cityName, setCityName] = useState('Bordeaux')
  const [radiusKm, setRadiusKm] = useState('80')
  const [citySuggestions, setCitySuggestions] = useState<CommuneGeoRow[]>([])
  const [citySuggestLoading, setCitySuggestLoading] = useState(false)
  const [citySuggestOpen, setCitySuggestOpen] = useState(false)
  const [citySuggestHighlight, setCitySuggestHighlight] = useState(0)
  const [cityInputFocused, setCityInputFocused] = useState(false)
  const [selectedCommune, setSelectedCommune] = useState<CommuneGeoRow | null>(null)

  const [departments, setDepartments] = useState<DeptRow[]>([])
  const [regions, setRegions] = useState<RegionRow[]>([])
  const [deptCode, setDeptCode] = useState<string>('')
  const [regionCode, setRegionCode] = useState<string>('')
  const [postalBulkText, setPostalBulkText] = useState('')

  const [zones, setZones] = useState<ZoneLayer[]>([])

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [popEstimate, setPopEstimate] = useState<PopEstimateState>({ status: 'idle' })
  const [postalBulkNotice, setPostalBulkNotice] = useState<string | null>(null)

  const bounds = useMemo(() => {
    let b: L.LatLngBounds | null = null
    for (const z of zones) {
      if (z.kind === 'circle') {
        b = extendBounds(b, circleToLatLngBounds(z.center, z.radiusM))
      } else if (z.kind === 'postal_group') {
        for (const c of z.communes) {
          if (c.geometry) {
            const box = geometryBoundingBox(c.geometry as GeoJSON.GeoJsonObject)
            if (box) {
              b = extendBounds(
                b,
                L.latLngBounds(L.latLng(box.south, box.west), L.latLng(box.north, box.east)),
              )
            }
          } else {
            b = extendBounds(b, circleToLatLngBounds(c.center, 600))
          }
        }
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
    if (mode !== 'city') {
      setCitySuggestions([])
      setCitySuggestOpen(false)
    }
  }, [mode])

  useEffect(() => {
    if (mode !== 'city' || !cityInputFocused) return
    const q = cityName.trim()
    if (q.length < 2) {
      setCitySuggestions([])
      setCitySuggestLoading(false)
      setCitySuggestOpen(false)
      return
    }
    const ac = new AbortController()
    const t = window.setTimeout(() => {
      void (async () => {
        setCitySuggestLoading(true)
        try {
          const isCp = /^\d{5}$/.test(q)
          const url = isCp
            ? `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(q)}&fields=nom,code,codesPostaux,centre&limit=15`
            : `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(q)}&boost=population&fields=nom,code,codesPostaux,centre&limit=15`
          const res = await fetch(url, { signal: ac.signal })
          if (!res.ok) throw new Error('Erreur API communes')
          const rows = (await res.json()) as CommuneGeoRow[]
          if (ac.signal.aborted) return
          if (!Array.isArray(rows)) {
            setCitySuggestions([])
            setCitySuggestOpen(false)
            return
          }
          const withCentre = rows.filter((r) => r.centre?.coordinates && r.nom)
          setCitySuggestions(withCentre)
          setCitySuggestHighlight(0)
          setCitySuggestOpen(withCentre.length > 0)
        } catch (e) {
          if ((e as Error).name === 'AbortError') return
          if (!ac.signal.aborted) setCitySuggestions([])
          if (!ac.signal.aborted) setCitySuggestOpen(false)
        } finally {
          if (!ac.signal.aborted) setCitySuggestLoading(false)
        }
      })()
    }, 320)
    return () => {
      ac.abort()
      window.clearTimeout(t)
    }
  }, [cityName, mode, cityInputFocused])

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

  const applyCommunePick = useCallback((row: CommuneGeoRow) => {
    if (!row.centre?.coordinates) return
    setCityName(row.nom)
    setSelectedCommune(row)
    setCitySuggestOpen(false)
    setCitySuggestions([])
  }, [])

  const addCityRadius = useCallback(async () => {
    setError(null)
    setLoading(true)
    try {
      const q = cityName.trim()
      if (!q) throw new Error('Indiquez un nom de commune ou de ville.')
      const km = Math.max(1, Math.min(500, parseFloat(radiusKm.replace(',', '.')) || 0))
      if (!km) throw new Error('Rayon invalide (1 à 500 km).')

      const qNorm = q.toLowerCase()
      const fromPick =
        selectedCommune?.centre?.coordinates &&
        selectedCommune.nom.trim().toLowerCase() === qNorm
          ? selectedCommune
          : null

      let hit: CommuneGeoRow | null = fromPick
      if (!hit) {
        const url = `https://geo.api.gouv.fr/communes?nom=${encodeURIComponent(q)}&boost=population&fields=nom,code,codesPostaux,centre&limit=8`
        const res = await fetch(url)
        if (!res.ok) throw new Error('Recherche commune échouée.')
        const rows = (await res.json()) as CommuneGeoRow[]
        if (!Array.isArray(rows)) throw new Error('Réponse géocodage invalide.')
        hit = rows.find((r) => r.centre?.coordinates) ?? null
      }
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
  }, [cityName, radiusKm, selectedCommune])

  const addPostalBulk = useCallback(async () => {
    setError(null)
    setPostalBulkNotice(null)
    setLoading(true)
    try {
      const codes = parsePostalCodesFromText(postalBulkText)
      if (!codes.length) {
        throw new Error('Saisissez au moins un code postal à 5 chiffres (séparés par des virgules ou des retours à la ligne).')
      }
      if (codes.length > MAX_POSTAL_CODES_BULK) {
        throw new Error(`Maximum ${MAX_POSTAL_CODES_BULK} codes postaux distincts par ajout.`)
      }
      const { communes, unknownCodes } = await communesFromPostalCodesList(codes)
      if (!communes.length) {
        throw new Error(
          unknownCodes.length
            ? `Aucune commune trouvée pour : ${unknownCodes.join(', ')}.`
            : 'Aucune commune avec coordonnées pour ces codes postaux.',
        )
      }
      const withContours = await enrichCommunesWithContours(communes)
      const pop = totalPopulationCommunes(withContours)
      const cpShort =
        codes.length <= 4 ? codes.join(', ') : `${codes.slice(0, 3).join(', ')}… +${codes.length - 3}`
      const layer: ZonePostalGroup = {
        id: newZoneId(),
        kind: 'postal_group',
        postalCodes: codes,
        communes: withContours.map((c) => ({
          code: c.code,
          nom: c.nom,
          population: c.population,
          center: c.center,
          geometry: c.contour,
        })),
        label: `CP ${cpShort} — ${withContours.length} com. — ${pop.toLocaleString('fr-FR')} hab.`,
      }
      setZones((prev) => [...prev, layer])
      if (unknownCodes.length) {
        setPostalBulkNotice(
          `Codes postaux sans résultat (ignorés) : ${unknownCodes.join(', ')}. Les autres ont bien été ajoutés.`,
        )
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue.')
    } finally {
      setLoading(false)
    }
  }, [postalBulkText])

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
          adminType: 'dept',
          adminCode: code,
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
          adminType: 'region',
          adminCode: code,
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
    setPostalBulkNotice(null)
    setPopEstimate({ status: 'idle' })
  }, [])

  useEffect(() => {
    if (!zones.length) {
      setPopEstimate({ status: 'idle' })
      return
    }
    let cancelled = false
    setPopEstimate({ status: 'loading' })
    ;(async () => {
      try {
        const lines: PopLine[] = []
        for (const z of zones) {
          if (cancelled) return
          if (z.kind === 'postal_group') {
            const population = z.communes.reduce((s, c) => s + c.population, 0)
            lines.push({
              label: z.label,
              population,
              method:
                'Somme des populations communales (dédupliquées par code INSEE) pour les communes liées aux codes postaux saisis — champ « population » de geo.api.gouv.fr.',
            })
          } else if (z.kind === 'polygon') {
            if (z.adminType === 'dept') {
              const population = await populationDepartement(z.adminCode)
              lines.push({
                label: z.label,
                population,
                method:
                  'Somme des populations communales du département (champ « population » de geo.api.gouv.fr).',
              })
            } else {
              const population = await populationRegion(z.adminCode)
              lines.push({
                label: z.label,
                population,
                method:
                  'Somme des populations communales de tous les départements de la région (même source).',
              })
            }
          } else {
            const fc = await loadDeptFc()
            if (cancelled) return
            const population = await populationCircleApprox(z.center, z.radiusM, fc)
            lines.push({
              label: z.label,
              population,
              method:
                'Somme des communes dont le centre géographique tombe dans le disque (approximation ; pas de découpe surfacique).',
            })
          }
        }
        const total = lines.reduce((s, l) => s + l.population, 0)
        if (!cancelled) setPopEstimate({ status: 'ready', lines, total })
      } catch (e) {
        if (!cancelled) {
          setPopEstimate({
            status: 'error',
            message: e instanceof Error ? e.message : "Impossible d'estimer la population.",
          })
        }
      }
    })()
    return () => {
      cancelled = true
    }
  }, [zones, loadDeptFc])

  const defaultCenter: [number, number] = [46.5, 2.5]
  const fallbackBoundsCenter = bounds?.isValid() ? bounds.getCenter() : null
  const mapCenter: [number, number] = fallbackBoundsCenter
    ? [fallbackBoundsCenter.lat, fallbackBoundsCenter.lng]
    : defaultCenter
  const mapZoom = zones.length ? 6 : 5.5

  return (
    <div className="space-y-6">
      <Card className="border-border/80 shadow-sm">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="h-5 w-5 text-[#E94C16]" />
            Définir les zones
          </CardTitle>
          <CardDescription>
            Ajoutez plusieurs zones sur la même carte (régions, départements, cercles, groupes de codes postaux).
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Tabs
            value={mode}
            onValueChange={(v) => {
              setMode(v as ZoneMode)
              setError(null)
              setPostalBulkNotice(null)
            }}
          >
            <TabsList className="grid h-auto w-full grid-cols-2 gap-1 p-1 sm:grid-cols-4 sm:max-w-4xl">
              <TabsTrigger value="city" className="px-2 py-2.5 text-[11px] leading-tight sm:py-2 sm:text-sm">
                Ville + rayon
              </TabsTrigger>
              <TabsTrigger
                value="postal_bulk"
                className="px-2 py-2.5 text-[11px] leading-tight sm:py-2 sm:text-sm"
              >
                Codes postaux
              </TabsTrigger>
              <TabsTrigger value="dept" className="px-2 py-2.5 text-[11px] leading-tight sm:py-2 sm:text-sm">
                Département
              </TabsTrigger>
              <TabsTrigger value="region" className="px-2 py-2.5 text-[11px] leading-tight sm:py-2 sm:text-sm">
                Région
              </TabsTrigger>
            </TabsList>

            <TabsContent value="city" className="space-y-3 pt-4">
              <div className="grid gap-3 sm:grid-cols-2 max-w-xl">
                <div className="space-y-1.5">
                  <Label htmlFor="zone-city">Commune ou ville</Label>
                  <div className="relative">
                    <Input
                      id="zone-city"
                      autoComplete="off"
                      aria-autocomplete="list"
                      aria-expanded={citySuggestOpen}
                      aria-controls="zone-city-suggestions"
                      value={cityName}
                      onChange={(e) => {
                        const v = e.target.value
                        setCityName(v)
                        if (
                          !selectedCommune ||
                          selectedCommune.nom.trim().toLowerCase() !== v.trim().toLowerCase()
                        ) {
                          setSelectedCommune(null)
                        }
                      }}
                      onFocus={() => setCityInputFocused(true)}
                      onBlur={() => {
                        window.setTimeout(() => {
                          setCityInputFocused(false)
                          setCitySuggestOpen(false)
                        }, 180)
                      }}
                      onKeyDown={(e) => {
                        if (!citySuggestOpen || citySuggestions.length === 0) return
                        if (e.key === 'ArrowDown') {
                          e.preventDefault()
                          setCitySuggestHighlight((i) =>
                            i + 1 >= citySuggestions.length ? 0 : i + 1,
                          )
                        } else if (e.key === 'ArrowUp') {
                          e.preventDefault()
                          setCitySuggestHighlight((i) =>
                            i - 1 < 0 ? citySuggestions.length - 1 : i - 1,
                          )
                        } else if (e.key === 'Enter') {
                          const row = citySuggestions[citySuggestHighlight]
                          if (row) {
                            e.preventDefault()
                            applyCommunePick(row)
                          }
                        } else if (e.key === 'Escape') {
                          setCitySuggestOpen(false)
                        }
                      }}
                      placeholder="Nom ou code postal (5 chiffres)"
                    />
                    {citySuggestLoading ? (
                      <Loader2
                        className="pointer-events-none absolute right-2.5 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground"
                        aria-hidden
                      />
                    ) : null}
                    {citySuggestOpen && citySuggestions.length > 0 ? (
                      <ul
                        id="zone-city-suggestions"
                        role="listbox"
                        className="absolute left-0 right-0 top-full z-50 mt-1 max-h-60 overflow-auto rounded-md border border-border bg-popover py-1 text-sm shadow-md"
                      >
                        {citySuggestions.map((row, i) => {
                          const cpLine = row.codesPostaux?.length
                            ? row.codesPostaux.join(', ')
                            : null
                          const active = i === citySuggestHighlight
                          return (
                            <li key={`${row.code}-${i}`} role="presentation">
                              <button
                                type="button"
                                role="option"
                                aria-selected={active}
                                className={`flex w-full flex-col items-start gap-0.5 px-3 py-2 text-left hover:bg-accent ${
                                  active ? 'bg-accent' : ''
                                }`}
                                onMouseDown={(ev) => ev.preventDefault()}
                                onMouseEnter={() => setCitySuggestHighlight(i)}
                                onClick={() => applyCommunePick(row)}
                              >
                                <span className="font-medium text-foreground">{row.nom}</span>
                                <span className="text-xs tabular-nums text-muted-foreground">
                                  {cpLine ? `Codes postaux : ${cpLine}` : 'Codes postaux non renseignés'}
                                </span>
                              </button>
                            </li>
                          )
                        })}
                      </ul>
                    ) : null}
                  </div>
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
                className="min-h-10 w-full bg-[#E94C16] text-white hover:bg-[#d43f12] sm:w-auto"
                onClick={() => void addCityRadius()}
                disabled={loading}
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ajouter à la carte'}
              </Button>
            </TabsContent>

            <TabsContent value="postal_bulk" className="space-y-3 pt-4">
              <div className="max-w-2xl space-y-2">
                <Label htmlFor="zone-postal-bulk">Codes postaux (ajout groupé)</Label>
                <Textarea
                  id="zone-postal-bulk"
                  value={postalBulkText}
                  onChange={(e) => setPostalBulkText(e.target.value)}
                  placeholder={'33000, 33100, 33200\nou un code par ligne'}
                  rows={5}
                  className="min-h-[120px] resize-y font-mono text-sm"
                />
                <p className="text-xs leading-relaxed text-muted-foreground">
                  Saisissez des codes à 5 chiffres, séparés par des virgules, espaces ou retours à la ligne. Les doublons
                  sont ignorés. Maximum {MAX_POSTAL_CODES_BULK} codes par ajout. Sur la carte, chaque commune est affichée
                  avec son{' '}
                  <span className="font-medium text-foreground">contour administratif</span> (données
                  geo.api.gouv.fr), pas un disque autour du code postal. La population est la somme des communes uniques
                  (une commune partagée par plusieurs CP n&apos;est comptée qu&apos;une fois).
                </p>
              </div>
              <Button
                type="button"
                className="min-h-10 w-full bg-[#E94C16] text-white hover:bg-[#d43f12] sm:w-auto"
                onClick={() => void addPostalBulk()}
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
                  className="min-h-10 w-full bg-[#E94C16] text-white hover:bg-[#d43f12] sm:mb-0 sm:w-auto"
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
                  className="min-h-10 w-full bg-[#E94C16] text-white hover:bg-[#d43f12] sm:mb-0 sm:w-auto"
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

          {postalBulkNotice ? (
            <Alert className="border-amber-500/40 bg-amber-50/60 py-3 dark:bg-amber-950/25">
              <AlertTitle className="text-sm text-amber-900 dark:text-amber-100">Information</AlertTitle>
              <AlertDescription className="text-amber-900/90 dark:text-amber-50/90">
                {postalBulkNotice}
              </AlertDescription>
            </Alert>
          ) : null}

          {error ? (
            <Alert variant="destructive" className="border-destructive/40 py-3">
              <AlertTriangle className="h-4 w-4" aria-hidden />
              <AlertTitle className="text-sm">Action impossible</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}
        </CardContent>
      </Card>

      <div className="overflow-hidden rounded-xl border border-border/80 bg-card shadow-md ring-1 ring-black/[0.04]">
        <div className="overflow-hidden">
          <div className="border-b border-border/60 bg-muted/30 px-4 py-3 sm:px-5 sm:py-3.5">
            <p className="text-sm font-medium text-foreground">
              {summaryLabel ? (
                <>Aperçu : {summaryLabel}</>
              ) : (
                <>Aucune zone pour l&apos;instant — ajoutez-en une ci-dessus pour voir la carte.</>
              )}
            </p>
            <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
              Les zones se cumulent sur la carte. Représentation indicative ; validez le ciblage sur vos outils
              métiers.
            </p>
            <div
              className="mt-3 flex gap-3 rounded-xl border border-[#E94C16]/25 bg-gradient-to-br from-[#E94C16]/[0.12] via-background/80 to-background px-3.5 py-3 shadow-[0_1px_0_rgba(233,76,22,0.06)] backdrop-blur-[2px] sm:items-center sm:px-4"
              role="note"
            >
              <span
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E94C16] text-white shadow-md shadow-[#E94C16]/25 ring-2 ring-white/60 dark:ring-white/10"
                aria-hidden
              >
                <Sparkles className="h-4 w-4" strokeWidth={2.25} />
              </span>
              <p className="text-[13px] leading-snug text-foreground sm:text-sm">
                <span className="font-semibold tracking-tight text-[#E94C16]">Astuce</span>
                <span className="text-muted-foreground"> — </span>
                Prends une capture d&apos;écran pour l&apos;intégrer dans tes présentations client.
              </p>
            </div>
          </div>
          <div className="relative z-0 h-[min(440px,58vh)] w-full bg-white sm:h-[min(480px,55vh)]">
            {mapMounted ? (
              <MapContainer
                center={mapCenter}
                zoom={mapZoom}
                className="z-0 h-full w-full"
                scrollWheelZoom
                attributionControl
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <FitBounds bounds={bounds} />
                {zones.map((z) => {
                  if (z.kind === 'circle') {
                    return (
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
                    )
                  }
                  if (z.kind === 'postal_group') {
                    return (
                      <React.Fragment key={z.id}>
                        {z.communes.map((c) =>
                          c.geometry ? (
                            <GeoJSON
                              key={`${z.id}-${c.code}`}
                              data={c.geometry as GeoJSON.GeoJsonObject}
                              style={{
                                color: '#E94C16',
                                weight: 2,
                                fillColor: '#E94C16',
                                fillOpacity: 0.15,
                              }}
                            />
                          ) : (
                            <CircleMarker
                              key={`${z.id}-${c.code}`}
                              center={c.center}
                              radius={6}
                              pathOptions={{
                                color: '#E94C16',
                                fillColor: '#E94C16',
                                fillOpacity: 0.85,
                                weight: 2,
                              }}
                            />
                          ),
                        )}
                      </React.Fragment>
                    )
                  }
                  return (
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
                  )
                })}
              </MapContainer>
            ) : (
              <div className="flex h-full min-h-[200px] w-full flex-col items-center justify-center gap-2 bg-muted/40 px-4 text-center text-sm text-muted-foreground">
                <Loader2 className="h-6 w-6 animate-spin text-[#E94C16]" aria-hidden />
                <span>Préparation de la carte…</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {zones.length > 0 ? (
        <Card className="border-[#E94C16]/25 shadow-sm">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-5 w-5 text-[#E94C16]" aria-hidden />
              Population estimée
            </CardTitle>
            <CardDescription className="text-xs leading-relaxed">
              Chiffres issus de l&apos;API géographique officielle (population communale). Si plusieurs zones se
              chevauchent, la somme peut surestimer le nombre d&apos;habitants — utilisez le total comme ordre de
              grandeur.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {popEstimate.status === 'loading' ? (
              <p className="flex items-center gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 shrink-0 animate-spin" />
                Calcul en cours via geo.api.gouv.fr…
              </p>
            ) : null}
            {popEstimate.status === 'error' ? (
              <Alert variant="destructive" className="border-destructive/40 py-3">
                <AlertTriangle className="h-4 w-4" aria-hidden />
                <AlertTitle className="text-sm">Estimation indisponible</AlertTitle>
                <AlertDescription>{popEstimate.message}</AlertDescription>
              </Alert>
            ) : null}
            {popEstimate.status === 'ready' ? (
              <div className="space-y-3">
                <ul className="space-y-2 text-sm">
                  {popEstimate.lines.map((line, i) => (
                    <li key={`pop-${i}`} className="rounded-md border border-border/60 bg-muted/20 px-3 py-2">
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-medium text-foreground">{line.label}</span>
                        <span className="tabular-nums font-semibold text-[#E94C16]">
                          {line.population.toLocaleString('fr-FR')} hab.
                        </span>
                      </div>
                      <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{line.method}</p>
                    </li>
                  ))}
                </ul>
                <div className="flex flex-wrap items-baseline justify-between gap-2 border-t border-border pt-3 text-sm">
                  <span className="font-semibold">Total (lignes additionnées)</span>
                  <span className="tabular-nums text-lg font-bold text-[#E94C16]">
                    {popEstimate.total.toLocaleString('fr-FR')} hab.
                  </span>
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      ) : null}
    </div>
  )
}
