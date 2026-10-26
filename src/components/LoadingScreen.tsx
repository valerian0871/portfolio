import { useEffect, useRef, useState } from 'react'
import { animate, motion, useAnimate, useMotionValue, useTransform } from 'motion/react'
import { content } from '../data/content'
import { getLenis } from '../hooks/useLenis'
import { easeInOutStrong, easeOutStrong } from '../lib/motion'


const NAME = content.profile.name
const CHARS = Array.from(NAME)
const SORT_COUNT = CHARS.filter((c) => c !== ' ').length
const MIN_MS = 1250
const CAP_MS = 2200
const SEEN_KEY = 'portfolio_loader_seen'

// A compositor picks sorts from the case, not left to right. Fixed order so the
// sequence reads as deliberate on every visit.
const PICK_ORDER = [0, 8, 3, 11, 5, 1, 13, 9, 4, 12, 2, 10, 6, 7]
const pickRank = (i: number) => {
  const rank = PICK_ORDER.indexOf(i)
  return rank === -1 ? i : rank
}
const DROP_STEP = 0.055
const DROP_START = 0.12

function shouldShow() {
  if (typeof window === 'undefined') return false
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false
  if (window.location.search.includes('loader')) return true
  try {
    return sessionStorage.getItem(SEEN_KEY) !== 'true'
  } catch {
    return true
  }
}

interface LoadingScreenProps {
  onHeroReady: () => void
  onDone: () => void
}

