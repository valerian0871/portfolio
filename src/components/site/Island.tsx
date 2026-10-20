import { useEffect, useMemo, useRef, useState, type KeyboardEvent, type ReactNode } from 'react'
import { AnimatePresence, motion, useScroll } from 'motion/react'
import { useSite } from '../../lib/SiteContext'
import { easeOutStrong, springIsland } from '../../lib/motion'
import {
  SECTION_IDS,
  SECTION_LABELS,
  contactItems,
  filterItems,
  findProject,
  isMac,
  practiceTabs,
  sectionItems,
  type PaletteItem,
  type SectionId,
} from '../../lib/site'
import { useIsDesktop } from '../../hooks/useMediaQuery'
import { Segmented } from './Segmented'
import { TopBar } from './TopBar'

type View = 'status' | 'nav' | 'practice' | 'contact' | 'palette' | 'case' | 'back' | 'footer'

const ROW = 40
const INPUT_ROW = 52

/** Height of a list island: input row, hairline, rows, bottom padding */
const listHeight = (rows: number) => INPUT_ROW + 1 + Math.max(rows, 1) * ROW + 12

interface Placement {
  className: string
  width: string | number
  height: number
  radius: number
}

const navItems = SECTION_IDS.map((id) => ({ id, label: SECTION_LABELS[id] }))
const tabItems = practiceTabs.map((tab) => ({ id: tab.id, label: tab.label }))

interface IslandProps {
  wordmarkVisible: boolean
}

export function Island({ wordmarkVisible }: IslandProps) {
  const site = useSite()
  const isDesktop = useIsDesktop()
  const [query, setQuery] = useState('')

  const view: View = (() => {
    if (site.palette.open) return 'palette'
    if (site.caseSlug) return 'case'
    if (site.route !== '/') return 'back'
    if (site.footerInView) return 'footer'
    if (!site.activeSection) return 'status'
    if (!isDesktop) return 'nav'
    if (site.activeSection === 'services') return 'practice'
    if (site.activeSection === 'contact') return 'contact'
    return 'nav'
  })()

  useEffect(() => {
    if (!site.palette.open) setQuery('')
  }, [site.palette.open])

  const paletteItems = useMemo(
    () => filterItems([...contactItems, ...sectionItems], query),
    [query],
  )

  const placement: Placement = (() => {
    switch (view) {
      case 'status':
        return {
          className: 'self-start mt-5',
          width: 176,
          height: 36,
          radius: 18,
        }
      case 'footer':
        return {
          // On phones the giant footer wordmark owns the bottom edge
          className: isDesktop ? 'self-start mt-auto mb-5' : 'self-start mt-auto mb-5 invisible',
          width: 176,
          height: 36,
          radius: 18,
        }
      case 'nav':
        return isDesktop
          ? { className: 'self-center mt-4', width: 360, height: 44, radius: 22 }
          : { className: 'self-center mt-auto mb-4', width: 'calc(100% - 32px)', height: 44, radius: 22 }
      case 'practice':
        return { className: 'self-center mt-auto mb-5', width: 420, height: 44, radius: 22 }
      case 'contact':
        return {
          className: 'self-center mt-auto mb-5',
          width: 'min(440px, calc(100% - 32px))',
          height: listHeight(contactItems.length),
          radius: 24,
        }
      case 'palette':
        return {
          className: 'self-center mt-auto mb-5',
          width: 'min(480px, calc(100% - 32px))',
          height: listHeight(paletteItems.length),
          radius: 24,
        }
      case 'case':
        return { className: 'self-center mt-4', width: 'min(420px, calc(100% - 32px))', height: 44, radius: 22 }
      case 'back':
        return { className: 'self-center mt-4', width: 148, height: 40, radius: 20 }
    }
  })()

  const instant = site.palette.instant
  const islandTransition = instant
    ? { duration: 0 }
    : { layout: springIsland, borderRadius: { duration: 0.28, ease: easeOutStrong } }

  // Status pills sit beside the wordmark; everything else is centred
  const statusOffset =
    view === 'status' ? 'island-beside-wordmark' : view === 'footer' ? 'island-at-gutter' : ''

  return (
    <>
      <header className="pointer-events-none fixed inset-0 z-50 flex flex-col" data-morph-overlay>
        <TopBar visible={site.route !== '/' || !site.caseSlug} wordmarkVisible={wordmarkVisible} />
        <motion.div
          layout
          className={`on-ink pointer-events-auto relative overflow-hidden ${placement.className} ${statusOffset}`}
          style={{ width: placement.width, height: placement.height }}
          initial={false}
          animate={{ borderRadius: placement.radius }}
          transition={islandTransition}
          data-view={view}
        >
          <AnimatePresence initial={false}>
            <motion.div
              key={view === 'palette' || view === 'contact' ? 'list' : view}
              className="absolute inset-0"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: instant ? { duration: 0 } : { duration: 0.22, ease: easeOutStrong } }}
              exit={{ opacity: 0, transition: instant ? { duration: 0 } : { duration: 0.14, ease: 'easeOut' } }}
            >
              {view === 'status' || view === 'footer' ? <StatusContent /> : null}
              {view === 'nav' ? (
                <Segmented<SectionId>
                  mode="nav"
                  label="Sections"
                  idPrefix="island-nav"
                  items={navItems}
                  active={site.activeSection}
                  onSelect={(id) => site.scrollToSection(id)}
                />
              ) : null}
              {view === 'practice' ? (
                <Segmented
                  mode="tabs"
                  label="Services"
                  idPrefix="island-practice"
                  panelId="services-panel"
                  items={tabItems}
                  active={site.practice}
                  onSelect={site.setPractice}
                />
              ) : null}
              {view === 'contact' || view === 'palette' ? (
                <ListContent
                  mode={view}
                  query={query}
                  setQuery={setQuery}
                  items={view === 'palette' ? paletteItems : contactItems}
                />
              ) : null}
              {view === 'case' ? <CaseContent /> : null}
              {view === 'back' ? <BackContent /> : null}
            </motion.div>
          </AnimatePresence>
        </motion.div>
      </header>
      <Toast />
    </>
  )
}

