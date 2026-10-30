"use client"

import { useEffect, useSyncExternalStore } from "react"

import { CabinFallback } from "./CabinFallback"
import "./cabin.css"
import type { CabinData } from "./cabinData"
import { CABIN_MARKUP } from "./markup"

// static markup: one object for the lifetime of the module
const MARKUP = { __html: CABIN_MARKUP }

type Support = "checking" | "capable" | "limited"

// Can this browser draw the cabin smoothly? WebGL 2 on a real GPU: software renderers
// (SwiftShader, llvmpipe…) and GPUs the browser flags as slow get the plain pages instead.
// ?force=1 enters anyway, ?plain=1 shows the fallback (for testing).
// The answer is cached per query string, so following the fallback's "?force=1" link re-checks.
const cache = new Map<string, Support>()
function detectSupport(): Support {
  const key = window.location.search
  const known = cache.get(key)
  if (known) return known
  const result = checkSupport(new URLSearchParams(key))
  cache.set(key, result)
  return result
}
function checkSupport(params: URLSearchParams): Support {
  if (params.has("force")) return "capable"
  if (params.has("plain")) return "limited"
  try {
    const gl = document.createElement("canvas").getContext("webgl2")
    if (!gl) return "limited"
    const info = gl.getExtension("WEBGL_debug_renderer_info")
    const renderer = String(
      gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "",
    )
    const software =
      /swiftshader|llvmpipe|softpipe|lavapipe|software|basic render/i.test(
        renderer,
      )
    const slow = !document
      .createElement("canvas")
      .getContext("webgl2", { failIfMajorPerformanceCaveat: true })
    return software || slow ? "limited" : "capable"
  } catch {
    return "limited"
  }
}
const subscribe = () => () => {}
const serverSupport = (): Support => "checking"

export function CabinClient({ data }: { data: CabinData }) {
  const status = useSyncExternalStore(subscribe, detectSupport, serverSupport)

  useEffect(() => {
    if (status !== "capable") return
    let cancelled = false
    let dispose: (() => void) | undefined

    // The scene loads after the page is on screen; a cancelled effect (React's
    // dev double-mount, or leaving the page early) never starts a second scene
    async function start() {
      try {
        const { mountCabin } = await import("@/cabin/cabin.js")
        if (cancelled) return
        const cleanup = await mountCabin(data)
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
  }, [data, status])

  if (status === "limited") return <CabinFallback />

  return (
    <div
      className="cabin"
      dangerouslySetInnerHTML={MARKUP}
    />
  )
}
