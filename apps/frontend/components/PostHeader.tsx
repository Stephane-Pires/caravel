import { MEASURE } from "@/components/Mdx"
import dayjs from "dayjs"
import Link from "next/link"

const DATE_FORMAT = "D MMMM YYYY"

interface PostHeaderProps {
  title: string
  // the post's claim, one sentence a line: what a reader keeps if they stop after ten seconds
  lede?: Array<string>
  date: string
  updated?: string
}

export function PostHeader({ title, lede, date, updated }: PostHeaderProps) {
  return (
    <header className={`${MEASURE} flex flex-col pt-4 font-sans sm:pt-10`}>
      <Link
        href="/logbook"
        className="self-start text-sm font-bold tracking-wide text-blue-300 uppercase underline-offset-4 hover:underline"
      >
        Logbook
      </Link>

      <h1 className="mt-3 text-4xl leading-tight font-bold text-balance text-blue-300 sm:text-5xl sm:leading-tight">
        {title}
      </h1>

      {lede?.length && (
        <p className="mt-4 text-xl leading-snug text-blue-100 italic sm:text-2xl sm:leading-snug">
          {lede.map((sentence) => (
            <span
              key={sentence}
              className="block"
            >
              {sentence}
            </span>
          ))}
        </p>
      )}

      <div className="mt-6 border-t border-slate-700 pt-3 text-sm text-blue-100">
        <p className="flex flex-wrap items-center gap-x-2">
          <time dateTime={date}>{dayjs(date).format(DATE_FORMAT)}</time>
          {updated && (
            <>
              <span aria-hidden>·</span>
              <span>
                Updated{" "}
                <time dateTime={updated}>
                  {dayjs(updated).format(DATE_FORMAT)}
                </time>
              </span>
            </>
          )}
        </p>
      </div>
    </header>
  )
}
