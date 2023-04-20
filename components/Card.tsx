import { Tag } from "@/components/Tag"
import { SUBJECT, TYPE } from "@/enums/tag"
import { CalendarDaysIcon, CalendarIcon } from "@heroicons/react/24/solid"
import Image from "next/image"

// books, blog

interface Card {
  title: string
  date: string
  subject: SUBJECT
  type: TYPE
  image: string
}

export function Card({ title, date, subject, type, image }: Card) {
  return (
    <div className="my-2 flex max-w-[500px] flex-col rounded-lg border-l-4 border-cyan-500 bg-pink-500 p-2 hover:border-y-2 hover:border-l-8 hover:border-r-2">
      <h3 className="py-2 font-serif text-2xl">{title}</h3>

      <Image
        alt="image of the card"
        src={`/logbook/card/${image}`}
        width={300}
        height={200}
      />
      <div className="flex flex-row py-2">
        <CalendarDaysIcon className="mr-2 h-6 w-6 font-mono italic" /> {date}
      </div>

      <div className="flex flex-row flex-wrap justify-between">
        <Tag tag={subject} />
        <Tag tag={type} />
      </div>
    </div>
  )
}
