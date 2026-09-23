import { useEffect, useState } from 'react'

export function useContentReady(cap = 1200, floor = 260): boolean {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    let cancelled = false

    const fonts: Promise<unknown> = document.fonts
      ? document.fonts.ready
      : Promise.resolve()
    const capped = new Promise((resolve) => window.setTimeout(resolve, cap))
    const floored = new Promise((resolve) => window.setTimeout(resolve, floor))

    void Promise.all([Promise.race([fonts, capped]), floored]).then(() => {
      if (!cancelled) setReady(true)
    })

    return () => {
      cancelled = true
    }
  }, [cap, floor])

  return ready
}