'use client'

import { useEffect, useRef } from 'react'

export const useUnfocusItem = (
  callback: () => void,
  exclusionRef?: React.RefObject<HTMLElement | null>,
): React.RefObject<any> => {
  const itemRef = useRef<any>(null)

  useEffect(() => {
    const handleBlur = (event: Event) => {
      const clickedOutside =
        itemRef.current && !itemRef.current.contains(event.target as Node)

      const clickedOnExclusion =
        exclusionRef &&
        exclusionRef.current &&
        exclusionRef.current.contains(event.target as Node)

      if (clickedOutside && !clickedOnExclusion) {
        callback()
      }
    }

    document.addEventListener('click', handleBlur)

    return () => {
      document.removeEventListener('click', handleBlur)
    }
  }, [callback, exclusionRef])

  return itemRef
}
