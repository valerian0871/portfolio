import { useRef, useState, type KeyboardEvent, type PointerEvent } from 'react'
import { motion } from 'motion/react'
import { springUI } from '../../lib/motion'

const MIN = 280
const MAX = 1280

// A layout you can squeeze. The frame reflows through three breakpoints with
// container queries, which is how the production sites in Work are built.
export function ResizeDemo() {
  const trackRef = useRef<HTMLDivElement>(null)
  const [ratio, setRatio] = useState(0.72)
  const [dragging, setDragging] = useState(false)
  const width = Math.round(MIN + (MAX - MIN) * ratio)
  const layout = width < 560 ? 'Phone' : width < 900 ? 'Tablet' : 'Desktop'

  const setFromPointer = (clientX: number) => {
    const rect = trackRef.current?.getBoundingClientRect()
    if (!rect) return
    const minPx = rect.width * 0.32
    const px = Math.min(Math.max(clientX - rect.left, minPx), rect.width)
    setRatio((px - minPx) / (rect.width - minPx))
  }

  const onPointerDown = (e: PointerEvent<HTMLButtonElement>) => {
    e.currentTarget.setPointerCapture(e.pointerId)
    setDragging(true)
  }
  const onPointerMove = (e: PointerEvent<HTMLButtonElement>) => {
    if (dragging) setFromPointer(e.clientX)
  }
  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const step = e.shiftKey ? 0.1 : 0.03
    if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') setRatio((r) => Math.max(0, r - step))
    else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') setRatio((r) => Math.min(1, r + step))
    else if (e.key === 'Home') setRatio(0)
    else if (e.key === 'End') setRatio(1)
    else return
    e.preventDefault()
  }

  return (
    <div>
      <div ref={trackRef} className="relative h-[260px] sm:h-[280px]">
        <motion.div
          className="demo-frame absolute inset-y-0 left-0 overflow-hidden rounded-[10px] border border-line bg-bg"
          animate={{ width: `${32 + ratio * 68}%` }}
          transition={dragging ? { duration: 0 } : springUI}
        >
          <MiniSite />
        </motion.div>
        <motion.button
          type="button"
          role="slider"
          aria-label="Viewport width"
          aria-valuemin={MIN}
          aria-valuemax={MAX}
          aria-valuenow={width}
          aria-valuetext={`${width} pixels, ${layout} layout`}
          className="demo-handle absolute inset-y-0 z-10 -ml-3 grid w-6 touch-none place-items-center"
          animate={{ left: `${32 + ratio * 68}%` }}
          transition={dragging ? { duration: 0 } : springUI}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={() => setDragging(false)}
          onPointerCancel={() => setDragging(false)}
          onKeyDown={onKeyDown}
          data-cursor
        >
          <span className="demo-grip block h-12 w-1.5 rounded-full" />
        </motion.button>
      </div>
      <div className="mt-3 flex items-baseline justify-between font-mono text-[11px] tabular-nums text-muted">
        <span>Drag the handle</span>
        <span>
          <span className="text-text">{width}px</span> · {layout}
        </span>
      </div>
    </div>
  )
}

function MiniSite() {
  return (
    <div className="mini-site h-full p-3">
      <div className="mini-nav flex items-center justify-between">
        <span className="h-2 w-10 rounded-full bg-text" />
        <span className="mini-links flex gap-1.5">
          <span className="h-1.5 w-6 rounded-full bg-line" />
          <span className="h-1.5 w-6 rounded-full bg-line" />
          <span className="h-1.5 w-6 rounded-full bg-line" />
        </span>
        <span className="mini-burger flex flex-col gap-[3px]">
          <span className="h-[2px] w-4 bg-text" />
          <span className="h-[2px] w-4 bg-text" />
        </span>
      </div>
      <div className="mini-hero mt-4 grid gap-3">
        <div>
          <span className="mini-h1 block font-heading text-text">Fresh cakes, baked to order.</span>
          <span className="mt-2 block h-1.5 w-3/4 rounded-full bg-line" />
          <span className="mt-1.5 block h-1.5 w-1/2 rounded-full bg-line" />
          <span className="mt-3 inline-block h-5 w-16 rounded-full bg-text" />
        </div>
        <div className="mini-img rounded-[6px] bg-surface" />
      </div>
      <div className="mini-grid mt-3 grid gap-2">
        {[0, 1, 2].map((i) => (
          <div key={i} className="mini-card rounded-[6px] bg-surface" />
        ))}
      </div>
    </div>
  )
}
