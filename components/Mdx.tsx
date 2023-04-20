import { CheckIcon } from "@heroicons/react/24/solid"
import { useMDXComponent } from "next-contentlayer/hooks"
import { HTMLProps } from "react"

interface Quote {
  quote: string
  author: string
}

function Quote({ quote, author }: Quote) {
  return (
    <div className="flex flex-col">
      <div className="mx-2 my-4 text-2xl italic leading-relaxed">{quote}</div>
      <div className="mx-2 self-end text-lg italic underline underline-offset-2">
        &quot;{author}&quot;
      </div>
    </div>
  )
}

function h1({ children }: HTMLProps<HTMLHeadingElement>) {
  return <h1 className="text-center text-8xl text-blue-200">{children}</h1>
}

function h2({ children }: HTMLProps<HTMLHeadingElement>) {
  return <h2 className="text-6xl text-blue-200">{children}</h2>
}

function h3({ children }: HTMLProps<HTMLHeadingElement>) {
  return <h3 className="text-4xl text-blue-200">{children}</h3>
}

function h4({ children }: HTMLProps<HTMLHeadingElement>) {
  return <h4 className="text-3xl text-blue-200">{children}</h4>
}

function p({ children }: HTMLProps<HTMLParagraphElement>) {
  return <p className="text-lg text-blue-100">{children}</p>
}

function li({ children }: HTMLProps<HTMLLIElement>) {
  return (
    <li className="flex flex-row items-center text-lg">
      <CheckIcon className="m-4 h-4 w-4 text-green-200" /> {children}
    </li>
  )
}

const mdxHTMLComponents = {
  h1,
  h2,
  h3,
  h4,
  p,
  li,
}

export function Mdx({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code)

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <MDXContent components={{ Quote, ...mdxHTMLComponents }} />
    </main>
  )
}
