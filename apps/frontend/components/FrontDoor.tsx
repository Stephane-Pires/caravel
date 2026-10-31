"use client"

import { useRouter } from "next/navigation"
import { useEffect, useSyncExternalStore } from "react"

import { detectSupport } from "@/src/app/cabin/support"
import { getFidelity } from "@/lib/fidelity"
import { track } from "@/lib/track"

// The front door: a visitor whose device draws the cabin smoothly sails straight into it,
// unless they chose the classic site (the Lo-fi switch) or asked their browser to save data.
// Crawlers and the first paint still get the classic home page: this only runs in the browser.
function shouldSail() {
  const connection = (
    navigator as Navigator & { connection?: { saveData?: boolean } }
  ).connection
  if (connection?.saveData) return false
  if (getFidelity() === "lo-fi") return false
  return detectSupport() === "capable"
}
const subscribe = () => () => {}
const onServer = () => false

export function FrontDoor() {
  const router = useRouter()
  const sail = useSyncExternalStore(subscribe, shouldSail, onServer)

  useEffect(() => {
    if (!sail) return
    track("site.frontdoor", { to: "hi-fi" })
    router.replace("/cabin") // replace: the back button doesn't land here and bounce again
  }, [router, sail])

  if (!sail) return null
  // the cabin's own loading colour, so the classic home doesn't flash before the voyage
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 z-[100] bg-[#0d1626]"
    />
  )
}
