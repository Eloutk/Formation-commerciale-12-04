import {
  PLATFORMS_ORDER,
  type SocialMediaPlatform,
} from '@/lib/social-media-platform-objectives'

export type PlatformCtaOption = {
  id: string
  label: string
}

/** CTA LinkedIn Ads — identiques quel que soit l'objectif de campagne. */
export const LINKEDIN_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'postuler', label: 'Postuler' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'voir-le-devis', label: 'Voir le devis' },
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'senregistrer', label: "S'enregistrer" },
  { id: 'rejoindre', label: 'Rejoindre' },
  { id: 'participer', label: 'Participer' },
  { id: 'demander-une-demo', label: 'Demander une démo' },
  { id: 'acheter-maintenant', label: 'Acheter maintenant' },
  { id: 'explorer-maintenant', label: 'Explorer maintenant' },
] as const

/** CTA Snapchat Ads — identiques quel que soit l'objectif de campagne. */
export const SNAPCHAT_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'faire-la-demande', label: 'Faire la demande' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'acheter-des-places', label: 'Acheter des places' },
  { id: 'faire-un-don', label: 'Faire un don' },
  { id: 'obtenir', label: 'Obtenir' },
  { id: 'ecouter', label: 'Écouter' },
  { id: 'plus', label: 'Plus' },
  { id: 'commander', label: 'Commander' },
  { id: 'lecture', label: 'Lecture' },
  { id: 'jouer', label: 'Jouer' },
  { id: 'se-preinscrire', label: 'Se préinscrire' },
  { id: 'lire', label: 'Lire' },
  { id: 'demander-un-devis', label: 'Demander un devis' },
  { id: 'achetez-maintenant', label: 'Achetez maintenant' },
  { id: 'afficher', label: 'Afficher' },
  { id: 'seances', label: 'Séances' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'voir', label: 'Voir' },
  { id: 'voir-le-menu', label: 'Voir le menu' },
  { id: 'voter', label: 'Voter' },
  { id: 'regarder', label: 'Regarder' },
] as const

/** CTA META Ads — objectif Impressions. */
export const META_IMPRESSIONS_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'postuler-maintenant', label: 'Postuler maintenant' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'nous-contacter', label: 'Nous contacter' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'itineraire', label: 'Itinéraire' },
  { id: 'obtenir-un-devis', label: 'Obtenir un devis' },
  { id: 'obtenir-les-horaires', label: 'Obtenir les horaires' },
  { id: 'voir-les-details', label: 'Voir les détails' },
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'ecouter-maintenant', label: 'Écouter maintenant' },
  { id: 'envoyer-un-message', label: 'Envoyer un message' },
  { id: 'commander', label: 'Commander' },
  { id: 'demander-lhoraire', label: "Demander l'horaire" },
  { id: 'voir-le-menu', label: 'Voir le menu' },
  { id: 'acheter', label: 'Acheter' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'autres-videos', label: 'Autres vidéos' },
  { id: 'envoyer-un-message-whatsapp', label: 'Envoyer un message WhatsApp' },
  { id: 'enregistrer', label: 'Enregistrer' },
] as const

/** CTA META Ads — objectifs Clics et Clics sur lien. */
export const META_CLICKS_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'postuler-maintenant', label: 'Postuler maintenant' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'nous-contacter', label: 'Nous contacter' },
  { id: 'obtenir-les-promotions', label: 'Obtenir les promotions' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'obtenir-un-devis', label: 'Obtenir un devis' },
  { id: 'faire-un-don', label: 'Faire un don' },
  { id: 'obtenir-les-horaires', label: 'Obtenir les horaires' },
  { id: 'profiter-de-loffre', label: "Profiter de l'offre" },
  { id: 'obtenir-lacces', label: "Obtenir l'accès" },
  { id: 'voir-les-details', label: 'Voir les détails' },
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'recevoir-des-informations', label: 'Recevoir des informations' },
  { id: 'ecouter-maintenant', label: 'Écouter maintenant' },
  { id: 'commander', label: 'Commander' },
  { id: 'demander-lhoraire', label: "Demander l'horaire" },
  { id: 'voir-le-menu', label: 'Voir le menu' },
  { id: 'acheter', label: 'Acheter' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'autres-videos', label: 'Autres vidéos' },
] as const

