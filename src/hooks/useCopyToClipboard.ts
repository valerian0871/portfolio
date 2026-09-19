import { useCallback, useEffect, useRef, useState } from 'react'

export type CopyStatus = 'idle' | 'copying' | 'copied' | 'error'

/**
 * Wraps the clipboard API so a button can show a real loading state.
 * The clipboard call is genuinely asynchronous and genuinely fails on
 * insecure origins, so both states are real rather than simulated.
 */
export function useCopyToClipboard(resetAfter = 2600) {
  const [status, setStatus] = useState<CopyStatus>('idle')
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = useCallback(
    async (value: string) => {
      setStatus('copying')
      try {
        await navigator.clipboard.writeText(value)
        setStatus('copied')
      } catch {
        setStatus('error')
      }
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setStatus('idle'), resetAfter)
    },
    [resetAfter],
  )

  return { status, copy }
}