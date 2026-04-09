// Couleurs très contrastées (une teinte bien distincte par plateforme)
export const PLATFORM_COLORS: Record<string, string> = {
  META: '#E85D04',        // orange vif
  Display: '#0077B6',     // bleu océan
  'Perf max': '#6A0DAD',  // violet
  'Demand Gen': '#2D6A4F', // vert forêt
  Search: '#00B4D8',      // cyan
  'Insta only': '#C71585', // rose / magenta
  Youtube: '#B71C1C',     // rouge
  LinkedIn: '#3D5AFE',    // bleu indigo
  Snapchat: '#FFB800',    // or / jaune
  Tiktok: '#212529',      // gris très foncé
  Spotify: '#2DC653',     // vert vif
  SMS: '#0ea5e9',         // sky
  RCS: '#06b6d4',        // cyan
}

/** Retourne la couleur pour une plateforme (accepte "META::Phase 1" → utilise META) */
export function getPlatformColor(platform: string): string {
  const base = platform.includes('::') ? platform.split('::')[0]! : platform
  return PLATFORM_COLORS[base] ?? '#94a3b8'
}

/** Éclaircit ou assombrit une couleur hex (amount > 0 = éclaircir, amount < 0 = assombrir) */
export function adjustColorTint(hex: string, amount: number): string {
  const clean = hex.replace('#', '')
  const num = parseInt(clean, 16)
  if (Number.isNaN(num)) return hex
  const r = (num >> 16) & 0xff
  const g = (num >> 8) & 0xff
  const b = num & 0xff
  const fn = (c: number) =>
    amount >= 0
      ? Math.min(255, Math.round(c + (255 - c) * amount))
      : Math.max(0, Math.round(c * (1 + amount)))
  return `#${fn(r).toString(16).padStart(2, '0')}${fn(g).toString(16).padStart(2, '0')}${fn(b).toString(16).padStart(2, '0')}`
}

/** Teintes par index de phase (0 = base, 1 = plus clair, 2 = encore plus clair, 3+ = variantes) */
const PHASE_TINTS = [0, 0.3, 0.5, -0.15, 0.15] as const

/**
 * Couleur pour une phase d'une plateforme : même base, teintes différentes (vert / vert clair / vert pomme…).
 * phaseIndex = 0 → couleur de base, 1 → plus claire, 2 → encore plus claire, etc.
 */
export function getPlatformPhaseColor(platformKey: string, phaseIndex: number): string {
  const base = getPlatformColor(platformKey)
  const tint = PHASE_TINTS[Math.min(phaseIndex, PHASE_TINTS.length - 1)] ?? 0
  if (tint === 0) return base
  return adjustColorTint(base, tint)
}

/**
 * Construit une map platformKey → index de phase (0, 1, 2…) par plateforme de base.
 * Utile pour afficher chaque phase avec une teinte différente.
 */
export function getPhaseIndexByPlatformKey(items: { platform: string }[]): Map<string, number> {
  const baseToKeys = new Map<string, string[]>()
  for (const item of items) {
    const base = item.platform.includes('::') ? item.platform.split('::')[0]! : item.platform
    if (!baseToKeys.has(base)) baseToKeys.set(base, [])
    const list = baseToKeys.get(base)!
    if (!list.includes(item.platform)) list.push(item.platform)
  }
  const result = new Map<string, number>()
  for (const keys of baseToKeys.values()) {
    keys.sort()
    keys.forEach((key, idx) => result.set(key, idx))
  }
  return result
}
