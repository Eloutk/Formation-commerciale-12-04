export type IaPrezOutputMode = 'written' | 'presentation'

export function isIaPrezOutputMode(value: string): value is IaPrezOutputMode {
  return value === 'written' || value === 'presentation'
}

/** Enrichit le pré-prompt maître (côté serveur) selon le mode choisi. */
export function buildPrezFinalPrompt(
  masterPrePrompt: string,
  options: {
    outputMode: IaPrezOutputMode
  },
): string {
  const base = masterPrePrompt.trim()

  if (options.outputMode === 'written') {
    return `${base}

---

**Mode demandé par l'utilisateur : analyse écrite**

Produis un document d'analyse structuré en markdown (pas de slides PowerPoint).
Reste factuel, orienté recommandations commerciales média Link Academy.`
  }

  return `${base}

---

**Mode demandé par l'utilisateur : présentation globale**

Template cible : PowerPoint « Base de présentation 2026 » (Link Academy).

Le pré-prompt maître ci-dessus prime sur toute autre consigne en cas de conflit.

**IMPORTANT — format de sortie obligatoire**

Ta réponse doit être UNIQUEMENT la présentation slide par slide, sans introduction ni commentaire meta.
Commence directement par \`## Slide 1 — …\`.
Produis au minimum 10 slides (ou plus si les données le justifient), couvrant synthèse, contexte, KPIs, analyses par plateforme, enseignements, recommandations et conclusion.

Respecte strictement ce format pour CHAQUE slide :

## Slide X — [Titre de la slide]

Objectif de la slide :
[texte]

Message clé :
[texte]

Contenu à intégrer :
- [élément]

Chiffres à mettre en avant :
- [KPI]

Suggestion de visuel :
[texte]

Note de présentation :
[texte]

Ce format alimente automatiquement le fichier PowerPoint (.pptx).
Remplis chaque section avec le contenu réel issu des documents joints (chiffres, analyses, recommandations).
Ne laisse aucune section vide si l'information est disponible dans les PDF.`
}

export function prezOutputModeLabel(mode: IaPrezOutputMode): string {
  return mode === 'written' ? 'Analyse écrite' : 'Présentation globale'
}

export function isPresentationAnalysisName(name: string | null | undefined): boolean {
  return (name ?? '').includes('Présentation globale')
}
