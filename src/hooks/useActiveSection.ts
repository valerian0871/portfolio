import { useEffect, useState, useRef, useCallback } from 'react'
import { getLenis } from './useLenis'

const HEADER_OFFSET = 0

export function useActiveSection(sectionIds: string[], currentRoute: string) {
  const [activeSection, setActiveSection] = useState<string | null>(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      return window.location.hash.replace('#', '')
    }
    return null
  })

  const isLockedRef = useRef(false)
  const lockTimerRef = useRef<number | null>(null)
  const lastHashUpdateRef = useRef<number>(0)

  const unlockObserver = useCallback(() => {
    isLockedRef.current = false
    if (lockTimerRef.current) {
      clearTimeout(lockTimerRef.current)
      lockTimerRef.current = null
    }
  }, [])

  const scrollToSection = useCallback(
    (sectionId: string) => {
      const element = document.getElementById(sectionId)
      if (!element) return

      setActiveSection(sectionId)
      isLockedRef.current = true

      if (lockTimerRef.current) {
        clearTimeout(lockTimerRef.current)
      }

      lockTimerRef.current = window.setTimeout(unlockObserver, 800)

      const onScrollEnd = () => {
        window.removeEventListener('scrollend', onScrollEnd)
        unlockObserver()
      }
      window.addEventListener('scrollend', onScrollEnd, { once: true })

      const lenis = getLenis()
      if (lenis) {
        lenis.scrollTo(element, {
          offset: -HEADER_OFFSET,
          onComplete: unlockObserver,
        })
      } else {
        const top = element.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
        window.scrollTo({ top, behavior: 'smooth' })
      }

      window.history.replaceState(null, '', `#${sectionId}`)
    },
    [unlockObserver]
  )

  useEffect(() => {
    if (currentRoute !== '/') {
      const routeSegment = currentRoute.replace(/^\//, '')
      setActiveSection(routeSegment || null)
      return
    }

    if (window.location.hash) {
      const initialId = window.location.hash.replace('#', '')
      const el = document.getElementById(initialId)
      if (el) {
        setTimeout(() => scrollToSection(initialId), 150)
      }
    }

    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null)

    if (sections.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isLockedRef.current) return

        const scrollY = window.scrollY
        const docHeight = document.documentElement.scrollHeight
        const windowHeight = window.innerHeight

        if (scrollY < 80) {
          setActiveSection(null)
          return
        }

        if (scrollY + windowHeight >= docHeight - 4) {
          const lastId = sectionIds[sectionIds.length - 1]
          setActiveSection(lastId)
          return
        }

        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = entry.target.id
            setActiveSection(id)

            const now = Date.now()
            if (now - lastHashUpdateRef.current > 400) {
              lastHashUpdateRef.current = now
              window.history.replaceState(null, '', `#${id}`)
            }
            break
          }
        }
      },
      {
        rootMargin: '-40% 0px -55% 0px',
        threshold: [0, 0.1, 0.25],
      }
    )

    sections.forEach((section) => observer.observe(section))

    const handleScrollEdges = () => {
      if (isLockedRef.current) return
      const scrollY = window.scrollY
      const docHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight

      if (scrollY < 80) {
        setActiveSection(null)
      } else if (scrollY + windowHeight >= docHeight - 4) {
        setActiveSection(sectionIds[sectionIds.length - 1])
      }
    }

    window.addEventListener('scroll', handleScrollEdges, { passive: true })

    return () => {
      observer.disconnect()
      window.removeEventListener('scroll', handleScrollEdges)
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current)
    }
  }, [currentRoute, sectionIds, scrollToSection])

  return { activeSection, scrollToSection, setActiveSection }
}
