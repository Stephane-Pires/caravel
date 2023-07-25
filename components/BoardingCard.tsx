import { Tag } from "@/components/Tag"
import { SOFT_SKILLS, TECHNO } from "@/enums/tag"
import Image from "next/image"

interface BoardingCard {
  title: string
  duration: {
    start: string
    end: string
  }
  // WORKAROUND DUE TO READONLY (because curriculum is readonly)
  skills: any
  image: string
  url: string
}

export function BoardingCard({
  title,
  duration,
  skills,
  image,
  url,
}: BoardingCard) {
  return (
    <a href={url}>
      <div className=" h-80 min-w-[660px] max-w-[660px] -rotate-6 rounded-xl border-l-4 border-t-4 border-primary-900 bg-primary-700 p-2 transition delay-100 ease-in-out hover:rotate-0 hover:bg-primary-500 active:scale-105 active:bg-primary-500">
        <div className="m-2 flex flex-row">
          <h2 className="mr-8 font-script text-blue-900">{title}</h2>
          <div className="flex translate-y-1 flex-row gap-4">
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
            <div className="h-4 w-4 rotate-45 -skew-y-[45deg] bg-accent-300" />
          </div>
        </div>
        <div className="m-2 mt-4 flex flex-row justify-between">
          <div className="font-script text-blue-900/70">Beginning Date :</div>
          <div className="font-script text-blue-900/70">Arrival Date :</div>
        </div>
        <div className="m-2 flex flex-row justify-between">
          <div className="border-b-2 border-primary-900  font-mono text-blue-900">
            {duration.start}
          </div>
          <div className="border-b-2 border-primary-900 font-mono text-blue-900">
            {duration.end}
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2 p-2">
          <div className="relative h-[172px] min-w-[300px] ">
            <Image
              src={image}
              alt="My Image"
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-2">
            {skills.map((skill: SOFT_SKILLS | TECHNO) => (
              <Tag tag={skill} key={skill} />
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}
