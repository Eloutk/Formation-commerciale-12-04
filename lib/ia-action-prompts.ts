import type { IaActionId } from '@/lib/ia-actions'
import { POST_CAMPAIGN_PDF_PRE_PROMPT } from '@/lib/ia-prompts/post-campaign-pdf.prompt'

type IaActionPromptConfig = {
  defaultPrePrompt: string
  systemHint: string
}

export const IA_ACTION_PROMPTS: Record<IaActionId, IaActionPromptConfig> = {
  personae_pdf: {
    defaultPrePrompt: `À partir du PDF fourni, produis 2 à 3 personae marketing détaillés.

Pour chaque persona :
- Prénom fictif + titre
- Profil démographique et professionnel
- Objectifs et motivations
- Frustrations / pain points
- Canaux média privilégiés
- Messages clés et accroches publicitaires
- KPIs ou signaux d’achat

Termine par un tableau comparatif synthétique.`,
    systemHint:
      'Tu es expert en stratégie marketing B2B et B2C. Les personae doivent être actionnables pour une équipe commerciale média.',
  },
  post_campaign_pdf: {
    defaultPrePrompt: POST_CAMPAIGN_PDF_PRE_PROMPT,
    systemHint:
      'Tu es expert senior en campagnes média digitales et présentations client-ready Link Academy. Posture constructive et prudente : ne surinterprète jamais les faibles volumes, distingue faits et hypothèses, valorise sans masquer les résultats.',
  },
  mail_prospection: {
    defaultPrePrompt: `À partir du PDF (contexte client / secteur / enjeux) et de la photo fournie :

1. Décris brièvement ce que la photo suggère sur le client ou son activité (si pertinent).
2. Rédige un **email de prospection** en français :
   - Objet accrocheur (2 variantes)
   - Corps : 120–180 mots max, ton professionnel et chaleureux
   - Proposition de valeur Link Academy / média
   - Call-to-action clair (prise de RDV)
3. Propose une **version de relance** courte (3–4 phrases).

N’invente pas de chiffres absents du PDF.`,
    systemHint:
      'Tu es commercial senior en agence média. Le mail doit être personnalisé, pas générique.',
  },
  social_analysis_url: {
    defaultPrePrompt: `Analyse la présence sur les réseaux sociaux à partir du contenu extrait de l’URL.

Structure :
1. **Marque / entité analysée**
2. **Positionnement perçu** (ton, messages, fréquence si visible)
3. **Forces** (formats, engagement apparent, différenciation)
4. **Faiblesses / opportunités**
5. **Benchmark vs concurrents** (si des URLs concurrentes sont mentionnées dans le contenu)
6. **Recommandations média social ads** (3 actions prioritaires)

Précise les limites si le contenu accessible est incomplet.`,
    systemHint:
      'Tu es social media strategist. Reste factuel si les données publiques sont limitées.',
  },
  website_analysis_url: {
    defaultPrePrompt: `Audite ce site web à partir du contenu extrait de l’URL.

Structure :
1. **Première impression** (proposition de valeur, clarté)
2. **Cible et parcours utilisateur**
3. **Contenus & SEO apparents** (thématiques, mots-clés visibles)
4. **Conversion** (CTA, formulaires, friction)
5. **Opportunités média** (Search, Social, Display, retargeting…)
6. **5 recommandations actionnables** pour un commercial Link Academy

Signale explicitement ce que tu ne peux pas évaluer sans accès technique (vitesse, tracking…).`,
    systemHint:
      'Tu es expert acquisition digitale et UX marketing. Analyse orientée vente de campagnes média.',
  },
}

export function getIaActionDefaultPrePrompt(actionId: IaActionId): string {
  return IA_ACTION_PROMPTS[actionId]?.defaultPrePrompt?.trim() ?? ''
}

export function getIaActionSystemHint(actionId: IaActionId): string {
  return IA_ACTION_PROMPTS[actionId]?.systemHint?.trim() ?? ''
}
