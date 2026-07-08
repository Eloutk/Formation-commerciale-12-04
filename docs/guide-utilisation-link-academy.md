# Guide d'utilisation — Link Academy

Documentation partie par partie : **pourquoi** utiliser chaque section et **comment** s'en servir au quotidien.

> **Dernière mise à jour :** juin 2026 — reflète la navigation actuelle du site (Stratégie, Mon espace, Guides, Academy).

---

## 1. Vue d'ensemble

**Link Academy** est la plateforme interne Link pour :

- se former sur la diffusion publicitaire (Academy) ;
- consulter les guides métier et documents officiels ;
- construire des stratégies commerciales (social, SMS/RCS, studio, plan média) ;
- préparer des restitutions client (mockups, rétroplanning, PDF) ;
- centraliser ses projets enregistrés dans **Mon espace**.

Le site est organisé en **5 grands menus** :


| Menu              | Rôle principal                                          |
| ----------------- | ------------------------------------------------------- |
| **Academy**       | Formation commerciale (modules + quiz)                  |
| **Guides**        | Référentiels, médiathèque, lexique, FAQ, documents      |
| **Stratégie**     | Outils de conception média et créative                  |
| **Mon espace**    | Calculateurs, devis, pige, calculs, hub « Mes projets » |
| **IA** *(admins)* | Analyses automatisées (Claude)                          |


---

## 2. Connexion et profils

### Comment

1. Rendez-vous sur `/login`.
2. Connectez-vous avec votre compte Supabase Link.
3. Complétez votre pseudo si demandé à la première connexion.

### Pourquoi

Chaque outil d'enregistrement (stratégies, mockups, plan média, pige…) est lié à **votre compte**. Sans connexion, vous ne pouvez ni sauvegarder ni retrouver vos projets dans **Mes projets**.

### Profils


| Profil                       | Accès typique                                                      |
| ---------------------------- | ------------------------------------------------------------------ |
| **Utilisateur / commercial** | Academy, Guides (selon droits), Mon espace, Stratégie              |
| **Client**                   | Academy + Guides limités (pas Documents ni Demandes de potentiels) |
| **Créa**                     | + Devis Studio                                                     |
| **Admin / Super admin**      | Tout, dont IA, Plan média admin, vue admin Mes projets             |


---

## 3. Academy — Formation commerciale

**URL :** `/academy/diffusion`

### Pourquoi

Former les équipes commerciales sur la méthode Link : objectifs, ciblage, architecture, tracking, optimisations, bilans.

### Comment

1. Ouvrez **Academy → Diffusion**.
2. Choisissez un module dans la grille.
3. Suivez le contenu puis passez le **quiz** associé (`/academy/.../quiz`).

### Modules disponibles

- Méthodologie Link
- Plateformes et placement
- Tunnel de conversion
- Objectifs de campagne
- Ciblage
- Architecture des campagnes
- Tracking
- Score qualité
- Optimisations
- Rapports de campagne *(ex-Bilans)*
- Demandes de potentiels *(hors profil client)*

---

## 4. Guides

### 4.1 Studio — Formats visuels

**URL :** `/guides/studio`

**Pourquoi :** Connaître les contraintes et recommandations par régie (Meta, Display, Search, LinkedIn, TikTok, Snapchat, Spotify) avant de briefer la créa ou le studio.

**Comment :** Parcourez les onglets par plateforme ; consultez limites, marges de sécurité et exemples visuels.

---

### 4.2 Link Library — Médiathèque

**URL :** `/guides/link-library`

**Pourquoi :** Déposer et retrouver les visuels / rapports de campagnes passées, classés par secteur, client, campagne et plateforme.

**Comment :**

1. **Déposer un média** : renseignez secteur, plateformes *(Meta, Google Ads, TikTok, LinkedIn, Snapchat, YouTube, Display, SMS/RCS)*, client, campagne, période, fichier.
2. **Consulter les médias** : filtrez puis ouvrez ou téléchargez.

> Prérequis technique : scripts SQL `supabase/media-library.sql` exécutés dans Supabase.

---

### 4.3 Lexique

**URL :** `/guides/lexique`

**Pourquoi :** Définitions des termes publicitaires Link ; référence rapide en rendez-vous client.

**Comment :** Recherchez un terme ou filtrez par catégorie ; proposez une nouvelle entrée via le formulaire.

---

### 4.4 FAQ

**URL :** `/guides/faq`

**Pourquoi :** Réponses aux questions fréquentes ; canal pour soumettre une question à l'équipe.

---

### 4.5 Tutos

**URL :** `/guides/tutos`

**Pourquoi :** Vidéos Vimeo de prise en main des outils.

**Comment :** Cliquez sur un tutoriel — la vidéo s'ouvre dans un nouvel onglet.

---

### 4.6 Documents

**URL :** `/guides/document`

**Pourquoi :** Télécharger les guides PDF officiels, templates de présentation et fiches plateformes.

**Contenu principal :**


