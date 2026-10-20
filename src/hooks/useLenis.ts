import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

let globalLenisInstance: Lenis | null = null

export function getLenis(): Lenis | null {
  return globalLenisInstance
}

export function useLenis() {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    const isDesktopPointer = window.matchMedia('(pointer: fine)').matches
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (!isDesktopPointer || prefersReducedMotion) {
      return
    }

    const lenis = new Lenis({
      lerp: 0.09,
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
      autoRaf: false,
    })

    lenisRef.current = lenis
    globalLenisInstance = lenis

    let rafId: number
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    const handleHashClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a')
      if (!target) return
      const href = target.getAttribute('href')
      if (href && href.startsWith('#')) {
        const targetElement = document.querySelector(href)
        if (targetElement) {
          e.preventDefault()
          lenis.scrollTo(targetElement as HTMLElement, { offset: -30 })
        }
      }
    }

    document.addEventListener('click', handleHashClick)

    return () => {
      cancelAnimationFrame(rafId)
      document.removeEventListener('click', handleHashClick)
      lenis.destroy()
      lenisRef.current = null
      globalLenisInstance = null
    }
  }, [])

  return lenisRef
}
