import { Tag } from "@/components/Tag"
import { CATEGORY, SUBJECT } from "@/enums/tag"
import { CalendarDaysIcon } from "@heroicons/react/24/solid"
import dayjs from "dayjs"
import Image from "next/image"

interface Card {
  title: string
  date: string
  subject: SUBJECT
  category: CATEGORY
  image: string
}

export function Card({ title, date, subject, category, image }: Card) {
  return (
    <div className="my-3 flex h-[400px] w-[320px] flex-col justify-between rounded-lg border-l-4 border-t-4 border-primary-900 bg-primary-700 p-2 transition delay-100 ease-in-out hover:bg-primary-500 active:scale-105 active:bg-primary-500">
      <h3 className="m-4 py-2 text-center font-script text-2xl text-blue-900 underline decoration-dotted underline-offset-2">
        {title}
      </h3>

      <div className="relative h-[200px] ">
        <Image
          src={`/logbook/card/${image}`}
          alt="My Image"
          fill
          className="rounded-md object-cover"
        />
      </div>

      <div className="flex flex-row py-2 font-code text-blue-900">
        <CalendarDaysIcon className="mr-2 h-6 w-6 italic text-blue-900" />{" "}
        {dayjs(date).format("dddd D MMMM YYYY")}
      </div>

      <div className="flex flex-row flex-wrap justify-between">
        <Tag tag={subject} />
        <Tag tag={category} />
      </div>
    </div>
  )
}
