-- Migration médiathèque : suppression pour tous les utilisateurs connectés

CREATE OR REPLACE FUNCTION public.delete_media_asset(asset_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  DELETE FROM public.media_assets WHERE id = asset_id;
  RETURN FOUND;
END;
$$;

REVOKE ALL ON FUNCTION public.delete_media_asset(UUID) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.delete_media_asset(UUID) TO authenticated;

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
