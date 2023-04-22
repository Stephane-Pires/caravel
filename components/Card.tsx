import { Tag } from "@/components/Tag"
import { SUBJECT, TYPE } from "@/enums/tag"
import { CalendarDaysIcon } from "@heroicons/react/24/solid"
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
    <div className="my-3 flex max-w-[500px] flex-col rounded-lg  border-l-4  border-lime-900 bg-lime-600 p-2 shadow-sm transition delay-100 ease-in-out hover:bg-lime-500 active:scale-105 active:bg-lime-500">
      <h3 className="m-4 py-2 text-center font-serif text-2xl">{title}</h3>

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
