import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  ready: boolean
  minDisplay?: number
}

export function LoadingScreen({ ready, minDisplay = 1500 }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(true)
  const [minElapsed, setMinElapsed] = useState(false)
  const [entered, setEntered] = useState(false)

  useEffect(() => {
    const timeout = window.setTimeout(() => setMinElapsed(true), minDisplay)
    return () => window.clearTimeout(timeout)
  }, [minDisplay])

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setEntered(true))
    return () => window.cancelAnimationFrame(frame)
  }, [])

  const canLeave = ready && minElapsed

  useEffect(() => {
    if (!canLeave) return
    const timeout = window.setTimeout(() => setMounted(false), 420)
    return () => window.clearTimeout(timeout)
  }, [canLeave])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-paper/85 backdrop-blur-md transition-opacity duration-[420ms] ease-brand ${
        canLeave ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src="/favicon-32x32.png"
        alt=""
        width={96}
        height={96}
        className={`h-24 w-24 rounded-sm object-contain shadow-lg transition-[transform,opacity] duration-[550ms] ease-brand ${
          canLeave
            ? '-translate-y-20 opacity-0'
            : entered
              ? 'translate-y-0 opacity-100'
              : 'translate-y-4 opacity-0'
        }`}
      />
    </div>
  )
}
