# Médiathèque — configuration dans Supabase existant

La médiathèque s’appuie sur **votre projet Supabase actuel** (celui déjà utilisé pour l’auth Link Academy). Aucun second projet ni nouvelle variable d’environnement n’est nécessaire.

---

## Migration — secteurs multiples

Si la table existe déjà avec l'ancien schéma (un seul secteur, mois/année obligatoires), exécutez aussi :

[`supabase/media-library-migration-sectors.sql`](./supabase/media-library-migration-sectors.sql)

## Migration — plateformes multiples

Si la table existe avec une seule colonne `platform`, exécutez :

[`supabase/media-library-migration-platforms.sql`](./supabase/media-library-migration-platforms.sql)

## Migration — suppression des médias

Si la suppression semble réussir mais les médias réapparaissent après rechargement, exécutez :

[`supabase/media-library-migration-delete.sql`](./supabase/media-library-migration-delete.sql)

---

## Étape 1 — Créer la table et le bucket

1. Ouvrez votre projet Supabase → **SQL Editor**.
2. Collez et exécutez le fichier [`supabase/media-library.sql`](./supabase/media-library.sql).
3. Vérifiez dans **Table Editor** que la table `media_assets` existe.
4. Vérifiez dans **Storage** que le bucket `media-library` existe (privé, 100 Mo max).

---

## Étape 2 — Permissions

Le script configure automatiquement :

| Élément | Règle |
|---------|--------|
| **Table `media_assets`** | Lecture pour tout utilisateur connecté ; insertion uniquement avec `uploaded_by_id = auth.uid()` |
| **Bucket `media-library`** | Upload et lecture pour les utilisateurs connectés |
| **API Next.js** | Vérifie la session avant upload / consultation |
| **Téléchargement** | URL signée (7 jours) générée côté serveur |

---

## Étape 3 — Champs enregistrés

| Champ | Obligatoire | Description |
|-------|-------------|-------------|
| Fichier | Oui | Image, vidéo ou PDF (max 100 Mo) |
| Secteurs d'activité | Oui | Un ou plusieurs (cases à cocher) |
| Plateformes | Oui | Une ou plusieurs (Meta, Google Ads, TikTok, etc.) |
| Mois | Non | 1–12 |
| Année | Non | Année de la campagne |
| Nom du client | Oui | Texte libre |
| Nom de la campagne | Oui | Texte libre |
| Lien du rapport | Non | URL optionnelle |

---

## Étape 4 — Mettre à jour la liste des secteurs

Les secteurs d’activité et les plateformes sont définis dans `lib/media-config.ts` (`MEDIA_SECTORS`, `MEDIA_PLATFORMS`) avec leurs couleurs.

---

## Étape 5 — Tester

1. Connectez-vous à Link Academy.
2. **Ressources → Média**.
3. **Déposer un média** puis **Consulter les médias**.

Si la table n’a pas encore été créée, un bandeau « Médiathèque non configurée » s’affiche.

---

## Dépannage

| Problème | Solution |
|----------|----------|
| « Médiathèque non configurée » | Exécutez `supabase/media-library.sql` |
| Erreur upload Storage | Vérifiez que le bucket `media-library` existe |
| Fichier trop volumineux | Limite 100 Mo (modifiable dans le SQL) |
| Type MIME refusé | Ajoutez le type dans `allowed_mime_types` du bucket |
