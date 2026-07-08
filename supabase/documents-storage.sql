-- Documents publics (présentations lourdes)
-- Historique : bucket Supabase « documents » (limite upload 50 Mo sur plan gratuit).
-- Solution retenue : Vercel Blob (store privé) + routes API /api/documents/base-presentation-2026/*
--
-- Ce script Supabase n'est plus nécessaire si vous utilisez Vercel Blob.
-- Conservé pour référence ou si vous passez à un plan Supabase Pro (limite relevable).

INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'documents',
  'documents',
  true,
  209715200, -- 200 Mo, marge au-dessus des 130 Mo du .key
  NULL       -- aucun filtre MIME (les .key Keynote sont parfois détectés en octet-stream)
)
ON CONFLICT (id) DO UPDATE
  SET public = true,
      file_size_limit = 209715200,
      allowed_mime_types = NULL;

-- Lecture publique des objets du bucket (accessible sans authentification via l'URL publique).
DROP POLICY IF EXISTS "Public read documents" ON storage.objects;
CREATE POLICY "Public read documents"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'documents');

-- (Optionnel) Autoriser les utilisateurs connectés à téléverser dans ce bucket.
-- L'upload se fait normalement via le Dashboard (rôle service), donc cette policy
-- n'est nécessaire que si vous voulez uploader depuis l'app avec un compte authentifié.
DROP POLICY IF EXISTS "Authenticated upload documents" ON storage.objects;
CREATE POLICY "Authenticated upload documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'documents');
