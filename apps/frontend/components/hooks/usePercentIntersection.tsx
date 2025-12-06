/* eslint-disable no-magic-numbers */
import { useEffect, useState } from "react"

export function usePercentScrolled() {
  const [percentScrolled, setPercentScrolled] = useState(0)

  const scrollHeight = () => {
    const el = document.documentElement
    const scrollTop = el.scrollTop || document.body.scrollTop
    const scrollHeight = el.scrollHeight || document.body.scrollHeight

    const percent = (scrollTop / (scrollHeight - el.clientHeight)) * 100

    setPercentScrolled(percent)
  }

  useEffect(() => {
    window.addEventListener("scroll", scrollHeight)
    return () => window.removeEventListener("scroll", scrollHeight)
  })

  return percentScrolled
}
