-- Durcissement médiathèque : accès réservé aux administrateurs
-- À exécuter dans Supabase > SQL Editor (après media-library.sql et mon-espace-admin.sql)

DROP POLICY IF EXISTS "Authenticated users can view media" ON public.media_assets;
DROP POLICY IF EXISTS "Admins can view media" ON public.media_assets;
CREATE POLICY "Admins can view media"
ON public.media_assets FOR SELECT
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can insert own media" ON public.media_assets;
DROP POLICY IF EXISTS "Admins can insert media" ON public.media_assets;
CREATE POLICY "Admins can insert media"
ON public.media_assets FOR INSERT
TO authenticated
WITH CHECK (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_assets;
DROP POLICY IF EXISTS "Admins can delete media" ON public.media_assets;
CREATE POLICY "Admins can delete media"
ON public.media_assets FOR DELETE
TO authenticated
USING (public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can upload media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can upload media files" ON storage.objects;
CREATE POLICY "Admins can upload media files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'media-library' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can read media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can read media files" ON storage.objects;
CREATE POLICY "Admins can read media files"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'media-library' AND public.is_admin(auth.uid()));

DROP POLICY IF EXISTS "Authenticated users can delete media files" ON storage.objects;
DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;
CREATE POLICY "Admins can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-library' AND public.is_admin(auth.uid()));
