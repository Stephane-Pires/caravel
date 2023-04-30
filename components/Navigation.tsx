"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAVIGATION = {
  LOGBOOK: {
    pathname: "/logbook",
  },
  LANDING_PAGE: {
    pathname: "/",
  },
} as const

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="col-span-2 m-2 flex flex-row items-center justify-center font-sans text-2xl text-primary-600 hover:text-primary-300">
      <Link
        href={NAVIGATION.LOGBOOK.pathname}
        className={
          pathname === NAVIGATION.LOGBOOK.pathname
            ? "underline decoration-double"
            : ""
        }
      >
        Logbook
      </Link>
    </nav>
  )
}
