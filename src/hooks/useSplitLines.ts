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
 * The measuring spans stay permanently in the DOM (see TextReveal, which
 * positions them absolutely so they add no visible height), rather than
 * being mounted only while `lines` is null. An earlier version toggled
 * them out via setLines(null) and remeasured on the next animation
 * frame, which raced React's own render: if the frame ran before React
 * had actually put the spans back, the measurement found nothing, bailed
 * out, and never tried again, leaving the text stuck invisible forever.
 * Keeping the spans always present removes the race entirely, there is
 * nothing to wait for.
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

    // First measurement: the spans are already laid out by the time this
    // runs (useLayoutEffect fires after DOM mutation, before paint), so
    // there is nothing to see before this completes.
    measure()

    // Later measurements: a resize can change where lines break. The
    // spans never leave the DOM, so this can remeasure directly, with
    // nothing to toggle and nothing to wait for.
    const observer = new ResizeObserver(() => measure())
    observer.observe(container)

    return () => observer.disconnect()
  }, [text])

  return { containerRef, lines }
}