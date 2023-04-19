import { allContents } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"

export default function Izicredit({ params }: { params: { article: string } }) {
  const MDXContent = useMDXComponent(allContents[1].body.code)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MDXContent />
    </main>
  )
}
