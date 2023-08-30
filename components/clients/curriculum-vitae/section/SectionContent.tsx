"use client"

import { Tag } from "@/components/Tag"
import { SOFT_SKILLS, TECHNO } from "@/enums/tag"
import Image from "next/image"

interface SectionProps {
  section: {
    label: string
    content: {
      // WORKAROUND DUE TO READONLY (because curriculum is readonly)
      skills?: any
      paragraph: string
      // WORKAROUND DUE TO READONLY (because curriculum is readonly)
      missions?: any
      // WORKAROUND DUE TO READONLY (because curriculum is readonly)
      photos?: any
    }
  }
}

export function SectionContent({ section }: SectionProps) {
  return (
    <>
      <h3 className="my-10 text-center font-sans text-2xl font-bold text-blue-300">
        {section.label}
      </h3>

      {section.content.skills && (
        <div
          className="m-4 flex flex-row flex-wrap items-center justify-center gap-2
  "
        >
          {/* // WORKAROUND DUE TO READONLY (because curriculum is readonly)  */}
          {section.content.skills.map((skill: SOFT_SKILLS | TECHNO) => (
            <Tag
              tag={skill}
              key={skill}
            />
          ))}
        </div>
      )}
      <div className="my-10 indent-8">{section.content.paragraph}</div>

      {section.content.missions && (
        <ul className="mx-6 flex w-full list-outside list-disc list-image-[url(/logbook/mdx/paper-airplane.svg)] flex-col justify-center gap-4">
          {/* // WORKAROUND DUE TO READONLY (because curriculum is readonly) */}
          {section.content.missions.map((mission: string) => (
            <li key={mission}>{mission}</li>
          ))}
        </ul>
      )}

      {section.content.photos &&
        section.content.photos.map((photo: string) => (
          <div
            key={photo}
            className="relative -z-20 my-10 h-[600px] "
          >
            <Image
              src={photo}
              alt="My Image"
              fill
              className="rounded-md object-cover"
            />
          </div>
        ))}
    </>
  )
}
