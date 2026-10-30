"use client"

import { useEffect, useSyncExternalStore } from "react"

import { track } from "@/lib/track"

import { CabinFallback } from "./CabinFallback"
import { CabinOverlay } from "./CabinOverlay"
import "./cabin.css"
import type { CabinData } from "./cabinData"
import type { CabinFonts } from "./fonts"
import { type Support, detectSupport } from "./support"

const subscribe = () => () => {}
const serverSupport = (): Support => "checking"

export function CabinClient({
  data,
  fonts,
}: {
  data: CabinData
  fonts: CabinFonts
}) {
  const status = useSyncExternalStore(subscribe, detectSupport, serverSupport)

  useEffect(() => {
    if (status !== "capable") return
    let cancelled = false
    let dispose: (() => void) | undefined

    // The scene loads after the page is on screen; a cancelled effect (React's
    // dev double-mount, or leaving the page early) never starts a second scene
    async function start() {
      try {
        const startedAt = performance.now()
        const { mountCabin } = await import("@/cabin/cabin.js")
        if (cancelled) return
        const cleanup = await mountCabin({
          ...data,
          fonts: fonts.families,
          track,
          startedAt,
        })
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
  }, [data, fonts, status])

  if (status === "limited") return <CabinFallback />

  return (
    <div className={`cabin ${fonts.className}`}>
      <CabinOverlay />
    </div>
  )
}
