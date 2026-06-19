-- Migration médiathèque : suppression pour tous les utilisateurs connectés

DROP POLICY IF EXISTS "Admins can delete media" ON public.media_assets;
DROP POLICY IF EXISTS "Authenticated users can delete media" ON public.media_assets;
CREATE POLICY "Authenticated users can delete media"
ON public.media_assets FOR DELETE
TO authenticated
USING (true);

DROP POLICY IF EXISTS "Admins can delete media files" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated users can delete media files" ON storage.objects;
CREATE POLICY "Authenticated users can delete media files"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'media-library');
