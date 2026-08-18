import { useEffect, useState } from 'react'

const QUERY = '(max-width: 800px)'

export function usePrefersNarrow(): boolean {
  const [narrow, setNarrow] = useState(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return false
    return window.matchMedia(QUERY).matches
  })

  useEffect(() => {
    const media = window.matchMedia(QUERY)
    const onChange = () => setNarrow(media.matches)
    onChange()
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [])

  return narrow
}
