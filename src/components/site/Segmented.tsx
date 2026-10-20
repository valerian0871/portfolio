import { useLayoutEffect, useRef, useState, type KeyboardEvent } from 'react'
import { motion } from 'motion/react'
import { springIndicator } from '../../lib/motion'

interface SegmentedItem<T extends string> {
  id: T
  label: string
}

interface SegmentedProps<T extends string> {
  items: SegmentedItem<T>[]
  active: T | null
  onSelect: (id: T) => void
  /**
   * `tabs`: a real tablist controlling `panelId` (arrow keys, roving tabindex).
   * `nav`: section navigation buttons with aria-current.
   */
  mode: 'tabs' | 'nav'
  label: string
  panelId?: string
  idPrefix: string
  /** Tighter padding for long label sets (five filters on a phone) */
  compact?: boolean
}

/** Pill row with a sliding indicator. Used in the island and inline on mobile. */
export function Segmented<T extends string>({
  items,
  active,
  onSelect,
  mode,
  label,
  panelId,
  idPrefix,
  compact = false,
}: SegmentedProps<T>) {
  const listRef = useRef<HTMLDivElement>(null)
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null)

  useLayoutEffect(() => {
    const list = listRef.current
    if (!list) return
    const measure = () => {
      const button = list.querySelector<HTMLElement>(`[data-id="${active}"]`)
      setIndicator(button ? { x: button.offsetLeft, width: button.offsetWidth } : null)
    }
    measure()
    const observer = new ResizeObserver(measure)
    observer.observe(list)
    return () => observer.disconnect()
  }, [active, items])

  const onKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (mode !== 'tabs') return
    const index = items.findIndex((item) => item.id === active)
    let next = -1
    if (event.key === 'ArrowRight') next = (index + 1) % items.length
    else if (event.key === 'ArrowLeft') next = (index - 1 + items.length) % items.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = items.length - 1
    if (next < 0) return
    event.preventDefault()
    onSelect(items[next].id)
    listRef.current?.querySelector<HTMLElement>(`[data-id="${items[next].id}"]`)?.focus()
  }

  return (
    <div
      ref={listRef}
      role={mode === 'tabs' ? 'tablist' : undefined}
      aria-label={label}
      onKeyDown={onKeyDown}
      className="relative flex h-full w-full items-center p-1"
    >
      {indicator && (
        <motion.span
          aria-hidden="true"
          className="absolute bottom-1 left-0 top-1 rounded-full bg-[var(--seg-indicator)]"
          initial={false}
          animate={{ x: indicator.x, width: indicator.width, opacity: 1 }}
          transition={springIndicator}
        />
      )}
      {items.map((item) => {
        const selected = item.id === active
        return (
          <button
            key={item.id}
            type="button"
            data-id={item.id}
            id={`${idPrefix}-${item.id}`}
            role={mode === 'tabs' ? 'tab' : undefined}
            aria-selected={mode === 'tabs' ? selected : undefined}
            aria-controls={mode === 'tabs' ? panelId : undefined}
            aria-current={mode === 'nav' && selected ? 'true' : undefined}
            tabIndex={mode === 'tabs' && !selected ? -1 : 0}
            onClick={() => onSelect(item.id)}
            className={`seg-button relative z-10 h-full whitespace-nowrap rounded-full font-medium ${compact ? 'seg-compact flex-auto px-2.5' : 'flex-1 px-3 text-[13px]'}`}
            data-selected={selected || undefined}
          >
            {item.label}
          </button>
        )
      })}
    </div>
  )
}
