import Image from "next/image"

interface TimelineIcon {
  icon: string
  link?: string
}

export function TimelineIcon({ icon, link }: TimelineIcon) {
  return (
    <>
      {link ? (
        <a href={link}>
          <div className="flex h-12 w-12 basis-2/12 items-center justify-center rounded-full border-2 border-primary-700 bg-primary-500 p-3 font-mono ">
            <div className=" flex h-10 w-10 scale-150 items-center justify-center">
              <Image
                height={30}
                width={30}
                src={icon}
                className="rounded-full"
                alt="Icon that represent the section"
              />
            </div>
          </div>
        </a>
      ) : (
        <div className="flex h-12 w-12 basis-2/12 items-center justify-center rounded-full border-2 border-primary-700 bg-primary-500 p-3 font-mono ">
          <div className=" flex h-10 w-10 scale-150 items-center justify-center">
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
