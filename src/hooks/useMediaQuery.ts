import { useEffect, useState } from 'react'

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  )

  useEffect(() => {
    const media = window.matchMedia(query)
    const update = () => setMatches(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [query])

  return matches
}

/** Matches Tailwind's `md` breakpoint */
export const useIsDesktop = () => useMediaQuery('(min-width: 768px)')
/** Fine pointer that can hover: gates the cursor and hover-only effects */
export const useFinePointer = () => useMediaQuery('(hover: hover) and (pointer: fine)')
