'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'
import { SavedRecordLoadingBanner } from '@/components/ui/saved-record-loading-banner'
import {
  BarChart3,
  Calculator,
  CalendarDays,
  ExternalLink,
  FileText,
  FolderOpen,
  ImageIcon,
  Loader2,
  Palette,
  ScanSearch,
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
import { STRATEGIE_SOCIAL_HREF, STRATEGIE_RETROPLANNING_HREF, MON_ESPACE_PIGE_COMMERCIALE_HREF, STRATEGIE_MOCKUP_HREF, VENTE2_SMS_HREF, VENTE2_SOCIAL_HREF, VENTE2_STUDIO_TARIFS_HREF } from '@/lib/nav-config'
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
  formatSimulateurMediaImpressions,
  formatSimulateurMediaSaveDate,
  type SimulateurMediaSaveRecord,
} from '@/lib/simulateur-media-saves'
import {
  deleteSimulateurMediaSave,
  getSimulateurMediaAttachmentSignedUrl,
  listUserSimulateurMediaSaves,
} from '@/lib/simulateur-media-saves-storage'
import {
  formatMockupFormatLabel,
  formatMockupVisualFormatLabel,
  formatMockupPlatformLabel,
  formatMockupSaveDate,
  type MockupSaveRecord,
} from '@/lib/mockup-saves'
import {
  deleteMockupSave,
  listUserMockupSaves,
} from '@/lib/mockup-saves-storage'
import {
  deletePigeCommercialeProject,
  listUserPigeCommercialeProjects,
} from '@/lib/pige-commerciale-saves-storage'
import {
  formatPigeCommercialeSaveDate,
  type PigeCommercialeProject,
} from '@/lib/pige-commerciale-saves'
import {
  formatStudioTarifsSaveDate,
  type StudioTarifsSaveRecord,
} from '@/lib/studio-tarifs-saves'
import { formatStudioEuro } from '@/lib/studio-tarifs-grid'
import {
  deleteStudioTarifsSave,
  listUserStudioTarifsSaves,
} from '@/lib/studio-tarifs-saves-storage'
import {
  deleteRetroplanningSave,
  listUserRetroplanningSaves,
} from '@/lib/retroplanning-saves-storage'
import {
  formatRetroplanningSaveDate,
  type RetroplanningSaveRecord,
} from '@/lib/retroplanning-saves'
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

type MonEspaceSection = 'admin' | 'strategy' | 'retroplanning' | 'studioTarifs' | 'simulateur' | 'mockups' | 'pige' | 'devis'

const MON_ESPACE_SECTIONS: {
  id: MonEspaceSection
  label: string
  icon: LucideIcon
  adminOnly?: boolean
}[] = [
  { id: 'admin', label: 'Vue admin', icon: Shield, adminOnly: true },
  { id: 'strategy', label: 'Calculateur de vente', icon: Calculator },
  { id: 'retroplanning', label: 'Rétroplanning', icon: CalendarDays },
  { id: 'studioTarifs', label: 'Studio', icon: Palette },
  { id: 'simulateur', label: 'Plan média', icon: BarChart3 },
  { id: 'mockups', label: 'Mockups', icon: ImageIcon },
  { id: 'pige', label: 'Pige commerciale', icon: ScanSearch },
  { id: 'devis', label: 'SMS / RCS', icon: FolderOpen },
]