function StatusContent() {
  return (
    <div className="flex h-full items-center justify-center gap-2 whitespace-nowrap text-[13px] font-medium">
      <span className="status-dot h-1.5 w-1.5 rounded-full bg-accent" aria-hidden="true" />
      Available for work
    </div>
  )
}

function BackContent() {
  const site = useSite()
  return (
    <button
      type="button"
      onClick={() => site.navigate('/')}
      className="flex h-full w-full items-center justify-center gap-2 text-[13px] font-medium"
    >
      <span aria-hidden="true">←</span> Back to home
    </button>
  )
}

function CaseContent() {
  const site = useSite()
  const project = site.caseSlug ? findProject(site.caseSlug) : undefined
  const { scrollYProgress } = useScroll()
  return (
    <div className="relative flex h-full items-center justify-between gap-3 px-4">
      <span className="truncate text-[13px] font-medium">{project?.title}</span>
      <button
        type="button"
        onClick={site.closeCase}
        className="shrink-0 rounded-full px-1 text-[13px] text-inverse-muted transition-colors duration-150 hover:text-inverse-text"
      >
        Close
      </button>
      <span className="absolute inset-x-4 bottom-[7px] h-[2px] overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--color-inverse-text)_20%,transparent)]">
        <motion.span
          aria-hidden="true"
          className="block h-full origin-left rounded-full bg-inverse-text"
          style={{ scaleX: scrollYProgress }}
        />
      </span>
    </div>
  )
}

interface ListContentProps {
  mode: 'contact' | 'palette'
  query: string
  setQuery: (query: string) => void
  items: PaletteItem[]
}

