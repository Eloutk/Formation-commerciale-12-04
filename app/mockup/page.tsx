'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Download, ImageIcon, Loader2, Save, Sparkles, ImagePlus } from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Checkbox } from '@/components/ui/checkbox'
import { MockupPreviewFrame } from '@/components/mockup/MockupPreviewFrame'
import { supportsFeedPreview } from '@/components/mockup/MockupFeedShell'
import { MockupPlatformIcon } from '@/components/mockup/MockupPreviews'
import { exportMockupImage, renderMockupPngBlob } from '@/lib/mockup-export'
import {
  MOCKUP_PLATFORMS,
  getMockupCtaLabel,
  getMockupCtaOptions,
  getMockupFormatOptions,
  mockupExportFilename,
  pickRandomMockupCaption,
  resolveMockupCta,
  resolveMockupVisualFormat,
  type MockupCtaId,
  type MockupPlatformId,
  type MockupVisualFormat,
} from '@/lib/mockup'
import {
  buildMockupSaveContent,
  getDefaultMockupSaveName,
  type MockupSaveContent,
} from '@/lib/mockup-saves'
import {
  createMockupSave,
  getCurrentUserId,
  getMockupSaveById,
  updateMockupSave,
  uploadMockupPng,
} from '@/lib/mockup-saves-storage'
import { MOCKUP_HREF } from '@/lib/nav-config'

