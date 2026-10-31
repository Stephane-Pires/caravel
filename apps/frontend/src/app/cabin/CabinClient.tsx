"use client"

import { useEffect, useState, useSyncExternalStore } from "react"

import { track } from "@/lib/track"

import { CabinFallback } from "./CabinFallback"
import { CabinNote } from "./CabinNote"
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
  // the bottle's note (the booking form) is React's; the scene says when it's unrolled
  const [noteOpen, setNoteOpen] = useState(false)

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
          onNote: setNoteOpen,
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
    <div className={`cabin ${fonts.className}${noteOpen ? " note-open" : ""}`}>
      <CabinOverlay />
      <CabinNote open={noteOpen} />
    </div>
  )
}
