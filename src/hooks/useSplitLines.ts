import { useEffect, useRef, useState } from 'react'

export function useSplitLines(text: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)

  useEffect(() => {
    let timeoutId: number | null = null
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const words = container.querySelectorAll<HTMLSpanElement>('[data-word]')
      if (!words.length) return

      const grouped: string[][] = []
      let currentTop: number | null = null

      words.forEach((word) => {
        const top = Math.round(word.offsetTop)
        if (currentTop === null || Math.abs(top - currentTop) > 4) {
          grouped.push([])
          currentTop = top
        }
        grouped[grouped.length - 1].push(word.textContent ?? '')
      })

      const computedLines = grouped.map((wordsInLine) => wordsInLine.join(' ')).filter(Boolean)
      if (computedLines.length > 0) {
        setLines(computedLines)
      }
    }

    // Wait for fonts to be ready before splitting
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => {
        measure()
      })
    } else {
      measure()
    }

    // Debounced ResizeObserver
    const handleResize = () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      timeoutId = window.setTimeout(() => {
        measure()
      }, 100)
    }

    const observer = new ResizeObserver(handleResize)
    observer.observe(container)

    return () => {
      if (timeoutId) window.clearTimeout(timeoutId)
      observer.disconnect()
    }
  }, [text])

  return { containerRef, lines }
}