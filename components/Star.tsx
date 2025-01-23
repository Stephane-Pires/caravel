import { STAR } from "@/enums/stars"
import Image from "next/image"

interface StarProps {
  star: STAR
}

const STAR_INFO = {
  ONE: {
    src: "/stars/star.png",
    tooltip: "Light breeze",
  },
  TWO: {
    src: "/stars/two-stars.png",
    tooltip: "Fresh breeze",
  },
  THREE: {
    src: "/stars/three-stars.png",
    tooltip: "High wind",
  },
} as const

export function Star({ star }: StarProps) {
  const { src, tooltip } = STAR_INFO[star]

  return (
    <div className="group rounded-full border-4 border-solid border-primary-800 bg-blue-300 sm:mt-[335px]">
      <Image
        alt="wind force weak"
        src={src}
        width={120}
        height={120}
        className="rounded-full"
      />

      <div className="invisible absolute left-[calc(50%-56px)] z-10 flex w-28 justify-center rounded-lg px-3 py-2 text-sm font-medium text-blue-900 delay-100 duration-100 ease-in-out group-hover:visible group-hover:transition-all dark:bg-accent-500">
        {tooltip}
        <div
          className="absolute -top-1 left-[calc(50%-5px)] size-0
  border-x-[5px] 
  border-b-[6px] 
  border-x-transparent border-b-accent-500"
        />
      </div>
    </div>
  )
}
