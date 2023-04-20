import { Tag } from "@/components/Tag"
import { SUBJECT, TYPE } from "@/enums/tag"

// books, blog

interface Card {
  title: string
  summary: string
  date: string
  subject: SUBJECT
  type: TYPE
}

export function Card({ title, summary, date, subject, type }: Card) {
  return (
    <div className="flex max-w-[30vw] flex-col rounded-lg bg-pink-500 p-2">
      <h3 className="text-2xl">{title}</h3>

      <span className="max-h-[30vh]">{date}</span>

      <p>{summary}</p>

      <div className="flex flex-row flex-wrap">
        <Tag tag={subject} />
        <Tag tag={type} />
        <Tag tag={type} />
        <Tag tag={type} />
        <Tag tag={type} />
        <Tag tag={type} />
        <Tag tag={type} />
      </div>
    </div>
  )
}
