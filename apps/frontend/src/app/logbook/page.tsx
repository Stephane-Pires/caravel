import { allContents } from "contentlayer/generated"
import { Card } from "@/components/Card"
import { CATEGORY, SUBJECT } from "@/enums/tag"
import { compareDesc } from "date-fns"
import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Logbook",
}

export default function Logbook() {
  const allContentSortedByDateDesc = allContents.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date)),
  )

  const allFontmatter = allContentSortedByDateDesc.map(
    ({ title, image, date, subject, category, url, _id }) => ({
      category,
      date,
      id: _id,
      image,
      subject,
      title,
      url,
    }),
  )

  return (
    <main className="flex min-h-screen flex-col items-center p-10 py-20">
      <div className="mb-8 mt-4 flex flex-row items-center gap-8 align-middle font-serif text-4xl text-emerald-200 underline decoration-double decoration-2 sm:text-6xl">
        <div className="mt-10 flex size-[150px] items-center justify-center">
          <Image
            src="/handraw/primary/sticky-note.svg"
            alt="logo caravel"
            width={80}
            height={80}
          />
        </div>
      </div>

      <div className="grid gap-8 p-4 lg:grid-cols-2 2xl:grid-cols-4">
        {allFontmatter.map(
          ({ title, image, date, subject, category, url, id }) => {
            return (
              <Link
                key={id}
                href={`/logbook/${url}`}
              >
                <Card
                  title={title}
                  image={image}
                  date={date}
                  subject={subject as SUBJECT}
                  category={category as CATEGORY}
                />
              </Link>
            )
          },
        )}
      </div>
    </main>
  )
}
