'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Calculator,
  Copy,
  ExternalLink,
  FolderOpen,
  Loader2,
  Search,
  Shield,
  Trash2,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { useAuthAccess } from '@/components/auth-context'
import { VENTE2_SMS_HREF, VENTE2_SOCIAL_HREF } from '@/lib/nav-config'
import { formatSmsDevisAmount, formatSmsDevisDate, type SmsDevisRecord } from '@/lib/sms-devis'
import {
  countVente2StrategyPlatforms,
  formatVente2StrategyAmount,
  formatVente2StrategyDate,
  type Vente2StrategyRecord,
} from '@/lib/vente2-strategies'
import {
  deleteSmsDevis,
  duplicateSmsDevis,
  listUserSmsDevis,
} from '@/lib/sms-devis-storage'
import {
  deleteVente2Strategy,
  duplicateVente2Strategy,
  listUserVente2Strategies,
} from '@/lib/vente2-strategies-storage'
import {
  loadMonEspaceAdminItems,
  type MonEspaceAdminItem,
  type MonEspaceAuthor,
  type MonEspaceCategory,
} from '@/lib/mon-espace-admin'

export default function MonEspacePage() {
  const router = useRouter()
  const { isAdmin, authReady } = useAuthAccess()
  const [devis, setDevis] = useState<SmsDevisRecord[]>([])
  const [strategies, setStrategies] = useState<Vente2StrategyRecord[]>([])
  const [loadingDevis, setLoadingDevis] = useState(true)
  const [loadingStrategies, setLoadingStrategies] = useState(true)
  const [devisError, setDevisError] = useState<string | null>(null)
  const [strategiesError, setStrategiesError] = useState<string | null>(null)
  const [devisSearch, setDevisSearch] = useState('')
  const [strategiesSearch, setStrategiesSearch] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteDevisTarget, setDeleteDevisTarget] = useState<SmsDevisRecord | null>(null)
  const [deleteStrategyTarget, setDeleteStrategyTarget] = useState<Vente2StrategyRecord | null>(null)
  const [adminItems, setAdminItems] = useState<MonEspaceAdminItem[]>([])
  const [adminAuthors, setAdminAuthors] = useState<MonEspaceAuthor[]>([])
  const [loadingAdmin, setLoadingAdmin] = useState(false)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [adminCategory, setAdminCategory] = useState<MonEspaceCategory>('all')
  const [adminAuthorId, setAdminAuthorId] = useState<string>('all')
  const [adminSearch, setAdminSearch] = useState('')

  const loadDevis = useCallback(async () => {
    setLoadingDevis(true)
    setDevisError(null)
    try {
      const rows = await listUserSmsDevis()
      setDevis(rows)
    } catch (e) {
      setDevisError(e instanceof Error ? e.message : 'Impossible de charger vos devis.')
    } finally {
      setLoadingDevis(false)
    }
  }, [])

  const loadStrategies = useCallback(async () => {
    setLoadingStrategies(true)
    setStrategiesError(null)
    try {
      const rows = await listUserVente2Strategies()
      setStrategies(rows)
    } catch (e) {
      setStrategiesError(e instanceof Error ? e.message : 'Impossible de charger vos stratégies.')
    } finally {
      setLoadingStrategies(false)
    }
  }, [])

  useEffect(() => {
    void loadDevis()
    void loadStrategies()
  }, [loadDevis, loadStrategies])

  const loadAdmin = useCallback(async () => {
    if (!isAdmin) return
    setLoadingAdmin(true)
    setAdminError(null)
    try {
      const { items, authors } = await loadMonEspaceAdminItems()
      setAdminItems(items)
      setAdminAuthors(authors)
    } catch (e) {
      setAdminError(e instanceof Error ? e.message : 'Impossible de charger les enregistrements.')
    } finally {
      setLoadingAdmin(false)
    }
  }, [isAdmin])

  useEffect(() => {
    if (authReady && isAdmin) void loadAdmin()
  }, [authReady, isAdmin, loadAdmin])

  const filteredAdminItems = useMemo(() => {
    const q = adminSearch.trim().toLowerCase()
    return adminItems.filter((item) => {
      if (adminCategory === 'strategy' && item.kind !== 'strategy') return false
      if (adminCategory === 'sms' && item.kind !== 'sms') return false
      if (adminAuthorId !== 'all' && item.record.user_id !== adminAuthorId) return false
      if (q && !item.record.name.toLowerCase().includes(q)) return false
      return true
    })
  }, [adminItems, adminCategory, adminAuthorId, adminSearch])

  const filteredDevis = useMemo(() => {
    const q = devisSearch.trim().toLowerCase()
    if (!q) return devis
    return devis.filter((d) => d.name.toLowerCase().includes(q))
  }, [devis, devisSearch])

  const filteredStrategies = useMemo(() => {
    const q = strategiesSearch.trim().toLowerCase()
    if (!q) return strategies
    return strategies.filter((s) => s.name.toLowerCase().includes(q))
  }, [strategies, strategiesSearch])

  const handleDuplicateDevis = async (row: SmsDevisRecord) => {
    setActionId(row.id)
    try {
      await duplicateSmsDevis(row)
      await loadDevis()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la duplication.')
    } finally {
      setActionId(null)
    }
  }

  const handleDuplicateStrategy = async (row: Vente2StrategyRecord) => {
    setActionId(row.id)
    try {
      await duplicateVente2Strategy(row)
      await loadStrategies()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la duplication.')
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteDevis = async () => {
    if (!deleteDevisTarget) return
    setActionId(deleteDevisTarget.id)
    try {
      await deleteSmsDevis(deleteDevisTarget.id)
      setDeleteDevisTarget(null)
      await loadDevis()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteStrategy = async () => {
    if (!deleteStrategyTarget) return
    setActionId(deleteStrategyTarget.id)
    try {
      await deleteVente2Strategy(deleteStrategyTarget.id)
      setDeleteStrategyTarget(null)
      await loadStrategies()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Mon espace</h1>
          <p className="text-muted-foreground">
            Retrouvez et gérez vos stratégies du calculateur de vente et vos devis SMS / RCS.
            {isAdmin
              ? ' En tant qu’administrateur, vous pouvez aussi consulter tous les enregistrements.'
              : ' Seul vous pouvez accéder à vos documents.'}
          </p>
        </div>

        {isAdmin && (
          <Card className="overflow-hidden border-border/80 shadow-sm border-[#E94C16]/30">
            <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.1] to-transparent">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-[#E94C16]" />
                Vue administrateur — tous les enregistrements
              </CardTitle>
              <CardDescription>
                Filtrez par catégorie (stratégie Social ou SMS/RCS) et par personne.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6 space-y-4">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:flex-wrap">
                <div className="space-y-2 min-w-[10rem]">
                  <label className="text-xs font-medium text-muted-foreground">Catégorie</label>
                  <Select
                    value={adminCategory}
                    onValueChange={(v) => setAdminCategory(v as MonEspaceCategory)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes</SelectItem>
                      <SelectItem value="strategy">Stratégies (Social)</SelectItem>
                      <SelectItem value="sms">SMS / RCS</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 min-w-[12rem] flex-1">
                  <label className="text-xs font-medium text-muted-foreground">Enregistré par</label>
                  <Select value={adminAuthorId} onValueChange={setAdminAuthorId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Tous les utilisateurs" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Tous les utilisateurs</SelectItem>
                      {adminAuthors.map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="relative flex-1 min-w-[12rem] max-w-md space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">Recherche</label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Nom du fichier…"
                      value={adminSearch}
                      onChange={(e) => setAdminSearch(e.target.value)}
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>

              {loadingAdmin ? (
                <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Chargement de tous les enregistrements…
                </div>
              ) : adminError ? (
                <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                  {adminError}
                  <p className="mt-2 text-muted-foreground">
                    Exécutez <code className="text-xs">supabase/mon-espace-admin.sql</code> dans
                    Supabase si les droits admin ne sont pas encore configurés.
                  </p>
                </div>
              ) : filteredAdminItems.length === 0 ? (
                <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                  {adminItems.length === 0 ? (
                    <p className="font-medium text-foreground">Aucun enregistrement pour le moment</p>
                  ) : (
                    <p>Aucun résultat pour ces filtres.</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">Nom</TableHead>
                        <TableHead className="font-semibold">Catégorie</TableHead>
                        <TableHead className="font-semibold">Enregistré par</TableHead>
                        <TableHead className="font-semibold">Montant HT</TableHead>
                        <TableHead className="font-semibold">Créé le</TableHead>
                        <TableHead className="font-semibold">Modifié le</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAdminItems.map((item) => {
                        const row = item.record
                        const href =
                          item.kind === 'strategy'
                            ? `${VENTE2_SOCIAL_HREF}?strategy=${row.id}`
                            : `${VENTE2_SMS_HREF}?devis=${row.id}`
                        const amount =
                          item.kind === 'strategy'
                            ? formatVente2StrategyAmount(Number(row.total_amount))
                            : formatSmsDevisAmount(Number(row.total_amount))
                        const formatDate =
                          item.kind === 'strategy'
                            ? formatVente2StrategyDate
                            : formatSmsDevisDate

                        return (
                          <TableRow key={`${item.kind}-${row.id}`}>
                            <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                              {row.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                {item.kind === 'strategy'
                                  ? 'Stratégie Social'
                                  : 'SMS / RCS'}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{item.authorLabel}</TableCell>
                            <TableCell className="tabular-nums whitespace-nowrap">{amount}</TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(row.created_at)}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatDate(row.updated_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(href)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  Ouvrir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {isAdmin && (
          <h2 className="text-lg font-semibold text-muted-foreground">Mes enregistrements personnels</h2>
        )}

        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="h-5 w-5 text-[#E94C16]" />
              Calculateur de vente
            </CardTitle>
            <CardDescription>
              Stratégies Social media enregistrées — ouvrez, modifiez, dupliquez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de stratégie…"
                  value={strategiesSearch}
                  onChange={(e) => setStrategiesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={VENTE2_SOCIAL_HREF}>Nouvelle stratégie</Link>
              </Button>
            </div>

            {loadingStrategies ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Chargement de vos stratégies…
              </div>
            ) : strategiesError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {strategiesError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/vente2-strategies.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredStrategies.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {strategies.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucune stratégie enregistrée</p>
                    <p className="text-sm mt-1">
                      Construisez une stratégie Social media puis utilisez « Sauvegarder ».
                    </p>
                  </>
                ) : (
                  <p>Aucune stratégie ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Stratégies</TableHead>
                      <TableHead className="font-semibold">Montant HT</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold">Modifié le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredStrategies.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {row.content.strategies.length} bloc
                            {row.content.strategies.length > 1 ? 's' : ''}
                            {countVente2StrategyPlatforms(row.content) > 0 && (
                              <span className="text-muted-foreground ml-1">
                                · {countVente2StrategyPlatforms(row.content)} plateforme
                                {countVente2StrategyPlatforms(row.content) > 1 ? 's' : ''}
                              </span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums whitespace-nowrap">
                          {formatVente2StrategyAmount(Number(row.total_amount))}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatVente2StrategyDate(row.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatVente2StrategyDate(row.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() =>
                                router.push(`${VENTE2_SOCIAL_HREF}?strategy=${row.id}`)
                              }
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Ouvrir
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={actionId === row.id}
                              onClick={() => void handleDuplicateStrategy(row)}
                              aria-label={`Dupliquer ${row.name}`}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={actionId === row.id}
                              onClick={() => setDeleteStrategyTarget(row)}
                              aria-label={`Supprimer ${row.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="h-5 w-5 text-[#E94C16]" />
              Mes devis SMS / RCS
            </CardTitle>
            <CardDescription>
              Ouvrez un devis pour le modifier, dupliquez-le ou supprimez-le.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de devis…"
                  value={devisSearch}
                  onChange={(e) => setDevisSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={VENTE2_SMS_HREF}>Créer un nouveau devis</Link>
              </Button>
            </div>

            {loadingDevis ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Chargement de vos devis…
              </div>
            ) : devisError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {devisError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/sms-devis.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredDevis.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {devis.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucun devis enregistré</p>
                    <p className="text-sm mt-1">
                      Créez un devis SMS ou RCS puis utilisez « Sauvegarder ».
                    </p>
                  </>
                ) : (
                  <p>Aucun devis ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Montant HT</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold">Modifié le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredDevis.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal uppercase">
                            {row.sms_type}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums whitespace-nowrap">
                          {formatSmsDevisAmount(Number(row.total_amount))}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatSmsDevisDate(row.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatSmsDevisDate(row.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() =>
                                router.push(`${VENTE2_SMS_HREF}?devis=${row.id}`)
                              }
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Ouvrir
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8"
                              disabled={actionId === row.id}
                              onClick={() => void handleDuplicateDevis(row)}
                              aria-label={`Dupliquer ${row.name}`}
                            >
                              <Copy className="h-3.5 w-3.5" />
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={actionId === row.id}
                              onClick={() => setDeleteDevisTarget(row)}
                              aria-label={`Supprimer ${row.name}`}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <AlertDialog
        open={!!deleteStrategyTarget}
        onOpenChange={(open) => !open && setDeleteStrategyTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette stratégie ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteStrategyTarget?.name} » sera définitivement supprimée de votre espace
              personnel. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteStrategy()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={!!deleteDevisTarget} onOpenChange={(open) => !open && setDeleteDevisTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce devis ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteDevisTarget?.name} » sera définitivement supprimé de votre espace personnel.
              Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteDevis()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
