"use client"

import Link, { LinkProps } from "next/link"
import { usePathname } from "next/navigation"

const NAVIGATION = {
  LOGBOOK: {
    pathname: "/logbook",
  },
  LANDING_PAGE: {
    pathname: "/",
  },
} as const

type pathname = (typeof NAVIGATION)[keyof typeof NAVIGATION]["pathname"]

function isActivePathname(pathname: string, navigationPathname: pathname) {
  const regex = new RegExp("\\" + navigationPathname)

  return regex.test(pathname)
}

export function Navigation() {
  const pathname = usePathname()

  return (
    <nav className="col-span-2 m-2 flex flex-row items-center justify-center font-sans text-2xl text-primary-600 hover:text-primary-300">
      <Link
        href={NAVIGATION.LOGBOOK.pathname}
        className={
          isActivePathname(pathname, NAVIGATION.LOGBOOK.pathname)
            ? "underline decoration-accent-500 decoration-dotted"
            : ""
        }
      >
        Logbook
      </Link>
    </nav>
  )
}
