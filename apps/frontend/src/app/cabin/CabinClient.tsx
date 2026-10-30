"use client"

import { useEffect } from "react"

import "./cabin.css"
import { CABIN_MARKUP } from "./markup"

// static markup: one object for the lifetime of the module
const MARKUP = { __html: CABIN_MARKUP }

export function CabinClient() {
  useEffect(() => {
    let cancelled = false
    let dispose: (() => void) | undefined

    // The scene loads after the page is on screen; a cancelled effect (React's
    // dev double-mount, or leaving the page early) never starts a second scene
    async function start() {
      try {
        const { mountCabin } = await import("@/cabin/cabin.js")
        if (cancelled) return
        const cleanup = await mountCabin()
        if (cancelled) cleanup()
        else dispose = cleanup
      } catch (error) {
        console.error("The cabin could not start", error)
      }
    }
    void start()

    return () => {
      cancelled = true
      dispose?.()
    }
  }, [])

  return (
    <div
      className="cabin"
      dangerouslySetInnerHTML={MARKUP}
    />
  )
}
