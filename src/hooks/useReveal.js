import { useEffect, useRef, useState } from 'react'

/**
 * Reveals an element the first time it scrolls into view.
 *
 * Pair the returned ref/state with the `.reveal` utility in index.css:
 *
 *   const { ref, revealed } = useReveal()
 *   <div ref={ref} data-revealed={revealed} className="reveal">…</div>
 *
 * If IntersectionObserver is unavailable we reveal immediately, so content is
 * never trapped behind an animation that cannot run.
 *
 * @param {{ threshold?: number, rootMargin?: string }} [options]
 */
export function useReveal({ threshold = 0.15, rootMargin = '0px 0px -10% 0px' } = {}) {
  const ref = useRef(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true)
            observer.disconnect() // one-shot: no re-hiding on scroll back up
          }
        }
      },
      { threshold, rootMargin },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [threshold, rootMargin])

  return { ref, revealed }
}
