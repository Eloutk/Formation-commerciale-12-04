'use client'

import * as React from 'react'
import { AlertTriangle } from 'lucide-react'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert'
import { useAuthAccess } from '@/components/auth-context'
import { MediaBrowsePanel } from '@/components/media/MediaBrowsePanel'
import { MediaUploadForm } from '@/components/media/MediaUploadForm'
import { mediaFetch } from '@/lib/media-api-client'
import { isMediaAccessDenied } from '@/lib/media-config'

type MediaView = 'deposit' | 'browse'

export default function MediaPage() {
  const { isAdmin, authReady } = useAuthAccess()
  const [view, setView] = React.useState<MediaView>('deposit')
  const [configured, setConfigured] = React.useState<boolean | null>(null)
  const [refreshKey, setRefreshKey] = React.useState(0)

  const canUseMedia = authReady && isAdmin

  React.useEffect(() => {
    if (!canUseMedia) return

    mediaFetch('/api/media')
      .then(async (res) => {
        const json = await res.json().catch(() => ({}))
        if (isMediaAccessDenied(res.status)) {
          setConfigured(null)
          return
        }
        setConfigured(json.configured !== false)
      })
      .catch(() => setConfigured(false))
  }, [canUseMedia])

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold mb-2">Média</h1>
        <p className="text-muted-foreground mb-6">
          Déposez et consultez les médias produits pour vos campagnes.
        </p>

        {configured === false ? (
          <Alert className="mb-6 border-amber-200 bg-amber-50">
            <AlertTriangle className="h-4 w-4 text-amber-700" />
            <AlertTitle className="text-amber-900">Médiathèque non configurée</AlertTitle>
            <AlertDescription className="text-amber-800">
              La table Supabase n&apos;est pas encore créée. Exécutez le script{' '}
              <code className="text-xs bg-amber-100 px-1 py-0.5 rounded">supabase/media-library.sql</code>{' '}
              dans le SQL Editor de votre projet Supabase existant.
            </AlertDescription>
          </Alert>
        ) : null}

        <div className="mb-6">
          <Tabs
            value={view}
            onValueChange={(value) => setView(value as MediaView)}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md mx-auto grid-cols-2 border-2 border-gray-300 gap-1">
              <TabsTrigger
                value="deposit"
                className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
              >
                Déposer un média
              </TabsTrigger>
              <TabsTrigger
                value="browse"
                className="data-[state=active]:bg-[#E94C16] data-[state=active]:text-white"
              >
                Consulter les médias
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {view === 'deposit' ? (
          <MediaUploadForm
            enabled={canUseMedia && configured !== false}
            onSuccess={() => setRefreshKey((k) => k + 1)}
          />
        ) : (
          <MediaBrowsePanel enabled={canUseMedia && configured !== false} refreshKey={refreshKey} />
        )}
      </div>
    </div>
  )
}
