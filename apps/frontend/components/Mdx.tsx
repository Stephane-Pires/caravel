import { useMDXComponent } from "next-contentlayer2/hooks"
import { HTMLProps } from "react"

interface Quote {
  author: string
  quote: string
}

function Quote({ author, quote }: Quote) {
  return (
    <div className="m-2 flex flex-col">
      <div className="font-script mx-2 my-4 text-base italic leading-relaxed text-blue-100 sm:text-lg">
        {quote}
      </div>
      <div className="font-script mx-2 self-end text-sm italic text-blue-100 underline underline-offset-2 sm:text-base">
        &quot;{author}&quot;
      </div>
    </div>
  )
}

function h1({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h1 className="m-8 text-center text-4xl font-bold text-blue-300">
      {children}
    </h1>
  )
}

function h2({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h2 className="m-6 text-center text-3xl font-semibold text-blue-300">
      {children}
    </h2>
  )
}

function h3({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h3 className="m-4 text-center text-2xl font-semibold text-blue-300">
      {children}
    </h3>
  )
}

function h4({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h4 className="font-script m-2 text-center text-xl text-blue-300">
      {children}
    </h4>
  )
}

function p({ children }: HTMLProps<HTMLParagraphElement>) {
  return (
    <p className="m-2 max-w-prose font-sans text-base text-blue-100 sm:text-lg">
      {children}
    </p>
  )
}

function li({ children }: HTMLProps<HTMLLIElement>) {
  return (
    <li className="list-item font-sans text-base text-blue-100 sm:text-lg">
      {children}
    </li>
  )
}

function ul({ children }: HTMLProps<HTMLUListElement>) {
  return (
    <ul className="m-2 my-4 flex list-outside list-none flex-col gap-2 sm:list-disc sm:list-image-[url(/logbook/mdx/chevron-right.svg)]">
      {children}
    </ul>
  )
}

function a({ children, href }: HTMLProps<HTMLAnchorElement>) {
  return (
    <a
      href={href}
      className="text-accent-600 visited:text-accent-100 hover:decoration-accent-600 visited:hover:decoration-accent-100 cursor-pointer text-base hover:underline sm:text-lg"
    >
      {children}
    </a>
  )
}

function blockquote({ children }: HTMLProps<HTMLQuoteElement>) {
  return (
    <blockquote className="my-4 rounded-lg border-s-4 border-slate-50 bg-slate-800 p-4 text-xl font-medium italic leading-relaxed">
      {children}
    </blockquote>
  )
}

function ImageMdx({ alt, src }: HTMLProps<HTMLImageElement>) {
  if (!src) {
    throw new Error("You can not create an image with an undefined src")
  }

  if (!alt) {
    throw new Error(
      "You can not create an image with an undefined alt (due to next-web-vitals rules)",
    )
  }

  return (
    <div className="m-4 flex flex-row justify-center">
      <div className="relative h-fit w-fit p-4">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="rounded-md object-contain"
        />
      </div>
    </div>
  )
}

const mdxHTMLComponents = {
  a,
  h1,
  h2,
  h3,
  h4,
  li,
  p,
  ul,
  blockquote,
}

const MDX_COMPONENTS = { ImageMdx, Quote, ...mdxHTMLComponents }

export function Mdx({ code }: { code: string }) {
  const MDXContent = useMDXComponent(code)
  return (
    <div className="flex flex-col sm:max-w-3xl">
      <MDXContent components={MDX_COMPONENTS} />
    </div>
  )
}
