import { useEffect, useRef, useState } from 'react'
import { animate, motion, useAnimate, useMotionValue } from 'motion/react'
import { content } from '../data/content'
import { getLenis } from '../hooks/useLenis'
import { easeInOutStrong, springUI } from '../lib/motion'


const NAME = content.profile.name
const MIN_MS = 1000
const CAP_MS = 2000
const SEEN_KEY = 'portfolio_loader_seen'

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

    const firstLeg = animate(progress, 0.62, { duration: CAP_MS / 1000, ease: [0.1, 0.6, 0.3, 1] })

    const exit = async () => {
      if (exitingRef.current) return
      exitingRef.current = true
      firstLeg.stop()
      window.removeEventListener('keydown', exit)

      await animate(progress, 1, { duration: 0.22, ease: [0.55, 0, 1, 0.45] })

      const name = scope.current?.querySelector('[data-loader-name]') as HTMLElement | null
      const target = document.querySelector('[data-wordmark]') as HTMLElement | null
      const flight: Promise<void>[] = []
      const settle = (controls: { then: (resolve: () => void) => unknown }) =>
        new Promise<void>((resolve) => {
          controls.then(resolve)
        })

      animateScope('[data-loader-chrome]', { opacity: 0 }, { duration: 0.12 })

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
          <div className="inline-flex flex-col">
          <span
            data-loader-name
            className="loader-name inline-flex origin-top-left whitespace-nowrap font-heading text-loader-text"
          >
            {Array.from(NAME).map((char, i) => (
              <span key={i} className="inline-block overflow-hidden pb-[0.08em] -mb-[0.08em]">
                <motion.span
                  className="inline-block whitespace-pre"
                  initial={{ y: '105%' }}
                  animate={{ y: '0%' }}
                  transition={{ ...springUI, delay: 0.1 + i * 0.03 }}
                >
                  {char}
                </motion.span>
              </span>
            ))}
          </span>
          <div data-loader-chrome className="mt-6 h-px w-full overflow-hidden bg-loader-line">
            <motion.div className="h-full origin-left bg-loader-text" style={{ scaleX: progress }} />
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
