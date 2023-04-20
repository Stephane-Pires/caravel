import { Mdx } from "@/components/Mdx"
import { allContents } from "contentlayer/generated"

export default function Izicredit() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <Mdx code={allContents[1].body.code} />
    </main>
  )
}
