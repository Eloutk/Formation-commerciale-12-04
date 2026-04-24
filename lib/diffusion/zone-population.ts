/**
 * Calculs de population — sans dépendance Leaflet (évite erreurs SSR / import global).
 */

/** Boîte englobante en WGS84 : ouest, sud, est, nord (degrés). */
export type LngLatBox = { west: number; south: number; east: number; north: number }

/** Distance à vol d’oiseau entre deux points WGS84, en mètres. */
export function haversineMeters(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6_371_000
  const toR = (d: number) => (d * Math.PI) / 180
  const dLat = toR(lat2 - lat1)
  const dLon = toR(lon2 - lon1)
  const a =
    Math.sin(dLat / 2) ** 2 + Math.cos(toR(lat1)) * Math.cos(toR(lat2)) * Math.sin(dLon / 2) ** 2
  return 2 * R * Math.asin(Math.min(1, Math.sqrt(a)))
}

/** Boîte du disque (approximation mètres → degrés), même logique qu’avant avec Leaflet. */
export function circleBoundingBox(center: [number, number], radiusM: number): LngLatBox {
  const [lat, lng] = center
  const metersPerDegLat = 111_320
  const cosLat = Math.cos((lat * Math.PI) / 180)
  const metersPerDegLng = Math.max(1e-6, 111_320 * cosLat)
  const dLat = radiusM / metersPerDegLat
  const dLng = radiusM / metersPerDegLng
  return {
    west: lng - dLng,
    south: lat - dLat,
    east: lng + dLng,
    north: lat + dLat,
  }
}

function mergeBoxes(a: LngLatBox, b: LngLatBox): LngLatBox {
  return {
    west: Math.min(a.west, b.west),
    east: Math.max(a.east, b.east),
    south: Math.min(a.south, b.south),
    north: Math.max(a.north, b.north),
  }
}

function bboxForRing(ring: number[][]): LngLatBox | null {
  if (!ring.length) return null
  let west = Infinity
  let east = -Infinity
  let south = Infinity
  let north = -Infinity
  for (const pt of ring) {
    if (pt.length < 2) continue
    const lng = pt[0]
    const lat = pt[1]
    west = Math.min(west, lng)
    east = Math.max(east, lng)
    south = Math.min(south, lat)
    north = Math.max(north, lat)
  }
  if (!Number.isFinite(west)) return null
  return { west, south, east, north }
}

/** Boîte englobante d’une géométrie GeoJSON (Polygon / MultiPolygon / etc.). */
export function geometryBoundingBox(geometry: GeoJSON.GeoJsonObject): LngLatBox | null {
  try {
    const g = geometry as { type?: string; coordinates?: unknown }
    if (g.type === 'Polygon' && Array.isArray(g.coordinates)) {
      let box: LngLatBox | null = null
      for (const ring of g.coordinates as number[][][]) {
        const b = bboxForRing(ring)
        if (!b) continue
        box = box ? mergeBoxes(box, b) : b
      }
      return box
    }
    if (g.type === 'MultiPolygon' && Array.isArray(g.coordinates)) {
      let box: LngLatBox | null = null
      for (const poly of g.coordinates as number[][][][]) {
        for (const ring of poly) {
          const b = bboxForRing(ring)
          if (!b) continue
          box = box ? mergeBoxes(box, b) : b
        }
      }
      return box
    }
  } catch {
    return null
  }
  return null
}

function boxesIntersect(a: LngLatBox, b: LngLatBox): boolean {
  return a.west <= b.east && a.east >= b.west && a.south <= b.north && a.north >= b.south
}

type CommunePopRow = {
  code?: string
  nom?: string
  population?: number
  codesPostaux?: string[]
  centre?: { type?: string; coordinates?: [number, number] }
}

/** Nombre max de codes postaux distincts pour un ajout groupé (limite appels API). */
export const MAX_POSTAL_CODES_BULK = 80

/** Extrait les codes postaux français (5 chiffres) depuis un texte libre. */
export function parsePostalCodesFromText(raw: string): string[] {
  const set = new Set<string>()
  for (const m of raw.matchAll(/\b\d{5}\b/g)) {
    set.add(m[0])
  }
  return [...set]
}

export type CommunePostalEntry = {
  code: string
  nom: string
  population: number
  /** [lat, lng] pour Leaflet */
  center: [number, number]
  codesPostaux?: string[]
  /** Polygone / multi-polygone communal (geo.api.gouv.fr, champ contour) */
  contour?: GeoJSON.Geometry
}

/**
 * Pour chaque code postal : communes renvoyées par geo.api.gouv.fr.
 * Déduplication par code INSEE : une commune n’est comptée qu’une fois pour la population totale.
 */
