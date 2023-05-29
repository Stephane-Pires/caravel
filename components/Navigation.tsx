"use client"

import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

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
  ABOUT_ME: {
    pathname: "/about-me",
    name: "About Me",
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
    // grid-cols-3 gap-4 grid
    <nav className="m-2 hidden sm:col-span-2 sm:flex sm:flex-row sm:items-center sm:justify-between sm:gap-8">
      <div className="col-span-1 ml-4">
        <Link href="/">
          <Image
            src="/logbook/logbook.png"
            alt="logo caravel"
            width={60}
            height={60}
          />
        </Link>
      </div>

      <div className="mx-4 flex flex-row gap-8">
        <Link
          href={NAVIGATION.ABOUT_ME.pathname}
          className={`font-sans text-2xl font-bold hover:text-primary-300 ${
            isActivePathname(pathname, NAVIGATION.ABOUT_ME.pathname)
              ? "text-accent-500"
              : "text-primary-600"
          }`}
        >
          📔 {NAVIGATION.ABOUT_ME.name}
        </Link>
        <Link
          href={NAVIGATION.LOGBOOK.pathname}
          className={`font-sans text-2xl font-bold hover:text-primary-300 ${
            isActivePathname(pathname, NAVIGATION.LOGBOOK.pathname)
              ? "text-accent-500"
              : "text-primary-600"
          }`}
        >
          📔 {NAVIGATION.LOGBOOK.name}
        </Link>

        <Link
          href={NAVIGATION.SANDBOX.pathname}
          className={`font-sans text-2xl font-bold hover:text-primary-300 ${
            isActivePathname(pathname, NAVIGATION.SANDBOX.pathname)
              ? "text-accent-500"
              : "text-primary-600"
          }`}
        >
          🏖️ {NAVIGATION.SANDBOX.name}
        </Link>
      </div>
    </nav>
  )
}

export function NavigationMobile() {
  const pathname = usePathname()

  const [showLinks, setShowLinks] = useState(false)

  const handleClickIcon = () =>
    setShowLinks((previousShowLinks) => !previousShowLinks)

  useEffect(() => {
    setShowLinks(false)
  }, [pathname])

  return (
    <nav
      className={`flex flex-row sm:hidden ${
        showLinks
          ? "h-screen w-screen flex-col items-start bg-transparent/90 backdrop-blur-md"
          : "items-center justify-between"
      }`}
    >
      <div className="flex w-full flex-row items-center justify-between">
        <div className="col-span-1 ml-4">
          <Link href="/">
            <Image
              src="/logbook/logbook.png"
              alt="logo caravel"
              width={60}
              height={60}
            />
          </Link>
        </div>

        {showLinks ? (
          <XMarkIcon className="m-2 h-10 w-10" onClick={handleClickIcon} />
        ) : (
          <Bars2Icon className="m-2 h-10 w-10" onClick={handleClickIcon} />
        )}
      </div>

      {showLinks && (
        <div className=" mt-28 flex flex-col justify-around gap-8">
          <Link
            href={NAVIGATION.ABOUT_ME.pathname}
            className={`m-2 rounded-lg p-4 font-sans text-2xl font-bold ${
              isActivePathname(pathname, NAVIGATION.ABOUT_ME.pathname)
                ? "text-accent-500"
                : "text-primary-600"
            }`}
          >
            📔 {NAVIGATION.ABOUT_ME.name}
          </Link>
          <Link
            href={NAVIGATION.LOGBOOK.pathname}
            className={`m-2 rounded-lg p-4 font-sans text-2xl font-bold ${
              isActivePathname(pathname, NAVIGATION.LOGBOOK.pathname)
                ? "text-accent-500"
                : "text-primary-600"
            }`}
          >
            📔 {NAVIGATION.LOGBOOK.name}
          </Link>

          <Link
            href={NAVIGATION.SANDBOX.pathname}
            className={`m-2 rounded-lg p-4 font-sans text-2xl font-bold ${
              isActivePathname(pathname, NAVIGATION.SANDBOX.pathname)
                ? "text-accent-500"
                : "text-primary-600"
            }`}
          >
            🏖️ {NAVIGATION.SANDBOX.name}
          </Link>
        </div>
      )}
    </nav>
  )
}
