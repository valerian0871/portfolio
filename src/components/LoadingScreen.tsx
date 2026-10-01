import { useEffect, useState, useRef } from 'react'

interface LoadingScreenProps {
  onHeroReady?: () => void
}

export function LoadingScreen({ onHeroReady }: LoadingScreenProps) {
  const [reducedMotion, setReducedMotion] = useState(false)
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const hasSeenLoader = sessionStorage.getItem('portfolio_loader_seen') === 'true'
    return !hasSeenLoader
  })

  const [textEntered, setTextEntered] = useState(false)
  const [textExiting, setTextExiting] = useState(false)
  const [panelExiting, setPanelExiting] = useState(false)
  const [progress, setProgress] = useState(0)
  const [curveAmount, setCurveAmount] = useState(0) // 0 to 120 for SVG bottom curve

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

    // Reduced motion fast path: 300ms fade, no counter, no morph
    if (reducedMotion) {
      const rmTimer = window.setTimeout(() => {
        if (onHeroReady) onHeroReady()
        setVisible(false)
        document.body.style.overflow = ''
      }, 300)
      return () => clearTimeout(rmTimer)
    }

    const startTime = performance.now()
    const minDuration = 1200 // Minimum 1200ms duration per rule
    const maxDuration = 2000 // Hard maximum 2000ms duration per rule

    // Phase 2: 150ms to 900ms - text rises through masks
    const enterTimer = window.setTimeout(() => {
      setTextEntered(true)
    }, 150)

    let isRealReady = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        isRealReady = true
      })
    } else {
      isRealReady = true
    }

    // Safety timeout to enforce hard maximum 2000ms
    const safetyTimeout = window.setTimeout(() => {
      isRealReady = true
    }, maxDuration)

    // Progress counter animation: smoothed so value never jumps backwards or stalls
    const updateProgress = () => {
      const now = performance.now()
      const elapsed = now - startTime
      const targetDuration = isRealReady ? minDuration : maxDuration
      const rawPct = Math.min((elapsed / targetDuration) * 100, 100)
      
      setProgress((prev) => Math.max(prev, Math.floor(rawPct)))

      if (elapsed >= minDuration && (isRealReady || elapsed >= maxDuration)) {
        setProgress(100)

        // Hold 250ms at 100 per timeline step 4
        window.setTimeout(() => {
          // Phase 5: Exit text (translateY(-120%), 600ms, 60ms stagger)
          setTextExiting(true)

          // Phase 6: Exit panel (900ms cubic-bezier(0.76, 0, 0.24, 1))
          window.setTimeout(() => {
            setPanelExiting(true)
            setCurveAmount(100)

            // Animate SVG path morph from convex arc to straight line during exit
            const curveStartTime = performance.now()
            const animateCurve = () => {
              const curveElapsed = performance.now() - curveStartTime
              const t = Math.min(curveElapsed / 900, 1)
              // Ease curve out
              const currentCurve = Math.max(0, (1 - t) * 100)
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
      clearTimeout(enterTimer)
      clearTimeout(safetyTimeout)
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current)
      document.body.style.overflow = ''
    }
  }, [visible, reducedMotion, onHeroReady])

  if (!visible) return null

  // Digits for rolling mechanical odometer
  const formattedCount = String(progress).padStart(3, '0')
  const d1 = parseInt(formattedCount[0], 10)
  const d2 = parseInt(formattedCount[1], 10)
  const d3 = parseInt(formattedCount[2], 10)

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
      className="fixed inset-0 z-[9999] h-[100svh] w-full flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden pointer-events-none"
    >
      <span className="sr-only">Loading</span>

      {/* Top row: Label left, Year right */}
      <div className="flex w-full items-baseline justify-between z-10">
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
            className="text-[12px] uppercase font-medium tracking-[0.08em] opacity-90"
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
            className="text-[12px] font-mono opacity-80"
          >
            2026
          </span>
        </div>
      </div>

      {/* Centre: Name "Prosper" at display size on a line mask */}
      <div className="my-auto w-full z-10">
        <div className="mask-line inline-block">
          <span
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
            className="text-[clamp(44px,7.2vw,112px)] font-heading font-medium tracking-[-0.035em] leading-[1.1]"
          >
            Prosper
          </span>
        </div>
      </div>

      {/* Progress hairline across the full width at the vertical centre */}
      <div
        className="absolute top-1/2 left-0 right-0 h-[1px] pointer-events-none"
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

      {/* Bottom row: Descriptor left, Odometer counter right */}
      <div className="flex w-full items-baseline justify-between z-10">
        <div className="mask-line">
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
            className="text-[12px] uppercase font-medium tracking-[0.08em] opacity-90"
          >
            Frontend / Design / Writing / Automation
          </span>
        </div>

        {/* Mechanical Odometer: digits roll in vertical strips */}
        <div className="flex items-center font-mono text-[14px] sm:text-[16px] tabular-nums font-medium opacity-90">
          <OdometerDigit digit={d1} />
          <OdometerDigit digit={d2} />
          <OdometerDigit digit={d3} />
          <span className="ml-1">%</span>
        </div>
      </div>

      {/* Bottom curved morphing SVG edge for panel exit */}
      {!reducedMotion && (
        <svg
          className="absolute -bottom-[99px] left-0 right-0 w-full h-[100px] pointer-events-none"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
          style={{
            fill: 'var(--color-loader-bg)',
          }}
        >
          <path d={`M 0 0 L 1000 0 L 1000 0 Q 500 ${curveAmount} 0 0 Z`} />
        </svg>
      )}
    </div>
  )
}

function OdometerDigit({ digit }: { digit: number }) {
  return (
    <span className="relative inline-block h-[1.3em] w-[0.65em] overflow-hidden leading-[1.3] text-center">
      <span
        style={{
          display: 'block',
          transition: 'transform 200ms cubic-bezier(0.23, 1, 0.32, 1)',
          transform: `translateY(-${digit * 10}%)`,
        }}
      >
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((n) => (
          <span key={n} className="block h-[1.3em]">
            {n}
          </span>
        ))}
      </span>
    </span>
  )
}
