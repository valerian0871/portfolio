import { useEffect, useState } from 'react'
import { content } from '../data/content'

interface LoadingScreenProps {
  onHeroReady?: () => void
}

export function LoadingScreen({ onHeroReady }: LoadingScreenProps) {
  const [visible, setVisible] = useState(() => {
    if (typeof window === 'undefined') return false
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const hasSeenLoader = sessionStorage.getItem('portfolio_loader_seen') === 'true'
    return !hasSeenLoader && !prefersReducedMotion
  })
  const [exiting, setExiting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (!visible) {
      if (onHeroReady) onHeroReady()
      return
    }

    sessionStorage.setItem('portfolio_loader_seen', 'true')

    const startTime = performance.now()
    const minDuration = 900
    const maxDuration = 1800

    let isRealReady = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        isRealReady = true
      })
    } else {
      isRealReady = true
    }

    // Safety timeout to guarantee exit even if something stalls
    const safetyTimeout = window.setTimeout(() => {
      isRealReady = true
    }, maxDuration)

    // Progress counter animation
    const interval = window.setInterval(() => {
      const elapsed = performance.now() - startTime
      const progressRatio = Math.min(elapsed / (isRealReady ? minDuration : maxDuration), 1)
      const currentPct = Math.min(Math.floor(progressRatio * 100), 100)
      setProgress(currentPct)

      if (elapsed >= minDuration && (isRealReady || elapsed >= maxDuration)) {
        setProgress(100)
        clearInterval(interval)
        clearTimeout(safetyTimeout)

        // Start exit
        setExiting(true)

        // Hero text reveal starts 200ms before the 800ms exit completes (i.e. at 600ms)
        const heroTimer = window.setTimeout(() => {
          if (onHeroReady) onHeroReady()
        }, 600)

        // Fully unmount after 800ms exit completes
        const unmountTimer = window.setTimeout(() => {
          setVisible(false)
        }, 850)

        return () => {
          clearTimeout(heroTimer)
          clearTimeout(unmountTimer)
        }
      }
    }, 16)

    return () => {
      clearInterval(interval)
      clearTimeout(safetyTimeout)
    }
  }, [visible, onHeroReady])

  if (!visible) return null

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading portfolio"
      style={{
        transition: 'transform 800ms cubic-bezier(0.76, 0, 0.24, 1)',
        transform: exiting ? 'translateY(-100%)' : 'translateY(0)',
      }}
      className="fixed inset-0 z-[9999] flex flex-col justify-end bg-[#111111] text-[#FAFAF8] p-6 sm:p-10 pointer-events-none select-none"
    >
      <div className="flex w-full items-baseline justify-between">
        {/* Wordmark at bottom left in label style */}
        <span className="text-[12px] uppercase font-medium tracking-[0.08em] text-[#FAFAF8]/90">
          {content.profile.name}
        </span>

        {/* Percentage counter at bottom right in tabular figures */}
        <span className="text-[14px] sm:text-[16px] font-mono tabular-nums text-[#FAFAF8]/90">
          {progress.toString().padStart(2, '0')}%
        </span>
      </div>
    </div>
  )
}
