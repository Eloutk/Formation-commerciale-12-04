'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import {
  BarChart3,
  Calculator,
  ExternalLink,
  FolderOpen,
  ImageIcon,
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
import { STRATEGIE_SOCIAL_HREF, MOCKUP_HREF, VENTE2_SMS_HREF, VENTE2_SOCIAL_HREF } from '@/lib/nav-config'
import { formatSmsDevisAmount, formatSmsDevisDate, type SmsDevisRecord } from '@/lib/sms-devis'
import {
  countVente2StrategyPlatforms,
  formatVente2StrategyAmount,
  formatVente2StrategyDate,
  type Vente2StrategyRecord,
} from '@/lib/vente2-strategies'
import {
  deleteSmsDevis,
  listUserSmsDevis,
} from '@/lib/sms-devis-storage'
import {
  deleteVente2Strategy,
  listUserVente2Strategies,
} from '@/lib/vente2-strategies-storage'
import {
  countEnabledPlatforms,
  formatSimulateurMediaImpressions,
  formatSimulateurMediaSaveDate,
  type SimulateurMediaSaveRecord,
} from '@/lib/simulateur-media-saves'
import {
  deleteSimulateurMediaSave,
  listUserSimulateurMediaSaves,
} from '@/lib/simulateur-media-saves-storage'
import {
  formatMockupFormatLabel,
  formatMockupPlatformLabel,
  formatMockupSaveDate,
  type MockupSaveRecord,
} from '@/lib/mockup-saves'
import {
  deleteMockupSave,
  listUserMockupSaves,
} from '@/lib/mockup-saves-storage'
import {
  loadMonEspaceAdminItems,
  type MonEspaceAdminItem,
  type MonEspaceAuthor,
  type MonEspaceCategory,
} from '@/lib/mon-espace-admin'
import { getMonEspacePagination } from '@/lib/mon-espace-pagination'
import { MonEspaceListPagination } from '@/components/mon-espace/ListPagination'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { cn } from '@/lib/utils'

type MonEspaceSection = 'admin' | 'strategy' | 'simulateur' | 'mockups' | 'devis'

const MON_ESPACE_SECTIONS: {
  id: MonEspaceSection
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}[] = [
  { id: 'admin', label: 'Vue admin', icon: Shield, adminOnly: true },
  { id: 'strategy', label: 'Calculateur de vente', icon: Calculator },
  { id: 'simulateur', label: 'Simulateur média', icon: BarChart3 },
  { id: 'mockups', label: 'Mockups', icon: ImageIcon },
  { id: 'devis', label: 'SMS / RCS', icon: FolderOpen },
]

