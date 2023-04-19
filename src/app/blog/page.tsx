import { Counter } from "@/components/Counter"
import { CustomDiv } from "@/components/CustomDiv"
import { allContents } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"

export default function Home() {
  console.log("allContents[0].title", allContents[0].title)
  console.log("allContents[0].boy", allContents[0].body.code)
  const MDXContent = useMDXComponent(allContents[0].body.code)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MDXContent components={{ Counter, CustomDiv }} />
    </main>
  )
}
