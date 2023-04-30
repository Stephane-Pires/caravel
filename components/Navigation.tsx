"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const NAVIGATION = {
  LOGBOOK: {
    pathname: "/logbook",
    name: "Logbook",
  },
  LANDING_PAGE: {
    pathname: "/",
    name: "Landing page",
  },
  SANDBOX: {
    pathname: "/sandbox",
    name: "Sandbox",
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
    <nav className="col-span-2 m-2 flex flex-row items-center justify-center gap-8 ">
      <Link
        href={NAVIGATION.LOGBOOK.pathname}
        className={`font-sans text-2xl text-primary-600 hover:text-primary-300 ${
          isActivePathname(pathname, NAVIGATION.LOGBOOK.pathname)
            ? "underline decoration-accent-500 decoration-dotted"
            : ""
        }`}
      >
        {NAVIGATION.LOGBOOK.name}
      </Link>

      <Link
        href={NAVIGATION.SANDBOX.pathname}
        className={`font-sans text-2xl text-primary-600 hover:text-primary-300 ${
          isActivePathname(pathname, NAVIGATION.SANDBOX.pathname)
            ? "underline decoration-accent-500 decoration-dotted"
            : ""
        }`}
      >
        {NAVIGATION.SANDBOX.name}
      </Link>
    </nav>
  )
}
