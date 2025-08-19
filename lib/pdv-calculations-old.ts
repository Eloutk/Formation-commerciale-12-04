// Coefficients pour chaque plateforme et objectif
export const PLATFORM_COEFFICIENTS = {
  'META': {
    'Impressions': 2.25,
    'Clics sur lien': 0.64,
    'Clics': 0.52,
    'Leads': 64
  },
  'Insta only': {
    'Impressions': 2.8,
    'Clics sur lien': 1.18,
    'Clics': 0.98,
    'Leads': 5.8
  },
  'Display': {
    'Impressions': 2.32,
    'Clics sur lien': 0.748,
    'Clics': 4.8,
    'Leads': 18
  },
  'Youtube': {
    'Impressions': 1.44,
    'Clics sur lien': 0.63,
    'Clics': 1.98,
    'Leads': 560
  },
  'LinkedIn': {
    'Impressions': 2.25,
    'Clics sur lien': 0.64,
    'Clics': 0.52,
    'Leads': 64
  },
  'Snapchat': {
    'Impressions': 2.8,
    'Clics sur lien': 1.18,
    'Clics': 0.98,
    'Leads': 5.8
  },
  'Tiktok': {
    'Impressions': 2.32,
    'Clics sur lien': 0.748,
    'Clics': 4.8,
    'Leads': 18
  },
  'Spotify': {
    'Impressions': 1.44,
    'Clics sur lien': 0.63,
    'Clics': 1.98,
    'Leads': 560
  }
}

export interface PDVCalculation {
  platform: string
  objective: string
  aePercentage: number
  kpis?: number
  budget?: number
  ae: number
  majoration1: number
  majoration2: number
  price?: number
  calculatedKpis?: number
}

// Calcul du prix pour x KPIs
export function calculatePriceForKPIs(
  platform: string,
  objective: string,
  aePercentage: number,
  kpis: number
): PDVCalculation {
  const platformData = PLATFORM_COEFFICIENTS[platform as keyof typeof PLATFORM_COEFFICIENTS]
  const coefficient = platformData?.[objective as keyof typeof platformData]
  
  if (!coefficient) {
    throw new Error(`Combinaison plateforme/objectif non supportée: ${platform} - ${objective}`)
  }

  // Formule exacte basée sur l'analyse Excel
  const ae = (aePercentage * kpis) / 100
  
  let majoration1: number
  if (objective === 'Leads') {
    majoration1 = ae * coefficient
  } else {
    majoration1 = (ae * coefficient) / 1000
  }
  
  const majoration2 = majoration1 / kpis
  const price = majoration2 * 1.15

  return {
    platform,
    objective,
    aePercentage,
    kpis,
    ae,
    majoration1,
    majoration2,
    price
  }
}

// Calcul des KPIs pour x €
export function calculateKPIsForBudget(
  platform: string,
  objective: string,
  aePercentage: number,
  budget: number
): PDVCalculation {
  const platformData = PLATFORM_COEFFICIENTS[platform as keyof typeof PLATFORM_COEFFICIENTS]
  const coefficient = platformData?.[objective as keyof typeof platformData]
  
  if (!coefficient) {
    throw new Error(`Combinaison plateforme/objectif non supportée: ${platform} - ${objective}`)
  }

  // Formule inverse basée sur l'analyse Excel
  // Budget = Majoration2 * 1.15
  // Majoration2 = Majoration1 / 1.15
  // Majoration1 = (AE * coefficient) / 1000 (ou AE * coefficient pour Leads)
  // AE = (aePercentage * kpis) / 100
  
  // Calcul inverse :
  const majoration1 = budget / 1.15
  const majoration2 = majoration1 / 1.15
  
  // Pour trouver les KPIs, on utilise la formule inverse
  let calculatedKpis: number
  if (objective === 'Leads') {
    // Majoration1 = AE * coefficient
    // AE = Majoration1 / coefficient
    // AE = (aePercentage * kpis) / 100
    // kpis = (AE * 100) / aePercentage
    const ae = majoration1 / coefficient
    calculatedKpis = (ae * 100) / aePercentage
  } else {
    // Majoration1 = (AE * coefficient) / 1000
    // AE = (Majoration1 * 1000) / coefficient
    // AE = (aePercentage * kpis) / 100
    // kpis = (AE * 100) / aePercentage
    const ae = (majoration1 * 1000) / coefficient
    calculatedKpis = (ae * 100) / aePercentage
  }

  return {
    platform,
    objective,
    aePercentage,
    budget,
    ae: (aePercentage * calculatedKpis) / 100,
    majoration1,
    majoration2,
    calculatedKpis
  }
}

// Validation des données d'entrée
export function validateInputs(
  platform: string,
  objective: string,
  aePercentage: number,
  kpis?: number,
  budget?: number
): string | null {
  if (!platform || !objective) {
    return 'Plateforme et objectif sont requis'
  }

  if (!PLATFORM_COEFFICIENTS[platform as keyof typeof PLATFORM_COEFFICIENTS]) {
    return 'Plateforme non supportée'
  }

  const platformData = PLATFORM_COEFFICIENTS[platform as keyof typeof PLATFORM_COEFFICIENTS]
  if (!platformData?.[objective as keyof typeof platformData]) {
    return 'Objectif non supporté pour cette plateforme'
  }

  if (aePercentage <= 0 || aePercentage > 100) {
    return 'Le pourcentage AE doit être entre 0 et 100'
  }

  if (kpis !== undefined && kpis <= 0) {
    return 'Le nombre de KPIs doit être positif'
  }

  if (budget !== undefined && budget <= 0) {
    return 'Le budget doit être positif'
  }

  return null
}

// Formatage des nombres
export function formatNumber(value: number, decimals: number = 2): string {
  return value.toFixed(decimals)
}

export function formatCurrency(value: number): string {
  return `${formatNumber(value)}€`
}

export function formatKPIs(value: number): string {
  if (value >= 1000000) {
    return `${formatNumber(value / 1000000, 1)}M`
  } else if (value >= 1000) {
    return `${formatNumber(value / 1000, 1)}K`
  }
  return formatNumber(value, 0)
} 