export default function MonEspacePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAdmin, authReady, userName } = useAuthAccess()
  const [devis, setDevis] = useState<SmsDevisRecord[]>([])
  const [strategies, setStrategies] = useState<Vente2StrategyRecord[]>([])
  const [simulateurSaves, setSimulateurSaves] = useState<SimulateurMediaSaveRecord[]>([])
  const [mockupSaves, setMockupSaves] = useState<MockupSaveRecord[]>([])
  const [pigeProjects, setPigeProjects] = useState<PigeCommercialeProject[]>([])
  const [studioTarifsSaves, setStudioTarifsSaves] = useState<StudioTarifsSaveRecord[]>([])
  const [retroplanningSaves, setRetroplanningSaves] = useState<RetroplanningSaveRecord[]>([])
  const [loadingDevis, setLoadingDevis] = useState(true)
  const [loadingStrategies, setLoadingStrategies] = useState(true)
  const [loadingSimulateurSaves, setLoadingSimulateurSaves] = useState(true)
  const [loadingMockupSaves, setLoadingMockupSaves] = useState(true)
  const [loadingPigeSaves, setLoadingPigeSaves] = useState(true)
  const [loadingStudioTarifsSaves, setLoadingStudioTarifsSaves] = useState(true)
  const [loadingRetroplanningSaves, setLoadingRetroplanningSaves] = useState(true)
  const [devisError, setDevisError] = useState<string | null>(null)
  const [strategiesError, setStrategiesError] = useState<string | null>(null)
  const [simulateurSavesError, setSimulateurSavesError] = useState<string | null>(null)
  const [mockupSavesError, setMockupSavesError] = useState<string | null>(null)
  const [pigeSavesError, setPigeSavesError] = useState<string | null>(null)
  const [studioTarifsSavesError, setStudioTarifsSavesError] = useState<string | null>(null)
  const [retroplanningSavesError, setRetroplanningSavesError] = useState<string | null>(null)
  const [devisSearch, setDevisSearch] = useState('')
  const [strategiesSearch, setStrategiesSearch] = useState('')
  const [simulateurSavesSearch, setSimulateurSavesSearch] = useState('')
  const [mockupSavesSearch, setMockupSavesSearch] = useState('')
  const [pigeSavesSearch, setPigeSavesSearch] = useState('')
  const [studioTarifsSavesSearch, setStudioTarifsSavesSearch] = useState('')
  const [retroplanningSavesSearch, setRetroplanningSavesSearch] = useState('')
  const [actionId, setActionId] = useState<string | null>(null)
  const [deleteDevisTarget, setDeleteDevisTarget] = useState<SmsDevisRecord | null>(null)
  const [deleteStrategyTarget, setDeleteStrategyTarget] = useState<Vente2StrategyRecord | null>(null)
  const [deleteSimulateurTarget, setDeleteSimulateurTarget] =
    useState<SimulateurMediaSaveRecord | null>(null)
  const [deleteMockupTarget, setDeleteMockupTarget] = useState<MockupSaveRecord | null>(null)
  const [deletePigeTarget, setDeletePigeTarget] = useState<PigeCommercialeProject | null>(null)
  const [deleteStudioTarifsTarget, setDeleteStudioTarifsTarget] =
    useState<StudioTarifsSaveRecord | null>(null)
  const [deleteRetroplanningTarget, setDeleteRetroplanningTarget] =
    useState<RetroplanningSaveRecord | null>(null)
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
  const [pigePage, setPigePage] = useState(1)
  const [studioTarifsPage, setStudioTarifsPage] = useState(1)
  const [retroplanningPage, setRetroplanningPage] = useState(1)
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

  useEffect(() => {
    const section = searchParams.get('section')
    if (section && visibleSections.some((item) => item.id === section)) {
      setActiveSection(section as MonEspaceSection)
    }
  }, [searchParams, visibleSections])

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
        e instanceof Error ? e.message : 'Impossible de charger vos projets Plan média.',
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

  const loadPigeSaves = useCallback(async () => {
    setLoadingPigeSaves(true)
    setPigeSavesError(null)
    try {
      const rows = await listUserPigeCommercialeProjects()
      setPigeProjects(rows)
    } catch (e) {
      setPigeSavesError(
        e instanceof Error ? e.message : 'Impossible de charger vos captures de pige.',
      )
    } finally {
      setLoadingPigeSaves(false)
    }
  }, [])

  const loadStudioTarifsSaves = useCallback(async () => {
    setLoadingStudioTarifsSaves(true)
    setStudioTarifsSavesError(null)
    try {
      const rows = await listUserStudioTarifsSaves()
      setStudioTarifsSaves(rows)
    } catch (e) {
      setStudioTarifsSavesError(
        e instanceof Error ? e.message : 'Impossible de charger vos devis studio.',
      )
    } finally {
      setLoadingStudioTarifsSaves(false)
    }
  }, [])

  const loadRetroplanningSaves = useCallback(async () => {
    setLoadingRetroplanningSaves(true)
    setRetroplanningSavesError(null)
    try {
      const rows = await listUserRetroplanningSaves()
      setRetroplanningSaves(rows)
    } catch (e) {
      setRetroplanningSavesError(
        e instanceof Error ? e.message : 'Impossible de charger vos rétroplannings.',
      )
    } finally {
      setLoadingRetroplanningSaves(false)
    }
  }, [])

  useEffect(() => {
    void loadDevis()
    void loadStrategies()
    void loadSimulateurSaves()
    void loadMockupSaves()
    void loadPigeSaves()
    void loadStudioTarifsSaves()
    void loadRetroplanningSaves()
  }, [loadDevis, loadStrategies, loadSimulateurSaves, loadMockupSaves, loadPigeSaves, loadStudioTarifsSaves, loadRetroplanningSaves])

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
      if (adminCategory === 'retroplanning' && item.kind !== 'retroplanning') return false
      if (adminCategory === 'studioTarifs' && item.kind !== 'studioTarifs') return false
      if (adminCategory === 'simulateur' && item.kind !== 'simulateur') return false
      if (adminCategory === 'mockup' && item.kind !== 'mockup') return false
      if (adminCategory === 'pige' && item.kind !== 'pige') return false
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

  const filteredPigeSaves = useMemo(() => {
    const q = pigeSavesSearch.trim().toLowerCase()
    if (!q) return pigeProjects
    return pigeProjects.filter(
      (row) =>
        row.name.toLowerCase().includes(q) ||
        (row.comment?.toLowerCase().includes(q) ?? false) ||
        row.captures.some((capture) => capture.original_filename.toLowerCase().includes(q)),
    )
  }, [pigeProjects, pigeSavesSearch])

  const filteredStudioTarifsSaves = useMemo(() => {
    const q = studioTarifsSavesSearch.trim().toLowerCase()
    if (!q) return studioTarifsSaves
    return studioTarifsSaves.filter((s) => s.name.toLowerCase().includes(q))
  }, [studioTarifsSaves, studioTarifsSavesSearch])

  const filteredRetroplanningSaves = useMemo(() => {
    const q = retroplanningSavesSearch.trim().toLowerCase()
    if (!q) return retroplanningSaves
    return retroplanningSaves.filter((s) => s.name.toLowerCase().includes(q))
  }, [retroplanningSaves, retroplanningSavesSearch])

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
  const pigePagination = useMemo(
    () => getMonEspacePagination(filteredPigeSaves, pigePage),
    [filteredPigeSaves, pigePage],
  )
  const studioTarifsPagination = useMemo(
    () => getMonEspacePagination(filteredStudioTarifsSaves, studioTarifsPage),
    [filteredStudioTarifsSaves, studioTarifsPage],
  )
  const retroplanningPagination = useMemo(
    () => getMonEspacePagination(filteredRetroplanningSaves, retroplanningPage),
    [filteredRetroplanningSaves, retroplanningPage],
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
    setPigePage(1)
  }, [pigeSavesSearch])

  useEffect(() => {
    setStudioTarifsPage(1)
  }, [studioTarifsSavesSearch])

  useEffect(() => {
    setRetroplanningPage(1)
  }, [retroplanningSavesSearch])

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
    if (pigePage > pigePagination.totalPages) {
      setPigePage(pigePagination.totalPages)
    }
  }, [pigePage, pigePagination.totalPages])

  useEffect(() => {
    if (studioTarifsPage > studioTarifsPagination.totalPages) {
      setStudioTarifsPage(studioTarifsPagination.totalPages)
    }
  }, [studioTarifsPage, studioTarifsPagination.totalPages])

  useEffect(() => {
    if (retroplanningPage > retroplanningPagination.totalPages) {
      setRetroplanningPage(retroplanningPagination.totalPages)
    }
  }, [retroplanningPage, retroplanningPagination.totalPages])

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

  const handleOpenSimulateurAttachment = async (row: SimulateurMediaSaveRecord) => {
    if (!row.attachment_path) return
    setActionId(row.id)
    try {
      const url = await getSimulateurMediaAttachmentSignedUrl(row.attachment_path)
      if (!url) {
        alert('PDF introuvable.')
        return
      }
      window.open(url, '_blank', 'noopener,noreferrer')
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Impossible d’ouvrir le PDF.')
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

  const handleDeletePige = async () => {
    if (!deletePigeTarget) return
    setActionId(deletePigeTarget.project_id)
    try {
      await deletePigeCommercialeProject(deletePigeTarget.project_id)
      setDeletePigeTarget(null)
      await loadPigeSaves()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteStudioTarifs = async () => {
    if (!deleteStudioTarifsTarget) return
    setActionId(deleteStudioTarifsTarget.id)
    try {
      await deleteStudioTarifsSave(deleteStudioTarifsTarget.id)
      setDeleteStudioTarifsTarget(null)
      await loadStudioTarifsSaves()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  const handleDeleteRetroplanning = async () => {
    if (!deleteRetroplanningTarget) return
    setActionId(deleteRetroplanningTarget.id)
    try {
      await deleteRetroplanningSave(deleteRetroplanningTarget.id)
      setDeleteRetroplanningTarget(null)
      await loadRetroplanningSaves()
    } catch (e) {
      alert(e instanceof Error ? e.message : 'Erreur lors de la suppression.')
    } finally {
      setActionId(null)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">
            {userName ? `Espace perso de ${userName}` : 'Espace perso'}
          </h1>
          <p className="text-muted-foreground">
            Retrouvez et gérez vos stratégies du calculateur de vente, vos mockups publicitaires, vos
            simulations Plan média et vos devis SMS / RCS.
            {isAdmin
              ? ' En tant qu’administrateur, vous pouvez aussi consulter tous les enregistrements.'
              : ' Seul vous pouvez accéder à vos documents.'}
          </p>
        </div>

        <div className="flex flex-col md:flex-row gap-6 items-start">
          <aside className="w-full md:w-48 lg:w-52 shrink-0 md:sticky md:top-20">
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
                Consultez l’ensemble des projets enregistrés par les utilisateurs — filtrez par
                catégorie et par personne.
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
                      <SelectItem value="retroplanning">Rétroplanning</SelectItem>
                      <SelectItem value="studioTarifs">Studio</SelectItem>
                      <SelectItem value="simulateur">Plan média</SelectItem>
                      <SelectItem value="mockup">Mockups</SelectItem>
                      <SelectItem value="pige">Pige commerciale</SelectItem>
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
                <SavedRecordLoadingBanner
                  className="my-10"
                  label="Chargement de tous les enregistrements…"
                  description="Récupération des données administrateur."
                />
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
                      <code>supabase/mon-espace-admin-extended.sql</code>
                    </li>
                    <li>
                      <code>supabase/mon-espace-admin-performance.sql</code> (si timeout)
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
                <div className="rounded-xl border border-border/70">
                  <Table className="table-fixed w-full">
                    <TableHeader>
                      <TableRow className="bg-muted/30 hover:bg-muted/30">
                        <TableHead className="font-semibold w-[20%]">Nom</TableHead>
                        <TableHead className="font-semibold w-[14%]">Catégorie</TableHead>
                        <TableHead className="font-semibold w-[16%]">Enregistré par</TableHead>
                        <TableHead className="font-semibold w-[18%]">Résumé</TableHead>
                        <TableHead className="font-semibold w-[14%]">Créé le</TableHead>
                        <TableHead className="font-semibold text-right w-[18%]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {adminPagination.items.map((item) => {
                        if (item.kind === 'strategy') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.id}`}>
                              <TableCell className="font-medium min-w-0 truncate" title={row.name}>
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

                        if (item.kind === 'retroplanning') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.id}`}>
                              <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Rétroplanning
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="text-sm whitespace-nowrap">
                                {row.operations_count} opération{row.operations_count > 1 ? 's' : ''}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatRetroplanningSaveDate(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`${STRATEGIE_RETROPLANNING_HREF}?retro=${row.id}`)
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

                        if (item.kind === 'studioTarifs') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.id}`}>
                              <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Studio
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="tabular-nums whitespace-nowrap">
                                {formatStudioEuro(Number(row.summary_total_ht))} HT
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatStudioTarifsSaveDate(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(`${VENTE2_STUDIO_TARIFS_HREF}?studio=${row.id}`)
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
                              <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Plan média
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
                              <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Mockups
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="text-sm min-w-0 truncate" title={row.client_name}>
                                {formatMockupPlatformLabel(row.platform)} — {formatMockupVisualFormatLabel(row.platform, row.visual_format)}
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
                                    onClick={() => router.push(`${STRATEGIE_MOCKUP_HREF}?mockup=${row.id}`)}
                                  >
                                    <ExternalLink className="h-3.5 w-3.5 mr-1" />
                                    Ouvrir
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        }

                        if (item.kind === 'pige') {
                          const row = item.record
                          return (
                            <TableRow key={`${item.kind}-${row.project_id}`}>
                              <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                                {row.name}
                              </TableCell>
                              <TableCell>
                                <Badge variant="outline" className="font-normal">
                                  Pige commerciale
                                </Badge>
                              </TableCell>
                              <TableCell className="text-sm">{item.authorLabel}</TableCell>
                              <TableCell className="text-sm whitespace-nowrap">
                                {row.file_count} capture{row.file_count > 1 ? 's' : ''}
                              </TableCell>
                              <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                                {formatPigeCommercialeSaveDate(row.created_at)}
                              </TableCell>
                              <TableCell>
                                <div className="flex justify-end">
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() =>
                                      router.push(
                                        `${MON_ESPACE_PIGE_COMMERCIALE_HREF}?project=${row.project_id}`,
                                      )
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

                        if (item.kind === 'sms') {
                          const row = item.record
                          return (
                          <TableRow key={`${item.kind}-${row.id}`}>
                            <TableCell className="font-medium min-w-0 truncate" title={row.name}>
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
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos stratégies…"
                description="Récupération de vos stratégies Social media."
              />
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
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold w-[22%]">Nom</TableHead>
                      <TableHead className="font-semibold w-[22%]">Stratégies</TableHead>
                      <TableHead className="font-semibold w-[12%]">Montant HT</TableHead>
                      <TableHead className="font-semibold w-[14%]">Créé le</TableHead>
                      <TableHead className="font-semibold text-right w-[16%]">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {strategiesPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="min-w-0 truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell className="min-w-0">
                          <Badge variant="outline" className="font-normal whitespace-normal text-left">
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

        {activeSection === 'retroplanning' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CalendarDays className="h-5 w-5 text-[#E94C16]" />
              Rétroplanning
            </CardTitle>
            <CardDescription>
              Plannings enregistrés — ouvrez, modifiez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom…"
                  value={retroplanningSavesSearch}
                  onChange={(e) => setRetroplanningSavesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={STRATEGIE_RETROPLANNING_HREF}>Nouveau rétroplanning</Link>
              </Button>
            </div>

            {loadingRetroplanningSaves ? (
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos rétroplannings…"
                description="Récupération de vos plannings sauvegardés."
              />
            ) : retroplanningSavesError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {retroplanningSavesError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/retroplanning-saves.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredRetroplanningSaves.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {retroplanningSaves.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucun rétroplanning sauvegardé</p>
                    <p className="text-sm mt-1">
                      Composez un planning dans Rétroplanning puis « Sauvegarder ».
                    </p>
                  </>
                ) : (
                  <p>Aucun rétroplanning ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <>
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Opérations</TableHead>
                      <TableHead className="font-semibold">Modifié le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {retroplanningPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {row.operations_count} opération{row.operations_count > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatRetroplanningSaveDate(row.updated_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() =>
                                router.push(`${STRATEGIE_RETROPLANNING_HREF}?retro=${row.id}`)
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
                              onClick={() => setDeleteRetroplanningTarget(row)}
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
                page={retroplanningPagination.page}
                totalPages={retroplanningPagination.totalPages}
                onPageChange={setRetroplanningPage}
              />
              </>
            )}
          </CardContent>
        </Card>
        )}

        {activeSection === 'studioTarifs' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Palette className="h-5 w-5 text-[#E94C16]" />
              Studio
            </CardTitle>
            <CardDescription>
              Devis studio enregistrés — ouvrez, modifiez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de devis…"
                  value={studioTarifsSavesSearch}
                  onChange={(e) => setStudioTarifsSavesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={VENTE2_STUDIO_TARIFS_HREF}>Nouveau devis studio</Link>
              </Button>
            </div>

            {loadingStudioTarifsSaves ? (
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos devis studio…"
                description="Récupération de vos devis Studio."
              />
            ) : studioTarifsSavesError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {studioTarifsSavesError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/studio-tarifs-saves.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredStudioTarifsSaves.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {studioTarifsSaves.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucun devis studio enregistré</p>
                    <p className="text-sm mt-1">
                      Composez un devis dans Studio puis « Enregistrer ».
                    </p>
                  </>
                ) : (
                  <p>Aucun devis ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <>
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Prestations</TableHead>
                      <TableHead className="font-semibold">Total HT</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {studioTarifsPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {row.selected_count} prestation{row.selected_count > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell className="tabular-nums whitespace-nowrap">
                          {formatStudioEuro(Number(row.summary_total_ht))}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatStudioTarifsSaveDate(row.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() =>
                                router.push(`${VENTE2_STUDIO_TARIFS_HREF}?studio=${row.id}`)
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
                              onClick={() => setDeleteStudioTarifsTarget(row)}
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
                page={studioTarifsPagination.page}
                totalPages={studioTarifsPagination.totalPages}
                onPageChange={setStudioTarifsPage}
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
              Plan média
            </CardTitle>
            <CardDescription>
              Projets Plan média enregistrés — ouvrez, modifiez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom de projet…"
                  value={simulateurSavesSearch}
                  onChange={(e) => setSimulateurSavesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={STRATEGIE_SOCIAL_HREF}>Nouveau projet</Link>
              </Button>
            </div>

            {loadingSimulateurSaves ? (
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos projets Plan média…"
                description="Récupération de vos projets Plan média."
              />
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
                    <p className="font-medium text-foreground">Aucun projet Plan média enregistré</p>
                    <p className="text-sm mt-1">
                      Utilisez le Plan média puis « Enregistrer dans Mon espace ».
                    </p>
                  </>
                ) : (
                  <p>Aucun projet ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <>
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">PDF</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {simulateurPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell className="min-w-0 truncate text-sm">
                          {row.attachment_filename ? (
                            <Button
                              type="button"
                              variant="link"
                              className="h-auto p-0 text-[#E94C16]"
                              disabled={actionId === row.id}
                              onClick={() => void handleOpenSimulateurAttachment(row)}
                              title={row.attachment_filename}
                            >
                              <FileText className="h-3.5 w-3.5 mr-1 inline" />
                              <span className="truncate">{row.attachment_filename}</span>
                            </Button>
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatSimulateurMediaSaveDate(row.created_at)}
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
                <Link href={STRATEGIE_MOCKUP_HREF}>Nouveau mockup</Link>
              </Button>
            </div>

            {loadingMockupSaves ? (
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos mockups…"
                description="Récupération de vos prévisualisations sauvegardées."
              />
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
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Format</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockupPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell className="text-sm whitespace-nowrap">
                          {formatMockupFormatLabel(row.content)}
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatMockupSaveDate(row.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.id}
                              onClick={() => router.push(`${STRATEGIE_MOCKUP_HREF}?mockup=${row.id}`)}
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

        {activeSection === 'pige' && (
        <Card className="overflow-hidden border-border/80 shadow-sm">
          <CardHeader className="border-b bg-gradient-to-r from-[#E94C16]/[0.06] to-transparent">
            <CardTitle className="flex items-center gap-2 text-xl">
              <ScanSearch className="h-5 w-5 text-[#E94C16]" />
              Pige commerciale
            </CardTitle>
            <CardDescription>
              Captures d&apos;écran enregistrées depuis la pige — consultez ou supprimez.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-4">
            <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, fichier ou commentaire…"
                  value={pigeSavesSearch}
                  onChange={(e) => setPigeSavesSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button asChild className="bg-[#E94C16] hover:bg-[#d43f12] text-white shrink-0">
                <Link href={MON_ESPACE_PIGE_COMMERCIALE_HREF}>Nouvelle capture</Link>
              </Button>
            </div>

            {loadingPigeSaves ? (
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos captures…"
                description="Récupération de vos piges commerciales."
              />
            ) : pigeSavesError ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
                {pigeSavesError}
                <p className="mt-2 text-muted-foreground">
                  Si la table n&apos;existe pas encore, exécutez{' '}
                  <code className="text-xs">supabase/pige-commerciale-saves.sql</code> dans Supabase.
                </p>
              </div>
            ) : filteredPigeSaves.length === 0 ? (
              <div className="rounded-xl border border-dashed py-12 text-center text-muted-foreground">
                {pigeProjects.length === 0 ? (
                  <>
                    <p className="font-medium text-foreground">Aucune capture enregistrée</p>
                    <p className="text-sm mt-1">
                      Importez une ou plusieurs images depuis la page Pige commerciale pour les
                      retrouver ici.
                    </p>
                  </>
                ) : (
                  <p>Aucune capture ne correspond à votre recherche.</p>
                )}
              </div>
            ) : (
              <>
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Commentaire</TableHead>
                      <TableHead className="font-semibold">Fichiers</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pigePagination.items.map((row) => (
                      <TableRow key={row.project_id}>
                        <TableCell className="font-medium min-w-0 truncate" title={row.name}>
                          {row.name}
                        </TableCell>
                        <TableCell className="min-w-0 truncate text-sm text-muted-foreground" title={row.comment ?? undefined}>
                          {row.comment || '—'}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-normal">
                            {row.file_count} image{row.file_count > 1 ? 's' : ''}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground whitespace-nowrap">
                          {formatPigeCommercialeSaveDate(row.created_at)}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-1">
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              disabled={actionId === row.project_id}
                              onClick={() =>
                                router.push(`${MON_ESPACE_PIGE_COMMERCIALE_HREF}?project=${row.project_id}`)
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
                              disabled={actionId === row.project_id}
                              onClick={() => setDeletePigeTarget(row)}
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
                page={pigePagination.page}
                totalPages={pigePagination.totalPages}
                onPageChange={setPigePage}
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
              <SavedRecordLoadingBanner
                className="my-10"
                label="Chargement de vos devis…"
                description="Récupération de vos devis SMS / RCS."
              />
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
              <div className="rounded-xl border border-border/70">
                <Table className="table-fixed w-full">
                  <TableHeader>
                    <TableRow className="bg-muted/30 hover:bg-muted/30">
                      <TableHead className="font-semibold">Nom</TableHead>
                      <TableHead className="font-semibold">Type</TableHead>
                      <TableHead className="font-semibold">Montant HT</TableHead>
                      <TableHead className="font-semibold">Créé le</TableHead>
                      <TableHead className="font-semibold text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {devisPagination.items.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell className="font-medium min-w-0 truncate" title={row.name}>
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
            <AlertDialogTitle>Supprimer ce projet Plan média ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteSimulateurTarget?.name} » sera définitivement supprimé de Mon espace. Cette
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
        open={!!deleteStudioTarifsTarget}
        onOpenChange={(open) => !open && setDeleteStudioTarifsTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce devis studio ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteStudioTarifsTarget?.name} » sera définitivement supprimé de Mon espace. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteStudioTarifs()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog
        open={!!deleteRetroplanningTarget}
        onOpenChange={(open) => !open && setDeleteRetroplanningTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce rétroplanning ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deleteRetroplanningTarget?.name} » sera définitivement supprimé de Mon espace. Cette
              action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeleteRetroplanning()}
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

      <AlertDialog
        open={!!deletePigeTarget}
        onOpenChange={(open) => !open && setDeletePigeTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer ce projet ?</AlertDialogTitle>
            <AlertDialogDescription>
              « {deletePigeTarget?.name} » et ses {deletePigeTarget?.file_count ?? 0} image
              {(deletePigeTarget?.file_count ?? 0) > 1 ? 's' : ''} seront définitivement supprimés de Mon
              espace. Cette action est irréversible.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => void handleDeletePige()}
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
