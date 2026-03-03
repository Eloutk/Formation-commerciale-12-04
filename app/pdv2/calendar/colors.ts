// Couleurs bien distinctes visuellement (éviter bleus/verts/rouges proches)
export const PLATFORM_COLORS: Record<string, string> = {
  META: '#E94C16',        // orange
  Display: '#2563EB',     // bleu
  'Perf max': '#7C3AED',  // violet
  'Demand Gen': '#0D9488', // teal
  Search: '#0891B2',      // cyan
  'Insta only': '#DB2777', // rose / magenta
  Youtube: '#DC2626',     // rouge
  LinkedIn: '#0A66C2',    // bleu LinkedIn
  Snapchat: '#EAB308',    // jaune / ambre
  Tiktok: '#171717',      // noir / gris très foncé
  Spotify: '#16A34A',     // vert
}

export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] ?? '#94a3b8'
}