/** CTA META Ads — objectif Leads. */
export const META_LEADS_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'postuler-maintenant', label: 'Postuler maintenant' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'nous-contacter', label: 'Nous contacter' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'acheter-des-billets', label: 'Acheter des billets' },
  { id: 'obtenir-un-devis', label: 'Obtenir un devis' },
  { id: 'faire-un-don', label: 'Faire un don' },
  { id: 'obtenir-les-horaires', label: 'Obtenir les horaires' },
  { id: 'profiter-de-loffre', label: "Profiter de l'offre" },
  { id: 'voir-les-details', label: 'Voir les détails' },
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'ecouter-maintenant', label: 'Écouter maintenant' },
  { id: 'commander', label: 'Commander' },
  { id: 'jouer-a-ce-jeu', label: 'Jouer à ce jeu' },
  { id: 'demander-lhoraire', label: "Demander l'horaire" },
  { id: 'voir-le-menu', label: 'Voir le menu' },
  { id: 'acheter', label: 'Acheter' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'autres-videos', label: 'Autres vidéos' },
  { id: 'enregistrer', label: 'Enregistrer' },
] as const

/** CTA META Ads — objectif conversion. */
export const META_CONVERSION_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'postuler-maintenant', label: 'Postuler maintenant' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'nous-contacter', label: 'Nous contacter' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'acheter-des-billets', label: 'Acheter des billets' },
  { id: 'obtenir-un-devis', label: 'Obtenir un devis' },
  { id: 'faire-un-don', label: 'Faire un don' },
  { id: 'obtenir-les-horaires', label: 'Obtenir les horaires' },
  { id: 'profiter-de-loffre', label: "Profiter de l'offre" },
  { id: 'voir-les-details', label: 'Voir les détails' },
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'ecouter-maintenant', label: 'Écouter maintenant' },
  { id: 'commander', label: 'Commander' },
  { id: 'jouer-a-ce-jeu', label: 'Jouer à ce jeu' },
  { id: 'demander-lhoraire', label: "Demander l'horaire" },
  { id: 'voir-le-menu', label: 'Voir le menu' },
  { id: 'acheter', label: 'Acheter' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'autres-videos', label: 'Autres vidéos' },
] as const

/** CTA TikTok Ads — objectif Impressions. */
export const TIKTOK_IMPRESSIONS_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'acheter-maintenant', label: 'Acheter maintenant' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'nous-contacter', label: 'Nous contacter' },
  { id: 'postuler-maintenant', label: 'Postuler maintenant' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'jouer', label: 'Jouer' },
  { id: 'regarder-maintenant', label: 'Regarder maintenant' },
  { id: 'lire-la-suite', label: 'Lire la suite' },
  { id: 'voir-maintenant', label: 'Voir maintenant' },
  { id: 'obtenir-un-devis', label: 'Obtenir un devis' },
  { id: 'commander-maintenant', label: 'Commander maintenant' },
  { id: 'installer-maintenant', label: 'Installer maintenant' },
  { id: 'obtenir-les-horaires', label: 'Obtenir les horaires' },
  { id: 'ecouter-maintenant', label: 'Écouter maintenant' },
  { id: 'interesse-e', label: 'Intéressé(e)' },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'acheter-des-billets-maintenant', label: 'Acheter des billets maintenant' },
  { id: 'decouvrir-maintenant', label: 'Découvrir maintenant' },
  { id: 'precommander-maintenant', label: 'Précommander maintenant' },
  { id: 'visiter-la-boutique', label: 'Visiter la boutique' },
] as const

