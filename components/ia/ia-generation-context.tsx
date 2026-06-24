'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useRouter } from 'next/navigation'
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

export type IaPendingLeave =
  | { kind: 'href'; href: string }
  | { kind: 'callback'; run: () => void }
  | { kind: 'back' }

type IaGenerationContextValue = {
  isGenerating: boolean
  setIsGenerating: (value: boolean) => void
  requestLeave: (pending: IaPendingLeave) => void
  registerAbort: (abort: (() => void) | null) => void
}

const IaGenerationContext = createContext<IaGenerationContextValue | null>(null)

function shouldInterceptLink(anchor: HTMLAnchorElement): string | null {
  const href = anchor.getAttribute('href')
  if (!href || href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:'))
    return null
  if (anchor.target === '_blank' || anchor.hasAttribute('download')) return null
  if (href.startsWith('/api/')) return null

  try {
    const url = new URL(href, window.location.origin)
    if (url.origin !== window.location.origin) return null
    if (url.pathname === window.location.pathname && url.search === window.location.search)
      return null
    return `${url.pathname}${url.search}${url.hash}`
  } catch {
    return null
  }
}

export function IaGenerationProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [pendingLeave, setPendingLeave] = useState<IaPendingLeave | null>(null)
  const abortRef = useRef<(() => void) | null>(null)
  const isGeneratingRef = useRef(isGenerating)

  useEffect(() => {
    isGeneratingRef.current = isGenerating
  }, [isGenerating])

  const registerAbort = useCallback((abort: (() => void) | null) => {
    abortRef.current = abort
  }, [])

  const stopGeneration = useCallback(() => {
    abortRef.current?.()
    abortRef.current = null
    setIsGenerating(false)
  }, [])

  const executeLeave = useCallback(
    (pending: IaPendingLeave) => {
      stopGeneration()
      setDialogOpen(false)
      setPendingLeave(null)

      if (pending.kind === 'href') {
        router.push(pending.href)
      } else if (pending.kind === 'callback') {
        pending.run()
      } else if (pending.kind === 'back') {
        window.history.back()
      }
    },
    [router, stopGeneration],
  )

  const requestLeave = useCallback(
    (pending: IaPendingLeave) => {
      if (!isGeneratingRef.current) {
        if (pending.kind === 'href') {
          router.push(pending.href)
        } else if (pending.kind === 'callback') {
          pending.run()
        } else if (pending.kind === 'back') {
          window.history.back()
        }
        return
      }
      setPendingLeave(pending)
      setDialogOpen(true)
    },
    [router],
  )

  useEffect(() => {
    if (!isGenerating) return

    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault()
      event.returnValue = ''
    }

    const onClickCapture = (event: MouseEvent) => {
      if (!isGeneratingRef.current) return
      if (event.defaultPrevented) return
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return

      const anchor = (event.target as Element | null)?.closest('a')
      if (!anchor) return

      const href = shouldInterceptLink(anchor)
      if (!href) return

      event.preventDefault()
      event.stopPropagation()
      requestLeave({ kind: 'href', href })
    }

    window.addEventListener('beforeunload', onBeforeUnload)
    document.addEventListener('click', onClickCapture, true)

    return () => {
      window.removeEventListener('beforeunload', onBeforeUnload)
      document.removeEventListener('click', onClickCapture, true)
    }
  }, [isGenerating, requestLeave])

  useEffect(() => {
    if (!isGenerating) return

    const stateMarker = { iaGuard: true }
    window.history.pushState(stateMarker, '', window.location.href)

    const onPopState = () => {
      if (!isGeneratingRef.current) return
      window.history.pushState(stateMarker, '', window.location.href)
      setPendingLeave({ kind: 'back' })
      setDialogOpen(true)
    }

    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [isGenerating])

  const value = useMemo(
    () => ({
      isGenerating,
      setIsGenerating,
      requestLeave,
      registerAbort,
    }),
    [isGenerating, requestLeave, registerAbort],
  )

  return (
    <IaGenerationContext.Provider value={value}>
      {children}
      <AlertDialog
        open={dialogOpen}
        onOpenChange={(open) => {
          if (!open) {
            setDialogOpen(false)
            setPendingLeave(null)
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Quitter pendant la génération ?</AlertDialogTitle>
            <AlertDialogDescription>
              Une analyse IA est en cours. Si vous quittez cette page, la génération sera interrompue
              et le résultat ne sera pas enregistré.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Rester sur la page</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (pendingLeave) executeLeave(pendingLeave)
              }}
            >
              Quitter quand même
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </IaGenerationContext.Provider>
  )
}

export function useIaGeneration() {
  const context = useContext(IaGenerationContext)
  if (!context) {
    throw new Error('useIaGeneration must be used within IaGenerationProvider')
  }
  return context
}