const DEFAULT_PLACEHOLDER =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="800" height="800" viewBox="0 0 800 800">
      <rect width="800" height="800" fill="#f4f4f5"/>
      <text x="400" y="390" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" fill="#a1a1aa">Votre visuel</text>
      <text x="400" y="430" text-anchor="middle" font-family="Arial, sans-serif" font-size="20" fill="#d4d4d8">Importez une image</text>
    </svg>`,
  )

export default function MockupPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mockupIdFromUrl = searchParams.get('mockup')
  const previewRef = useRef<HTMLDivElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const logoInputRef = useRef<HTMLInputElement>(null)
  const [clientName, setClientName] = useState('')
  const [customText, setCustomText] = useState('')
  const [platform, setPlatform] = useState<MockupPlatformId>('instagram')
  const [visualFormat, setVisualFormat] = useState<MockupVisualFormat>('square')
  const [ctaId, setCtaId] = useState<MockupCtaId>('learn_more')
  const [imageSrc, setImageSrc] = useState<string | null>(null)
  const [imageName, setImageName] = useState<string | null>(null)
  const [logoSrc, setLogoSrc] = useState<string | null>(null)
  const [logoName, setLogoName] = useState<string | null>(null)
  const [exporting, setExporting] = useState(false)
  const [exportError, setExportError] = useState<string | null>(null)
  const [feedPreview, setFeedPreview] = useState(false)
  const [savedName, setSavedName] = useState<string | null>(null)
  const [saveDialogOpen, setSaveDialogOpen] = useState(false)
  const [saveNameInput, setSaveNameInput] = useState('')
  const [saving, setSaving] = useState(false)
  const [loadingSave, setLoadingSave] = useState(false)
  const [autoCaption, setAutoCaption] = useState(() => pickRandomMockupCaption(''))

  const previewImage = imageSrc ?? DEFAULT_PLACEHOLDER
  const canExport = clientName.trim().length > 0 && imageSrc != null
  const canSave = canExport

  const selectedPlatform = useMemo(
    () => MOCKUP_PLATFORMS.find((item) => item.id === platform) ?? MOCKUP_PLATFORMS[0],
    [platform],
  )

  const refreshAutoCaption = useCallback(() => {
    if (!customText.trim()) {
      setAutoCaption(pickRandomMockupCaption(clientName))
    }
  }, [clientName, customText])

  useEffect(() => {
    refreshAutoCaption()
    // Nouvelle accroche uniquement au changement de plateforme, pas à chaque lettre du client.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [platform])

  useEffect(() => {
    if (!customText.trim()) {
      setAutoCaption(pickRandomMockupCaption(clientName))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customText])

  const caption = customText.trim() || autoCaption

  const formatOptions = useMemo(() => getMockupFormatOptions(platform), [platform])

  const resolvedVisualFormat = useMemo(
    () => resolveMockupVisualFormat(platform, visualFormat),
    [platform, visualFormat],
  )

  const ctaOptions = useMemo(
    () => getMockupCtaOptions(resolvedVisualFormat),
    [resolvedVisualFormat],
  )

  const resolvedCtaId = useMemo(
    () => resolveMockupCta(ctaId, resolvedVisualFormat),
    [ctaId, resolvedVisualFormat],
  )

  const ctaLabel = useMemo(() => getMockupCtaLabel(resolvedCtaId), [resolvedCtaId])

  const selectedFormat = useMemo(
    () => formatOptions.find((item) => item.id === resolvedVisualFormat) ?? formatOptions[0],
    [formatOptions, resolvedVisualFormat],
  )

  const showFeedOption = supportsFeedPreview(platform, resolvedVisualFormat)

  useEffect(() => {
    if (!showFeedOption && feedPreview) {
      setFeedPreview(false)
    }
  }, [showFeedOption, feedPreview])

  useEffect(() => {
    const nextFormat = resolveMockupVisualFormat(platform, visualFormat)
    if (nextFormat !== visualFormat) {
      setVisualFormat(nextFormat)
    }
  }, [platform, visualFormat])

  useEffect(() => {
    if (!ctaOptions.some((option) => option.id === ctaId)) {
      setCtaId(ctaOptions[0]?.id ?? 'learn_more')
    }
  }, [ctaId, ctaOptions])

  const applySavedContent = useCallback((content: MockupSaveContent, name: string) => {
    setClientName(content.clientName)
    setPlatform(content.platform)
    setVisualFormat(content.visualFormat)
    setCtaId(content.ctaId)
    setFeedPreview(content.feedPreview)
    setImageSrc(content.imageSrc)
    setImageName(content.imageName)
    setLogoSrc(content.logoSrc)
    setLogoName(content.logoName)
    if (content.customText.trim()) {
      setCustomText(content.customText)
    } else {
      setCustomText('')
      setAutoCaption(pickRandomMockupCaption(content.clientName))
    }
    setSavedName(name)
    setExportError(null)
  }, [])

  useEffect(() => {
    if (!mockupIdFromUrl) return
    let cancelled = false
    setLoadingSave(true)
    void getMockupSaveById(mockupIdFromUrl)
      .then((record) => {
        if (cancelled || !record) return
        applySavedContent(record.content, record.name)
      })
      .catch(() => {
        if (!cancelled) setExportError('Impossible de charger le mockup enregistré.')
      })
      .finally(() => {
        if (!cancelled) setLoadingSave(false)
      })
    return () => {
      cancelled = true
    }
  }, [mockupIdFromUrl, applySavedContent])

  const buildSaveContent = () =>
    buildMockupSaveContent({
      clientName,
      customText: customText.trim() || caption,
      platform,
      visualFormat: resolvedVisualFormat,
      ctaId: resolvedCtaId,
      feedPreview,
      imageSrc,
      imageName,
      logoSrc,
      logoName,
    })

  const handleOpenSaveDialog = () => {
    if (!canSave) {
      alert('Renseignez le nom du client et importez une image avant d’enregistrer.')
      return
    }
    setSaveNameInput(getDefaultMockupSaveName(clientName, platform))
    setSaveDialogOpen(true)
  }

  const handleConfirmSave = async () => {
    const name = saveNameInput.trim()
    if (!name) {
      alert('Veuillez renseigner un nom pour le mockup.')
      return
    }
    if (!canSave || !previewRef.current) return

    setSaving(true)
    try {
      const userId = await getCurrentUserId()
      if (!userId) throw new Error('Vous devez être connecté pour enregistrer un mockup.')

      const content = buildSaveContent()
      let record = await createMockupSave({
        name,
        clientName,
        platform,
        content,
      })

      const pngBlob = await renderMockupPngBlob(previewRef.current)
      const previewPngPath = await uploadMockupPng({
        userId,
        mockupId: record.id,
        blob: pngBlob,
      })

      record = await updateMockupSave({
        id: record.id,
        name,
        clientName,
        platform,
        content,
        previewPngPath,
      })

      setSavedName(record.name)
      setSaveDialogOpen(false)
      if (mockupIdFromUrl) {
        router.replace(MOCKUP_HREF)
      }
      if (!customText.trim()) {
        setAutoCaption(pickRandomMockupCaption(clientName))
      }
      alert('Mockup enregistré dans Mon espace.')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de l’enregistrement.')
    } finally {
      setSaving(false)
    }
  }

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setExportError('Veuillez sélectionner un fichier image (PNG, JPEG, WebP…).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setImageSrc(typeof reader.result === 'string' ? reader.result : null)
      setImageName(file.name)
      setExportError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      setExportError('Le logo doit être une image (PNG, JPEG, WebP…).')
      return
    }

    const reader = new FileReader()
    reader.onload = () => {
      setLogoSrc(typeof reader.result === 'string' ? reader.result : null)
      setLogoName(file.name)
      setExportError(null)
    }
    reader.readAsDataURL(file)
  }

  const handleExport = async () => {
    if (!previewRef.current || !canExport) return

    setExporting(true)
    setExportError(null)
    try {
      await exportMockupImage(
        previewRef.current,
        'png',
        mockupExportFilename(clientName, platform, resolvedVisualFormat, 'png'),
      )
    } catch {
      setExportError('L’export a échoué. Réessayez ou choisissez une autre image.')
    } finally {
      setExporting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        {loadingSave ? (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Loader2 className="h-4 w-4 animate-spin" />
            Chargement du mockup enregistré…
          </div>
        ) : null}
        <div>
          <h1 className="mb-2 text-3xl font-bold">Mockup</h1>
          <p className="text-muted-foreground">
            Générez une prévisualisation réaliste pour montrer à un prospect à quoi pourrait ressembler sa publication.
          </p>
          {savedName ? (
            <p className="mt-2 text-sm text-muted-foreground">
              Dernier enregistrement : <span className="font-medium text-foreground">{savedName}</span>
            </p>
          ) : null}
        </div>

        <div className="grid min-w-0 gap-6 lg:grid-cols-[360px_minmax(0,1fr)]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-[#E94C16]" aria-hidden />
                Paramètres
              </CardTitle>
              <CardDescription>
                Renseignez le client, la plateforme et importez le visuel à intégrer.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="client-name">Nom du client</Label>
                <Input
                  id="client-name"
                  value={clientName}
                  onChange={(e) => setClientName(e.target.value)}
                  onBlur={refreshAutoCaption}
                  placeholder="Ex. Boulangerie Martin"
                />
              </div>

              <div className="space-y-2">
                <Label>Plateforme</Label>
                <Select value={platform} onValueChange={(value) => setPlatform(value as MockupPlatformId)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {MOCKUP_PLATFORMS.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        <span className="flex items-center gap-2">
                          <MockupPlatformIcon platform={item.id} />
                          {item.label}
                        </span>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{selectedPlatform.description}</p>
              </div>

              <div className="space-y-2">
                <Label>Format</Label>
                <Select
                  value={resolvedVisualFormat}
                  onValueChange={(value) => setVisualFormat(value as MockupVisualFormat)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {formatOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">{selectedFormat.description}</p>
              </div>

              <div className="space-y-2">
                <Label>CTA</Label>
                <Select
                  value={resolvedCtaId}
                  onValueChange={(value) => setCtaId(value as MockupCtaId)}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {ctaOptions.map((item) => (
                      <SelectItem key={item.id} value={item.id}>
                        {item.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Bouton d&apos;action affiché sur le mockup.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mockup-logo">Logo du client</Label>
                <input
                  ref={logoInputRef}
                  id="mockup-logo"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => logoInputRef.current?.click()}
                >
                  <ImagePlus className="h-4 w-4" aria-hidden />
                  {logoName ? 'Changer le logo' : 'Importer un logo'}
                </Button>
                {logoSrc ? (
                  <div className="flex items-center gap-3 rounded-md border bg-muted/30 p-2">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={logoSrc} alt="" className="h-10 w-10 rounded-full border object-cover" />
                    <p className="min-w-0 flex-1 truncate text-xs text-muted-foreground">{logoName}</p>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="shrink-0 text-xs"
                      onClick={() => {
                        setLogoSrc(null)
                        setLogoName(null)
                        if (logoInputRef.current) logoInputRef.current.value = ''
                      }}
                    >
                      Retirer
                    </Button>
                  </div>
                ) : (
                  <p className="text-xs text-muted-foreground">
                    Optionnel — remplace l&apos;initiale du client dans l&apos;avatar du mockup.
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="mockup-text">Texte de la publication</Label>
                <Textarea
                  id="mockup-text"
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder={autoCaption}
                  rows={3}
                  className="resize-y min-h-[72px]"
                />
                <p className="text-xs text-muted-foreground">
                  Laissez vide pour une accroche courte générée automatiquement.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="mockup-image">Image du mockup</Label>
                <input
                  ref={fileInputRef}
                  id="mockup-image"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImageChange}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <ImageIcon className="h-4 w-4" aria-hidden />
                  {imageName ? 'Changer l’image' : 'Importer une image'}
                </Button>
                {imageName ? (
                  <p className="truncate text-xs text-muted-foreground">{imageName}</p>
                ) : null}
              </div>

              <div className="space-y-2 border-t pt-4">
                <Label>Export</Label>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    type="button"
                    disabled={!canExport || exporting || saving}
                    onClick={() => void handleExport()}
                  >
                    {exporting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Download className="mr-2 h-4 w-4" aria-hidden />
                    )}
                    PNG
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-[#E94C16]/40 text-[#E94C16] hover:bg-orange-50"
                    disabled={!canSave || loadingSave || saving || exporting}
                    onClick={handleOpenSaveDialog}
                  >
                    {saving ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden />
                    ) : (
                      <Save className="mr-2 h-4 w-4" aria-hidden />
                    )}
                    Sauvegarder
                  </Button>
                </div>
                {!canExport ? (
                  <p className="text-xs text-muted-foreground">
                    Renseignez le nom du client et importez une image pour activer l’export et la
                    sauvegarde.
                  </p>
                ) : null}
                {exportError ? <p className="text-xs text-destructive">{exportError}</p> : null}
              </div>
            </CardContent>
          </Card>

          <Card className="min-w-0 overflow-hidden">
            <CardHeader>
              <CardTitle>Aperçu</CardTitle>
              <CardDescription>
                Simulation {selectedPlatform.label} — format {selectedFormat.label.toLowerCase()} pour{' '}
                {clientName.trim() || 'votre client'}.
              </CardDescription>
            </CardHeader>
            <CardContent className="min-w-0 overflow-hidden">
              {showFeedOption ? (
                <div className="mb-4 flex items-center gap-2">
                  <Checkbox
                    id="feed-preview"
                    checked={feedPreview}
                    onCheckedChange={(checked) => setFeedPreview(checked === true)}
                  />
                  <Label htmlFor="feed-preview" className="cursor-pointer text-sm font-normal">
                    Afficher la version fil d&apos;actu
                  </Label>
                </div>
              ) : null}
              <div className="w-full min-w-0 overflow-hidden rounded-lg bg-neutral-50 p-3 md:p-4">
                <div
                  ref={previewRef}
                  className={`w-full min-w-0 max-w-full ${feedPreview ? '' : 'flex justify-center'}`}
                >
                  <MockupPreviewFrame
                    platform={platform}
                    clientName={clientName}
                    imageSrc={previewImage}
                    logoSrc={logoSrc}
                    caption={caption}
                    visualFormat={resolvedVisualFormat}
                    ctaLabel={ctaLabel}
                    feedPreview={feedPreview}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enregistrer le mockup</DialogTitle>
            <DialogDescription>
              Une nouvelle entrée sera créée dans Mon espace avec le visuel, le logo et les
              paramètres actuels.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-2 py-2">
            <Label htmlFor="save-mockup-name">Nom du mockup *</Label>
            <Input
              id="save-mockup-name"
              placeholder="Ex. Mockup Boulangerie Martin — Instagram"
              value={saveNameInput}
              onChange={(e) => setSaveNameInput(e.target.value)}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setSaveDialogOpen(false)}>
              Annuler
            </Button>
            <Button type="button" disabled={saving} onClick={() => void handleConfirmSave()}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden /> : null}
              Enregistrer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
