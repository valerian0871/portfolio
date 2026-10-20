import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { animate, motion, useMotionValue, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { TRACK, formatTime, useMusic } from '../../lib/MusicContext'
import { PauseIcon, PlayIcon } from './MusicIcons'

/*
 * Geometry, in a 400 x 340 design box (everything below is a percentage of it):
 *   platter centre (170, 170), radius 150
 *   tonearm pivot (350, 60), needle 230 below the pivot
 * Needle angle: 0 deg rests off the record, 24 deg is the outer groove,
 * 36 deg the inner groove. It tracks inward as the song plays.
 */
const PIVOT = { x: 0.875, y: 60 / 340 }
const REST = 0
const START = 24
const END = 36
const DROP_THRESHOLD = 16
const ARM_SPRING = { type: 'spring', stiffness: 220, damping: 26 } as const

export function RecordPlayer() {
  const music = useMusic()
  const reduceMotion = useReducedMotion()
  const rootRef = useRef<HTMLDivElement>(null)
  const angle = useMotionValue(music.needleDown ? START : REST)
  const following = useRef(music.needleDown)
  const drag = useRef<{ startX: number; startY: number; moved: boolean } | null>(null)
  const [dragging, setDragging] = useState(false)

  const { setPlayerInView, needleDown, status } = music

  // Tell the floating control whether the player itself is on screen
  useEffect(() => {
    const el = rootRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setPlayerInView(entry.isIntersecting), {
      threshold: 0.25,
    })
    observer.observe(el)
    return () => {
      observer.disconnect()
      setPlayerInView(false)
    }
  }, [setPlayerInView])

  // The needle follows playback inward
  useMotionValueEvent(music.progress, 'change', (p) => {
    if (following.current && !drag.current) angle.set(START + (END - START) * p)
  })

  const moveArmTo = (target: number, then?: () => void) => {
    following.current = false
    if (reduceMotion) {
      angle.set(target)
      then?.()
      return
    }
    animate(angle, target, ARM_SPRING).then(() => then?.())
  }

  // Keep the arm in sync with state changes from elsewhere (ended, error, lifted)
  useEffect(() => {
    if (drag.current) return
    if (needleDown) {
      moveArmTo(START + (END - START) * music.progress.get(), () => {
        following.current = true
      })
    } else {
      moveArmTo(REST)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [needleDown])

  const toggleNeedle = () => {
    if (needleDown) music.liftNeedle()
    else music.dropNeedle()
  }

  const angleFromPointer = (event: ReactPointerEvent) => {
    const rect = rootRef.current!.getBoundingClientRect()
    const px = rect.left + rect.width * PIVOT.x
    const py = rect.top + rect.height * PIVOT.y
    const deg = (Math.atan2(px - event.clientX, event.clientY - py) * 180) / Math.PI
    return Math.max(REST, Math.min(END, deg))
  }

  const onPointerDown = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) return
    event.currentTarget.setPointerCapture(event.pointerId)
    drag.current = { startX: event.clientX, startY: event.clientY, moved: false }
  }

  const onPointerMove = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const d = drag.current
    if (!d) return
    if (!d.moved && Math.hypot(event.clientX - d.startX, event.clientY - d.startY) < 5) return
    d.moved = true
    following.current = false
    setDragging(true)
    angle.set(angleFromPointer(event))
  }

  const onPointerUp = () => {
    const d = drag.current
    drag.current = null
    setDragging(false)
    if (!d) return
    if (!d.moved) {
      toggleNeedle()
      return
    }
    const onRecord = angle.get() >= DROP_THRESHOLD
    if (onRecord && !needleDown) music.dropNeedle()
    else if (!onRecord && needleDown) music.liftNeedle()
    else if (onRecord) moveArmTo(START + (END - START) * music.progress.get(), () => (following.current = true))
    else moveArmTo(REST)
  }

  const spinning = status === 'playing'
  const label = needleDown
    ? 'Lift the needle. The song stops and starts over next time'
    : `Place the needle to play ${TRACK.title} by ${TRACK.artist}`

  return (
    <figure className="record-player w-full" aria-label={`Record player: ${TRACK.title} by ${TRACK.artist}`}>
      <div ref={rootRef} className="turntable relative aspect-[400/340] w-full select-none">
        {/* Platter + record (the record spins; the sheen stays put like a real reflection) */}
        <div
          className="turntable-platter absolute rounded-full"
          style={{ left: '5%', top: `${(20 / 340) * 100}%`, width: '75%', aspectRatio: '1' }}
          onClick={() => (needleDown ? music.togglePause() : music.dropNeedle())}
          aria-hidden="true"
        >
          <div className="vinyl absolute inset-[3.3%] rounded-full" data-spinning={spinning || undefined}>
            <div className="vinyl-label absolute left-1/2 top-1/2 grid aspect-square w-[33%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full">
              <span className="font-heading text-[clamp(0.8rem,2.6vw,1.15rem)] tracking-[-0.04em]">PK</span>
              <span className="vinyl-spindle absolute left-1/2 top-1/2 h-[9%] w-[9%] -translate-x-1/2 -translate-y-1/2 rounded-full" />
            </div>
          </div>
          <div className="vinyl-sheen pointer-events-none absolute inset-[3.3%] rounded-full" />
        </div>

        {/* Speed + status light */}
        <div className="absolute bottom-[6%] right-[5%] flex items-center gap-2 font-mono text-[10px] text-[color:var(--deck-muted)]" aria-hidden="true">
          <span className="deck-led h-1.5 w-1.5 rounded-full" data-on={spinning || undefined} />
          33⅓
        </div>

        {/* Pivot base */}
        <div
          className="deck-pivot absolute aspect-square w-[11%] -translate-x-1/2 -translate-y-1/2 rounded-full"
          style={{ left: `${PIVOT.x * 100}%`, top: `${PIVOT.y * 100}%` }}
          aria-hidden="true"
        />

        {/* Tonearm: rotates around the pivot; the needle is the button */}
        <motion.div
          className="absolute w-[9%] -translate-x-1/2"
          style={{
            left: `${PIVOT.x * 100}%`,
            top: `${(20 / 340) * 100}%`,
            height: `${(270 / 340) * 100}%`,
            transformOrigin: `50% ${(40 / 270) * 100}%`,
            rotate: angle,
          }}
        >
          <svg viewBox="0 0 36 270" className="deck-arm absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
            <rect x="9" y="0" width="18" height="26" rx="5" className="deck-arm-weight" />
            <line x1="18" y1="26" x2="18" y2="232" strokeWidth="4" strokeLinecap="round" className="deck-arm-tube" />
            <g transform="rotate(18 18 244)">
              <rect x="11" y="230" width="14" height="30" rx="3" className="deck-arm-head" />
              <line x1="18" y1="260" x2="18" y2="268" strokeWidth="2" strokeLinecap="round" className="deck-arm-tube" />
            </g>
          </svg>
          <button
            type="button"
            aria-label={label}
            aria-pressed={needleDown}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                toggleNeedle()
              }
            }}
            className="deck-needle absolute bottom-[-6%] left-1/2 h-12 w-12 -translate-x-1/2 touch-none rounded-full"
            data-dragging={dragging || undefined}
          />
        </motion.div>
      </div>

      <figcaption className="mt-4 flex items-center justify-between gap-4">
        <div className="min-w-0">
          <p className="truncate text-[13px] font-medium text-text">{TRACK.title}</p>
          <p className="truncate text-[12px] text-muted">
            {status === 'error'
              ? 'The track couldn’t load. Try again in a moment.'
              : needleDown
                ? TRACK.artist
                : `${TRACK.artist} · drop the needle to play`}
          </p>
        </div>
        {needleDown ? (
          <div className="flex shrink-0 items-center gap-3">
            <span className="font-mono text-[11px] tabular-nums text-muted" aria-live="off">
              {status === 'loading' ? 'Loading…' : `${formatTime(music.currentTime)} / ${formatTime(music.duration)}`}
            </span>
            <button
              type="button"
              onClick={music.togglePause}
              aria-label={status === 'paused' ? 'Resume music' : 'Pause music'}
              className="on-ink grid h-10 w-10 place-items-center rounded-full"
            >
              {status === 'paused' ? <PlayIcon /> : <PauseIcon />}
            </button>
          </div>
        ) : null}
      </figcaption>
    </figure>
  )
}