export async function communesFromPostalCodesList(
  postalCodes: string[],
): Promise<{ communes: CommunePostalEntry[]; unknownCodes: string[] }> {
  const byInsee = new Map<string, CommunePostalEntry>()
  const unknownCodes: string[] = []

  for (const cp of postalCodes) {
    let rows: CommunePopRow[]
    try {
      rows = await fetchJson<CommunePopRow[]>(
        `https://geo.api.gouv.fr/communes?codePostal=${encodeURIComponent(cp)}&fields=nom,code,population,codesPostaux,centre&limit=50`,
      )
    } catch {
      unknownCodes.push(cp)
      continue
    }
    if (!Array.isArray(rows) || rows.length === 0) {
      unknownCodes.push(cp)
      continue
    }
    for (const r of rows) {
      const code = r.code
      if (!code || byInsee.has(code)) continue
      const coords = r.centre?.coordinates
      if (!coords || coords.length < 2) continue
      const [lon, lat] = coords
      if (!Number.isFinite(lat) || !Number.isFinite(lon)) continue
      const nom = typeof r.nom === 'string' && r.nom.trim() ? r.nom.trim() : code
      byInsee.set(code, {
        code,
        nom,
        population: typeof r.population === 'number' ? r.population : 0,
        center: [lat, lon],
        codesPostaux: Array.isArray(r.codesPostaux) ? r.codesPostaux : undefined,
      })
    }
  }

  return { communes: [...byInsee.values()], unknownCodes }
}

export function totalPopulationCommunes(communes: CommunePostalEntry[]): number {
  return communes.reduce((s, c) => s + c.population, 0)
}

async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`API indisponible (${res.status})`)
  return (await res.json()) as T
}

const CONCURRENCY_CONTOURS = 6

/**
 * Ajoute le contour géographique de chaque commune (limite administrative), pour affichage carte.
 */
export async function enrichCommunesWithContours(
  communes: CommunePostalEntry[],
): Promise<CommunePostalEntry[]> {
  const result: CommunePostalEntry[] = []
  for (let i = 0; i < communes.length; i += CONCURRENCY_CONTOURS) {
    const batch = communes.slice(i, i + CONCURRENCY_CONTOURS)
    const batchOut = await Promise.all(
      batch.map(async (c) => {
        try {
          const row = await fetchJson<{ contour?: GeoJSON.Geometry }>(
            `https://geo.api.gouv.fr/communes/${encodeURIComponent(c.code)}?fields=code,contour`,
          )
          const g = row.contour
          if (g && (g.type === 'Polygon' || g.type === 'MultiPolygon')) {
            return { ...c, contour: g }
          }
          return { ...c }
        } catch {
          return { ...c }
        }
      }),
    )
    result.push(...batchOut)
  }
  return result
}

/** Somme des populations communales officielles du département (champ population geo.api.gouv.fr). */
export async function populationDepartement(deptCode: string): Promise<number> {
  const rows = await fetchJson<CommunePopRow[]>(
    `https://geo.api.gouv.fr/departements/${encodeURIComponent(deptCode)}/communes?fields=code,population`,
  )
  if (!Array.isArray(rows)) return 0
  return rows.reduce((s, r) => s + (typeof r.population === 'number' ? r.population : 0), 0)
}

/** Agrège tous les départements de la région. */
export async function populationRegion(regionCode: string): Promise<number> {
  const depts = await fetchJson<{ code: string }[]>(
    `https://geo.api.gouv.fr/regions/${encodeURIComponent(regionCode)}/departements?fields=code`,
  )
  if (!Array.isArray(depts)) return 0
  const sums = await Promise.all(depts.map((d) => populationDepartement(d.code)))
  return sums.reduce((a, b) => a + b, 0)
}

type DeptFeature = GeoJSON.Feature<GeoJSON.Geometry, { code?: string }>

/**
 * Estimation pour un disque : communes dont le centre géographique est à l’intérieur du cercle.
 * Parcourt les départements dont l’emprise intersecte la boîte du cercle (contours locaux).
 */
export async function populationCircleApprox(
  center: [number, number],
  radiusM: number,
  departementsFc: GeoJSON.FeatureCollection,
): Promise<number> {
  const [lat0, lng0] = center
  const circleBox = circleBoundingBox(center, radiusM)
  const deptFeatures = departementsFc.features as DeptFeature[]
  let total = 0
  const seenCommune = new Set<string>()

  for (const f of deptFeatures) {
    const code = f.properties?.code
    if (!code || !f.geometry) continue
    const deptBox = geometryBoundingBox(f.geometry as GeoJSON.GeoJsonObject)
    if (!deptBox || !boxesIntersect(circleBox, deptBox)) continue

    const rows = await fetchJson<CommunePopRow[]>(
      `https://geo.api.gouv.fr/departements/${encodeURIComponent(code)}/communes?fields=code,population,centre`,
    )
    if (!Array.isArray(rows)) continue
    for (const r of rows) {
      const c = r.code
      if (!c || seenCommune.has(c)) continue
      const coords = r.centre?.coordinates
      if (!coords || coords.length < 2) continue
      const [lon, lat] = coords
      if (haversineMeters(lat0, lng0, lat, lon) <= radiusM) {
        seenCommune.add(c)
        total += typeof r.population === 'number' ? r.population : 0
      }
    }
  }

  return total
}
