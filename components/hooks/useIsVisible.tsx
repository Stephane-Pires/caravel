import { useEffect, useState } from "react"

export function useIsVisible(domElement: HTMLElement) {
  const [isIntersecting, setIntersecting] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIntersecting(entry.isIntersecting)
      },
      {
        rootMargin: "-80px 0px 0px 0px",
        threshold: [1, 0.75, 0.5, 0],
      }
    )

    observer.observe(domElement)
    return () => {
      observer.disconnect()
    }
  }, [domElement])

  return isIntersecting
}
