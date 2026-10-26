import { useRef, useState, type KeyboardEvent } from 'react'
import { motion, useMotionValue, animate } from 'motion/react'
import { springUI } from '../../lib/motion'

const COLS = 6
const ROWS = 8

interface Block {
  id: string
  label: string
  col: number
  row: number
  w: number
  h: number
}

// Painted bottom to top: the image sits under the type and the logo.
const START: Block[] = [
  { id: 'image', label: 'Image', col: 1, row: 3, w: 5, h: 4 },
  { id: 'headline', label: 'Headline', col: 0, row: 0, w: 4, h: 2 },
  { id: 'logo', label: 'Logo', col: 4, row: 7, w: 2, h: 1 },
]

// A 4:5 post on a six-column grid. Blocks snap to the nearest module when
// released and guides light up while you drag: the discipline behind the
// social systems in Work.
export function GridDemo() {
  const frameRef = useRef<HTMLDivElement>(null)
  const [blocks, setBlocks] = useState(START)
  const [active, setActive] = useState<string | null>(null)
  const activeBlock = blocks.find((b) => b.id === active)

  const move = (id: string, col: number, row: number) =>
    setBlocks((all) =>
      all.map((b) =>
        b.id === id
          ? { ...b, col: Math.min(Math.max(col, 0), COLS - b.w), row: Math.min(Math.max(row, 0), ROWS - b.h) }
          : b,
      ),
    )

  return (
    <div>
      <div className="flex items-start gap-4 sm:gap-6">
        <div
          ref={frameRef}
          className="demo-poster relative aspect-[4/5] w-[min(100%,300px)] shrink-0 overflow-hidden rounded-[10px] border border-line bg-bg"
        >
          <GridLines highlight={activeBlock} />
          {blocks.map((block) => (
            <GridBlock
              key={block.id}
              block={block}
              frameRef={frameRef}
              onActive={setActive}
              onDrop={move}
            />
          ))}
        </div>
        <ul className="hidden flex-1 font-mono text-[11px] tabular-nums text-muted sm:block">
          {blocks.map((b) => (
            <li key={b.id} className="flex justify-between border-t border-line py-2">
              <span className={active === b.id ? 'text-text' : ''}>{b.label}</span>
              <span>
                col {b.col + 1} · row {b.row + 1}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-3 flex items-baseline justify-between gap-4 font-mono text-[11px] text-muted">
        <span>Drag a block, or focus it and use the arrow keys</span>
        <button type="button" className="demo-text-btn shrink-0 text-text" onClick={() => setBlocks(START)}>
          Reset
        </button>
      </div>
    </div>
  )
}

function GridLines({ highlight }: { highlight?: Block }) {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      {Array.from({ length: COLS - 1 }, (_, i) => {
        const at = i + 1
        const lit = highlight && (at === highlight.col || at === highlight.col + highlight.w)
        return (
          <span
            key={`c${i}`}
            className={`demo-guide absolute inset-y-0 w-px ${lit ? 'is-lit' : ''}`}
            style={{ left: `${(at / COLS) * 100}%` }}
          />
        )
      })}
      {Array.from({ length: ROWS - 1 }, (_, i) => {
        const at = i + 1
        const lit = highlight && (at === highlight.row || at === highlight.row + highlight.h)
        return (
          <span
            key={`r${i}`}
            className={`demo-guide absolute inset-x-0 h-px ${lit ? 'is-lit' : ''}`}
            style={{ top: `${(at / ROWS) * 100}%` }}
          />
        )
      })}
    </div>
  )
}

interface GridBlockProps {
  block: Block
  frameRef: React.RefObject<HTMLDivElement | null>
  onActive: (id: string | null) => void
  onDrop: (id: string, col: number, row: number) => void
}

function GridBlock({ block, frameRef, onActive, onDrop }: GridBlockProps) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  // Moves the block to a new module, then animates the visual offset from
  // where it was (released by hand, or one step away by keyboard) to zero.
  const settle = (dCol: number, dRow: number, fromX: number, fromY: number) => {
    const rect = frameRef.current?.getBoundingClientRect()
    if (!rect) return
    const colW = rect.width / COLS
    const rowH = rect.height / ROWS
    const col = Math.min(Math.max(block.col + dCol, 0), COLS - block.w)
    const row = Math.min(Math.max(block.row + dRow, 0), ROWS - block.h)
    x.set(fromX - (col - block.col) * colW)
    y.set(fromY - (row - block.row) * rowH)
    onDrop(block.id, col, row)
    animate(x, 0, springUI)
    animate(y, 0, springUI)
  }

  const onDragEnd = () => {
    const rect = frameRef.current?.getBoundingClientRect()
    onActive(null)
    if (!rect) return
    settle(
      Math.round(x.get() / (rect.width / COLS)),
      Math.round(y.get() / (rect.height / ROWS)),
      x.get(),
      y.get(),
    )
  }

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const delta: Record<string, [number, number]> = {
      ArrowLeft: [-1, 0],
      ArrowRight: [1, 0],
      ArrowUp: [0, -1],
      ArrowDown: [0, 1],
    }
    const d = delta[e.key]
    if (!d) return
    e.preventDefault()
    settle(d[0], d[1], 0, 0)
  }

  return (
    <motion.button
      type="button"
      drag
      dragMomentum={false}
      dragConstraints={frameRef}
      dragElastic={0.08}
      onDragStart={() => onActive(block.id)}
      onDragEnd={onDragEnd}
      onFocus={() => onActive(block.id)}
      onBlur={() => onActive(null)}
      onKeyDown={onKeyDown}
      whileDrag={{ scale: 1.03, zIndex: 5 }}
      aria-label={`${block.label}, column ${block.col + 1}, row ${block.row + 1}. Arrow keys move it.`}
      className={`demo-block demo-block-${block.id} absolute touch-none p-[4%] text-left`}
      style={{
        x,
        y,
        left: `${(block.col / COLS) * 100}%`,
        top: `${(block.row / ROWS) * 100}%`,
        width: `${(block.w / COLS) * 100}%`,
        height: `${(block.h / ROWS) * 100}%`,
      }}
      data-cursor
    >
      {block.id === 'headline' && (
        <span className="demo-headline block font-heading">Our communities need clean water</span>
      )}
      {block.id === 'logo' && <span className="block aspect-square w-[34%] rounded-full bg-text" />}
    </motion.button>
  )
}
