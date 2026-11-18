/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/preserve-manual-memoization */

import { useMDXComponent } from "next-contentlayer2/hooks"
import Link from "next/link"
import { Children, HTMLProps, ReactNode, isValidElement, useMemo } from "react"

import { slugify } from "@/utils/slug"

// The text column: about 70 characters a line at 18px (WCAG 1.4.8 asks for 80 at most).
// `max-w-prose` (65ch) is not enough here: `ch` is the width of "0", wider than an average letter.
const MEASURE = "mx-auto w-full max-w-[37rem] px-2"

function textOf(node: ReactNode): string {
  if (typeof node === "string" || typeof node === "number") return String(node)
  if (Array.isArray(node)) return node.map(textOf).join("")
  if (isValidElement<{ children?: ReactNode }>(node))
    return textOf(node.props.children)
  return ""
}

interface Quote {
  author: string
  quote: string
}

function Quote({ author, quote }: Quote) {
  return (
    <div className={`${MEASURE} my-2 flex flex-col`}>
      <div className="font-script mx-2 my-4 text-base leading-relaxed text-blue-100 italic sm:text-lg">
        {quote}
      </div>
      <div className="font-script mx-2 self-end text-sm text-blue-100 italic underline underline-offset-2 sm:text-base">
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
    <h2
      id={slugify(textOf(children))}
      className={`${MEASURE} mt-14 mb-4 border-t border-slate-700 pt-8 text-3xl font-semibold text-blue-300`}
    >
      {children}
    </h2>
  )
}

// A heading that only names the item defined right below it ("Core:Domain :", "Error:System.")
// loses its trailing punctuation on screen; the text of the post is left as written.
function tidy(children: ReactNode) {
  return typeof children === "string"
    ? children.replace(/\s*[:.]\s*$/, "")
    : children
}

// Followed by a definition block, an h3 becomes the title of that block instead of a section heading.
function h3({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h3
      id={slugify(textOf(children))}
      className={`${MEASURE} mt-10 mb-3 text-2xl font-semibold text-blue-300 has-[+ul>li[data-labelled]]:mt-6 has-[+ul>li[data-labelled]]:mb-0 has-[+ul>li[data-labelled]]:rounded-t-lg has-[+ul>li[data-labelled]]:border-l-2 has-[+ul>li[data-labelled]]:border-blue-300/50 has-[+ul>li[data-labelled]]:bg-slate-800/60 has-[+ul>li[data-labelled]]:px-4 has-[+ul>li[data-labelled]]:pt-4 has-[+ul>li[data-labelled]]:text-lg sm:has-[+ul>li[data-labelled]]:text-xl`}
    >
      {tidy(children)}
    </h3>
  )
}

// The smallest level is a label, not a heading: body size, sitting right on its paragraph.
function h4({ children }: HTMLProps<HTMLHeadingElement>) {
  return (
    <h4
      className={`${MEASURE} mt-6 mb-0 text-base font-semibold text-blue-300 sm:text-lg`}
    >
      {tidy(children)}
    </h4>
  )
}

function p({ children }: HTMLProps<HTMLParagraphElement>) {
  return (
    <p
      className={`${MEASURE} my-2 font-sans text-base text-blue-100 sm:text-lg [h4+&]:mt-0`}
    >
      {children}
    </p>
  )
}

// "**Label** : description" items read as a definition: the label gets its own column
// (its own line on a phone), so the same label can be found again from one block to the next.
function li({ children }: HTMLProps<HTMLLIElement>) {
  const [first, ...rest] = Children.toArray(children).filter(
    (child) => typeof child !== "string" || child.trim() !== "",
  )

  if (isValidElement(first) && first.type === "strong" && rest.length) {
    const label = textOf(first)
      .replace(/\s*:\s*$/, "")
      .trim()
    const [next, ...others] = rest
    const description =
      typeof next === "string"
        ? [next.replace(/^\s*:\s*/, ""), ...others]
        : rest

    return (
      <li
        data-labelled
        className="grid gap-x-4 gap-y-1 font-sans text-base text-blue-100 sm:grid-cols-[9.5rem_1fr] sm:text-lg"
      >
        <strong className="text-blue-300">{label}</strong>
        <span>{description}</span>
      </li>
    )
  }

  return (
    <li className="list-item font-sans text-base text-blue-100 sm:text-lg">
      {children}
    </li>
  )
}