export function LoadingScreen({ onHeroReady, onDone }: LoadingScreenProps) {
  const [show] = useState(shouldShow)
  const [mounted, setMounted] = useState(show)
  const [scope, animateScope] = useAnimate()
  const progress = useMotionValue(0)
  const sorts = useTransform(progress, (p) => String(Math.round(p * SORT_COUNT)).padStart(2, '0'))
  const exitingRef = useRef(false)
  const callbacks = useRef({ onHeroReady, onDone })
  callbacks.current = { onHeroReady, onDone }

  useEffect(() => {
    if (!show) {
      callbacks.current.onHeroReady()
      callbacks.current.onDone()
      return
    }

    try {
      sessionStorage.setItem(SEEN_KEY, 'true')
    } catch {}
    document.body.style.overflow = 'hidden'
    getLenis()?.stop()

    const start = performance.now()
    let fontsReady = false
    document.fonts?.ready.then(() => {
      fontsReady = true
    })

    const firstLeg = animate(progress, 0.86, { duration: CAP_MS / 1000, ease: [0.1, 0.6, 0.3, 1] })

    const exit = async () => {
      if (exitingRef.current) return
      exitingRef.current = true
      firstLeg.stop()
      window.removeEventListener('keydown', exit)

      await animate(progress, 1, { duration: 0.2, ease: [0.55, 0, 1, 0.45] })

      const name = scope.current?.querySelector('[data-loader-name]') as HTMLElement | null
      const target = document.querySelector('[data-wordmark]') as HTMLElement | null
      const settle = (controls: { then: (resolve: () => void) => unknown }) =>
        new Promise<void>((resolve) => {
          controls.then(resolve)
        })

      // Every sort snaps home, then the forme is locked and pulled: a short
      // press into the sheet before the line lifts away.
      animateScope('[data-sort]', { x: 0, y: 0, rotateY: 0, rotate: 0, opacity: 1 }, { duration: 0.12 })
      animateScope('[data-loader-chrome]', { opacity: 0 }, { duration: 0.16 })
      if (name) {
        await settle(animateScope(name, { scale: [1, 0.985, 1] }, { duration: 0.24, ease: easeOutStrong }))
      }

      const flight: Promise<void>[] = []
      if (name && target) {
        const from = name.getBoundingClientRect()
        const to = target.getBoundingClientRect()
        const scale = to.width / from.width
        const x = to.left - from.left
        const y = to.top + to.height / 2 - (from.top + (from.height * scale) / 2)
        const textColor = getComputedStyle(document.documentElement).getPropertyValue('--color-text').trim()
        flight.push(
          settle(animateScope(
            name,
            { x, y, scale, color: textColor || '#111111' },
            { duration: 0.75, ease: easeInOutStrong },
          )),
        )
      }

      window.setTimeout(() => callbacks.current.onHeroReady(), 250)
      flight.push(
        settle(animateScope(
          '[data-loader-panel]',
          { clipPath: ['inset(0% 0 0 0)', 'inset(100% 0 0 0)'] },
          { duration: 0.7, ease: easeInOutStrong, delay: 0.05 },
        )),
      )

      await Promise.all(flight)
      document.body.style.overflow = ''
      document.documentElement.classList.remove('loader-pending')
      getLenis()?.start()
      callbacks.current.onDone()
      setMounted(false)
    }

    const tick = window.setInterval(() => {
      const elapsed = performance.now() - start
      if ((fontsReady && elapsed >= MIN_MS) || elapsed >= CAP_MS) {
        window.clearInterval(tick)
        exit()
      }
    }, 50)

    window.addEventListener('keydown', exit)

    return () => {
      window.clearInterval(tick)
      window.removeEventListener('keydown', exit)
      firstLeg.stop()
      document.body.style.overflow = ''
    }
  }, [])

  if (!mounted) return null

  return (
    <div
      ref={scope}
      aria-hidden="true"
      className="fixed inset-0 z-[90]"
      onPointerDown={() => window.dispatchEvent(new KeyboardEvent('keydown'))}
    >
      <div data-loader-panel className="absolute inset-0 bg-loader-bg" />
      <div className="relative flex h-full flex-col justify-center px-5 sm:px-6 md:px-10">
        <div className="mx-auto w-full max-w-[1280px]">
          <div className="relative inline-flex flex-col">
            <div data-loader-chrome className="pointer-events-none absolute inset-0">
              <CropMarks />
              {/* Cap height, x-height and baseline for Inter Tight at line-height 1. */}
              <div className="loader-name absolute inset-x-0 top-0 h-[1em]">
                <Guide className="top-[0.136em]" delay={0.05} />
                <Guide className="top-[0.318em]" delay={0.12} dashed />
                <Guide className="top-[0.863em]" delay={0.19} />
              </div>
            </div>

            <span
              data-loader-name
              className="loader-name relative inline-flex origin-top-left whitespace-nowrap font-heading text-loader-text"
              style={{ perspective: '600px' }}
            >
              {CHARS.map((char, i) => {
                const rank = pickRank(i)
                // Sorts arrive spaced out and mirrored, as metal type reads,
                // then kern in towards the line's centre and turn readable.
                const spread = (i - (CHARS.length - 1) / 2) * 0.06
                return (
                  <motion.span
                    key={i}
                    data-sort
                    className="inline-block whitespace-pre will-change-transform"
                    style={{ transformStyle: 'preserve-3d' }}
                    initial={{ y: '-38%', x: `${spread * 100}%`, rotateY: 180, rotate: rank % 2 ? 4 : -3, opacity: 0 }}
                    animate={{
                      y: ['-38%', '0%', '0%'],
                      x: [`${spread * 100}%`, `${spread * 100}%`, '0%'],
                      rotateY: [180, 180, 0],
                      rotate: [rank % 2 ? 4 : -3, 0, 0],
                      opacity: [0, 1, 1],
                    }}
                    transition={{
                      duration: 0.62,
                      times: [0, 0.42, 1],
                      ease: [easeOutStrong, easeInOutStrong],
                      delay: DROP_START + rank * DROP_STEP,
                    }}
                  >
                    {char}
                  </motion.span>
                )
              })}
            </span>

            <div data-loader-chrome className="relative mt-[0.18em] h-px w-full bg-loader-line">
              <motion.div className="absolute inset-0 origin-left bg-loader-text" style={{ scaleX: progress }} />
            </div>

            <div
              data-loader-chrome
              className="mt-4 flex items-baseline justify-between gap-6 font-mono text-[11px] tabular-nums text-loader-muted"
            >
              <span>
                Setting <motion.span className="text-loader-text">{sorts}</motion.span> / {SORT_COUNT} sorts
              </span>
              <span className="hidden sm:inline">Inter Tight 500 · tracking −0.03 em</span>
            </div>
          </div>
        </div>
      </div>
      <p
        data-loader-chrome
        className="absolute bottom-6 left-5 font-mono text-[11px] text-loader-muted sm:left-6 md:left-10"
      >
        Press any key to skip
      </p>
    </div>
  )
}

function Guide({ className, delay, dashed = false }: { className: string; delay: number; dashed?: boolean }) {
  return (
    <motion.span
      className={`loader-guide absolute -left-[4vw] -right-[4vw] h-px origin-left ${dashed ? 'is-dashed' : ''} ${className}`}
      initial={{ scaleX: 0 }}
      animate={{ scaleX: 1 }}
      transition={{ duration: 0.9, delay, ease: easeInOutStrong }}
    />
  )
}

function CropMarks() {
  const corners = [
    'left-[-28px] top-[-20px]',
    'right-[-28px] top-[-20px] rotate-90',
    'right-[-28px] bottom-[-20px] rotate-180',
    'left-[-28px] bottom-[-20px] -rotate-90',
  ]
  return (
    <>
      {corners.map((pos, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 20 20"
          className={`absolute h-5 w-5 text-loader-muted ${pos}`}
          initial={{ opacity: 0, scale: 1.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.45, delay: 0.04 * i, ease: easeOutStrong }}
        >
          <path d="M0 8H12M8 0V12" stroke="currentColor" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" />
        </motion.svg>
      ))}
    </>
  )
}