/** CTA TikTok Ads — objectif Clics. */
export const TIKTOK_CLICKS_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'reserver-vos-billets-maintenant', label: 'Réserver vos billets maintenant' },
  { id: 'acheter-vos-billets-maintenant', label: 'Acheter vos billets maintenant' },
  { id: 'acheter-des-billets-maintenant', label: 'Acheter des billets maintenant' },
  { id: 'acheter-maintenant', label: 'Acheter maintenant' },
  { id: 'en-savoir-plus', label: 'En savoir plus' },
  { id: 'voir-maintenant', label: 'Voir maintenant' },
  { id: 'regarder-en-streaming', label: 'Regarder en streaming' },
  { id: 'suivez-nous-pour-regarder', label: 'Suivez-nous pour regarder' },
  { id: 'suivre-pour-en-voir-plus', label: 'Suivre pour en voir plus' },
  { id: 'cliquez-pour-regarder-maintenant', label: 'Cliquez pour regarder maintenant' },
  { id: 'jetez-un-oeil', label: 'Jetez un œil' },
  { id: 'allez-regarder-en-streaming', label: 'Allez regarder en streaming' },
  { id: 'suivez-nous-maintenant', label: 'Suivez-nous maintenant' },
  { id: 'cliquez-pour-regarder', label: 'Cliquez pour regarder' },
  { id: 'telecharger', label: 'Télécharger' },
  { id: 'sinscrire', label: "S'inscrire" },
  { id: 'nous-contacter', label: 'Nous contacter' },
  { id: 'postuler-maintenant', label: 'Postuler maintenant' },
  { id: 'reserver', label: 'Réserver' },
  { id: 'jouer', label: 'Jouer' },
  { id: 'regarder-maintenant', label: 'Regarder maintenant' },
  { id: 'lire-la-suite', label: 'Lire la suite' },
  { id: 'obtenir-un-devis', label: 'Obtenir un devis' },
  { id: 'commander-maintenant', label: 'Commander maintenant' },
  { id: 'installer-maintenant', label: 'Installer maintenant' },
  { id: 'obtenir-les-horaires', label: 'Obtenir les horaires' },
  { id: 'ecouter-maintenant', label: 'Écouter maintenant' },
  { id: 'interesse-e', label: 'Intéressé(e)' },
  { id: 'sabonner', label: "S'abonner" },
  { id: 'obtenir-des-billets-maintenant', label: 'Obtenir des billets maintenant' },
  { id: 'decouvrir-maintenant', label: 'Découvrir maintenant' },
  { id: 'precommander-maintenant', label: 'Précommander maintenant' },
  { id: 'visiter-la-boutique', label: 'Visiter la boutique' },
  { id: 'faire-un-don-maintenant', label: 'Faire un don maintenant' },
  { id: 'comparer-maintenant', label: 'Comparer maintenant' },
] as const

/** CTA META / Facebook — objectif Réponses évènement (CTA unique imposé). */
export const META_EVENT_RESPONSE_CTA_OPTIONS: readonly PlatformCtaOption[] = [
  { id: 'interesse-e', label: 'Intéressé(e)' },
] as const

/** CTA par plateforme (tous objectifs confondus). */
export const PLATFORM_CTA_OPTIONS: Partial<
  Record<SocialMediaPlatform, readonly PlatformCtaOption[]>
> = {
  LinkedIn: LINKEDIN_CTA_OPTIONS,
  Snapchat: SNAPCHAT_CTA_OPTIONS,
}

/** CTA par plateforme et objectif de campagne. */
export const PLATFORM_OBJECTIVE_CTA_OPTIONS: Partial<
  Record<SocialMediaPlatform, Partial<Record<string, readonly PlatformCtaOption[]>>>
> = {
  META: {
    Impressions: META_IMPRESSIONS_CTA_OPTIONS,
    Clics: META_CLICKS_CTA_OPTIONS,
    'Clics sur lien': META_CLICKS_CTA_OPTIONS,
    Leads: META_LEADS_CTA_OPTIONS,
    conversion: META_CONVERSION_CTA_OPTIONS,
    'Réponses évènement': META_EVENT_RESPONSE_CTA_OPTIONS,
  },
  'Facebook only': {
    Impressions: META_IMPRESSIONS_CTA_OPTIONS,
    Clics: META_CLICKS_CTA_OPTIONS,
    'Clics sur lien': META_CLICKS_CTA_OPTIONS,
    Leads: META_LEADS_CTA_OPTIONS,
    conversion: META_CONVERSION_CTA_OPTIONS,
    'Réponses évènement': META_EVENT_RESPONSE_CTA_OPTIONS,
  },
  Tiktok: {
    Impressions: TIKTOK_IMPRESSIONS_CTA_OPTIONS,
    Clics: TIKTOK_CLICKS_CTA_OPTIONS,
  },
}

/** Objectif affiché quand les CTA ne dépendent pas de l'objectif (LinkedIn, Snapchat…). */
export const LINKEDIN_CTA_ANY_OBJECTIVE = 'Tous les objectifs'

