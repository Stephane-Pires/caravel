"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { type MouseEvent, useCallback, useMemo } from "react"

// Lo-fi is the classic site, hi-fi the 3D cabin. Switching keeps your place:
// each classic page has a close-up in the cabin, and the other way round.
// It is pinned to the same corner in both, so switching never moves it.
const CLOSE_UPS = [
  { pathname: "/logbook", closeUp: "logbook" },
  { pathname: "/projects", closeUp: "chart" },
  { pathname: "/about-me", closeUp: "poster" },
] as const
const CABIN = "/cabin"

function hiFiHref(pathname: string) {
  const match = CLOSE_UPS.find((page) => pathname.startsWith(page.pathname))
  return { pathname: CABIN, hash: match?.closeUp }
}

// the cabin changes its #close-up outside React, so the way back is read when clicked
function loFiHref(hash: string) {
  const id = hash.replace("#", "")
  if (id === "chest") return "/about-me"
  return CLOSE_UPS.find((page) => page.closeUp === id)?.pathname ?? "/"
}

const SEGMENT =
  "rounded-full px-3 py-1 transition-colors aria-[current=page]:bg-amber-300 aria-[current=page]:text-slate-900"

export function FidelitySwitch() {
  const pathname = usePathname()
  const router = useRouter()
  const hiFi = pathname.startsWith(CABIN)
  // in the cabin there is no close-up to match, so this is plain /cabin
  const hiFiLink = useMemo(() => hiFiHref(pathname), [pathname])

  const goLoFi = useCallback(
    (event: MouseEvent<HTMLAnchorElement>) => {
      const href = loFiHref(window.location.hash)
      if (href === "/") return
      event.preventDefault()
      router.push(href)
    },
    [router],
  )

  return (
    <nav
      aria-label="Site version"
      className="fidelity pointer-events-auto fixed top-10 right-4 z-[60] flex -translate-y-1/2 items-center gap-1 rounded-full border-2 border-amber-300 bg-slate-900/80 p-0.5 font-sans text-sm font-bold text-amber-300 md:top-12"
    >
      <Link
        href="/"
        onClick={hiFi ? goLoFi : undefined}
        aria-current={hiFi ? undefined : "page"}
        title="The classic site"
        className={`${SEGMENT} ${hiFi ? "hover:bg-amber-300/20" : ""}`}
      >
        Lo-fi
      </Link>
      <Link
        href={hiFiLink}
        aria-current={hiFi ? "page" : undefined}
        title="The 3D captain's cabin"
        className={`${SEGMENT} ${hiFi ? "" : "hover:bg-amber-300/20"}`}
      >
        Hi-fi
      </Link>
    </nav>
  )
}
