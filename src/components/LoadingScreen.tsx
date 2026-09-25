import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

interface LoadingScreenProps {
  ready: boolean
  minDisplay?: number
}

const NAME = 'Prosper Kayode'

export function LoadingScreen({ ready, minDisplay = 2000 }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(true)
  const [minElapsed, setMinElapsed] = useState(false)
  const reducedMotion = useReducedMotion()

  useEffect(() => {
    const timeout = window.setTimeout(() => setMinElapsed(true), minDisplay)
    return () => window.clearTimeout(timeout)
  }, [minDisplay])

  const canLeave = ready && minElapsed

  useEffect(() => {
    if (!canLeave) return
    const timeout = window.setTimeout(() => setMounted(false), 550)
    return () => window.clearTimeout(timeout)
  }, [canLeave])

  if (!mounted) return null

  const characters = Array.from(NAME)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Prosper Kayode — Portfolio loading"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper text-ink transition-[opacity,transform] duration-[550ms] ease-brand ${
        canLeave ? 'pointer-events-none opacity-0 -translate-y-4' : 'opacity-100 translate-y-0'
      }`}
    >
      <div className="relative flex flex-col items-center text-center px-6 select-none">
        {/* Stylized Elegant Name */}
        <h1
          className="font-[family-name:var(--font-elegant)] text-4xl sm:text-5xl md:text-6xl font-normal italic tracking-[-0.015em] text-ink"
          aria-label={NAME}
        >
          {characters.map((char, index) => (
            <span
              key={index}
              className={reducedMotion ? 'inline-block' : 'loading-char'}
              style={{ '--char-i': index } as React.CSSProperties}
            >
              {char === ' ' ? '\u00A0' : char}
            </span>
          ))}
        </h1>

        {/* Elegant Hairline Accent */}
        <div
          className={`h-[1px] w-24 sm:w-36 bg-accent/40 mt-4 ${
            reducedMotion ? 'opacity-100 scale-x-100' : 'loading-rule'
          }`}
          aria-hidden="true"
        />

        {/* Refined Metadata Subtitle */}
        <p
          className={`mt-3 text-[0.6875rem] sm:text-[0.75rem] uppercase font-mono text-ink-3 ${
            reducedMotion ? 'opacity-100' : 'loading-sub'
          }`}
        >
          Frontend &amp; Creative Engineering
        </p>
      </div>
    </div>
  )
}
