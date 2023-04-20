import { Mdx } from "@/components/Mdx"
import { Star } from "@/components/Star"
import { STARS } from "@/enums/stars"
import { allContents } from "contentlayer/generated"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Star star={STARS.THREE} />
      <Mdx code={allContents[0].body.code} />
    </main>
  )
}