| Document                      | Usage                              |
| ----------------------------- | ---------------------------------- |
| Guide des formats V8.2        | Contraintes visuelles              |
| Guide chefferie de projet     | Process production / Monday        |
| Guide Perf Max & Gen Ads      | Lecture des performances           |
| **Base de présentation 2026** | Template PowerPoint **ou** Keynote |
| Formation studio 2026         | Keynote formation créa             |
| Fiches plateformes            | Instagram, LinkedIn, YouTube, etc. |


---

## 5. Stratégie

### 5.1 Plan Média

**URL :** `/strategie/plan-media`

**Pourquoi :** Simuler un plan média multi-plateformes : volumes, pénétration, pression, stratégies idéale / MAX / personnalisée.

**Comment :**

1. Renseignez les paramètres par plateforme.
2. Analysez le récapitulatif des stratégies.
3. **Enregistrer dans Mon espace** : donnez un nom de projet (PDF joint optionnel, max 20 Mo).
4. **Exporter en PDF** : génère un récapitulatif client.
5. Rouvrez un projet via **Mes projets → Plan média** ou `?simulateur=<id>` dans l'URL.

> Prérequis : `supabase/simulateur-media-saves.sql` en production.

---

### 5.2 Cartographie

**URL :** `/strategie/cartographie`

**Pourquoi :** Composer des zones géographiques (ville + rayon, département, région, codes postaux) et estimer les audiences.

**Comment :** Utilisez l'outil zones ; pour les demandes de potentiels, liens Monday depuis la page.

---

### 5.3 Rétroplanning

**URL :** `/strategie/retroplanning`

**Pourquoi :** Planifier les phases de campagne (social, SMS/RCS) sur un calendrier / Gantt et exporter en PDF.

**Comment :**

1. Définissez dates et phases par plateforme.
2. Exportez le PDF rétroplanning.
3. Enregistrez dans Mon espace pour retrouver le projet.

---

### 5.4 Mockup

**URL :** `/strategie/mockup`

**Pourquoi :** Prévisualiser une publicité dans le fil d'une plateforme (Instagram, Facebook, LinkedIn, TikTok, Snapchat) pour une restitution client rapide.

**Comment :**

1. Choisissez plateforme et format (carré, story…).
2. Importez logo, visuel, texte, CTA.
3. **Sauvegarder** avec un nom → retrouvable dans **Mes projets → Mockups**.
4. Exportez en PNG.
5. Rouvrez via `?mockup=<id>`.

> Ancienne URL `/mon-espace/mockup` redirige automatiquement.

---

## 6. Mon espace

### 6.1 Mes projets — Hub central

**URL :** `/mon-espace/mes-projets`

**Pourquoi :** **Point d'entrée unique** pour tous les enregistrements : stratégies, rétroplanning, studio, plan média, mockups, pige, SMS/RCS.

**Comment :**

- Menu latéral par type de projet.
- Recherche, pagination, **Ouvrir** (recharge l'outil avec le bon `?id` dans l'URL), **Supprimer**.
- Les admins voient aussi une **Vue admin** (tous les utilisateurs).


| Section              | Colonnes affichées (résumé)          |
| -------------------- | ------------------------------------ |
| Calculateur de vente | Nom, Stratégies, Montant HT, Créé le |
| Rétroplanning        | selon configuration                  |
| Studio               | Nom, Prestations, Total HT, Créé le  |
| Plan média           | Nom, PDF, Créé le                    |
| Mockups              | Nom, Format, Créé le                 |
| Pige commerciale     | par projet                           |
| SMS / RCS            | Nom, Type, Montant HT, Créé le       |


> Quand vous ouvrez un enregistrement depuis Mes projets, le menu **Mes projets** reste surligné dans la navigation.

---

### 6.2 Social Media — Calculateur de vente

**URL :** `/mon-espace/social-media`

**Pourquoi :** Chiffrer une stratégie social multi-plateformes (Meta, TikTok, LinkedIn…), produire un PDF stratégie, lier le rétroplanning, enregistrer dans Mon espace.

**Comment :**

1. Créez jusqu'à 3 blocs stratégie.
2. Renseignez KPIs, budgets, options par plateforme.
3. **Sauvegarder** la stratégie (nom client).
4. **Télécharger le PDF** stratégie.
5. Rouvrez via `?strategy=<id>`.

> Outil informatif — sans valeur contractuelle. Le bouton « pack ZIP complet » n'est plus proposé sur cette page (reste sur SMS/RCS si besoin).

---

### 6.3 SMS & RCS

**URL :** `/mon-espace/sms-rcs`

**Pourquoi :** Composer un devis SMS ou RCS indépendamment du social.

**Comment :** Paramétrez volumes et tarifs → Sauvegarder → PDF devis → `?devis=<id>`.

---

### 6.4 Studio — Devis création

**URL :** `/mon-espace/studio`

**Pourquoi :** Monter un devis studio (prestations graphiques / vidéo) à partir de la grille tarifaire.

