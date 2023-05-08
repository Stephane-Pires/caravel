import { allContents } from "@/.contentlayer/generated"
import { compareDesc } from "date-fns"
import Image from "next/image"

// export const generateMetadata = ({ params }) => {
//   const content = allContents.find(
//     (content) => content._raw.flattenedPath === params.slug
//   )
//   return { title: content.title }
// }

export default function Blog() {
  const allContentSortedByDateDesc = allContents.sort((a, b) =>
    compareDesc(new Date(a.date), new Date(b.date))
  )

  const allFontmatter = allContentSortedByDateDesc.map(
    ({ title, image, date, subject, category, url, _id }) => ({
      title,
      image,
      date,
      subject,
      category,
      url,
      id: _id,
    })
  )

  return (
    <main className="flex min-h-screen flex-col items-center  p-10">
      <div className="mb-8 mt-4 flex flex-row items-center gap-8 align-middle font-serif text-4xl text-emerald-200 underline decoration-double decoration-2 sm:text-6xl ">
        <div className="relative h-[150px] w-[150px] ">
          <Image src="/logbook/logbook.png" alt="Icon logbook" fill />
        </div>
      </div>

      <div className="grid gap-8 p-10 lg:grid-cols-4 xl:grid-cols-8">
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-100`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-200`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-300`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-400`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-500`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-600`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-700`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-800`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-primary-900`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-100`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-200`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-300`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-400`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-500`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-600`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-700`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-800`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-accent-900`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-100`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-200`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-300`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-400`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-500`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-600`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-700`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-800`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-blue-900`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-100`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-200`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-300`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-400`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-500`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-600`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-700`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-800`}></div>
        <div className={`m-4 h-40 w-40 rounded-xl bg-slate-900`}></div>
      </div>
    </main>
  )
}
