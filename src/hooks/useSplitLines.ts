import { useLayoutEffect, useRef, useState } from 'react'

/**
 * Splits `text` into the lines it actually wraps to at the current width.
 *
 * There is no CSS way to ask "where did this text wrap"; the only honest
 * answer comes from measuring the DOM. This renders each word once as an
 * inline-block span, reads its offsetTop, and groups words that share a
 * top into one line. It re-measures on resize, because the real line
 * breaks on a phone are not the real line breaks on a desktop window.
 *
 * While `lines` is null, the caller should render the raw measuring pass
 * (see TextReveal). That pass stays in normal document flow so the
 * measurement is accurate, but is visually hidden so nothing unmasked
 * ever flashes on screen, including during a resize remeasure.
 */
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

    // First measurement: the raw spans are already laid out by the time
    // this runs (useLayoutEffect fires after DOM mutation, before paint),
    // so there is nothing to see before this completes.
    measure()

    // Later measurements: a resize can change where lines break. Drop
    // back to the raw (invisible) spans, then remeasure once the browser
    // has actually reflowed at the new width.
    const observer = new ResizeObserver(() => {
      setLines(null)
      requestAnimationFrame(measure)
    })
    observer.observe(container)

    return () => observer.disconnect()
  }, [text])

  return { containerRef, lines }
}