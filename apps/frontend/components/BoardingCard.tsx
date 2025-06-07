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

export function BoardingCardDesktop({
  title,
  duration,
  skills,
  image,
  url,
}: BoardingCard) {
  return (
    <a href={url}>
      <div className="border-primary-900 bg-primary-700 hover:bg-primary-500 active:bg-primary-500 h-80 min-w-[660px] max-w-[660px] -rotate-6 rounded-xl border-l-4 border-t-4 p-2 transition delay-100 ease-in-out hover:rotate-0 active:scale-105">
        <div className="m-2 flex flex-row">
          <h2 className="font-script mr-8 text-blue-900">{title}</h2>
          <div className="flex translate-y-1 flex-row gap-4">
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
          </div>
        </div>
        <div className="m-2 mt-4 flex flex-row justify-between">
          <div className="font-script text-blue-900/70">Beginning Date :</div>
          <div className="font-script text-blue-900/70">Arrival Date :</div>
        </div>
        <div className="m-2 flex flex-row justify-between">
          <div className="border-primary-900 border-b-2 font-mono text-blue-900">
            {duration.start}
          </div>
          <div className="border-primary-900 border-b-2 font-mono text-blue-900">
            {duration.end}
          </div>
        </div>
        <div className="flex flex-row justify-between gap-2 p-2">
          <div className="relative h-[172px] min-w-[300px]">
            <Image
              src={image}
              alt="My Image"
              fill
              className="rounded-md object-cover"
            />
          </div>
          <div className="flex flex-row flex-wrap items-center justify-center gap-2">
            {skills.map((skill: SOFT_SKILLS | TECHNO) => (
              <Tag
                tag={skill}
                key={skill}
              />
            ))}
          </div>
        </div>
      </div>
    </a>
  )
}

export function BoardingCardMobile({
  title,
  duration,
  skills,
  image,
  url,
}: BoardingCard) {
  return (
    <a href={url}>
      <div className="border-primary-900 bg-primary-700 hover:bg-primary-500 active:bg-primary-500 h-auto min-w-[350px] max-w-[350px] rounded-lg border-l-4 border-t-4 p-2 transition delay-100 ease-in-out active:scale-105">
        <div className="m-2 flex flex-row">
          <div className="flex translate-y-1 flex-row gap-4">
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
            <div className="bg-accent-300 size-4 rotate-45 skew-y-[-45deg]" />
          </div>
        </div>
        <div className="m-2 flex w-auto flex-row justify-center">
          <h2 className="font-script mt-2 text-xl text-blue-900">{title}</h2>
        </div>
        <div className="m-2 mt-4 flex flex-row justify-between">
          <div className="font-script text-blue-900/70">Beginning Date :</div>
          <div className="font-script text-blue-900/70">Arrival Date :</div>
        </div>
        <div className="m-2 flex flex-row justify-between">
          <div className="border-primary-900 border-b-2 font-mono text-blue-900">
            {duration.start}
          </div>
          <div className="border-primary-900 border-b-2 font-mono text-blue-900">
            {duration.end}
          </div>
        </div>
        <div className="relative h-[172px] min-w-[300px]">
          <Image
            src={image}
            alt="My Image"
            fill
            className="rounded-md object-cover"
          />
        </div>
        <div className="flex flex-row flex-wrap items-center justify-center gap-2">
          {skills.map((skill: SOFT_SKILLS | TECHNO) => (
            <Tag
              tag={skill}
              key={skill}
            />
          ))}
        </div>
      </div>
    </a>
  )
}

export function BoardingCard({
  title,
  duration,
  skills,
  image,
  url,
}: BoardingCard) {
  return (
    <div>
      <div className="hidden md:flex">
        <BoardingCardDesktop
          title={title}
          duration={duration}
          skills={skills}
          image={image}
          url={url}
        />
      </div>
      <div className="flex md:hidden">
        <BoardingCardMobile
          title={title}
          duration={duration}
          skills={skills}
          image={image}
          url={url}
        />
      </div>
    </div>
  )
}
