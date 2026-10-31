import type { ComponentType, ReactNode, SVGProps } from "react"

export type Fact = [ComponentType<SVGProps<SVGSVGElement>>, ReactNode]

// A rendez-vous told with icons instead of sentences: when, how long, where.
// Each fact is an icon and a few words.
export function Facts({
  facts,
  inline = false,
  className = "",
}: {
  facts: Array<Fact>
  // short facts side by side on one line, wrapping when they must
  inline?: boolean
  className?: string
}) {
  const layout = inline
    ? "flex-row flex-wrap gap-x-4 gap-y-1"
    : "flex-col gap-2"
  return (
    <ul className={`flex ${layout} ${className}`}>
      {facts.map(([Icon, text], index) => (
        <li
          // the facts never reorder
          // oxlint-disable-next-line no-array-index-key
          key={index}
          className="flex items-center gap-2"
        >
          <Icon
            aria-hidden="true"
            className="size-5 shrink-0"
          />
          <span className="min-w-0 break-words">{text}</span>
        </li>
      ))}
    </ul>
  )
}
