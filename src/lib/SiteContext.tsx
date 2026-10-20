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
import { content, type DisciplineId } from '../data/content'
import { useActiveSection } from '../hooks/useActiveSection'
import { getLenis } from '../hooks/useLenis'
import { SECTION_IDS, findProject, type PaletteItem, type SectionId } from './site'

interface PaletteState {
  open: boolean
  instant: boolean
}

interface SiteContextValue {
  route: string
  navigate: (pathOrHash: string) => void
  activeSection: SectionId | null
  footerInView: boolean
  setFooterInView: (inView: boolean) => void
  scrollToSection: (id: SectionId | 'top') => void

  palette: PaletteState
  openPalette: (opts?: { viaKeyboard?: boolean }) => void
  closePalette: (opts?: { restoreFocus?: boolean; viaKeyboard?: boolean }) => void

  caseSlug: string | null
  openCase: (slug: string) => void
  closeCase: () => void

  practice: DisciplineId
  setPractice: (id: DisciplineId) => void

  toast: { id: number; message: string } | null
  copyEmail: () => void
  runItem: (item: PaletteItem) => void
}

const SiteContext = createContext<SiteContextValue | null>(null)

export function useSite() {
  const value = useContext(SiteContext)
  if (!value) throw new Error('useSite must be used inside <SiteProvider>')
  return value
}

const sectionIds = [...SECTION_IDS]

function readCaseFromHash(): string | null {
  const match = window.location.hash.match(/^#work\/([\w-]+)$/)
  return match && findProject(match[1]) ? match[1] : null
}

interface SiteProviderProps {
  route: string
  navigate: (pathOrHash: string) => void
  children: ReactNode
}

export function SiteProvider({ route, navigate, children }: SiteProviderProps) {
  const [caseSlug, setCaseSlug] = useState<string | null>(() =>
    typeof window === 'undefined' ? null : readCaseFromHash(),
  )
  const { activeSection, scrollToSection: scrollToId } = useActiveSection(
    sectionIds,
    caseSlug ? '/case' : route,
  )
  const [footerInView, setFooterInView] = useState(false)
  const [palette, setPalette] = useState<PaletteState>({ open: false, instant: false })
  const [practice, setPractice] = useState<DisciplineId>('frontend')
  const [toast, setToast] = useState<SiteContextValue['toast']>(null)

  const paletteOpenerRef = useRef<HTMLElement | null>(null)
  const caseOpenerRef = useRef<{ slug: string; scrollY: number } | null>(null)
  const toastTimer = useRef<number | null>(null)

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
    setToast({ id: Date.now(), message })
    toastTimer.current = window.setTimeout(() => setToast(null), 1800)
  }, [])

  const scrollToSection = useCallback(
    (id: SectionId | 'top') => {
      if (route !== '/') {
        navigate(id === 'top' ? '/' : `#${id}`)
        return
      }
      if (id === 'top') {
        const lenis = getLenis()
        if (lenis) lenis.scrollTo(0)
        else window.scrollTo({ top: 0, behavior: 'smooth' })
        window.history.replaceState(null, '', window.location.pathname)
        return
      }
      scrollToId(id)
    },
    [route, navigate, scrollToId],
  )

  const openPalette = useCallback((opts?: { viaKeyboard?: boolean }) => {
    setPalette((current) => {
      if (current.open) return current
      paletteOpenerRef.current = document.activeElement as HTMLElement | null
      return { open: true, instant: Boolean(opts?.viaKeyboard) }
    })
  }, [])

  const closePalette = useCallback((opts?: { restoreFocus?: boolean; viaKeyboard?: boolean }) => {
    setPalette({ open: false, instant: Boolean(opts?.viaKeyboard) })
    if (opts?.viaKeyboard) {
      window.setTimeout(() => setPalette((p) => (p.open ? p : { open: false, instant: false })), 60)
    }
    if (opts?.restoreFocus !== false) {
      const opener = paletteOpenerRef.current
      requestAnimationFrame(() => {
        if (opener && opener.isConnected && opener !== document.body) opener.focus({ preventScroll: true })
      })
    }
    paletteOpenerRef.current = null
  }, [])

  const copyEmail = useCallback(async () => {
    const email = content.contact.email
    try {
      await navigator.clipboard.writeText(email)
      showToast('Email copied')
    } catch {
      showToast('Couldn’t copy. Opening your mail app')
      window.location.href = `mailto:${email}`
    }
  }, [showToast])

  const openCase = useCallback((slug: string) => {
    caseOpenerRef.current = { slug, scrollY: caseOpenerRef.current?.scrollY ?? window.scrollY }
    setCaseSlug(slug)
    window.history.pushState({ case: slug }, '', `${window.location.pathname}#work/${slug}`)
    getLenis()?.scrollTo(0, { immediate: true })
    window.scrollTo(0, 0)
  }, [])

  const closeCase = useCallback(() => {
    const opener = caseOpenerRef.current
    setCaseSlug(null)
    if (window.location.hash.startsWith('#work/')) {
      const path = window.location.pathname
      window.history.pushState(null, '', path === '/' ? '/#work' : path)
    }
    requestAnimationFrame(() => {
      const y = opener?.scrollY ?? document.getElementById('work')?.offsetTop ?? 0
      const lenis = getLenis()
      if (lenis) lenis.scrollTo(y, { immediate: true, force: true })
      window.scrollTo(0, y)
      const slug = opener?.slug
      const row = slug ? document.querySelector<HTMLElement>(`[data-row="${slug}"]`) : null
      row?.focus({ preventScroll: true })
    })
    caseOpenerRef.current = null
  }, [])

  const runItem = useCallback(
    (item: PaletteItem) => {
      const { action } = item
      if (action.kind === 'copy') {
        copyEmail()
        return
      }
      if (action.kind === 'open') {
        window.open(action.href, '_blank', 'noopener,noreferrer')
        return
      }
      closePalette({ restoreFocus: false })
      if (caseSlug) setCaseSlug(null)
      requestAnimationFrame(() => scrollToSection(action.id))
    },
    [copyEmail, closePalette, scrollToSection, caseSlug],
  )

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && palette.open) {
        event.preventDefault()
        closePalette({ viaKeyboard: true })
        return
      }
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault()
        if (palette.open) closePalette({ viaKeyboard: true })
        else openPalette({ viaKeyboard: true })
      }
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [palette.open, openPalette, closePalette])

  useEffect(() => {
    const onPopState = () => setCaseSlug(readCaseFromHash())
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [])

  useEffect(() => {
    if (route !== '/' && route !== '/work' && caseSlug) setCaseSlug(null)
  }, [route, caseSlug])

  useEffect(() => () => {
    if (toastTimer.current) window.clearTimeout(toastTimer.current)
  }, [])

  const value = useMemo<SiteContextValue>(
    () => ({
      route,
      navigate,
      activeSection: (sectionIds as string[]).includes(activeSection ?? '')
        ? (activeSection as SectionId)
        : null,
      footerInView,
      setFooterInView,
      scrollToSection,
      palette,
      openPalette,
      closePalette,
      caseSlug,
      openCase,
      closeCase,
      practice,
      setPractice,
      toast,
      copyEmail,
      runItem,
    }),
    [
      route, navigate, activeSection, footerInView, scrollToSection, palette, openPalette,
      closePalette, caseSlug, openCase, closeCase, practice, toast, copyEmail, runItem,
    ],
  )

  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}
