// eslint-disable jsx-no-new-object-as-prop
/* eslint-disable no-magic-numbers */
/* eslint-disable react-hooks/static-components */
/* eslint-disable react-hooks/preserve-manual-memoization */
import { Article, CURRICULUM_VITAE } from "@/content/curriculum-vitae/english"
import { Fragment, useMemo } from "react"

import { TimelineIcon } from "./TimelineIcon"

const STEP_GAP_WITH_TAG_IN_PX = 90
const STEP_GAP_IN_PX = 60

interface PropsTimelineContainer {
  sectionDom: Map<string, HTMLDivElement>
  article: Article
  withTag: boolean
}

// The performance is terrible, since this component is re-rendering on each scrollbar event
export function TimelineContainer({
  article,
  sectionDom,
  withTag,
}: PropsTimelineContainer) {
  // in the order the page shows them (most recent first), not the order of the CV data:
  // each marker is placed from the height of the section above it
  const ArrayOfSection = Object.values(CURRICULUM_VITAE[article].section)
    .filter((section) => sectionDom.get(section.id))
    .sort(
      (a, b) =>
        (sectionDom.get(a.id)?.offsetTop ?? 0) -
        (sectionDom.get(b.id)?.offsetTop ?? 0),
    )

  // empty on the first render, before the page's sections have registered
  const firstSectionDom = sectionDom.get(ArrayOfSection.at(0)?.id ?? "")
  const lastSectionDom = sectionDom.get(ArrayOfSection.at(-1)?.id ?? "")

  const stepGap = withTag ? STEP_GAP_WITH_TAG_IN_PX : STEP_GAP_IN_PX

  const lastOffsetTop = lastSectionDom?.offsetTop ?? 0
  const lastClientHeight = lastSectionDom?.clientHeight ?? 0
  const firstOffsetTop = firstSectionDom?.offsetTop ?? 0

  const TIMELINE_DOT_STYLE = useMemo(() => {
    return {
      height: lastOffsetTop + lastClientHeight - firstOffsetTop,
      top: firstOffsetTop,
    }
  }, [lastOffsetTop, lastClientHeight, firstOffsetTop])

  if (!sectionDom) {
    return <div>{"CAN NOT SHOW TIMELINE"}</div>
  }

  if (ArrayOfSection.length === 0) return null

  return (
    <div
      className="border-primary-600 absolute z-20 w-px flex-col rounded-lg border-2 border-dashed"
      style={TIMELINE_DOT_STYLE}
    >
      {ArrayOfSection.map((content, index) => {
        const domElementReferenced = sectionDom.get(content.id)

        if (domElementReferenced) {
          // each marker sits the height of the section above it lower (the first at the top)
          const stepPosition =
            index === 0
              ? 0
              : (sectionDom.get(ArrayOfSection[index - 1].id)?.clientHeight ??
                  0) - stepGap

          return (
            <Fragment key={content.id}>
              <div
                className="sticky flex min-w-fit -translate-x-6"
                style={{
                  marginTop: stepPosition,
                  right: 100,
                  top: 100,
                }}
              >
                <div className="flex flex-col">
                  <div className="flex h-full w-40 flex-row items-center justify-center gap-4 bg-slate-900">
                    <TimelineIcon
                      icon={content.icon}
                      link={content.link}
                    />
                    <p className="basis-10/12 font-sans break-normal">
                      {content.label}
                    </p>
                  </div>
                  <div className="flex w-36 translate-x-10 flex-col items-start justify-start bg-slate-900 font-mono break-words text-slate-400">
                    <div className="flex flex-row justify-between">{`from: ${content.duration.start}`}</div>
                    <div className="flex flex-row justify-between">{`to: ${content.duration.end}`}</div>
                    {content.duration?.difference && (
                      <div className="flex flex-row justify-between">{`(${content.duration.difference})`}</div>
                    )}
                  </div>
                </div>
              </div>
            </Fragment>
          )
        }

        return (
          <div
            key={content.id}
            className="text-red-500"
          >
            {"UI ERROR ELEMENT"}
          </div>
        )
      })}
    </div>
  )
}
