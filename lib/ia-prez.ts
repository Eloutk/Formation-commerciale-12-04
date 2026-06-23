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

Produis un document d'analyse structuré en markdown (pas de slides Keynote).
Reste factuel, orienté recommandations commerciales média Link Academy.`
  }

  return `${base}

---

**Mode demandé par l'utilisateur : présentation globale**

Template cible : Keynote « Base de présentation 2026 » (Link Academy).

Le pré-prompt maître ci-dessus prime sur toute autre consigne en cas de conflit.

Produis le contenu slide par slide en respectant strictement le format suivant pour chaque slide :

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

Ce format est obligatoire : il sert à générer automatiquement le fichier Keynote (.key).

Indique si une slide du template doit être supprimée ou dupliquée.`
}

export function prezOutputModeLabel(mode: IaPrezOutputMode): string {
  return mode === 'written' ? 'Analyse écrite' : 'Présentation globale'
}

export function isPresentationAnalysisName(name: string | null | undefined): boolean {
  return (name ?? '').includes('Présentation globale')
}
