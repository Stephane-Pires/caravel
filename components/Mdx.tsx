import { CheckIcon, ChevronRightIcon } from "@heroicons/react/24/solid"
import { useMDXComponent } from "next-contentlayer/hooks"
import { HTMLProps } from "react"

interface Quote {
  quote: string
  author: string
}

function Quote({ quote, author }: Quote) {
  return (
    <div className="m-2 flex flex-col">
      <div className="mx-2 my-4 text-2xl italic leading-relaxed">{quote}</div>
      <div className="mx-2 self-end text-lg italic underline underline-offset-2">
        &quot;{author}&quot;
      </div>
    </div>
  )
}

function h1({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h1 className="m-8  text-center font-serif text-4xl text-blue-200">
      {children}
    </h1>
  )
}

function h2({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h2 className="m-6 text-center font-sans text-3xl text-blue-200">
      {children}
    </h2>
  )
}

function h3({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h3 className=" m-4 text-center font-sans text-2xl text-blue-200">
      {children}
    </h3>
  )
}

function h4({ children }: HTMLProps<HTMLHeadingElement>) {
  return <h4 className=" m-2 text-center text-xl text-blue-200">{children}</h4>
}

function p({ children }: HTMLProps<HTMLParagraphElement>) {
  return <p className="m-2 font-sans text-xl text-blue-200">{children}</p>
}

function li({ children }: HTMLProps<HTMLLIElement>) {
  return <li className="list-item font-mono text-lg">{children}</li>
}

function ul({ children }: HTMLProps<HTMLUListElement>) {
  return (
    <ul className="m-2 my-4 flex list-outside list-disc list-image-[url(/logbook/mdx/chevron-right.svg)] flex-col gap-2">
      {children}
    </ul>
  )
}

const mdxHTMLComponents = {
  h1,
  h2,
  h3,
  h4,
  p,
  li,
  ul,
}

export function Mdx({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code)

  return (
    <div className="flex flex-col sm:max-w-3xl">
      <MDXContent components={{ Quote, ...mdxHTMLComponents }} />
    </div>
  )
}