function ul({ children }: HTMLProps<HTMLUListElement>) {
  return (
    <ul
      className={`${MEASURE} my-4 [h3+&]:has-[>li[data-labelled]]:mt-0 [h3+&]:has-[>li[data-labelled]]:rounded-t-none flex list-outside list-disc list-image-[url(/logbook/mdx/chevron-right.svg)] flex-col gap-3 pl-8 has-[>li[data-labelled]]:list-none has-[>li[data-labelled]]:gap-5 has-[>li[data-labelled]]:rounded-lg has-[>li[data-labelled]]:border-l-2 has-[>li[data-labelled]]:border-blue-300/50 has-[>li[data-labelled]]:bg-slate-800/60 has-[>li[data-labelled]]:p-4 [li>&]:my-2 [li>&]:px-0 [li>&]:pl-6`}
    >
      {children}
    </ul>
  )
}

function A({ children, href }: HTMLProps<HTMLAnchorElement>) {
  const hrefMemoized = useMemo(
    () => (url: string) => {
      return { pathname: url }
    },
    [],
  )

  return (
    <Link
      href={hrefMemoized(href || "")}
      className="text-accent-600 visited:text-accent-100 hover:decoration-accent-600 visited:hover:decoration-accent-100 cursor-pointer text-base hover:underline sm:text-lg"
    >
      {children}
    </Link>
  )
}

function blockquote({ children }: HTMLProps<HTMLQuoteElement>) {
  return (
    <blockquote
      className={`${MEASURE} my-4 rounded-lg border-s-4 border-slate-50 bg-slate-800 p-4 text-xl leading-relaxed font-medium italic`}
    >
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
    <div className="my-4 flex flex-row justify-center">
      {/* the picture opens at full size: a diagram's labels are too small to read on a phone */}
      <a
        href={src}
        target="_blank"
        rel="noreferrer"
        title="Open the picture at full size"
        className="relative block h-fit w-fit p-2 sm:p-4"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt}
          className="rounded-md object-contain"
        />
      </a>
    </div>
  )
}

const mdxHTMLComponents = {
  a: A,
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

export interface TableOfContentsEntry {
  title: string
  slug: string
}

function TableOfContents({
  entries,
}: {
  entries: Array<TableOfContentsEntry>
}) {
  return (
    <nav
      aria-label="On this page"
      className={`${MEASURE} my-4 font-sans text-base sm:text-lg`}
    >
      <div className="rounded-lg bg-slate-800/60 p-4">
        <p className="mb-2 text-sm font-bold tracking-wide text-blue-300 uppercase">
          On this page
        </p>
        <ol className="grid list-inside list-decimal gap-x-6 gap-y-1 text-blue-100 sm:grid-cols-2">
          {entries.map(({ title, slug }) => (
            <li key={slug}>
              <a
                href={`#${slug}`}
                className="underline decoration-blue-300/60 underline-offset-4 hover:decoration-blue-300"
              >
                {title}
              </a>
            </li>
          ))}
        </ol>
      </div>
    </nav>
  )
}

const MIN_SECTIONS_FOR_A_TABLE_OF_CONTENTS = 2

// the post's sections: its "## " headings, outside code blocks
function sectionsOf(raw: string): Array<TableOfContentsEntry> {
  return raw
    .replace(/```[\s\S]*?```/g, "")
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) =>
      line
        .replace(/^##\s+/, "")
        .replace(/[*_`]/g, "")
        .trim(),
    )
    .map((title) => ({ title, slug: slugify(title) }))
}

export function Mdx({
  code,
  raw = "",
}: {
  code: string
  // the post's markdown source: its sections are listed under the title
  raw?: string
}) {
  const MDXContent = useMDXComponent(code)
  const components = useMemo(() => {
    const toc = sectionsOf(raw)
    return {
      ...MDX_COMPONENTS,
      h1: (props: HTMLProps<HTMLHeadingElement>) => (
        <>
          {h1(props)}
          {toc.length >= MIN_SECTIONS_FOR_A_TABLE_OF_CONTENTS && (
            <TableOfContents entries={toc} />
          )}
        </>
      ),
    }
  }, [raw])

  return (
    <div className="flex w-full flex-col sm:max-w-3xl [&_figure]:mx-auto [&_figure]:my-4 [&_figure]:w-full [&_figure]:max-w-[37rem] [&_figure]:px-2 [&_pre]:overflow-x-auto [&_pre]:rounded-md [&_pre]:p-4 [&_pre]:text-sm">
      <MDXContent components={components} />
    </div>
  )
}