/** Contact preview (bottom island in the Contact section) and the command palette */
function ListContent({ mode, query, setQuery, items }: ListContentProps) {
  const site = useSite()
  const containerRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [highlight, setHighlight] = useState(0)
  const isPalette = mode === 'palette'


  useEffect(() => {
    if (isPalette) inputRef.current?.focus({ preventScroll: true })
  }, [isPalette])

  // Click outside closes the palette (focus is not pulled back to the page)
  useEffect(() => {
    if (!isPalette) return
    const onPointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.closest('.on-ink')?.contains(event.target as Node)) {
        site.closePalette({ restoreFocus: false })
      }
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [isPalette, site])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!isPalette) return
    if (event.key === 'Escape') {
      event.preventDefault()
      event.stopPropagation()
      site.closePalette({ viaKeyboard: true })
      return
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      const delta = event.key === 'ArrowDown' ? 1 : -1
      setHighlight((h) => (items.length ? (h + delta + items.length) % items.length : 0))
      return
    }
    if (event.key === 'Enter' && event.target === inputRef.current) {
      event.preventDefault()
      const item = items[highlight]
      if (item) site.runItem(item)
      return
    }
    // Focus trap: the input is the only tab stop (options use aria-activedescendant)
    if (event.key === 'Tab') {
      event.preventDefault()
      inputRef.current?.focus()
    }
  }

  const kbd = isMac ? '⌘K' : 'Ctrl K'
  const activeId = items[highlight] ? `palette-item-${items[highlight].id}` : undefined

  return (
    <div
      ref={containerRef}
      role={isPalette ? 'dialog' : undefined}
      aria-modal={isPalette ? true : undefined}
      aria-label={isPalette ? 'Command palette' : 'Contact'}
      onKeyDown={onKeyDown}
      className="flex h-full flex-col"
    >
      <div className="flex shrink-0 items-center gap-3 px-[18px]" style={{ height: INPUT_ROW }}>
        {isPalette ? (
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => {
              setQuery(e.target.value)
              setHighlight(0)
            }}
            placeholder="Type to filter"
            aria-label="Filter sections and contact options"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-list"
            aria-activedescendant={activeId}
            autoComplete="off"
            spellCheck={false}
            className="h-full min-w-0 flex-1 bg-transparent text-[14px] text-inverse-text placeholder:text-inverse-muted focus:outline-none"
          />
        ) : (
          <button
            type="button"
            onClick={() => site.openPalette()}
            className="flex h-full min-w-0 flex-1 items-center text-left text-[14px] text-inverse-muted"
          >
            Type to filter
          </button>
        )}
        <kbd className="shrink-0 font-mono text-[11px] text-inverse-muted">{kbd}</kbd>
      </div>
      <div className="mx-[6px] h-px shrink-0 bg-[color-mix(in_srgb,var(--color-inverse-text)_12%,transparent)]" />
      <ul
        id="palette-list"
        role={isPalette ? 'listbox' : undefined}
        aria-label={isPalette ? 'Results' : undefined}
        className="flex flex-col p-[6px]"
      >
        {items.length === 0 ? (
          <li className="flex items-center px-3 text-[14px] text-inverse-muted" style={{ height: ROW }}>
            Nothing matches “{query}”
          </li>
        ) : (
          items.map((item, index) => (
            <PaletteRow
              key={item.id}
              item={item}
              isPalette={isPalette}
              highlighted={isPalette && index === highlight}
              onHover={() => isPalette && setHighlight(index)}
            />
          ))
        )}
      </ul>
    </div>
  )
}

function PaletteRow({
  item,
  isPalette,
  highlighted,
  onHover,
}: {
  item: PaletteItem
  isPalette: boolean
  highlighted: boolean
  onHover: () => void
}) {
  const site = useSite()
  const content: ReactNode = (
    <>
      <span>{item.label}</span>
      <span className="truncate pl-4 font-mono text-[11px] text-inverse-muted">{item.hint}</span>
    </>
  )
  const rowClass = 'palette-row flex w-full items-center justify-between rounded-2xl px-3 text-left text-[14px]'

  // Palette: the option itself is the target (focus stays in the input via aria-activedescendant)
  if (isPalette) {
    return (
      <li
        id={`palette-item-${item.id}`}
        role="option"
        aria-selected={highlighted}
        onClick={() => site.runItem(item)}
        onPointerMove={onHover}
        className={rowClass}
        data-highlighted={highlighted || undefined}
        style={{ height: ROW }}
      >
        {content}
      </li>
    )
  }

  return (
    <li>
      <button type="button" onClick={() => site.runItem(item)} className={rowClass} style={{ height: ROW }}>
        {content}
      </button>
    </li>
  )
}

/** "Email copied" pill, plus a polite live region for screen readers */
function Toast() {
  const { toast } = useSite()
  return (
    <>
      <div role="status" aria-live="polite" className="sr-only">
        {toast?.message ?? ''}
      </div>
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            aria-hidden="true"
            className="on-ink pointer-events-none fixed left-1/2 top-4 z-[60] flex h-9 -translate-x-1/2 items-center whitespace-nowrap rounded-full px-4 text-[13px] font-medium"
            initial={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.3, ease: easeOutStrong } }}
            exit={{ opacity: 0, y: -4, filter: 'blur(4px)', transition: { duration: 0.2, ease: 'easeOut' } }}
          >
            {toast.message}
          </motion.div>
        ) : null}
      </AnimatePresence>
    </>
  )
}
