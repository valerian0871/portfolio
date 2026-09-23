import { useLayoutEffect, useRef, useState } from 'react'

export function useSplitLines(text: string) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [lines, setLines] = useState<string[] | null>(null)

  useLayoutEffect(() => {
    const container = containerRef.current
    if (!container) return

    const measure = () => {
      const words = container.querySelectorAll<HTMLSpanElement>('[data-word]')
      if (!words.length) return

      const grouped: string[][] = []
      let currentTop: number | null = null

      words.forEach((word) => {
        const top = Math.round(word.offsetTop)
        if (currentTop === null || top !== currentTop) {
          grouped.push([])
          currentTop = top
        }
        grouped[grouped.length - 1].push(word.textContent ?? '')
      })

      setLines(grouped.map((wordsInLine) => wordsInLine.join(' ')))
    }

    measure()

    const observer = new ResizeObserver(() => measure())
    observer.observe(container)

    return () => observer.disconnect()
  }, [text])

  return { containerRef, lines }
}