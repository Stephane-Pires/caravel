import { Mdx } from "@/components/Mdx"
import { Star } from "@/components/Star"
import { STAR } from "@/enums/stars"
import { Content, allContents } from "contentlayer/generated"
import Image from "next/image"
import { notFound } from "next/navigation"

export const generateMetadata = async ({ params }: BlogContentProps) => {
  const { slug } = await params
  const content = allContents.find(
    (content) => content._raw.flattenedPath === slug,
  )

  if (content) {
    return { title: content.title }
  }
}

export async function generateStaticParams() {
  return allContents.map((content) => ({
    slug: content.url,
  }))
}

interface BlogContentProps {
  params: Promise<{
    slug: Content["url"]
  }>
}

export default async function BlogContent({ params }: BlogContentProps) {
  const { slug } = await params

  const findContent = (slug: Content["url"]) => {
    const resultat = allContents.find((content) => content.url === slug)

    if (resultat) {
      return resultat
    } else {
      notFound()
    }
  }

  const content = findContent(slug)

  return (
    <main className="flex min-h-screen flex-col items-center gap-10 px-2 pt-20 sm:justify-between sm:px-10">
      <div className="absolute -z-10 hidden h-[400px] w-full sm:block">
        <Image
          src={`/logbook/card/${content.image}`}
          alt="My Image"
          fill
          className="object-cover"
        />

        <div className="relative size-full bg-black/60 text-center align-middle">
          <div className="relative top-40 font-script text-6xl text-blue-300">
            {content.title}
          </div>
        </div>
      </div>
      <Star star={content.star as STAR} />
      <Mdx code={content.body.code} />

      <div className="relative bottom-0 -z-10 hidden h-[125px] w-screen sm:block">
        <Image
          alt="sea wave a the bottom of the page"
          src="/wave/animated-wave.svg"
          fill
          className="object-cover"
        />
      </div>
    </main>
  )
}
