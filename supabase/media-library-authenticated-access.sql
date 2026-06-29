-- Médiathèque : accès pour tous les utilisateurs connectés (tous rôles)
-- À exécuter dans Supabase > SQL Editor si seuls les admins voient / déposent des médias
-- (ex. après media-library-admin-only.sql)

DROP POLICY IF EXISTS "Admins can view media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can view media" ON public.media_assets;
CREATE POLICY "Authenticated users can view media"
ON public.media_assets FOR SELECT
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can insert media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can insert own media" ON public.media_assets;
CREATE POLICY "Authenticated users can insert own media"
ON public.media_assets FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = uploaded_by_id);

DROP POLICY IF EXISTS "Admins can delete media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_assets;
CREATE POLICY "Authenticated users can delete media"
ON public.media_assets FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can upload media files" ON storage.objects;
CREATE POLICY "Authenticated users can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-library');

DROP POLICY IF EXISTS "Admins can read media files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can read media files" ON storage.objects;
CREATE POLICY "Authenticated users can read media files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media-library');

DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media files" ON storage.objects;
CREATE POLICY "Authenticated users can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-library');