export default function MonEspacePage() {
  const router = useRouter()
  const { isAdmin, authReady, userName } = useAuthAccess()
  const [devis, setDevis] = useState<SmsDevisRecord[]>([])
  const [strategies, setStrategies] = useState<Vente2StrategyRecord[]>([])
  const [simulateurSaves, setSimulateurSaves] = useState<SimulateurMediaSaveRecord[]>([])
  const [mockupSaves, setMockupSaves] = useState<MockupSaveRecord[]>([])
  const [loadingDevis, setLoadingDevis] = useState(true)
  const [loadingStrategies, setLoadingStrategies] = useState(true)
  const [loadingSimulateurSaves, setLoadingSimulateurSaves] = useState(true)
  const [loadingMockupSaves, setLoadingMockupSaves] = useState(true)
  const [devisError, setDevisError] = useState<string | null>(null)
  const [strategiesError, setStrategiesError] = useState<string | null>(null)
  const [simulateurSavesError, setSimulateurSavesError] = useState<string | null>(null)
  const [mockupSavesError, setMockupSavesError] = useState<string | null>(null)
  const [devisSearch, setDevisSearch] = useState('')
  const [strategiesSearch, setStrategiesSearch] = useState('')
  const [simulateurSavesSearch, setSimulateurSavesSearch] = useState('')
  const [mockupSavesSearch, setMockupSavesSearch] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteDevisTarget, setDeleteDevisTarget] = useState<SmsDevisRecord | null>(null)
  const [deleteStrategyTarget, setDeleteStrategyTarget] = useState<Vente2StrategyRecord | null>(null)
  const [deleteSimulateurTarget, setDeleteSimulateurTarget] =
    useState<SimulateurMediaSaveRecord | null>(null)
  const [deleteMockupTarget, setDeleteMockupTarget] = useState<MockupSaveRecord | null>(null)
  const [adminItems, setAdminItems] = useState<MonEspaceAdminItem[]>([])
  const [adminAuthors, setAdminAuthors] = useState<MonEspaceAuthor[]>([])
  const [loadingAdmin, setLoadingAdmin] = useState(false)
  const [adminError, setAdminError] = useState<string | null>(null)
  const [adminCategory, setAdminCategory] = useState<MonEspaceCategory>('all')
  const [adminAuthorId, setAdminAuthorId] = useState<string>('all')
  const [adminSearch, setAdminSearch] = useState('')
  const [adminPage, setAdminPage] = useState(1)
  const [strategiesPage, setStrategiesPage] = useState(1)
  const [simulateurPage, setSimulateurPage] = useState(1)
  const [mockupPage, setMockupPage] = useState(1)
  const [devisPage, setDevisPage] = useState(1)
  const [activeSection, setActiveSection] = useState<MonEspaceSection>('strategy')

  const visibleSections = useMemo(
    () => MON_ESPACE_SECTIONS.filter((section) => !section.adminOnly || isAdmin),
    [isAdmin],
  )

  useEffect(() => {
    if (!visibleSections.some((section) => section.id === activeSection)) {
      setActiveSection(visibleSections[0]?.id ?? 'strategy')
    }
  }, [activeSection, visibleSections])

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

  const loadSimulateurSaves = useCallback(async () => {
    setLoadingSimulateurSaves(true)
    setSimulateurSavesError(null)
    try {
      const rows = await listUserSimulateurMediaSaves()
      setSimulateurSaves(rows)
    } catch (e) {
      setSimulateurSavesError(
        e instanceof Error ? e.message : 'Impossible de charger vos simulations.',
      )
    } finally {
      setLoadingSimulateurSaves(false)
    }
  }, [])

  const loadMockupSaves = useCallback(async () => {
    setLoadingMockupSaves(true)
    setMockupSavesError(null)
    try {
      const rows = await listUserMockupSaves()
      setMockupSaves(rows)
    } catch (e) {
      setMockupSavesError(e instanceof Error ? e.message : 'Impossible de charger vos mockups.')
    } finally {
      setLoadingMockupSaves(false)
    }
  }, [])

  useEffect(() => {
    void loadDevis()
    void loadStrategies()
    void loadSimulateurSaves()
    void loadMockupSaves()
  }, [loadDevis, loadStrategies, loadSimulateurSaves, loadMockupSaves])

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
      if (adminCategory === 'simulateur' && item.kind !== 'simulateur') return false
      if (adminCategory === 'mockup' && item.kind !== 'mockup') return false
      if (adminCategory === 'sms' && item.kind !== 'sms') return false
      if (adminAuthorId !== 'all' && item.record.user_id !== adminAuthorId) return false
      if (q) {
        const nameMatch = item.record.name.toLowerCase().includes(q)
        const clientMatch =
          item.kind === 'mockup' && item.record.client_name.toLowerCase().includes(q)
        if (!nameMatch && !clientMatch) return false
      }
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

  const filteredSimulateurSaves = useMemo(() => {
    const q = simulateurSavesSearch.trim().toLowerCase()
    if (!q) return simulateurSaves
    return simulateurSaves.filter((s) => s.name.toLowerCase().includes(q))
  }, [simulateurSaves, simulateurSavesSearch])

  const filteredMockupSaves = useMemo(() => {
    const q = mockupSavesSearch.trim().toLowerCase()
    if (!q) return mockupSaves
    return mockupSaves.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        s.client_name.toLowerCase().includes(q) ||
        formatMockupPlatformLabel(s.platform).toLowerCase().includes(q),
    )
  }, [mockupSaves, mockupSavesSearch])

  const adminPagination = useMemo(
    () => getMonEspacePagination(filteredAdminItems, adminPage),
    [filteredAdminItems, adminPage],
  )
  const strategiesPagination = useMemo(
    () => getMonEspacePagination(filteredStrategies, strategiesPage),
    [filteredStrategies, strategiesPage],
  )
  const simulateurPagination = useMemo(
    () => getMonEspacePagination(filteredSimulateurSaves, simulateurPage),
    [filteredSimulateurSaves, simulateurPage],
  )
  const mockupPagination = useMemo(
    () => getMonEspacePagination(filteredMockupSaves, mockupPage),
    [filteredMockupSaves, mockupPage],
  )
  const devisPagination = useMemo(
    () => getMonEspacePagination(filteredDevis, devisPage),
    [filteredDevis, devisPage],
  )

  useEffect(() => {
    setAdminPage(1)
  }, [adminCategory, adminAuthorId, adminSearch])

  useEffect(() => {
    setStrategiesPage(1)
  }, [strategiesSearch])

  useEffect(() => {
    setSimulateurPage(1)
  }, [simulateurSavesSearch])

  useEffect(() => {
    setMockupPage(1)
  }, [mockupSavesSearch])

  useEffect(() => {
    setDevisPage(1)
  }, [devisSearch])

  useEffect(() => {
    if (adminPage > adminPagination.totalPages) {
      setAdminPage(adminPagination.totalPages)
    }
  }, [adminPage, adminPagination.totalPages])

  useEffect(() => {
    if (strategiesPage > strategiesPagination.totalPages) {
      setStrategiesPage(strategiesPagination.totalPages)
    }
  }, [strategiesPage, strategiesPagination.totalPages])

  useEffect(() => {
    if (simulateurPage > simulateurPagination.totalPages) {
      setSimulateurPage(simulateurPagination.totalPages)
    }
  }, [simulateurPage, simulateurPagination.totalPages])

  useEffect(() => {
    if (mockupPage > mockupPagination.totalPages) {
      setMockupPage(mockupPagination.totalPages)
    }
  }, [mockupPage, mockupPagination.totalPages])

  useEffect(() => {
    if (devisPage > devisPagination.totalPages) {
      setDevisPage(devisPagination.totalPages)
    }
  }, [devisPage, devisPagination.totalPages])

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

  const handleDeleteSimulateur = async () => {
    if (!deleteSimulateurTarget) return
    setActionId(deleteSimulateurTarget.id)
    try {
      await deleteSimulateurMediaSave(deleteSimulateurTarget.id)
      setDeleteSimulateurTarget(null)
      await loadSimulateurSaves()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteMockup = async () => {
    if (!deleteMockupTarget) return
    setActionId(deleteMockupTarget.id)
    try {
      await deleteMockupSave(deleteMockupTarget.id)
      setDeleteMockupTarget(null)
      await loadMockupSaves()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="max-w-6xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {userName ? `Espace perso de ${userName}` : 'Espace perso'}
          </h1>
          <p className="text-muted-foreground">
            Retrouvez et gérez vos stratégies du calculateur de vente, vos mockups publicitaires, vos
            simulations média Link et vos devis SMS / RCS.
            {isAdmin
              ? ' En tant qu’administrateur, vous pouvez aussi consulter tous les enregistrements.'
              : ' Seul vous pouvez accéder à vos documents.'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-start">
          <aside className="w-full md:w-52 shrink-0 md:sticky md:top-20">
            <nav aria-label="Catégories Mon espace">
              <ToggleGroup
                type="single"
                value={activeSection}
                onValueChange={(value) => {
                  if (value) setActiveSection(value as MonEspaceSection)
                }}
                className="flex flex-col items-stretch gap-1 w-full rounded-xl border border-border/70 bg-muted/20 p-1.5"
              >
                {visibleSections.map(({ id, label, icon: Icon }) => (
                  <ToggleGroupItem
                    key={id}
                    value={id}
                    aria-label={label}
                    className={cn(
                      'justify-start gap-2.5 h-auto min-h-10 py-2.5 px-3 w-full rounded-lg border border-transparent',
                      'data-[state=on]:bg-[#E94C16]/10 data-[state=on]:text-[#E94C16] data-[state=on]:border-[#E94C16]/30 data-[state=on]:shadow-sm',
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" aria-hidden />
                    <span className="text-sm font-medium text-left leading-snug">{label}</span>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
            </nav>
          </aside>

          <div className="flex-1 min-w-0 w-full">
        {activeSection === 'admin' && isAdmin && (
          <Card className="overflow-hidden border-border/80 shadow-sm border-[#E94C16]/30">
            <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.1] to-transparent">
              <CardTitle className="flex items-center gap-2 text-xl">
                <Shield className="h-5 w-5 text-[#E94C16]" />
                Vue administrateur — tous les enregistrements
              </CardTitle>
              <CardDescription>
                Filtrez par catégorie et par personne pour consulter tous les enregistrements.
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
                      <SelectItem value="strategy">Calculateur de vente</SelectItem>
                      <SelectItem value="simulateur">Simulateur média</SelectItem>
                      <SelectItem value="mockup">Mockups</SelectItem>
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
                <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-950">
                  <p>{adminError}</p>
                  <p className="mt-2 text-muted-foreground">
                    Dans Supabase → <strong>SQL Editor</strong>, exécutez dans l&apos;ordre :
                  </p>
                  <ol className="mt-2 list-decimal list-inside text-muted-foreground space-y-1 text-xs sm:text-sm">
                    <li>
                      <code>supabase/vente2-strategies.sql</code>
                    </li>
                    <li>
                      <code>supabase/sms-devis.sql</code>
                    </li>
                    <li>
                      <code>supabase/simulateur-media-saves.sql</code>
                    </li>
                    <li>
                      <code>supabase/mockup-saves.sql</code>
                    </li>
                    <li>
                      <code>supabase/mon-espace-admin.sql</code>
                    </li>
                    <li>
                      <code>supabase/mon-espace-admin-mockups.sql</code> (si admin déjà déployé)
                    </li>
                  </ol>
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
                <>
                <div className="overflow-x-auto rounded-xl border border-border/70">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold">Nom</TableHead>
                        <TableHead className="font-semibold">Catégorie</TableHead>
                        <TableHead className="font-semibold">Enregistré par</TableHead>
                        <TableHead className="font-semibold">Résumé</TableHead>
                        <TableHead className="font-semibold">Créé le</TableHead>
                        <TableHead className="font-semibold text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminPagination.items.map((item) => {
                        if (item.kind === 'strategy') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.id}`}>
                              <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Calculateur de vente
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="tabular-nums whitespace-nowrap">
                                {formatVente2StrategyAmount(Number(row.total_amount))}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatVente2StrategyDate(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`${VENTE2_SOCIAL_HREF}?strategy=${row.id}`)
                                    }
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                    Ouvrir
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        }

                        if (item.kind === 'simulateur') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.id}`}>
                              <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Simulateur média
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="tabular-nums whitespace-nowrap">
                                {formatSimulateurMediaImpressions(Number(row.summary_impressions))}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatSimulateurMediaSaveDate(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`${STRATEGIE_SOCIAL_HREF}?simulateur=${row.id}`)
                                    }
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                    Ouvrir
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        }

                        if (item.kind === 'mockup') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.id}`}>
                              <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Mockups
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="text-sm whitespace-nowrap max-w-[16rem] truncate" title={row.client_name}>
                                {formatMockupPlatformLabel(row.platform)} — {formatMockupFormatLabel(row.content)}
                                {row.client_name ? ` — ${row.client_name}` : ''}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatMockupSaveDate(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => router.push(`${MOCKUP_HREF}?mockup=${row.id}`)}
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                    Ouvrir
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        }

                        if (item.kind === 'sms') {
                          const row = item.record
                          return (
                          <TableRow key={`${item.kind}-${row.id}`}>
                            <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                              {row.name}
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="font-normal">
                                SMS / RCS
                              </Badge>
                            </TableCell>
                            <TableCell className="text-sm">{item.authorLabel}</TableCell>
                            <TableCell className="tabular-nums whitespace-nowrap">
                              {formatSmsDevisAmount(Number(row.total_amount))}
                            </TableCell>
                            <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                              {formatSmsDevisDate(row.created_at)}
                            </TableCell>
                            <TableCell>
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => router.push(`${VENTE2_SMS_HREF}?devis=${row.id}`)}
                                >
                                  <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                  Ouvrir
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                          )
                        }

                        return null
                      })}
                    </TableBody>
                  </Table>
                </div>
                <MonEspaceListPagination
                  page={adminPagination.page}
                  totalPages={adminPagination.totalPages}
                  onPageChange={setAdminPage}
                />
                </>
              )}
            </CardContent>
          </Card>
        )}

        {activeSection === 'strategy' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Calculator className="h-5 w-5 text-[#E94C16]" />
              Calculateur de vente
            </CardTitle>
            <CardDescription>
              Stratégies Social media enregistrées — ouvrez, modifiez ou supprimez.
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
              <>
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
                    {strategiesPagination.items.map((row) => (
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
              <MonEspaceListPagination
                page={strategiesPagination.page}
                totalPages={strategiesPagination.totalPages}
                onPageChange={setStrategiesPage}
              />
              </>
            )}
          </CardContent>
        </Card>
        )}

        {activeSection === 'simulateur' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <BarChart3 className="h-5 w-5 text-[#E94C16]" />
              Simulateur média Link
            </CardTitle>
            <CardDescription>
              Simulations Stratégie Social Media enregistrées — ouvrez, modifiez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de simulation…"
                  value={simulateurSavesSearch}
                  onChange={(e) => setSimulateurSavesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={STRATEGIE_SOCIAL_HREF}>Nouvelle simulation</Link>
              </Button>
            </div>

            {loadingSimulateurSaves ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Chargement de vos simulations…
              </div>
            ) : simulateurSavesError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {simulateurSavesError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/simulateur-media-saves.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredSimulateurSaves.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {simulateurSaves.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucune simulation enregistrée</p>
                    <p className="text-sm mt-1">
                      Utilisez le simulateur Stratégie Social Media puis « Sauvegarder ».
                    </p>
                  </>
                ) : (
                  <p>Aucune simulation ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <>
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Plateformes</TableHead>
                      <TableHead className="font-semibold">Impressions</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold">Modifié le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulateurPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {countEnabledPlatforms(row.content)} plateforme
                            {countEnabledPlatforms(row.content) > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums whitespace-nowrap">
                          {formatSimulateurMediaImpressions(Number(row.summary_impressions))}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatSimulateurMediaSaveDate(row.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatSimulateurMediaSaveDate(row.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() =>
                                router.push(`${STRATEGIE_SOCIAL_HREF}?simulateur=${row.id}`)
                              }
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Ouvrir
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={actionId === row.id}
                              onClick={() => setDeleteSimulateurTarget(row)}
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
              <MonEspaceListPagination
                page={simulateurPagination.page}
                totalPages={simulateurPagination.totalPages}
                onPageChange={setSimulateurPage}
              />
              </>
            )}
          </CardContent>
        </Card>
        )}

        {activeSection === 'mockups' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ImageIcon className="h-5 w-5 text-[#E94C16]" />
              Mockups publicitaires
            </CardTitle>
            <CardDescription>
              Prévisualisations enregistrées — ouvrez, modifiez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, client ou plateforme…"
                  value={mockupSavesSearch}
                  onChange={(e) => setMockupSavesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={MOCKUP_HREF}>Nouveau mockup</Link>
              </Button>
            </div>

            {loadingMockupSaves ? (
              <div className="flex items-center justify-center py-16 text-muted-foreground gap-2">
                <Loader2 className="h-5 w-5 animate-spin" />
                Chargement de vos mockups…
              </div>
            ) : mockupSavesError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {mockupSavesError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/mockup-saves.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredMockupSaves.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {mockupSaves.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucun mockup enregistré</p>
                    <p className="text-sm mt-1">
                      Créez un mockup puis utilisez « Sauvegarder » pour le retrouver ici.
                    </p>
                  </>
                ) : (
                  <p>Aucun mockup ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <>
              <div className="overflow-x-auto rounded-xl border border-border/70">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Client</TableHead>
                      <TableHead className="font-semibold">Plateforme</TableHead>
                      <TableHead className="font-semibold">Format</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold">Modifié le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockupPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium max-w-[14rem] truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell className="max-w-[10rem] truncate" title={row.client_name}>
                          {row.client_name || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {formatMockupPlatformLabel(row.platform)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatMockupFormatLabel(row.content)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatMockupSaveDate(row.created_at)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatMockupSaveDate(row.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() => router.push(`${MOCKUP_HREF}?mockup=${row.id}`)}
                            >
                              <ExternalLink className="h-3.5 w-3.5 mr-1" />
                              Ouvrir
                            </Button>
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="h-8 w-8 text-destructive hover:text-destructive"
                              disabled={actionId === row.id}
                              onClick={() => setDeleteMockupTarget(row)}
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
              <MonEspaceListPagination
                page={mockupPagination.page}
                totalPages={mockupPagination.totalPages}
                onPageChange={setMockupPage}
              />
              </>
            )}
          </CardContent>
        </Card>
        )}

        {activeSection === 'devis' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <FolderOpen className="h-5 w-5 text-[#E94C16]" />
              Mes devis SMS / RCS
            </CardTitle>
            <CardDescription>
              Ouvrez un devis pour le modifier ou le supprimer.
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
              <>
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
                    {devisPagination.items.map((row) => (
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
              <MonEspaceListPagination
                page={devisPagination.page}
                totalPages={devisPagination.totalPages}
                onPageChange={setDevisPage}
              />
              </>
            )}
          </CardContent>
        </Card>
        )}
          </div>
        </div>
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

      <AlertDialog
        open={!!deleteSimulateurTarget}
        onOpenChange={(open) => !open && setDeleteSimulateurTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette simulation ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteSimulateurTarget?.name} » sera définitivement supprimée de Mon espace. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteSimulateur()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteMockupTarget}
        onOpenChange={(open) => !open && setDeleteMockupTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce mockup ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteMockupTarget?.name} » sera définitivement supprimé de Mon espace. Cette action
              est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteMockup()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
