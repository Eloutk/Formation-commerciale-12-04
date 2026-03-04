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
}

export function getPlatformColor(platform: string): string {
  return PLATFORM_COLORS[platform] ?? '#94a3b8'
}
