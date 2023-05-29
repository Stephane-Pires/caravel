import { useEffect, useState } from "react"

export function usePercentScrolled() {
  const [percentScrolled, setPercentScrolled] = useState(0)

  useEffect(() => {
    window.addEventListener("scroll", scrollHeight)
    return () => window.removeEventListener("scroll", scrollHeight)
  })

  const scrollHeight = () => {
    let el = document.documentElement
    let ScrollTop = el.scrollTop || document.body.scrollTop
    let ScrollHeight = el.scrollHeight || document.body.scrollHeight

    let percent = (ScrollTop / (ScrollHeight - el.clientHeight)) * 100
    console.log("el", el)

    setPercentScrolled(percent)
  }

  return percentScrolled
}