**Accès :** commerciaux, créa, admins.

**Comment :** Sélectionnez les prestations → Enregistrer → `?studio=<id>`.

---

### 6.5 Pige commerciale

**URL :** `/mon-espace/pige-commerciale`

**Pourquoi :** Archiver des captures de veille concurrentielle (Meta Ads Library, Google, LinkedIn).

**Comment :**

1. Liens directs vers les bibliothèques d'annonces.
2. Import **multi-fichiers** (images).
3. À l'enregistrement : **nom du projet** — plusieurs captures = **un seul projet** dans Mes projets.
4. Consultez via `?project=<id>` (ou `?capture=` pour anciens liens).

> Prérequis : `supabase/pige-commerciale-saves.sql` (colonne `project_id`).

---

### 6.6 Calculs — CPM / CPC

**URL :** `/mon-espace/calculs`

**Pourquoi :** Comparer le réalisé vs l'objectif vendu et analyser la performance média post-campagne.

**Comment :**

1. Saisissez le **prix de vente** (budget client).
2. Remplissez KPIs atteints et objectifs vendus.
3. Lisez la colonne **Delta** :
  - **Volumes** (impressions, couverture, clics) : 🟢 > 100 % = objectif dépassé.
  - **Coûts** (CPM, CPC) : 🟢 < 100 % = coût plus bas que prévu (meilleure performance).
4. Convertissez budget HT ↔ TTC (× 1,2).

---

## 7. IA *(administrateurs)*

**URL :** `/ia`

**Pourquoi :** Accélérer analyses et rédactions à partir de briefs, rapports ou URLs.

**Actions disponibles :**


| Action                  | Entrée      | Usage                          |
| ----------------------- | ----------- | ------------------------------ |
| Personae                | PDF         | Personae marketing             |
| Analyse post-campagne   | PDF         | Recommandations après campagne |
| Mail de prospection     | PDF + photo | Email personnalisé             |
| Analyse réseaux sociaux | URLs        | Audit présence social          |
| Analyse site web        | URL         | Audit site client              |


**Comment :** Choisissez l'action, fournissez les sources, lancez la génération. Mode **présentation** possible (PowerPoint à partir du template « Base de présentation 2026 »).

---

## 8. Parcours métier recommandé

### Avant un RDV découverte

1. **Cartographie** si besoin géo.
2. **IA** : analyse site / réseaux sociaux.
3. **Pige commerciale** : exemples concurrents.

### Construction de l'offre

1. **Social media** ou **SMS/RCS** pour le chiffrage.
2. **Plan média** pour les volumes / pression.
3. **Studio** si prestations créa.
4. **Mockup** pour illustrer le fil publicitaire.

### Restitution client

1. PDF stratégie / devis / plan média.
2. **Rétroplanning** pour le planning.
3. Template **Base de présentation 2026** (PowerPoint ou Keynote) depuis Documents.

### Après campagne

1. **Calculs CPM/CPC** pour le bilan réalisé vs vendu.
2. Déposer les rapports dans **Link Library**.

---

## 9. Recherche globale

La barre de recherche en header indexe pages, outils et documents. Utilisez-la si vous ne retrouvez pas une rubrique.

---

## 10. Migrations Supabase à vérifier en production

Si une fonctionnalité d'enregistrement échoue, exécutez le script SQL correspondant dans Supabase :


| Fonctionnalité         | Fichier SQL                           |
| ---------------------- | ------------------------------------- |
| Médiathèque            | `supabase/media-library.sql`          |
| Stratégies social      | `supabase/vente2-strategies.sql`      |
| Devis SMS/RCS          | `supabase/sms-devis.sql`              |
| Plan média + PDF joint | `supabase/simulateur-media-saves.sql` |
| Pige par projet        | `supabase/pige-commerciale-saves.sql` |
| Mockups                | `supabase/mockup-saves.sql`           |
| Studio tarifs          | `supabase/studio-tarifs-saves.sql`    |
| Rétroplanning          | `supabase/retroplanning-saves.sql`    |


---

## 11. URLs utiles (résumé)


| Page          | URL                            |
| ------------- | ------------------------------ |
| Accueil       | `/home`                        |
| Mes projets   | `/mon-espace/mes-projets`      |
| Social media  | `/mon-espace/social-media`     |
| SMS / RCS     | `/mon-espace/sms-rcs`          |
| Studio devis  | `/mon-espace/studio`           |
| Calculs       | `/mon-espace/calculs`          |
| Pige          | `/mon-espace/pige-commerciale` |
| Plan média    | `/strategie/plan-media`        |
| Mockup        | `/strategie/mockup`            |
| Cartographie  | `/strategie/cartographie`      |
| Rétroplanning | `/strategie/retroplanning`     |
| Documents     | `/guides/document`             |
| IA            | `/ia`                          |


---

*Document généré pour l'équipe Link — plateforme Formation commerciale Link Academy.*