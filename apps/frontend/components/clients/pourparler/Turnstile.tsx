"use client"

import Script from "next/script"
import { useCallback, useEffect, useRef, useState } from "react"

// Cloudflare Turnstile: a privacy-friendly "are you human?" check, usually invisible.
// Without NEXT_PUBLIC_TURNSTILE_SITE_KEY (local development) nothing renders and the API doesn't ask.
export const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

interface TurnstileApi {
  render: (
    element: HTMLElement,
    options: {
      sitekey: string
      callback: (token: string) => void
      "expired-callback": () => void
      "error-callback": () => void
      theme?: "auto" | "light" | "dark"
    },
  ) => string
  reset: (widgetId: string) => void
  remove: (widgetId: string) => void
}

declare global {
  interface Window {
    turnstile?: TurnstileApi
  }
}

interface TurnstileProps {
  // the challenge token, or "" while there is none (expired, failed, not solved yet)
  onToken: (token: string) => void
  // change it to ask for a fresh token: each one is valid for a single booking
  resetKey?: number
}

export function Turnstile({ onToken, resetKey }: TurnstileProps) {
  const container = useRef<HTMLDivElement>(null)
  const widgetId = useRef<string | undefined>(undefined)
  const [scriptReady, setScriptReady] = useState(
    () => typeof window !== "undefined" && Boolean(window.turnstile),
  )
  const markScriptReady = useCallback(() => setScriptReady(true), [])

  useEffect(() => {
    const element = container.current
    if (!TURNSTILE_SITE_KEY || !scriptReady || !element || !window.turnstile)
      return
    widgetId.current = window.turnstile.render(element, {
      sitekey: TURNSTILE_SITE_KEY,
      callback: onToken,
      "expired-callback": () => onToken(""),
      "error-callback": () => onToken(""),
      theme: "auto",
    })
    return () => {
      if (widgetId.current) window.turnstile?.remove(widgetId.current)
      widgetId.current = undefined
    }
  }, [onToken, scriptReady])

  useEffect(() => {
    if (resetKey && widgetId.current) {
      onToken("")
      window.turnstile?.reset(widgetId.current)
    }
  }, [onToken, resetKey])

  if (!TURNSTILE_SITE_KEY) return null

  return (
    <>
      <Script
        src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
        strategy="afterInteractive"
        onReady={markScriptReady}
      />
      <div ref={container} />
    </>
  )
}
