import Image from "next/image"
import Link from "next/link"
import { useMemo } from "react"

interface TimelineIcon {
  icon: string
  link?: string
}

export function TimelineIcon({ icon, link }: TimelineIcon) {
  const hrefMemoized = useMemo(
    () => (url: string) => {
      return { pathname: url }
    },
    [],
  )

  return (
    <>
      {link ? (
        <Link href={hrefMemoized(link)}>
          <div className="border-primary-700 bg-primary-500 flex size-12 basis-2/12 items-center justify-center rounded-full border-2 p-3 font-mono">
            <div className="flex size-10 scale-150 items-center justify-center">
              <Image
                height={30}
                width={30}
                src={icon}
                className="rounded-full"
                alt="Icon that represent the section"
              />
            </div>
          </div>
        </Link>
      ) : (
        <div className="border-primary-700 bg-primary-500 flex size-12 basis-2/12 items-center justify-center rounded-full border-2 p-3 font-mono">
          <div className="flex size-10 scale-150 items-center justify-center">
            <Image
              height={30}
              width={30}
              src={icon}
              className="rounded-full"
              alt="Icon that represent the section"
            />
          </div>
        </div>
      )}
    </>
  )
}
