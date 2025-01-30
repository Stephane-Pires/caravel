"use client"

import { Bars2Icon, XMarkIcon } from "@heroicons/react/24/solid"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useEffect, useState } from "react"

const NAVIGATION = {
  ABOUT_ME: {
    pathname: "/about-me",
    name: "About Me",
    icon: "person",
  },
  LOGBOOK: {
    pathname: "/logbook",
    name: "Logbook",
    icon: "sticky-note",
  },
  PROJECTS: {
    pathname: "/projects",
    name: "Projects",
    icon: "code",
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
    <nav className="m-2 hidden md:col-span-2 md:flex md:flex-row md:items-center md:justify-between md:gap-8">
      <div className="col-span-1 ml-4">
        <Link href="/">
          <Image
            src="/logbook/colorized-logo.png"
            alt="logo caravel"
            width={60}
            height={60}
          />
        </Link>
      </div>

      <div className="mx-4 flex flex-row gap-8">
        {Object.values(NAVIGATION).map((navigation) => (
          <Link
            href={navigation.pathname}
            key={navigation.name}
            className={`hover:text-primary-300 font-sans text-2xl font-bold ${
              isActivePathname(pathname, navigation.pathname)
                ? "text-accent-500"
                : "text-primary-600"
            }`}
          >
            <div className="flex flex-row gap-2">
              <Image
                src={`/handraw/${
                  isActivePathname(pathname, navigation.pathname)
                    ? "accent"
                    : "primary"
                }/${navigation.icon}.svg`}
                alt="logo caravel"
                width={20}
                height={20}
              />
              {navigation.name}
            </div>
          </Link>
        ))}
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
      className={`flex flex-row md:hidden ${
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
          <XMarkIcon
            className="m-2 size-10"
            onClick={handleClickIcon}
          />
        ) : (
          <Bars2Icon
            className="m-2 size-10"
            onClick={handleClickIcon}
          />
        )}
      </div>

      {showLinks && (
        <div className="mt-14 flex flex-col justify-around gap-8">
          {Object.values(NAVIGATION).map((navigation) => (
            <Link
              key={navigation.name}
              href={navigation.pathname}
              className={`m-2 rounded-lg p-4 font-sans text-2xl font-bold ${
                isActivePathname(pathname, navigation.pathname)
                  ? "text-accent-500"
                  : "text-primary-600"
              }`}
            >
              <div className="flex flex-row gap-2">
                <Image
                  src={`/handraw/${
                    isActivePathname(pathname, navigation.pathname)
                      ? "accent"
                      : "primary"
                  }/${navigation.icon}.svg`}
                  alt="logo caravel"
                  width={20}
                  height={20}
                />
                {navigation.name}
              </div>
            </Link>
          ))}
        </div>
      )}
    </nav>
  )
}