const META_CTA_OBJECTIVE_ORDER = [
  'Impressions',
  'Clics',
  'Clics sur lien',
  'Leads',
  'conversion',
  'Réponses évènement',
] as const

const TIKTOK_CTA_OBJECTIVE_ORDER = ['Impressions', 'Clics'] as const

export const TIKTOK_CLICKS_CTA_NOTE =
  'Sur TikTok, le libellé du CTA affiché à l’utilisateur est traduit automatiquement selon la langue de son téléphone.'

function normalizeObjectiveKey(objective: string): string {
  return objective.trim()
}

/** Plateformes pour lesquelles au moins un CTA a été configuré. */
export function getConfiguredCtaPlatforms(): readonly SocialMediaPlatform[] {
  const configured = new Set<SocialMediaPlatform>([
    ...(Object.keys(PLATFORM_OBJECTIVE_CTA_OPTIONS) as SocialMediaPlatform[]),
    ...(Object.keys(PLATFORM_CTA_OPTIONS) as SocialMediaPlatform[]),
  ])
  return PLATFORMS_ORDER.filter((platform) => configured.has(platform))
}

/** Objectifs configurés pour une plateforme (uniquement ceux avec CTA renseignés). */
export function getConfiguredCtaObjectivesForPlatform(
  platform: SocialMediaPlatform,
): readonly string[] {
  const byObjective = PLATFORM_OBJECTIVE_CTA_OPTIONS[platform]
  if (byObjective) {
    const configured = new Set(Object.keys(byObjective))
    if (platform === 'META' || platform === 'Facebook only') {
      return META_CTA_OBJECTIVE_ORDER.filter((objective) => configured.has(objective))
    }
    if (platform === 'Tiktok') {
      return TIKTOK_CTA_OBJECTIVE_ORDER.filter((objective) => configured.has(objective))
    }
    return Object.keys(byObjective)
  }
  if (PLATFORM_CTA_OPTIONS[platform]?.length) {
    return [LINKEDIN_CTA_ANY_OBJECTIVE]
  }
  return []
}

export function getDefaultConfiguredCtaObjective(platform: SocialMediaPlatform): string {
  return getConfiguredCtaObjectivesForPlatform(platform)[0] ?? ''
}

export function hasConfiguredCtaForSelection(
  platform: SocialMediaPlatform,
  objective: string,
): boolean {
  return getCtaOptionsForSelection(platform, objective).length > 0
}

export function getCtaOptionsForSelection(
  platform: SocialMediaPlatform,
  objective: string,
): readonly PlatformCtaOption[] {
  const objectiveOptions =
    PLATFORM_OBJECTIVE_CTA_OPTIONS[platform]?.[normalizeObjectiveKey(objective)]
  if (objectiveOptions?.length) return objectiveOptions
  return PLATFORM_CTA_OPTIONS[platform] ?? []
}

export function getDefaultCtaIdForSelection(
  platform: SocialMediaPlatform,
  objective: string,
): string | null {
  const options = getCtaOptionsForSelection(platform, objective)
  if (options.length === 0) return null
  return options.find((option) => option.id === 'en-savoir-plus')?.id ?? options[0].id
}

export function getCtaLabelById(
  options: readonly PlatformCtaOption[],
  ctaId: string | null,
): string | null {
  if (!ctaId) return null
  return options.find((option) => option.id === ctaId)?.label ?? null
}

export function isFixedCtaSelection(options: readonly PlatformCtaOption[]): boolean {
  return options.length === 1
}

export function getCtaSelectionNote(
  platform: SocialMediaPlatform,
  objective: string,
): string | null {
  if (platform === 'Tiktok' && normalizeObjectiveKey(objective) === 'Clics') {
    return TIKTOK_CLICKS_CTA_NOTE
  }
  return null
}

/** @deprecated Préférer getCtaOptionsForSelection(platform, objective) */
export function getCtaOptionsForPlatform(platform: SocialMediaPlatform): readonly PlatformCtaOption[] {
  return PLATFORM_CTA_OPTIONS[platform] ?? []
}

/** @deprecated Préférer getDefaultCtaIdForSelection(platform, objective) */
export function getDefaultCtaIdForPlatform(platform: SocialMediaPlatform): string | null {
  return getDefaultCtaIdForSelection(platform, 'Impressions')
}
