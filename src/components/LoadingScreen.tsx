import { useEffect, useState, useRef } from 'react'

interface LoadingScreenProps {
  onHeroReady?: () => void
}

export function LoadingScreen({ onHeroReady }: LoadingScreenProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const forceLoader = window.location.search.includes('loader')
    const hasSeenLoader = !forceLoader && sessionStorage.getItem('portfolio_loader_seen') === 'true'
    return !hasSeenLoader && !prefersReducedMotion
  })

  const [textEntered, setTextEntered] = useState(false)
  const [textExiting, setTextExiting] = useState(false)
  const [panelExiting, setPanelExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [curveAmount, setCurveAmount] = useState(70) // Initial convex curve depth in px

  const animFrameRef = useRef<number | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return
    const rm = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    setReducedMotion(rm)
  }, [])

  useEffect(() => {
    if (!visible) {
      if (onHeroReady) onHeroReady()
      return
    }

    sessionStorage.setItem('portfolio_loader_seen', 'true')
    document.body.style.overflow = 'hidden'

    // Reduced motion fast path: 300ms fade
    if (reducedMotion) {
      const rmTimer = window.setTimeout(() => {
        if (onHeroReady) onHeroReady()
        setVisible(false)
        document.body.style.overflow = ''
      }, 300)
      return () => clearTimeout(rmTimer)
    }

    // Trigger text entrance on next tick
    const rafId = requestAnimationFrame(() => {
      setTextEntered(true)
    })

    const startTime = performance.now()
    const minDuration = 2800 // Minimum duration so sequence reads
    const maxDuration = 3600 // Hard maximum duration

    let isRealReady = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        isRealReady = true
      })
    } else {
      isRealReady = true
    }

    const safetyTimeout = window.setTimeout(() => {
      isRealReady = true
    }, maxDuration)

    const updateProgress = () => {
      const now = performance.now()
      const elapsed = now - startTime
      const targetDuration = isRealReady ? minDuration : maxDuration
      const rawPct = Math.min((elapsed / targetDuration) * 100, 100)

      setProgress((prev) => Math.max(prev, Math.floor(rawPct)))

      if (elapsed >= minDuration && (isRealReady || elapsed >= maxDuration)) {
        setProgress(100)

        // Hold 250ms at 100 per timeline specification
        window.setTimeout(() => {
          // Phase 5: Exit text (translateY(-120%), 600ms, 60ms stagger)
          setTextExiting(true)

          // Phase 6: Exit panel (900ms cubic-bezier(0.76, 0, 0.24, 1))
          window.setTimeout(() => {
            setPanelExiting(true)

            // Animate SVG path morph from convex arc (70px) to straight line (0px)
            const curveStartTime = performance.now()
            const animateCurve = () => {
              const curveElapsed = performance.now() - curveStartTime
              const t = Math.min(curveElapsed / 900, 1)
              // Ease curve out toward 0
              const currentCurve = Math.max(0, (1 - t) * 70)
              setCurveAmount(currentCurve)
              if (t < 1) {
                requestAnimationFrame(animateCurve)
              }
            }
            requestAnimationFrame(animateCurve)

            // Step 7: Hero line reveals start 300ms before panel finishes leaving (at 600ms of 900ms)
            window.setTimeout(() => {
              if (onHeroReady) onHeroReady()
            }, 600)

            // Fully unmount after 900ms exit completes
            window.setTimeout(() => {
              setVisible(false)
              document.body.style.overflow = ''
            }, 950)
          }, 350)
        }, 250)

        return
      }

      animFrameRef.current = requestAnimationFrame(updateProgress)
    }

    animFrameRef.current = requestAnimationFrame(updateProgress)

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(safetyTimeout)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      document.body.style.overflow = ''
    }
  }, [visible, reducedMotion, onHeroReady])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-label="Loading portfolio"
      style={{
        backgroundColor: 'var(--color-loader-bg)',
        color: 'var(--color-loader-text)',
        transition: reducedMotion
          ? 'opacity 300ms ease'
          : 'transform 900ms cubic-bezier(0.76, 0, 0.24, 1)',
        transform: panelExiting ? 'translateY(-100%)' : 'translateY(0)',
        willChange: panelExiting ? 'transform' : 'auto',
      }}
      className="fixed inset-0 z-[9999] h-[100svh] w-full flex flex-col justify-between px-6 py-6 sm:px-12 sm:py-10 select-none overflow-visible pointer-events-auto"
    >
      <span className="sr-only">Loading</span>

      {/* Top row: Label left, Year right */}
      <div className="flex w-full items-center justify-between z-20">
        <div className="mask-line">
          <span
            style={{
              display: 'block',
              transition: textExiting
                ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 0ms'
                : 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 0ms',
              transform: textExiting
                ? 'translateY(-120%)'
                : textEntered
                ? 'translateY(0)'
                : 'translateY(120%)',
            }}
            className="text-[12px] uppercase font-medium tracking-[0.08em] opacity-80"
          >
            Portfolio
          </span>
        </div>

        <div className="mask-line">
          <span
            style={{
              display: 'block',
              transition: textExiting
                ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 60ms'
                : 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 80ms',
              transform: textExiting
                ? 'translateY(-120%)'
                : textEntered
                ? 'translateY(0)'
                : 'translateY(120%)',
            }}
            className="text-[12px] font-mono tracking-widest opacity-80"
          >
            2026
          </span>
        </div>
      </div>

      {/* Centre: Name "Prosper" at display size on a line mask, framed by the progress hairline */}
      <div className="relative flex-1 flex flex-col items-center justify-center w-full z-20">
        {/* Full-width hairline progress bar running through vertical centre */}
        <div
          className="absolute top-1/2 left-0 right-0 -translate-y-1/2 w-full h-[1px] pointer-events-none z-10"
          style={{
            backgroundColor: 'var(--color-loader-line)',
          }}
        >
          <div
            style={{
              height: '100%',
              width: '100%',
              backgroundColor: 'var(--color-loader-text)',
              transformOrigin: textExiting ? 'right center' : 'left center',
              transform: textExiting
                ? 'scaleX(0)'
                : `scaleX(${progress / 100})`,
              transition: textExiting
                ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1)'
                : 'transform 120ms linear',
            }}
          />
        </div>

        {/* Name "Prosper" with background knockout so hairline frames it without cutting through letters */}
        <div className="relative z-20 px-6 sm:px-10" style={{ backgroundColor: 'var(--color-loader-bg)' }}>
          <div className="mask-line inline-block px-1">
            <h1
              style={{
                display: 'block',
                transition: textExiting
                  ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 80ms'
                  : 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 160ms',
                transform: textExiting
                  ? 'translateY(-120%)'
                  : textEntered
                  ? 'translateY(0)'
                  : 'translateY(120%)',
              }}
              className="text-[clamp(48px,8vw,120px)] font-heading font-medium tracking-[-0.035em] leading-[1.08] text-center select-none"
            >
              Prosper
            </h1>
          </div>
        </div>
      </div>

      {/* Bottom row: Descriptor left, Clean tabular counter right */}
      <div className="flex w-full items-baseline justify-between z-20 gap-4">
        <div className="mask-line min-w-0 max-w-[calc(100%-80px)] sm:max-w-none">
          <span
            style={{
              display: 'block',
              transition: textExiting
                ? 'transform 600ms cubic-bezier(0.16, 1, 0.3, 1) 120ms'
                : 'transform 900ms cubic-bezier(0.16, 1, 0.3, 1) 240ms',
              transform: textExiting
                ? 'translateY(-120%)'
                : textEntered
                ? 'translateY(0)'
                : 'translateY(120%)',
            }}
            className="text-[11px] sm:text-[12px] uppercase font-medium tracking-[0.08em] opacity-80 truncate block"
          >
            Frontend / Design / Writing / Automation
          </span>
        </div>

        {/* Counter in tabular figures */}
        <div className="shrink-0 font-mono text-[14px] sm:text-[16px] tabular-nums font-medium tracking-wider opacity-90">
          <span>{String(progress).padStart(3, '0')}</span>
          <span className="ml-1 opacity-70">%</span>
        </div>
      </div>

      {/* Trailing curved morphing SVG edge for panel exit (visible as panel slides up) */}
      {!reducedMotion && (
        <div className="absolute top-full left-0 right-0 h-[80px] pointer-events-none overflow-visible">
          <svg
            viewBox="0 0 1000 80"
            preserveAspectRatio="none"
            className="w-full h-full block"
            style={{
              fill: 'var(--color-loader-bg)',
            }}
          >
            <path d={`M 0 0 L 1000 0 Q 500 ${curveAmount} 0 0 Z`} />
          </svg>
        </div>
      )}
    </div>
  )
}
