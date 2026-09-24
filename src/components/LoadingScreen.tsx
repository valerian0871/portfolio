import { useEffect, useState } from 'react'

interface LoadingScreenProps {
  ready: boolean
}


export function LoadingScreen({ ready }: LoadingScreenProps) {
  const [mounted, setMounted] = useState(true)

  useEffect(() => {
    if (!ready) return
    const timeout = window.setTimeout(() => setMounted(false), 420)
    return () => window.clearTimeout(timeout)
  }, [ready])

  if (!mounted) return null

  return (
    <div
      aria-hidden="true"
      className={`fixed inset-0 z-[100] flex items-center justify-center bg-paper/85 backdrop-blur-md transition-opacity duration-[420ms] ease-brand ${
        ready ? 'pointer-events-none opacity-0' : 'opacity-100'
      }`}
    >
      <img
        src="/apple-touch-icon.png"
        alt=""
        width={64}
        height={64}
        className="size-16 animate-pulse rounded-full shadow-lg"
      />
    </div>
  )
}
