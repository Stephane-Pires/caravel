import { Mdx } from "@/components/Mdx"
import { Star } from "@/components/Star"
import { STARS } from "@/enums/stars"
import { Content, allContents } from "contentlayer/generated"

export async function generateStaticParams() {
  return allContents.map((content) => ({
    slug: content.url,
  }))
}

export default function BlogContent({
  params: { slug },
}: {
  params: { slug: Content["url"] }
}) {
  const findCode = (slug: Content["url"]) => {
    const resultat = allContents.find((content) => content.url === slug)

    if (resultat) {
      return resultat
    } else {
      throw new Error("Unable to retrieve this content URL")
    }
  }

  console.log("findCode", findCode(slug))

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Star star={STARS.THREE} />
      <Mdx code={findCode(slug).body.code} />
    </main>
  )
}
