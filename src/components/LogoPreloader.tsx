import { useEffect, useState } from 'react'

interface LogoPreloaderProps {
  ready: boolean
  duration?: number
}

export function LogoPreloader({ ready, duration = 2 }: LogoPreloaderProps) {
  const [phase, setPhase] = useState<'init' | 'loading' | 'logoOut' | 'done'>('init')

  useEffect(() => {
    if (!ready) return

    const t0 = window.setTimeout(() => setPhase('loading'), 50)
    const t1 = window.setTimeout(() => setPhase('logoOut'), duration * 1000 + 50)
    const t2 = window.setTimeout(() => setPhase('done'), duration * 1000 + 750)

    return () => {
      window.clearTimeout(t0)
      window.clearTimeout(t1)
      window.clearTimeout(t2)
    }
  }, [duration, ready])

  if (phase === 'done') return null

  const logoTranslateY = phase === 'init' ? 80 : phase === 'loading' ? 0 : -80
  const logoOpacity = phase === 'init' ? 0 : phase === 'loading' ? 1 : 0
  const backgroundOpacity = phase === 'logoOut' ? 0 : 1
  const transition = 'all 0.7s cubic-bezier(.7,.2,.2,1)'

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-[#f7f4f0]"
      style={{
        opacity: backgroundOpacity,
        transition,
        pointerEvents: 'all',
      }}
    >
      <img
        src="/favicon-32x32.png"
        alt="Logo"
        draggable={false}
        className="select-none"
        style={{
          width: 128,
          height: 128,
          objectFit: 'contain',
          transform: `translateY(${logoTranslateY}px)`,
          opacity: logoOpacity,
          transition,
          willChange: 'transform, opacity',
          filter: 'drop-shadow(0 18px 30px rgba(17, 20, 18, 0.12))',
          userSelect: 'none',
        }}
      />
    </div>
  )
}
