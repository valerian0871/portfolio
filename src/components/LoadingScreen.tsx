import { useEffect, useState } from 'react'
import { useReducedMotion } from 'motion/react'

interface LoadingScreenProps {
  ready: boolean
  minDisplay?: number
}

const NAME = 'Prosper Kayode'

export function LoadingScreen({ ready, minDisplay = 3400 }: LoadingScreenProps) {
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
    const timeout = window.setTimeout(() => setMounted(false), 1200)
    return () => window.clearTimeout(timeout)
  }, [canLeave])

  if (!mounted) return null

  const characters = Array.from(NAME)

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Prosper Kayode — Portfolio loading"
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-paper text-ink transition-[opacity,transform] duration-[1200ms] ease-[cubic-bezier(0.16,1,0.3,1)] ${
        canLeave
          ? 'pointer-events-none opacity-0 scale-[1.02]'
          : 'opacity-100 scale-100'
      }`}
    >
      <div className="relative flex flex-col items-center text-center px-6 py-8 select-none max-w-[90vw]">
        {/* Stylized Runethia Calligraphy Name */}
        <h1
          className="font-[family-name:var(--font-runethia)] text-6xl sm:text-7xl md:text-8xl lg:text-9xl font-normal leading-[1.2] text-ink pb-2"
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
          className={`h-[1px] w-28 sm:w-44 bg-accent/35 mt-2 ${
            reducedMotion ? 'opacity-100 scale-x-100' : 'loading-rule'
          }`}
          aria-hidden="true"
        />

        {/* Refined Metadata Subtitle */}
        <p
          className={`mt-4 text-[0.6875rem] sm:text-[0.75rem] uppercase font-mono text-ink-3 tracking-[0.2em] ${
            reducedMotion ? 'opacity-100' : 'loading-sub'
          }`}
        >
          Frontend &amp; Creative Engineering
        </p>
      </div>
    </div>
  )
}
